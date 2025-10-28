const express = require("express");
const ctrl = require("../controllers/userController");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", isAdmin, ctrl.listUsers);
router.post("/", ctrl.createUser);

module.exports = router;
