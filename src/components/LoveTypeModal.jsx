import { useEffect } from 'react'
import LoveTypeQuiz from './LoveTypeQuiz.jsx'

export default function LoveTypeModal({ onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <LoveTypeQuiz onClose={onClose} />
    </div>
  )
}
