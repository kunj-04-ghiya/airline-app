module.exports = function isAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (key && key === process.env.ADMIN_KEY) return next();
  return res.status(401).json({ ok: false, message: "Admin key required" });
};
