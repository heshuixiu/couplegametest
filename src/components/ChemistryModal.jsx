import { useEffect } from 'react'
import ChemistryGame from './ChemistryGame.jsx'

export default function ChemistryModal({ onClose, invite }) {
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
      <div className="game-modal game-modal--chem" onClick={(e) => e.stopPropagation()}>
        <button className="game-close chem-close" type="button" aria-label="关闭游戏" onClick={onClose}>×</button>
        <ChemistryGame onClose={onClose} invite={invite} />
      </div>
    </div>
  )
}
