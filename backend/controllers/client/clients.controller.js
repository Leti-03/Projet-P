import { supabaseAdmin } from '../../config/supabase.js';
import { sendOffreCibleeEmail } from '../../utils/emailService.js';

// ── Tous les champs éditables du client ──────────────────────────────────────
const CHAMPS_CLIENT = [
  // Identité de base
  'nom', 'prenom', 'email', 'telephone', 'sexe',
  // Identité étendue
  'titre', 'nom_jeune_fille', 'date_naissance', 'lieu_naissance',
  'nationalite', 'occupation', 'langue_client',
  // Compte
  'type_compte', 'statut_compte', 'categorie', 'qualite',
  'blackliste', 'num_certificat', 'type_certificat', 'date_delivrance',
  'compte_defaut', 'code_client',
  // Adresse
  'pays', 'wilaya', 'daira', 'ville', 'commune', 'adresse',
  'num_maison', 'bloc', 'code_postal', 'boite_postale',
  // Contact / mandataire
  'contact_principal', 'poste_contact',
  // Entreprise
  'nom_entreprise', 'siret',
];

// GET /api/clients
export const getClients = async (req, res) => {
  const { search, profil, wilaya, statut_compte, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabaseAdmin
    .from('clients')
    .select('id, nom, prenom, email, telephone, ville, wilaya, profil_segment, categorie, statut_compte, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (profil)        query = query.eq('profil_segment', profil);
  if (wilaya)        query = query.eq('wilaya', wilaya);
  if (statut_compte) query = query.eq('statut_compte', statut_compte);
  if (search)        query = query.or(
    `nom.ilike.%${search}%,prenom.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%,num_certificat.ilike.%${search}%`
  );

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
};

// GET /api/clients/:id
export const getClientById = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('clients').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Client non trouvé' });

  const { data: reclamations } = await supabaseAdmin
    .from('reclamations')
    .select('id, titre, statut, priorite, type_probleme, created_at')
    .eq('client_id', req.params.id)
    .order('created_at', { ascending: false });

  const { data: abonnement } = await supabaseAdmin
    .from('abonnements')
    .select('*, offres(nom, prix, type)')
    .eq('client_id', req.params.id).eq('statut', 'actif').maybeSingle();

  const { data: factures } = await supabaseAdmin
    .from('factures')
    .select('id, numero_facture, montant_ttc, statut, date_echeance, date_paiement')
    .eq('client_id', req.params.id)
    .order('created_at', { ascending: false }).limit(5);

  const total    = reclamations?.length || 0;
  const traitees = reclamations?.filter(r => ['resolu','ferme'].includes(r.statut)).length || 0;

  res.json({
    client: data, abonnement, factures,
    historique: { total_reclamations: total, reclamations_traitees: traitees, reclamations_en_cours: total - traitees },
    reclamations,
  });
};

// GET /api/clients/:id/detail  ← utilisé par ClientDetail.jsx
export const getClientDetail = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Toutes les infos du client (SELECT * → récupère toutes les colonnes)
    const { data: info, error: clientError } = await supabaseAdmin
      .from('clients').select('*').eq('id', id).single();

    if (clientError || !info)
      return res.status(404).json({ error: 'Client non trouvé' });

    // 2. Comptes / abonnements
    const { data: comptes } = await supabaseAdmin
      .from('abonnements')
      .select('*, offres(nom, prix, type)')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // 3. Abonnés actifs
    const { data: abonnes } = await supabaseAdmin
      .from('abonnements')
      .select('*, offres(nom, prix, type)')
      .eq('client_id', id).eq('statut', 'actif');

    // 4. Factures
    const { data: factures } = await supabaseAdmin
      .from('factures')
      .select('id, numero_facture, montant_ttc, statut, date_echeance, date_paiement, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // 5. Réclamations
    const { data: reclamations } = await supabaseAdmin
      .from('reclamations')
      .select('id, titre, statut, priorite, type_probleme, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    const total    = reclamations?.length || 0;
    const traitees = reclamations?.filter(r => ['resolu','ferme'].includes(r.statut)).length || 0;

    res.json({
      info,
      comptes:   comptes   || [],
      abonnes:   abonnes   || [],
      facturation: {
        factures:     factures     || [],
        reclamations: reclamations || [],
        stats: {
          total_reclamations:      total,
          reclamations_traitees:   traitees,
          reclamations_en_cours:   total - traitees,
        },
      },
    });
  } catch (err) {
    console.error('Erreur getClientDetail:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clients/:id  ← utilisé par TabClient.jsx
export const updateClient = async (req, res) => {
  const updates = {};
  CHAMPS_CLIENT.forEach(c => {
    if (req.body[c] !== undefined) updates[c] = req.body[c];
  });

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ error: 'Aucun champ valide fourni' });

  const { data, error } = await supabaseAdmin
    .from('clients').update(updates).eq('id', req.params.id).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /api/clients
export const addClient = async (req, res) => {
  try {
    const payload = {};
    CHAMPS_CLIENT.forEach(c => {
      if (req.body[c] !== undefined) {
        // ← convertir '' en null pour éviter les erreurs de type
        payload[c] = req.body[c] === '' ? null : req.body[c];
      }
    });
    payload.actif = true;
    if (!payload.statut_compte) payload.statut_compte = 'actif';
    if (!payload.categorie)     payload.categorie     = 'grand_public';

    const { data, error } = await supabaseAdmin
      .from('clients').insert([payload]).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Erreur addClient:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
  const { error } = await supabaseAdmin.from('clients').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Client supprimé' });
};

// GET /api/clients/:id/offres
export const getOffresClient = async (req, res) => {
  const { data: client } = await supabaseAdmin
    .from('clients').select('profil_segment, utilisation_internet').eq('id', req.params.id).single();
  if (!client) return res.status(404).json({ error: 'Client non trouvé' });

  const { data } = await supabaseAdmin
    .from('offres').select('*').eq('actif', true).order('prix', { ascending: true });

  res.json({ profil: client.profil_segment, offres_recommandees: data || [] });
};

// PUT /api/clients/:id/segment
export const updateSegmentation = async (req, res) => {
  const { id } = req.params;
  const { profil_segment } = req.body;
  try {
    const { data: client, error } = await supabaseAdmin
      .from('clients').update({ profil_segment }).eq('id', id).select().single();
    if (error) throw error;

    const { data: offres } = await supabaseAdmin
      .from('offres').select('*').eq('actif', true);

    const offreGagnante = offres?.find(o =>
      o.cible_status?.some(tag => profil_segment[tag.toLowerCase()] === true)
    );

    if (offreGagnante) {
      await sendOffreCibleeEmail(client.email, client.prenom, offreGagnante);
    }

    res.json({ message: 'Profil mis à jour', data: client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};