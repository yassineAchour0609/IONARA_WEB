const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, asyncRoute } = require('../lib/errors');
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/api', maxAge: 7 * 24 * 60 * 60 * 1000 };
function setSession(res, id) {
  res.cookie('ionara_session', jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' }), cookieOptions);
}
const protect = asyncRoute(async (req, res, next) => {
  const cookie = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('ionara_session='));
  let decoded;
  try { decoded = jwt.verify(cookie?.slice('ionara_session='.length) || '', process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { throw new ApiError(401, 'UNAUTHORIZED'); }
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new ApiError(401, 'UNAUTHORIZED');
  req.user = user;
  next();
});
module.exports = { protect, setSession, cookieOptions };
