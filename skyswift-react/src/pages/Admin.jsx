import React, { useEffect, useState } from 'react'
import { $, AppState, loadSeed, seatsLeft, updateFlight } from '../lib/state.js'

export default function Admin(){
  const [rows, setRows] = useState([])
  const [sync, setSync] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ (async()=>{
    $.load(); await loadSeed()
    setRows(AppState.flights.slice(0,50))
    setSync(AppState.syncLog.slice(-6))
  })() },[])

  return (
    <section>
      <div className="card">
        <h2>Admin • Inventory & Fares</h2>
        <table className="table">
          <thead><tr><th>Flight</th><th>Date</th><th>Time</th><th>Fares (E/P/B)</th><th>Seats</th><th></th></tr></thead>
          <tbody>
            {rows.map(f=>(
              <tr key={f.id}>
                <td><strong>{f.id}</strong><div className="small">{f.from}→{f.to}</div></td>
                <td>{f.date}</td>
                <td>{f.dep.slice(0,5)}→{f.arr.slice(0,5)}</td>
                <td>₹{f.fares.ECONOMY}/₹{f.fares.PREMIUM}/₹{f.fares.BUSINESS}</td>
                <td>
                  E:{seatsLeft(f,'ECONOMY')}/{f.inventory.ECONOMY.capacity} •
                  P:{seatsLeft(f,'PREMIUM')}/{f.inventory.PREMIUM.capacity} •
                  B:{seatsLeft(f,'BUSINESS')}/{f.inventory.BUSINESS.capacity}
                </td>
                <td><button className="btn secondary" onClick={()=>setEditing(f)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hr"></div>
        <h3>Recent Synchronization Events</h3>
        <div className="notice">
          {sync.length? sync.map((x,i)=><div key={i} className="small">[{x.ts}] {x.msg}</div>): <div className="small">No recent sync events.</div>}
        </div>
      </div>

      {editing && <EditDialog flight={editing} onClose={()=>setEditing(null)} onSave={(f)=>{ updateFlight(f); alert('Saved.'); setEditing(null); location.reload() }}/>
      }
    </section>
  )
}

function EditDialog({flight, onClose, onSave}){
  const [f, setF] = useState(JSON.parse(JSON.stringify(flight)))
  return (
    <div className="card" style={{position:'fixed', inset:'10% 20%', background:'#0b1326', zIndex:100, border:'2px solid #1f2937'}}>
      <h3>Edit Flight {f.id}</h3>
      <div className="grid grid-3">
        <div><label>Economy Fare</label><input className="input" type="number" value={f.fares.ECONOMY} onChange={e=>setF({...f, fares:{...f.fares, ECONOMY:Number(e.target.value)}})}/></div>
        <div><label>Premium Fare</label><input className="input" type="number" value={f.fares.PREMIUM} onChange={e=>setF({...f, fares:{...f.fares, PREMIUM:Number(e.target.value)}})}/></div>
        <div><label>Business Fare</label><input className="input" type="number" value={f.fares.BUSINESS} onChange={e=>setF({...f, fares:{...f.fares, BUSINESS:Number(e.target.value)}})}/></div>
        <div><label>Economy Capacity</label><input className="input" type="number" value={f.inventory.ECONOMY.capacity} onChange={e=>setF({...f, inventory:{...f.inventory, ECONOMY:{...f.inventory.ECONOMY, capacity:Number(e.target.value)}}})}/></div>
        <div><label>Premium Capacity</label><input className="input" type="number" value={f.inventory.PREMIUM.capacity} onChange={e=>setF({...f, inventory:{...f.inventory, PREMIUM:{...f.inventory.PREMIUM, capacity:Number(e.target.value)}}})}/></div>
        <div><label>Business Capacity</label><input className="input" type="number" value={f.inventory.BUSINESS.capacity} onChange={e=>setF({...f, inventory:{...f.inventory, BUSINESS:{...f.inventory.BUSINESS, capacity:Number(e.target.value)}}})}/></div>
      </div>
      <div className="hr"></div>
      <div className="right">
        <button className="btn secondary" onClick={onClose}>Close</button>
        <button className="btn" onClick={()=>onSave(f)}>Save</button>
      </div>
    </div>
  )
}
