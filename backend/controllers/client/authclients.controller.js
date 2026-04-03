import { supabaseAdmin } from '../../config/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import multer from 'multer';

// ====================== CONFIGURATION NODEMAILER ======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ====================== MULTER (upload en mémoire) ======================
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 Mo
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté. Utilisez JPG, PNG, WEBP ou PDF.'));
  }
});

// ====================== ENVOI EMAIL OTP ======================
const sendOTPEmail = async (email, otp, nom) => {
  const mailOptions = {
    from: `"Algerie Telecom CRM" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Votre code de vérification - Algerie Telecom CRM",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bonjour ${nom},</h2>
        <p>Votre code de vérification est :</p>
        <h1 style="color: #0066cc; letter-spacing: 4px; font-size: 36px;">${otp}</h1>
        <p>Ce code est valide pendant <strong>10 minutes</strong>.</p>
        <br>
        <p>Cordialement,<br><strong>Équipe Algerie Telecom CRM</strong></p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

// ====================== UPLOAD DOCUMENT (Supabase Storage) ======================
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    const ext      = req.file.originalname.split('.').pop();
    const fileName = `documents/${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

    console.log('→ Tentative upload:', fileName, req.file.mimetype, req.file.size); // ← AJOUT

    const { data, error } = await supabaseAdmin  // ← récupérez aussi data
      .storage
      .from('clients-documents')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    console.log('→ Supabase response:', { data, error }); // ← AJOUT

    if (error) throw error;

    const { data: publicData } = supabaseAdmin
      .storage
      .from('clients-documents')
      .getPublicUrl(fileName);

    res.json({
      message: 'Document uploadé avec succès',
      url: publicData.publicUrl,
      path: fileName
    });

  } catch (error) {
    console.error('Upload error:', error); // ← regardez ce log précisément
    res.status(500).json({ error: error.message || "Erreur lors de l'upload" });
  }
};

// ====================== CONNEXION (LOGIN) AVEC JWT ======================
export const loginClient = async (req, res) => {
  console.log("Données reçues du Front:", req.body);

  const identifier = req.body.email || req.body.email_ou_telephone;
  const password   = req.body.password || req.body.mot_de_passe;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifiants et mot de passe requis' });
  }

  try {
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .or(`email.eq.${identifier.toLowerCase().trim()},telephone.eq.${identifier.trim()}`)
      .maybeSingle();

    console.log("Client trouvé ?", client);
    console.log("Erreur Supabase ?", error);

    if (error || !client) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    console.log("Client verified ?", client.verified);
    console.log("Client actif ?", client.actif);

    if (!client.verified) {
      return res.status(401).json({ error: 'Veuillez vérifier votre email avant de vous connecter' });
    }

    if (!client.actif) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    const isMatch = await bcrypt.compare(password, client.mot_de_passe);
    console.log("Password match ?", isMatch);
    console.log("Hash en DB :", client.mot_de_passe);

    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: client.id, role: 'client', email: client.email },
      process.env.JWT_SECRET || 'votre_cle_secrete_2026',
      { expiresIn: '7d' }
    );

    const { mot_de_passe: _, ...clientSafe } = client;

    res.json({
      message: 'Connexion réussie',
      token,
      client: clientSafe
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
};

// ====================== INSCRIPTION CLIENT ======================
export const registerClient = async (req, res) => {
  const {
    nom, prenom, email, telephone,
    mot_de_passe, confirm_mot_de_passe,
    date_naissance, carte_identite_url,
    sexe, num_certificat               // ← nouveaux champs
  } = req.body;

  if (!nom || !prenom || !email || !telephone || !mot_de_passe) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires' });
  }

  if (mot_de_passe !== confirm_mot_de_passe) {
    return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
  }

  try {
    const { data: existing } = await supabaseAdmin
      .from('clients')
      .select('id')
      .or(`email.eq.${email.toLowerCase()},telephone.eq.${telephone}`)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Cet email ou numéro de téléphone est déjà utilisé' });
    }

    const salt           = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .insert({
        nom:                nom.trim(),
        prenom:             prenom.trim(),
        email:              email.toLowerCase().trim(),
        telephone:          telephone.trim(),
        mot_de_passe:       hashedPassword,
        date_naissance:     date_naissance     || null,
        carte_identite_url: carte_identite_url || null,
        sexe:               sexe               || null,  // ← nouveau
        num_certificat:     num_certificat     || null,  // ← nouveau
        verified:           false,
        actif:              true
      })
      .select().single();

    if (error) throw error;

    const otp = crypto.randomInt(100000, 999999).toString();
    await supabaseAdmin.from('client_otp').insert({
      client_id:  client.id,
      email:      client.email,
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });

    await sendOTPEmail(client.email, otp, client.nom);

    res.status(201).json({ message: 'Compte créé. OTP envoyé.', client_id: client.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== VÉRIFICATION OTP ======================
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const { data: otpRecord } = await supabaseAdmin
      .from('client_otp')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp', otp)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!otpRecord) return res.status(400).json({ error: 'Code invalide ou expiré' });

    await supabaseAdmin.from('client_otp').update({ used: true }).eq('id', otpRecord.id);
    await supabaseAdmin.from('clients').update({ verified: true }).eq('id', otpRecord.client_id);

    res.json({ message: 'Compte vérifié avec succès !' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de vérification' });
  }
};

// ====================== MISE À JOUR SEGMENTATION ======================
export const updateClientSegment = async (req, res) => {
  const { id } = req.params;
  const { etudiant, parent, retraite, salarie, entrepreneur, tags_personnalises } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({
        profil_segment: { etudiant, parent, retraite, salarie, entrepreneur },
        tags: Array.isArray(tags_personnalises) ? tags_personnalises : []
      })
      .eq('id', id)
      .select().single();

    if (error) throw error;
    res.json({ message: 'Profil mis à jour', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== RENVOI OTP ======================
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requis' });

  try {
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('id, nom, verified')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!client)          return res.status(404).json({ error: 'Client non trouvé' });
    if (client.verified)  return res.status(400).json({ error: 'Compte déjà vérifié' });

    await supabaseAdmin.from('client_otp').delete().eq('email', email.toLowerCase().trim());

    const otp       = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabaseAdmin.from('client_otp').insert({
      client_id:  client.id,
      email:      email.toLowerCase().trim(),
      otp,
      expires_at: expiresAt.toISOString()
    });

    await sendOTPEmail(email, otp, client.nom);

    res.json({ message: 'Un nouveau code OTP a été envoyé' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du renvoi de l'OTP" });
  }
};