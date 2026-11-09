class ApiError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = { ApiError, asyncRoute };
