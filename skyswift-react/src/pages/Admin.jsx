import { useEffect, useState } from 'react'

export default function Admin() {
  const [bookings, setBookings] = useState([])

  const refresh = () => {
    setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'))
  }

  useEffect(() => { refresh() }, [])

  const revenue = bookings.reduce((s,b)=> s + (b.priceINR||0), 0)

  return (
    <section className="section-gap">
      <div className="container">
        <h2>Admin Dashboard</h2>
        <div className="grid-3">
          <div className="stat card">
            <div className="stat-num">{bookings.length}</div>
            <div className="muted">Total Bookings</div>
          </div>
          <div className="stat card">
            <div className="stat-num">{new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR'}).format(revenue)}</div>
            <div className="muted">Total Revenue</div>
          </div>
          <div className="stat card">
            <div className="stat-num">5★</div>
            <div className="muted">Service Quality (demo)</div>
          </div>
        </div>

        <div className="card row">
          <div className="muted">Use these actions for demo data:</div>
          <div className="pill-row">
            <button className="pill" onClick={refresh}>Refresh</button>
            <button className="pill" onClick={() => { localStorage.removeItem('bookings'); refresh(); }}>Clear Bookings</button>
          </div>
        </div>
      </div>
    </section>
  )
}
