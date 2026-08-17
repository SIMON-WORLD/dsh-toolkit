/**
 * dsh-cost-dashboard 单元测试（针对编译产物 lib/index.js）
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockCtx, callTool, emitEvent } from './helpers.mjs';

const mod = await import('../packages/dsh-cost-dashboard/lib/index.js');

function setup() {
  const ctx = createMockCtx();
  mod.apply(ctx);
  return ctx;
}

test('cost: 导出标准插件结构 name/inject/apply', () => {
  assert.equal(mod.name, 'dsh-cost-dashboard');
  assert.ok(Array.isArray(mod.inject));
  assert.equal(typeof mod.apply, 'function');
});

test('cost: 注册了 cost_summary 工具与 llm/token 事件监听', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('cost_summary'));
  assert.ok(ctx.__events.some(e => e.event === 'llm/token'));
});

test('cost: token 事件累加后费用估算可输出', async () => {
  const ctx = setup();
  emitEvent(ctx, 'llm/token', { sessionId: 's1', inputTokens: 1000000, outputTokens: 500000, cacheTokens: 2000000 });
  const res = await callTool(ctx, 'cost_summary', { sessionId: 's1' });
  assert.equal(res.sessionTokens.inputTokens, 1000000);
  assert.equal(res.sessionTokens.outputTokens, 500000);
  assert.ok(typeof res.estimatedCostUsd === 'number');
  assert.ok(res.estimatedCostUsd > 0);
});

test('cost: 不同会话独立累计', async () => {
  const ctx = setup();
  emitEvent(ctx, 'llm/token', { sessionId: 'a', inputTokens: 10, outputTokens: 0, cacheTokens: 0 });
  emitEvent(ctx, 'llm/token', { sessionId: 'b', inputTokens: 20, outputTokens: 0, cacheTokens: 0 });
  const ra = await callTool(ctx, 'cost_summary', { sessionId: 'a' });
  const rb = await callTool(ctx, 'cost_summary', { sessionId: 'b' });
  assert.equal(ra.sessionTokens.inputTokens, 10);
  assert.equal(rb.sessionTokens.inputTokens, 20);
});
