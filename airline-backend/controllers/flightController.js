const Flight = require("../models/flightRoutes");

exports.listFlights = async (_req, res) => {
  const flights = await Flight.find().sort({ date: 1, dep: 1 });
  res.json({ ok: true, flights });
};

exports.createFlight = async (req, res) => {
  const flight = await Flight.create(req.body);
  res.status(201).json({ ok: true, flight });
};

exports.updateFlight = async (req, res) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ ok: true, flight });
};

exports.deleteFlight = async (req, res) => {
  await Flight.findByIdAndDelete(req.params.id);
  res.json({ ok: true, message: "Flight removed" });
};
