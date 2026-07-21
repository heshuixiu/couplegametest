# 部署上线手册 · 兑换码系统

把 `redeem/` 下的兑换码系统跑在公网，并绑定子域 `redeem.couplegametest.link`。

---

## 〇、现在的状态（先确认）

- ✅ 代码已在 GitHub `heshuixiu/couplegametest` 的 `main` 分支，兑换码 app 位于仓库 `redeem/` 子目录
- ✅ 已包含修复：`/api/health` 健康检查端点（避免部署时 healthcheck 失败）、真实流程接入（线上跳 `www.couplegametest.link`）
- ✅ 仓库 `redeem/` 下已附 `railway.toml`、`render.yaml` 两套配置
- ⚠️ 仓库是**公开**的，默认管理员密码 `XiangYu2026Admin` 与演示码 `DEMO2026` 已暴露，**部署前必须改掉**（见各路径第 4 步）

---

## 一、域名规划（先看，避免冲突）

| 域名 | 用途 | 说明 |
|------|------|------|
| `www.couplegametest.link` | **真实相遇测试 H5**（已有内容）| 不要动它 |
| `redeem.couplegametest.link` | **本兑换码 app**（要新建）| 部署目标子域 |

> ⚠️ **不要把 app 绑到 `couplegametest.link` 根域**：根域和 `www` 通常指向同一站（真实 H5），绑 app 会盖掉真实 H5。本 app 一律用子域 `redeem.couplegametest.link`，和真实 H5 互不干扰。校验成功后 `index.html` 跳的是 `www.couplegametest.link`（真实 H5），不受 app 部署域名影响。

---

## 二、路径 A：Render（推荐，免费，步骤最少）

### A1. 登录并新建服务
- 打开 https://render.com → 右上角 **Sign In** → 选 **GitHub**（用同一个 GitHub 账号授权）
- 登录后右上角 **New** → **Web Service**

```
┌─ Create a new Web Service ───────────────────────────┐
│  Connect a repository                                 │
│  ● GitHub  (已连接 heshuixiu/couplegametest)   [✓]    │
│                                                       │
│  [ 选择仓库: heshuixiu/couplegametest        ▼ ]      │
│                                                       │
│  [ Cancel ]              [ Connect ]                  │
└───────────────────────────────────────────────────────┘
```
点 **Connect**。

### A2. 基础配置（关键：Root Directory 必须填 `redeem`）

```
┌─ Configure heshuixiu/couplegametest ─────────────────┐
│  Name:  [ couplegametest-redeem      ]  (随便起)      │
│                                                       │
│  Instance Type:                                       │
│  ● Free  (512 MB RAM, 0.1 CPU, 免费)                  │
│  ○ Starter / Standard ...                             │
│                                                       │
│  Root Directory (optional):                          │
│  [ redeem                           ]  ← 必须填!      │
│                                                       │
│  Runtime:  ● Node   ○ Native / Others                │
│  Region:   [ Oregon (默认)               ▼ ]          │
│                                                       │
│  Branch:   [ main                            ▼ ]      │
│                                                       │
│  Build Command:   [ (留空) ]                          │
│  Start Command:   [ node --experimental-sqlite src/server.js ] │
│                                                       │
│  [ Advanced ]  (Health Check Path 在 A4 填)          │
│                                                       │
│  [ Cancel ]              [ Create Web Service ]       │
└───────────────────────────────────────────────────────┘
```
- **Root Directory** 填 `redeem`（否则 Render 在仓库根找 `package.json` 找不到）
- **Build Command** 留空（零依赖，无需 `npm install`）
- **Start Command** 填 `node --experimental-sqlite src/server.js`
- 点 **Create Web Service**（先不急填变量，下一步在控制台补）

### A3. 等首次构建
- 页面自动跳到服务详情，底部 **Events / Logs** 会滚动
- 看到 `Listening on port 3000`（或 `兑换码系统已启动`）说明起来了
- 顶部给你一个默认地址 `https://<服务名>.onrender.com`（**下一步绑子域前先记下它**）

### A4. 填生产环境变量
- 服务详情页切到 **Environment** 标签 → **Add Environment Variable**，逐条加：

```
┌─ Environment Variables ──────────────────────────────┐
│  KEY                  VALUE                           │
│  ──────────────────  ────────────────────────────── │
│  NODE_VERSION         22                             │
│  ADMIN_TOKEN          <你的强密码, 例如 Xy#7kP9qRdm> │  ← 覆盖默认公开密码
│  DEMO_CODE            (空, 什么都不填)               │  ← 关掉 DEMO2026 白嫖
│  DB_PATH              /data/exchange_codes.db        │
│                                                       │
│  [ + Add ]                                           │
└───────────────────────────────────────────────────────┘
```
- `ADMIN_TOKEN`：**必须**设成只有你知道的强密码，别用默认 `XiangYu2026Admin`
- `DEMO_CODE`：**留空**（删掉框里任何内容），否则任何人输 `DEMO2026` 都能进测试
- 加完后，服务会**自动重新部署**（Deploy 重新开始）

