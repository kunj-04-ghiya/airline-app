import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FlightSearchForm({ compact = false }) {
  const nav = useNavigate()
  const [airports, setAirports] = useState([])
  const [form, setForm] = useState({
    type: 'round',
    from: '',
    to: '',
    date: '',
    pax: 1,
    cls: 'Economy'
  })

  useEffect(() => {
    fetch('/data/airports.json').then(r => r.json()).then(setAirports)
  }, [])

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const search = e => {
    e.preventDefault()
    const q = new URLSearchParams(form).toString()
    nav(`/flights?${q}`)
  }

  const optionLabel = a => `${a.city}, ${a.country} (${a.code})`

  return (
    <form className={`card search ${compact ? 'compact' : ''}`} onSubmit={search}>
      <div className="chip-row">
        <label className={`chip ${form.type === 'round' ? 'chip-active' : ''}`}>
          <input type="radio" name="type" value="round" checked={form.type === 'round'} onChange={onChange} />
          Round Trip
        </label>
        <label className={`chip ${form.type === 'oneway' ? 'chip-active' : ''}`}>
          <input type="radio" name="type" value="oneway" checked={form.type === 'oneway'} onChange={onChange} />
          One-way
        </label>
      </div>

      <div className="grid">
        <div className="field">
          <label>From (city or code)</label>
          <input list="from-airports" name="from" value={form.from} onChange={onChange} placeholder="e.g. Mumbai or BOM" required />
          <datalist id="from-airports">
            {airports.map(a => <option key={a.code} value={a.code}>{optionLabel(a)}</option>)}
          </datalist>
        </div>
        <div className="field">
          <label>To (city or code)</label>
          <input list="to-airports" name="to" value={form.to} onChange={onChange} placeholder="e.g. London or LHR" required />
          <datalist id="to-airports">
            {airports.map(a => <option key={a.code} value={a.code}>{optionLabel(a)}</option>)}
          </datalist>
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </div>
        <div className="field">
          <label>Passengers</label>
          <input type="number" min="1" name="pax" value={form.pax} onChange={onChange} />
        </div>
        <div className="field">
          <label>Class</label>
          <select name="cls" value={form.cls} onChange={onChange}>
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>
      </div>

      <button className="btn-primary">Search Flights</button>
    </form>
  )
}
