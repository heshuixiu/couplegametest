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

const SELF_READ = {
  1: {
    A: '你这人天生带点电。下班还有精神想约人吃饭看展，社交和新鲜事就是你的充电宝。跟你待着不闷，但师傅提醒一句：别把电量都耗在别人身上，也得留点给自己。',
    B: '你是个需要「关机时间」的人。外面热闹完了，你得自己待会儿才能回血。不是不爱人，是你得先把自己填满，才有余力给旁人。',
    C: '你这人讲究「对味」。遇上有趣的事，瞬间满血；无聊的场合，你秒变低电量。别逼自己一直稳定，你的节奏本来就是波浪形的。',
    D: '你表面看着随和，内里有个自己的小宇宙。副业、爱好、学习，你偷偷在那儿投入，那才是你真正回血的地方。',
  },
  2: {
    A: '你做人信「先做了再说」。比起后悔没做，你更怕错过。这股冲劲是你最大的福气，也是偶尔栽跟头的地方——冲之前稍微瞄一眼路就行。',
    B: '你心大，信「该来的会来」。不跟自己较劲，发生的事就接住。这份松弛很贵，但别让它变成什么都不争取。',
    C: '你做完决定会反刍——「要是选了另一条路呢？」想得深是你的天赋，可也得防着自己钻牛角尖。',
    D: '你最看重「这是我自己的主意」。为别人活、没活出自己，是你最怕的事。这辈子，自由比安稳重要。',
  },
  3: {
    A: '喜欢一个人，你会适度主动，但不纠缠。暧昧初期那点推拉，你其实挺享受。你不会作，分寸拿捏得刚好。',
    B: '你有好感会先观望，怕自作多情。慢热，但一旦认定，比谁都认真。你等的不是人，是「他也喜欢我」那个确定感。',
    C: '你不爱没话找话，却会甩一条有意思的内容「投石问路」。表面淡，心里门儿清，在意得很。',
    D: '你要的是明明白白的回应和深度默契。忽冷忽热、或者让你失去自我，都会让你没安全感。你宁可单身，不肯凑合。',
  },
  4: {
    A: '你眼光毒，也好看。门面有审美、或者正好是你找的东西，你才迈得进腿。你这人，标准和品味都清楚。',
    B: '你被有趣的人勾走。幽默、能带你看新世界的，对你杀伤力最大。无聊，是你感情的减分项。',
    C: '你认踏实。沉稳、靠谱、让你安心的人，比刺激更打动你。你图的是落地，不是心跳。',
    D: '你有审美洁癖。生活过得漂亮、专注热爱的，对你杀伤力大。氛围感，是你感情的入场券。',
    E: '你不设标准，缘分来了就走过去。不刻意、不强求，这份随缘，反倒让你容易撞上真东西。',
  },
}

const MASTER_OPEN = {
  A: '师傅看了你的题——你是个自带光源的人，走到哪都带能量，也带明确的偏好。',
  B: '师傅看了你的题——你是个松弛而有品味的人，不慌不忙地过自己的节奏。',
  C: '师傅看了你的题——你是个爱琢磨、重深度的人，表面随意，内里很有戏。',
  D: '师傅看了你的题——你是个认准就投入的人，要的是真实、踏实和自由。',
  E: '师傅看了你的题——你是个随缘而自在的人，不刻意不强求，缘分自己会来。',
}

const WHERE = {
  A: '对的人，多半在「好看又有内容」的地方。独立书店、设计展、有意思的咖啡馆、审美在线的市集。别去太嘈杂的场子，往「讲究」的地方走，你的缘分在那儿等你。',
  B: '你得往「好玩」的地方扎。脱口秀、livehouse、户外局、朋友组的奇怪局。能让你笑、让你新鲜的地方，藏着你的缘分。',
  C: '踏实的人不爱浪，他们就在各自的生活圈里。行业活动、读书会、长期运动的小团体、朋友介绍。慢但稳的路子，适合你。',
  D: '你的缘分在「过得好看」的场子里。画展、手作工坊、精致的小酒馆、审美在线的社群。你被氛围吸引，也得去氛围对的地方。',
  E: '你这人哪儿都能遇见。但师傅劝你，别只在日常里打转——换个常去的新店、报个一直想学的课，缘分就从不经意处来。',
}

const PARTNER = {
  A: '她是有见识的人，能跟你聊很深的话题，不肤浅。跟她说话，你觉得脑子被打开，时间过得飞快。',
  B: '她有趣、幽默，总能把你带去看新世界。跟她在一起，日子不重样，永远不会腻。',
  C: '她沉稳、靠谱，让你觉得安心。不定时放烟火，但你知道她一直在。这种踏实，正是你图的。',
  D: '她有审美、有品味，把日子过得很漂亮。看她生活，本身就是种享受。',
  E: '她专注在自己热爱的事里，那种「眼里有光」的样子最打动你。她不一定话多，但认真起来特别迷人。',
}

const TOGETHER = {
  A: '你们是「有来有回」的相处。你主动但不黏，她也给信号。暧昧期短、确定得快，平时各自精彩，见面就热乎。',
  B: '你们需要一点「确定感」打底。她得让你知道她也喜欢你，你才肯全情投入。一旦定了，你比谁都稳。',
  C: '你们不靠废话维系。平时各忙各的，偶尔甩个有意思的东西过去，心里都懂。沉默也不尴尬，是你们的默契。',
  D: '你们要的是「明文约定」。回应要明确，空间要给够，谁也别吞没谁。边界清楚的关系，才让你安心长久。',
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
  let layer3Letter = 'A'
  let layer4Letter = 'A'
  let partnerLetter = 'A'
  if (isResult) {
    const counts = { 1: {}, 2: {}, 3: {}, 4: {} }
    const overallCounts = {}
    answers.forEach((letter, i) => {
      const layer = QUESTIONS[i].layer
      counts[layer][letter] = (counts[layer][letter] || 0) + 1
      overallCounts[letter] = (overallCounts[letter] || 0) + 1
    })
    const pickBest = (obj) => {
      let best = null
      let bestN = -1
      for (const k of Object.keys(obj)) {
        if (obj[k] > bestN) {
          bestN = obj[k]
          best = k
        }
      }
      return best
    }
    for (const L of [1, 2, 3, 4]) {
      const best = pickBest(counts[L])
      layerResult.push({ layer: L, desc: SELF_READ[L][best] })
    }
    overallLetter = pickBest(overallCounts)
    layer3Letter = pickBest(counts[3])
    layer4Letter = pickBest(counts[4])
    partnerLetter = answers[13] || 'A' // Q14 吸引偏好
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
            <span className="quiz-result__emoji">🔮</span>
            <h3 className="quiz-result__title">师傅批命 · 你的相遇签</h3>
            <p className="quiz-result__desc quiz-result__overall">
              {MASTER_OPEN[overallLetter]}
            </p>

            <div className="quiz-section">
              <h4 className="quiz-section__title">一、你是个怎样的人</h4>
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
            </div>

            <div className="quiz-section">
              <h4 className="quiz-section__title">二、去哪里遇见对的人</h4>
              <p className="quiz-section__body">{WHERE[layer4Letter]}</p>
            </div>

            <div className="quiz-section">
              <h4 className="quiz-section__title">三、她是什么样的人</h4>
              <p className="quiz-section__body">{PARTNER[partnerLetter]}</p>
            </div>

            <div className="quiz-section">
              <h4 className="quiz-section__title">四、你们会怎样相处</h4>
              <p className="quiz-section__body">{TOGETHER[layer3Letter]}</p>
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
