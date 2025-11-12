const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// 👑 Liste de tous les utilisateurs (admin seulement)
router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
