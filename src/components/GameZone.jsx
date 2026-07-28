import { useState } from 'react'
import GameModal from './GameModal.jsx'

const basketball = {
  icon: '🏀',
  title: '投篮大挑战',
  desc: '考验手速与反应力的篮球小游戏，看你能连进几个球！和 ta 轮流刷分，谁高谁洗碗。',
  tag: '篮球',
  href: '/game.html',
}

const games = [
  {
    icon: '🎨',
    title: '你画我猜',
    desc: '一个比划一个猜，默契不够笑点来凑，玩到肚子疼。',
    tag: '热门',
  },
  {
    icon: '👀',
    title: '默契大考验',
    desc: '同时作答同一道题，看谁更懂对方的心思。',
    tag: '',
  },
  {
    icon: '🎲',
    title: '真心话大冒险',
    desc: '睡前必备小游戏，越玩越上头，话题永远不冷场。',
    tag: '推荐',
  },
  {
    icon: '🌱',
    title: '情侣打卡',
    desc: '一起养成心动小习惯，把日常过成连续剧。',
    tag: '新',
  },
]

export default function GameZone() {
  const [gameOpen, setGameOpen] = useState(false)
  return (
    <section className="zone zone--alt" id="games">
      <div className="zone__head">
        <span className="zone__kicker">GAME</span>
        <h2 className="zone__title">双人小游戏</h2>
        <p className="zone__sub">放下手机里的其他人，只和 ta 玩一会儿。</p>
      </div>
      <a className="card card--ball card--feature" href={basketball.href} onClick={(e) => { e.preventDefault(); setGameOpen(true); }}>
        <span className="card__icon" aria-hidden="true">{basketball.icon}</span>
        <div className="card__body">
          <h3 className="card__title">{basketball.title}</h3>
          <p className="card__desc">{basketball.desc}</p>
        </div>
        <span className="card__cta">开始挑战 →</span>
      </a>

      <div className="cards">
        {games.map((g) => (
          <a className="card" href="#games" key={g.title}>
            {g.tag && <span className="card__tag card__tag--alt">{g.tag}</span>}
            <span className="card__icon" aria-hidden="true">{g.icon}</span>
            <h3 className="card__title">{g.title}</h3>
            <p className="card__desc">{g.desc}</p>
            <span className="card__link">开始玩 →</span>
          </a>
        ))}
      </div>
      {gameOpen && <GameModal onClose={() => setGameOpen(false)} />}
    </section>
  )
}
