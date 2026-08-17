# dsh-doctor — DeepSeek Harness 环境体检 CLI

> 对应痛点：P015/P020（环境问题无统一诊断，官方 Discussions #649 提议 + #1719 46 评论）
> 一条命令检测 DSH 运行环境的常见坑，并给出可直接复制的修复命令。

## 为什么做

官方 Discussions 里环境类问题 20+ 帖各自踩不同的坑（Node 版本过低、koffi 预编译损坏、端口落在 Hyper-V 保留区间、中文路径截断、沙箱临时目录崩溃……），但没有统一诊断工具（社区提议 `dsh doctor`，[#1719 有 46 评论](https://github.com/deepseek-ai/deepseek-harness/discussions/1719)）。

## 检测项（v0.1）

| # | 检测 | 判定 | 修复 |
|---|---|---|---|
| 1 | Node 版本 | 需 ≥ 22.19（dsh 硬性要求） | 装 Node 22.19+ |
| 2 | koffi 版本 | 若已装，锁 3.1.2（3.1.3/3.1.4 预编译损坏 #293） | `npm i koffi@3.1.2` |
| 3 | 3080 端口占用 | 被占用 / Hyper-V 保留区间(3070-3169) | 换端口 `dsh web --port 13080` |
| 4 | 工作区路径字符 | 含 U+XX00 中文/特殊字符（#107 家族 17 帖） | 用纯 ASCII 路径 |
| 5 | DSH_HOME 状态 | 目录存在/可写 | 创建/检查权限 |
| 6 | 沙箱临时目录 | 存在/可清理 | 清理重建 |
| 7 | 全局 git hooksPath | 被 Codex 等设置导致 pnpm 失败（#139） | `git config --global --unset core.hooksPath` |
| 8 | 依赖完整性 | 常见包是否存在 | `dsh plugin --profile web add` 修复 |

## 快速开始

```bash
# Node 版（跨平台）
node packages/dsh-doctor/src/index.mjs

# Windows PowerShell 版
powershell -ExecutionPolicy Bypass -File packages/dsh-doctor/src/dsh-doctor.ps1

# 或经 npm script
npm run doctor
```

## 输出示例

```
[dsh-doctor] DeepSeek Harness 环境体检
----------------------------------------
[OK]   Node 版本: v22.19.0 (≥22.19 满足)
[OK]   端口 3080: 空闲
[WARN] 工作区路径: E:\百度同步\项目 (含非 ASCII 字符，建议改用纯英文路径)
[WARN] koffi: 未安装（若后续 picker 崩溃，请锁定 koffi@3.1.2）
[FAIL] DSH_HOME: 未设置环境变量
       → 修复: 设置 DSH_HOME 或使用默认 ~/.dsh
...
```

## 验证标准

- [ ] 模拟 5 种坏环境（Node 过低/koffi 错版/端口占用/中文路径/DSH_HOME 缺失）全部检出
- [ ] 每条 FAIL/WARN 都给出可直接复制的修复命令
- [ ] Windows PowerShell 与 Node 双实现结果一致

## 扩展计划

- v0.2：检测 profile 配置可解析性（--dump-config）、插件依赖冲突（#159 npm dist-tag 混乱）
- v0.3：输出 JSON 供 CI 集成；`--fix` 自动修复

## License

MIT
