/**
 * dsh-vision-bridge 单元测试（针对编译产物 lib/index.js）
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createMockCtx, callTool } from './helpers.mjs';

const mod = await import('../packages/dsh-vision-bridge/lib/index.js');

function setup() {
  const ctx = createMockCtx();
  mod.apply(ctx);
  return ctx;
}

test('vision: 导出标准插件结构 name/inject/apply', () => {
  assert.equal(mod.name, 'dsh-vision-bridge');
  assert.ok(Array.isArray(mod.inject));
  assert.equal(typeof mod.apply, 'function');
});

test('vision: 注册了 vision_describe_image 工具', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('vision_describe_image'));
});

test('vision: 上游可用时返回描述文本', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vision-'));
  fs.writeFileSync(path.join(dir, 'shot.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  process.env.DSH_WORKSPACE = dir;
  try {
    const ctx = setup();
    const res = await callTool(ctx, 'vision_describe_image', { path: 'shot.png' });
    assert.equal(res.description, 'MOCK VLM DESCRIPTION');
  } finally {
    delete process.env.DSH_WORKSPACE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('vision: 上游不可用时优雅降级（返回 error 而非抛出）', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vision-'));
  fs.writeFileSync(path.join(dir, 'shot.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  process.env.DSH_WORKSPACE = dir;
  try {
    const ctx = setup();
    ctx.http.post = async () => { throw new Error('ECONNREFUSED 127.0.0.1:19100'); };
    const res = await callTool(ctx, 'vision_describe_image', { path: 'shot.png' });
    assert.ok(res.error && res.error.includes('vision bridge unavailable'));
  } finally {
    delete process.env.DSH_WORKSPACE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
