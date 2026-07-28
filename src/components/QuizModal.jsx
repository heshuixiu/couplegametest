import { useState, useEffect } from 'react'

const QUESTIONS = [
  // 第一层：能量与节奏
  {
    layer: 1,
    q: '工作日下班后，你最典型的状态是？',
    options: [
      { letter: 'A', text: '还有精力，想约人吃饭/看展/逛一下' },
      { letter: 'B', text: '累透了，只想一个人安静待着' },
      { letter: 'C', text: '看情况，如果是有趣的事就能续上能量' },
      { letter: 'D', text: '回家继续做自己的副业/学习/爱好' },
    ],
  },
  {
    layer: 1,
    q: '关于“周末安排”，你的习惯更接近？',
    options: [
      { letter: 'A', text: '周五晚上就大致想好了周末怎么过' },
      { letter: 'B', text: '随性，睡醒看心情再决定' },
      { letter: 'C', text: '会有想做的事，但不会精确到时间点' },
      { letter: 'D', text: '周末是用来“补”的——补觉、补剧、补社交' },
    ],
  },
  {
    layer: 1,
    q: '你在一个陌生城市出差/旅行，有一整个下午自由时间，你会？',
    options: [
      { letter: 'A', text: '查攻略找最有名的地方打卡' },
      { letter: 'B', text: '随便逛，拐进小巷子看缘分' },
      { letter: 'C', text: '找个舒服的地方坐下来看人发呆' },
      { letter: 'D', text: '去本地人去的市场/社区感受真实生活' },
    ],
  },
  {
    layer: 1,
    q: '你在人群中更可能是哪种“存在感”？',
    options: [
      { letter: 'A', text: '气氛组，有我在不会冷场' },
      { letter: 'B', text: '安静的观察者，但关键时候会说话' },
      { letter: 'C', text: '专注在自己感兴趣的人和事上，其他不管' },
      { letter: 'D', text: '自然而然成为小圈子的中心' },
    ],
  },
  // 第二层：价值观与决策
  {
    layer: 2,
    q: '以下四种“人生遗憾”，你最容易共鸣哪一种？',
    options: [
      { letter: 'A', text: '后悔没去做，而不是后悔做错了' },
      { letter: 'B', text: '后悔没有好好珍惜某个人' },
      { letter: 'C', text: '后悔没有早点开始认真规划' },
      { letter: 'D', text: '后悔为了别人活，没活出自己' },
    ],
  },
  {
    layer: 2,
    q: '你做了一个重大决定之后，通常？',
    options: [
      { letter: 'A', text: '不再多想，往前走' },
      { letter: 'B', text: '偶尔会复盘，但不会后悔' },
      { letter: 'C', text: '反复想“如果选了另一个会怎样”' },
      { letter: 'D', text: '会跟信任的人聊一遍来确认' },
    ],
  },
  {
    layer: 2,
    q: '你更认同哪句话？',
    options: [
      { letter: 'A', text: '“运气是留给有准备的人的”' },
      { letter: 'B', text: '“顺其自然，该来的会来”' },
      { letter: 'C', text: '“你是什么样的人，就会吸引什么样的人”' },
      { letter: 'D', text: '“人这辈子最重要的是自由”' },
    ],
  },
  {
    layer: 2,
    q: '你做事更偏向？',
    options: [
      { letter: 'A', text: '先想清楚再动手，不喜欢返工' },
      { letter: 'B', text: '边做边调整，先动起来再说' },
      { letter: 'C', text: '看重结果，过程无所谓' },
      { letter: 'D', text: '看重过程，结果随缘' },
    ],
  },
  // 第三层：关系与情感模式
  {
    layer: 3,
    q: '你跟一个有好感的人刚加微信，接下来你会？',
    options: [
      { letter: 'A', text: '会主动找话题聊，但不会太频繁' },
      { letter: 'B', text: '等对方先说话，不确定对方有没有意思' },
      { letter: 'C', text: '会发一条有趣的内容试探一下' },
      { letter: 'D', text: '不太会闲聊，有事才联系，但心里会留意' },
    ],
  },
  {
    layer: 3,
    q: '你更怕在关系里遇到哪种情况？',
    options: [
      { letter: 'A', text: '对方需要太多，让我喘不过气' },
      { letter: 'B', text: '对方忽冷忽热，捉摸不透' },
      { letter: 'C', text: '两个人没有共同话题和兴趣' },
      { letter: 'D', text: '关系中失去自我，完全围着对方转' },
    ],
  },
  {
    layer: 3,
    q: '你看到一对老夫妻在路边摊一起吃面、不怎么说话，你第一反应是？',
    options: [
      { letter: 'A', text: '好温馨，这就是长久的感情' },
      { letter: 'B', text: '他们是不是没什么话说了' },
      { letter: 'C', text: '每个人有自己的相处方式，挺好' },
      { letter: 'D', text: '这种画面让我有点向往但又觉得遥远' },
    ],
  },
  {
    layer: 3,
    q: '你在感情中最需要的“安全感”来自于？',
    options: [
      { letter: 'A', text: '对方明确、稳定的回应' },
      { letter: 'B', text: '对方给你足够的个人空间' },
      { letter: 'C', text: '两个人有深度的沟通和默契' },
      { letter: 'D', text: '日常的陪伴和细节里的关心' },
    ],
  },
  // 第四层：场域与吸引偏好
  {
    layer: 4,
    q: '你路过一家从来没去过的店，什么因素最可能让你走进去？',
    options: [
      { letter: 'A', text: '门面/装修特别好看，有审美' },
      { letter: 'B', text: '里面看起来有很多有意思的书/物品' },
      { letter: 'C', text: '门口有人在排队或看起来很热闹' },
      { letter: 'D', text: '看到菜单/招牌上有你一直在找的东西' },
      { letter: 'E', text: '纯粹是因为刚好路过，没有为什么' },
    ],
  },
  {
    layer: 4,
    q: '你更愿意被什么样的人“吸引”？',
    options: [
      { letter: 'A', text: '有见识、能聊很多深度话题' },
      { letter: 'B', text: '有趣、幽默、带你看新世界' },
      { letter: 'C', text: '沉稳、靠谱、让你觉得安心' },
      { letter: 'D', text: '有审美、有品味、生活过得漂亮' },
      { letter: 'E', text: '专注在自己热爱的事情里的人' },
    ],
  },
  {
    layer: 4,
    q: '想象一下“相遇”的那个瞬间，你更希望它是哪种气质？',
    options: [
      { letter: 'A', text: '自然而然、不刻意的' },
      { letter: 'B', text: '有些意外、有点命运安排的戏剧感' },
      { letter: 'C', text: '双方都有明确的信号和好感' },
      { letter: 'D', text: '安静、默契、不需要太多言语' },
    ],
  },
]

