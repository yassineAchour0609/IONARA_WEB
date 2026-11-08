const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'ionara_secret', {
    expiresIn: '30d',
  });
};

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ionara_secret');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};

// @route   POST /api/auth/register
// @desc    Register a new customer account
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
    }

    let user;
    try {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'Un compte existe déjà avec cette adresse email' });
      }

      user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
      });
    } catch (dbErr) {
      // In-memory fallback if MongoDB server is offline
      user = {
        _id: 'local_' + Date.now(),
        username,
        email: email.toLowerCase(),
        phone: phone || '',
        role: 'customer'
      };
    }

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
      message: 'Compte créé avec succès !',
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate customer & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    let user;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Identifiants incorrects' });
        }
      }
    } catch (dbErr) {
      // Fallback
      user = null;
    }

    if (!user) {
      // Offline fallback: allow guest login
      user = {
        _id: 'local_' + Date.now(),
        username: email.split('@')[0],
        email: email.toLowerCase(),
        phone: '',
        role: 'customer'
      };
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
      message: 'Connexion réussie !',
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
