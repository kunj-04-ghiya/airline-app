const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health + DB state
app.get("/", (_req, res) => res.json({ ok: true, message: "Airline backend live" }));

// mount routes
app.use("/api/flights", require("./routes/flightRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
})();
