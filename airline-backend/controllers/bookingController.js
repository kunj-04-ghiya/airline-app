const Flight = require("../models/flightRoutes");
const Booking = require("../models/bookingRoutes");

const calcAmount = (fares, passengers) =>
  passengers.reduce((sum, p) => sum + (fares[p.seatClass] || 0), 0);

exports.myBookings = async (req, res) => {
  const { email } = req.query;
  const bookings = await Booking.find({ userEmail: email }).populate("flightId");
  res.json({ ok: true, bookings });
};

exports.bookFlight = async (req, res) => {
  const { userEmail, flightId, passengers } = req.body;

  const flight = await Flight.findById(flightId);
  if (!flight) return res.status(404).json({ ok: false, message: "Flight not found" });

  // inventory check
  for (const p of passengers) {
    const bucket = flight.inventory[p.seatClass];
    if (!bucket || bucket.booked >= bucket.capacity) {
      return res.status(400).json({ ok: false, message: `No seats left in ${p.seatClass}` });
    }
  }

  // reserve
  passengers.forEach(p => { flight.inventory[p.seatClass].booked += 1; });
  await flight.save();

  const amount = calcAmount(flight.fares, passengers);
  const booking = await Booking.create({
    userEmail, flightId, passengers, amount, paymentRef: "MOCK-" + Date.now()
  });

  res.status(201).json({ ok: true, booking });
};

exports.cancelBooking = async (req, res) => {
  const booking = await require("../models/bookingRoutes").findById(req.params.id);
  if (!booking) return res.status(404).json({ ok: false, message: "Booking not found" });

  const flight = await require("../models/flightRoutes").findById(booking.flightId);
  if (flight) {
    booking.passengers.forEach(p => {
      const b = flight.inventory[p.seatClass];
      if (b) b.booked = Math.max(0, b.booked - 1);
    });
    await flight.save();
  }

  booking.status = "CANCELLED";
  await booking.save();

  res.json({ ok: true, message: "Booking cancelled", booking });
};
