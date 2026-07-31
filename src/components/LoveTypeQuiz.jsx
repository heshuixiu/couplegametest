import { useState } from 'react'

// ===== 题目（28 题，四段式）=====
const SECTIONS = [
  { key: 'appetizer', name: '前菜·条件反射篇', hint: '凭直觉，限时 3 秒' },
  { key: 'main', name: '主菜·价值观拆解篇', hint: '' },
  { key: 'dessert', name: '甜点·潜意识投射篇', hint: '' },
  { key: 'trap', name: '隐藏机关·动态陷阱篇', hint: '' },
]

const RAW = {
  appetizer: [
    { q: '刷到网红店新品，你第一反应：', a: '截图发闺蜜群', b: '搜有没有团购', c: '看配料表有没有雷', d: '等半年再打卡' },
    { q: '冰箱只剩鸡蛋和青椒，你会：', a: '做青椒炒蛋', b: '下单外卖', c: '只煎蛋，青椒留着', d: '全扔了买新的' },
    { q: '发现约会对象穿了你最讨厌的荧光绿，你：', a: '夸他潮', b: '问是不是体育老师', c: '默默拍照发朋友', d: '提议改去没灯的地方' },
    { q: '奶茶店排队时后面人一直靠近，你：', a: '往前挪半步', b: '转身微笑提醒', c: '突然转头吓他', d: '直接换一家店' },
    { q: '对方发来 3 小时纪录片链接，你：', a: '回"码住"', b: '直接开倍速', c: '问有没有解说版', d: '分享自己更爱的片单' },
    { q: '约好爬山但暴雨，你：', a: '改逛商场', b: '搜室内攀岩', c: '躺平点外卖看电影', d: '提议雨中徒步' },
  ],
  main: [
    { q: '认为"浪漫"最接近：', a: '深夜海边烟花', b: '冰箱贴攒成地图', c: '他吃完你剩的饭', d: '互不打扰各刷手机' },
    { q: '收到手作礼物时你内心 OS：', a: '哇用心了！', b: '省钱了挺好', c: '不如直接转账', d: '希望别让我回送' },
    { q: '对方记错你忌口，你：', a: '开玩笑提醒', b: '自己挑出来不吃', c: '下次点菜抢过菜单', d: '觉得这人不靠谱' },
    { q: '旅行中迷路，你倾向：', a: '享受意外风景', b: '原地查地图', c: '问路边老奶奶', d: '责怪做攻略的人' },
    { q: '看到情侣穿同款不同色，你：', a: '觉得甜', b: '觉得土', c: '心想"我也有这衣服"', d: '毫无波澜' },
    { q: '吵架后对方买礼物求和，你：', a: '收了但继续冷战', b: '拆完就消气', c: '退掉换实用品', d: '直接谈问题本身' },
    { q: '认为"安全感"来自：', a: '随时报备行程', b: '共同存款数字', c: '能随时找到对方', d: '自己口袋有钱' },
    { q: '对方突然说要换城市发展，你：', a: '支持并规划见面', b: '考虑异地可行性', c: '觉得该分手', d: '直接打包行李同行' },
    { q: '最怕在关系中听到：', a: '"你变了"', b: '"随便"', c: '"我妈说"', d: '"早点睡"' },
  ],
  dessert: [
    { q: '如果恋爱是道菜，你选：', a: '毛血旺', b: '舒芙蕾', c: '白粥配咸菜', d: '分子料理' },
    { q: '对方手机相册全是风景，你：', a: '想一起去看', b: '觉得缺乏生活情趣', c: '怀疑在隐藏什么', d: '主动拍自己塞进去' },
    { q: '发现对方游戏 ID 叫"孤独剑客"，你：', a: '组队邀请', b: '觉得中二', c: '搜他战绩', d: '假装没看见' },
    { q: '如果恋爱有 BGM，你选：', a: 'city pop', b: '土味情歌', c: '纯钢琴曲', d: '随机白噪音' },
    { q: '对方送你盆栽，你会：', a: '认真养并汇报成长', b: '放阳台靠天吃饭', c: '转送别人', d: '查攻略研究品种' },
    { q: '认为"完美约会"结束方式是：', a: '看日出', b: '吃宵夜', c: '各自回家发消息', d: '约定下次时间' },
    { q: '如果恋爱是 App，你希望是：', a: '地图导航（明确路线）', b: '音乐软件（共享歌单）', c: '备忘录（记录细节）', d: '系统更新（总在变化）' },
  ],
  trap: [
    { q: '这道题你选 A 会扣分，选 B 会加隐藏属性，选 C…算了你随便选吧——', a: '已经选好了', b: '在思考规则', c: '跳过此题', d: '骂设计师', trap: true },
    { q: '以下哪种"忽然"最让你心动：', a: '忽然下雨他带伞', b: '忽然发来旧照片', c: '忽然说想见你', d: '忽然沉默' },
    { q: '如果只能保留一种感官恋爱，你选：', a: '嗅觉（气味记忆）', b: '触觉（拥抱温度）', c: '听觉（声音语气）', d: '味觉（共餐回忆）' },
    { q: '发现对方偷偷关注你所有社交小号，你：', a: '觉得被重视', b: '感到窒息', c: '开更多小号测试', d: '直接问他' },
    { q: '认为"成熟爱情"标志是：', a: '能一起沉默不尴尬', b: '能公开吵架', c: '能共享卫生巾/剃须刀', d: '能秒懂对方梗' },
    { q: '如果爱情有保质期，你希望：', a: '24 小时（浓烈）', b: '7 天（正好）', c: '100 年（永恒）', d: '别设期限' },
  ],
}

