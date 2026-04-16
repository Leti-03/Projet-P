// backend/controllers/client/demandeService.Controller.js
// VERSION MISE À JOUR — joint les données client dans getDemandes et getDemandeById
import { supabaseAdmin } from '../../config/supabase.js';

// POST /api/demandes-service
export const createDemande = async (req, res) => {
  const {
    client_id, type_service, adresse_installation, wilaya, ville, details,
    doc_residence_url, doc_identite_recto_url, doc_identite_verso_url,
    doc_passeport_url, type_identite, convention_acceptee, doc_convention_url
  } = req.body;

  if (!client_id || !type_service) {
    return res.status(400).json({ error: 'client_id et type_service sont obligatoires' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('demandes_service')
      .insert({
        client_id, type_service,
        adresse_installation: adresse_installation || null,
        wilaya: wilaya || null,
        ville:  ville  || null,
        details: details || {},
        statut: 'en_attente',
        doc_residence_url:       doc_residence_url       || null,
        doc_identite_recto_url:  doc_identite_recto_url  || null,
        doc_identite_verso_url:  doc_identite_verso_url  || null,
        doc_passeport_url:       doc_passeport_url       || null,
        type_identite:           type_identite           || null,
        convention_acceptee:     convention_acceptee     || false,
        doc_convention_url:      doc_convention_url      || null,
      })
      .select().single();

    if (error) throw error;

    // Notifier les agents
    const { data: agents } = await supabaseAdmin
      .from('utilisateurs')
      .select('id')
      .eq('role', 'agent')
      .eq('actif', true);

    if (agents?.length) {
      await supabaseAdmin.from('notifications').insert(
        agents.map(a => ({
          destinataire_id:   a.id,
          destinataire_type: 'agent',
          titre:   'Nouvelle demande de service',
          message: `Nouvelle demande : ${type_service}`,
          type:    'demande_service',
          lien:    `/demandes/${data.id}`
        }))
      );
    }

    res.status(201).json({ message: 'Demande soumise avec succès', demande: data });
  } catch (error) {
    console.error('createDemande error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/demandes-service?type_service=xxx&statut=xxx&client_id=xxx&page=1&limit=20
// ★ MODIFIÉ : joint les données client (nom, prenom, email, telephone, wilaya)
export const getDemandes = async (req, res) => {
  const { client_id, type_service, statut, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    // ★ On sélectionne aussi les champs client via la relation FK
    let query = supabaseAdmin
      .from('demandes_service')
      .select(`
        *,
        client:clients(
          id, nom, prenom, email, telephone, wilaya, ville
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (client_id)    query = query.eq('client_id', client_id);
    if (type_service) query = query.eq('type_service', type_service);
    if (statut)       query = query.eq('statut', statut);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data: data || [], total: count, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/demandes-service/:id
// ★ MODIFIÉ : joint les données client
export const getDemandeById = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('demandes_service')
      .select(`
        *,
        client:clients(
          id, nom, prenom, email, telephone, wilaya, ville, adresse, code_postal
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Demande non trouvée' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/demandes-service/:id/statut
export const updateStatut = async (req, res) => {
  const { statut } = req.body;
  const STATUTS = ['en_attente', 'en_cours', 'approuvee', 'rejetee', 'terminee'];
  if (!STATUTS.includes(statut)) {
    return res.status(400).json({ error: `Statut invalide. Valeurs : ${STATUTS.join(', ')}` });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('demandes_service')
      .update({ statut, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};