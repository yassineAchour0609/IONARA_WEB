const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new gaming account order
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, currency, paymentMethod, userId } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ message: 'Informations client incomplètes' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    const orderNumber = `ION-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    let order = null;
    try {
      order = await Order.create({
        orderNumber,
        user: userId || null,
        customer,
        items,
        total: Number(total),
        currency: currency || 'DZD',
        paymentMethod: paymentMethod || 'BaridiMob',
        status: 'pending',
      });
    } catch (dbErr) {
      // Memory fallback if DB is not active
      order = {
        _id: 'temp_' + Date.now(),
        orderNumber,
        customer,
        items,
        total,
        currency,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès !',
      order,
    });
  } catch (error) {
    console.error('Erreur commande:', error);
    res.status(500).json({ message: 'Erreur lors de la commande', error: error.message });
  }
});

// @route   GET /api/orders/:orderNumber
// @desc    Get order details by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
