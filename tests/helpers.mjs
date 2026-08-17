/**
 * 测试工具：mock DSH 插件上下文（ctx），适配 defineTool 注册结构
 * 三个插件的单元测试共用；加载编译后的 lib/index.js 验证真实产物。
 */
import assert from 'node:assert/strict';

export function createMockCtx() {
  const tools = new Map();
  const events = [];
  const ctx = {
    tools: {
      register(definition) {
        const { name, ...rest } = definition;
        tools.set(name, rest);
        return () => tools.delete(name);
      },
    },
    on(event, handler) {
      events.push({ event, handler });
    },
    http: {
      async post(url, body) {
        ctx.__lastHttp = { url, body };
        return { choices: [{ message: { content: 'MOCK VLM DESCRIPTION' } }] };
      },
    },
    __tools: tools,
    __events: events,
  };
  return ctx;
}

/** 调用已注册工具（execute 签名：args, exec?） */
export async function callTool(ctx, name, args = {}) {
  const t = ctx.__tools.get(name);
  assert.ok(t, `tool ${name} not registered; have: ${[...ctx.__tools.keys()].join(', ')}`);
  return t.execute(args, {});
}

/** 触发已注册事件 */
export function emitEvent(ctx, event, payload) {
  const e = ctx.__events.find(x => x.event === event);
  assert.ok(e, `event ${event} not registered`);
  e.handler(payload);
}
