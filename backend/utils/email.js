import Mailjet from 'node-mailjet';

// ====================== CONFIGURATION MAILJET ======================
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

// ====================== ENVOI EMAIL OTP ======================
export const sendOTPEmail = async (email, otp, nom) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_FROM || 'no-reply@algerie-telecom.dz',
          Name: 'Algerie Telecom CRM'
        },
        To: [
          {
            Email: email,
            Name: nom
          }
        ],
        Subject: 'Votre code de vérification - Algerie Telecom CRM',
        HTMLPart: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Bonjour ${nom},</h2>
            <p>Votre code de vérification est :</p>
            <h1 style="color: #0066cc; letter-spacing: 4px; font-size: 36px;">${otp}</h1>
            <p>Ce code est valide pendant <strong>10 minutes</strong>.</p>
            <br>
            <p>Cordialement,<br><strong>Équipe Algerie Telecom CRM</strong></p>
          </div>
        `
      }
    ]
  });

  const result = await request;
  return result.body;
};