### A5. 挂持久磁盘（防重启丢兑换码）
- 服务详情页切到 **Disks** 标签 → **Add Disk**

```
┌─ Add Disk ───────────────────────────────────────────┐
│  Name:        [ redeem-data ]                        │
│  Mount Path:  [ /data ]        ← 必须 /data          │
│  Size:        [ 1 ] GB          (免费额度内够用)     │
│                                                       │
│  [ Add Disk ]                                        │
└───────────────────────────────────────────────────────┘
```
- **必须挂**：Render 容器文件系统是临时的，不挂盘重启就清空兑换码数据库
- 挂盘后服务再重启一次，`DB_PATH=/data/exchange_codes.db` 才会落到持久盘

### A6. 验证功能
- 打开 `https://<服务名>.onrender.com/`
  - 兑换码输入页正常 → 用管理端生成的**真实码**能放行；演示码已被关，输 `DEMO2026` 应提示「无效兑换码」
- 打开 `https://<服务名>.onrender.com/admin`
  - 用你设的 `ADMIN_TOKEN` 登录 → 看统计、能生成码、能导出

### A7. 绑子域 `redeem.couplegametest.link`（见下方「四、DNS 绑定」）

### A8. 收尾
- 部署变绿、子域验证通过、HTTPS 自动签发后，对外地址就是 `https://redeem.couplegametest.link/`
- 至此上线完成

---

## 三、路径 B：Railway

### B1. 登录并新建项目
- 打开 https://railway.app → **Login** → 选 **GitHub**
- 登录后 **New Project** → **Deploy from GitHub repo** → 选 `heshuixiu/couplegametest`

### B2. 设 Root Directory
- 项目进来后，点生成的 **Service** → **Settings** → 找到 **Root Directory**
- 填 `redeem`（Railway 会读取该目录下的 `railway.toml`，里面已配好 startCommand 和 healthcheckPath）

```
┌─ Service Settings ───────────────────────────────────┐
│  Source:     GitHub · heshuixiu/couplegametest        │
│  Root Directory:  [ redeem            ]  ← 填这个    │
│  ...                                                 │
└───────────────────────────────────────────────────────┘
```

### B3. 填变量
- 切到 **Variables** → **New Variable**，逐条加（同 Render）：

```
┌─ Variables ──────────────────────────────────────────┐
│  NODE_VERSION = 22                                   │
│  ADMIN_TOKEN  = <你的强密码>                          │
│  DEMO_CODE    = (空)                                 │
│  DB_PATH      = /data/exchange_codes.db              │
└───────────────────────────────────────────────────────┘
```

### B4. 挂 Volume
- 切到 **Volumes** → **Add Volume** → Mount Path 填 `/data`，大小 `1 GB`

### B5. 部署并查看默认域名
- 改完配置会自动 Deploy
- **Settings → Domains** 里能看到分配的默认子域 `https://<项目>.up.railway.app`（记下，绑子域要用）

### B6. 验证
- 同 Render A6：默认域名下 `/` 和 `/admin` 功能正常、演示码已关

### B7. 绑子域 `redeem.couplegametest.link`（见下方「四、DNS 绑定」，目标地址填 `*.up.railway.app`）

---

## 四、DNS 绑定 `redeem.couplegametest.link`（关键）

> 这一步让 `redeem.couplegametest.link` 指向你的 Render/Railway 服务，并自动配 HTTPS。分两边操作：**域名注册商（加 CNAME）** + **平台（加 Custom Domain 并验证）**。

### 第 1 边：平台加 Custom Domain
- **Render**：服务详情 → **Settings** → **Custom Domains** → 输入 `redeem.couplegametest.link` → Add
- **Railway**：服务 → **Settings → Domains** → **Generate Domain** 旁选 **Custom Domain** → 输入 `redeem.couplegametest.link`
- 加完后平台会显示一条**目标地址（DNS Target）**：
  - Render 形如 `couplegametest-redeem.onrender.com`
  - Railway 形如 `redeem.couplegametest.link.up.railway.app`（或你项目默认子域）

```
┌─ Custom Domains ─────────────────────────────────────┐
│  redeem.couplegametest.link                          │
│  Status:  ⏳ Awaiting CNAME (未验证)                  │
│  DNS Target:  couplegametest-redeem.onrender.com  ← 记下这个 │
└───────────────────────────────────────────────────────┘
```

