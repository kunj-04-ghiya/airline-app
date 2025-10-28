// @ts-nocheck
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(API + "/api/bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError("Failed to load bookings: " + err.message);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>My Bookings</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b, index) => (
            <li key={index}>
              <strong>Flight:</strong> {b.flightId} <br />
              <strong>Passenger:</strong> {b.passengers[0]?.name || "N/A"} <br />
              <strong>Email:</strong> {b.userEmail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}