// 打平优先级（可据实测调整）
const TIE_ORDER = ['A', 'B', 'C', 'D']

// 扁平化题目 + 段信息
const QUESTIONS = []
SECTIONS.forEach((s) => {
  RAW[s.key].forEach((item) => {
    QUESTIONS.push({ ...item, sec: s.key, secName: s.name, secHint: s.hint })
  })
})
const LETTERS = ['a', 'b', 'c', 'd']
const LABEL = { A: '小太阳', B: '过日子', C: '侦探', D: '独行侠' }

// ===== 结果原型 =====
const TYPES = {
  A: {
    name: '热情黏合型', tag: '小太阳', emoji: '☀️',
    tagline: '恋爱里你就是行走的黏合剂，把两个人焊成一个小世界',
    core: '你天生外向、爱分享、情绪外放。刷到好吃的第一时间截图发群，喜欢一个人就恨不得把对方拉进你全部的社交版图。你给的爱是「看得见的」——朋友圈、闺蜜群、共同好友，全是你的秀场，但也正因如此，你的在意谁都看得见。',
    traits: ['主动制造连接，从不让关系冷场', '情绪价值拉满，是朋友圈里的气氛组', '认定一个人就大方炫耀，绝不扭捏'],
    relation: '在关系里你是「发起人」。约会安排、礼物清单、纪念日照样你包办，对方只要跟着你的节奏走就行。你不怕表达需求，也最怕对方「已读不回」式的冷淡。',
    attract: '你容易被「接得住你」的人吸引——表面安静、却愿意陪你疯、能接住你连环分享的人。太闷的会让你慌，太闹的又抢你风头。',
    mine: '你的雷区是「被冷处理」和「被迫低调」。要是对象让你「别发朋友圈了」，你会瞬间觉得爱被没收了。',
    quote: '给 TA 的一句话：「我不介意你慢热，但别让我一个人唱独角戏。」',
  },
  B: {
    name: '务实乐天型', tag: '过日子选手', emoji: '🍳',
    tagline: '不整虚的，能把日子过成段子的那种人',
    core: '你现实主义又乐天，遇事先想「划不划算、可不可行」。团购、倍速、拆完礼物就消气——你不是不浪漫，是浪漫得讲究性价比。你用玩笑化解尴尬，用行动代替誓言，是关系里最稳的那块底盘。',
    traits: ['看重可行性，异地先算见面成本', '用幽默消化矛盾，很少真的记仇', '嘴上说随便，其实心里有本明白账'],
    relation: '你是「定海神针」。吵架你先递台阶，搬家你先列清单，连旅行迷路你都能原地查地图找出路。你给的爱是「落地的」——未必惊艳，但绝对可靠。',
    attract: '你容易被「认真生活」的人吸引，也吃「反差萌」——比如一个很轴的理想主义者，正好补上你的务实。太飘的人你欣赏但难长期相处。',
    mine: '你的雷区是「无意义的消耗」和「情绪勒索」。要你陪聊三小时无解的 emo，不如直接给个方案。',
    quote: '给 TA 的一句话：「别问我浪漫什么意思，今晚吃啥你定，我买单。」',
  },
  C: {
    name: '冷静观察型', tag: '侦探', emoji: '🔍',
    tagline: '慢热、清醒、看人看到骨子里',
    core: '你习惯先观察再下注。看配料表、搜战绩、开小号测试——你不是多疑，是尊重自己的判断。你不轻易交心，但一旦认定，就是那种「我全都知道还选你」的深情。你的爱是「经过尽职调查后的长期持有」。',
    traits: ['细节控，记得住对方随口说的话', '保留空间，不喜欢被实时定位式捆绑', '独立，自己的精神自留地比恋爱重要'],
    relation: '你是「沉默的守护者」。不会天天报备，但对方真需要时能精准出现。你讨厌表演式亲密，更信「你懂我梗」这种暗号级默契。',
    attract: '你容易被「有内容」的人吸引——有爱好、有主见、不空心。一眼看穿的「傻白甜」或「中央空调」都入不了你的法眼。',
    mine: '你的雷区是「被控制」和「被敷衍」。偷偷查你小号你会窒息，随口「随便」你会直接扣分。',
    quote: '给 TA 的一句话：「我不查岗，但我都看得见。别把我当傻子就好。」',
  },
  D: {
    name: '自由疏离型', tag: '独行侠', emoji: '🦅',
    tagline: '要么全情，要么抽离，绝不半吊子',
    core: '你最看重自由与空间。等半年再打卡、全扔买新的、改去没灯的地方——你不是冷漠，是边界感极强。但别被表象骗了：真动心时你可能是那个「直接打包行李同行」的极端派。你的爱是「非 0 即 1 的豪赌」。',
    traits: ['边界清晰，讨厌被绑、被查、被安排', '要么极冷要么极热，没有中间态', '享受独处，自己就能把日子过好'],
    relation: '你是「不黏人的伴侣」。给彼此空间是你表达信任的方式，也希望你被同样对待。你不怕异地、不怕独处，怕的是「为你好」式的吞噬。',
    attract: '你容易被「也独立」的人吸引——两个各自精彩的人碰在一起，比黏一起更有张力。太黏的你会有点想逃。',
    mine: '你的雷区是「控制欲」和「道德绑架」。一句「我都是为你好」能让你瞬间下头。',
    quote: '给 TA 的一句话：「我选你的时候是全心的，所以也请你别来绑我。」',
  },
}

