# 开源贡献路线（本仓库 + DSH 生态）

> DSH 官方暂不收外部 PR（[CONTRIBUTING.zh.md](https://github.com/deepseek-ai/deepseek-harness/blob/main/CONTRIBUTING.zh.md)），但明确欢迎：插件生态 / 文档教程 / 带补丁的 bug 报告。本仓库就是这三件事的合集。

## 对本仓库的贡献

```bash
# 1. fork + clone
git clone https://github.com/SIMON-WORLD/dsh-toolkit.git
cd dsh-toolkit

# 2. 加新工具/插件/文档（选一）
#    - packages/<new-tool>/   新工具（参考 dsh-doctor 结构）
#    - docs/<nn>-<name>.md    新文档（参考现有编号）
#    - 改进现有包

# 3. 验证 + PR
#    每个包 README 自带验证标准；PR 描述里写明对应痛点帖号
```

## 对 DSH 生态的贡献（五层路线）

| 层 | 动作 | 官方态度 |
|---|---|---|
| 1 会用 | 学习 + 沉淀自己的配置模板 | — |
| 2 会教 | 写中文博客/教程/FAQ | ✅ 官方明示欢迎 |
| 3 会选 | 向 awesome-dsh-plugin / dshbase 收录你验证过的插件 | ✅ 欢迎 |
| 4 会造 | 开发插件，打 `dsh-plugin` topic | ✅ 生态主力 |
| 5 会修 | 讨论区高质 bug 报告（根因+补丁） | ✅ 纳入资源分配；开放 PR 后首批合入 |

## 最高价值的 5 个上游贡献候选（都有根因帖）

1. **中文路径截断**（18 帖同根因 readUtf16，社区已有补丁）
2. **`unknown tool ""` 流式解析**（#725 有修复验证）
3. **子代理模型继承**（#455 高赞）
4. **沙箱 identity rebind**（#278 完整动态复现+修复建议）
5. **dsh doctor 官方命令**（#1719 46 评论）——本仓库已有社区实现

## 30 天落地清单

| 周 | 动作 | 验证 |
|---|---|---|
| W1 | 跑通 DSH + 装 4 核心插件 + 通读官方 cookbook | 个人 setup.md |
| W2 | 写第 1 篇中文教程 + 发 Discussion | 文章发布 |
| W3 | 开发第 1 个插件 + 打 topic + 提交 awesome | 可 `dsh plugin add` 安装 |
| W4 | 提交 1 个高质 bug 报告（带根因） | 报告发出 + upvote |
