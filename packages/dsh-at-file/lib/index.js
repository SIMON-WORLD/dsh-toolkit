/**
 * dsh-at-file — @ 文件引用工具
 * 痛点：P106 家族 12 帖（#146 #195 #234 #261 #337 #360 #368 #464 #550 #659）
 * 标准 DSH 插件格式：cordis.patch.yml 挂载 + defineTool 注册。
 */
import { readFileSync, statSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { defineTool } from '@deepseek-ai/dsh-tools';
export const name = 'dsh-at-file';
export const inject = ['tools'];
const MAX_BYTES = 50 * 1024; // 大文件截断阈值
// 工作区根在 execute 时动态读取（import 时环境变量可能尚未设置）
function workspaceRoot() {
    return process.env.DSH_WORKSPACE || process.cwd();
}
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'at_file_read',
        description: '读取工作区内文件内容并注入上下文（@ 引用文件）。返回文件内容供模型直接使用；超过 50KB 自动截断并标记 truncated。',
        parameters: {
            path: {
                type: 'string',
                required: true,
                description: '相对工作区的文件路径，例如 src/index.ts',
            },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    path: { type: 'string' },
                    content: { type: 'string' },
                    truncated: { type: 'boolean' },
                    error: { type: 'string' },
                },
                additionalProperties: false,
            },
            render: (_args, value) => {
                if (value.error)
                    return [{ type: 'text', text: `[at_file_read] ${value.error}` }];
                return [{ type: 'text', text: `[at_file_read] ${value.path}${value.truncated ? ' (truncated >50KB)' : ''}\n\n${value.content}` }];
            },
        },
        execute: async (args) => {
            const ws = workspaceRoot();
            const abs = isAbsolute(args.path) ? args.path : resolve(ws, args.path);
            if (!abs.startsWith(resolve(ws)))
                return { error: `path escapes workspace: ${args.path}` };
            try {
                const stat = statSync(abs);
                if (!stat.isFile())
                    return { error: `not a file: ${args.path}` };
                const content = readFileSync(abs, 'utf8');
                if (stat.size > MAX_BYTES) {
                    return { path: args.path, content: content.slice(0, MAX_BYTES), truncated: true };
                }
                return { path: args.path, content };
            }
            catch (e) {
                return { error: `cannot read ${args.path}: ${e instanceof Error ? e.message : String(e)}` };
            }
        },
    }));
}
