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
    A: '你这人天生带点电，属于「跟人待着就有劲」的那一类。下班了还有精神约人吃饭看展，周末也闲不住，社交和新鲜事就是你的充电宝。跟你待着不会闷，场子有你在就热闹。但师傅得提醒一句：你这电量看着旺，其实是会透支的，别把所有的光都分给别人，也得留一点给自己独处回血。学会偶尔说「不」，你的能量才供得上长期。',
    B: '你是个需要「关机时间」的人。外面热闹一场下来，你得自己待会儿、放空一下，才能把电充回来。这不是不爱人，是你得先把自己填满，才有余力给旁人。师傅看你是慢热型的安全感选手，表面安静，内里其实很清醒。别因为别人都说你「高冷」就勉强自己社交，你的节奏没毛病，找个人懂你就行。',
    C: '你这人讲究「对味」二字。遇上有趣的事、对劲的人，你瞬间满血，眼里都有光；可一旦场合无聊、聊不到一块，你秒变低电量，浑身不得劲。你的节奏本来就是波浪形的，有高有低才正常。师傅劝你别逼自己一直稳定在高位，该蔫就蔫，该燃就燃，顺着状态走，比硬撑着「情绪稳定」轻松多了。',
    D: '你表面看着随和好说话，内里却有个只属于自己的小宇宙。副业、爱好、学习，你偷偷在那儿投入大把精力，那才是你真正回血、真正有成就感的地方。别人可能觉得你「佛」，其实你只是把热情分给了自己认准的事。师傅说，守住这个精神自留地特别重要，那是你不管谈不谈恋爱，都不会塌的底气。',
  },
  2: {
    A: '你做人信「先做了再说」。比起后悔没做，你更怕的是错过。这股冲劲是你最大的福气，带着你尝过不少甜头；但也是偶尔栽跟头的地方，冲太猛容易漏看路边的坑。师傅建议你，重大决策前稍微瞄一眼再跳，不用磨蹭，只要那半秒钟的清醒，就能少悔好几年。',
    B: '你心大，信「该来的会来」。不跟自己较劲，发生的事就接住，失去的也不死抓。这份松弛很贵，是你不被焦虑拖着走的根本。但师傅也得点你一句：松弛不是躺平。别让它慢慢变成「什么都不争取」的借口，该你的，还是得伸手去拿。',
    C: '你做完决定会反刍，脑子里总转着「要是选了另一条路呢？」。想得深、看得透，是你天赋；可也容易把自己绕进去，为一个早翻篇的选择失眠。师傅教你一招：想可以，但给「复盘」定个时限，想明白了就翻篇，别让反复推演变成自我消耗。你这脑子，用对地方是利器。',
    D: '你这辈子最看重「这是我自己的主意」。为别人活、没活出自己，是你最怕最排斥的事。自由对你来说不是选项，是底线。所以你做的每个选择，背后都有股不肯将就的劲。师傅挺你这份清醒，但也提醒：自由不等于孤军奋战，愿意为对的人让一点步，不叫失去自我。',
  },
  3: {
    A: '喜欢一个人，你会适度主动，但不纠缠。暧昧初期那点推拉，你其实挺享受，像打一场有来有回的球。你不会作、不玩消失试探，分寸拿捏得刚好，让对方舒服也让自己有尊严。师傅说你是感情里难得的「松弛主动型」，这种姿态最吸引人，也最不容易把一手好牌打烂。',
    B: '你有好感会先观望，怕自作多情，怕热脸贴冷屁股。你是慢热型，得确认对方也有意思，才肯往前迈。你等的不是某个人，是「TA也喜欢我」那个确定感。师傅懂你，但也要说：太怕受伤的人，最容易错过。给点试探的空间，信号不对就撤，没什么丢人的。',
    C: '你不爱没话找话，更烦尬聊。可你有一手绝活，甩一条有意思的内容「投石问路」，既自然又不过界。表面淡，心里门儿清，对方回不回、怎么回，你全记着。师傅看你属于「行动派闷葫芦」，挺好，但别闷过头，真上心的人，值得你多说一句直白话。',
    D: '你要的是明明白白的回应和深度默契。忽冷忽热会让你不安，失去自我更会让你想逃。你宁可单身，也不肯凑合进一段让你萎缩的关系。这份清醒是护身符。师傅提醒：明确感要靠沟通换，不是靠猜，你不敢开口问，对方可能也蒙着。把要求说出来，反而省去一堆内耗。',
  },
  4: {
    A: '你眼光毒，也好看，对环境和人的审美都有门槛。门面有设计感、或者正好是你心心念念找的东西，你才迈得进腿。你这人，标准和品味都清楚，不将就。师傅说你是「颜控＋内容控」双修，光好看留不住你，光有料没卖相你也懒得凑。往审美在线的圈子里走，你的缘分质量最高。',
    B: '你被有趣的人勾走。幽默、能带你看新世界、让你笑出声的，对你杀伤力最大。无聊，是你感情里的一票否决项。师傅看你属于「体验型」，你要的是一起玩、一起新鲜，不是稳稳当当却平平淡淡。所以你得多往能制造惊喜的场子钻，别困在日复一日的老路线里。',
    C: '你认踏实。沉稳、靠谱、让你安心的人，比刺激更打动你。你图的是落地感，知道这个人一直在，不用天天猜。师傅说你是「长期主义」选手，开头可能不轰烈，但后劲足。别被一时的心跳晃了眼，能陪你走长路的，往往是那个让你心定的人。',
    D: '你有审美洁癖，对生活的「好看」有执念。把日子过得很漂亮、专注在自己热爱里的人，对你杀伤力最大。氛围感，是你感情的入场券。师傅提醒：你容易被「会生活」的表象吸引，但记得多看两层，漂亮背后有没有真东西。皮相和筋骨，你都值得有。',
    E: '你不设标准，缘分来了就走过去，不刻意也不强求。这份随缘，反倒让你少了好多焦虑，容易在不经意处撞上真东西。师傅挺你这份松弛，但也点一句：随缘不等于不动。你喜欢的场子、想试的事，还是得自己去，缘分不跑腿，得你迎上去接。',
  },
}

