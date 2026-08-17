/**
 * dsh-vision-bridge 单元测试
 * 验证：工具注册 / 正常调用返回描述 / 上游不可用时优雅降级
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockCtx, callTool } from './helpers.mjs';

const { default: VisionBridgePlugin } = await import('../packages/dsh-vision-bridge/src/index.ts');

function setup() {
  const ctx = createMockCtx();
  new VisionBridgePlugin(ctx);
  return ctx;
}

test('vision: 注册了 vision_describe_image 工具', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('vision_describe_image'));
});

test('vision: 上游可用时返回描述文本', async () => {
  const ctx = setup();
  const res = await callTool(ctx, 'vision_describe_image', { path: 'shot.png' });
  assert.equal(res.description, 'MOCK VLM DESCRIPTION');
});

test('vision: 上游不可用时优雅降级（返回 error 而非抛出）', async () => {
  const ctx = setup();
  ctx.http.post = async () => { throw new Error('ECONNREFUSED 127.0.0.1:19100'); };
  const res = await callTool(ctx, 'vision_describe_image', { path: 'shot.png' });
  assert.ok(res.error && res.error.includes('vision bridge unavailable'));
});
