# Windows 兼容性避坑（域 B，第一大痛点）

> 官方 Discussions 中 Windows 相关 60+ 帖，是**第一大痛点**。本文给出可复制方案。

## 最高频：中文路径截断（17+ 帖同根因）

**现象**：工作区/项目名含汉字（U+XX00 字符）被截断，如「整理APP需求」→「整理APP」、「需求」→「」。
**根因**：`readUtf16` 只查低字节 0x00（[#107](https://github.com/deepseek-ai/deepseek-harness/discussions/107)），rc.6 未修复。
**方案**：

```bash
# ✅ 立即生效：工作区路径/项目名只用 ASCII
# 🔧 社区已有可 cherry-pick 补丁（#244 #563 #580）
# 💡 贡献点：这是官方暂不收 PR 期间最值得做的上游贡献之一
```

**相关帖**：#107 #151 #210 #244 #295 #396 #428 #488 #563 #580 #617 #643 #644 #701 #727 #761 #800 #2777（共 18 帖）

## 其他高频 Windows 坑

| 问题 | 证据 | 方案 |
|---|---|---|
| 目录选择器崩溃 | [#30](https://github.com/deepseek-ai/deepseek-harness/discussions/30) 家族 | 锁 `koffi@3.1.2`（3.1.3/3.1.4 预编译损坏 [#293](https://github.com/deepseek-ai/deepseek-harness/discussions/293)） |
| 对话框不置前 | [#37](https://github.com/deepseek-ai/deepseek-harness/discussions/37) | 换 Chrome/Edge 前台 |
| pwsh 调用报 `missing required property "command"` | [#121](https://github.com/deepseek-ai/deepseek-harness/discussions/121) 家族 | 避开长 pwsh 任务；升级版本 |
| 调 pwsh 假死 | [#663](https://github.com/deepseek-ai/deepseek-harness/discussions/663) | 最严重版；用 cmd 相关工具 |
| 写文件 EIO | [#425](https://github.com/deepseek-ai/deepseek-harness/discussions/425) | 重试；避开同步盘/占用 |
| 工作区选盘根目录异常 | [#65](https://github.com/deepseek-ai/deepseek-harness/discussions/65) | 选具体项目文件夹 |
| workspace-write 下 pwsh 挂起 | [#2781](https://github.com/deepseek-ai/deepseek-harness/discussions/2781) | 临时改 danger-full-access（注意安全） |
| 沙箱临时目录清理后崩溃 | [#758](https://github.com/deepseek-ai/deepseek-harness/discussions/758) | 清缓存重启；别放重要数据 |
| 崩溃后 .tmp 明文残留 | [#674](https://github.com/deepseek-ai/deepseek-harness/discussions/674) | 定期清理 `$DSH_HOME` |
| 大工作区首次沙箱执行阻塞 | [#2774](https://github.com/deepseek-ai/deepseek-harness/discussions/2774) | 首次执行前耐心等 |

## Windows 用户最佳实践总结

1. **全 ASCII 路径**（规避 18 帖的截断 bug）
2. **换端口** `dsh web --port 13080`（规避 Hyper-V 保留区间）
3. **锁 koffi@3.1.2**（规避 picker 崩溃）
4. **避开根目录工作区**、**避开实时同步盘**（OneDrive/百度同步）
5. 定期备份 `$DSH_HOME/sessions`（防 [#2787](https://github.com/deepseek-ai/deepseek-harness/discussions/2787) 数据丢失事故）
