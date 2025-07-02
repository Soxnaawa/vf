const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'secretkey'); // même clé que dans userController
      req.user = decoded; // on stocke l’utilisateur connecté dans la requête
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
  } else {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }
};

module.exports = verifyToken;
