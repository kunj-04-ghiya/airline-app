import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function BookPay() {
  const q = useQuery()
  const nav = useNavigate()
  const [paid, setPaid] = useState(false)

  // Either we got full details via query (synthetic) or we’ll fall back to minimal fields
  const flight = {
    id: q.get('flightId') || 'UNKNOWN',
    airline: q.get('airline') || 'SkySwift',
    from: (q.get('from') || 'FROM').toUpperCase(),
    to: (q.get('to') || 'TO').toUpperCase(),
    priceINR: Number(q.get('price') || 25000),
    depart: q.get('depart') || new Date().toISOString(),
    arrive: q.get('arrive') || new Date(Date.now()+2*60*60*1000).toISOString()
  }

  const pay = (e) => {
    e.preventDefault()
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    bookings.push({
      id: 'BK' + Math.floor(Math.random()*1e6),
      flightId: flight.id,
      route: `${flight.from} ✈ ${flight.to}`,
      date: new Date(flight.depart).toDateString(),
      priceINR: flight.priceINR,
      airline: flight.airline,
      status: 'Confirmed'
    })
    localStorage.setItem('bookings', JSON.stringify(bookings))
    setPaid(true)
  }

  if (!q.get('flightId')) {
    return (
      <section className="section-gap">
        <div className="container card">
          <h3>No flight selected</h3>
          <p className="muted">Please choose a flight first.</p>
          <button className="btn-primary" onClick={() => nav('/flights')}>Browse Flights</button>
        </div>
      </section>
    )
  }

  if (paid) {
    return (
      <section className="section-gap">
        <div className="container">
          <div className="ticket card">
            <div className="ticket-top">
              <div className="ticket-codes">
                <div className="big">{flight.from}</div>
                <div className="plane-mid">✈</div>
                <div className="big">{flight.to}</div>
              </div>
              <div className="airline">{flight.airline}</div>
            </div>
            <div className="ticket-grid">
              <div><span className="label">Flight</span><div>{flight.id}</div></div>
              <div><span className="label">Boarding</span><div>09:10</div></div>
              <div><span className="label">Depart</span><div>{new Date(flight.depart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>
              <div><span className="label">Gate</span><div>6</div></div>
              <div><span className="label">Seat</span><div>23A</div></div>
              <div><span className="label">Class</span><div>Economy</div></div>
              <div><span className="label">Passenger</span><div>Demo Passenger</div></div>
            </div>
            <div className="barcode" aria-hidden />
          </div>
          <div style={{marginTop:12}}>
            <button className="btn-primary" onClick={() => nav('/my-bookings')}>Go to My Bookings</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-gap">
      <div className="container">
        <h2>Book &amp; Pay</h2>
        <div className="card">
          <div className="summary">
            <div className="route">
              <span className="code">{flight.from}</span>
              <span className="dash">——✈——</span>
              <span className="code">{flight.to}</span>
            </div>
            <div className="airline">{flight.airline}</div>
            <div className="price-lg">₹{flight.priceINR.toLocaleString('en-IN')}</div>
          </div>

          <form className="grid" onSubmit={pay}>
            <div className="field"><label>Full Name</label><input required placeholder="Passenger name" /></div>
            <div className="field"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
            <div className="field"><label>Card Number</label><input required placeholder="4111 1111 1111 1111" /></div>
            <div className="field"><label>Expiry</label><input required placeholder="MM/YY" /></div>
            <div className="field"><label>CVV</label><input required placeholder="123" /></div>
            <button className="btn-primary">Pay Now</button>
          </form>
        </div>
      </div>
    </section>
  )
}
