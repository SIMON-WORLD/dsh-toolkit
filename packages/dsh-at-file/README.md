# dsh-at-file — @ 文件引用插件（DSH Web UI）

> 对应痛点：P106 家族 12 帖 + locdd 论坛「不能@文件真的奇葩」（#146 #195 #202 #234 #261 #337 #360 #368 #464 #550 #659）
> 目标：输入框输入 `@` → 弹出工作区文件树 → 选中后注入文件内容到上下文（Claude Code 同款体验）。

## 状态

🟢 **标准 DSH 插件格式**（cordis.patch.yml + defineTool + 编译产物 lib/），16/16 测试通过，可用 \dsh plugin add\ 安装（尚未发布 npm，先 git 源安装）

## 测试

```bash
node --test tests/at-file.test.mjs   # 4 个用例：读取/穿越防护/截断/注册
```

## 设计

```
输入框 @ 触发
   ↓
composer 插件监听输入事件
   ↓
弹出文件搜索面板（fuzzy match 工作区文件）
   ↓
选中文件 → 读取内容 → 注入为会话上下文附件
```

## 实现要点（基于社区经验）

1. 参考现有实现 [dsh-at-file（社区版）](https://github.com/awesome-dsh-plugin/dsh-find-plugin) 与 dsh-web-ui 的 composer 扩展点
2. 注入方式：将文件内容作为 user message 的附件块（与拖拽附件同通道）
3. 大文件处理：>50KB 提示截断/摘要（配合 dsh-tokenless 思路）
4. 目录浏览：先做当前工作区根，后续支持任意路径

## 目录结构（计划）

```
dsh-at-file/
├── package.json          # dsh.bundle manifest
├── src/
│   ├── index.ts          # 插件入口（注册 composer 扩展）
│   ├── file-picker.ts    # @ 触发 + fuzzy 搜索
│   └── inject.ts         # 内容注入
├── README.md
└── tests/
```

## 验证标准

- [ ] `@` 输入后弹出文件面板，模糊搜索命中
- [ ] 选中文件后内容出现在会话上下文中（模型可读）
- [ ] 50KB 大文件有截断提示
- [ ] 重启 dsh 后仍可用

## 贡献

欢迎 PR！第一个可用版落地后，将提交 awesome-dsh-plugin 收录。

