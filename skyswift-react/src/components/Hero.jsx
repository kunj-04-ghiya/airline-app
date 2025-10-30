export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content container">
        <h1>Book Your Flight</h1>
        <p>Fast, simple, and elegant reservations.</p>
      </div>
      <svg className="hero-map" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopOpacity="0.35"/>
            <stop offset="1" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="300" fill="url(#g)"/>
      </svg>
      <div className="plane" aria-hidden>✈️</div>
    </section>
  )
}
