import React, { useEffect, useState } from 'react'
import { $, getFlightById, priceFor, capturePayment, createPNR } from '../lib/state.js'
import { useNavigate } from 'react-router-dom'

export default function Confirm(){
  const nav = useNavigate()
  const [flight, setFlight] = useState(null)
  const [cls, setCls] = useState('ECONOMY')
  const [review, setReview] = useState(null)
  const [price, setPrice] = useState(null)

  useEffect(()=>{
    $.load()
    const f = getFlightById(sessionStorage.getItem('selectedFlight')); setFlight(f)
    const qs = new URLSearchParams(sessionStorage.getItem('search')||''); const c = qs.get('cls')||'ECONOMY'; setCls(c)
    const paxCount = Number(qs.get('pax')||1)
    const rev = JSON.parse(sessionStorage.getItem('review')||'{}'); setReview(rev)
    if(f && rev) setPrice(priceFor(f, c, paxCount, rev.anc))
  },[])

  if(!flight || !review) return <section className="card">Missing booking details.</section>

  const paxList = review.pax.map(p=>`${p.first} ${p.last}`).join(', ')

  return (
    <section className="card">
      <h2>Confirm & Pay</h2>
      <div className="grid grid-2">
        <div>
          <div className="notice">
            <div><strong>Flight:</strong> {flight.id} • {flight.from}→{flight.to} • {$.timeHM(flight.dep)}→{$.timeHM(flight.arr)}</div>
            <div><strong>Class:</strong> {cls}</div>
            <div><strong>Passengers:</strong> {paxList}</div>
            <div><strong>Ancillaries:</strong> Bags x{review.anc.baggage}, SeatSel: {String(review.anc.seatSelect)}, Meal: {String(review.anc.meal)}</div>
          </div>
        </div>
        <div>
          <div className="card" style={{background:'#0a1429'}}>
            {price && <>
              <div><strong>Total:</strong> {$.money(price.total)}</div>
              <div className="small">Per pax (incl taxes): {$.money(price.perPax + price.taxes)} • Dynamic factor ×{price.dynamic}</div>
            </>}
            <div className="hr"></div>
            <button className="btn" onClick={async ()=>{
              const res = await capturePayment(price.total)
              if(res.status==='success'){
                const qs = new URLSearchParams(sessionStorage.getItem('search')||'')
                const pnr = createPNR({ flightId: flight.id, passengers: review.pax, cls, ancillaries: review.anc, priceTotal: price.total })
                sessionStorage.setItem('lastPNR', pnr.id)
                alert(`Payment Captured: ${res.txnId}\nPNR: ${pnr.id}\nTickets: ${pnr.tickets.join(', ')}`)
                nav('/manage')
              }else{
                alert('Payment failed. Try again.')
              }
            }}>Pay & Issue Tickets</button>
          </div>
        </div>
      </div>
      <div className="hr"></div>
      <button className="btn secondary" onClick={()=>nav('/book')}>Back</button>
    </section>
  )
}
