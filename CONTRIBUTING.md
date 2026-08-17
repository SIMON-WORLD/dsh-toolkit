# 贡献指南（dsh-toolkit）

感谢你对 dsh-toolkit 的兴趣！本仓库的每个包都对应 DeepSeek Harness 官方 Discussions 里的真实痛点——贡献时请保持这一原则。

## 怎么贡献

### 1. 新工具/插件

- 目录：`packages/<name>/`
- 每个包必须包含：
  - `package.json`（插件需带 `dsh.bundle` manifest）
  - `README.md`（解决什么痛点 + 对应帖号 + 快速开始 + 验证标准）
  - 代码（Node ESM 或 TypeScript）
  - `tests/`（如有）
- 提交时在 PR 描述里写明：解决哪个痛点（帖号）、验证结果

### 2. 文档

- 目录：`docs/`
- 编号规则：`NN-<english-slug>.md`
- 内容必须有来源（官方帖号/官方文档链接），不写无依据的"经验"

### 3. Bug 修复 / 改进

- 小改动直接 PR；大改动先开 Issue 讨论
- 遵守 DSH 官方讨论区的报告规范：环境 + 复现 + 根因 + 修复

## 规范

- 中文优先（面向中文社区），README 可中英双语
- MIT 协议
- 不引入重型依赖（保持每个包小而美）
- 不修改 DSH 官方配置/系统环境

## 提交检查

```bash
node --check <file>.mjs        # 语法检查
# 有测试的包：npm test
```

## 联系

- Issue：https://github.com/SIMON-WORLD/dsh-toolkit/issues
- 痛点清单：官方 Discussions https://github.com/deepseek-ai/deepseek-harness/discussions
