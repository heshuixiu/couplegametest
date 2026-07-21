-- 兑换码系统 · 建表 SQL（方案A 轻量级 · 完整版字段）
-- 引擎：SQLite（Node 内置 node:sqlite，零外部依赖）
-- 说明：code 唯一索引保证不重复；status 普通索引用于统计

CREATE TABLE IF NOT EXISTS exchange_codes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  code         VARCHAR(20)  NOT NULL,                 -- 兑换码，格式 XY-XXXX-XXXX
  status       TINYINT      NOT NULL DEFAULT 0,       -- 0=未使用 1=已使用
  batch_name   VARCHAR(50)  DEFAULT '',               -- 批次名称
  inviter_name VARCHAR(30)  DEFAULT '',               -- 管理者名称
  used_at      DATETIME     DEFAULT NULL,             -- 使用时间
  user_ip      VARCHAR(45)  DEFAULT NULL,             -- 使用时 IP（轻量防刷+日志）
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,-- 创建时间
  expired_at   DATETIME     DEFAULT NULL              -- 过期时间，NULL=永不过期
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_code   ON exchange_codes(code);
CREATE INDEX        IF NOT EXISTS idx_status ON exchange_codes(status);

-- 首版简化版（如资源紧张，可用以下压缩表，逻辑完全兼容）：
-- CREATE TABLE exchange_codes (
--   id INT PRIMARY KEY,
--   code VARCHAR(20) UNIQUE,
--   status TINYINT DEFAULT 0,
--   used_at DATETIME DEFAULT NULL,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );
