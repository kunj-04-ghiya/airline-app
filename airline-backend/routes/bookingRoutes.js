const express = require("express");
const ctrl = require("../controllers/bookingController");

const router = express.Router();

router.get("/", ctrl.myBookings);
router.post("/", ctrl.bookFlight);
router.delete("/:id", ctrl.cancelBooking);

module.exports = router;
