import Hero from '../components/Hero'
import FlightSearchForm from '../components/FlightSearchForm'

export default function Home() {
  return (
    <>
      <Hero />
      <section className="container section-gap">
        <FlightSearchForm />
      </section>
    </>
  )
}
