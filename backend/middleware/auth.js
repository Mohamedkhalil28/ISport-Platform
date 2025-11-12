const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === 'admin') {
      req.account = await Admin.findById(payload.id).select('-password');
    } else {
      req.account = await User.findById(payload.id).select('-password');
    }
    req.role = payload.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.role !== 'admin')
    return res.status(403).json({ message: 'Accès réservé aux admins' });
  next();
};

module.exports = { authMiddleware, requireAdmin };