const MASTER_OPEN = {
  A: '师傅看了你的题，你是个自带光源的人。走到哪都带能量，也带明确的喜好和边界，不糊里糊涂。这样的你，磁场很强，吸引来的也都是鲜活的人。',
  B: '师傅看了你的题，你是个松弛而有品味的人。不慌不忙地过自己的节奏，不跟风、不焦虑。你这种「稳」，现在挺稀缺，也挺招人靠近。',
  C: '师傅看了你的题，你是个爱琢磨、重深度的人。表面随意，内里很有戏，想得比谁都透。跟你深聊过的人，很难忘记你。',
  D: '师傅看了你的题，你是个认准就投入的人。要的是真实、踏实和自由，虚的哄不住你。这种「轴」，是你感情里最硬的底线，也是最长的情分。',
  E: '师傅看了你的题，你是个随缘而自在的人。不刻意、不强求，缘分自己会来。你这种松弛感，本身就是一种吸引力。',
}

const WHERE = {
  A: '对的人，多半在「好看又有内容」的地方出没。独立书店、设计展、有意思的咖啡馆、审美在线的市集，都是你的磁场。师傅建议你少去太嘈杂、纯凑热闹的场子，那不是你的缘分池。往「讲究」的地方走，你的眼缘和TA的眼缘，会在同一个审美频率上撞上。',
  B: '你得往「好玩」的地方扎。脱口秀、livehouse、户外局、朋友组的一些「怪怪的」局，能让你笑、让你新鲜的地方，藏着你的缘分。师傅说你是被「体验」吸引的人，所以别老宅着刷手机，多出门、多凑热闹，你笑起来的样子，就是TA走不过去的理由。',
  C: '踏实的人不爱浪，TA们就在各自的生活圈里稳稳待着。行业活动、读书会、长期运动的小团体、朋友牵线的饭局，这些慢但稳的路子，最适合你。师傅劝你别嫌慢，你图的就是落地，而落地的关系，从来都是慢慢长出来的，急不得。',
  D: '你的缘分在「过得好看」的场子里。画展、手作工坊、精致的小酒馆、审美在线的社群，你被氛围吸引，也得去氛围对的地方，才遇得到同频的人。师傅提醒：去这些地方，带着「享受」的心态，别带着「来找对象」的任务感，越松弛，越容易遇见。',
  E: '你这人哪儿都能遇见，缘分的门路其实很宽。但师傅劝你一句：别只在日常那条老路线里打转。换个常去的新店、报个一直想学没学的课、去趟没去过的城市，缘分就从不经意处冒出来。动起来，是你最大的桃花阵。',
}

