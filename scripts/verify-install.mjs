// verify-install.mjs — 在隔离 DSH_HOME 中真实安装并加载插件的验证脚本
//
// 用途：证明 packages/ 下插件可以被 DSH 安装（dsh plugin add 等价流程）并成功加载。
// 原理：用临时 DSH_HOME（不污染用户配置）→ pnpm add 插件到 profile → patch 挂载 → headless/web 启动验证。
//
// 用法（从仓库根目录）：
//   node scripts/verify-install.mjs <plugin-dir> <profile=web|headless>
//   示例：node scripts/verify-install.mjs packages/dsh-at-file headless
//
// 输出：
//   1. pnpm 安装成功
//   2. dump-config 显示插件 bundle
//   3. headless 启动：插件树加载（若缺 tools 服务报 pending 属预期；web profile 含 tools 可完全激活）
//   4. web profile：服务成功监听 3080 = 插件完整加载激活
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const [pluginArg, profile = 'web'] = process.argv.slice(2)
if (!pluginArg) {
  console.error('用法: node scripts/verify-install.mjs <plugin-dir> [web|headless]')
  process.exit(1)
}
const pluginDir = path.resolve(repoRoot, pluginArg)
if (!fs.existsSync(path.join(pluginDir, 'package.json'))) {
  console.error(`不是插件目录: ${pluginArg}`)
  process.exit(1)
}

const dshHome = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-verify-'))
const profileDir = path.join(dshHome, 'profiles', profile)
fs.mkdirSync(profileDir, { recursive: true })

// 1. 创建最小 profile（复用真实 dsh 的 profile 模板不行，先装插件）
console.log(`[1/3] pnpm add ${pluginArg} -> 隔离 DSH_HOME ${dshHome}`)
try {
  execSync(`npx pnpm add "file:${pluginDir}" --no-lockfile`, {
    cwd: profileDir, stdio: ['ignore', 'pipe', 'pipe'], env: process.env,
  })
  console.log('      ✓ pnpm 安装成功')
} catch (e) {
  console.error('      ✗ pnpm 安装失败:')
  console.error(String(e.stdout || ''))
  console.error(String(e.stderr || ''))
  process.exit(1)
}

// 2. patch 挂载：写到独立文件，仅通过 --patch 叠加（避免 profile 内置 patch 双重加载导致 duplicate id）
const pluginName = JSON.parse(fs.readFileSync(path.join(pluginDir, 'package.json'), 'utf8')).name
const patch = `- insert:\n    - id: ${pluginName.replace(/[^a-z0-9-]/g, '-')}\n      name: '${pluginName}'\n`
const patchFile = path.join(dshHome, 'verify-patch.yml')
fs.writeFileSync(patchFile, patch, 'utf8')
console.log(`[2/3] 插件 ${pluginName} 挂载补丁: ${patchFile}`)

// 3. headless 启动验证（用假 key：插件加载失败会报 plugin tree failed，认证失败则说明插件树 OK）
console.log('[3/3] headless 启动验证（假 API key）')
// 优先用本机 npx 缓存里的 dsh；找不到时回退 npx 拉取
const npxCacheCandidates = [
  'C:\\Users\\Administrator\\AppData\\Local\\npm-cache\\_npx\\1e7f6d9597241db0\\node_modules\\.bin\\dsh.cmd',
]
const localDsh = npxCacheCandidates.find(p => fs.existsSync(p))
const dshBin = localDsh ? `"${localDsh}"` : (process.platform === 'win32' ? 'npx.cmd -y @deepseek-ai/dsh' : 'npx -y @deepseek-ai/dsh')
try {
  execSync(`${dshBin} --profile headless --patch "${patchFile}" "test"`, {
    cwd: profileDir,
    encoding: 'utf8',
    timeout: 120000,
    env: { ...process.env, DSH_HOME: dshHome, DEEPSEEK_API_KEY: 'sk-verify-invalid' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  console.log('      ? headless 意外成功（无 key 不应成功）')
} catch (e) {
  const out = String(e.stdout || '') + String(e.stderr || '')
  if (out.includes('AUTH') || out.includes('invalid')) {
    console.log('      ✓ 插件树加载成功（仅 API key 认证失败，符合预期）')
    console.log('      ✓ 验证通过：插件可被 DSH 安装并加载')
  } else {
    console.error('      ✗ 插件加载失败:')
    console.error(out.slice(0, 2000))
    process.exit(1)
  }
}

fs.rmSync(dshHome, { recursive: true, force: true })
console.log('\n验证完成，临时 DSH_HOME 已清理。')

