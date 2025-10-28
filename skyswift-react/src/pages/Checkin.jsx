import React, { useState } from 'react'
import { getPNR, getFlightById, availableSeats, assignSeat, checkinPNR } from '../lib/state.js'

export default function Checkin(){
  const [pnrId, setPnrId] = useState(sessionStorage.getItem('lastPNR')||'')
  const [view, setView] = useState(null)

  function load(){
    const p = getPNR(pnrId.trim())
    if(!p){ setView({error:'PNR not found.'}); return }
    const f = getFlightById(p.flightId)
    const cls = p.cls
    const options = p.passengers.map((px,i)=>{
      const free = availableSeats(f, cls).slice(0, 10)
      return { i, name: px.first + ' ' + px.last, free }
    })
    setView({p, f, options})
  }

  return (
    <section className="card">
      <h2>Online Check-in (DCS)</h2>
      <form onSubmit={(e)=>{ e.preventDefault(); load() }} className="grid grid-3">
        <div><label>PNR</label><input className="input" value={pnrId} onChange={e=>setPnrId(e.target.value)}/></div>
        <div><label>Last Name</label><input className="input" placeholder="(optional)"/></div>
        <div className="right"><button className="btn" type="submit">Retrieve</button></div>
      </form>
      <div style={{marginTop:16}}>
        {!view && <div className="small">Enter PNR to check-in.</div>}
        {view?.error && <div className="notice">{view.error}</div>}
        {view?.p && <div className="card">
          <strong>PNR {view.p.id}</strong> • {view.f.id} {view.f.from}→{view.f.to} | {view.f.dep.slice(0,5)}→{view.f.arr.slice(0,5)}
          <div className="hr"></div>
          <div className="grid grid-3">
            {view.options.map(o=>{
              const cur = view.p.seats[o.i] || ''
              return <div key={o.i}>
                <strong>{o.name}</strong><br/>
                <select className="input" defaultValue={cur} onChange={e=>{
                  const seat = e.target.value
                  if(seat && !assignSeat(view.p.id, o.i, seat)){
                    alert('Seat not available anymore. Pick another.')
                  } else {
                    // refresh
                    load()
                  }
                }}>
                  <option value="">{cur?cur:'Select seat'}</option>
                  {o.free.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            })}
          </div>
          <div className="hr"></div>
          <button className="btn ok" onClick={()=>{
            if(checkinPNR(view.p.id)){
              const brd = 'BRD-' + Math.random().toString(36).slice(2,9).toUpperCase()
              alert('Checked-in. Boarding Pass: '+brd)
              load()
            }else{
              alert('Already checked-in.')
            }
          }}>Confirm Check-in & Get Boarding Pass</button>
        </div>}
      </div>
    </section>
  )
}
