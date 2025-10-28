# SkySwift — Airline Reservation System (React + Vite)

A React implementation of the airline reservation demo with:
- CRS (schedules/fares/PNR), Inventory Control, DCS check-in
- PNR/ticketing, ancillaries, mock payments
- Passenger & Admin modules
- LocalStorage persistence and JSON seed data

## Quick start
```bash
npm install
npm run dev
# open the printed localhost URL
```

Try **BOM → DEL** for **today's date**.

## Notes
- Seed data: `public/data/flights.json`
- Core logic in `src/lib/state.js`
- Pages under `src/pages`
- Styling in `src/styles.css`
