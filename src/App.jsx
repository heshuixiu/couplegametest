import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TestZone from './components/TestZone.jsx'
import RedeemExchange from './components/RedeemExchange.jsx'
import GameZone from './components/GameZone.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TestZone />
        <RedeemExchange />
        <GameZone />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
