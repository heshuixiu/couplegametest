export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="brand" href="#top">
          <span className="brand__heart" aria-hidden="true">💗</span>
          <span className="brand__name">怦怦测</span>
        </a>
        <nav className="nav__links">
          <a href="#tests">评测</a>
          <a href="#games">游戏</a>
        </nav>
        <a href="#tests" className="btn btn--primary btn--sm">开始体验</a>
      </div>
    </header>
  )
}
