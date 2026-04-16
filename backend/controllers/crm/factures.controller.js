import supabase from '../../config/supabase.js';
import PDFDocument from 'pdfkit';
import { sendEmail } from '../../utils/crm/sendEmail.js';

const genNumeroFacture = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `FAC-${y}${m}-${rand}`;
};

// ─── PDF professionnel ────────────────────────────────────────────────────
const genererPDF = (facture, client, lignes) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 595, H = 842;
    const MARGIN = 48;
    const GREEN = '#006837';
    const LIGHT_GREEN = '#E8F5E9';
    const DARK = '#1A202C';
    const GRAY = '#718096';
    const BORDER = '#E2E8F0';

    // ── Bande verte haut ──────────────────────────────────────────────────
    doc.rect(0, 0, W, 120).fill(GREEN);

    // Logo AT
    doc.fillColor('white').fontSize(28).font('Helvetica-Bold')
      .text('Algérie', MARGIN, 32, { continued: true })
      .fillColor('#A5D6A7').text(' Télécom');
    doc.fillColor('rgba(255,255,255,0.7)').fontSize(9).font('Helvetica')
      .text('Fournisseur de services de télécommunication', MARGIN, 64);
    doc.fillColor('rgba(255,255,255,0.5)').fontSize(8)
      .text('Siège social — Alger, Algérie  |  algerie-telecom.dz', MARGIN, 78);

    // Badge FACTURE à droite
    doc.roundedRect(W - 180, 28, 132, 64, 8).fill('rgba(255,255,255,0.15)');
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold')
      .text('FACTURE', W - 170, 42);
    doc.fontSize(9).font('Helvetica').fillColor('rgba(255,255,255,0.85)')
      .text(facture.numero_facture, W - 170, 66)
      .text(new Date(facture.created_at).toLocaleDateString('fr-DZ'), W - 170, 80);

    // ── Corps ─────────────────────────────────────────────────────────────
    let y = 148;

    // Bloc client + bloc facturation côte à côte
    // Gauche : "Facturé à"
    doc.fillColor(GREEN).fontSize(8).font('Helvetica-Bold')
      .text('FACTURÉ À', MARGIN, y);
    y += 14;
    doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold')
      .text(`${client.prenom || ''} ${client.nom || ''}`, MARGIN, y);
    y += 15;
    doc.fillColor(GRAY).fontSize(9).font('Helvetica');
    if (client.nom_entreprise) { doc.text(client.nom_entreprise, MARGIN, y); y += 13; }
    if (client.email)          { doc.text(client.email, MARGIN, y); y += 13; }
    if (client.telephone)      { doc.text(`Tél : ${client.telephone}`, MARGIN, y); y += 13; }
    if (client.adresse)        { doc.text(client.adresse, MARGIN, y); y += 13; }
    const ville = [client.commune, client.daira, client.wilaya].filter(Boolean).join(', ');
    if (ville)                 { doc.text(ville, MARGIN, y); y += 13; }
    if (client.code_client)    { doc.fillColor(GREEN).text(`Code client : ${client.code_client}`, MARGIN, y); y += 13; }

    // Droite : infos facture
    const rxStart = W / 2 + 20;
    let ry = 148;
    doc.fillColor(GREEN).fontSize(8).font('Helvetica-Bold').text('INFORMATIONS FACTURE', rxStart, ry);
    ry += 14;
    const infoRows = [
      ['Date d\'émission', new Date(facture.created_at).toLocaleDateString('fr-DZ')],
      ['Échéance', facture.date_echeance ? new Date(facture.date_echeance).toLocaleDateString('fr-DZ') : '—'],
      ['Période', facture.periode_debut && facture.periode_fin
        ? `${new Date(facture.periode_debut).toLocaleDateString('fr-DZ')} → ${new Date(facture.periode_fin).toLocaleDateString('fr-DZ')}`
        : '—'],
      ['N° de compte', client.numero_compte_at || '—'],
      ['Catégorie', client.categorie || '—'],
    ];
    infoRows.forEach(([label, val]) => {
      doc.fillColor(GRAY).fontSize(9).font('Helvetica').text(label, rxStart, ry);
      doc.fillColor(DARK).font('Helvetica-Bold').text(val, rxStart + 110, ry);
      ry += 15;
    });

    // ── Séparateur ─────────────────────────────────────────────────────────
    y = Math.max(y, ry) + 24;
    doc.moveTo(MARGIN, y).lineTo(W - MARGIN, y).strokeColor(BORDER).lineWidth(1).stroke();
    y += 20;

    // ── Tableau lignes ─────────────────────────────────────────────────────
    // Header tableau
    doc.rect(MARGIN, y, W - MARGIN * 2, 28).fill(GREEN);
    doc.fillColor('white').fontSize(9).font('Helvetica-Bold')
      .text('DÉSIGNATION', MARGIN + 12, y + 9)
      .text('QTÉ', W - 220, y + 9, { width: 40, align: 'center' })
      .text('P.U HT (DZD)', W - 175, y + 9, { width: 80, align: 'right' })
      .text('MONTANT (DZD)', W - 90, y + 9, { width: 42, align: 'right' });
    y += 28;

    // Lignes
    lignes.forEach((ligne, i) => {
      const rowH = 26;
      if (i % 2 === 0) doc.rect(MARGIN, y, W - MARGIN * 2, rowH).fill('#F7FAFC');
      doc.fillColor(DARK).fontSize(9).font('Helvetica')
        .text(ligne.description, MARGIN + 12, y + 8, { width: W - MARGIN * 2 - 180 })
        .text(String(ligne.quantite), W - 220, y + 8, { width: 40, align: 'center' })
        .text(parseFloat(ligne.prix_unitaire).toFixed(2), W - 175, y + 8, { width: 80, align: 'right' })
        .text(parseFloat(ligne.montant).toFixed(2), W - 90, y + 8, { width: 42, align: 'right' });
      doc.moveTo(MARGIN, y + rowH).lineTo(W - MARGIN, y + rowH).strokeColor(BORDER).lineWidth(0.5).stroke();
      y += rowH;
    });

    // ── Totaux ─────────────────────────────────────────────────────────────
    y += 20;
    const totW = 220, totX = W - MARGIN - totW;

    const drawTotRow = (label, val, bold = false, highlight = false) => {
      if (highlight) {
        doc.rect(totX - 8, y - 5, totW + 8, 30).fill(GREEN);
        doc.fillColor('white').fontSize(11).font('Helvetica-Bold')
          .text(label, totX, y + 2).text(val, totX + totW - 80, y + 2, { width: 80, align: 'right' });
      } else {
        doc.fillColor(bold ? DARK : GRAY).fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, totX, y).text(val, totX + totW - 80, y, { width: 80, align: 'right' });
      }
      y += highlight ? 36 : 18;
    };

    const ht  = parseFloat(facture.montant_ht);
    const ttc = parseFloat(facture.montant_ttc);
    const tva = ttc - ht;

    drawTotRow('Montant HT', `${ht.toFixed(2)} DZD`);
    drawTotRow(`TVA (${facture.tva}%)`, `${tva.toFixed(2)} DZD`);
    doc.moveTo(totX, y - 5).lineTo(W - MARGIN, y - 5).strokeColor(BORDER).lineWidth(1).stroke();
    drawTotRow('TOTAL TTC', `${ttc.toFixed(2)} DZD`, true, true);

    // ── Badge statut ────────────────────────────────────────────────────────
    const statutColors = { impayee: '#F59E0B', payee: GREEN, en_retard: '#EF4444', annulee: '#9CA3AF' };
    const sc = statutColors[facture.statut] || GRAY;
    doc.roundedRect(MARGIN, y - 10, 110, 28, 6).fill(sc);
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
      .text(facture.statut.toUpperCase(), MARGIN + 12, y - 2);

    // ── Pied de page ────────────────────────────────────────────────────────
    doc.rect(0, H - 60, W, 60).fill('#F7FAFC');
    doc.moveTo(0, H - 60).lineTo(W, H - 60).strokeColor(BORDER).lineWidth(1).stroke();
    doc.fillColor(GRAY).fontSize(8).font('Helvetica')
      .text('Algérie Télécom — Document généré automatiquement — Non contractuel sans signature', MARGIN, H - 40, { align: 'center', width: W - MARGIN * 2 })
      .text(`Facture n° ${facture.numero_facture} | Émise le ${new Date(facture.created_at).toLocaleDateString('fr-DZ')}`, MARGIN, H - 26, { align: 'center', width: W - MARGIN * 2 });

    doc.end();
  });
};

