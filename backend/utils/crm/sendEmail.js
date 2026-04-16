import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'algtc2026@gmail.com';

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    console.log(`📧 Envoi à : ${to}`);

    const mailOptions = {
      from: `Algérie Télécom CRM <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments: attachments.map(a => ({
        filename: a.filename,
        content: a.content,        // Buffer direct — nodemailer accepte les Buffers
        contentType: a.contentType || 'application/pdf',
      })),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to} | ID: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur envoi email à ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};