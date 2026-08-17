# 安装与启动避坑（域 A）

> 全部带官方 Discussions 帖号，可溯源。dsh 版本：0.1.0-rc.6 时代。

## 高频问题速查

| 问题 | 原因 | 解决 |
|---|---|---|
| npx 首次下载 8+ 分钟零反馈 | 首次下载 500+ 包（[#176](https://github.com/deepseek-ai/deepseek-harness/discussions/176)） | 正常，耐心等 |
| `AbortSignal.timeout is not a function` | Node 版本过低（[#311](https://github.com/deepseek-ai/deepseek-harness/discussions/311)） | Node ≥ 22.19 |
| macOS 报 `--expose-internals is required` | HMR 服务要求（[#113](https://github.com/deepseek-ai/deepseek-harness/discussions/113) 家族） | `node --expose-internals` 启动 |
| 全局安装后找不到 `cordis-plugin-timer` | 全局安装依赖解析问题（[#55](https://github.com/deepseek-ai/deepseek-harness/discussions/55)） | 改用 npx |
| 端口 3080 EACCES | Hyper-V 保留区间 3070-3169（[#589](https://github.com/deepseek-ai/deepseek-harness/discussions/589)） | `dsh web --port 13080` |
| 一直 "reconnecting" | 旧实例残留（[#648](https://github.com/deepseek-ai/deepseek-harness/discussions/648)） | 杀进程重启 |
| Linux 缺 `pty.node` | 原生模块未编译（[#177](https://github.com/deepseek-ai/deepseek-harness/discussions/177)） | 装 g++/make，GCC≥10 |
| 关终端 dsh 就退出 | 不处理 SIGHUP（[#600](https://github.com/deepseek-ai/deepseek-harness/discussions/600)） | nohup/后台/Docker |
| 首次启动像卡死 | 需 API key + 工作区两步（[#619](https://github.com/deepseek-ai/deepseek-harness/discussions/619)） | 按顺序配置 |
| npm 裸装 ERESOLVE | dist-tag latest 不一致（[#2763](https://github.com/deepseek-ai/deepseek-harness/discussions/2763)） | 锁精确版本号 |

## 一键体检

```bash
# 使用本仓库 dsh-doctor（8 项检测 + 修复命令）
node packages/dsh-doctor/src/index.mjs
# Windows: powershell -ExecutionPolicy Bypass -File packages/dsh-doctor/src/dsh-doctor.ps1
```

## 未修复问题（贡献点）

- **dsh doctor 官方命令**（[#1719 46 评论](https://github.com/deepseek-ai/deepseek-harness/discussions/1719)）——本仓库已提供社区实现
- 首次启动引导（[#619](https://github.com/deepseek-ai/deepseek-harness/discussions/619)）
