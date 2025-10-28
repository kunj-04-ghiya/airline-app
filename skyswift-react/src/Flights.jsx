// @ts-nocheck
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState("BOM");
  const [to, setTo] = useState("DEL");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const qs = new URLSearchParams({ from, to, date });
      // no backticks, no fancy quotes:
      const url = API + "/api/flights?" + qs.toString();
      const res = await fetch(url);
      const data = await res.json();
      setFlights(Array.isArray(data.flights) ? data.flights : []);
    } catch (e) {
      setError("Failed to load flights: " + e.message);
      setFlights([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Flights</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From (e.g., BOM)"
        />
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To (e.g., DEL)"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={load}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {flights.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <ul>
          {flights.map((f) => (
            <li
              key={f.id}
              style={{ border: "1px solid #ddd", padding: 8, margin: "8px 0" }}
            >
              <b>{f.code || "Flight"}</b> {f.from} → {f.to} &nbsp; ₹{f.price}
              <div style={{ fontSize: 12, color: "#555" }}>
                Depart: {f.departAt ? new Date(f.departAt).toLocaleString() : "-"}
                {" • "}
                Arrive: {f.arriveAt ? new Date(f.arriveAt).toLocaleString() : "-"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}