// ─── Recherche clients ────────────────────────────────────────────────────
export const searchClients = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const { data, error } = await supabase
      .from('clients')
      .select('id, nom, prenom, email, telephone, adresse, ville, wilaya, commune, daira, code_client, numero_compte_at, nom_entreprise, categorie, actif, statut_compte')
      .or(`nom.ilike.%${q}%,prenom.ilike.%${q}%,email.ilike.%${q}%,telephone.ilike.%${q}%,ville.ilike.%${q}%,wilaya.ilike.%${q}%,code_client.ilike.%${q}%,nom_entreprise.ilike.%${q}%`)
      .eq('actif', true)
      .limit(10);

    if (error) throw error;
    return res.json(data || []);
  } catch (err) {
    console.error('searchClients:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── GET /api/crm/factures ────────────────────────────────────────────────
export const getFactures = async (req, res) => {
  try {
    const { statut, client_id, page = 1, limit = 20 } = req.query;
    let query = supabase
      .from('factures')
      .select(`
        id, numero_facture, montant_ht, tva, montant_ttc,
        periode_debut, periode_fin, date_echeance, statut,
        date_paiement, created_at,
        clients(id, nom, prenom, email, telephone, wilaya, categorie, code_client)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (statut) query = query.eq('statut', statut);
    if (client_id) query = query.eq('client_id', client_id);

    const { data, error, count } = await query;
    if (error) throw error;
    return res.json({ data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('getFactures:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── GET /api/crm/factures/:id ────────────────────────────────────────────
export const getFactureById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('factures')
      .select(`*, clients(*), facture_lignes(*)`)
      .eq('id', id).single();
    if (error || !data) return res.status(404).json({ message: 'Facture introuvable' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── POST /api/crm/factures ───────────────────────────────────────────────
export const createFacture = async (req, res) => {
  try {
    const { client_id, lignes, date_echeance, periode_debut, periode_fin } = req.body;
    if (!client_id || !lignes?.length)
      return res.status(400).json({ message: 'client_id et lignes sont requis' });

    const montant_ht = lignes.reduce((s, l) => s + parseFloat(l.prix_unitaire) * parseFloat(l.quantite), 0);
    const tva = 19;
    const montant_ttc = montant_ht * (1 + tva / 100);

    const { data: facture, error: fErr } = await supabase
      .from('factures')
      .insert({
        client_id,
        numero_facture: genNumeroFacture(),
        montant_ht: parseFloat(montant_ht.toFixed(2)),
        tva, montant_ttc: parseFloat(montant_ttc.toFixed(2)),
        date_echeance: date_echeance || null,
        periode_debut: periode_debut || null,
        periode_fin: periode_fin || null,
        statut: 'impayee',
      })
      .select().single();
    if (fErr) throw fErr;

    await supabase.from('facture_lignes').insert(
      lignes.map(l => ({
        facture_id: facture.id,
        description: l.description,
        quantite: parseFloat(l.quantite),
        prix_unitaire: parseFloat(l.prix_unitaire),
        montant: parseFloat(l.prix_unitaire) * parseFloat(l.quantite),
      }))
    );

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'CREATE', ressource: 'factures',
      ressource_id: facture.id, details: { numero: facture.numero_facture }, ip_address: req.ip,
    });

    return res.status(201).json({ message: 'Facture créée', facture });
  } catch (err) {
    console.error('createFacture:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── PUT /api/crm/factures/:id/statut ────────────────────────────────────
export const updateStatutFacture = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const valides = ['impayee', 'payee', 'en_retard', 'annulee'];
    if (!valides.includes(statut)) return res.status(400).json({ message: 'Statut invalide' });

    const { data, error } = await supabase
      .from('factures')
      .update({ statut, date_paiement: statut === 'payee' ? new Date().toISOString() : null })
      .eq('id', id).select().single();
    if (error) throw error;

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'UPDATE', ressource: 'factures',
      ressource_id: id, details: { statut }, ip_address: req.ip,
    });
    return res.json({ message: `Facture marquée ${statut}`, facture: data });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── GET /api/crm/factures/:id/pdf ────────────────────────────────────────
export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: facture, error } = await supabase
      .from('factures').select('*, clients(*), facture_lignes(*)').eq('id', id).single();
    if (error || !facture) return res.status(404).json({ message: 'Facture introuvable' });

    const pdf = await genererPDF(facture, facture.clients, facture.facture_lignes || []);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture-${facture.numero_facture}.pdf`);
    res.send(pdf);
  } catch (err) {
    console.error('downloadPDF:', err);
    return res.status(500).json({ message: 'Erreur génération PDF' });
  }
};

// ─── POST /api/crm/factures/:id/envoyer ──────────────────────────────────
export const envoyerFacture = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: facture, error } = await supabase
      .from('factures').select('*, clients(*), facture_lignes(*)').eq('id', id).single();
    if (error || !facture) return res.status(404).json({ message: 'Facture introuvable' });

    const pdf = await genererPDF(facture, facture.clients, facture.facture_lignes || []);
    const ht  = parseFloat(facture.montant_ht);
    const ttc = parseFloat(facture.montant_ttc);

    await sendEmail({
      to: facture.clients.email,
      subject: `Votre facture ${facture.numero_facture} — Algérie Télécom`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <div style="background:#006837;padding:28px 32px">
            <div style="color:white;font-size:22px;font-weight:700">Algérie Télécom</div>
            <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px">Fournisseur de services de télécommunication</div>
          </div>
          <div style="padding:32px">
            <p style="margin:0 0 16px;color:#1A202C;font-size:15px">Bonjour <strong>${facture.clients.prenom} ${facture.clients.nom}</strong>,</p>
            <p style="color:#718096;margin:0 0 24px;font-size:14px">Veuillez trouver ci-joint votre facture. Voici un récapitulatif :</p>
            <div style="background:#F7FAFC;border-radius:10px;padding:20px;margin-bottom:24px">
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px"><span style="color:#718096">N° Facture</span><strong style="color:#1A202C">${facture.numero_facture}</strong></div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px"><span style="color:#718096">Montant HT</span><span style="color:#1A202C">${ht.toFixed(2)} DZD</span></div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:13px"><span style="color:#718096">TVA (${facture.tva}%)</span><span style="color:#1A202C">${(ttc-ht).toFixed(2)} DZD</span></div>
              <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-size:15px"><span style="color:#1A202C;font-weight:700">Total TTC</span><strong style="color:#006837;font-size:18px">${ttc.toFixed(2)} DZD</strong></div>
            </div>
            ${facture.date_echeance ? `<p style="background:#FFF8EC;border:1px solid #FCD34D;border-radius:8px;padding:12px 16px;font-size:13px;color:#92400E;margin:0 0 24px">⚠️ Date d'échéance : <strong>${new Date(facture.date_echeance).toLocaleDateString('fr-DZ')}</strong></p>` : ''}
            <p style="color:#9CA3AF;font-size:12px;margin:0">Le PDF de votre facture est en pièce jointe.</p>
          </div>
          <div style="background:#F7FAFC;padding:16px 32px;text-align:center;font-size:11px;color:#9CA3AF;border-top:1px solid #E2E8F0">Algérie Télécom — Document généré automatiquement</div>
        </div>
      `,
      attachments: [{ filename: `facture-${facture.numero_facture}.pdf`, content: pdf, contentType: 'application/pdf' }],
    });

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'UPDATE', ressource: 'factures', ressource_id: id,
      details: { action: 'email_envoye', email: facture.clients.email }, ip_address: req.ip,
    });
    return res.json({ message: `Facture envoyée à ${facture.clients.email}` });
  } catch (err) {
    console.error('envoyerFacture:', err);
    return res.status(500).json({ message: 'Erreur envoi facture' });
  }
};

// ─── GET /api/client/factures/:client_id ─────────────────────────────────
export const getFacturesClient = async (req, res) => {
  try {
    const { client_id } = req.params;
    const { data, error } = await supabase
      .from('factures')
      .select('id, numero_facture, montant_ttc, statut, date_echeance, created_at, facture_lignes(*)')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};