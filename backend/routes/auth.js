const router = require('express').Router();
const { rateLimit } = require('express-rate-limit');
const User = require('../models/User');
const { ApiError, asyncRoute } = require('../lib/errors');
const { protect, setSession, cookieOptions } = require('../middleware/auth');
const publicUser = user => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  phone: user.phone,
  role: user.role,
  loyaltyPoints: user.loyaltyPoints ?? 25,
  referralCode: user.referralCode || '',
  referredBy: user.referredBy || '',
});
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { code: 'RATE_LIMITED' } });
function credentials(body) {
  if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) || body.email.length > 254 || typeof body.password !== 'string' || body.password.length < 8 || Buffer.byteLength(body.password) > 72) throw new ApiError(400, 'INVALID_CREDENTIALS');
  return { email: body.email.trim().toLowerCase(), password: body.password };
}
router.post('/register', limiter, asyncRoute(async (req, res) => {
  const { email, password } = credentials(req.body);
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  if (username.length < 3 || username.length > 60) throw new ApiError(400, 'INVALID_NAME');
  if (await User.exists({ email })) throw new ApiError(409, 'EMAIL_EXISTS');
  const referredBy = typeof req.body.referredBy === 'string' ? req.body.referredBy.trim().toUpperCase().slice(0, 24) : '';
  let startPoints = 25;
  if (referredBy) {
    const referrer = await User.findOne({ referralCode: referredBy });
    if (referrer) {
      startPoints = 50;
      await User.updateOne({ _id: referrer._id }, { $inc: { loyaltyPoints: 30 } });
    }
  }
  const user = await User.create({ username, email, password, referredBy, loyaltyPoints: startPoints });
  setSession(res, user._id.toString());
  res.status(201).json({ user: publicUser(user) });
}));
router.post('/login', limiter, asyncRoute(async (req, res) => {
  const { email, password } = credentials(req.body);
  const user = await User.findOne({ email });
  if (!user || !await user.matchPassword(password)) throw new ApiError(401, 'INVALID_CREDENTIALS');
  setSession(res, user._id.toString());
  res.json({ user: publicUser(user) });
}));
router.post('/logout', (req, res) => { res.clearCookie('ionara_session', { ...cookieOptions, maxAge: undefined }); res.json({ success: true }); });
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
module.exports = router;
