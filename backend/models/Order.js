const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      platform: { type: String },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'DZD',
  },
  paymentMethod: {
    type: String,
    enum: ['BaridiMob', 'CCP', 'Carte Bancaire', 'PayPal', 'Binance / USDT', 'WhatsApp Direct'],
    default: 'BaridiMob',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveredCredentials: {
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    originalEmail: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