const LAYER_TITLES = {
  1: '能量与节奏',
  2: '价值观与决策',
  3: '关系与情感模式',
  4: '场域与吸引偏好',
}

const LAYER_PROFILE = {
  1: {
    A: '你天生是「和人待着就有电」的类型，社交和新鲜体验是你的能量源。',
    B: '你的能量来自安静和自我空间，热闹之后需要一段「关机时间」回血。',
    C: '你不是恒定档位——遇到有趣的事立刻满血，无聊的事秒变低电量。',
    D: '你习惯把精力投在自己认准的事上，副业/爱好/学习是你的隐性充电器。',
  },
  2: {
    A: '你信「先做了再说」，比起后悔没做，更怕错过。决定后很少回头看。',
    B: '你倾向接受发生的事，不太跟自己较劲，相信该来的会来。',
    C: '你做决定后会反复推演「如果选另一条路」，深度思考是你的习惯。',
    D: '你最在意「这是我自己的选择」，活出自我比讨好别人更重要。',
  },
  3: {
    A: '有好感你会适度主动但不纠缠，挺享受暧昧初期的推拉。',
    B: '你习惯先看对方意思再出手，怕自作多情，慢热但认真。',
    C: '你不爱闲聊，却会用一条有意思的内容「投石问路」，心里其实很在意。',
    D: '你要的是明确回应和深度默契，忽冷忽热或失去自我都会让你没安全感。',
  },
  4: {
    A: '你被好看、有审美、或「正好是我找的东西」吸引，标准和眼光都清晰。',
    B: '你被有趣、幽默、能带你看新世界的人吸引，无聊是减分项。',
    C: '你被沉稳、靠谱、让你安心的人吸引，踏实比刺激重要。',
    D: '你被有品味、生活过得漂亮、或专注热爱的人吸引，氛围感很加分。',
    E: '你不太设标准，缘分到了就走过去，不刻意也不强求。',
  },
}

