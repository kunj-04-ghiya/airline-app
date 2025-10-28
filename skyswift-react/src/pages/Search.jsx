import React, { useEffect, useState } from 'react'
import { $, loadSeed } from '../lib/state.js'
import { useNavigate } from 'react-router-dom'

export default function Search(){
  const [form, setForm] = useState({from:'BOM', to:'DEL', date: $.todayISO(), pax:1, cls:'ECONOMY'})
  const nav = useNavigate()
  useEffect(()=>{ $.load(); loadSeed() },[])
  return (
    <section className="card">
      <h2>Search Flights</h2>
      <form onSubmit={e=>{ e.preventDefault(); sessionStorage.setItem('search', new URLSearchParams(form).toString()); nav('/results') }} className="grid grid-3">
        <div><label>From</label><input className="input" value={form.from} onChange={e=>setForm({...form, from:e.target.value.toUpperCase()})} placeholder="BOM"/></div>
        <div><label>To</label><input className="input" value={form.to} onChange={e=>setForm({...form, to:e.target.value.toUpperCase()})} placeholder="DEL"/></div>
        <div><label>Date</label><input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
        <div><label>Passengers</label><input className="input" type="number" min="1" max="9" value={form.pax} onChange={e=>setForm({...form, pax:e.target.value})}/></div>
        <div><label>Class</label>
          <select className="input" value={form.cls} onChange={e=>setForm({...form, cls:e.target.value})}>
            <option>ECONOMY</option><option>PREMIUM</option><option>BUSINESS</option>
          </select>
        </div>
        <div className="right">
          <button className="btn" type="submit">Search</button>
        </div>
      </form>
    </section>
  )
}
