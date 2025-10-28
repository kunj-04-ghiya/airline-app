import React, { useEffect, useState } from 'react'
import { $, findFlights, seatsLeft, priceFor } from '../lib/state.js'
import { useNavigate } from 'react-router-dom'

export default function Results(){
  const [rows, setRows] = useState([])
  const nav = useNavigate()
  useEffect(()=>{
    $.load();
    const qs = new URLSearchParams(sessionStorage.getItem('search')||'')
    const from = qs.get('from')||'BOM', to = qs.get('to')||'DEL', date = qs.get('date')||$.todayISO()
    const pax = Number(qs.get('pax')||1), cls = qs.get('cls')||'ECONOMY'
    const list = findFlights({from,to,date})
    const items = list.map(f=>{
      const left = seatsLeft(f, cls)
      const p = priceFor(f, cls, pax, {baggage:0, seatSelect:false, meal:false})
      return { f, left, p }
    })
    setRows(items)
  },[])
  return (
    <section className="card">
      <h2>Available Flights</h2>
      <table className="table">
        <thead><tr><th>Flight</th><th>Time</th><th>Class</th><th>Seats</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {rows.length===0 && <tr><td colSpan="6">No flights found.</td></tr>}
          {rows.map(({f,left,p})=>(
            <tr key={f.id}>
              <td><strong>{f.id}</strong><div className="small">{f.from} → {f.to} | {f.date}</div></td>
              <td>{$.timeHM(f.dep)} → {$.timeHM(f.arr)}</td>
              <td>{sessionStorage.getItem('search') && new URLSearchParams(sessionStorage.getItem('search')).get('cls')}</td>
              <td>{left} left</td>
              <td>{$.money(p.perPax)} <span className="small">(dyn ×{p.dynamic})</span></td>
              <td><button className="btn" onClick={()=>{ sessionStorage.setItem('selectedFlight', f.id); nav('/book') }}>Select</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