const OVERALL = {
  A: '你是自带光源的人——走到哪都带着能量和明确的偏好。',
  B: '你是松弛而有品味的人，不慌不忙地过自己的节奏。',
  C: '你是爱琢磨、重深度的人，表面随意内心很有戏。',
  D: '你是认准就投入的人，要的是真实、踏实和自由。',
  E: '你是随缘而自在的人，不刻意不强求，缘分自己会来。',
}

export default function QuizModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [picked, setPicked] = useState(null)
  const total = QUESTIONS.length
  const isResult = step >= total

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const choose = (letter) => {
    setPicked(letter)
    setAnswers((a) => [...a, letter])
    setTimeout(() => {
      setPicked(null)
      setStep((s) => s + 1)
    }, 240)
  }

  const restart = () => {
    setStep(0)
    setAnswers([])
    setPicked(null)
  }

  let layerResult = []
  let overallLetter = 'A'
  if (isResult) {
    const counts = { 1: {}, 2: {}, 3: {}, 4: {} }
    const overallCounts = {}
    answers.forEach((letter, i) => {
      const layer = QUESTIONS[i].layer
      counts[layer][letter] = (counts[layer][letter] || 0) + 1
      overallCounts[letter] = (overallCounts[letter] || 0) + 1
    })
    for (const L of [1, 2, 3, 4]) {
      let best = null
      let bestN = -1
      for (const k of Object.keys(counts[L])) {
        if (counts[L][k] > bestN) {
          bestN = counts[L][k]
          best = k
        }
      }
      layerResult.push({ layer: L, desc: LAYER_PROFILE[L][best] })
    }
    let overallN = -1
    for (const k of Object.keys(overallCounts)) {
      if (overallCounts[k] > overallN) {
        overallN = overallCounts[k]
        overallLetter = k
      }
    }
  }

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-card" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        {!isResult ? (
          <>
            <div className="quiz-progress">
              <span style={{ width: `${(step / total) * 100}%` }} />
            </div>
            <p className="quiz-count">
              第 {step + 1} / {total} 题
            </p>
            <h3 className="quiz-q">{QUESTIONS[step].q}</h3>
            <div className="quiz-opts">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o.letter}
                  className={`quiz-opt ${picked === o.letter ? 'is-picked' : ''}`}
                  onClick={() => choose(o.letter)}
                >
                  <b>{o.letter}.</b> {o.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="quiz-result">
            <span className="quiz-result__emoji">✨</span>
            <h3 className="quiz-result__title">你的相遇画像</h3>
            <p className="quiz-result__desc quiz-result__overall">
              {OVERALL[overallLetter]}
            </p>
            <div className="quiz-layers">
              {layerResult.map((r) => (
                <div className="quiz-layer" key={r.layer}>
                  <span className="quiz-layer__title">
                    {LAYER_TITLES[r.layer]}
                  </span>
                  <span className="quiz-layer__desc">{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="quiz-result__actions">
              <button className="btn btn--ghost btn--sm" onClick={restart}>
                再测一次
              </button>
              <button className="btn btn--primary btn--sm" onClick={onClose}>
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
