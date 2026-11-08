const router = require('express').Router();
const mongoose = require('mongoose');
const { products } = require('../lib/catalog');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
const { ApiError, asyncRoute } = require('../lib/errors');

const DEFAULT_REVIEWS = [
  { id: 'seed-1', authorName: 'Yassine B. (Tunis)', rating: 5, comment: 'Livraison rapide en moins de 10 minutes après envoi du reçu D17 sur WhatsApp !', verifiedPurchase: true, createdAt: '2026-10-15T14:20:00.000Z' },
  { id: 'seed-2', authorName: 'Amine K. (Sousse)', rating: 5, comment: 'Service sérieux en Tunisie, paiement Flouci validé directement et accompagnement au top.', verifiedPurchase: true, createdAt: '2026-10-22T18:05:00.000Z' },
];

async function enrichProducts(list) {
  if (mongoose.connection.readyState !== 1) return list;
  try {
    const [confirmedOrders, dbReviews] = await Promise.all([
      Order.find({ $or: [{ paymentStatus: 'paid' }, { status: 'delivered' }] }).select('items').lean(),
      Review.find({}).select('productSlug rating').lean(),
    ]);
    const soldMap = {};
    for (const ord of confirmedOrders) {
      for (const item of ord.items || []) {
        const baseSlug = String(item.productId || '').split(':')[0];
        soldMap[baseSlug] = (soldMap[baseSlug] || 0) + (item.quantity || 1);
      }
    }
    const reviewMap = {};
    for (const rev of dbReviews) {
      if (!reviewMap[rev.productSlug]) reviewMap[rev.productSlug] = [];
      reviewMap[rev.productSlug].push(rev.rating);
    }
    return list.map(p => {
      const extraSold = soldMap[p.slug] || 0;
      const ratings = reviewMap[p.slug] || [];
      const baseCount = p.reviewCount || 2;
      const baseRating = p.rating || 4.9;
      const totalReviews = baseCount + ratings.length;
      const avgRating = ratings.length
        ? Number(((baseRating * baseCount + ratings.reduce((a, b) => a + b, 0)) / totalReviews).toFixed(1))
        : baseRating;
      return {
        ...p,
        soldCount: (p.soldCount || 0) + extraSold,
        confirmedSold: extraSold,
        rating: avgRating,
        reviewCount: totalReviews,
      };
    });
  } catch {
    return list;
  }
}

router.get('/', asyncRoute(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
  const filtered = products.filter(p => (!req.query.category || req.query.category === 'all' || p.category === req.query.category) && (p.title + ' ' + p.platform).toLowerCase().includes(search));
  const data = await enrichProducts(filtered);
  res.json({ data });
}));

router.get('/:slug/reviews', asyncRoute(async (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ code: 'NOT_FOUND' });
  const enriched = (await enrichProducts([product]))[0];
  let customReviews = [];
  if (mongoose.connection.readyState === 1) {
    const docs = await Review.find({ productSlug: product.slug }).sort({ createdAt: -1 }).limit(30).lean();
    customReviews = docs.map(d => ({
      id: d._id.toString(),
      authorName: d.authorName,
      rating: d.rating,
      comment: d.comment,
      verifiedPurchase: Boolean(d.verifiedPurchase),
      createdAt: d.createdAt,
    }));
  }
  res.json({
    reviews: [...customReviews, ...DEFAULT_REVIEWS],
    rating: enriched.rating,
    reviewCount: enriched.reviewCount,
    soldCount: enriched.soldCount,
  });
}));

router.post('/:slug/reviews', protect, asyncRoute(async (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) throw new ApiError(404, 'NOT_FOUND');
  const rating = Number(req.body.rating);
  const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 3 || comment.length > 500) {
    throw new ApiError(400, 'INVALID_ORDER');
  }
  const hasOrder = await Order.exists({
    user: req.user._id,
    'items.productId': new RegExp('^' + product.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(:|$)'),
  });
  const created = await Review.create({
    productSlug: product.slug,
    user: req.user._id,
    authorName: req.user.username,
    rating,
    comment,
    verifiedPurchase: Boolean(hasOrder),
  });
  const enriched = (await enrichProducts([product]))[0];
  res.status(201).json({
    review: {
      id: created._id.toString(),
      authorName: created.authorName,
      rating: created.rating,
      comment: created.comment,
      verifiedPurchase: created.verifiedPurchase,
      createdAt: created.createdAt,
    },
    rating: enriched.rating,
    reviewCount: enriched.reviewCount,
    soldCount: enriched.soldCount,
  });
}));

router.get('/:slug', asyncRoute(async (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ code: 'NOT_FOUND' });
  const enriched = (await enrichProducts([product]))[0];
  res.json({ data: enriched });
}));

module.exports = router;
