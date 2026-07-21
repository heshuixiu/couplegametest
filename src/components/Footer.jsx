export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="brand__heart" aria-hidden="true">💗</span>
          <span className="brand__name">怦怦测</span>
        </div>
        <p className="footer__slogan">愿每一对相爱的人，都被温柔以待。</p>
        <nav className="footer__links">
          <a href="#tests">评测</a>
          <a href="#games">游戏</a>
          <a href="#why">关于我们</a>
          <a href="#top">回到顶部</a>
        </nav>
        <p className="footer__copy">© 2026 怦怦测 · couplegametest.link · 用心陪伴每一段关系</p>
      </div>
    </footer>
  )
}
