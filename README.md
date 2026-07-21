# 怦怦测 · 情侣测试与双人小游戏平台

为 `couplegametest.link` 设计的首页（首页原型 / 首页第一版）。
技术栈：**React 18 + Vite 5**，纯前端、零后端依赖，方便后续扩展成多页应用。

## 设计风格
- 温馨浪漫风：粉紫渐变、柔和光感、漂浮爱心动效
- 区块：顶部导航 → Hero → 情侣测试区 → 双人游戏区 → 关于/特性 → 页脚
- 响应式：桌面 4 列卡片，平板 2 列，手机 1 列

## 本地运行
```bash
npm install        # 安装依赖（如缓存受限可用 --cache 指定本地目录）
npm run dev        # 启动开发服务器，默认 http://localhost:5173
npm run build      # 打包到 dist/ 用于部署
npm run preview    # 本地预览打包结果
```

## 目录结构
```
couplegametest/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Navbar.jsx     # 顶部导航
        ├── Hero.jsx       # 首屏（含漂浮爱心）
        ├── TestZone.jsx   # 情侣测试卡片区
        ├── GameZone.jsx   # 双人游戏卡片区
        ├── Features.jsx   # 平台特性
        └── Footer.jsx     # 页脚
```

## 后续可扩展
- 测试/游戏详情页（路由用 react-router）
- 接入真实题库与双人同步逻辑
- 配置 CI 自动部署到 couplegametest.link
