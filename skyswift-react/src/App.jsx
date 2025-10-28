import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Flights from "./Flights";
import BookAndPay from "./BookAndPay";
import MyBookings from "./MyBookings";
import AdminPage from "./AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: "10px",
        borderBottom: "2px solid #eee",
        display: "flex",
        gap: "15px",
        background: "#f7f7f7"
      }}>
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/book">Book & Pay</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<h2>Welcome to SkySwift Airline Reservation</h2>} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/book" element={<BookAndPay />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}