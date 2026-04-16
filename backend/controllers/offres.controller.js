import { supabaseAdmin } from '../config/supabase.js';
// 1. CORRECTION : Ajout du 'l' manquant à Email et vérification du chemin
import { sendOffreCibleeEmail } from '../utils/emailService.js'; 

// Récupérer toutes les offres (pour le CRM)
export const getOffres = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('offres')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle offre
export const createOffre = async (req, res) => {
  try {
    const { nom, prix, debit, type_offre, cible_status } = req.body;

    // 1. Insertion de l'offre
    const { data: nouvelleOffre, error } = await supabaseAdmin
      .from('offres')
      .insert([{ 
        nom, 
        prix: parseFloat(prix), 
        debit_internet: debit, 
        type_offre: type_offre || 'tous',
        cible_status: cible_status || [],
        actif: true 
      }])
      .select()
      .single();

    if (error) throw error;

    // 2. LOGIQUE D'ENVOI D'EMAIL
    if (cible_status && cible_status.length > 0) {
      const { data: clients, error: errClients } = await supabaseAdmin
        .from('clients')
        .select('id, email, prenom, profil_segment');

      if (!errClients && clients) {
        const clientsCibles = clients.filter(client => {
          const segment = client.profil_segment || {};
          return cible_status.some(tag => segment[tag.toLowerCase()] === true);
        });

        console.log(`🎯 Offre créée. Envoi d'emails à ${clientsCibles.length} clients.`);

        // 2. CORRECTION : Appel du bon nom de fonction 'sendOffreCibleeEmail'
        const envois = clientsCibles.map(client => 
          sendOffreCibleeEmail(client.email, client.prenom, nouvelleOffre)
        );

        await Promise.allSettled(envois);
      }
    }

    res.status(201).json(nouvelleOffre);
  } catch (err) {
    console.error("Erreur Backend createOffre:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/offres/client/:clientId
export const getOffresPourClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const { data: client, error: clientErr } = await supabaseAdmin
      .from('clients')
      .select('categorie, profil_segment')
      .eq('id', clientId)
      .single();

    if (clientErr || !client) return res.status(404).json({ error: "Client non trouvé" });

    const { data: offres, error: offresErr } = await supabaseAdmin
      .from('offres')
      .select('*')
      .eq('actif', true);

    if (offresErr) throw offresErr;

    const offresFiltrees = offres.filter(offre => {
      const matchCategorie = (offre.type_offre === 'tous' || offre.type_offre === client.categorie);
      if (!matchCategorie) return false;

      if (!offre.cible_status || offre.cible_status.length === 0) return true;

      const clientSegment = client.profil_segment || {};

      const matchStatus = offre.cible_status.some(tag => {
        const normalizedTag = tag.toLowerCase().trim();
        return clientSegment[normalizedTag] === true;
      });

      return matchStatus;
    });
    
    res.json(offresFiltrees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};