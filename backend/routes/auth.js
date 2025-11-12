const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// 🔐 LOGIN (admin ou user)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier dans Admin d'abord
    let account = await Admin.findOne({ email });
    let role = 'admin';

    if (!account) {
      account = await User.findOne({ email });
      role = 'user';
    }

    if (!account) return res.status(404).json({ message: 'Compte introuvable' });

    const validPwd = await bcrypt.compare(password, account.password);
    if (!validPwd)
      return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { _id: account._id, name: account.name, email: account.email, role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
