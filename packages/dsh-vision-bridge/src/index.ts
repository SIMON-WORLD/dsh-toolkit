/**
 * dsh-vision-bridge — 视觉桥插件
 * 痛点：P062/P063/P064（纯文本模型不能看图，根因 inputModalities 硬编码 ["text"] #474）
 *
 * ⚠️ 骨架版：描述桥核心已实现，需在 DSH 环境验证。
 * 上游：codex-free-vision-bridge（智谱代理 http://127.0.0.1:19100）或任意 OpenAI 兼容 VLM。
 */
export default class VisionBridgePlugin {
  static inject = ['tools', 'http'];

  constructor(ctx) {
    const VLM_BASE = process.env.DSH_VISION_BASE || 'http://127.0.0.1:19100/v1';

    ctx.tool('vision_describe_image', {
      description: '把图片文件解析为结构化文本描述（布局/文字/组件），供文本模型理解',
      arguments: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '图片文件路径（相对工作区）' },
          question: { type: 'string', description: '可选：针对图片的具体问题' },
        },
        required: ['path'],
      },
    }, async ({ path, question = '请描述这张图片的内容、布局和文字。' }) => {
      try {
        const resp = await ctx.http.post(`${VLM_BASE}/chat/completions`, {
          model: process.env.DSH_VISION_MODEL || 'glm-4v-flash',
          messages: [
            { role: 'user', content: [
              { type: 'text', text: question },
              // TODO(v0.2): 按 DSH http 能力上传图片 base64/路径
            ] },
          ],
        });
        return { description: resp.choices?.[0]?.message?.content ?? 'no content' };
      } catch (e) {
        return { error: `vision bridge unavailable: ${e.message}（请启动 codex-free-vision-bridge 或配置 DSH_VISION_BASE）` };
      }
    });

    // TODO(v0.2): 纯文字轮次不触发视觉调用（省 token）
    // TODO(v0.2): 视频关键帧抽取 / PSD 图层解析工具
  }
}
