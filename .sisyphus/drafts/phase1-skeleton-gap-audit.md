# Phase1 Skeleton Gap Audit — 审计与决策记录

> 基于 materials/ 全量扫描 + 外部基准对照 + brainstorming 讨论，产出骨架修订决策。

## 审计方法

并行 8 个 background agents（两轮），覆盖：
- 内部：skeleton 节点覆盖映射、结构缺陷分级、skeleton patch 建议
- 外部：权威基准对照（官方文档/生态实践/2026 工程蓝图）
- 二轮：四份 materials 文件逐一扫描，专找"已确认列表之外"的通用心智模型

## 覆盖矩阵

| 节点 | 覆盖状态 | 备注 |
|------|----------|------|
| 0 介绍 | covered | — |
| 1 上下文 | covered | — |
| 2 三角关系 | covered | — |
| 3 System Instructions | covered | — |
| 4 内置工具 | covered | — |
| 5 MCP | covered | — |
| 6 Commands | covered | 示例不足 |
| 7 Skills | partial | 显式素材偏少 |
| 8 Eval | covered | — |
| 9 Sub Agent | covered | — |

## 审计发现的缺口

### 外部基准缺位主题

从 2026 工程蓝图、LangGraph、OpenAI Agents、Qwen-Agent 等权威参考中对照出的缺位：

- State & Memory（状态机、checkpoint、长短期记忆）
- Tooling Contracts & Guardrails（工具契约、安全边界）
- Orchestration（编排模式：并行/分支/循环）
- RAG / Knowledge Ingestion（知识摄取与检索）
- Reliability & Error Recovery（可靠性、重试、回滚）
- Human-in-the-loop（审批点、介入时机）
- Cost & Performance（token 预算、缓存、压缩）
- Realtime / Multimodal（流式、语音、视觉）

### 二轮扫描新发现（"它山之石"）

从 materials 中额外找到的、对"用 agent tool 的人"有价值的通用心智模型：

- 怎么给 agent 下任务（需求表达、任务拆解、迭代节奏、复述校验）
- 认知债务（过度委托稀释团队理解、taste/取舍比多生成更重要）
- Prompt 作为可维护资产（版本化、review、持续迭代）

### 内部一致性问题

- 中国市场约束未嵌入骨架
- 人物/角色锚点缺失
- 上下文分层与预算未前置
- 各节点学习产出不可验证

## Brainstorming 决策记录

### 筛选原则

每个候选概念必须通过三重检验：
1. **翻译得过来？** — 从"造 agent"视角能翻译成"用 agent tool"视角？
2. **用户直接受益？** — 理解后能更好地使用工具？
3. **工具无关？** — 放到任何 agent tool 上都成立？

### 逐项决策

| 概念 | 决定 | 位置 | 理由 |
|------|------|------|------|
| State & Memory | ✅ 子项 | 节点 1（上下文） | 用户视角：为什么 agent 会忘事、何时断会话、持久 vs 临时上下文 |
| 工具契约 & 安全 | 💬 轻提 | 节点 4/5 | 不需要专门讲，简单提及信任边界即可 |
| 编排模式 | ✅ 新节点 | Sub Agent 前 | 讲心智模型（顺序/并行/分支），不讲任何框架实现 |
| Human-in-the-loop | ✅ 新节点 | 收尾位置 | 什么时候放手、什么时候介入、怎么纠偏 |
| 成本 & 性能 | ❌ 排除 | — | Out of scope |
| 知识喂养 | ✅ 新节点 | Skills 之后 | 统一视角串联 System Instructions / MCP 数据源 / Skills 的知识注入方式 |
| 可靠性 & 错误恢复 | 🔄 暂归 Eval | 节点 Eval 子项 | 最终位置待定 |
| RAG / 知识摄取 | 吸收入"知识喂养" | — | 用户视角是"怎么喂知识"，RAG 是实现细节 |
| 实时 / 多模态 | ❌ 排除 | — | 偏平台演进，距用户当前痛点远 |
| 怎么给 agent 下任务 | ✅ 子项 | 待定 | 需求表达、任务拆解、迭代节奏 |
| 认知债务 | ✅ | 待定 | 即使 agent 做对了，你还懂不懂你的系统 |
| Prompt 作为可维护资产 | ✅ 轻提 | 节点 3 附近 | 你写的 prompt/instructions 是代码资产，应版本化管理 |
| 中国市场嵌入 | ❌ 不做 | — | Agent agnostic，不分市场，举例自然多元即可 |
| 人物/角色锚点 | ❌ 不做 | — | 通用概念，不区分谁在读 |
| 学习产出可验证 | ❌ 不做 | — | 读者自己的事 |

### 确认的新骨架序列

```
━━ 基础概念 ━━
 0  介绍页
 1  上下文 — 第一原则                    [+ State & Memory 子项]
 2  三角关系 + Agent Loop                [+ 怎么给 agent 下任务 子项]

━━ 上下文的载体（从静态到动态）━━
 3  System Instructions                  [+ Prompt 是资产 轻提]
 4  内置工具                              [+ 信任边界 轻提]
 5  MCP                                  [+ 信任边界 轻提]
 6  Slash Commands
 7  Skills

━━ 串联与进阶 ━━
 8  知识喂养（新）                        统一视角：串联 3/5/7 的知识注入
 9  编排模式（新）                        心智模型，不讲框架
10  Sub Agent — 上下文隔离                原节点 9
11  Eval / 验证 / 可观测性                原节点 8 [+ 可靠性 子项]
12  Human-in-the-loop（新）               [+ 认知债务 子项]
```

### 主线表（更新）

| 节点 | 上下文角色 |
|------|-----------|
| 上下文 | 第一原则本身 |
| 三角关系 | 谁在操作上下文 |
| System Instructions | LLM 收到的第一份上下文 |
| 内置工具 | 工具定义 + 返回值 = 上下文 |
| MCP | 外部工具，同样进入上下文 |
| Slash Commands | 按需注入的上下文 |
| Skills | 动态注入的 System Instructions |
| 知识喂养 | 统一回顾：所有知识如何进入上下文 |
| 编排模式 | 上下文如何在多步骤/多分支间流动 |
| Sub Agent | 创造全新上下文（隔离） |
| Eval/验证 | 验证结果 = 反馈上下文 |
| Human-in-the-loop | 人决定上下文的最终走向 |

## 下一步

- [ ] 将上述序列落地到 `phase1-content-structure.md`（新 boulder）
- [ ] 为新节点（8 知识喂养、9 编排模式、12 HITL）撰写骨架要点
- [ ] 更新 `docs/.vitepress/config.ts` sidebar 与新增 guide 页面
