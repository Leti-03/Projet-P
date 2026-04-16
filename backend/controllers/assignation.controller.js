import { supabaseAdmin } from '../config/supabase.js';

// ── Algorithme de score pour choisir le meilleur technicien ──────────────────
// Score = 100
//   - si spécialité correspond au type de problème      : +40
//   - si zone_intervention correspond à la région       : +30
//   - charge actuelle (moins il a de réclamations)      : jusqu'à +20
//   - si disponible                                     : +10 (obligatoire)

const SPECIALITE_MAP = {
  connexion:   ['fibre', 'adsl', 'reseau'],
  facturation: ['facturation', 'commercial'],
  equipement:  ['equipement', 'hardware'],
  service:     ['reseau', 'fibre', 'adsl'],
  autre:       ['reseau', 'fibre', 'adsl', 'equipement'],
};

function calculerScore(tech, reclamation, chargeMap) {
  if (!tech.disponible) return -1; // Pas disponible = exclu

  let score = 0;

  // 1. Spécialité correspond au type de problème (+40)
  const specialitesCompatibles = SPECIALITE_MAP[reclamation.type_probleme] || [];
  if (specialitesCompatibles.includes(tech.specialite?.toLowerCase())) {
    score += 40;
  }

  // 2. Zone d'intervention correspond à la région (+30)
  const region = (reclamation.region || '').toLowerCase();
  const zone   = (tech.zone_intervention || tech.wilaya || '').toLowerCase();
  if (zone && region && (zone.includes(region) || region.includes(zone))) {
    score += 30;
  } else if (tech.wilaya?.toLowerCase() === region) {
    score += 20;
  }

  // 3. Charge actuelle — moins il a de réclamations actives, mieux c'est (+20)
  const charge = chargeMap[tech.id] || 0;
  if      (charge === 0) score += 20;
  else if (charge === 1) score += 15;
  else if (charge === 2) score += 10;
  else if (charge === 3) score += 5;
  // 4+ réclamations actives = 0 points de charge

  return score;
}

