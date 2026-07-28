const tests = [
  {
    icon: '💞',
    title: '默契度评测',
    desc: '你们的想法到底有多同步？30 道题，看穿彼此的小心思。',
    tag: '热门',
  },
  {
    icon: '🌟',
    title: '恋爱类型评测',
    desc: '你是哪种恋人？找到最舒服的相处方式与表达爱的方式。',
    tag: '推荐',
  },
  {
    icon: '🌡️',
    title: '异地恋温度计',
    desc: '距离会不会让爱降温？测一测你们关系的抗压指数。',
    tag: '',
  },
  {
    icon: '🩹',
    title: '吵架修复力',
    desc: '矛盾之后你们能多快和好？看看这段感情的韧性有多强。',
    tag: '新',
  },
  {
    icon: '🎁',
    title: '专属测评兑换',
    desc: '输入兑换码，解锁你们的专属测评与隐藏彩蛋。',
    tag: '福利',
    href: '#redeem',
  },
]

export default function TestZone() {
  return (
    <section className="zone" id="tests">
      <div className="zone__head">
        <span className="zone__kicker">评测</span>
        <h2 className="zone__title">情侣评测</h2>
        <p className="zone__sub">好玩不无聊，测完更懂 ta。</p>
      </div>
      <div className="cards">
        {tests.map((t) => (
          <a className="card" href={t.href || '#tests'} key={t.title}>
            {t.tag && <span className="card__tag">{t.tag}</span>}
            <span className="card__icon" aria-hidden="true">{t.icon}</span>
            <h3 className="card__title">{t.title}</h3>
            <p className="card__desc">{t.desc}</p>
            <span className="card__link">去评测 →</span>
          </a>
        ))}
      </div>
    </section>
  )
}
