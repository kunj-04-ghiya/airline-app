import { useEffect, useState } from 'react'

export default function MyBookings() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('bookings') || '[]'))
  }, [])

  return (
    <section className="section-gap">
      <div className="container">
        <h2>My Bookings</h2>
        {items.length === 0 ? (
          <div className="card muted">No bookings yet.</div>
        ) : (
          <div className="stack">
            {items.map(b => (
              <div key={b.id} className="card row">
                <div>
                  <div className="bold">{b.route}</div>
                  <div className="muted">{b.date} • {b.airline} • {b.flightId}</div>
                </div>
                <div className="badge ok">{b.status}</div>
                <div className="price">₹{b.priceINR.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
