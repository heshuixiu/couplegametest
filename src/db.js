'use strict';

// 数据库层：基于 Node 内置 node:sqlite（零外部依赖）
// 表：exchange_codes，对应技术文档「二、数据库表设计」完整版
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'exchange_codes.db');

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');

// 建表（完整版字段，首版可只用子集，这里全建保证可扩展）
db.exec(`
  CREATE TABLE IF NOT EXISTS exchange_codes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    code         VARCHAR(20)  NOT NULL,
    status       TINYINT      NOT NULL DEFAULT 0,  -- 0=未使用 1=已使用
    batch_name   VARCHAR(50)  DEFAULT '',
    inviter_name VARCHAR(30)  DEFAULT '',
    used_at      DATETIME     DEFAULT NULL,
    user_ip      VARCHAR(45)  DEFAULT NULL,
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    expired_at   DATETIME     DEFAULT NULL         -- NULL=永不过期
  );
`);
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_code ON exchange_codes(code);');
db.exec('CREATE INDEX IF NOT EXISTS idx_status ON exchange_codes(status);');

// 预编译语句
const stmt = {
  insert: db.prepare(
    'INSERT INTO exchange_codes (code, batch_name, inviter_name, expired_at) VALUES (?, ?, ?, ?)'
  ),
  getByCode: db.prepare('SELECT * FROM exchange_codes WHERE code = ?'),
  countByCode: db.prepare('SELECT COUNT(*) AS c FROM exchange_codes WHERE code = ?'),
  markUsed: db.prepare(
    "UPDATE exchange_codes SET status = 1, used_at = ?, user_ip = ? WHERE code = ? AND status = 0"
  ),
  stats: db.prepare(
    'SELECT COUNT(*) AS total, ' +
      'SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS used, ' +
      'SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS unused ' +
      'FROM exchange_codes'
  ),
  listAll: db.prepare(
    'SELECT code, status, used_at, created_at FROM exchange_codes ORDER BY id DESC'
  ),
  countTotal: db.prepare('SELECT COUNT(*) AS c FROM exchange_codes'),
};

/**
 * 批量插入兑换码（已在调用方保证唯一性）
 * node:sqlite 无 db.transaction 助手，使用 BEGIN/COMMIT 手动事务
 */
function insertCodes(codes, batchName = '', inviterName = '', expiredAt = null) {
  db.exec('BEGIN');
  try {
    for (const c of codes) {
      stmt.insert.run(c, batchName, inviterName, expiredAt);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return codes.length;
}

function codeExists(code) {
  return stmt.countByCode.get(code).c > 0;
}

function getByCode(code) {
  return stmt.getByCode.get(code);
}

/**
 * 核销兑换码（原子操作，防多设备并发重复使用）
 * 使用 BEGIN IMMEDIATE 获取写锁，等效于 SELECT ... FOR UPDATE
 * 返回：
 *  { valid:true, inviter_name }
 *  { valid:false, err:1001 } 码不存在
 *  { valid:false, err:1002 } 已使用
 *  { valid:false, err:1003 } 已过期
 */
function verifyCode(code, userIp = null) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const row = stmt.getByCode.get(code);
    if (!row) { db.exec('ROLLBACK'); return { valid: false, err: 1001 }; }
    if (row.expired_at && new Date(row.expired_at).getTime() < Date.now()) {
      db.exec('ROLLBACK'); return { valid: false, err: 1003 };
    }
    if (row.status === 1) { db.exec('ROLLBACK'); return { valid: false, err: 1002 }; }
    // 标记已使用（仅当仍是未使用状态，条件更新保证原子性）
    const res = stmt.markUsed.run(new Date().toISOString(), userIp, code);
    if (res.changes !== 1) { db.exec('ROLLBACK'); return { valid: false, err: 1002 }; }
    db.exec('COMMIT');
    return { valid: true, inviter_name: row.inviter_name || '' };
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

function getStats() {
  const s = stmt.stats.get();
  return {
    total: s.total || 0,
    used: s.used || 0,
    unused: s.unused || 0,
  };
}

function exportText() {
  const rows = stmt.listAll.all();
  return rows.map((r) => r.code).join('\n');
}

function listAll() {
  return stmt.listAll.all();
}

function totalCount() {
  return stmt.countTotal.get().c;
}

module.exports = {
  db,
  insertCodes,
  codeExists,
  getByCode,
  verifyCode,
  getStats,
  exportText,
  listAll,
  totalCount,
};