// 陷阱题彩蛋
const TRAP_LINE = {
  a: '陷阱题你秒选——行动力爆表，但也最容易先跳坑后看路。',
  b: '你在琢磨规则——你从不被表面话术带跑，清醒。',
  c: '你选择跳过——对套路有天然的抗体，厉害。',
  d: '你敢当面骂设计师——叛逆值拉满，恋爱里也吃软不吃硬。',
}

function tally(answers) {
  const count = { A: 0, B: 0, C: 0, D: 0 }
  let scored = 0
  QUESTIONS.forEach((q, i) => {
    if (q.trap) return
    const v = answers[i]
    if (v) { count[v.toUpperCase()]++; scored++ }
  })
  const ranked = ['A', 'B', 'C', 'D'].sort((x, y) => {
    if (count[y] !== count[x]) return count[y] - count[x]
    return TIE_ORDER.indexOf(x) - TIE_ORDER.indexOf(y)
  })
  return { count, scored, main: ranked[0], second: ranked[1] }
}

export default function LoveTypeQuiz({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [phase, setPhase] = useState('quiz') // quiz | result
  const [copied, setCopied] = useState(false)

  const total = QUESTIONS.length
  const cur = QUESTIONS[step]

  function choose(letter) {
    const next = answers.slice()
    next[step] = letter
    setAnswers(next)
    if (step < total - 1) setStep(step + 1)
    else setPhase('result')
  }
  function back() { if (step > 0) setStep(step - 1) }
  function restart() { setAnswers(Array(total).fill(null)); setStep(0); setPhase('quiz'); setCopied(false) }

  function copyResult(t) {
    const text = `【恋爱类型测评】我是 ${TYPES[t.main].emoji} ${TYPES[t.main].name}「${TYPES[t.main].tag}」\n${TYPES[t.main].tagline}\n隐藏面：${TYPES[t.second].name}「${TYPES[t.second].tag}」`
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select()
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch (e) {}
    document.body.removeChild(ta)
  }

  if (phase === 'result') {
    const { count, scored, main, second } = tally(answers)
    const t = TYPES[main]
    const trapAns = answers.find((_, i) => QUESTIONS[i].trap)
    const bars = ['A', 'B', 'C', 'D'].map((k) => ({
      k, pct: scored ? Math.round(count[k] / scored * 100) : 0,
    }))
    return (
      <div className="quiz-card" onClick={(e) => e.stopPropagation()}>
        {onClose && <button className="quiz-close" onClick={onClose} aria-label="关闭">×</button>}
        <div className="quiz-result">
          <span className="quiz-result__emoji">{t.emoji}</span>
          <div className="quiz-result__title">{t.name}「{t.tag}」</div>
          <div className="quiz-result__score">{t.tagline}</div>
          <div className="quiz-result__desc">{t.core}</div>
        </div>

        <div className="quiz-section">
          <div className="quiz-section__title">你的四维占比</div>
          <div className="quiz-section__body">
            {bars.map((b) => (
              <div key={b.k} style={{ margin: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>
                  <span>{b.k} · {LABEL[b.k]}</span><span>{b.pct}%</span>
                </div>
                <div className="quiz-progress" style={{ marginTop: 4 }}>
                  <span style={{ width: b.pct + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-section">
          <div className="quiz-section__title">关系里的你</div>
          <div className="quiz-section__body">
            <p className="quiz-result__desc" style={{ margin: '0 0 10px' }}>{t.relation}</p>
            <p className="quiz-result__desc" style={{ margin: '0 0 10px' }}><b>容易被谁吸引：</b>{t.attract}</p>
            <p className="quiz-result__desc" style={{ margin: '0 0 10px' }}><b>雷区：</b>{t.mine}</p>
          </div>
        </div>

        <div className="quiz-section">
          <div className="quiz-section__title">隐藏面 · {TYPES[second].name}「{TYPES[second].tag}」</div>
          <div className="quiz-section__body">
            <p className="quiz-result__desc" style={{ margin: 0 }}>你不全是「{t.tag}」。在某些时刻，{TYPES[second].name}的一面会冒出来——你比自己以为的更丰富。</p>
          </div>
        </div>

        {trapAns && (
          <div className="quiz-section">
            <div className="quiz-section__title">🕵️ 设计师的彩蛋</div>
            <div className="quiz-section__body">
              <p className="quiz-result__desc" style={{ margin: 0 }}>{TRAP_LINE[trapAns]}</p>
            </div>
          </div>
        )}

        <div className="quiz-result__actions">
          <button className="btn btn--primary" type="button" onClick={restart}>再测一次</button>
          <button className="btn btn--ghost" type="button" onClick={() => copyResult({ main })}>{copied ? '已复制 ✓' : '复制结果'}</button>
        </div>
      </div>
    )
  }

  const pct = Math.round((step / total) * 100)
  return (
      <div className="quiz-card" onClick={(e) => e.stopPropagation()}>
        {onClose && <button className="quiz-close" onClick={onClose} aria-label="关闭">×</button>}
      <div className="quiz-progress"><span style={{ width: pct + '%' }} /></div>
      <div className="quiz-count">
        {cur.secName}{cur.secHint ? `（${cur.secHint}）` : ''} · 第 {step + 1}/{total} 题
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-opts">
        {LETTERS.map((k) => (
          <button
            key={k}
            type="button"
            className={'quiz-opt' + (answers[step] === k ? ' is-picked' : '')}
            onClick={() => choose(k)}
          >
            <span style={{ fontWeight: 900, marginRight: 10, color: 'var(--primary)' }}>{k.toUpperCase()}</span>
            {cur[k]}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button type="button" onClick={back}
          style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 14 }}>
          ← 上一题
        </button>
      )}
    </div>
  )
}
