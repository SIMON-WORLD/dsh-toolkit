/**
 * dsh-at-file — @ 文件引用插件
 * 痛点：P106 家族 12 帖（不能 @ 选择文件）
 *
 * ⚠️ 骨架版：以下为最小可理解实现，需在 DSH Web 前端扩展点环境下验证。
 * 实现思路基于 dsh-web-ui composer 扩展 + 社区 dsh-at-file 参考。
 */
import fs from 'node:fs';
import path from 'node:path';

export default class AtFilePlugin {
  static inject = ['tools'];

  constructor(ctx) {
    // 注册 @ 触发工具：模型/前端可调用，把文件内容注入上下文
    ctx.tool('at_file_read', {
      description: '读取工作区内文件内容并注入上下文（@ 引用文件）',
      arguments: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '相对工作区的文件路径' },
        },
        required: ['path'],
      },
    }, async ({ path: relPath }, session) => {
      const root = session?.header?.cwd;
      if (!root) throw new Error('no workspace cwd in session');
      const abs = path.resolve(root, relPath);
      // 防目录穿越
      if (!abs.startsWith(path.resolve(root))) {
        return { error: `path escapes workspace: ${relPath}` };
      }
      const stat = fs.statSync(abs);
      if (stat.size > 50 * 1024) {
        // 大文件提示截断（配合 tokenless 思路）
        const head = fs.readFileSync(abs, 'utf8').slice(0, 50 * 1024);
        return { truncated: true, path: relPath, content: head };
      }
      return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
    });

    // 前端提示：composer 输入框 @ 触发由 UI 层插件提供（见 README 计划）
    // TODO(v0.2): 注册 UI 侧 composer 扩展，@ 弹出文件树
  }
}
