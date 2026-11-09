const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  productSlug: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true, trim: true, maxlength: 60 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 500 },
  verifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
