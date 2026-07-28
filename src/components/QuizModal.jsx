import { useState, useEffect } from 'react'

const QUESTIONS = [
  {
    q: '你们吵架之后，通常是谁先开口打破沉默？',
    options: [
      { text: '我主动去哄 TA', score: 4 },
      { text: 'TA 先来哄我', score: 3 },
      { text: '坐下来好好聊聊', score: 2 },
      { text: '冷战很久才和好', score: 1 },
    ],
  },
  {
    q: '不用说话，你们能猜到对方在想什么吗？',
    options: [
      { text: '经常，像有心电感应', score: 4 },
      { text: '基本靠直接沟通', score: 3 },
      { text: '偶尔，大部分要靠说', score: 2 },
      { text: '很少，经常误会', score: 1 },
    ],
  },
  {
    q: '在一起时，最让你们舒服的状态是？',
    options: [
      { text: '各做各的事，但在彼此身边', score: 4 },
      { text: '一起出门约会', score: 3 },
      { text: '黏在一起不分开', score: 2 },
      { text: '各玩各的，基本不搭理', score: 1 },
    ],
  },
  {
    q: '提到未来，你们通常会？',
    options: [
      { text: '经常一起规划', score: 4 },
      { text: '聊过，方向一致', score: 3 },
      { text: '不太敢想太远', score: 2 },
      { text: '想法不太一样', score: 1 },
    ],
  },
  {
    q: '对方的一个小习惯，你的真实感受是？',
    options: [
      { text: '可爱，越看越喜欢', score: 4 },
      { text: '习惯了，无所谓', score: 3 },
      { text: '有时有点烦但能忍', score: 2 },
      { text: '经常让我抓狂', score: 1 },
    ],
  },
]

const TIERS = [
  { min: 18, emoji: '⭐', title: '天生一对', desc: '你们之间的默契简直像开了挂，少有情侣能到这个程度。好好珍惜这份同频，别让它溜走。' },
  { min: 14, emoji: '💕', title: '默契满满', desc: '你们很合拍，偶尔有些小摩擦也能很快找回节奏。再多一点「主动表达」，会更甜。' },
  { min: 10, emoji: '🌱', title: '稳步升温', desc: '感情基础不错，但默契还能再练。多聊聊心里话、多制造共同回忆，关系会更紧。' },
  { min: 0, emoji: '🔧', title: '还需磨合', desc: '你们还在互相了解的阶段，别急。多倾听、多表达，默契是慢慢养出来的。' },
]

export default function QuizModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const total = QUESTIONS.length
  const isResult = step >= total

  const choose = (opt) => {
    setPicked(opt.score)
    setScore((s) => s + opt.score)
    setTimeout(() => {
      setPicked(null)
      setStep((s) => s + 1)
    }, 240)
  }

  const restart = () => {
    setStep(0)
    setScore(0)
    setPicked(null)
  }

  const tier = isResult ? TIERS.find((t) => score >= t.min) : null

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-card" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-close" onClick={onClose} aria-label="关闭">×</button>

        {!isResult ? (
          <>
            <div className="quiz-progress">
              <span style={{ width: `${(step / total) * 100}%` }} />
            </div>
            <p className="quiz-count">第 {step + 1} / {total} 题</p>
            <h3 className="quiz-q">{QUESTIONS[step].q}</h3>
            <div className="quiz-opts">
              {QUESTIONS[step].options.map((o, i) => (
                <button
                  key={i}
                  className={`quiz-opt ${picked === o.score ? 'is-picked' : ''}`}
                  onClick={() => choose(o)}
                >
                  {o.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="quiz-result">
            <span className="quiz-result__emoji">{tier.emoji}</span>
            <h3 className="quiz-result__title">{tier.title}</h3>
            <p className="quiz-result__score">默契得分 {score} / {total * 4}</p>
            <p className="quiz-result__desc">{tier.desc}</p>
            <div className="quiz-result__actions">
              <button className="btn btn--ghost btn--sm" onClick={restart}>再测一次</button>
              <button className="btn btn--primary btn--sm" onClick={onClose}>完成</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
