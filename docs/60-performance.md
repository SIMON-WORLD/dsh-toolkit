# 性能与稳定性（域 E）

> 官方 Discussions 性能类 16 帖，长会话是最集中的痛点。

## 长会话三连（最高频）

| 问题 | 证据 | 方案 |
|---|---|---|
| 20 万+ token 历史加载失败（Maximum call stack） | [#317](https://github.com/deepseek-ai/deepseek-harness/discussions/317) 家族 8 帖（#359 #370 #501 #508 #534 #548） | **拆会话**；等官方虚拟滚动 |
| TokenMeter 二次方退化 | [#238](https://github.com/deepseek-ai/deepseek-harness/discussions/238) | 长会话后开新会话 |
| 长会话 DOM 全内存 10s 延迟 | [#624](https://github.com/deepseek-ai/deepseek-harness/discussions/624) | 拆会话；IndexedDB offloading 提案 |

**核心建议：一个任务一个会话，长任务定期拆**——既防卡死又省 token。

## 并发与资源

| 问题 | 证据 | 方案 |
|---|---|---|
| 子代理无上限嵌套 56 个拖死服务 | [#131](https://github.com/deepseek-ai/deepseek-harness/discussions/131) | 提示词限制子代理深度/数量 |
| 139 并行子代理 heap OOM | [#754](https://github.com/deepseek-ai/deepseek-harness/discussions/754) | 控制并行度 |
| 高并发输入延迟数分钟无提示 | [#477](https://github.com/deepseek-ai/deepseek-harness/discussions/477) | 避免同时多任务 |
| WS 无背压内存泄漏 | [#671](https://github.com/deepseek-ai/deepseek-harness/discussions/671) | 官方未修 |
| 强制 kill 后尾部丢失 | [#483](https://github.com/deepseek-ai/deepseek-harness/discussions/483) | 正常退出 |

## 正面数据（性能其实不差）

- 缓存命中率 95-99.7%（[#560](https://github.com/deepseek-ai/deepseek-harness/discussions/560)）——长任务反而省钱
- 同 key 下 harness TPS 140 vs opencode 80（[#265](https://github.com/deepseek-ai/deepseek-harness/discussions/265)）
