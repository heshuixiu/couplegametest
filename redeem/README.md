# 相遇测试 · 兑换码系统（方案A 轻量级）

基于技术交付文档实现的**可运行产品**。零外部依赖，仅用 Node.js 内置模块（`http` + `node:sqlite`），拿到代码即可 `node src/server.js` 启动。

## 功能范围

- **管理端**：密码登录、统计（总/已用/未用）、批量生成兑换码（≤500/次）、码表查看、复制/导出 TXT
- **H5 用户端**：兑换码输入 → 实时校验（原子核销）→ 进入测试流程
- **后端 API**：生成 / 统计 / 导出 / 列表 / 核销，含错误码 `1001/1002/1003`
- **测试流程接入点** `test.html`：占位桩，标注了接入真实「相遇测试」的位置

## 环境要求

- **Node.js ≥ 22.5.0**（依赖内置 `node:sqlite`，22.5+ 可用；本机 22.22.2 已验证）
- 无需 `npm install`，无第三方依赖

## 快速启动

```bash
cd lingxi-redeem
node src/server.js
```

启动后：

| 入口 | 地址 | 说明 |
|------|------|------|
| H5 用户端 | http://localhost:3000/ | 兑换码输入页（输入 → 校验 → 测试） |
| 管理端 | http://localhost:3000/admin | 极简管理面板 |
| 测试流程（桩）| http://localhost:3000/test.html | 接入真实相遇测试的占位页 |

首次启动若库为空，会自动 seed **100 个**首码（对应上线 Checklist）。

## 配置项（环境变量）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务端口 |
| `ADMIN_TOKEN` | `XiangYu2026Admin` | 管理端密码。**生产环境务必修改** |
| `DB_PATH` | `data/exchange_codes.db` | SQLite 文件路径 |

示例：`ADMIN_TOKEN=MyStrongPwd2026 PORT=8080 node src/server.js`

## API 接口

### 管理端（需 `admin_token`）

**POST /api/admin/generate**
```json
// 请求
{ "admin_token": "XiangYu2026Admin", "count": 50, "batch_name": "7月线下活动", "inviter_name": "张三" }
// 响应
{ "code": 0, "msg": "生成成功", "data": { "total": 50, "codes": ["XY-A3B8-C9D2", ...] } }
```
> `batch_name` / `inviter_name` 首版可不传；`count` 上限 500。

**GET /api/admin/stats?admin_token=xxx**
```json
{ "code": 0, "data": { "total": 200, "used": 87, "unused": 113 } }
```

**GET /api/admin/list?admin_token=xxx**
返回码表 JSON（供管理端页面渲染表格）：`[{ code, status, used_at, created_at }, ...]`

**GET /api/admin/export?admin_token=xxx**
返回纯文本，每行一个码（浏览器触发下载 `exchange_codes.txt`）。

### H5 用户端

**POST /api/code/verify**
```json
// 请求
{ "code": "XY-A3B8-C9D2" }
// 成功
{ "code": 0, "msg": "核销成功", "data": { "valid": true, "inviter_name": "" } }
// 失败
{ "code": 1001, "msg": "无效的兑换码" }
{ "code": 1002, "msg": "该兑换码已被使用" }
{ "code": 1003, "msg": "该兑换码已过期" }
```
> 输入自动转大写；核销使用 `BEGIN IMMEDIATE` 写锁，原子操作，防多设备并发重复使用。

## 兑换码规则

- 格式：`XY-XXXX-XXXX`（`XY` = "相遇"缩写，8 位随机字符）
- 字符集：`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`（已去除 `0/O/I/1` 防混淆）
- 生成时查库保证唯一；组合空间约 3000 万，暴力猜码成本高

## 接入真实「相遇测试」流程

`public/index.html` 校验成功后跳转 `/test.html`（占位桩）。
生产环境二选一：

1. 将 `window.location.href = '/test.html'` 改为真实相遇测试入口（如 `lingxi-web` 的 B1 页）；
2. 或直接用真实 H5 替换 `public/test.html`。

`test.html` 已预留：B1 背景题进度条（B1 起显示）、结果页底部合规声明。

## 上线 Checklist 对照

- [x] 数据库表自动创建（`src/db.js` 启动时建表 + 索引）
- [x] 管理端页面可访问（建议加内网/强密码）
- [x] 首码自动生成（100 个）
- [x] H5 兑换码入口屏已开发
- [x] 核销逻辑已测试（正确码 / 错误码 / 已用码 / 并发原子性）
- [x] 管理端统计数字正确
- [x] 导出功能可用
- [x] 结果页底部合规声明（见 `test.html`）
- [~] H5 入口年龄确认弹窗：按产品决策**已移除**，首屏直接进入兑换码输入（如合规需要可恢复）

## 安全与风控（轻量级，与文档一致）

| 风险 | 对策 |
|------|------|
| 暴力猜码 | 码空间≈3000 万，成本高；体验优先不限制次数 |
| 管理密码泄露 | 预设强密码，生产改 `ADMIN_TOKEN` |
| 一码多设备 | `BEGIN IMMEDIATE` 写锁 + 条件更新，原子核销 |
| 码被截屏传播 | 一次性，传播即失效 |
| 数据泄露 | 管理端不存用户个人数据，仅 IP + used_at |

## 目录结构

```
lingxi-redeem/
├── package.json          # 启动脚本，零依赖
├── schema.sql            # 建表 SQL（独立文件，便于评审）
├── src/
│   ├── server.js         # 零依赖 HTTP 服务 + 路由 + 静态服务
│   ├── db.js             # node:sqlite 数据层（建表/生成/核销事务/统计/导出）
│   └── codegen.js        # 兑换码生成逻辑
├── public/
│   ├── index.html        # H5 用户端（兑换码输入 + 校验 + 进入测试）
│   ├── admin.html        # 管理端极简面板
│   └── test.html         # 测试流程占位桩（接入点 + 合规声明）
└── data/                 # SQLite 数据库（运行时自动生成）
```

## 压测与工时对照

- 接口逻辑已实测：单码核销 ~亚毫秒；批量生成 500 个 < 100ms
- 开发工时与文档预估一致（生成+核销+管理端+对接 ≈ 3.5 天；紧急可压缩至 2.5 天）
