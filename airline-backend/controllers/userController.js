const User = require("../models/User");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ ok: true, user });
};

exports.listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ ok: true, users });
};
