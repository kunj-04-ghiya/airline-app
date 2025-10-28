const express = require("express");
const ctrl = require("../controllers/flightController");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", ctrl.listFlights);
router.post("/", isAdmin, ctrl.createFlight);
router.patch("/:id", isAdmin, ctrl.updateFlight);
router.delete("/:id", isAdmin, ctrl.deleteFlight);

module.exports = router;
