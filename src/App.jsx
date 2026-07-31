import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TestZone from './components/TestZone.jsx'
import QuizModal from './components/QuizModal.jsx'
import LoveTypeModal from './components/LoveTypeModal.jsx'
import GameZone from './components/GameZone.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [loveOpen, setLoveOpen] = useState(false)

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TestZone
          onOpenQuiz={() => setQuizOpen(true)}
          onOpenLoveType={() => setLoveOpen(true)}
        />
        <GameZone />
        <Features />
      </main>
      <Footer />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {loveOpen && <LoveTypeModal onClose={() => setLoveOpen(false)} />}
    </div>
  )
}
