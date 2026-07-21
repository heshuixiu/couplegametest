'use strict';

// 兑换码生成逻辑（对应技术文档「六、兑换码生成逻辑」）
// 格式：XY-XXXX-XXXX
//  - XY：固定前缀（"相遇"缩写）
//  - XXXX-XXXX：8 位随机字符
//  - 字符集：大写字母 + 数字，去掉 0/O/I/1 避免混淆
const { codeExists } = require('./db');

// 推荐字符集：去掉 0 O I 1
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const PREFIX = 'XY';
const MAX_BATCH = 500; // 单次最大生成数量（防刷）

function randomPart(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return s;
}

/**
 * 生成一个全局唯一的兑换码（带查库去重）
 */
function generateOne() {
  let code;
  do {
    code = `${PREFIX}-${randomPart(4)}-${randomPart(4)}`;
  } while (codeExists(code));
  return code;
}

/**
 * 批量生成 count 个唯一兑换码
 * @param {number} count
 * @returns {string[]}
 */
function generateBatch(count) {
  const n = Math.max(1, Math.min(MAX_BATCH, Math.floor(count) || 1));
  const set = new Set();
  while (set.size < n) {
    set.add(generateOne());
  }
  return Array.from(set);
}

module.exports = { generateOne, generateBatch, CHARS, PREFIX, MAX_BATCH };
