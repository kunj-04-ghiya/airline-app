export default function FlightCard({ f, onBook }) {
  return (
    <div className="flight-card card">
      <div className="flight-left">
        <div className="route">
          <div className="code">{f.from}</div>
          <div className="dash">——✈——</div>
          <div className="code">{f.to}</div>
        </div>
        <div className="meta">
          <div><strong>Depart:</strong> {f.depart} &nbsp; {f.departTime}</div>
          <div><strong>Arrive:</strong> {f.arrive} &nbsp; {f.arriveTime}</div>
          <div><strong>Duration:</strong> {f.duration}</div>
          <div className="airline">{f.airline}</div>
        </div>
      </div>
      <div className="flight-right">
        <div className="price">₹{f.price.toLocaleString('en-IN')}</div>
        <div className="per">per adult</div>
        <button className="btn-outline" onClick={() => onBook?.(f)}>Select</button>
      </div>
    </div>
  )
}