const PARTNER = {
  A: 'TA是有见识的人，脑子里有货，能跟你聊很深的话题，不肤浅。跟TA说话，你觉得脑子被打开，时间过得飞快，聊完还意犹未尽。师傅说，这种「智性吸引」对你极重要，光好看撑不了多久，能接住你思想的人，才留得住你。',
  B: 'TA有趣、幽默，总能把你带去看新世界。跟TA在一起，日子不重样，永远不会腻，平淡的事也能被TA讲出花来。你俩的相处，大概率是笑声比沉默多。师傅看你俩是「玩伴型」组合，开心是底色，这种轻松，最扛得住日子久了的无聊。',
  C: 'TA沉稳、靠谱，让你觉得安心。TA不定时放烟火，但你知道TA一直在，遇事不慌、答应的事能做到。这种踏实，正是你图的，你不需要天天心跳，你需要的是「背后有座山」的确定感。师傅说，你这种人，配踏实的人，才睡得着觉。',
  D: 'TA有审美、有品味，把日子过得很漂亮。看TA生活，本身就是种享受，从一杯咖啡的摆法到房间的布置，都有TA的巧思。你被这种「会生活」吸引，也容易被TA带着把日子过得更讲究。师傅提醒：皮相之外，也看TA有没有真骨头，漂亮加有料，才值得你动心。',
  E: 'TA专注在自己热爱的事里，那种「眼里有光」的样子最打动你。TA不一定话多，但认真起来特别迷人，讲到喜欢的东西会发光。你欣赏这种「有自己世界」的人，因为你自己也懂那种投入。师傅说，两个都有自留地的人在一起，反而谁也不吞没谁，各自精彩又彼此欣赏。',
}

const TOGETHER = {
  A: '你们是「有来有回」的相处。你主动但不黏，TA也给信号，像打一场舒服的球，谁都不累。暧昧期短、确定得快，平时各自精彩，见面就热乎。师傅说你们这种关系最怕「假装不在乎」，都爽快点，想了就说，比谁先谁后那点面子重要多了。',
  B: '你们需要一点「确定感」打底。TA得让你清楚知道TA也喜欢你，你才肯卸下防备全情投入。一旦定了，你比谁都稳，长情且专一。师傅懂你的怕，但提醒：确定感不是一次就够的，得靠平时一句「我在」慢慢攒。你敢开口要，TA才给得起。',
  C: '你们不靠废话维系。平时各忙各的，互不查岗，偶尔甩个有意思的东西过去，心里都懂。沉默也不尴尬，是你们独有的默契。师傅说这种「疏而不远」最舒服，但也点一句：再默契也得有开口的力气，重要的话，别总靠「你懂的」托着，偶尔直说，关系更实。',
  D: '你们要的是「明文约定」。回应要明确，空间要给够，谁也别吞没谁。边界清楚的关系，才让你安心、才走得长。师傅挺你这份清醒，很多关系烂就烂在「猜」。把规则摊开说：要什么、不要什么、底线在哪，反而比黏黏糊糊走得更远。',
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
              <h4 className="quiz-section__title">三、TA是什么样的人</h4>
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
