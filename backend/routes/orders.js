const router = require('express').Router();
const { randomUUID } = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { quote } = require('../lib/catalog');
const { ApiError, asyncRoute } = require('../lib/errors');

function normalizeTunisiaPhone(raw) {
  if (typeof raw !== 'string') return '';
  const cleaned = raw.replace(/[\s()-]/g, '').replace(/^00216/, '+216');
  if (!/^(?:\+216)?[2459]\d{7}$/.test(cleaned)) return '';
  return cleaned.startsWith('+216') ? cleaned : '+216' + cleaned;
}

router.get('/track', asyncRoute(async (req, res) => {
  const orderNumber = typeof req.query.orderNumber === 'string' ? req.query.orderNumber.trim() : '';
  const phone = normalizeTunisiaPhone(req.query.phone);
  if (!orderNumber || !phone) throw new ApiError(400, 'INVALID_PHONE');
  const order = await Order.findOne({ orderNumber, 'customer.phone': phone });
  if (!order) throw new ApiError(404, 'NOT_FOUND');
  res.json({ order });
}));

router.post('/track/proof', asyncRoute(async (req, res) => {
  const orderNumber = typeof req.body.orderNumber === 'string' ? req.body.orderNumber.trim() : '';
  const phone = normalizeTunisiaPhone(req.body.phone);
  const paymentProof = typeof req.body.paymentProof === 'string' ? req.body.paymentProof.trim().slice(0, 200) : '';
  if (!orderNumber || !phone) throw new ApiError(400, 'INVALID_PHONE');
  if (!paymentProof) throw new ApiError(400, 'INVALID_ORDER');
  const order = await Order.findOneAndUpdate(
    { orderNumber, 'customer.phone': phone },
    { $set: { paymentProof } },
    { new: true }
  );
  if (!order) throw new ApiError(404, 'NOT_FOUND');
  res.json({ order });
}));

router.use(protect);

router.post('/', asyncRoute(async (req, res) => {
  const { customer, items, currency, promoCode, requestId, locale } = req.body;
  if (typeof requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(requestId)) throw new ApiError(400, 'INVALID_ORDER');
  const existing = await Order.findOne({ user: req.user._id, requestId });
  if (existing) return res.json({ order: existing });
  if (!customer || typeof customer.name !== 'string' || customer.name.trim().length < 2 || customer.name.length > 100 || typeof customer.phone !== 'string') throw new ApiError(400, 'INVALID_CUSTOMER');
  const phone = normalizeTunisiaPhone(customer.phone);
  if (!phone) throw new ApiError(400, 'INVALID_PHONE');
  const paymentMethod = typeof req.body.paymentMethod === 'string' ? req.body.paymentMethod.trim().toLowerCase() : 'd17';
  if (!['manual', 'd17', 'flouci', 'wafacash', 'isizitounapayment', 'izi', 'virmentbancaire', 'virement', 'solde_ooredoo', 'solde ooredoo', 'ooredoo', 'edinar', 'sobflous'].includes(paymentMethod)) throw new ApiError(400, 'PAYMENT_UNAVAILABLE');
  const confirmationChannel = ['whatsapp', 'instagram'].includes(req.body.confirmationChannel) ? req.body.confirmationChannel : 'whatsapp';
  const notes = typeof req.body.notes === 'string' ? req.body.notes.trim().slice(0, 300) : '';
  const playerAccount = typeof req.body.playerAccount === 'string' ? req.body.playerAccount.trim().slice(0, 160) : '';
  const paymentProof = typeof req.body.paymentProof === 'string' ? req.body.paymentProof.trim().slice(0, 200) : '';
  const isGift = Boolean(req.body.isGift);
  const giftRecipientName = isGift && typeof req.body.giftRecipientName === 'string' ? req.body.giftRecipientName.trim().slice(0, 100) : '';
  const giftMessage = isGift && typeof req.body.giftMessage === 'string' ? req.body.giftMessage.trim().slice(0, 240) : '';
  const pricing = quote(items, currency, promoCode);
  const values = {
    ...pricing,
    orderNumber: 'ION-' + randomUUID(),
    user: req.user._id,
    requestId,
    customer: { name: customer.name.trim(), email: req.user.email, phone },
    paymentMethod,
    confirmationChannel,
    notes,
    playerAccount,
    paymentProof,
    isGift,
    giftRecipientName,
    giftMessage,
    locale: ['fr', 'en', 'ar'].includes(locale) ? locale : 'fr',
  };
  let order;
  try { order = await Order.create(values); }
  catch (error) {
    if (error.code !== 11000) throw error;
    order = await Order.findOne({ user: req.user._id, requestId });
    if (!order) throw error;
  }
  res.status(201).json({ order });
}));

router.get('/', asyncRoute(async (req, res) => {
  const filter = req.user.role === 'admin' && req.query.scope === 'all' ? {} : { user: req.user._id };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ orders });
}));

router.get('/:orderNumber', asyncRoute(async (req, res) => {
  const filter = req.user.role === 'admin' ? { orderNumber: req.params.orderNumber } : { orderNumber: req.params.orderNumber, user: req.user._id };
  const order = await Order.findOne(filter);
  if (!order) throw new ApiError(404, 'NOT_FOUND');
  res.json({ order });
}));

router.patch('/:orderNumber/proof', asyncRoute(async (req, res) => {
  const paymentProof = typeof req.body.paymentProof === 'string' ? req.body.paymentProof.trim().slice(0, 200) : '';
  if (!paymentProof) throw new ApiError(400, 'INVALID_ORDER');
  const filter = req.user.role === 'admin' ? { orderNumber: req.params.orderNumber } : { orderNumber: req.params.orderNumber, user: req.user._id };
  const order = await Order.findOneAndUpdate(filter, { $set: { paymentProof } }, { new: true });
  if (!order) throw new ApiError(404, 'NOT_FOUND');
  res.json({ order });
}));

router.patch('/:orderNumber', asyncRoute(async (req, res) => {
  if (req.user.role !== 'admin') throw new ApiError(403, 'FORBIDDEN');
  const existing = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!existing) throw new ApiError(404, 'NOT_FOUND');
  const updates = {};
  if (req.body.status !== undefined) {
    if (!['pending_confirmation', 'processing', 'delivered', 'cancelled'].includes(req.body.status)) throw new ApiError(400, 'INVALID_ORDER');
    updates.status = req.body.status;
  }
  if (req.body.paymentStatus !== undefined) {
    if (!['unpaid', 'paid'].includes(req.body.paymentStatus)) throw new ApiError(400, 'INVALID_ORDER');
    updates.paymentStatus = req.body.paymentStatus;
  }
  if (typeof req.body.paymentProof === 'string') {
    updates.paymentProof = req.body.paymentProof.trim().slice(0, 200);
  }
  const willBeConfirmed = (updates.paymentStatus === 'paid' || existing.paymentStatus === 'paid') || (updates.status === 'delivered' || existing.status === 'delivered');
  if (willBeConfirmed && (!existing.pointsAwarded || existing.pointsAwarded === 0)) {
    const earnedPoints = Math.max(10, Math.round(existing.total || 10));
    updates.pointsAwarded = earnedPoints;
    await User.updateOne({ _id: existing.user }, { $inc: { loyaltyPoints: earnedPoints } });
  }
  const order = await Order.findOneAndUpdate({ orderNumber: req.params.orderNumber }, { $set: updates }, { new: true });
  res.json({ order });
}));

module.exports = router;
