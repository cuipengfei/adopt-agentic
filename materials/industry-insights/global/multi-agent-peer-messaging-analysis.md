# Multi-Agent Peer-to-Peer Messaging 竞品分析

> 分析日期：2026-02-12
> 分析方法：多轮搜索 + Oracle 两轮 fact-check
> 核心问题：**哪些 coding agent 产品支持 team members 之间的 real-time peer-to-peer messaging？**

---

## 背景

Claude Code 随 Opus 4.6（2026-02-05）发布了 **Agent Teams** 功能（Research Preview），通过 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 启用。核心特性：Lead Agent 可以 spawn 多个 Teammates，每个是独立 Claude Code 实例，拥有自己的 context window，通过 **Shared Task List** + **Inbox 消息系统** 实现双向通信。

### 评判标准

不是 orchestrator → worker 的层级委派，而是 **agent A 可以直接给 agent B 发消息，B 可以回复 A，互相 challenge、share findings、自主协调**。

---

## 三层分类结论

### Tier 1：严格满足 peer-to-peer messaging（仅 2 个）

| 产品 | 作者 | 发布时间 | 通信机制 | 备注 |
|------|------|---------|---------|------|
| **Claude Code Agent Teams** | Anthropic | 2026-02-05 | Inbox JSON messaging, teammate ↔ teammate | 官方功能，Research Preview |
| **Gas Town** | Steve Yegge | 2026-01 初 | `gt nudge`（worker-to-worker）+ `gt mail`（between agents） | 社区工具，Go ~189k LOC，管理 20-30 agents |

#### Claude Code Agent Teams 详情

- 随 Opus 4.6 发布，通过环境变量 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 启用
- **架构**：Lead Agent（主 session）+ Teammates（独立 Claude Code 实例）
- **通信**：Shared Task List（文件驱动任务板，带状态和依赖追踪）+ Inbox（JSON 消息，teammate 可直接互发）
- **与 subagent 的区别**：subagent 是单向汇报（做完返回结果），team 是双向通信（互相 challenge、share findings、自主协调）
- **成本**：每个 teammate 独立计费
- **适用场景**：大型 refactor、cross-layer feature、competing debug hypotheses、parallel code review with different lenses

#### Gas Town 详情

- Steve Yegge（Google/Amazon 老兵）作品，2026 年 1 月初发布
- **定位**："Kubernetes for AI coding agents"——不是 IDE，是 agent 编排器
- **规模**：管理 20-30 个并行 AI coding agent（主要是 Claude Code 实例）
- **7 种 Agent 角色**：Mayor（总指挥）、Polecats（编码）、Refinery（合并）、Witness（验证）、Deacon（规则）、Dogs（巡检）、Crew（通用）
- **peer-to-peer 证据**：源码 `nudge.go`（"worker-to-worker communication"）+ `mail.go`（"Send and receive messages between agents"）
- **安装**：`brew install gastown`
- **门槛**：Yegge 自称需要 "Stage 7+" AI 辅助开发经验，跑 3 个 Claude Max 账号才够用

### Tier 2：有 agent 间通信，但是框架/研究项目，非终端用户产品

| 框架 | 通信机制 | 说明 |
|------|---------|------|
| **MetaGPT** | publish/subscribe + `send_to` | 模拟软件团队角色，agent 间有通信，但是研究项目 |
| **AutoGen** (Microsoft) | 多 agent 对话循环 | 最接近 peer-to-peer，但是 SDK 不是产品 |
| **ChatDev** | agent 间消息传递 | 模拟软件公司，但是研究项目 |

### Tier 3：多 agent 编排但无 peer messaging

