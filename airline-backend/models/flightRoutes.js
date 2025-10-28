const mongoose = require("mongoose");

const fareSchema = new mongoose.Schema({
  ECONOMY: Number,
  PREMIUM: Number,
  BUSINESS: Number
}, { _id: false });

const seatBucket = {
  capacity: Number,
  booked: { type: Number, default: 0 }
};
const inventorySchema = new mongoose.Schema({
  ECONOMY: seatBucket,
  PREMIUM: seatBucket,
  BUSINESS: seatBucket
}, { _id: false });

const flightSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to:   { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  dep:  { type: String, required: true }, // HH:mm
  arr:  { type: String, required: true },
  fares: fareSchema,
  inventory: inventorySchema
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);
