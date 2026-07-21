'use strict';

// 零依赖后端服务：Node 内置 http + node:sqlite
// 提供管理端接口、H5 核销接口、静态页面服务
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const db = require('./db');
const { generateBatch } = require('./codegen');

const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'XiangYu2026Admin';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// 首码种子：首次运行若表为空，自动生成 100 个（对应上线 Checklist）
function seedIfEmpty() {
  if (db.totalCount() === 0) {
    const codes = generateBatch(100);
    db.insertCodes(codes);
    console.log(`[seed] 已自动生成首批 ${codes.length} 个兑换码`);
  }
}
seedIfEmpty();

// ---------- 工具函数 ----------
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1e6) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  });
}

// ---------- API 处理 ----------
async function handleApi(req, res, url) {
  const p = url.pathname;

  // ---- 管理端：生成 ----
  if (p === '/api/admin/generate' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.admin_token !== ADMIN_TOKEN) {
      return sendJSON(res, 403, { code: 4001, msg: '管理员密码错误' });
    }
    const count = Number(body.count) || 0;
    if (count < 1) return sendJSON(res, 400, { code: 4002, msg: 'count 必须为正整数' });
    if (count > 500) return sendJSON(res, 400, { code: 4003, msg: '单次最多生成 500 个' });
    const codes = generateBatch(count);
    db.insertCodes(codes, body.batch_name || '', body.inviter_name || '', null);
    return sendJSON(res, 200, {
      code: 0,
      msg: '生成成功',
      data: { total: codes.length, codes },
    });
  }

  // ---- 管理端：统计 ----
  if (p === '/api/admin/stats' && req.method === 'GET') {
    if (url.searchParams.get('admin_token') !== ADMIN_TOKEN) {
      return sendJSON(res, 403, { code: 4001, msg: '管理员密码错误' });
    }
    const s = db.getStats();
    return sendJSON(res, 200, { code: 0, data: s });
  }

  // ---- 管理端：码表列表（供管理端页面渲染表格）----
  if (p === '/api/admin/list' && req.method === 'GET') {
    if (url.searchParams.get('admin_token') !== ADMIN_TOKEN) {
      return sendJSON(res, 403, { code: 4001, msg: '管理员密码错误' });
    }
    const rows = db.listAll().map((r) => ({
      code: r.code,
      status: r.status,
      used_at: r.used_at || '',
      created_at: r.created_at || '',
    }));
    return sendJSON(res, 200, { code: 0, data: rows });
  }

  // ---- 管理端：导出（纯文本，每行一个码）----
  if (p === '/api/admin/export' && req.method === 'GET') {
    if (url.searchParams.get('admin_token') !== ADMIN_TOKEN) {
      return sendJSON(res, 403, { code: 4001, msg: '管理员密码错误' });
    }
    const text = db.exportText();
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="exchange_codes.txt"',
    });
    return res.end(text);
  }

  // ---- H5 用户端：核销 ----
  if (p === '/api/code/verify' && req.method === 'POST') {
    const body = await readBody(req);
    const code = String(body.code || '').trim().toUpperCase();
    if (!code) return sendJSON(res, 400, { code: 1000, msg: '请输入兑换码' });

    // 测试旁路：演示码直接放行（不消耗数据库真实码，便于本地点穿全流程）
    // 生产部署时设 DEMO_CODE= 空 或 删除该环境变量即可关闭
    const DEMO_CODE = (process.env.DEMO_CODE || 'DEMO2026').toUpperCase();
    if (DEMO_CODE && code === DEMO_CODE) {
      return sendJSON(res, 200, {
        code: 0,
        msg: '核销成功（演示模式）',
        data: { valid: true, inviter_name: '演示', demo: true },
      });
    }

    const result = db.verifyCode(code, getClientIp(req));
    if (result.valid) {
      return sendJSON(res, 200, {
        code: 0,
        msg: '核销成功',
        data: { valid: true, inviter_name: result.inviter_name },
      });
    }
    if (result.err === 1001) return sendJSON(res, 200, { code: 1001, msg: '无效的兑换码' });
    if (result.err === 1002) return sendJSON(res, 200, { code: 1002, msg: '该兑换码已被使用' });
    if (result.err === 1003) return sendJSON(res, 200, { code: 1003, msg: '该兑换码已过期' });
    return sendJSON(res, 200, { code: 1001, msg: '无效的兑换码' });
  }

  // ---- 公开健康检查（供 Railway/Render healthcheck，无需鉴权）----
  if (p === '/api/health' && req.method === 'GET') {
    return sendJSON(res, 200, { code: 0, ok: true, ts: Date.now() });
  }

  return sendJSON(res, 404, { code: 404, msg: '接口不存在' });
}

// ---------- 静态页面路由 ----------
function handleStatic(req, res, url) {
  let p = url.pathname;
  if (p === '/') p = '/index.html';
  if (p === '/admin') p = '/admin.html';

  // 防目录穿越
  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safe);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  serveStatic(res, filePath);
}

// ---------- 主服务 ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
    } else {
      handleStatic(req, res, url);
    }
  } catch (e) {
    console.error('[error]', e.message);
    if (!res.headersSent) sendJSON(res, 500, { code: 500, msg: '服务器内部错误' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`兑换码系统已启动: http://localhost:${PORT}`);
    console.log(`  H5 用户端:  http://localhost:${PORT}/`);
    console.log(`  管理端:    http://localhost:${PORT}/admin`);
    console.log(`  管理员密码: ${ADMIN_TOKEN}`);
  });
}

module.exports = server;
