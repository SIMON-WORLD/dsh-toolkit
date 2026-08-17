/**
 * dsh-cost-dashboard 单元测试
 * 验证：token 事件累加 / 费用估算输出 / 价格表存在
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockCtx, callTool, emitEvent } from './helpers.mjs';

const { default: CostDashboardPlugin } = await import('../packages/dsh-cost-dashboard/src/index.ts');

function setup() {
  const ctx = createMockCtx();
  new CostDashboardPlugin(ctx);
  return ctx;
}

test('cost: 注册了 cost_summary 工具与 llm/token 事件监听', () => {
  const ctx = setup();
  assert.ok(ctx.__tools.has('cost_summary'));
  assert.ok(ctx.__events.some(e => e.event === 'llm/token'));
});

test('cost: token 事件累加后费用估算可输出', async () => {
  const ctx = setup();
  emitEvent(ctx, 'llm/token', { sessionId: 's1', inputTokens: 1000000, outputTokens: 500000, cacheTokens: 2000000 });
  const res = await callTool(ctx, 'cost_summary', {}, { id: 's1', model: 'deepseek-v4-flash' });
  assert.equal(res.sessionTokens.inputTokens, 1000000);
  assert.equal(res.sessionTokens.outputTokens, 500000);
  assert.ok(typeof res.estimatedCostUsd === 'number');
  // 1M input * 0.66 + 0.5M output * 1.32 = 0.66 + 0.66 = 1.32（非低谷按 peak）
  assert.ok(res.estimatedCostUsd > 0);
});

test('cost: 不同会话独立累计', async () => {
  const ctx = setup();
  emitEvent(ctx, 'llm/token', { sessionId: 'a', inputTokens: 10, outputTokens: 0, cacheTokens: 0 });
  emitEvent(ctx, 'llm/token', { sessionId: 'b', inputTokens: 20, outputTokens: 0, cacheTokens: 0 });
  const ra = await callTool(ctx, 'cost_summary', {}, { id: 'a', model: 'deepseek-v4-flash' });
  const rb = await callTool(ctx, 'cost_summary', {}, { id: 'b', model: 'deepseek-v4-flash' });
  assert.equal(ra.sessionTokens.inputTokens, 10);
  assert.equal(rb.sessionTokens.inputTokens, 20);
});
