# DeepSeek Harness 痛点全景清单（120+ 条，全网挖掘版）

> 调研时间：2026-08-17
> 数据基础：官方 Discussions 全量 2759 帖 + dsh-handbook 780 帖逐帖挖掘（2.1-2.8 八大类 + P0-P3 优先级清单）+ 6 篇中英文深度评测 + locdd/V2EX 论坛讨论 + 本机 dsh 0.1.0-rc.6 实测
> 编号规则：P = Pain；每条含【证据】【状态】；状态 = ✅可绕过 / 🔧可修复（社区补丁）/ ⏳官方未修 / 🚧待官方开发 / 💡生态已补
> 配套：《20 条可拓展方向与完成路径》（同目录 dsh_extension_directions_20260817.md）

---

## 域 A｜安装与启动（15 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P001 | npx 首次下载 500+ 包，Windows 上 8+ 分钟零反馈 | [#176](https://github.com/deepseek-ai/deepseek-harness/discussions/176) | ✅ 正常现象，耐心等待 |
| P002 | Node 版本过低启动失败（`AbortSignal.timeout is not a function` / `createZstdDecompress` 缺失） | [#100](https://github.com/deepseek-ai/deepseek-harness/discussions/100)、[#311](https://github.com/deepseek-ai/deepseek-harness/discussions/311) | ✅ 需 Node ≥ 22.19 |
| P003 | macOS/NixOS 报 `--expose-internals is required for HMR service` | [#113](https://github.com/deepseek-ai/deepseek-harness/discussions/113)、[#193](https://github.com/deepseek-ai/deepseek-harness/discussions/193)、[#269](https://github.com/deepseek-ai/deepseek-harness/discussions/269)、[#690](https://github.com/deepseek-ai/deepseek-harness/discussions/690) | ✅ `node --expose-internals` 启动 |
| P004 | 全局安装 `pnpm add -g` 后找不到 `cordis-plugin-timer` / loader 解析不到 88 个插件 | [#55](https://github.com/deepseek-ai/deepseek-harness/discussions/55)、[#204](https://github.com/deepseek-ai/deepseek-harness/discussions/204) | ✅ 全局安装依赖解析问题，改用 npx |
| P005 | 发布包漏 `dsh-app-boot` 依赖，手动补装 `cordis-plugin-group` 绕过 | [#273](https://github.com/deepseek-ai/deepseek-harness/discussions/273) | 🔧 手动补装依赖 |
| P006 | Linux 缺 node-pty `pty.node` 预编译 / GCC<10 无法编译 | [#177](https://github.com/deepseek-ai/deepseek-harness/discussions/177)、[#605](https://github.com/deepseek-ai/deepseek-harness/discussions/605)、[#650](https://github.com/deepseek-ai/deepseek-harness/discussions/650) | ✅ 装 g++/make，GCC≥10 |
| P007 | Windows 源码编译 rolldown 缺 binding | [#141](https://github.com/deepseek-ai/deepseek-harness/discussions/141) | ✅ `pnpm i @rolldown/binding-win32-x64-msvc` |
| P008 | 首次启动界面像卡死（需 API key + 工作区两步，无引导） | [#619](https://github.com/deepseek-ai/deepseek-harness/discussions/619)、[#750](https://github.com/deepseek-ai/deepseek-harness/discussions/750) | ⏳ 官方未做引导，等版本迭代 |
| P009 | 内测声明弹窗无法关闭 | [#737](https://github.com/deepseek-ai/deepseek-harness/discussions/737) | ⏳ 官方未修 |
| P010 | 默认端口 3080 落在 Hyper-V 保留区间 EACCES | [#589](https://github.com/deepseek-ai/deepseek-harness/discussions/589) | ✅ 换端口 `dsh web --port 13080` |
| P011 | 端口被占用/旧实例残留，报"reconnecting" | [#648](https://github.com/deepseek-ai/deepseek-harness/discussions/648) | ✅ 杀进程重启 |
| P012 | dsh web 不处理 SIGHUP，关终端即退出 | [#600](https://github.com/deepseek-ai/deepseek-harness/discussions/600) | ✅ 用 nohup/后台任务/Docker 常驻 |
| P013 | Android/Termux 无法运行（npx 安装失败） | [#136](https://github.com/deepseek-ai/deepseek-harness/discussions/136)、[#248](https://github.com/deepseek-ai/deepseek-harness/discussions/248)（Android ROM 禁 link()） | ⏳ 平台限制；🔧 patch 已附 |
| P014 | 启动后不自动打开浏览器 | [#793](https://github.com/deepseek-ai/deepseek-harness/discussions/793) | ✅ 手动打开；可做插件 |
| P015 | 环境问题无统一诊断工具（用户 8+ 帖各自踩不同环境坑） | [#649](https://github.com/deepseek-ai/deepseek-harness/discussions/649)（dsh doctor 提议）、[#738](https://github.com/deepseek-ai/deepseek-harness/discussions/738)（dsh-doctor-windows） | 💡 社区已有 dsh-doctor-windows；官方 dsh doctor 未做 |

## 域 B｜Windows 兼容（22 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P016 | **中文路径截断**（U+XX00 字符），工作区/项目名含汉字被截断 | [#107](https://github.com/deepseek-ai/deepseek-harness/discussions/107)（根因 readUtf16）家族 17+ 帖（#151 #210 #244 #295 #396 #428 #488 #563 #580 #617 #643 #644 #701 #727 #761 #800） | ✅ 全 ASCII 路径；🔧 社区已有可 cherry-pick 补丁 |
| P017 | 目录选择器 worker 崩溃（koffi 相关） | [#30](https://github.com/deepseek-ai/deepseek-harness/discussions/30) 家族（#38 #154 #236 #293 #449 #768） | ✅ 锁 koffi@3.1.2；🔧 #768 根因=STA CoUninitialize 段错误 |
| P018 | koffi 3.1.3/3.1.4 预编译损坏 | [#293](https://github.com/deepseek-ai/deepseek-harness/discussions/293)、[#197](https://github.com/deepseek-ai/deepseek-harness/discussions/197) | ✅ 锁 koffi@3.1.2 |
| P019 | 目录选择对话框不置前/在后台弹出（Edge/Firefox） | [#37](https://github.com/deepseek-ai/deepseek-harness/discussions/37)、[#92](https://github.com/deepseek-ai/deepseek-harness/discussions/92)、[#259](https://github.com/deepseek-ai/deepseek-harness/discussions/259)、[#595](https://github.com/deepseek-ai/deepseek-harness/discussions/595) | ✅ 换 Chrome/Edge 前台 |
| P020 | PowerShell 调用报 `missing required property "command"` 循环耗 token | [#121](https://github.com/deepseek-ai/deepseek-harness/discussions/121) 家族（#225 #409 #615 #716） | ⏳ 官方未修；避开长 pwsh 任务 |
| P021 | Windows 调 pwsh 导致 DSH 假死（terminate 不回收） | [#663](https://github.com/deepseek-ai/deepseek-harness/discussions/663) | ⏳ 官方未修（最严重版） |
| P022 | 写文件 EIO（ReplaceFileW 瞬时文件锁无重试） | [#425](https://github.com/deepseek-ai/deepseek-harness/discussions/425) | ✅ 重试；避开同步盘/占用 |
| P023 | 工作区选磁盘根目录 → 空标题 + 异常 | [#65](https://github.com/deepseek-ai/deepseek-harness/discussions/65)、[#143](https://github.com/deepseek-ai/deepseek-harness/discussions/143) | ✅ 选具体项目文件夹 |
| P024 | 工作区路径含空格/特殊符号失败 | [#345](https://github.com/deepseek-ai/deepseek-harness/discussions/345)、[#592](https://github.com/deepseek-ai/deepseek-harness/discussions/592) | ✅ 纯 ASCII 无空格路径 |
| P025 | workspace 连接后外部新增子目录无法写入（ACE 不继承） | [#401](https://github.com/deepseek-ai/deepseek-harness/discussions/401)、[#423](https://github.com/deepseek-ai/deepseek-harness/discussions/423) | ⏳ 官方未修；外部建目录后重连 |
| P026 | 沙箱临时目录清理后永久崩溃不自愈（P0） | [#758](https://github.com/deepseek-ai/deepseek-harness/discussions/758) | ⏳ 官方未修；清缓存重启 |
| P027 | Windows 快速模式默认调 Linux 命令（terminal inspection unsupported） | [#53](https://github.com/deepseek-ai/deepseek-harness/discussions/53) | ⏳ 平台差异 |
| P028 | `terminal_open` Windows 不支持（createProcessInspector 只实现 linux/darwin） | [#746](https://github.com/deepseek-ai/deepseek-harness/discussions/746) | ⏳ 官方未做 Windows 持久终端 |
| P029 | 崩溃后 `.tmp` 明文会话文件残留不清理（隐私） | [#674](https://github.com/deepseek-ai/deepseek-harness/discussions/674) | ✅ 手动清理；⏳ 官方未自动清理 |
| P030 | 会话 ID 大小写冲突（Windows 大小写不敏感） | [#249](https://github.com/deepseek-ai/deepseek-harness/discussions/249) | ⏳ 官方未修 |
| P031 | taskkill 当前目录劫持：workspace 放 taskkill.exe 可劫持宿主清理 | [#268](https://github.com/deepseek-ai/deepseek-harness/discussions/268) | ✅ 避开该文件名；🔧 安全建议 |
| P032 | 快速模式 Windows 下 `unknown tool ""` 高频 | [#615](https://github.com/deepseek-ai/deepseek-harness/discussions/615) | 见 P069 流式 bug 家族 |
| P033 | Windows 子进程无优雅终止阶梯/孙进程输出截断/spill 权限不生效 | [#717](https://github.com/deepseek-ai/deepseek-harness/discussions/717) | ⏳ 官方未修（系统性问题清单） |
| P034 | Python `tempfile.mkdtemp` 显式安全描述符 → 沙箱内自锁 | [#463](https://github.com/deepseek-ai/deepseek-harness/discussions/463) | ✅ 测试代码避开 pytest tmp_path |
| P035 | 工作区存在 `.env` 文件夹 → EISDIR | [#71](https://github.com/deepseek-ai/deepseek-harness/discussions/71) | ✅ 改名 |
| P036 | VS Code 内嵌 web UI 也触发中文路径截断 | [#428](https://github.com/deepseek-ai/deepseek-harness/discussions/428) | 同 P016 |
| P037 | 工作区文件夹改名后卡死 | [#747](https://github.com/deepseek-ai/deepseek-harness/discussions/747) | ✅ 改名后重开 |

## 域 C｜插件开发与安装（18 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P038 | 插件 schema 写坏 cordis.patch.yml → 整个 dsh 崩溃 | [#297](https://github.com/deepseek-ai/deepseek-harness/discussions/297)、[#708](https://github.com/deepseek-ai/deepseek-harness/discussions/708) | ✅ 装前备份配置 |
| P039 | `dsh plugin add github:` 只加依赖不 append 到 profile bundles | [#656](https://github.com/deepseek-ai/deepseek-harness/discussions/656) | ✅ 装完检查 bundles 段 |
| P040 | 动态插件重启后不持久化 | [#382](https://github.com/deepseek-ai/deepseek-harness/discussions/382)、[#620](https://github.com/deepseek-ai/deepseek-harness/discussions/620) | ✅ 验证后沉淀到组合文件 |
| P041 | `@deepseek-ai/dsh-tools@0.0.1-rc.1` 装不上：peer `dsh-type-meta` 未发布 | [#410](https://github.com/deepseek-ai/deepseek-harness/discussions/410) | ⏳ 官方发布缺口 |
| P042 | 无参工具调用被拒（binding arguments must be lossless JSON） | [#129](https://github.com/deepseek-ai/deepseek-harness/discussions/129) | 🔧 工具声明加空参 schema |
| P043 | code 模式 run_code/bash 同名 required description 缺失 → 死循环 | [#558](https://github.com/deepseek-ai/deepseek-harness/discussions/558)、[#581](https://github.com/deepseek-ai/deepseek-harness/discussions/581)、[#689](https://github.com/deepseek-ai/deepseek-harness/discussions/689) | 🔧 工具 description 必须齐全 |
| P044 | 进程内多份 `@deepseek-ai/dsh-tools` → Symbol key 不匹配静默崩 | [#572](https://github.com/deepseek-ai/deepseek-harness/discussions/572)、[#783](https://github.com/deepseek-ai/deepseek-harness/discussions/783) | 🔧 依赖去重（pnpm 策略） |
| P045 | 工具 description 含 `{{...}}` 破坏 code-mode prompt | [#711](https://github.com/deepseek-ai/deepseek-harness/discussions/711) | 🔧 转义花括号 |
| P046 | 所有带参工具调用生成 `{"input": ""}` 参数名丢失 | [#715](https://github.com/deepseek-ai/deepseek-harness/discussions/715) | ⏳ 官方未修（参数丢失 bug） |
| P047 | Claude hook matcher 大小写敏感：Bash 选不中 bash | [#582](https://github.com/deepseek-ai/deepseek-harness/discussions/582) | 🔧 hook 名用小写匹配 |
| P048 | `defaultTimeoutMs: 0` 使 hook 全部 fail-open | [#583](https://github.com/deepseek-ai/deepseek-harness/discussions/583)、[#460](https://github.com/deepseek-ai/deepseek-harness/discussions/460) | 🔧 不设 0，加载时校验 |
| P049 | scrubbedParentEnv 子串误伤 KEYBOARD/MONKEY 等环境变量 | [#584](https://github.com/deepseek-ai/deepseek-harness/discussions/584) | ⏳ 官方未修 |
| P050 | MCP list_changed 重同步撞 namespace 抢占 → 工具集清空 | [#618](https://github.com/deepseek-ai/deepseek-harness/discussions/618) | ⏳ 官方未修 |
| P051 | 插件运行时验证成本高（无 key 时无法验证） | [#462](https://github.com/deepseek-ai/deepseek-harness/discussions/462) | 💡 已有方法论：mock llm + headless + 审计 dump |
| P052 | 插件缺 Manifest 标准与 i18n 支持 | [#777](https://github.com/deepseek-ai/deepseek-harness/discussions/777) | 🚧 生态标准待建 |
| P053 | 第三方插件 boot 期有全配置树写权限，`dsh plugin add` 无签名/来源校验 | [#587](https://github.com/deepseek-ai/deepseek-harness/discussions/587) | ⚠️ 安全风险，装前审源码 |
| P054 | 设置面板白名单挡住第三方插件配置命名空间 | [#502](https://github.com/deepseek-ai/deepseek-harness/discussions/502) | ⏳ 官方未开放 |
| P055 | patch 失败静默启动（id 覆盖/未知 id 不报错） | [#432](https://github.com/deepseek-ai/deepseek-harness/discussions/432) | ✅ 用 `--dump-config` 校验 |

## 域 D｜模型与 API 接入（20 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P056 | 第三方 provider 下子代理报 `no API key for provider route "deepseek-official"` | [#117](https://github.com/deepseek-ai/deepseek-harness/discussions/117)、[#455](https://github.com/deepseek-ai/deepseek-harness/discussions/455) | ✅ 默认模型也配第三方；🔧 根因=子代理继承创建时默认模型 |
| P057 | 第三方模型无法选思考强度 | [#122](https://github.com/deepseek-ai/deepseek-harness/discussions/122) 家族（#196 #302 #722 #736） | ⏳ 官方未支持 |
| P058 | `supportsDeveloperRole: false` 未暴露 → 火山 Coding Plan 等必失败 | [#280](https://github.com/deepseek-ai/deepseek-harness/discussions/280) 家族（#551 #614 #636） | 💡 dsh-gateway-presets 自动测定 |
| P059 | **`unknown tool ""` 流式 bug**：SSE 覆盖赋值而非累加 | [#161](https://github.com/deepseek-ai/deepseek-harness/discussions/161)、[#725](https://github.com/deepseek-ai/deepseek-harness/discussions/725)（根因+修复验证） | ⏳ rc.6 未修；🔧 社区修复分支 |
| P060 | 多轮丢 reasoning：400 `reasoning_text must be passed back` | [#231](https://github.com/deepseek-ai/deepseek-harness/discussions/231)、[#739](https://github.com/deepseek-ai/deepseek-harness/discussions/739) | ✅ 升级版本/换非思考模式 |
| P061 | 会话内切换模型后 reasoning 永久丢失 | [#763](https://github.com/deepseek-ai/deepseek-harness/discussions/763)、[#784](https://github.com/deepseek-ai/deepseek-harness/discussions/784) | ✅ 切模型后开新会话 |
| P062 | 文本模型禁图：`inputModalities` 硬编码 ["text"] | [#474](https://github.com/deepseek-ai/deepseek-harness/discussions/474)、[#686](https://github.com/deepseek-ai/deepseek-harness/discussions/686) | ✅ 用视觉桥插件（ModLens 等） |
| P063 | 选多模态模型仍提示"模型不支持图片" | [#112](https://github.com/deepseek-ai/deepseek-harness/discussions/112)、[#245](https://github.com/deepseek-ai/deepseek-harness/discussions/245)、[#356](https://github.com/deepseek-ai/deepseek-harness/discussions/356) | 同 P062 |
| P064 | 自定义 API 无 reasoningEffort/reasoning 配置 UI | [#196](https://github.com/deepseek-ai/deepseek-harness/discussions/196)、[#302](https://github.com/deepseek-ai/deepseek-harness/discussions/302) | ⏳ 官方未做 |
| P065 | 创建自定义模型报"已有提供方使用了这个 ID" | [#135](https://github.com/deepseek-ai/deepseek-harness/discussions/135) | ✅ 换 ID |
| P066 | vLLM 自部署把 thinking 流成 delta.reasoning 被丢弃 | [#199](https://github.com/deepseek-ai/deepseek-harness/discussions/199) | ⏳ 官方适配器未兼容 |
| P067 | 兼容网关 `data: [DONE]` 后无空行 → STREAM_CLOSED 丢回复 | [#388](https://github.com/deepseek-ai/deepseek-harness/discussions/388) | 💡 网关方言插件 |
| P068 | llm-pi-ai compat schema 丢弃大部分 OpenAICompletionsCompat 字段 | [#472](https://github.com/deepseek-ai/deepseek-harness/discussions/472)、[#473](https://github.com/deepseek-ai/deepseek-harness/discussions/473) | 💡 等插件修复 |
| P069 | web_search 固定请求官方端点，baseURL 覆盖无效 | [#408](https://github.com/deepseek-ai/deepseek-harness/discussions/408)、[#567](https://github.com/deepseek-ai/deepseek-harness/discussions/567)、[#779](https://github.com/deepseek-ai/deepseek-harness/discussions/779) | ⏳ 官方未修；自配网关认证必失败 |
| P070 | LLM stream EOF 无终结被当作成功回复 | [#373](https://github.com/deepseek-ai/deepseek-harness/discussions/373) | ⏳ 官方未修 |
| P071 | 孤立 UTF-16 代理码元 → 会话永久 HTTP 400 | [#436](https://github.com/deepseek-ai/deepseek-harness/discussions/436) | ⏳ 官方未修（无法恢复，开新会话） |
| P072 | 模型收不到当前时间（web_search 参数停在训练年份） | [#344](https://github.com/deepseek-ai/deepseek-harness/discussions/344) | 🔧 已有修复分支 |
| P073 | GLM-5.2 接入中文乱码 | [#566](https://github.com/deepseek-ai/deepseek-harness/discussions/566) | ⏳ 第三方模型兼容问题 |
| P074 | 选 opencode-go 渠道扣费却走官方 API | [#691](https://github.com/deepseek-ai/deepseek-harness/discussions/691) | ⏳ 路由 bug |
| P075 | `llm.discoverModels` 始终失败（registerDiscovery 无调用点） | [#740](https://github.com/deepseek-ai/deepseek-harness/discussions/740) | ⏳ 官方未修 |

## 域 E｜性能与稳定性（16 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P076 | 超长会话（20 万+ token）历史加载失败（Maximum call stack） | [#317](https://github.com/deepseek-ai/deepseek-harness/discussions/317) 家族（#359 #370 #501 #508 #534 #548） | ✅ 拆会话；⏳ 官方未修虚拟滚动 |
| P077 | TokenMeter 每个会话事件重建完整快照 → 二次方退化 | [#238](https://github.com/deepseek-ai/deepseek-harness/discussions/238)、[#452](https://github.com/deepseek-ai/deepseek-harness/discussions/452) | ✅ 长会话后开新会话 |
| P078 | 子代理无上限嵌套 56 个拖死 web 服务（2.2GB 内存） | [#131](https://github.com/deepseek-ai/deepseek-harness/discussions/131)、[#754](https://github.com/deepseek-ai/deepseek-harness/discussions/754)（139 并行 OOM） | ✅ 提示词限制子代理深度/数量 |
| P079 | 高并发下输入延迟数分钟，无"排队中"提示 | [#477](https://github.com/deepseek-ai/deepseek-harness/discussions/477)、[#479](https://github.com/deepseek-ai/deepseek-harness/discussions/479) | ✅ 避免同时多任务；💡 排队提示插件 |
| P080 | 强制 kill 后 write-behind 尾部丢失 | [#483](https://github.com/deepseek-ai/deepseek-harness/discussions/483) | ✅ 正常退出 |
| P081 | WebSocket 下行无背压 → 慢客户端内存无限增长 | [#671](https://github.com/deepseek-ai/deepseek-harness/discussions/671) | ⏳ 官方未修 |
| P082 | subagent catalog 条目从不回收 → 内存线性增长 | [#676](https://github.com/deepseek-ai/deepseek-harness/discussions/676) | ⏳ 官方未修 |
| P083 | 长会话 DOM 全内存 → 10s 级延迟 | [#624](https://github.com/deepseek-ai/deepseek-harness/discussions/624) | ✅ 拆会话；💡 IndexedDB offloading 提案 |
| P084 | 上下文一长浏览器卡死 | [#211](https://github.com/deepseek-ai/deepseek-harness/discussions/211) | 同 P076 |
| P085 | 新版主页 CPU 100% | [#115](https://github.com/deepseek-ai/deepseek-harness/discussions/115) | ⏳ 官方未修 |
| P086 | goal 模式页面太卡，切换会话无反应 | [#304](https://github.com/deepseek-ai/deepseek-harness/discussions/304) | ⏳ 官方未修 |
| P087 | 无限尝试工具调用失败不停 → 浏览器卡顿 | [#682](https://github.com/deepseek-ai/deepseek-harness/discussions/682) | ✅ 手动中止 |
| P088 | 流式失败重试后失败 chunk 成孤儿数据（幻影内容/重复计费） | [#661](https://github.com/deepseek-ai/deepseek-harness/discussions/661) | ⏳ 官方未修 |
| P089 | wakeDriver() dispose 期同步抛错 → agent 永久卡 running | [#660](https://github.com/deepseek-ai/deepseek-harness/discussions/660) | ⏳ 官方未修 |
| P090 | 存储空间用尽时 agent 卡转圈 | [#376](https://github.com/deepseek-ai/deepseek-harness/discussions/376) | ✅ 清理磁盘 |
| P091 | 隧道/低带宽下历史加载失败（无 gzip + 30s 超时） | [#470](https://github.com/deepseek-ai/deepseek-harness/discussions/470) | ✅ 本地直连 |

## 域 F｜安全与权限（14 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P092 | workflow 工具 vm 逃逸（宿主域闭包注入） | [#243](https://github.com/deepseek-ai/deepseek-harness/discussions/243)、[#778](https://github.com/deepseek-ai/deepseek-harness/discussions/778) | ⚠️ 已知风险，勿在 vm 内跑不可信代码 |
| P093 | Web approval 回环：模型自批准 danger-full-access | [#250](https://github.com/deepseek-ai/deepseek-harness/discussions/250) | ⚠️ 已知风险 |
| P094 | `/tmp` workspace 可被受限 child rebind 拓宽授权 | [#278](https://github.com/deepseek-ai/deepseek-harness/discussions/278)（完整动态复现+修复建议） | ✅ 不在 /tmp 放工作区 |
| P095 | fs-sandbox post-check pathname race 绕过 workspace-write | [#159](https://github.com/deepseek-ai/deepseek-harness/discussions/159) | ⚠️ 已知风险 |
| P096 | localhost Web 可被跨站 iframe 点击劫持（诱导授权） | [#381](https://github.com/deepseek-ai/deepseek-harness/discussions/381) | ⚠️ 已知风险；浏览器安全隔离 |
| P097 | 第三方安全审计 13 个可复现 demo | [#454](https://github.com/deepseek-ai/deepseek-harness/discussions/454) | ⚠️ 见审计报告 |
| P098 | workspace-write 下可递归删除整个工作区零确认 | [#149](https://github.com/deepseek-ai/deepseek-harness/discussions/149) | ✅ 重要工作区先备份 |
| P099 | Full Access 模式误删整个家目录（真实事故） | [#461](https://github.com/deepseek-ai/deepseek-harness/discussions/461) | ⚠️ 慎用 Full Access |
| P100 | Web minimal preset 在 Windows 允许 workspace 外写入（无审批） | [#523](https://github.com/deepseek-ai/deepseek-harness/discussions/523) | ⚠️ 权限预设不一致 |
| P101 | `--host 0.0.0.0` 被官方拒绝（防远程 RCE） | [#76](https://github.com/deepseek-ai/deepseek-harness/discussions/76)、[#397](https://github.com/deepseek-ai/deepseek-harness/discussions/397) | ✅ 安全设计；LAN 需隧道 |
| P102 | settings 密钥脱敏缺口（role('secret') fail-open） | [#226](https://github.com/deepseek-ai/deepseek-harness/discussions/226) | ⚠️ 已知风险 |
| P103 | 远程认证完善前勿绕过 loopback（完整攻击链） | [#130](https://github.com/deepseek-ai/deepseek-harness/discussions/130) | ⚠️ 安全建议：勿远程暴露 |
| P104 | 沙箱内 agent 可 taskkill 杀宿主，turn 永久"执行中" | [#466](https://github.com/deepseek-ai/deepseek-harness/discussions/466) | ⚠️ 已知风险 |
| P105 | 建议官方开 security.md 规范漏洞报告渠道 | [#792](https://github.com/deepseek-ai/deepseek-harness/discussions/792) | 🚧 官方未开 |

## 域 G｜功能缺失 / UX（28 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P106 | **不能 @ 选择文件**（高频，官方缺失） | [#146](https://github.com/deepseek-ai/deepseek-harness/discussions/146) 家族（#195 #202 #234 #261 #337 #360 #368 #464 #550 #659）+ locdd 论坛多人吐槽 | 💡 社区已有 dsh-at-file 等插件 |
| P107 | 拖拽非图片文件报错（附件仅支持图片） | [#368](https://github.com/deepseek-ai/deepseek-harness/discussions/368)、[#464](https://github.com/deepseek-ai/deepseek-harness/discussions/464)、[#550](https://github.com/deepseek-ai/deepseek-harness/discussions/550)、[#678](https://github.com/deepseek-ai/deepseek-harness/discussions/678)（要 Office 全家族） | 💡 doc_read/doc_write 类插件（DSH Cowork） |
| P108 | 对话中无法切换模式（只能新开会话） | [#29](https://github.com/deepseek-ai/deepseek-harness/discussions/29) | ⏳ 官方未做 |
| P109 | 会话归档后无法查看/恢复 | [#40](https://github.com/deepseek-ai/deepseek-harness/discussions/40)、[#315](https://github.com/deepseek-ai/deepseek-harness/discussions/315) | 💡 dsh-archive-manager |
| P110 | 无消息回撤/编辑/撤销 | [#200](https://github.com/deepseek-ai/deepseek-harness/discussions/200)、[#206](https://github.com/deepseek-ai/deepseek-harness/discussions/206)、[#349](https://github.com/deepseek-ai/deepseek-harness/discussions/349)、[#467](https://github.com/deepseek-ai/deepseek-harness/discussions/467)（dsh-undo PoC）、[#786](https://github.com/deepseek-ai/deepseek-harness/discussions/786) | 💡 回退/撤销是热门插件方向 |
| P111 | 模型选择无搜索栏 | [#166](https://github.com/deepseek-ai/deepseek-harness/discussions/166)、[#347](https://github.com/deepseek-ai/deepseek-harness/discussions/347) | ⏳ 官方未做 |
| P112 | 会话列表无置顶/嵌套文件夹 | [#63](https://github.com/deepseek-ai/deepseek-harness/discussions/63)、[#507](https://github.com/deepseek-ai/deepseek-harness/discussions/507) | ⏳ 官方未做 |
| P113 | 无 delete 对话功能 | [#726](https://github.com/deepseek-ai/deepseek-harness/discussions/726) | ⏳ 官方未做 |
| P114 | 中止后队列消息无法处理（bug） | [#212](https://github.com/deepseek-ai/deepseek-harness/discussions/212)、[#465](https://github.com/deepseek-ai/deepseek-harness/discussions/465) | ⏳ 官方确认 bug |
| P115 | CJK 输入法在 Web 对话框失效（组合候选不可见） | [#629](https://github.com/deepseek-ai/deepseek-harness/discussions/629) | ⏳ 官方未修（中文输入法兼容） |
| P116 | 界面无中文（全英文） | [#772](https://github.com/deepseek-ai/deepseek-harness/discussions/772)、[#300](https://github.com/deepseek-ai/deepseek-harness/discussions/300) | 🚧 i18n 待完善 |
| P117 | 预设 system prompt 全英文 → 中文模型被迫英文思考 | [#320](https://github.com/deepseek-ai/deepseek-harness/discussions/320)、[#693](https://github.com/deepseek-ai/deepseek-harness/discussions/693) | 🚧 建议 i18n；💡 中文思考优化插件 |
| P118 | skill 不支持中文名 | [#687](https://github.com/deepseek-ai/deepseek-harness/discussions/687) | ⏳ 官方未支持 |
| P119 | 工具调用组级折叠缺失（长回复难读） | [#796](https://github.com/deepseek-ai/deepseek-harness/discussions/796)、[#301](https://github.com/deepseek-ai/deepseek-harness/discussions/301) | 🚧 UI 待做 |
| P120 | edit/write 结果不给模型 diff（只回确认） | [#336](https://github.com/deepseek-ai/deepseek-harness/discussions/336)、[#744](https://github.com/deepseek-ai/deepseek-harness/discussions/744) | ⏳ 官方未做（模型可读性设计） |
| P121 | Markdown 宽表格截断 | [#440](https://github.com/deepseek-ai/deepseek-harness/discussions/440) | ⏳ 官方未修 |
| P122 | Mermaid 流程图不渲染 | [#610](https://github.com/deepseek-ai/deepseek-harness/discussions/610) | 💡 genui 等插件可渲染 |
| P123 | 任务完成后不打勾 / 任务追踪不更新 | [#254](https://github.com/deepseek-ai/deepseek-harness/discussions/254)、[#622](https://github.com/deepseek-ai/deepseek-harness/discussions/622) | ⏳ UI bug |
| P124 | 方向键 ↑ 不显示上一条消息 | [#667](https://github.com/deepseek-ai/deepseek-harness/discussions/667) | ⏳ 官方未做 |
| P125 | 粘贴长文本卡顿 | [#540](https://github.com/deepseek-ai/deepseek-harness/discussions/540)、[#42](https://github.com/deepseek-ai/deepseek-harness/discussions/42) | ⏳ 官方未优化 |
| P126 | 无 Quote & reply 按钮 | [#418](https://github.com/deepseek-ai/deepseek-harness/discussions/418) | ⏳ 官方未做 |
| P127 | 无 SSH 能力（远程项目开发） | [#90](https://github.com/deepseek-ai/deepseek-harness/discussions/90)、[#782](https://github.com/deepseek-ai/deepseek-harness/discussions/782)、[#794](https://github.com/deepseek-ai/deepseek-harness/discussions/794) | 🚧 官方未做（高呼声） |
| P128 | LAN/远程访问 403/不可用（Host/Origin 校验） | [#153](https://github.com/deepseek-ai/deepseek-harness/discussions/153) 家族（#242 #313 #322 #351 #367 #397 #437 #514 #538 #652 #653 #654 #706 #755 #764） | ✅ Tailscale+nginx 隧道方案（#242）；⏳ 官方未支持 |
| P129 | headless 打印 session-id + --resume/--continue | [#167](https://github.com/deepseek-ai/deepseek-harness/discussions/167)、[#503](https://github.com/deepseek-ai/deepseek-harness/discussions/503) | 🚧 headless 平台化（CI 高频诉求） |
| P130 | headless 遇到审批工具行为未定义 | [#291](https://github.com/deepseek-ai/deepseek-harness/discussions/291) | ⏳ 官方未定义 |
| P131 | 无后台任务详情页（输出+终止） | [#608](https://github.com/deepseek-ai/deepseek-harness/discussions/608)、[#757](https://github.com/deepseek-ai/deepseek-harness/discussions/757) | 🚧 UI 待做 |
| P132 | 无文件管理/预览（Codex 式） | [#685](https://github.com/deepseek-ai/deepseek-harness/discussions/685)、[#633](https://github.com/deepseek-ai/deepseek-harness/discussions/633)、[#798](https://github.com/deepseek-ai/deepseek-harness/discussions/798)、[#228](https://github.com/deepseek-ai/deepseek-harness/discussions/228) | 💡 文件管理插件方向 |
| P133 | 无法创建"无工作区"对话 | [#430](https://github.com/deepseek-ai/deepseek-harness/discussions/430) | ⏳ 官方未做 |

## 域 H｜生态与发现（10 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P134 | 插件 2300+ 太多难选，英文名看不出用途 | [#1597](https://github.com/deepseek-ai/deepseek-harness/discussions/1597) | 💡 dshmarket / dsh-find-plugin / mydsh.dev / dshbase |
| P135 | 复制安装命令装到空插件（无 dsh.bundle） | 讨论 #1597 评论区 | ✅ 用 dsplugin.app 校验目录 |
| P136 | 插件生态被 AI 低质量评论淹没 | [#569](https://github.com/deepseek-ai/deepseek-harness/discussions/569) | 🚧 社区治理待建 |
| P137 | 官方无插件商店（防投毒） | [#723](https://github.com/deepseek-ai/deepseek-harness/discussions/723) | 🚧 官方未做 |
| P138 | 无插件排行榜 | [#697](https://github.com/deepseek-ai/deepseek-harness/discussions/697) | 💡 dshbase 已有 stars 排序 |
| P139 | 插件信任边界无签名/来源校验 | 同 P053 | 🚧 待建 |
| P140 | 迁移桥：Claude/Codex/OpenCode/Pi 配置会话迁移 | [#272](https://github.com/deepseek-ai/deepseek-harness/discussions/272) 家族（#308 #480 #531 #698 #759） | 💡 dsh-bridges / claude_to_dsh / dsh-session-import / pi2dsh |
| P141 | 官方无 CLI/TUI（社区做） | [#45](https://github.com/deepseek-ai/deepseek-harness/discussions/45) 家族（#132 #364 #386 #391 #405 #415 #416） | 💡 dsh-tui / Phi CLI / DeepCode CLI |
| P142 | 官方无桌面端（社区做） | [#172](https://github.com/deepseek-ai/deepseek-harness/discussions/172) 家族 18+ 帖 | 💡 deepseek-harness-desktop / deepseek-harness-app |
| P143 | 官方无 memory（社区做） | [#14](https://github.com/deepseek-ai/deepseek-harness/discussions/14) 家族（#192 #218 #484 #525 #516 #544 #795 #797） | 💡 dsh-memory / mindspace / primordia-soup |

## 域 I｜成本与计费（6 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P144 | 单次任务消耗金额无感知 | [#500](https://github.com/deepseek-ai/deepseek-harness/discussions/500)、[#318](https://github.com/deepseek-ai/deepseek-harness/discussions/318) | 💡 dsh-cost-tracker / dsh-cost-meter / dsh-balance-card |
| P145 | 会话 ID 不发送为 metadata.user_id → 网关无法按会话归因 | [#599](https://github.com/deepseek-ai/deepseek-harness/discussions/599) | ⏳ 官方未修 |
| P146 | 无 token/墙钟预算功能 | [#704](https://github.com/deepseek-ai/deepseek-harness/discussions/704) | 🚧 官方未做（预算告警插件方向） |
| P147 | 2026-08-17 起峰谷计价：Flash 输出谷 0.66/峰 1.32，Pro 谷 1.98/峰 3.96（实质涨价） | [53AI 六种声音](https://www.53ai.com/news/OpenSourceLLM/2026081653086.html) | ✅ 低谷时段跑长任务；用缓存（95-99.7% 命中） |
| P148 | 缓存命中率高但用户无感 | [#560](https://github.com/deepseek-ai/deepseek-harness/discussions/560)、[cnblogs 实测](https://www.cnblogs.com/momo798/p/22523283) | ✅ web-ui 的 token 实时统计可感知 |
| P149 | 无 LLM Provider Fallback Router（生产容灾） | [#431](https://github.com/deepseek-ai/deepseek-harness/discussions/431) | 🚧 高价值插件方向 |

## 域 J｜文档与学习（6 条）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P150 | 概念/文档偏工程化，学习成本高 | [澎湃实测](https://www.thepaper.cn/newsdetail_forward_33787836) | ✅ dsh-handbook 中文手册 |
| P151 | 部分进阶能力文档未完成 | [实在智能](https://www.ai-indeed.com/encyclopedia/29690.html) | ✅ 翻源码/Discussions |
| P152 | "一切皆插件"用户侧成本=配置复杂度高 | [#326](https://github.com/deepseek-ai/deepseek-harness/discussions/326) | 💡 模板/教程/预设包 |
| P153 | 官方 Discussions 提问无人回 | CONTRIBUTING（团队小） | ✅ 加飞书群；upvote |
| P154 | 无中文交流渠道指引（企微助手加不了） | [#591](https://github.com/deepseek-ai/deepseek-harness/discussions/591)、[#670](https://github.com/deepseek-ai/deepseek-harness/discussions/670)、[#785](https://github.com/deepseek-ai/deepseek-harness/discussions/785) | ✅ 飞书交流群（#2397/#2723） |
| P155 | 官方暂不收 PR，贡献路径不清晰 | [CONTRIBUTING.zh.md](https://github.com/deepseek-ai/deepseek-harness/blob/main/CONTRIBUTING.zh.md)、[#341](https://github.com/deepseek-ai/deepseek-harness/discussions/341) | ✅ 插件生态 + 教程 + 带补丁报告（见贡献路线报告） |

---

## 域 K｜08-14 后新增痛点（全量标题交叉验证补充，18 条）

> 数据基础：gh api 全量抓取 2764 帖标题 + 重点帖正文核实（08-14 → 08-17 期间新增）

| # | 痛点 | 证据 | 状态/方案 |
|---|---|---|---|
| P156 | **API key 泄露/异常消耗**：用户未使用却半夜扣费 -4，怀疑漏洞 | [#2756](https://github.com/deepseek-ai/deepseek-harness/discussions/2756) | ⚠️ 高风险；立即轮换 key + 检查插件权限；官方未回复（需 upvote） |
| P157 | **运行中清空其他会话 + CC Switch/Claude Code 历史**（ENOENT session.jsonl.zstd） | [#2787](https://github.com/deepseek-ai/deepseek-harness/discussions/2787) | ⚠️ 数据丢失事故；定期备份 `$DSH_HOME/sessions`；🔧 强烈建议官方定位 |
| P158 | Windows 首次沙箱执行在大型工作区阻塞数分钟无提示 | [#2774](https://github.com/deepseek-ai/deepseek-harness/discussions/2774) | ⏳ 官方未修；首次执行前耐心等 |
| P159 | npm dist-tag `latest` 不一致（0.0.1-rc.1 vs 0.1.0-rc.6）→ 裸装必 ERESOLVE | [#2763](https://github.com/deepseek-ai/deepseek-harness/discussions/2763)（完整复现） | 🔧 锁精确版本号，勿用 `^latest` |
| P160 | workspace-write 下 pwsh 工具调用挂起（无输出、不可杀），仅 danger-full-access 可跑 | [#2781](https://github.com/deepseek-ai/deepseek-harness/discussions/2781) | ✅ 临时改 danger-full-access（注意安全）；⏳ 官方未修 |
| P161 | `isLoopbackHostname` 拒绝 IPv4-mapped loopback（`[::ffff:127.0.0.1]`）→ 双栈环境 403 | [#2760](https://github.com/deepseek-ai/deepseek-harness/discussions/2760)（根因+证据） | ✅ 浏览器/直连用纯 IPv4 或 localhost；🔧 社区可补 |
| P162 | 长对话触发 API 413：harness 默认发送全部会话（非增量） | [#2770](https://github.com/deepseek-ai/deepseek-harness/discussions/2770) | ✅ 长对话拆会话；⏳ 官方未做上下文截断策略 |
| P163 | 两个 agent preset 同时含 tool-cordis → 第二个 preset 挂载失败、会话 resume 失败 | [#2775](https://github.com/deepseek-ai/deepseek-harness/discussions/2775) | ✅ 避免复制含 tool-cordis 的 preset；🔧 社区可提去重修复 |
| P164 | `session.selectModel` 拒绝切换 text-only 模型（历史含图时）——应自动过滤 | [#2789](https://github.com/deepseek-ai/deepseek-harness/discussions/2789) | ⏳ 官方未修 |
| P165 | `agentPresets.select` cleanup 比较错误的 promise → per-session Map 泄漏 | [#2786](https://github.com/deepseek-ai/deepseek-harness/discussions/2786) | ⏳ 官方未修（内存泄漏） |
| P166 | 会话列表无删除功能（Web GUI 缺失） | [#2772](https://github.com/deepseek-ai/deepseek-harness/discussions/2772)、[#2768](https://github.com/deepseek-ai/deepseek-harness/discussions/2768) | 🚧 高呼声 UI 功能；💡 插件可先做 |
| P167 | text-only 模型会话想 opt-in 导出图片为文本 | [#2782](https://github.com/deepseek-ai/deepseek-harness/discussions/2782) | 🚧 提案；💡 插件方向 |
| P168 | 无"自动拉起进程的重启命令" | [#2784](https://github.com/deepseek-ai/deepseek-harness/discussions/2784) | 💡 dsh-web-restart 已有；系统级重启脚本 |
| P169 | usage-query 疑似 bug | [#2791](https://github.com/deepseek-ai/deepseek-harness/discussions/2791) | ⏳ 官方未确认 |
| P170 | 极简模式模型幻觉自己是 Claude | [#2769](https://github.com/deepseek-ai/deepseek-harness/discussions/2769) | ⏳ 官方未修（极简模式 system prompt 问题） |
| P171 | 极简模式无记忆处理，用户不知需自加 | [#2783](https://github.com/deepseek-ai/deepseek-harness/discussions/2783) | ✅ 极简=最简插件集，按需加 memory 插件 |
| P172 | 第三方模型消耗官方 deepseek-flash token（路由串扰） | [#2779](https://github.com/deepseek-ai/deepseek-harness/discussions/2779) | ⏳ 官方未修（同 P074 家族） |
| P173 | 插件自定义会话事件致会话日志下次加载被拒读（Session.append 无 ignorable 标记） | [#2778](https://github.com/deepseek-ai/deepseek-harness/discussions/2778) | ⏳ 官方未修（插件 API 缺陷） |

---

## 统计与分布

- **合计：173 条痛点**（域 A 15 + B 22 + C 18 + D 20 + E 16 + F 14 + G 28 + H 10 + I 6 + J 6 + K 18）
- 状态分布：✅ 可绕过 60+ 条 / 🔧 有社区补丁 15+ 条 / ⏳ 官方未修 70+ 条 / 🚧 待官方开发 15+ 条 / 💡 生态已补 25+ 条 / ⚠️ 安全与数据风险 10+ 条
- **最高频家族**：中文路径截断（17 帖）、unknown tool 流式（5 帖同根因）、历史加载失败（8 帖同根因）、LAN/远程访问（17 帖）、@ 文件引用（12 帖）、桌面端（18 帖）、memory（8 帖）、CLI/TUI（10 帖）、会话删除（3 帖 08-14 后新增）
- **"官方没做、社区全做"清单**（痛点=机会）：CLI/TUI、桌面端、memory、视觉桥、@文件引用、文件预览、成本统计、会话迁移、插件市场、SSH、远程访问、中文 i18n —— 12 个方向全部有社区方案或高呼声

## 数据可信度

- 所有帖号均来自 gh api graphql 实测返回（dsh-handbook 方法学：780 帖全量分页、帖号程序化核验）；官方 Discussions 现总数 2759 帖
- 时效：dsh 0.1.0-rc.6 时代（08-13 发布后），部分 bug 可能已在更新 rc 修复，实操前核对
- 价格/star 为 2026-08-17 快照
