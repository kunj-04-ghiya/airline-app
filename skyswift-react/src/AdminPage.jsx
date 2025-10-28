// @ts-nocheck
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
  const [departAt, setDepartAt] = useState("");
  const [arriveAt, setArriveAt] = useState("");
  const [seats, setSeats] = useState("60");

  const [flights, setFlights] = useState([]);
  const [msg, setMsg] = useState("");

  // --- load flights ---
  async function loadFlights() {
    try {
      const res = await fetch(API + "/api/flights");
      const data = await res.json();
      setFlights(Array.isArray(data.flights) ? data.flights : []);
    } catch (e) {
      setMsg("Failed to load flights: " + e.message);
    }
  }

  useEffect(() => {
    loadFlights();
  }, []);

  // --- create flight ---
  async function createFlight(e) {
    e.preventDefault();
    setMsg("");

    const payload = {
      code: code.trim(),
      from: from.trim().toUpperCase(),
      to: to.trim().toUpperCase(),
      departAt: departAt ? new Date(departAt).toISOString() : undefined,
      arriveAt: arriveAt ? new Date(arriveAt).toISOString() : undefined,
      price: Number(price || 0),
      seats: Number(seats || 60),
    };

    if (!payload.code || !payload.from || !payload.to) {
      setMsg("Please fill Code, From, To.");
      return;
    }

    try {
      const res = await fetch(API + "/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        setMsg("Create failed");
        return;
      }
      setMsg("Flight created");
      // reset
      setCode("");
      setFrom("");
      setTo("");
      setDepartAt("");
      setArriveAt("");
      setPrice("");
      setSeats("60");
      loadFlights();
    } catch (e) {
      setMsg("Create failed: " + e.message);
    }
  }

  // --- delete flight ---
  async function deleteFlight(id) {
    try {
      await fetch(API + "/api/flights/" + id, { method: "DELETE" });
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin – Flights</h2>

      {msg ? (
        <div style={{ background: "#f4f4f4", padding: 8, marginBottom: 10 }}>
          {msg}
        </div>
      ) : null}

      <form onSubmit={createFlight} style={{ display: "grid", gap: 8, maxWidth: 680 }}>
        <div>
          <label>Code</label><br />
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="AI101" />
        </div>
        <div>
          <label>From (IATA)</label><br />
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="BOM" />
        </div>
        <div>
          <label>To (IATA)</label><br />
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="DEL" />
        </div>
        <div>
          <label>Depart</label><br />
          <input type="datetime-local" value={departAt} onChange={(e) => setDepartAt(e.target.value)} />
        </div>
        <div>
          <label>Arrive</label><br />
          <input type="datetime-local" value={arriveAt} onChange={(e) => setArriveAt(e.target.value)} />
        </div>
        <div>
          <label>Price ₹</label><br />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Seats</label><br />
          <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
        </div>
        <button type="submit">Create Flight</button>
      </form>

      <hr style={{ margin: "16px 0" }} />

      <h3>All Flights</h3>
      {flights.length === 0 ? (
        <p>No flights yet.</p>
      ) : (
        <ul>
          {flights.map((f) => (
            <li key={f.id} style={{ margin: "8px 0" }}>
              <b>{f.code}</b> {f.from}→{f.to} ₹{f.price} Seats:{f.seats}{" "}
              <button onClick={() => deleteFlight(f.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}