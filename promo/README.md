# dsh-toolkit 推广素材包

> 覆盖 6 个方向（dsh-doctor / 知识库 / @文件引用 / 成本仪表盘 / 视觉桥 / 开源贡献），
> 配套三平台文案：公众号长文（tech article）、B站视频脚本（video script）、小红书短文（xiaohongshu）。

## 内容地图

| 文件 | 平台 | 定位 | 适合人群 |
|---|---|---|---|
| `article-wechat.md` | 微信公众号/知乎 | 深度长文（约 2000 字） | 开发者、AI 工具党 |
| `video-bilibili.md` | B站 | 3-5 分钟视频脚本 | 学生、新手、搞机党 |
| `post-xiaohongshu.md` | 小红书 | 图文短文（标题党向） | 泛 AI 用户、效率党 |
| `tweet-x.md` | X/Twitter | 英文短推 + 链接 | 海外开发者 |

## 核心卖点（所有文案共用）

1. **痛点驱动**：基于官方 Discussions 2764 帖挖掘出的 173 条真实痛点，每个工具对应真实帖号
2. **可验证**：16/16 单元测试 + 真实 DSH 环境安装验证（dsh web 成功启动）+ CI green
3. **标准插件格式**：cordis.patch.yml + defineTool + 编译产物，`dsh plugin add` 可直接安装
4. **开源可贡献**：MIT + CONTRIBUTING + 已提交 awesome-dsh-plugin 收录 PR #1403
5. **10 秒上手**：`node scripts/verify-install.mjs` / `npm test` / `npm run doctor`

## 传播节奏建议

- Day 1：小红书发短文（快）→ 引流 GitHub
- Day 2：公众号长文（深）→ 收藏转发
- Day 3：B站视频（广）→ 算法推荐 + 评论区答疑
- 持续：X 英文推（海外曝光）+ 官方 Show and tell #2801 更新

## 链接速查（发帖时替换）

- 仓库：https://github.com/SIMON-WORLD/dsh-toolkit
- 官方讨论：#2801（Show and tell）
- awesome PR：#1403
- 官方 Discussions（痛点来源）：https://github.com/deepseek-ai/deepseek-harness/discussions
