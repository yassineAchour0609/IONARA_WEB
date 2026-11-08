const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['steam', 'preorder', 'nouveautes', 'passes', 'currencies', 'all'],
    default: 'steam',
  },
  priceDZD: { type: Number, required: true },
  oldPriceDZD: { type: Number, default: 0 },
  priceEUR: { type: Number, required: true },
  oldPriceEUR: { type: Number, default: 0 },
  priceUSD: { type: Number, required: true },
  oldPriceUSD: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  tag: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  delivery: { type: String, default: '5 - 15 minutes' },
  guarantee: { type: String, default: 'Garantie 1 An' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  keyGames: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
