/**
 * dsh-doctor 单元测试
 * 验证：Node 版脚本可执行且输出检测结果（回归保护）
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const doctorPath = path.resolve(__dirname, '../packages/dsh-doctor/src/index.mjs');

function runDoctor() {
  return execFileSync(process.execPath, [doctorPath], { encoding: 'utf8' });
}

test('doctor: 脚本可执行且包含关键检测项', () => {
  const out = runDoctor();
  for (const kw of ['[dsh-doctor]', 'Node 版本', '端口 3080', '工作区路径字符', '完成']) {
    assert.ok(out.includes(kw), `输出应包含 "${kw}"`);
  }
});

test('doctor: 输出结构有 OK/WARN 标记', () => {
  const out = runDoctor();
  assert.match(out, /\[OK\]|\[WARN\]/);
});

test('doctor: 退出码为 0（体检不因发现 WARN 而失败）', () => {
  execFileSync(process.execPath, [doctorPath], { encoding: 'utf8' });
  // 若抛错则测试失败
  assert.ok(true);
});
