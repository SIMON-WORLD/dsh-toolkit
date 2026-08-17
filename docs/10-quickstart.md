# 10 秒速查：让 DSH 立刻变好用

先抄这 8 条，立即从「毛坯房」变「精装工作台」：

```bash
# 1) 一键装插件市场（可搜索、一键安装/升级/主题切换）
dsh plugin --profile web add dshmarket

# 2) 让 Agent 自己帮你找插件（自然语言推荐）
dsh plugin --profile web add dsh-find-plugin

# 3) 视觉能力：给纯文本模型"装眼睛"（务必锁版本，勿用 @latest）
dsh plugin --profile web add @liustack/modlens@3.17.2

# 4) Web UI 全家桶：任务看板 + Git 图谱 + token 实时统计 + 皮肤 + 桌面宠物
dsh plugin --profile web add @linxin666/dsh-web-ui-all

# 5) 交互式 UI 渲染（模型输出不再是纯 Markdown）
dsh plugin --profile web add git+https://github.com/omdsh-dev/dsh-genui.git

# 6) @ 引用工作区文件（Claude Code 同款体验）
dsh plugin --profile web add <dsh-at-file 包名>

# 7) 换模型：接入 Kimi/GLM/OpenAI/Anthropic 等（设置页图形化添加即可）
# 8) Windows 下避开 3080 端口（Hyper-V 保留区间 3070-3169 会 EACCES）
dsh web --port 13080
```

**装完插件后：重启 dsh 进程 + 浏览器硬刷新（Ctrl+F5）** —— 80% 的"没生效"问题由此解决。

## 新人 10 分钟上手

```powershell
# 1. 环境：Node ≥ 22.19
node -v

# 2. 启动（首次等 1-8 分钟下载）
npx @deepseek-ai/dsh web
#   浏览器打开 http://127.0.0.1:3080

# 3. 设置 → 模型：填 DeepSeek API Key（存 $DSH_HOME/.credentials.yaml，只写不读）
# 4. 选择工作区：必须是 ASCII 路径（Windows 规避中文截断 bug）
# 5. 装插件（装完重启 + Ctrl+F5）
dsh plugin --profile web add dshmarket
dsh plugin --profile web add @liustack/modlens@3.17.2
dsh plugin --profile web add @linxin666/dsh-web-ui-all
# 6. 三档权限：只读 / 工作区可写 / 完全访问，默认用工作区可写
```

## 省 token 提示

DSH 多轮工具调用自动复用上下文缓存（缓存命中 95-99.7%，[#560](https://github.com/deepseek-ai/deepseek-harness/discussions/560)），长任务反而比手动一步步问便宜——这是它的隐性优势。2026-08-17 起峰谷计价（Flash 谷 0.66/峰 1.32），低谷时段跑长任务更省。
