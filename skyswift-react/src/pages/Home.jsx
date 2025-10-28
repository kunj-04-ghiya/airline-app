import React, { useEffect, useState } from 'react'
import { $, loadSeed, AppState } from '../lib/state.js'
import { Link } from 'react-router-dom'

export default function Home(){
  const [routes, setRoutes] = useState([])
  useEffect(()=>{ (async()=>{
    $.load(); await loadSeed()
    const day = $.todayISO()
    const r = AppState.flights.filter(f=>f.date===day).slice(0,6).map(f=>`${f.from}→${f.to} (${f.id})`)
    setRoutes(r)
  })() },[])
  return (
    <section className="card grid grid-2">
      <div>
        <h1 style={{margin:'0 0 6px 0'}}>Welcome to SkySwift</h1>
        <p className="small">Search flights, book tickets, manage PNRs, check-in, and simulate admin inventory — in React.</p>
        <div className="hr"></div>
        <div className="chips">
          <span className="badge">CRS</span><span className="badge">Inventory</span><span className="badge">DCS</span>
          <span className="badge">PNR</span><span className="badge">Ancillaries</span><span className="badge">Ticketing</span>
        </div>
        <div className="hr"></div>
        <Link className="btn" to="/search">Start Booking</Link>
        <Link className="btn secondary" to="/manage">Manage Booking</Link>
      </div>
      <div>
        <div className="notice">
          <strong>Sample routes today:</strong>
          <div className="chips" style={{marginTop:8}}>
            {routes.map((r,i)=><span key={i} className="badge">{r}</span>)}
          </div>
          <div className="small">Tip: Modify seed data in <span className="kbd">public/data/flights.json</span>.</div>
        </div>
      </div>
    </section>
  )
}