### 第 2 边：域名注册商 / DNS 托管加 CNAME
去你买 `couplegametest.link` 的地方（Cloudflare / GoDaddy / Namecheap / 阿里云 等）的 DNS 管理：

```
┌─ DNS 记录 (couplegametest.link) ─────────────────────┐
│  类型   名称        值/目标                     TTL    │
│  ────── ──────────  ─────────────────────────────── │
│  CNAME  redeem      couplegametest-redeem.onrender.com 自动 │  ← 新增这条
│  (已有) www        <真实H5的目标/或A记录>          自动 │  ← 别动,真实H5
│  (如有) @          <旧站点>                       自动 │  ← 别动,根域旧站
└───────────────────────────────────────────────────────┘
```
- **新增一条 CNAME**：名称 `redeem`，值 = 平台给的 DNS Target
- **不要动** `www` 和根域 `@` 的记录——那是真实 H5 和旧站的，碰了会让它们打不开
- 如果 DNS 服务商要求 CNAME 名称带后缀，就填 `redeem.couplegametest.link`（完整）

### 第 3 边：回平台点 Verify
- 等几分钟~几小时（DNS 全球生效），回平台 Custom Domain 页 → **Verify**
- 状态变 ✅ **Active**，平台自动签发 Let's Encrypt SSL 证书
- 打开 `https://redeem.couplegametest.link/` 即正式上线

```
┌─ Custom Domains ─────────────────────────────────────┐
│  redeem.couplegametest.link                          │
│  Status:  ✅ Active (SSL 已签发)                      │
│  🔗 https://redeem.couplegametest.link               │
└───────────────────────────────────────────────────────┘
```

> **Cloudflare 用户注意**：若 `redeem` 的 CNAME 指向 `*.onrender.com` / `*.up.railway.app`，把这条记录的 **代理状态（橙色云）关掉（变灰/DNS only）**，否则 Cloudflare 会拦截平台证书的校验。等 Verify 通过后再按需开启。

---

## 五、生产上线检查清单

- [ ] 代码已在 GitHub `main`（含 `/api/health` 与真实流程接入）
- [ ] `ADMIN_TOKEN` 已设强密码（非默认 `XiangYu2026Admin`）
- [ ] `DEMO_CODE` 为空（演示码 `DEMO2026` 已关）
- [ ] `NODE_VERSION=22`，Start Command 带 `--experimental-sqlite`
- [ ] 持久盘 `/data` 已挂，`DB_PATH=/data/exchange_codes.db`
- [ ] Health Check Path = `/api/health`
- [ ] 子域 `redeem.couplegametest.link` 的 CNAME 指向平台，Verify ✅、SSL 已签发
- [ ] `www.couplegametest.link`（真实 H5）和根域 `@` 的 DNS 记录**未改动**
- [ ] 访问 `https://redeem.couplegametest.link/admin` 能登录、`/` 能正确核销真实码

---

## 六、故障排查

| 现象 | 原因 | 解决 |
|------|------|------|
| 一直 `Deploying` / 反复重启 | Health Check Path 指向了需鉴权的接口 | 设为 `/api/health`（已推新代码）；兜底填 `/` |
| 启动报 `node:sqlite` 不存在 | Node < 22 或没带标志 | `NODE_VERSION=22` + Start Command 加 `--experimental-sqlite` |
| 重启后兑换码没了 | 没挂持久盘，写在临时文件系统 | 挂 `/data` 卷，设 `DB_PATH=/data/exchange_codes.db` |
| `/admin` 登不上 | 用了默认密码或填错 | 用你设的 `ADMIN_TOKEN`；确认变量名拼写 |
| 子域一直 Awaiting CNAME | DNS 没生效或 CNAME 值错 | 确认 CNAME `redeem` → 平台 DNS Target；等 TTL 生效 |
| 子域 Verify 不过（Cloudflare）| 代理云挡了证书校验 | 该 CNAME 记录关代理（DNS only / 灰云） |
| 页面打不开（直接双击 html）| 走 `file://` 而非服务地址 | 必须通过 `https://redeem.couplegametest.link/` 访问 |

---

## 七、真实测试流程接入（已完成）

- `redeem/public/index.html` 校验成功后：
  - **线上**跳 `https://www.couplegametest.link/?code=XY-XXXX-XXXX&inviter=<邀请人>`（inviter 仅管理端生成码时填才带，用于来源追踪）
  - **本地** `localhost` 仍走占位桩 `/test.html`（方便不依赖线上环境点穿）
- `test.html` 仅作**本地调试占位桩**（含 B1 进度条 + 结果页合规声明），上线后可不依赖它
- 无需再改跳转逻辑，部署即生效
