# 模型接入与视觉（域 C/D）

> 第三方模型接入是官方 Discussions 第二大痛点。视觉能力是本仓库 dsh-vision-bridge 的出发点。

## 换模型（40+ 提供方可接入）

设置页图形化添加即可（模型层本身是插件）。已知坑：

| 问题 | 证据 | 方案 |
|---|---|---|
| 第三方 provider 下子代理报 `no API key for provider route "deepseek-official"` | [#117](https://github.com/deepseek-ai/deepseek-harness/discussions/117)、[#455](https://github.com/deepseek-ai/deepseek-harness/discussions/455) | 默认模型也配成第三方（子代理继承创建时默认模型） |
| 第三方模型无法选思考强度 | [#122](https://github.com/deepseek-ai/deepseek-harness/discussions/122) 家族 | 部分网关需 `supportsDeveloperRole: false`；用网关方言插件 |
| **`unknown tool ""` 流式 bug** | [#161](https://github.com/deepseek-ai/deepseek-harness/discussions/161)、[#725](https://github.com/deepseek-ai/deepseek-harness/discussions/725)（根因：SSE 覆盖赋值） | 等修复或换工具链；社区有修复分支 |
| 会话内切模型后 reasoning 丢失 | [#763](https://github.com/deepseek-ai/deepseek-harness/discussions/763) | 切模型后开新会话 |
| 多轮丢 reasoning：400 | [#231](https://github.com/deepseek-ai/deepseek-harness/discussions/231) | 升级版本 |
| 长对话 API 413 | [#2770](https://github.com/deepseek-ai/deepseek-harness/discussions/2770) | 拆会话（harness 默认发全部上下文） |
| 第三方模型消耗官方 token | [#2779](https://github.com/deepseek-ai/deepseek-harness/discussions/2779) | 检查路由配置 |

## 视觉能力（纯文本模型不能看图）

**根因**：`inputModalities` 硬编码 ["text"]（[#474](https://github.com/deepseek-ai/deepseek-harness/discussions/474)），路由不声明 image 能力——不是 harness 缺工具，是模型路由问题。

**三种社区方案**（按实现方式）：

1. **描述桥**（推荐入门）：图片 → 外部视觉模型（VLM）→ 结构化文本 → 回注给文本模型
   ```bash
   dsh plugin --profile web add @liustack/modlens@3.17.2   # 必须锁版本！
   ```
   ModLens 可复用本地已登录的 Claude Code/Gemini 会话，或接 GLM-4V 免费额度。
2. **路由桥**：图片轮次路由到视觉模型，纯文字轮回 DeepSeek（[#495](https://github.com/deepseek-ai/deepseek-harness/discussions/495) dsh-vision-router）
3. **sidecar**：Chrome 扩展让 DSH 操作浏览器（[#165](https://github.com/deepseek-ai/deepseek-harness/discussions/165) dsh-browser）

**本仓库 dsh-vision-bridge**（packages/dsh-vision-bridge）：描述桥实现，可复用本机 codex-free-vision-bridge（智谱代理 127.0.0.1:19100）作上游，零额外配置。

## 网关方言（进阶）

第三方 OpenAI 兼容网关方言差异（developer role / reasoningEfforts / 流式格式）是接入失败的隐性原因（[#280](https://github.com/deepseek-ai/deepseek-harness/discussions/280) 家族 10+ 帖）。社区方案：`dsh-gateway-presets` 插件自动测定方言。
