import React, { useState } from 'react'
import { getPNR, getFlightById, setPNR } from '../lib/state.js'

export default function Manage(){
  const [pnrId, setPnrId] = useState(sessionStorage.getItem('lastPNR')||'')
  const [view, setView] = useState(null)

  function load(){
    const p = getPNR(pnrId.trim())
    if(!p){ setView({error:'PNR not found.'}); return }
    const f = getFlightById(p.flightId)
    setView({p, f})
  }

  return (
    <section className="card">
      <h2>Manage Booking (PNR)</h2>
      <form onSubmit={(e)=>{ e.preventDefault(); load() }} className="grid grid-3">
        <div><label>PNR</label><input className="input" value={pnrId} onChange={e=>setPnrId(e.target.value)}/></div>
        <div><label>Last Name</label><input className="input" placeholder="(optional)"/></div>
        <div className="right"><button className="btn" type="submit">Retrieve</button></div>
      </form>
      <div style={{marginTop:16}}>
        {!view && <div className="small">Enter PNR to view booking.</div>}
        {view?.error && <div className="notice">{view.error}</div>}
        {view?.p && <div className="card">
          <strong>PNR {view.p.id}</strong> • Status: {view.p.status}<br/>
          Flight {view.f.id} {view.f.from}→{view.f.to} {view.f.dep.slice(0,5)}→{view.f.arr.slice(0,5)} • Class {view.p.cls}<br/>
          Pax: {view.p.passengers.map(x=>x.first+' '+x.last).join(', ')}<br/>
          Tickets: {view.p.tickets.join(', ')}<br/>
          Ancillaries: Bags x{view.p.ancillaries.baggage}, SeatSel: {String(view.p.ancillaries.seatSelect)}, Meal: {String(view.p.ancillaries.meal)}
          <div className="hr"></div>
          <button className="btn warn" onClick={()=>alert('Change seats from Check-in tab.')}>Change Seats</button>
          <button className="btn" onClick={()=>{ const a = {...view.p.ancillaries, baggage:view.p.ancillaries.baggage+1}; setPNR(view.p.id,{ancillaries:a}); alert('Added 1 bag.'); load() }}>Add Bag</button>
          <button className="btn danger" onClick={()=>{ if(confirm('Cancel this PNR?')){ setPNR(view.p.id,{status:'Cancelled'}); alert('Cancelled.'); load() } }}>Cancel Trip</button>
        </div>}
      </div>
    </section>
  )
}
