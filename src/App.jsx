import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TestZone from './components/TestZone.jsx'
import QuizModal from './components/QuizModal.jsx'
import GameZone from './components/GameZone.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TestZone onOpenQuiz={() => setQuizOpen(true)} />
        <GameZone />
        <Features />
      </main>
      <Footer />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
    </div>
  )
}
