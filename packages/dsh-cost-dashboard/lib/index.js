/**
 * dsh-cost-dashboard — 成本仪表盘工具
 * 痛点：P144-P149（费用无感知 #500/#318、无预算 #704、峰谷计价）+ 增量统计避免 #238 二次方退化
 * 标准 DSH 插件格式：cordis.patch.yml 挂载 + defineTool 注册。
 */
import { defineTool } from '@deepseek-ai/dsh-tools';
export const name = 'dsh-cost-dashboard';
export const inject = ['tools'];
// 价格表（2026-08-17 快照，峰谷计价；可配置覆盖）
const PRICING = {
    'deepseek-v4-flash': { peakInput: 0.66, valleyInput: 0.33, peakOutput: 1.32, valleyOutput: 0.66 },
    'deepseek-v4-pro': { peakInput: 1.98, valleyInput: 0.99, peakOutput: 3.96, valleyOutput: 1.98 },
};
function isValley(d = new Date()) {
    return d.getHours() < 8 || d.getHours() >= 20; // 示例低谷时段，可按实调整
}
export function apply(ctx) {
    // 增量累计器：sessionId -> tokens（避免每次重建全量快照）
    const meters = new Map();
    ctx.on('llm/token', (ev) => {
        if (!ev?.sessionId)
            return;
        const m = meters.get(ev.sessionId) || { inputTokens: 0, outputTokens: 0, cacheTokens: 0 };
        m.inputTokens += ev.inputTokens ?? 0;
        m.outputTokens += ev.outputTokens ?? 0;
        m.cacheTokens += ev.cacheTokens ?? 0;
        meters.set(ev.sessionId, m);
    });
    ctx.tools.register(defineTool({
        name: 'cost_summary',
        description: '查询当前会话 token 用量与费用估算（美元）。可用于预算告警与成本感知。',
        parameters: {
            sessionId: {
                type: 'string',
                description: '可选：查询指定会话（默认汇总全部事件）',
            },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    sessionTokens: {
                        type: 'object',
                        properties: {
                            inputTokens: { type: 'number' },
                            outputTokens: { type: 'number' },
                            cacheTokens: { type: 'number' },
                        },
                        additionalProperties: false,
                    },
                    estimatedCostUsd: { type: 'number' },
                    valley: { type: 'boolean' },
                    note: { type: 'string' },
                },
                additionalProperties: false,
            },
            render: (_args, value) => [
                { type: 'text', text: `[cost_summary] input=${value.sessionTokens?.inputTokens ?? 0} output=${value.sessionTokens?.outputTokens ?? 0} cache=${value.sessionTokens?.cacheTokens ?? 0} ≈ $${value.estimatedCostUsd}${value.valley ? ' (低谷价)' : ''}` },
            ],
        },
        execute: async (args) => {
            // 取累计器：优先按 sessionId 参数，否则全局
            const sessionId = typeof args?.sessionId === 'string' ? args.sessionId : 'default';
            const m = meters.get(sessionId) || { inputTokens: 0, outputTokens: 0, cacheTokens: 0 };
            const model = 'deepseek-v4-flash'; // 简化：价格表按模型查询，可后续从事件带 model
            const p = PRICING[model] || PRICING['deepseek-v4-flash'];
            const valley = isValley();
            const inputPrice = valley ? p.valleyInput : p.peakInput;
            const outputPrice = valley ? p.valleyOutput : p.peakOutput;
            const cost = (m.inputTokens / 1e6) * inputPrice + (m.outputTokens / 1e6) * outputPrice;
            return {
                sessionTokens: m,
                estimatedCostUsd: +cost.toFixed(4),
                valley,
                note: '价格快照 2026-08-17；请与官方账单对账（目标误差<5%）',
            };
        },
    }));
}
