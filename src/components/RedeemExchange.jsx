import { useState } from 'react'

export default function RedeemExchange() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = code.trim().toUpperCase()
    if (!/^XY-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(v)) {
      setMsg({ type: 'err', text: '格式不对哦，兑换码长这样：XY-XXXX-XXXX' })
      return
    }
    setMsg({
      type: 'ok',
      text: '兑换码格式正确 ✓ 核销服务即将上线，敬请期待属于你们的专属测评！',
    })
  }

  return (
    <section className="zone zone--alt" id="redeem">
      <div className="zone__head">
        <span className="zone__kicker">专属福利</span>
        <h2 className="zone__title">专属测评兑换</h2>
        <p className="zone__sub">输入兑换码，解锁你们的专属测评与隐藏彩蛋。</p>
      </div>
      <form className="redeem-form" onSubmit={handleSubmit}>
        <input
          className="redeem-form__input"
          type="text"
          placeholder="XY-XXXX-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={14}
          autoComplete="off"
          aria-label="兑换码"
        />
        <button className="btn btn--primary" type="submit">
          立即解锁
        </button>
      </form>
      {msg && (
        <p className={`redeem-form__msg redeem-form__msg--${msg.type}`}>
          {msg.text}
        </p>
      )}
      <p className="redeem-form__hint">
        还没有兑换码？关注公众号「怦怦测」参与活动即可获取。
      </p>
    </section>
  )
}
