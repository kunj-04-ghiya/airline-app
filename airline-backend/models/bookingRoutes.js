const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  name: String,
  seatClass: { type: String, enum: ["ECONOMY", "PREMIUM", "BUSINESS"] }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  flightId:  { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  passengers: [passengerSchema],
  amount: { type: Number, required: true },
  status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
  paymentRef: String
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