| 产品 | 模式 | 为什么不满足 |
|------|------|-------------|
| **Kimi K2.5 Agent Swarm** (Moonshot AI) | fan-out/fan-in | 最多 100 agents 并行，但 sub-agents 各干各的不互相通信 |
| **VS Code Multi-Agent** (Microsoft, v1.109) | 多品牌管理 | 可同时跑 Claude+Codex+Copilot，但 agent 间隔离 |
| **Google Antigravity** (DeepMind) | 多 agent 并行 | Agent-first IDE，无 agent-to-agent messaging |
| **Devin / MultiDevin** (Cognition) | manager → workers | 有多实例能力，但仍是层级式 |
| **Cursor** | planner-worker-judge | 官方研究承认平级协调失败，采用层级 |
| **OpenHands** (formerly OpenDevin) | 层级委派 | 上级 → 下级 delegation |
| **Multiclaude** | primary → subagents | 单向委派 |
| **Cline / RooCode** | 单 agent | Plan + Act 模式，无 multi-agent team |
| **Aider** | 单 agent | Git-native 终端工具 |
| **Windsurf** (Codeium) | 单 agent 编排 | Autonomous task planning，但单 agent |
| **GitHub Copilot Agent Mode** | 单 agent | 强在 CI/CD 集成 |
| **OpenAI Codex** | 单 agent | macOS app + CLI，异步执行 |
| **Augment Code** | 单 agent | 深度代码理解，但单 agent |
| **Amazon Q Developer** | 单 agent | AWS 生态集成 |
| **Tabnine / JetBrains AI / Sourcegraph Cody** | 单 agent | IDE 集成助手 |
| **Replit Agent** | 单 agent | 浏览器端，零配置 |
| **SWE-agent / Agentless** | 单 agent / 无 agent | 研究项目，非 peer mesh |
| **中国产品（Trae/通义灵码/Fitten/MarsCode）** | 单 agent 或 orchestrator | 公开信息无 peer messaging 证据 |

---

## 为什么只有两个？

大部分产品**刻意选择层级编排**来换稳定性和可控性。Peer-to-peer 通信的代价：

1. **协调开销暴增**：每个 agent 都可能给其他 agent 发消息，复杂度从 O(n) 变成 O(n²)
2. **错误 cascade**：一个 agent 出错会通过消息链影响其他 agent
3. **Debug 困难**：人类更难追踪分布式对话，难以介入纠正
4. **Token 成本翻倍**：每个 agent 独立计费，通信本身也消耗 token
5. **分布式系统问题**：消息顺序、冲突解决、一致性等经典难题

**这个方向 2026 年初才刚起步**。从"并行执行"到"团队协作"这一步，比想象中难得多。

---

## 置信度声明

| 结论 | 置信度 | 说明 |
|------|--------|------|
| 严格标准仅两个产品满足 | **75%（中高）** | 可能有私有预览产品未公开 |
| 放宽到框架层后不止两个 | **95%（高）** | MetaGPT/AutoGen/ChatDev 确认有 agent 间通信 |

---

## 实测验证（2026-02-13）

用 Claude Code Agent Teams 实际跑了一次 P2P 验证。场景：Lead Agent spawn 两个 teammates（Alpha=前端、Beta=后端），Alpha 提 API 方案，Beta 做后端挑战。

### 验证到的通信链路

| 链路 | 方向 | 结果 |
|------|------|------|
| Lead → Teammate (DM) | team-lead → beta | ✅ |
| Lead → All (Broadcast) | team-lead → alpha, beta | ✅ |
| Teammate → Lead | alpha/beta → team-lead | ✅ |
| Teammate ↔ Teammate (P2P) | alpha ↔ beta | ✅ |
| Shared Task List | 创建/认领/完成 | ✅ |

### 观察到的行为

1. **异步时序竞争**：Alpha 发方案给 Beta，Beta 在处理 lead 的消息没看到，Alpha 又催了一次。Beta 回了挑战，Alpha 在处理广播又没收到。两个 agent 互相催"你回了没"。
2. **Fire-and-forget**：Beta 给已 shutdown 的 Alpha 发消息不报错。
3. **可观测性**：Lead 通过 idle notification 的 `summary` 字段看到 peer DM 摘要（如 `[to alpha] 后端评估：ID 枚举、鉴权与扩展性建议`），但看不到全文。
4. **总耗时**：约 90 秒完成创建 team → spawn → 通信 → shutdown → cleanup 全流程。

### 结论

Claude Code Agent Teams 的 P2P messaging 机制实锤可用。Tier 1 分类中该产品的定位准确。

---

## 来源与验证

- **搜索引擎**：Tavily（advanced depth）、Exa、Firecrawl
- **搜索范围**：官方文档、产品博客、GitHub 源码、HackerNews、Reddit、Medium、LinkedIn、arXiv
- **验证方法**：Oracle（高质量推理模型）两轮独立 fact-check
- **Gas Town peer-to-peer 证据**：源码级验证（`nudge.go` + `mail.go` 的函数描述）
- **分析日期**：2026-02-12，基于当时的公开信息
