const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: String, required: true },
  customer: { name: { type: String, required: true }, email: { type: String, required: true }, phone: { type: String, required: true } },
  items: [{ productId: String, title: String, platform: String, price: Number, quantity: Number }],
  currency: { type: String, enum: ['TND', 'EUR', 'USD'], required: true },
  subtotal: Number, discount: Number, total: Number, promoCode: String,
  paymentMethod: { type: String, enum: ['manual', 'd17', 'flouci', 'wafacash', 'isizitounapayment', 'izi', 'virmentbancaire', 'virement', 'solde_ooredoo', 'solde ooredoo', 'ooredoo', 'edinar', 'sobflous'], default: 'd17' },
  confirmationChannel: { type: String, enum: ['whatsapp', 'instagram'], default: 'whatsapp' },
  notes: { type: String, maxlength: 300, default: '' },
  playerAccount: { type: String, maxlength: 160, default: '' },
  paymentProof: { type: String, maxlength: 200, default: '' },
  isGift: { type: Boolean, default: false },
  giftRecipientName: { type: String, maxlength: 100, default: '' },
  giftMessage: { type: String, maxlength: 240, default: '' },
  pointsAwarded: { type: Number, default: 0 },
  status: { type: String, enum: ['pending_confirmation', 'processing', 'delivered', 'cancelled'], default: 'pending_confirmation' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  locale: { type: String, enum: ['fr', 'en', 'ar'], default: 'fr' },
}, { timestamps: true });
schema.index({ user: 1, requestId: 1 }, { unique: true });
module.exports = mongoose.model('Order', schema);
