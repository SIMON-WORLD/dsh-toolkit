# dsh-toolkit — DeepSeek Harness 好用化工具箱

> 让 DeepSeek Harness (dsh) 从「毛坯房」变成「精装工作台」的一站式开源工具箱。
> 基于全网 173 条真实痛点（官方 Discussions 2764 帖挖掘）精选开发。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![CI](https://github.com/SIMON-WORLD/dsh-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/SIMON-WORLD/dsh-toolkit/actions/workflows/ci.yml)
[![dsh-plugin](https://img.shields.io/badge/ecosystem-dsh--plugin-orange)](https://github.com/topics/dsh-plugin)

## 这个仓库解决什么

DeepSeek Harness 开源 4 天 14 万+ star，但官方明示处于开发者预览阶段，社区在官方 Discussions 里报告了 **173+ 个真实痛点**（Windows 中文路径截断、`unknown tool` 流式 bug、无法 @ 引用文件、无成本统计、纯文本模型不能看图……）。

本仓库把其中**可被工具/插件/文档解决**的痛点做成一站式方案，全部开源、全部可贡献：

| 包 | 解决痛点 | 状态 |
|---|---|---|
| [`packages/dsh-doctor`](packages/dsh-doctor) | 环境问题无统一诊断（#649/#1719 46 评论） | 🟢 v0.1 可用（实测 9/9） |
| [`packages/dsh-at-file`](packages/dsh-at-file) | 不能 @ 选择文件（12+ 帖） | 🟢 测试通过（4/4） |
| [`packages/dsh-cost-dashboard`](packages/dsh-cost-dashboard) | 费用无感知（#500/#318 + 峰谷涨价） | 🟢 测试通过（3/3） |
| [`packages/dsh-vision-bridge`](packages/dsh-vision-bridge) | 纯文本模型不能看图（#474 根因） | 🟢 测试通过（3/3） |
| [`docs/`](docs) | 学习成本高、文档不全（P150-P155） | 🟢 知识库 11 篇 |

## 测试

```bash
npm test    # 13 个用例：dsh-doctor(3) + at-file(4) + cost(3) + vision(3)
```

## 快速开始

```bash
# 1. 环境体检（一键检测 Node/koffi/端口/路径/沙箱，附修复命令）
npx @simon-world/dsh-toolkit doctor        # 或本地：node packages/dsh-doctor/src/index.mjs

# 2. 安装插件市场（找插件入口）
dsh plugin --profile web add dshmarket

# 3. 视觉能力（锁版本安装，勿用 @latest）
dsh plugin --profile web add @liustack/modlens@3.17.2

# 4. 看中文知识库
#    docs/ 目录：安装指南 / 173 痛点 FAQ / 20 条拓展方向 / 贡献路线
```

## 为什么值得用 / 值得贡献

- **痛点驱动**：每个包都对应官方 Discussions 里的真实帖号，不是拍脑袋
- **官方认可路径**：DSH 官方暂不收 PR，但明确欢迎「插件生态 + 文档 + 带补丁的报告」——本仓库就是这三件事的合集
- **3 天可上手**：每个包都是小而美的独立单元，README 自带验证标准
- **MIT 协议**：放心用、放心改、放心传播

## 目录结构

```
dsh-toolkit/
├── packages/
│   ├── dsh-doctor/          # 环境诊断 CLI（Node ≥22.19 检测/koffi 锁定/端口/ASCII 路径/沙箱）
│   ├── dsh-at-file/         # @ 文件引用插件（DSH Web UI composer 扩展）
│   ├── dsh-cost-dashboard/  # 成本仪表盘插件（会话/日/月费用 + 预算告警）
│   └── dsh-vision-bridge/   # 视觉桥插件（图片 → 视觉模型 → 文本回注）
├── docs/                    # 中文知识库（复用 4 份全网调研报告）
├── CONTRIBUTING.md          # 贡献指南（如何加新工具/插件/文档）
└── LICENSE                  # MIT
```

## 开发环境

- Node ≥ 22.19（dsh 硬性要求）
- 每个包独立可跑，无跨包依赖（保持简单）

## 路线图

- [x] v0.1：仓库骨架 + dsh-doctor + 知识库
- [ ] v0.2：dsh-at-file / dsh-cost-dashboard / dsh-vision-bridge 可用版
- [ ] v0.3：全部通过 `dsh plugin add` 安装验证 + 提交 awesome-dsh-plugin
- [ ] v0.4：场景预设包（科研/前端/运维一键装）

## 相关资源

- [官方仓库 deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- [官方 Discussions（痛点来源）](https://github.com/deepseek-ai/deepseek-harness/discussions)
- [awesome-dsh-plugin 精选列表](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [dsh-handbook 深度手册](https://github.com/Electricitysheep/dsh-handbook)

## License

MIT © SIMON-WORLD
