import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <div className="brand">SkySwift</div>
        <nav className="links">
          <NavLink to="/" end className="link">Home</NavLink>
          <NavLink to="/flights" className="link">Flights</NavLink>
          <NavLink to="/book-pay" className="link">Book &amp; Pay</NavLink>
          <NavLink to="/my-bookings" className="link">My Bookings</NavLink>
          <NavLink to="/admin" className="link">Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}
