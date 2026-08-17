/**
 * dsh-at-file 单元测试
 * 验证：工具注册 / 正常读取 / 目录穿越防护 / 大文件截断
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createMockCtx, callTool } from './helpers.mjs';

// Node 原生加载 TS（type stripping）
const { default: AtFilePlugin } = await import('../packages/dsh-at-file/src/index.ts');

function setup() {
  const ctx = createMockCtx();
  new AtFilePlugin(ctx);
  return ctx;
}

test('at-file: 注册了 at_file_read 工具', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('at_file_read'));
});

test('at-file: 正常读取工作区内文件', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  const file = path.join(dir, 'hello.txt');
  fs.writeFileSync(file, 'hello dsh');
  const ctx = setup();
  const res = await callTool(ctx, 'at_file_read', { path: 'hello.txt' }, { id: 's', header: { cwd: dir } });
  assert.equal(res.content, 'hello dsh');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('at-file: 拒绝目录穿越（../ 逃逸工作区）', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  const ctx = setup();
  const res = await callTool(ctx, 'at_file_read', { path: '../../secret.txt' }, { id: 's', header: { cwd: dir } });
  assert.ok(res.error && res.error.includes('escapes'));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('at-file: 大文件（>50KB）截断并标记', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atfile-'));
  const file = path.join(dir, 'big.txt');
  fs.writeFileSync(file, 'x'.repeat(60 * 1024));
  const ctx = setup();
  const res = await callTool(ctx, 'at_file_read', { path: 'big.txt' }, { id: 's', header: { cwd: dir } });
  assert.equal(res.truncated, true);
  assert.ok(res.content.length <= 50 * 1024);
  fs.rmSync(dir, { recursive: true, force: true });
});
