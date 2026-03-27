// controllers/authclients.controller.js
import { supabaseAdmin } from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configuration Nodemailer (Email)
const transporter = nodemailer.createTransport({
  service: 'gmail',   // Change si tu utilises Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,      // ex: tonemail@gmail.com
    pass: process.env.EMAIL_PASS       // Mot de passe d'application Gmail
  }
});

// Fonction pour envoyer l'OTP par email
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
        <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
        <br>
        <p>Cordialement,<br><strong>Équipe Algerie Telecom CRM</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email OTP envoyé à : ${email} | Code : ${otp}`);
};

// ====================== INSCRIPTION CLIENT ======================
export const registerClient = async (req, res) => {
  const { nom, prenom, email, telephone, mot_de_passe, confirm_mot_de_passe, date_naissance, carte_identite_url } = req.body;

  if (!nom || !prenom || !email || !telephone || !mot_de_passe || !confirm_mot_de_passe) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
  }

  if (mot_de_passe !== confirm_mot_de_passe) {
    return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
  }

  if (mot_de_passe.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
  }

  try {
    // Vérifier si le client existe déjà
    const { data: existing } = await supabaseAdmin
      .from('clients')
      .select('id')
      .or(`email.eq.${email},telephone.eq.${telephone}`)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Un compte avec cet email ou ce numéro existe déjà' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer le client
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .insert({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.toLowerCase().trim(),
        telephone: telephone.trim(),
        mot_de_passe: hashedPassword,
        date_naissance,
        carte_identite_url,
        verified: false,
        actif: true,
        profil_segment: {}
      })
      .select('id, nom, prenom, email')
      .single();

    if (error) throw error;

    // Générer OTP 6 chiffres
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Sauvegarder l'OTP
    await supabaseAdmin.from('client_otp').insert({
      client_id: client.id,
      email: client.email,
      otp,
      expires_at: expiresAt.toISOString()
    });

    // Envoyer l'email
    await sendOTPEmail(client.email, otp, client.nom);

    res.status(201).json({
      message: 'Compte créé avec succès. Un code OTP a été envoyé sur votre email.',
      client_id: client.id,
      email: client.email
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
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
      .eq('email', email.toLowerCase())
      .single();

    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    if (client.verified) return res.status(400).json({ error: 'Compte déjà vérifié' });

    // Supprimer anciens OTP non utilisés
    await supabaseAdmin
      .from('client_otp')
      .delete()
      .eq('email', email.toLowerCase())
      .eq('used', false);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabaseAdmin.from('client_otp').insert({
      client_id: client.id,
      email: email.toLowerCase(),
      otp,
      expires_at: expiresAt.toISOString()
    });

    await sendOTPEmail(email, otp, client.nom);

    res.json({ message: 'Un nouveau code OTP a été envoyé sur votre email' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du renvoi du code OTP' });
  }
};

// ====================== VÉRIFICATION OTP ======================
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email et code OTP sont requis' });
  }

  try {
    const { data: otpRecord } = await supabaseAdmin
      .from('client_otp')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp', otp)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!otpRecord) {
      return res.status(400).json({ error: 'Code OTP invalide ou expiré' });
    }

    // Marquer l'OTP comme utilisé
    await supabaseAdmin
      .from('client_otp')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // Valider le client
    await supabaseAdmin
      .from('clients')
      .update({ verified: true })
      .eq('id', otpRecord.client_id);

    res.json({ 
      message: 'Compte vérifié avec succès !',
      client_id: otpRecord.client_id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la vérification OTP' });
  }
};

// ====================== CONNEXION (LOGIN) ======================
export const loginClient = async (req, res) => {
  const { email_ou_telephone, mot_de_passe } = req.body;

  if (!email_ou_telephone || !mot_de_passe) {
    return res.status(400).json({ error: 'Email ou téléphone et mot de passe sont requis' });
  }

  try {
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('*')
      .or(`email.eq.${email_ou_telephone},telephone.eq.${email_ou_telephone}`)
      .single();

    if (!client) return res.status(401).json({ error: 'Identifiants incorrects' });

    if (!client.verified) {
      return res.status(401).json({ error: 'Veuillez vérifier votre email avant de vous connecter' });
    }

    if (!client.actif) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Supprimer le mot de passe de la réponse
    const { mot_de_passe: _, ...clientSafe } = client;

    res.json({
      message: 'Connexion réussie',
      client: clientSafe
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ====================== MISE À JOUR SEGMENTATION ======================
// ====================== MISE À JOUR SEGMENTATION (améliorée) ======================
export const updateClientSegment = async (req, res) => {
  const { id } = req.params;
  const { 
    etudiant, parent, retraite, salarie, entrepreneur, 
    tags_personnalises   // ← Nouveau : tableau de strings ajouté par l'utilisateur
  } = req.body;

  // Construction du profil structuré (pour les catégories prédéfinies)
  const profilSegment = {
    etudiant: !!etudiant,
    parent: !!parent,
    retraite: !!retraite,
    salarie: !!salarie,
    entrepreneur: !!entrepreneur
  };

  // Nettoyage et normalisation des tags personnalisés
  let tags = [];
  if (Array.isArray(tags_personnalises)) {
    tags = tags_personnalises
      .map(tag => tag.toString().trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 50); // limite de longueur
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({ 
        profil_segment: profilSegment,
        tags: tags
      })
      .eq('id', id)
      .select('id, nom, prenom, profil_segment, tags')
      .single();

    if (error) throw error;

    res.json({
      message: 'Profil de segmentation mis à jour avec succès',
      profil_segment: data.profil_segment,
      tags: data.tags
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};