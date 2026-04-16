import supabase from '../../config/supabase.js';

// ─── Helpers ───────────────────────────────────────────────────────────────
const startOf = (unit) => {
  const now = new Date();
  if (unit === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  if (unit === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }
  if (unit === 'year') return new Date(now.getFullYear(), 0, 1).toISOString();
  return now.toISOString();
};

// ─── KPIs principaux ───────────────────────────────────────────────────────
export const getKpis = async (req, res) => {
  try {
    const debutMois = startOf('month');

    const [
      { count: totalClients },
      { count: clientsMois },
      { count: reclamationsOuvertes },
      { count: reclamationsMois },
      { count: interventionsEnCours },
      { count: demandesMois },
      { data: facturesMois },
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('actif', true),
      supabase.from('clients').select('*', { count: 'exact', head: true }).gte('created_at', debutMois),
      supabase.from('reclamations').select('*', { count: 'exact', head: true }).in('statut', ['ouvert', 'en_cours']),
      supabase.from('reclamations').select('*', { count: 'exact', head: true }).gte('created_at', debutMois),
      supabase.from('interventions').select('*', { count: 'exact', head: true }).in('statut', ['planifie', 'en_cours', 'en_route']),
      supabase.from('demandes_service').select('*', { count: 'exact', head: true }).gte('created_at', debutMois),
      supabase.from('factures').select('montant_ttc').eq('statut', 'payee').gte('created_at', debutMois),
    ]);

    const revenuMois = facturesMois?.reduce((s, f) => s + parseFloat(f.montant_ttc || 0), 0) ?? 0;

    return res.json({
      totalClients: totalClients ?? 0,
      clientsMois: clientsMois ?? 0,
      reclamationsOuvertes: reclamationsOuvertes ?? 0,
      reclamationsMois: reclamationsMois ?? 0,
      interventionsEnCours: interventionsEnCours ?? 0,
      demandesMois: demandesMois ?? 0,
      revenuMois: parseFloat(revenuMois.toFixed(2)),
    });
  } catch (error) {
    console.error('getKpis error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── Évolution mensuelle (12 derniers mois) ────────────────────────────────
export const getEvolutionMensuelle = async (req, res) => {
  try {
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString();

    const [
      { data: clients },
      { data: reclamations },
      { data: factures },
    ] = await Promise.all([
      supabase.from('clients').select('created_at').gte('created_at', debut),
      supabase.from('reclamations').select('created_at').gte('created_at', debut),
      supabase.from('factures').select('created_at, montant_ttc').eq('statut', 'payee').gte('created_at', debut),
    ]);

    const mois = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        clients: 0,
        reclamations: 0,
        revenu: 0,
      };
    });

    const byKey = (iso) => iso?.slice(0, 7);

    clients?.forEach((c) => {
      const m = mois.find((x) => x.key === byKey(c.created_at));
      if (m) m.clients++;
    });
    reclamations?.forEach((r) => {
      const m = mois.find((x) => x.key === byKey(r.created_at));
      if (m) m.reclamations++;
    });
    factures?.forEach((f) => {
      const m = mois.find((x) => x.key === byKey(f.created_at));
      if (m) m.revenu += parseFloat(f.montant_ttc || 0);
    });

    return res.json(mois.map((m) => ({ ...m, revenu: parseFloat(m.revenu.toFixed(2)) })));
  } catch (error) {
    console.error('getEvolutionMensuelle error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── Répartition réclamations par statut ───────────────────────────────────
export const getRepartitionReclamations = async (req, res) => {
  try {
    const statuts = ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'];
    const results = await Promise.all(
      statuts.map((s) =>
        supabase.from('reclamations').select('*', { count: 'exact', head: true }).eq('statut', s)
      )
    );
    const data = statuts.map((s, i) => ({ statut: s, count: results[i].count ?? 0 }));
    return res.json(data);
  } catch (error) {
    console.error('getRepartitionReclamations error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── Dernières activités ───────────────────────────────────────────────────
export const getDernieresActivites = async (req, res) => {
  try {
    const { data } = await supabase
      .from('logs_activite')
      .select('id, action, ressource, details, date_action, utilisateurs_internes(nom, prenom)')
      .order('date_action', { ascending: false })
      .limit(15);

    return res.json(data ?? []);
  } catch (error) {
    console.error('getDernieresActivites error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── Alertes critiques ─────────────────────────────────────────────────────
export const getAlertes = async (req, res) => {
  try {
    const [
      { count: reclamUrgentes },
      { count: facturesRetard },
      { count: interventionsUrgentes },
    ] = await Promise.all([
      supabase.from('reclamations').select('*', { count: 'exact', head: true }).eq('priorite', 'urgente').in('statut', ['ouvert', 'en_cours']),
      supabase.from('factures').select('*', { count: 'exact', head: true }).eq('statut', 'en_retard'),
      supabase.from('interventions').select('*', { count: 'exact', head: true }).eq('priorite', 'urgente').in('statut', ['planifie', 'en_cours']),
    ]);

    const alertes = [];
    if (reclamUrgentes > 0) alertes.push({ type: 'danger', message: `${reclamUrgentes} réclamation(s) urgente(s) non traitée(s)`, lien: '/crm/reclamations?priorite=urgente' });
    if (facturesRetard > 0) alertes.push({ type: 'warning', message: `${facturesRetard} facture(s) en retard de paiement`, lien: '/crm/factures?statut=en_retard' });
    if (interventionsUrgentes > 0) alertes.push({ type: 'warning', message: `${interventionsUrgentes} intervention(s) urgente(s) en attente`, lien: '/crm/interventions?priorite=urgente' });
    if (alertes.length === 0) alertes.push({ type: 'success', message: 'Aucune alerte critique en ce moment' });

    return res.json(alertes);
  } catch (error) {
    console.error('getAlertes error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── Performances agents ────────────────────────────────────────────────────
export const getPerformancesAgents = async (req, res) => {
  try {
    const debutMois = startOf('month');

    const { data: agents } = await supabase
      .from('utilisateurs_internes')
      .select(`
        id, nom, prenom,
        reclamations!reclamations_agent_id_fkey(statut, created_at)
      `)
      .eq('statut', 'actif');

    if (!agents) return res.json([]);

    const result = agents.map((a) => {
      const totalMois = a.reclamations?.filter((r) => r.created_at >= debutMois).length ?? 0;
      const resolues = a.reclamations?.filter((r) => r.statut === 'resolu' && r.created_at >= debutMois).length ?? 0;
      return {
        id: a.id,
        nom: `${a.prenom} ${a.nom}`,
        totalMois,
        resolues,
        taux: totalMois > 0 ? Math.round((resolues / totalMois) * 100) : 0,
      };
    }).sort((a, b) => b.resolues - a.resolues).slice(0, 5);

    return res.json(result);
  } catch (error) {
    console.error('getPerformancesAgents error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};