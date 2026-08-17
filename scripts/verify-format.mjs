// verify-format.mjs — 校验插件包格式是否符合 DSH 插件规范（CI 用，无需真实 DSH）
//
// 校验项：
//   1. package.json 含 dsh.bundle.patch
//   2. cordis.patch.yml 存在且包含 insert 条目（轻量解析，无第三方依赖）
//   3. main 指向的 lib 入口存在（编译产物）
//   4. 导出 name/inject/apply（运行时加载检查）
//
// 用法：node scripts/verify-format.mjs
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const packagesDir = path.join(root, 'packages')

let failed = false
function fail(msg) {
  failed = true
  console.error(`  ✗ ${msg}`)
}

// 轻量检查 YAML 是否含 "- insert:" 顶层条目（避免引入 js-yaml 依赖）
function hasInsertEntries(text) {
  return /^\s*-\s+insert:/m.test(text) && /-\s+id:\s+\S+/.test(text)
}

const pluginDirs = fs.readdirSync(packagesDir)
  .filter(name => {
    const pj = path.join(packagesDir, name, 'package.json')
    return fs.existsSync(pj) && JSON.parse(fs.readFileSync(pj, 'utf8')).dsh?.bundle
  })

console.log(`检查 ${pluginDirs.length} 个插件: ${pluginDirs.join(', ') || '(无)'}`)

for (const dir of pluginDirs) {
  const pkgPath = path.join(packagesDir, dir)
  console.log(`\n[${dir}]`)
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'))

  // 1. dsh.bundle.patch
  const patchRel = pkg.dsh?.bundle?.patch
  if (!patchRel) { fail('缺少 dsh.bundle.patch'); continue }
  const patchAbs = path.join(pkgPath, patchRel)
  if (!fs.existsSync(patchAbs)) { fail(`cordis.patch.yml 不存在: ${patchRel}`); continue }
  const patchText = fs.readFileSync(patchAbs, 'utf8')
  if (!hasInsertEntries(patchText)) { fail('cordis.patch.yml 缺少 insert 条目') }
  else console.log('  ✓ cordis.patch.yml 含 insert 条目')

  // 2. main 指向的 lib 入口
  const mainRel = pkg.main
  if (!mainRel) { fail('缺少 main'); continue }
  if (!fs.existsSync(path.join(pkgPath, mainRel))) { fail(`main 指向的文件不存在: ${mainRel}`) }
  else console.log(`  ✓ main 入口存在: ${mainRel}`)

  // 3. 运行时加载导出（Node 原生跑 lib）
  try {
    const mod = await import(pathToFileURL(path.join(pkgPath, mainRel)).href)
    if (typeof mod.name !== 'string') fail('未导出 name')
    if (!Array.isArray(mod.inject)) fail('未导出 inject 数组')
    if (typeof mod.apply !== 'function') fail('未导出 apply 函数')
    if (!failed) console.log(`  ✓ 导出 name=${mod.name} inject=[${mod.inject.join(',')}] apply=fn`)
  } catch (e) {
    fail(`lib 加载失败: ${e.message}`)
  }
}

if (failed) {
  console.error('\n格式校验未通过')
  process.exit(1)
}
console.log('\n全部插件格式校验通过')
