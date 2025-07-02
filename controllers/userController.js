const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = async (req, res) => {
  const { nom, email, motDePasse } = req.body;
  try {
    const hash = await bcrypt.hash(motDePasse, 10);
    const user = new User({ nom, email, motDePasse: hash });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1d' });

    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
