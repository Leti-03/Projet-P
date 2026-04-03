import { Resend } from 'resend';
import 'dotenv/config';

// On utilise EMAIL_PASS comme clé API si c'est là que tu as stocké ta clé Resend
const resend = new Resend(process.env.EMAIL_PASS);

export const sendOffreCibleeEmail = async (clientEmail, clientNom, offre) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 15px; overflow: hidden;">
      <div style="background-color: #0070B8; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Une offre exclusive pour vous !</h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff; text-align: center;">
        <p style="font-size: 16px; color: #666;">Bonjour <strong>${clientNom}</strong>,</p>
        <p style="font-size: 16px; color: #666;">Basé sur votre nouveau profil, nous avons sélectionné une solution sur mesure :</p>
        <div style="margin: 30px 0; padding: 25px; border: 2px solid #78BE20; border-radius: 20px; background-color: #f9fff0;">
          <span style="background: #78BE20; color: white; padding: 5px 12px; border-radius: 50px; font-size: 12px; font-weight: bold;">OFFRE CIBLÉE</span>
          <h2 style="color: #333; margin: 15px 0 5px 0;">${offre.nom}</h2>
          <div style="font-size: 42px; font-weight: 800; color: #0070B8; margin: 10px 0;">
            ${offre.prix} DA/mois
          </div>
          <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            🚀 Débit : <strong>${offre.debit_internet || offre.debit}</strong><br>
            ✅ Engagement 12 mois
          </p>
          <a href="http://localhost:3000/catalogue" style="background-color: #0070B8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            Souscrire maintenant
          </a>
        </div>
        <p style="font-size: 12px; color: #999;">Cette offre vous est proposée en exclusivité via votre portail client Algérie Télécom.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
        © 2026 Algérie Télécom - Toujours Proche.
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: clientEmail,
    subject: `🎁 Offre Spéciale : Découvrez le pack ${offre.nom}`,
    html: htmlContent,
  });

  if (error) throw new Error('Erreur envoi email offre : ' + error.message);
};