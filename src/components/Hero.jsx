const hearts = ['💗', '💕', '🌸', '💞', '🤍', '🌷', '💖', '🩷']

function FloatingHearts() {
  return (
    <div className="hero__bg" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="float-heart"
          style={{
            left: `${(i * 8.3 + Math.random() * 6) % 100}%`,
            animationDelay: `${Math.random() * 7}s`,
            animationDuration: `${7 + Math.random() * 6}s`,
            fontSize: `${14 + Math.random() * 18}px`,
          }}
        >
          {hearts[i % hearts.length]}
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <FloatingHearts />
      <div className="hero__inner">
        <span className="hero__eyebrow">专属于两个人的小世界</span>
        <h1 className="hero__title">
          测一测默契<br />
          玩一玩<span className="hl">心动</span>
        </h1>
        <p className="hero__sub">
          科学有趣的情侣评测 + 双人互动小游戏，<br />
          让你们在一起的每一天，都多一点甜。
        </p>
        <div className="hero__cta">
          <a href="#tests" className="btn btn--primary">开始评测 →</a>
          <a href="#games" className="btn btn--ghost">畅玩小游戏</a>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <b>128<span>万+</span></b>
            <span>情侣加入</span>
          </div>
          <div className="stat">
            <b>36<span>个</span></b>
            <span>趣味评测</span>
          </div>
          <div className="stat">
            <b>18<span>款</span></b>
            <span>双人游戏</span>
          </div>
        </div>
      </div>
    </section>
  )
}
