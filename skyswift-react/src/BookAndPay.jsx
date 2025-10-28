// @ts-nocheck
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function BookAndPay() {
  const [email, setEmail] = useState("");
  const [flightId, setFlightId] = useState("");
  const [passenger, setPassenger] = useState("");
  const [response, setResponse] = useState("");

  const handleBook = async () => {
    try {
      const payload = {
        userEmail: email,
        flightId: flightId,
        passengers: [{ name: passenger }],
      };

      const res = await fetch(API + "/api/bookings", {
        method: "POST",                            // ← property 1
        headers: { "Content-Type": "application/json" }, // ← property 2 (comma here!)
        body: JSON.stringify(payload),            // ← property 3
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Book & Pay</h2>
      <input
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Flight ID (e.g., 1 or 2)"
        value={flightId}
        onChange={(e) => setFlightId(e.target.value)}
      />
      <input
        placeholder="Passenger Name"
        value={passenger}
        onChange={(e) => setPassenger(e.target.value)}
      />
      <button onClick={handleBook}>Book Now</button>

      <pre style={{ marginTop: 20, background: "#f2f2f2", padding: 10 }}>
        {response}
      </pre>
    </div>
  );
}