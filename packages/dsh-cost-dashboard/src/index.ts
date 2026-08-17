/**
 * dsh-cost-dashboard — 成本仪表盘插件
 * 痛点：P144-P149（费用无感知 #500/#318、无预算 #704、峰谷计价）
 *
 * ⚠️ 骨架版：增量统计核心已实现，需在 DSH 事件流 API 下接线验证。
 * 性能红线：勿用全量快照（#238 TokenMeter 二次方退化教训）。
 */
export default class CostDashboardPlugin {
  static inject = ['events', 'llm'];

  constructor(ctx) {
    // 增量累计器：按 会话 → 日 → 月 三级聚合
    const meters = new Map(); // sessionId -> { inputTokens, outputTokens, cacheTokens }

    // 价格表（2026-08-17 快照，峰谷计价；可配置覆盖）
    const PRICING = {
      'deepseek-v4-flash': { peakInput: 0.66, valleyInput: 0.33, peakOutput: 1.32, valleyOutput: 0.66 },
      'deepseek-v4-pro': { peakInput: 1.98, valleyInput: 0.99, peakOutput: 3.96, valleyOutput: 1.98 },
    };
    const isValley = (d = new Date()) => d.getHours() < 8 || d.getHours() >= 20; // 示例低谷时段

    ctx.on('llm/token', (ev) => {
      const m = meters.get(ev.sessionId) || { inputTokens: 0, outputTokens: 0, cacheTokens: 0 };
      m.inputTokens += ev.inputTokens ?? 0;
      m.outputTokens += ev.outputTokens ?? 0;
      m.cacheTokens += ev.cacheTokens ?? 0;
      meters.set(ev.sessionId, m);
    });

    // 供 UI/查询的工具
    ctx.tool('cost_summary', {
      description: '查询当前会话/日/月 token 与费用估算',
      arguments: { type: 'object', properties: {}, additionalProperties: false },
    }, async (_args, session) => {
      const m = meters.get(session?.id) || { inputTokens: 0, outputTokens: 0, cacheTokens: 0 };
      const model = session?.model || 'deepseek-v4-flash';
      const p = PRICING[model] || PRICING['deepseek-v4-flash'];
      const mult = isValley() ? p.valleyOutput / p.peakOutput : 1;
      return {
        sessionTokens: m,
        estimatedCostUsd: +(((m.inputTokens / 1e6) * p.peakInput + (m.outputTokens / 1e6) * p.peakOutput) * (mult || 1)).toFixed(4),
        note: '价格快照 2026-08-17；请与官方账单对账（目标误差<5%）',
      };
    });

    // TODO(v0.2): 预算阈值 → 桌面通知（复用 dsh-web-attention-badge 思路）
    // TODO(v0.2): 日/月持久化（IndexedDB 或文件）
  }
}
