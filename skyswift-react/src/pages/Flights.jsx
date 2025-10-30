import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FlightCard from '../components/FlightCard'
import FlightSearchForm from '../components/FlightSearchForm'

// helpers
const rad = d => d * Math.PI / 180
const haversine = (a, b) => {
  if (!a || !b) return 2000 // fallback distance in km
  const R = 6371
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const lat1 = rad(a.lat), lat2 = rad(b.lat)
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Flights() {
  const q = useQuery()
  const nav = useNavigate()
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/flights.json').then(r => r.json()).catch(()=>[]),
      fetch('/data/airports.json').then(r => r.json()).catch(()=>[])
    ]).then(([fl, ap]) => { setFlights(fl); setAirports(ap); setLoading(false) })
  }, [])

  const val = s => (s || '').trim()
  const qFrom = val(q.get('from'))
  const qTo   = val(q.get('to'))

  // find airport objects by code or city name
  const findAirport = (input) => {
    if (!input) return null
    const t = input.toLowerCase()
    return airports.find(a =>
      a.code.toLowerCase() === t ||
      a.city.toLowerCase() === t ||
      `${a.city}, ${a.country}`.toLowerCase().includes(t)
    ) || null
  }

  const apFrom = findAirport(qFrom)
  const apTo   = findAirport(qTo)

  // 1) real flights from flights.json (match by code or city)
  const real = flights.filter(f => {
    const fm = [f.from, f.fromCity].some(x => (x||'').toLowerCase().includes((qFrom||'').toLowerCase()))
    const tm = [f.to, f.toCity].some(x => (x||'').toLowerCase().includes((qTo||'').toLowerCase()))
    return (!qFrom || fm) && (!qTo || tm)
  })

  // 2) if none found, **generate mock flights** for any route
  const synth = (() => {
    if (real.length > 0 || !qFrom || !qTo) return []
    const dkm = haversine(apFrom, apTo)
    const avgSpeed = 820 // km/h
    const durH = dkm / avgSpeed
    const mins = Math.max(60, Math.round(durH * 60))
    const base = Math.max(2000, Math.round(dkm * 6)) // INR ~6 per km (demo)
    const airlines = ['SkySwift','Global Air','Air Express','Starline','SwiftJet']
    const depart0 = new Date()
    const list = [0, 2, 6, 12].map((offset, i) => {
      const dep = new Date(depart0.getTime() + offset*60*60*1000)
      const arr = new Date(dep.getTime() + mins*60*1000)
      const id = `${(apFrom?.code || qFrom).toUpperCase()}${i+1}${(apTo?.code || qTo).toUpperCase()}`
      return {
        id, airline: airlines[i % airlines.length],
        from: (apFrom?.code || qFrom).toUpperCase(),
        to: (apTo?.code || qTo).toUpperCase(),
        depart: dep.toISOString(),
        arrive: arr.toISOString(),
        durationMins: mins,
        nonstop: true,
        priceINR: base + i*1500
      }
    })
    return list
  })()

  const results = (real.length ? real : synth).map(f => ({
    id: f.id,
    airline: f.airline,
    from: f.from,
    to: f.to,
    depart: new Date(f.depart).toDateString(),
    departTime: new Date(f.depart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
    arrive: new Date(f.arrive).toDateString(),
    arriveTime: new Date(f.arrive).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
    duration: `${Math.floor(f.durationMins/60)}h ${f.durationMins%60}m • ${f.nonstop ? 'Non-stop' : 'Via'}`,
    price: f.priceINR
  }))

  const onBook = (f) => {
    // pass full details so Book & Pay works for synthetic flights too
    const p = new URLSearchParams({
      flightId: f.id,
      airline: f.airline,
      from: f.from, to: f.to,
      depart: f.depart, arrive: f.arrive,
      price: String(f.price)
    })
    nav(`/book-pay?${p.toString()}`)
  }

  return (
    <section className="section-gap">
      <div className="container">
        <div className="list-header">
          <h2>Select Flight</h2>
          <div className="pill-row">
            <button className="pill" type="button">Filter</button>
            <button className="pill" type="button">Sort: Quickest</button>
          </div>
        </div>

        <FlightSearchForm compact />

        {loading ? (
          <div className="muted" style={{marginTop:12}}>Loading flights…</div>
        ) : (
          <>
            <div className="results-count">
              {results.length} flight{results.length !== 1 ? 's' : ''} found
            </div>
            <div className="stack">
              {results.map(f => (
                <FlightCard key={f.id} f={f} onBook={onBook} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