// ── POST /api/assignation/auto ────────────────────────────────────────────────
// Assignation automatique intelligente d'une réclamation
export const assignerAuto = async (req, res) => {
  const { reclamation_id } = req.body;
  if (!reclamation_id) return res.status(400).json({ error: 'reclamation_id obligatoire' });

  // 1. Récupérer la réclamation
  const { data: reclamation, error: rErr } = await supabaseAdmin
    .from('reclamations')
    .select('*, clients(nom, prenom, wilaya)')
    .eq('id', reclamation_id)
    .single();

  if (rErr || !reclamation) return res.status(404).json({ error: 'Réclamation non trouvée' });
  if (!['ouvert', 'en_attente'].includes(reclamation.statut)) {
    return res.status(400).json({ error: `Réclamation déjà ${reclamation.statut}` });
  }

  // 2. Récupérer tous les techniciens disponibles
  const { data: techniciens } = await supabaseAdmin
    .from('techniciens')
    .select('*')
    .eq('disponible', true);

  if (!techniciens?.length) {
    return res.status(409).json({ error: 'Aucun technicien disponible en ce moment' });
  }

  // 3. Calculer la charge de chaque technicien (interventions actives)
  const { data: interventionsActives } = await supabaseAdmin
    .from('interventions')
    .select('technicien_id')
    .in('statut', ['planifie', 'en_route', 'en_cours']);

  const chargeMap = {};
  (interventionsActives || []).forEach(i => {
    chargeMap[i.technicien_id] = (chargeMap[i.technicien_id] || 0) + 1;
  });

  // 4. Scorer et trier les techniciens
  const techScores = techniciens
    .map(t => ({ ...t, score: calculerScore(t, reclamation, chargeMap), charge: chargeMap[t.id] || 0 }))
    .filter(t => t.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (!techScores.length) {
    return res.status(409).json({ error: 'Aucun technicien compatible disponible' });
  }

  const meilleur = techScores[0];

  // 5. Créer l'intervention
  const { data: intervention, error: iErr } = await supabaseAdmin
    .from('interventions')
    .insert({
      reclamation_id,
      client_id:     reclamation.client_id,
      technicien_id: meilleur.id,
      type_panne:    reclamation.type_probleme,
      description:   reclamation.description,
      priorite:      reclamation.priorite,
      adresse:       reclamation.adresse_probleme,
      region:        reclamation.region,
      statut:        'planifie',
      date_planifiee: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h par défaut
    })
    .select()
    .single();

  if (iErr) return res.status(500).json({ error: iErr.message });

  // 6. Mettre à jour le statut de la réclamation
  await supabaseAdmin
    .from('reclamations')
    .update({ statut: 'en_cours' })
    .eq('id', reclamation_id);

  // 7. Notifier le technicien
  await supabaseAdmin.from('notifications').insert({
    destinataire_id:   meilleur.id,
    destinataire_type: 'technicien',
    titre:             'Nouvelle intervention assignée',
    message:           `Intervention assignée automatiquement : ${reclamation.titre}`,
    type:              'intervention',
    lien:              `/interventions/${intervention.id}`,
  });

  // 8. Socket.IO
  const io = req.app.get('io');
  io?.to(`tech_${meilleur.id}`).emit('nouvelle_intervention', { intervention });

  res.json({
    message:      'Assignation automatique réussie',
    technicien:   { id: meilleur.id, nom: meilleur.nom, prenom: meilleur.prenom, score: meilleur.score, charge: meilleur.charge },
    intervention,
    alternatives: techScores.slice(1, 4).map(t => ({ id:t.id, nom:t.nom, prenom:t.prenom, score:t.score, charge:t.charge })),
  });
};

// ── POST /api/assignation/manuel ─────────────────────────────────────────────
// Assignation manuelle avec choix du technicien + priorité
export const assignerManuel = async (req, res) => {
  const { reclamation_id, technicien_id, priorite, date_planifiee, notes } = req.body;

  if (!reclamation_id || !technicien_id)
    return res.status(400).json({ error: 'reclamation_id et technicien_id obligatoires' });

  // Vérifications
  const { data: reclamation } = await supabaseAdmin.from('reclamations').select('*').eq('id', reclamation_id).single();
  if (!reclamation) return res.status(404).json({ error: 'Réclamation non trouvée' });

  const { data: tech } = await supabaseAdmin.from('techniciens').select('*').eq('id', technicien_id).single();
  if (!tech) return res.status(404).json({ error: 'Technicien non trouvé' });

  // Mettre à jour la priorité si fournie
  if (priorite) {
    await supabaseAdmin.from('reclamations').update({ priorite }).eq('id', reclamation_id);
  }

  // Créer l'intervention
  const { data: intervention, error: iErr } = await supabaseAdmin
    .from('interventions')
    .insert({
      reclamation_id,
      client_id:     reclamation.client_id,
      technicien_id,
      type_panne:    reclamation.type_probleme,
      description:   reclamation.description,
      priorite:      priorite || reclamation.priorite,
      adresse:       reclamation.adresse_probleme,
      region:        reclamation.region,
      statut:        'planifie',
      date_planifiee: date_planifiee || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      notes_agent:   notes,
    })
    .select()
    .single();

  if (iErr) return res.status(500).json({ error: iErr.message });

  // Mettre à jour statut réclamation
  await supabaseAdmin.from('reclamations').update({ statut: 'en_cours' }).eq('id', reclamation_id);

  // Notifier technicien
  await supabaseAdmin.from('notifications').insert({
    destinataire_id: technicien_id, destinataire_type: 'technicien',
    titre: 'Intervention assignée', message: `Nouvelle intervention : ${reclamation.titre}`,
    type: 'intervention', lien: `/interventions/${intervention.id}`,
  });

  const io = req.app.get('io');
  io?.to(`tech_${technicien_id}`).emit('nouvelle_intervention', { intervention });

  res.json({ message: 'Assignation manuelle réussie', intervention });
};

// ── GET /api/assignation/suggestions/:reclamation_id ─────────────────────────
// Retourne les 5 meilleurs techniciens pour une réclamation (sans assigner)
export const getSuggestions = async (req, res) => {
  const { reclamation_id } = req.params;

  const { data: reclamation } = await supabaseAdmin
    .from('reclamations').select('*').eq('id', reclamation_id).single();
  if (!reclamation) return res.status(404).json({ error: 'Réclamation non trouvée' });

  const { data: techniciens } = await supabaseAdmin.from('techniciens').select('*');

  const { data: interventionsActives } = await supabaseAdmin
    .from('interventions').select('technicien_id').in('statut', ['planifie', 'en_route', 'en_cours']);

  const chargeMap = {};
  (interventionsActives || []).forEach(i => {
    chargeMap[i.technicien_id] = (chargeMap[i.technicien_id] || 0) + 1;
  });

  const suggestions = (techniciens || [])
    .map(t => ({
      id:               t.id,
      nom:              t.nom,
      prenom:           t.prenom,
      specialite:       t.specialite,
      zone_intervention: t.zone_intervention,
      wilaya:           t.wilaya,
      disponible:       t.disponible,
      charge:           chargeMap[t.id] || 0,
      score:            calculerScore(t, reclamation, chargeMap),
      raisons:          buildRaisons(t, reclamation, chargeMap),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({ reclamation_id, suggestions });
};

function buildRaisons(tech, reclamation, chargeMap) {
  const raisons = [];
  const specialitesCompatibles = SPECIALITE_MAP[reclamation.type_probleme] || [];
  if (specialitesCompatibles.includes(tech.specialite?.toLowerCase())) raisons.push('✓ Spécialité compatible');
  const region = (reclamation.region || '').toLowerCase();
  const zone   = (tech.zone_intervention || tech.wilaya || '').toLowerCase();
  if (zone && region && (zone.includes(region) || region.includes(zone))) raisons.push('✓ Zone correspondante');
  const charge = chargeMap[tech.id] || 0;
  if (charge === 0) raisons.push('✓ Aucune charge actuelle');
  else raisons.push(`⚠ ${charge} intervention(s) en cours`);
  if (!tech.disponible) raisons.push('✗ Non disponible');
  return raisons;
}

// ── GET /api/assignation/charge ───────────────────────────────────────────────
// Tableau de bord de charge de tous les techniciens
export const getChargeTechniciens = async (req, res) => {
  const { data: techniciens } = await supabaseAdmin.from('techniciens').select('*').order('nom');

  const { data: interventions } = await supabaseAdmin
    .from('interventions')
    .select('technicien_id, statut, priorite, created_at')
    .in('statut', ['planifie', 'en_route', 'en_cours', 'termine']);

  const stats = (techniciens || []).map(t => {
    const mes = (interventions || []).filter(i => i.technicien_id === t.id);
    return {
      id:               t.id,
      nom:              t.nom,
      prenom:           t.prenom,
      specialite:       t.specialite,
      zone_intervention: t.zone_intervention,
      wilaya:           t.wilaya,
      disponible:       t.disponible,
      charge: {
        total:    mes.length,
        en_cours: mes.filter(i => ['planifie','en_route','en_cours'].includes(i.statut)).length,
        terminees: mes.filter(i => i.statut === 'termine').length,
        urgentes: mes.filter(i => i.priorite === 'urgente' && i.statut !== 'termine').length,
      },
    };
  });

  res.json(stats);
};