#!/usr/bin/env node
/**
 * dsh-doctor — DeepSeek Harness 环境体检（Node 版，跨平台）
 * 痛点依据：官方 Discussions #649 / #1719 / #293 / #107 / #589 / #139
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RESULTS = [];

function check(name, ok, detail, fix) {
  RESULTS.push({ name, ok, detail, fix });
  const icon = ok ? '[OK]  ' : '[WARN]';
  console.log(`${icon} ${name}: ${detail}`);
  if (!ok && fix) console.log(`       → 修复: ${fix}`);
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 8000 }).trim();
  } catch {
    return null;
  }
}

function isAsciiPath(p) {
  return /^[\x20-\x7E:]+$/.test(p);
}

console.log('[dsh-doctor] DeepSeek Harness 环境体检');
console.log('----------------------------------------');

// 1. Node 版本（dsh 硬性要求 ≥22.19，来源 #100/#311）
const nodeVer = process.versions.node;
const [major, minor] = nodeVer.split('.').map(Number);
check('Node 版本', major > 22 || (major === 22 && minor >= 19), `v${nodeVer} (需 ≥22.19)`,
  '安装 Node 22.19+：https://nodejs.org/');

// 2. koffi 版本（3.1.3/3.1.4 预编译损坏，来源 #293/#197）
let koffiVer = null;
try {
  koffiVer = require('koffi/package.json').version;
} catch {
  try { koffiVer = run('npm ls koffi --depth=0 2>nul') || null; } catch { /* ignore */ }
}
if (koffiVer) {
  check('koffi 版本', koffiVer === '3.1.2', koffiVer, '锁定 3.1.2：npm i koffi@3.1.2');
} else {
  check('koffi', true, '未安装（若目录选择器崩溃需装且锁 3.1.2）');
}

// 3. 端口 3080（Hyper-V 保留区间 3070-3169，来源 #589）
const portCheck = run('netstat -ano | findstr :3080');
check('端口 3080', !portCheck, portCheck ? '被占用' : '空闲',
  '换端口：dsh web --port 13080；或结束占用进程');

// 4. 工作区路径字符（中文路径截断，来源 #107 家族 17 帖）
const cwd = process.cwd();
check('工作区路径字符', isAsciiPath(cwd), cwd,
  '改用纯 ASCII 路径（dsh 中文路径截断 bug 未修复）');

// 5. DSH_HOME
const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
check('DSH_HOME', fs.existsSync(dshHome) && fs.accessSync ? true : false,
  process.env.DSH_HOME ? dshHome : `未显式设置，默认 ${dshHome}`, '设置 DSH_HOME 环境变量');

// 6. 沙箱临时目录
const tmpDir = path.join(os.tmpdir(), 'dsh-sandbox-test-' + Date.now());
try {
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.rmdirSync(tmpDir);
  check('沙箱临时目录', true, '可写');
} catch (e) {
  check('沙箱临时目录', false, e.message, '清理/重建沙箱缓存后重启 dsh');
}

// 7. 全局 git hooksPath（Codex 设置导致 pnpm/lefthook 失败，来源 #139）
const hooks = run('git config --global --get core.hooksPath');
check('全局 git hooksPath', !hooks, hooks || '未设置',
  'git config --global --unset core.hooksPath');

// 8. 常见依赖
const deps = ['@deepseek-ai/dsh', 'cordis'];
for (const d of deps) {
  try {
    require.resolve(d + '/package.json');
    check(`依赖 ${d}`, true, '已安装');
  } catch {
    check(`依赖 ${d}`, true, '未在本地解析（npx 运行时不要求本地装）');
  }
}

console.log('----------------------------------------');
const fails = RESULTS.filter(r => !r.ok);
console.log(`完成：${RESULTS.length - fails.length}/${RESULTS.length} 项通过${fails.length ? `，${fails.length} 项需处理（见上方 WARN）` : ''}`);
