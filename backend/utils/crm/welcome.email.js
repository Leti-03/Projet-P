export const welcomeEmail = ({ prenom, nom, email, password, role }) => {
  const subject = 'Bienvenue sur le CRM Algérie Télécom';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #006837; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Algérie Télécom — CRM Interne</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>
        <p>Un compte a été créé pour vous sur le CRM interne d'Algérie Télécom.</p>
        <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Vos informations de connexion :</strong></p>
          <p style="margin: 5px 0;">📧 Email : <strong>${email}</strong></p>
          <p style="margin: 5px 0;">🔑 Mot de passe : <strong style="font-size: 18px; color: #006837; letter-spacing: 2px;">${password}</strong></p>
          <p style="margin: 5px 0;">👤 Rôle assigné : <strong>${role}</strong></p>
        </div>
        <a href="${process.env.CRM_URL || 'http://localhost:3000'}"
           style="display: inline-block; background-color: #006837; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Accéder au CRM
        </a>
      </div>
    </div>
  `;
  return { subject, html };
};