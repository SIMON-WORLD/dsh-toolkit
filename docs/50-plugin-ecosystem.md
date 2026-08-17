# 插件生态：找 / 装 / 管 / 安全（域 F）

> 插件 2300+ 太多难选是社区讨论 #1597 的热点。本文给出一站式答案。

## 找插件（四选一）

| 方式 | 命令/入口 | 特点 |
|---|---|---|
| 插件市场（推荐） | `dsh plugin --profile web add dshmarket` | 应用内可搜索/一键装/一键升级/主题切换 |
| Agent 帮你找 | `dsh plugin --profile web add dsh-find-plugin` | 自然语言描述需求 → 推荐+安装命令+安全等级 |
| 中文 AI 总结目录 | [mydsh.dev/plugins](https://mydsh.dev/plugins) | 每个插件有中文一句话总结 + AI 搜索 |
| 实测收录目录 | [dshbase.com/plugins](https://dshbase.com/plugins/directory/) | 每个插件实际装过，标注能不能跑 |

## 装插件（防坑三步）

```bash
# 1. 先备份 profile 配置（防插件写坏导致整个 dsh 崩溃 #297）
Copy-Item "$env:DSH_HOME\profiles\web\*.yml" "$env:DSH_HOME\profiles\web\backup-$(Get-Date -f yyyyMMddHHmm).yml"

# 2. 锁版本安装（勿用 @latest，pnpm 同步延迟会装到不兼容版）
dsh plugin --profile web add <包名>@<版本号>

# 3. 重启 + 硬刷新
#    终止 dsh web 进程 → 重新启动 → 浏览器 Ctrl+F5
```

## 管插件（生命周期）

- **dsh-plugin-market**（[github.com/uluckystar/dsh-plugin-market](https://github.com/uluckystar/dsh-plugin-market)）：安装/启用/停用/卸载七态管理 + 写前自动备份 + 坏配置自动回滚 + 一键自动重启（10-30s）
- 在线看板：[mydsh.dev](https://mydsh.dev)

## 安全红线（必须知道）

> ⚠️ 安装插件 = 让第三方代码以你的权限运行。插件能读文件、用凭据、联网；工具审批**不**沙箱插件代码。

1. 陌生插件先在**空测试文件夹 / 无密钥环境**试
2. 只从 awesome 列表 / 校验目录（dsplugin.app）安装
3. 装前 review 源码；`dsh plugin add` 无签名/来源校验（[#587](https://github.com/deepseek-ai/deepseek-harness/discussions/587)）
4. 社区真实事故：API key 异常消耗（[#2756](https://github.com/deepseek-ai/deepseek-harness/discussions/2756)）、会话历史被清空（[#2787](https://github.com/deepseek-ai/deepseek-harness/discussions/2787)）

## 推荐清单（必装 4 件套）

```bash
dsh plugin --profile web add dshmarket
dsh plugin --profile web add @liustack/modlens@3.17.2
dsh plugin --profile web add @linxin666/dsh-web-ui-all
dsh plugin --profile web add git+https://github.com/omdsh-dev/dsh-genui.git
```
