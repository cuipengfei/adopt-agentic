# 综合提炼卷：跨源共识与节点映射

> 用于 Phase 2 写作的总入口：跨源共识、按节点反向索引、中国市场素材映射。

---

## 跨源共识（3+ 独立来源重复出现）

| 共识                                 | 来源（原 A-F → 新 G-L 补充）                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| "上下文工程"取代"prompt engineering" | Fowler、Willison、Karpathy、Swyx → +Continue.dev(Dunn)、Augment(Dietzen)、Sourcegraph(Slack)          |
| 确定性工具优先                       | Karpathy、Yegge、Aider、Claude Code → +OMO(Kim)、Haystack(Pietsch)、ReAct(Yao)                        |
| 角色化 + 共享记忆                    | Karpathy、Yegge、LangGraph、OMO → +Roo Code、AutoGen(Wang)、Magentic-One                              |
| 可审计/可回放                        | Cline、Willison、Swyx、LangGraph → +Langfuse(Klingen)、Arize、Helicone、Copilot(Dohmke)               |
| 合规/标准前置到上下文                | Gene Kim、Cline、Devin → +Guardrails(Rajpal)、Goodside、Rehberger                                     |
| 简单循环优先                         | Anthropic、Claude Code、Kent Beck → +12-Factor(Horthy)、smolagents(Roucher)、BabyAGI(Nakajima)        |
| 上下文质量 > 数量                    | Karpathy、Willison、Fowler → +Continue.dev、Supermaven(Jackson)、Augment(Dietzen)                     |
| 结构化输出 / 类型安全                | Embabel(Johnson)、PydanticAI(Colvin)、BAML(Gupta)、DSPy(Khattab)、Instructor(Liu)、Guardrails(Rajpal) |
| 可观测性 / tracing 是生产基石        | Langfuse(Klingen)、Arize/Phoenix、Helicone(Torre)、CrewAI(Moura)、TruLens(Sen)                        |
| 开源 / 可控 / 反锁定                 | OpenHands(Wang)、Kilo(Sijbrandij)、TabbyML、AutoGPT(Richards)、Open Interpreter(Lucas)、Dify(Zhang)   |
| Plan→Act→Observe 循环                | ReAct(Yao)、Cline(Rizwan)、LangGraph(Chase)、Magentic-One、Devin(Wu)、Andrew Ng                       |
| Human-in-the-loop 一等公民           | LangGraph(Chase)、AutoGen(Wang)、Flowise(Heng)、Warp(Lloyd)、Cursor(Truell)                           |
| Agent 评测需要真实任务               | SWE-bench(Yang)、cline-bench(Rizwan)、METR(Barnes)、12-Factor(Horthy)、Mollick                        |
| 安全 / prompt injection 未解决       | Willison、Goodside、Rehberger、METR(Barnes)、Hendrycks                                                |

---

## 按节点映射索引

> 便于 Phase 2 写内容时快速定位素材。

