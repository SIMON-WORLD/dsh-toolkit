/**
 * dsh-at-file 单元测试（针对编译产物 lib/index.js）
 * 验证：插件导出结构（name/inject/apply）/ 工具注册 / 正常读取 / 目录穿越防护 / 大文件截断
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createMockCtx, callTool } from './helpers.mjs';

const mod = await import('../packages/dsh-at-file/lib/index.js');

function setup() {
  const ctx = createMockCtx();
  mod.apply(ctx);
  return ctx;
}

test('at-file: 导出标准插件结构 name/inject/apply', () => {
  assert.equal(mod.name, 'dsh-at-file');
  assert.ok(Array.isArray(mod.inject));
  assert.equal(typeof mod.apply, 'function');
});

test('at-file: 注册了 at_file_read 工具', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('at_file_read'));
});

test('at-file: 正常读取工作区内文件（DSH_WORKSPACE）', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  const file = path.join(dir, 'hello.txt');
  fs.writeFileSync(file, 'hello dsh');
  process.env.DSH_WORKSPACE = dir;
  try {
    const ctx = setup();
    const res = await callTool(ctx, 'at_file_read', { path: 'hello.txt' });
    assert.equal(res.content, 'hello dsh');
  } finally {
    delete process.env.DSH_WORKSPACE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('at-file: 拒绝目录穿越（../ 逃逸工作区）', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  process.env.DSH_WORKSPACE = dir;
  try {
    const ctx = setup();
    const res = await callTool(ctx, 'at_file_read', { path: '../../secret.txt' });
    assert.ok(res.error && res.error.includes('escapes'));
  } finally {
    delete process.env.DSH_WORKSPACE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('at-file: 大文件（>50KB）截断并标记', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  fs.writeFileSync(path.join(dir, 'big.txt'), 'x'.repeat(60 * 1024));
  process.env.DSH_WORKSPACE = dir;
  try {
    const ctx = setup();
    const res = await callTool(ctx, 'at_file_read', { path: 'big.txt' });
    assert.equal(res.truncated, true);
    assert.ok(res.content.length <= 50 * 1024);
  } finally {
    delete process.env.DSH_WORKSPACE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
