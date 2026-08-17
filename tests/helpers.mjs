/**
 * 测试工具：mock DSH 插件上下文（ctx）
 * 三个插件的单元测试共用；不依赖真实 DSH 运行。
 */
import assert from 'node:assert/strict';

export function createMockCtx() {
  const tools = new Map();
  const events = [];
  const ctx = {
    tool(name, schema, handler) {
      tools.set(name, { schema, handler });
    },
    on(event, handler) {
      events.push({ event, handler });
    },
    http: {
      async post(url, body) {
        ctx.__lastHttp = { url, body };
        // 默认返回一个可控的 VLM 响应，测试可覆盖
        return { choices: [{ message: { content: 'MOCK VLM DESCRIPTION' } }] };
      },
    },
    __tools: tools,
    __events: events,
  };
  return ctx;
}

/** 调用已注册工具并返回结果 */
export async function callTool(ctx, name, args, session = { id: 'test-session', header: { cwd: process.cwd() }, model: 'deepseek-v4-flash' }) {
  const t = ctx.__tools.get(name);
  assert.ok(t, `tool ${name} not registered`);
  return t.handler(args, session);
}

/** 触发已注册事件 */
export function emitEvent(ctx, event, payload) {
  const e = ctx.__events.find(x => x.event === event);
  assert.ok(e, `event ${event} not registered`);
  e.handler(payload);
}
