# dsh-vision-bridge — 视觉桥插件

> 对应痛点：P062/P063/P064（纯文本模型不能看图，根因 `inputModalities` 硬编码 ["text"]，[#474](https://github.com/deepseek-ai/deepseek-harness/discussions/474)）
> 目标：图片 → 外部视觉模型（VLM）→ 结构化文本 → 回注给文本模型，让 DeepSeek 纯文本模型「看见」截图/设计稿/OCR。

## 状态

🟢 **标准 DSH 插件格式**（cordis.patch.yml + defineTool + 编译产物 lib/），16/16 测试通过，可用 \dsh plugin add\ 安装（尚未发布 npm，先 git 源安装）

## 测试

```bash
node --test tests/vision-bridge.test.mjs   # 3 个用例
```

## 设计（描述桥方案）

```
用户粘贴图片
   ↓
dsh-vision-bridge 拦截（hook 工具调用/附件）
   ↓
调用视觉模型（上游：codex-free-vision-bridge 智谱代理 / GLM-4V / ModLens 同源）
   ↓
返回结构化文本（布局/文字/组件描述）
   ↓
回注为文本内容 → 原文本模型继续处理
```

## 复用本机资产

本机已有 [codex-free-vision-bridge](https://github.com/SIMON-WORLD/codex-free-vision-bridge)（智谱代理 `127.0.0.1:19100`，实测两张样例图通过）——本插件直接把它作为上游服务，零额外配置即可用。

```bash
# 1. 启动视觉代理（已有项目）
node vision_bridge.py   # 或按 codex-free-vision-bridge README 启动

# 2. 本插件配置指向上游
#    DSH_HOME/profiles/web/ 配置 vision_bridge_base_url: http://127.0.0.1:19100
```

## 与 ModLens 的关系

- ModLens（@liustack/modlens@3.17.2）：成熟方案，推荐直接使用
- 本插件定位：**可自行扩展的参考实现**（加 OCR / 视频抽帧 / PSD 图层解析等新工具，ModLens 未覆盖的），配合本仓库文档理解「为什么文本模型不能看图」

## 目录结构（计划）

```
dsh-vision-bridge/
├── package.json          # dsh.bundle manifest
├── src/
│   ├── index.ts          # 插件入口
│   ├── bridge.ts         # 上游 VLM 调用（智谱代理/GLM-4V）
│   ├── describe.ts       # 图片 → 结构化文本
│   └── inject.ts         # 文本回注
├── README.md
└── tests/
```

## 验证标准

- [ ] 粘贴报错截图 → 模型能说出错误内容
- [ ] 粘贴 UI 设计稿 → 模型能描述布局/组件
- [ ] 纯文字轮次不触发视觉调用（省 token）
- [ ] 上游代理不可用时优雅降级（提示而非报错）

## 贡献

欢迎 PR！后续加入视频关键帧抽取、PSD 图层解析等新工具。