| 节点                  | 关键素材来源                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 介绍                | Fowler(上下文工程)、Levels(vibe coding)、Anthropic(agent loop)、Kilo(计费体验)、Lovable(vibe coding受众)、Replit(减少偶然复杂度)、AutoGPT(能力扩散)、Dify(开放策略)                                                                                                                                                                                                                                   |
| 1 上下文              | Fowler(四层模型)、Karpathy(质量>数量)、Willison(上下文预算)、Swyx(上下文=资产)、Continue.dev(context poisoning)、Augment(语义检索)、Sourcegraph(上下文可得性)、Lilian Weng(Planning/Memory/Tool Use)、Andrew Ng(多次提示)、Semantic Kernel(embeddings+memory)、Rehberger(间接注入=不可信上下文)                                                                                                       |
| 2 三角关系            | Karpathy(LLM as OS)、Anthropic(简单循环)、Cline(Plan+Act)、Cursor(taste+控制)、Devin(计划-执行-反馈)、Jim Fan(三轴扩展)、Embabel(GOAP+确定性)、LangGraph(control+durability)、CrewAI(确定性backbone)、DSPy(可组合graph)、AutoGPT(模块边界)、Dify(workflow engine)                                                                                                                                     |
| 3 System Instructions | Gene Kim(合规前置)、Kent Beck(风格基准)、Yegge(接口契约)、OpenAI(可做/不可做)、Cline(System Prompt=工具API)、Dex Horthy(own your prompts)、Guardrails(RAIL规格)、Instructor(类型校验)、Goodside(注入隔离)、PydanticAI(类型+校验)、BabyAGI(task management prompt)、TabbyML(可审计)                                                                                                                    |
| 4 内置工具            | Karpathy(确定性工具)、Aider(repo map)、Cline(可组合原语)、Anthropic(工具描述)、Roo Code(权限边界)、OMO(curl vs WebFetch)、Windsurf(模式切换)、Bolt.new(运行环境前移)、OpenHands(SDK多入口)、ReAct(推理+行动)、Haystack(可组合组件)、Rehberger(工具权限)、Semantic Kernel(稳定API面)、smolagents(CodeAgent)                                                                                            |
| 5 MCP                 | Claude Code(MCP扩展)、OpenCode(解耦)、OpenAI(skills签名)、Kilo(供应商解耦)、Augment(Context Engine MCP)、CodeRabbit(MCP注入文档)、Embabel(MCP不够需orchestration)、Dify(发布为MCP server)                                                                                                                                                                                                             |
| 6 Commands            | Cline CLI(原语)、Willison(CLI偏好)、v0(约束模板)、OpenCode(terminal-first)、SWE-agent(ACI接口)、Warp(终端→ADE)、BAML(prompt语法)                                                                                                                                                                                                                                                                      |
| 7 Skills              | OMO(声明式注册)、Kent Beck(上下文包)、OpenAI(白名单)、TruLens(Agent Skills)、BAML(Prompt=代码资产)                                                                                                                                                                                                                                                                                                    |
| 8 Eval/验证           | Anthropic(evals)、Kent Beck(TDD)、Devin(可验证=表现好)、Willison(重放)、Fowler(认知债务)、cline-bench(真实工程)、SWE-bench(真实issue)、Andrew Ng(Reflection)、Mollick(指令遵循)、Magentic-One(错误恢复)、Langfuse(trace)、Arize(trajectory eval)、Helicone(事件流)、METR(能力上限)、Hendrycks(基准升级)、Supermaven(长上下文验证)、TruLens(全周期)、CrewAI(guardrails内建)、Dex Horthy(可观测+可回放) |
| 9 Sub Agent           | Karpathy(planner/worker/critic)、Yegge(角色+事实库)、LangGraph(子图)、OMO(handoff)、Cursor(并行)、Roo Code(Custom Modes)、Claude Code(Agent SDK)、Continue.dev(后台agent)、Warp(多线程agent)、Andrew Ng(四种模式)、Mollick(管理AI)、Magentic-One(Orchestrator)、AutoGen(可编程协作)、Flowise(loop/conditional/HITL)、Swarms(沟通拓扑)、Semantic Kernel(agent+process)                                 |

---

## 中国市场素材快速映射

| 节点                  | 中国市场补充素材                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| 0 介绍                | 刘小排（超级个体与小团队杠杆）、有赞技术（组织形态重构）                                                      |
| 1 上下文              | 刘小排（需求文档→复述→方案）、AGI-Next（ToB 场景对高质量 Context 的刚需）                                     |
| 2 三角关系            | 有赞技术（AI Coding+AI Test+AI DevOps 全流程）、刘小排（多模型分工）                                          |
| 3 System Instructions | 刘小排（先约束再执行，先对齐后编码）                                                                          |
| 4 内置工具            | 刘小排（background commands / 子 Agent）、腾讯云企业版（私有化/离线/专网）、通义灵码/文心快码（企业分层版本） |
| 5 MCP                 | 腾讯云 MCP 广场（Local/Hosted 双模式、上架与运维流程）                                                        |
| 8 Eval/验证           | 腾讯云企业版（研效看板与治理）、信通院+华为云指南（工程化落地框架）、SuperCLUE（中文代码基准）                |
| 9 Sub Agent           | 刘小排（长程任务编排）、企业多角色协作流程（有赞实践）                                                        |

---

## 推荐阅读顺序

1. 先看 [`china/market-platforms-and-practitioners.md`](../china/market-platforms-and-practitioners.md) 理解本土约束与人物样本。
2. 再看 [`global/foundations-core-voices.md`](../global/foundations-core-voices.md) 与 [`global/tooling-frameworks-research-governance.md`](../global/tooling-frameworks-research-governance.md) 获取全球对照。
3. 最后回到本文件做节点级引用与跨源归纳。

**本文件版本**：2026-02-12 初版
