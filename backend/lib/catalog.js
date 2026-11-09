const products = require('../../shared/catalog.json');
const { ApiError } = require('./errors');
const discounts = { IONARA10: 0.1, GAMER10: 0.1, VIP20: 0.2, PARRAIN5: 0.05, COINS10: 0.1, BUNDLE3: 0.15, BUNDLE5: 0.25 };
function quote(items, currency, promoCode = '') {
  if (!['TND', 'EUR', 'USD'].includes(currency) || !Array.isArray(items) || !items.length || items.length > 50) throw new ApiError(400, 'INVALID_ORDER');
  const seen = new Set();
  const precision = currency === 'TND' ? 1000 : 100;
  const lines = items.map(item => {
    const product = products.find(p => p.slug === item?.slug);
    const plan = item?.planId ? product?.plans?.find(pl => pl.id === item.planId) : null;
    if (item?.planId && !plan) throw new ApiError(400, 'INVALID_ORDER');
    const lineKey = plan ? `${item?.slug}:${plan.id}` : item?.slug;
    if (!product || !product.inStock || seen.has(lineKey) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) throw new ApiError(400, 'INVALID_ORDER');
    seen.add(lineKey);
    const price = (plan ? plan.prices : product.prices)[currency];
    if (!Number.isFinite(price) || price <= 0) throw new ApiError(409, 'PRICE_UNAVAILABLE');
    return { productId: lineKey, title: plan ? `${product.title} (${plan.label})` : product.title, platform: product.platform, price, quantity: item.quantity };
  });
  const totalQty = lines.reduce((sum, l) => sum + l.quantity, 0);
  const code = typeof promoCode === 'string' ? promoCode.trim().toUpperCase() : '';
  const isReferralCode = /^ION-[A-Z0-9]{2,10}-[A-F0-9]{4}$/.test(code);
  if (code && !Object.hasOwn(discounts, code) && !isReferralCode) throw new ApiError(400, 'INVALID_PROMO');
  if ((code === 'BUNDLE3' && totalQty < 3) || (code === 'BUNDLE5' && totalQty < 5)) throw new ApiError(400, 'INVALID_PROMO');
  const rate = isReferralCode ? 0.05 : (discounts[code] || 0);
  const subtotalUnits = lines.reduce((sum, line) => sum + Math.round(line.price * precision) * line.quantity, 0);
  const discountUnits = Math.round(subtotalUnits * rate);
  return { items: lines, currency, promoCode: code, subtotal: subtotalUnits / precision, discount: discountUnits / precision, total: (subtotalUnits - discountUnits) / precision };
}
module.exports = { products, quote };
