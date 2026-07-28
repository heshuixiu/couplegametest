import { useEffect } from 'react'

export default function GameModal({ onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="game-overlay" onClick={onClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>
        <button className="game-close" type="button" aria-label="关闭游戏" onClick={onClose}>×</button>
        <iframe className="game-iframe" src="/game.html" title="投篮大挑战" />
      </div>
    </div>
  )
}
