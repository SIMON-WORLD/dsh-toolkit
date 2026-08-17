# 安全与权限（域 F/H）

> 社区安全研究者对 DSH 做了系统性审计（#243 #250 #278 #381 #454 #774 #778），以下是真实风险与应对。

## 已知真实风险（必须了解）

| 风险 | 证据 | 应对 |
|---|---|---|
| workflow 工具 vm 逃逸（宿主域闭包注入） | [#243](https://github.com/deepseek-ai/deepseek-harness/discussions/243)、[#778](https://github.com/deepseek-ai/deepseek-harness/discussions/778) | 勿在 vm 内跑不可信代码 |
| Web approval 回环：模型自批准 full-access | [#250](https://github.com/deepseek-ai/deepseek-harness/discussions/250) | 留意授权弹窗 |
| `/tmp` workspace 可被 rebind 拓宽授权 | [#278](https://github.com/deepseek-ai/deepseek-harness/discussions/278) | 不在 /tmp 放工作区 |
| localhost 可被 iframe 点击劫持 | [#381](https://github.com/deepseek-ai/deepseek-harness/discussions/381) | 浏览器安全隔离 |
| workspace-write 下可递归删整个工作区零确认 | [#149](https://github.com/deepseek-ai/deepseek-harness/discussions/149) | 重要工作区先备份 |
| Full Access 模式误删家目录（真实事故） | [#461](https://github.com/deepseek-ai/deepseek-harness/discussions/461) | 慎用 Full Access |
| API key 异常消耗 | [#2756](https://github.com/deepseek-ai/deepseek-harness/discussions/2756) | 轮换 key；检查插件权限 |
| 会话历史被清空（含其他 Agent） | [#2787](https://github.com/deepseek-ai/deepseek-harness/discussions/2787) | **备份 `$DSH_HOME/sessions`** |

## 权限模式使用建议

| 模式 | 权限 | 适用 |
|---|---|---|
| 只读 | 不写文件 | 不熟悉的项目 / 审查 |
| 工作区可写 | 只写工作区内 | **默认选择** |
| 完全访问 | 全盘 | 仅在受控环境，⚠️ 等同 shell 权限 |

## 插件安全（重复强调）

⚠️ 装插件 = 让第三方代码以你的权限运行。见《50-plugin-ecosystem.md》安全红线。

## 安全类贡献点

- `dsh-vault` 加密凭据保险库（官方讨论 [#1457 99 评论](https://github.com/deepseek-ai/deepseek-harness/discussions/1457)，需求爆棚）
- 权限门禁插件（高危操作白名单/黑名单）
- 插件安全评分（静态扫描 dsh.bundle + 网络调用）
