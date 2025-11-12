const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// 🧍 Récupérer le profil de l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.account);
});

// ✏️ Modifier son profil
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
