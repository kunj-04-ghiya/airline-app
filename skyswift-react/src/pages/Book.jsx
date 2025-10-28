import React, { useEffect, useState } from 'react'
import { $, getFlightById } from '../lib/state.js'
import { useNavigate } from 'react-router-dom'

export default function Book(){
  const nav = useNavigate()
  const [flight, setFlight] = useState(null)
  const [cls, setCls] = useState('ECONOMY')
  const [paxCount, setPaxCount] = useState(1)
  const [pax, setPax] = useState([])
  const [anc, setAnc] = useState({baggage:0, seatSelect:false, meal:false})

  useEffect(()=>{
    $.load()
    const q = new URLSearchParams(sessionStorage.getItem('search')||'')
    setCls(q.get('cls')||'ECONOMY')
    const pc = Number(q.get('pax')||1); setPaxCount(pc); setPax(Array.from({length:pc}).map(()=>({first:'',last:'',dob:''})))
    setFlight(getFlightById(sessionStorage.getItem('selectedFlight')))
  },[])

  if(!flight) return <section className="card">No flight selected.</section>

  return (
    <section className="card">
      <h2>Passenger Details • {flight.id} • {flight.from}→{flight.to} ({cls})</h2>
      <form onSubmit={e=>{
        e.preventDefault()
        const review = {pax, anc}
        sessionStorage.setItem('review', JSON.stringify(review))
        nav('/confirm')
      }}>
        {pax.map((p,i)=>(
          <div className="grid grid-3" key={i}>
            <div><label>First Name</label><input className="input" value={p.first} onChange={e=>{ const v=[...pax]; v[i].first=e.target.value; setPax(v) }} required/></div>
            <div><label>Last Name</label><input className="input" value={p.last} onChange={e=>{ const v=[...pax]; v[i].last=e.target.value; setPax(v) }} required/></div>
            <div><label>DOB</label><input className="input" type="date" value={p.dob} onChange={e=>{ const v=[...pax]; v[i].dob=e.target.value; setPax(v) }} required/></div>
          </div>
        ))}
        <div className="hr"></div>
        <h3>Ancillaries</h3>
        <div className="grid grid-3">
          <div><label>Extra Bags per pax</label><input className="input" type="number" min="0" value={anc.baggage} onChange={e=>setAnc({...anc, baggage:Number(e.target.value)})}/></div>
          <div><label>Seat Selection</label><select className="input" value={String(anc.seatSelect)} onChange={e=>setAnc({...anc, seatSelect:e.target.value==='true'})}><option value="false">No</option><option value="true">Yes</option></select></div>
          <div><label>Meal</label><select className="input" value={String(anc.meal)} onChange={e=>setAnc({...anc, meal:e.target.value==='true'})}><option value="false">No</option><option value="true">Yes</option></select></div>
        </div>
        <div className="hr"></div>
        <div className="right">
          <button className="btn secondary" type="button" onClick={()=>nav('/results')}>Back</button>
          <button className="btn" type="submit">Review & Pay</button>
        </div>
      </form>
    </section>
  )
}
