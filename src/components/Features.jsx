const features = [
  {
    icon: '🔬',
    title: '科学量表',
    desc: '测试基于心理学量表设计，结果有依据、不忽悠。',
  },
  {
    icon: '👫',
    title: '双人同步',
    desc: '邀请 ta 一起作答，实时比对答案，默契一目了然。',
  },
  {
    icon: '🔒',
    title: '隐私安全',
    desc: '答案本地加密，你们的悄悄话只有两个人看得到。',
  },
  {
    icon: '🎁',
    title: '持续上新',
    desc: '每周更新测试与游戏，新鲜感永不掉线。',
  },
]

export default function Features() {
  return (
    <section className="why" id="why">
      <div className="zone__head">
        <span className="zone__kicker">WHY US</span>
        <h2 className="zone__title">为什么选择怦怦测</h2>
        <p className="zone__sub">把浪漫做成产品，把陪伴做成日常。</p>
      </div>
      <div className="why__grid">
        {features.map((f) => (
          <div className="why__item" key={f.title}>
            <span className="why__icon" aria-hidden="true">{f.icon}</span>
            <h3 className="why__title">{f.title}</h3>
            <p className="why__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
