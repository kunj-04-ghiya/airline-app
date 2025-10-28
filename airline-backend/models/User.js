const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name:  { type: String, required: true },
  // keep it simple: no hashed password here since you didn’t ask auth flows
  role:  { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
