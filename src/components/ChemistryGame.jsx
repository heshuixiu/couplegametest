import { useState, useEffect } from 'react'
import { QUESTION_BANK } from '../questions.js'

const CATS = [
  { key: 'random', label: '全库随机' },
  { key: 'couple', label: '情侣' },
  { key: 'friends', label: '朋友' },
  { key: 'coworkers', label: '同事' },
  { key: 'brain', label: '脑洞' },
  { key: 'family', label: '家庭' },
]

const TIERS = [
  { min: 10, name: '灵魂共振', emoji: '🔥', desc: '你们简直一个肚子里的蛔虫，想法出奇地一致。' },
  { min: 8, name: '高度默契', emoji: '💞', desc: '大部分时候你们想到一块去了，少数分歧反而更有意思。' },
  { min: 6, name: '还挺合拍', emoji: '🙂', desc: '合得来的地方不少，也各自藏着小心思。' },
  { min: 4, name: '各想各的', emoji: '🤔', desc: '你们看世界的角度差得有点远，但互补也挺好。' },
  { min: 0, name: '完全不熟', emoji: '😅', desc: '这结果说明你们还得再多多了解彼此呀。' },
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

function pickQuestions(catKey) {
  const pool = catKey === 'random'
    ? Object.values(QUESTION_BANK).flat()
    : (QUESTION_BANK[catKey] || [])
  return shuffle(pool).slice(0, 10)
}

export default function ChemistryGame({ onClose }) {
  const [phase, setPhase] = useState('setup') // setup | A | handoff | B | reveal
  const [cat, setCat] = useState('random')
  const [p1, setP1] = useState('玩家1')
  const [p2, setP2] = useState('玩家2')
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [ansA, setAnsA] = useState([])
  const [ansB, setAnsB] = useState([])
  const [revealed, setRevealed] = useState(0)
  const [copied, setCopied] = useState(false)

  function start() {
    setQuestions(pickQuestions(cat))
    setAnsA([]); setAnsB([]); setIdx(0); setRevealed(0); setCopied(false)
    setPhase('A')
  }

  function answer(value, who) {
    if (who === 'A') {
      const next = [...ansA, value]
      setAnsA(next)
      if (next.length >= questions.length) setPhase('handoff')
      else setIdx(next.length)
    } else {
      const next = [...ansB, value]
      setAnsB(next)
      if (next.length >= questions.length) setPhase('reveal')
      else setIdx(next.length)
    }
  }

  useEffect(() => {
    if (phase !== 'reveal') return
    if (revealed >= questions.length) return
    const t = setTimeout(() => setRevealed(revealed + 1), 320)
    return () => clearTimeout(t)
  }, [phase, revealed, questions.length])

  const total = questions.length
  const matchCount = phase === 'reveal'
    ? questions.reduce((n, q, i) => n + (ansA[i] === ansB[i] ? 1 : 0), 0)
    : 0
  const score = total ? Math.round((matchCount - total / 2) / (total / 2) * 100) : 0
  const tier = TIERS.find(t => matchCount >= t.min)

  const n1 = p1.trim() || '玩家1'
  const n2 = p2.trim() || '玩家2'

  if (phase === 'setup') {
    return (
      <div className="chem">
        <div className="chem__head">
          <h2 className="chem__title">默契大考验</h2>
          <p className="chem__sub">两人各答同一份题，看谁更懂对方。</p>
        </div>
        <div className="chem__field">
          <label>选择题库</label>
          <div className="chem__chips">
            {CATS.map(c => (
              <button key={c.key} type="button"
                className={'chem__chip' + (cat === c.key ? ' is-on' : '')}
                onClick={() => setCat(c.key)}>{c.label}</button>
            ))}
          </div>
        </div>
        <div className="chem__names">
          <input className="chem__input" value={p1} maxLength={8} onChange={e => setP1(e.target.value)} placeholder="玩家1昵称" />
          <span className="chem__vs">VS</span>
          <input className="chem__input" value={p2} maxLength={8} onChange={e => setP2(e.target.value)} placeholder="玩家2昵称" />
        </div>
        <button className="chem__btn" type="button" onClick={start}>开始测试 · 随机 10 题</button>
        <p className="chem__tip">同屏轮答：先一人答完，再把设备交给另一人。</p>
      </div>
    )
  }

  if (phase === 'handoff') {
    return (
      <div className="chem chem--center">
        <div className="chem__handoff">
          <div className="chem__emoji">🤫</div>
          <h2 className="chem__title">请把设备交给 {n2}</h2>
          <p className="chem__sub">确认 {n2} 没偷看 {n1} 的答案，再继续。</p>
          <button className="chem__btn" type="button" onClick={() => { setIdx(0); setPhase('B') }}>我准备好了 →</button>
        </div>
      </div>
    )
  }

  if (phase === 'reveal') {
    const share = '【默契大考验】' + n1 + ' VS ' + n2 + '\n默契度 ' + score + '%（' + matchCount + '/' + total + ' 题一致）\n' + tier.emoji + ' ' + tier.name + '：' + tier.desc
    function copy() {
      const ta = document.createElement('textarea')
      ta.value = share
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch (e) {}
      document.body.removeChild(ta)
    }
    return (
      <div className="chem">
        <div className="chem__result">
          <div className="chem__score">{score}</div>
          <div className="chem__scorelabel">默契度（调整分）</div>
          <div className="chem__tier">{tier.emoji} {tier.name}</div>
          <p className="chem__tierdesc">{tier.desc}</p>
        </div>
        <div className="chem__list">
          {questions.map((q, i) => {
            const open = i < revealed
            const hit = open && ansA[i] === ansB[i]
            return (
              <div className={'chem__row' + (open ? ' is-open' : '') + (open && hit ? ' is-hit' : '') + (open && !hit ? ' is-miss' : '')} key={q.id}>
                <div className="chem__q">{i + 1}. {q.q}</div>
                {open ? (
                  <div className="chem__ans">
                    <span className="chem__pick">{n1}：{ansA[i] === 'a' ? q.a : q.b}</span>
                    <span className="chem__pick">{n2}：{ansB[i] === 'a' ? q.a : q.b}</span>
                    <span className="chem__badge">{hit ? '一致 ✓' : '不同 ✗'}</span>
                  </div>
                ) : (
                  <div className="chem__ans chem__ans--lock">第 {i + 1} 题揭晓中…</div>
                )}
              </div>
            )
          })}
        </div>
        <div className="chem__actions">
          <button className="chem__btn chem__btn--ghost" type="button" onClick={() => setPhase('setup')}>重新设置</button>
          <button className="chem__btn" type="button" onClick={start}>换一批再测</button>
          <button className="chem__btn chem__btn--soft" type="button" onClick={copy}>{copied ? '已复制 ✓' : '复制结果'}</button>
        </div>
      </div>
    )
  }

  // phase A or B
  const who = phase === 'A' ? 'A' : 'B'
  const current = questions[idx]
  const ans = who === 'A' ? ansA : ansB
  const name = who === 'A' ? n1 : n2
  return (
    <div className="chem">
      <div className="chem__bar">
        <span className="chem__barname">{name} 作答中</span>
        <span className="chem__barnum">{idx + 1} / {total}</span>
      </div>
      <div className="chem__progress"><span style={{ width: (ans.length / total * 100) + '%' }} /></div>
      <div className="chem__qbox">
        <div className="chem__qnum">第 {idx + 1} 题</div>
        <div className="chem__qtext">{current.q}</div>
      </div>
      <div className="chem__opts">
        <button className="chem__opt" type="button" onClick={() => answer('a', who)}>
          <span className="chem__optkey">A</span>{current.a}
        </button>
        <button className="chem__opt" type="button" onClick={() => answer('b', who)}>
          <span className="chem__optkey">B</span>{current.b}
        </button>
      </div>
      <p className="chem__tip">🤫 别让对方看到你的选择</p>
    </div>
  )
}
