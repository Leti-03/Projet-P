import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // On cherche le token dans le header "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    // Vérification du token avec la clé secrète (définie dans ton .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ma_cle_secrete_2026');
    
    // On ajoute les infos de l'utilisateur à l'objet "req" pour les contrôleurs
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};