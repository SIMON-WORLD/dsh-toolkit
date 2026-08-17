/**
 * dsh-vision-bridge — 视觉桥工具
 * 痛点：P062/P063/P064（纯文本模型不能看图，根因 inputModalities 硬编码 ["text"] #474）
 * 标准 DSH 插件格式：cordis.patch.yml 挂载 + defineTool 注册。
 * 上游：codex-free-vision-bridge（智谱代理 http://127.0.0.1:19100）或任意 OpenAI 兼容 VLM。
 */
import { readFileSync, statSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { defineTool } from '@deepseek-ai/dsh-tools';
export const name = 'dsh-vision-bridge';
export const inject = ['tools', 'http'];
const VLM_BASE = process.env.DSH_VISION_BASE || 'http://127.0.0.1:19100/v1';
const VLM_MODEL = process.env.DSH_VISION_MODEL || 'glm-4v-flash';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
// 工作区根在 execute 时动态读取（import 时环境变量可能尚未设置）
function workspaceRoot() {
    return process.env.DSH_WORKSPACE || process.cwd();
}
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'vision_describe_image',
        description: '把图片文件解析为结构化文本描述（布局/文字/组件），供纯文本模型理解。需要外部视觉模型上游可用（默认 codex-free-vision-bridge 代理 127.0.0.1:19100，可用 DSH_VISION_BASE/DSH_VISION_MODEL 覆盖）。',
        parameters: {
            path: {
                type: 'string',
                required: true,
                description: '图片文件路径（相对工作区），支持 png/jpg/webp',
            },
            question: {
                type: 'string',
                description: '可选：针对图片的具体问题（默认：请描述这张图片的内容、布局和文字。）',
            },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    description: { type: 'string' },
                    error: { type: 'string' },
                },
                additionalProperties: false,
            },
            render: (_args, value) => {
                if (value.error)
                    return [{ type: 'text', text: `[vision_describe_image] ${value.error}` }];
                return [{ type: 'text', text: `[vision_describe_image]\n\n${value.description}` }];
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
                if (stat.size > MAX_IMAGE_BYTES)
                    return { error: `image too large (>10MB): ${args.path}` };
                const b64 = readFileSync(abs).toString('base64');
                const mime = args.path.endsWith('.png') ? 'image/png' : args.path.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
                const resp = await ctx.http.post(`${VLM_BASE}/chat/completions`, {
                    model: VLM_MODEL,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: args.question || '请描述这张图片的内容、布局和文字。' },
                                { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
                            ],
                        },
                    ],
                });
                return { description: resp?.choices?.[0]?.message?.content ?? 'no content from vision model' };
            }
            catch (e) {
                return { error: `vision bridge unavailable: ${e instanceof Error ? e.message : String(e)}（请启动 codex-free-vision-bridge 或配置 DSH_VISION_BASE）` };
            }
        },
    }));
}
