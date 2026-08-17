# dsh-cost-dashboard — 成本仪表盘插件

> 对应痛点：P144-P149（费用无感知 #500/#318、无预算功能 #704、峰谷计价涨价）+ 官方无 user_id 归因（#599）
> 目标：会话/日/月费用实时可见 + 预算阈值告警 + 低谷时段建议。

## 状态

🟢 **测试通过版**：核心逻辑已实现并有单元测试（3/3 通过：工具注册 / token 累加与费用估算 / 会话隔离）。待真实 DSH 事件流集成验证。

## 测试

```bash
node --test tests/cost-dashboard.test.mjs   # 3 个用例
```

## 设计

```
TokenMeter/事件流（增量，勿用全量快照——P077 性能教训）
   ↓
价格表（按 provider/模型/峰谷时段）
   ↓
会话成本计算 → 日/月累计
   ↓
预算阈值 → 桌面通知告警（复用 dsh-web-attention-badge 思路）
   ↓
低谷时段建议（Flash 谷 0.66 vs 峰 1.32）
```

## 实现要点

1. **性能红线**：TokenMeter 每事件重建全量快照导致二次方退化（[#238](https://github.com/deepseek-ai/deepseek-harness/discussions/238)）——本插件必须用**增量累加**
2. 价格表可配置（JSON），支持峰谷两档
3. 告警通道：Web 角标 + 系统通知
4. 与 dsh-web-ui 的 live-token-stats 互补（它显示实时 TPS，本插件显示费用与预算）

## 目录结构（计划）

```
dsh-cost-dashboard/
├── package.json          # dsh.bundle manifest
├── src/
│   ├── index.ts          # 插件入口
│   ├── meter.ts          # 增量 token 统计
│   ├── pricing.ts        # 价格表 + 峰谷
│   └── alert.ts          # 预算告警
├── pricing.example.json  # 价格表示例
├── README.md
└── tests/
```

## 验证标准

- [ ] 会话结束后成本与官方账单对账误差 <5%
- [ ] 设置预算后超额触发通知
- [ ] 长会话（10 万+ token）不卡顿（增量统计）
- [ ] 价格表可热更新

## 贡献

欢迎 PR！本插件与 dsh-doctor 一起构成「体检 + 省钱」组合。
