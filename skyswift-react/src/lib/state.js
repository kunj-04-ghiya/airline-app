// Central state & business logic (localStorage + seed JSON)
export const AppState = {
  flights: [],
  pnrs: {},
  syncLog: []
}

export const $ = {
  save(){ localStorage.setItem('skyswift_state', JSON.stringify(AppState)) },
  load(){
    const raw = localStorage.getItem('skyswift_state')
    if(raw){ try{ const s = JSON.parse(raw); Object.assign(AppState, s) }catch{} }
  },
  money(n){ return '₹ ' + Number(n).toLocaleString('en-IN') },
  todayISO(){ const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10) },
  timeHM(t){ return t.slice(0,5) },
  uid(prefix='ID'){ return prefix + '-' + Math.random().toString(36).slice(2,9).toUpperCase() },
}

export async function loadSeed(){
  if(AppState.flights?.length) return
  const res = await fetch('/data/flights.json')
  const data = await res.json()
  AppState.flights = data.flights
  AppState.pnrs = {}
  AppState.syncLog = []
  $.save()
}

export function findFlights({from, to, date}){
  return AppState.flights.filter(f => f.from===from && f.to===to && f.date===date)
}
export function getFlightById(id){ return AppState.flights.find(f => f.id===id) }
export function updateFlight(updated){
  const idx = AppState.flights.findIndex(f => f.id===updated.id)
  if(idx>=0){ AppState.flights[idx]=updated; $.save(); return true }
  return false
}

// Inventory
export function seatsLeft(flight, cls){
  return flight.inventory[cls].capacity - flight.inventory[cls].booked.length
}
export function availableSeats(flight, cls){
  const { map, booked } = flight.inventory[cls]
  return map.filter(s => !booked.includes(s))
}
export function allocateSeat(flight, cls, seat){
  if(!flight.inventory[cls].booked.includes(seat)){
    flight.inventory[cls].booked.push(seat); $.save()
  }
}

// Fare & Pricing
export function priceFor(flight, cls, paxCount, anc){
  const base = flight.fares[cls]
  const left = seatsLeft(flight, cls)
  const cap = flight.inventory[cls].capacity
  const loadFactor = 1 - (left / cap)
  const dynamic = 1 + (loadFactor * 0.75)
  const bagFee = (anc.baggage||0) * 1200
  const seatFee = anc.seatSelect ? 350 : 0
  const mealFee = anc.meal ? 400 : 0
  const perPax = Math.round(base * dynamic) + bagFee + seatFee + mealFee
  const taxes = Math.round(perPax * 0.12)
  const total = (perPax + taxes) * paxCount
  return { perPax, taxes, total, dynamic: Number(dynamic.toFixed(2)) }
}

// PNR + Ticketing
export function createPNR({flightId, passengers, cls, ancillaries, priceTotal}){
  const id = $.uid('PNR'); const tickets = passengers.map(()=>$.uid('ETK'))
  AppState.pnrs[id] = { id, flightId, passengers, cls, ancillaries, tickets,
    priceTotal, status:'Booked', checkedIn:false, seats:{} }
  AppState.syncLog.push({ts:new Date().toISOString(), msg:`PNR ${id} created for flight ${flightId}`})
  $.save(); return AppState.pnrs[id]
}
export function getPNR(id){ return AppState.pnrs[id] }
export function setPNR(id, data){ AppState.pnrs[id] = { ...getPNR(id), ...data }; $.save() }

// DCS
export function checkinPNR(id){
  const p = getPNR(id); if(!p || p.checkedIn) return false
  p.checkedIn = true; p.status = 'Checked-in'
  AppState.syncLog.push({ts:new Date().toISOString(), msg:`PNR ${id} checked in.`})
  $.save(); return true
}
export function assignSeat(pnrId, paxIndex, seat){
  const p = getPNR(pnrId); const flight = getFlightById(p.flightId); const cls = p.cls
  if(!availableSeats(flight, cls).includes(seat)) return false
  allocateSeat(flight, cls, seat); p.seats[paxIndex] = seat; $.save(); return true
}

// Payment (mock)
export async function capturePayment(amount){
  await new Promise(r=>setTimeout(r,600))
  return { status:'success', txnId: $.uid('TXN'), amount }
}
