---
visualRhythm: false
---

# 知识星图与术语表

> 本教程中使用的核心概念术语对照表。所有术语采用业界通用表述，不绑定特定产品。

<KnowledgeConstellation />

> 下方表格保留为可索引文本层（SEO fallback），同时作为术语检索底稿。

| 中文              | English                             | 定义                                                                                                         |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 上下文            | Context                             | LLM 每次请求能看到的全部文本、结构化信息与工具结果。                                                         |
| 上下文窗口        | Context Window                      | 模型单次请求可处理的最大 token 容量。                                                                        |
| Lost-in-the-middle | Lost-in-the-middle                  | Liu et al. (2023) 发现的现象：LLM 对上下文开头和末尾关注度高，中间部分容易被忽略。影响长上下文中关键信息的放置策略。 |
| 上下文隔离        | Context Isolation                   | 让 Sub Agent 在独立的上下文中运行，使其推理不被主 Agent 的历史干扰，主 Agent 的窗口也不被子任务细节撑满。    |
| 上下文摘要        | Context Summarization               | 将长上下文压缩为要点后回传，在信息保留和窗口空间之间取平衡。                                                 |
| 上下文污染        | Context Pollution                   | 无关或噪声信息累积导致模型推理质量下降。                                                                     |
| 信噪比            | Signal-to-Noise Ratio (SNR)         | 上下文中有效信息与噪声的比例。信噪比越高，模型越容易做出稳定判断。                                           |
| 上下文供给链      | Context Supply Chain                | 从任务目标到系统指令、工具能力、执行结果的完整上下文供给路径。                                                |
| Agent             | Agent                               | 通过循环调用 LLM 与工具自主完成任务的程序。                                                                  |
| Agent 循环        | Agent Loop                          | 反复执行"思考→行动→观察"直到达到目标的运行模式。                                                             |
| ReAct             | ReAct (Reasoning + Acting)          | Yao et al. (2022) 提出的推理框架：交替进行推理和行动，每步结果反馈给下一步。大多数 Agent Loop 的底层模式。    |
| 检查点            | Checkpoint                          | 长任务中的可恢复状态点。失败后可从最近检查点继续，而不是全部重来。                                            |
| 回滚              | Rollback                            | 当验证失败或方向错误时，撤销改动回到最近的已知好状态。                                                        |
| LLM API           | LLM API                             | 向大语言模型发送请求并获取回复的编程接口。                                                                   |
| Token             | Token                               | LLM 处理文本的最小单位。上下文窗口、计费、速率限制都以 token 计量。                                          |
| SSE               | Server-Sent Events                  | 服务器向客户端单向推送的流式传输协议。LLM API 用它逐 token 返回生成内容，而非等全部生成完再一次性返回。      |
| 幻觉              | Hallucination                       | 模型生成看似合理但事实上错误的内容。在多 Agent 协作中尤其危险——一个 Agent 的幻觉会通过消息链污染其他 Agent。 |
| 系统指令          | System Instructions (System Prompt) | 注入给模型的高优先级提示，定义身份、约束与行为规则。                                                         |
| 工具调用          | Tool Call (Function Calling)        | 模型以结构化请求让 Agent 执行某个工具的机制。                                                                |
| tool_calls        | tool_calls                          | LLM API 响应中要求执行工具的标准字段。包含工具名称和参数的 JSON，Agent 解析后在本地执行。                    |
| 结构化输出        | Structured Output                   | 要求 LLM 以固定 schema（如 JSON Schema）返回响应。消除自由文本解析的不确定性，Agent 可直接将输出作为数据处理。 |
| 内置工具          | Built-in Tools                      | Agent 硬编码提供的能力，如读写文件或执行命令。                                                               |
| 信任边界          | Trust Boundary                      | 区分不同操作风险等级的安全分界线。Agent 工具链中通常分三级——读取（低风险）、写入（中风险）、执行/删除（高风险），每级需要不同的审批策略。 |
| MCP               | Model Context Protocol              | 用于标准化连接外部能力并把结果送入上下文的协议。                                                             |
| 命令              | Slash Commands (Command Macros)     | 用户预定义的快捷指令，用固定模板快速触发动作或提示。                                                         |
| 技能模块          | Skills (Domain Modules)             | 可按需加载的领域知识或策略片段，动态扩展 Agent 行为。                                                        |
| 渐进式披露        | Progressive Disclosure              | 交互设计原则：先展示摘要或列表，用户需要时再展开完整内容。Agent 加载 Skills 时采用类似策略——先发摘要，激活后才注入全文。 |
| CLI 工具          | Agent-Native CLI Tools              | 专为 Agent 设计的命令行工具——输出结构化数据而非人类可读文本，便于 Agent 解析和行动。                         |
| llms.txt          | llms.txt                            | 社区标准提案（llmstxt.org）：网站根目录放置的机器可读文件，为 LLM 和 Agent 提供站点结构与使用说明，类似 robots.txt 对搜索引擎的作用。 |
| 编排              | Orchestration                       | 协调多个 Agent 或多步骤任务的执行策略。常见模式：顺序链、并行扇出/扇入、路由分发。                           |
| 计划-执行         | Plan-and-Execute                    | 编排模式之一：先让 LLM 生成完整计划，再逐步执行每个子任务。适合可预见步骤的任务，缺点是计划可能在执行中过时。 |
| 子代理            | Sub Agent (Worker Agent)            | 在独立上下文中执行子任务并将结果返回的辅助 Agent。                                                           |
| Human-in-the-loop | HITL                                | 在 Agent 自动执行流程中插入人类决策点——用于高风险、不可逆或验证失败的场景。                                  |
| 验证金字塔        | Verification Pyramid                | 按执行级、任务级、系统级分层验证结果的框架。                                                                  |
| 认知债务          | Cognitive Debt                      | Agent 持续要求人类介入但人类跟不上时产生的理解差距。症状：无脑批准、跳过 diff 直接 accept、不看日志。        |
| P2P Agent         | Peer-to-Peer Agents                 | 多个 Agent 平级协作，上下文在对等体之间双向流动而非单向委派。                                                |
| 状态与记忆        | State & Memory                      | 区分会话内短期状态与跨会话长期记忆，避免把暂存信息误当长期事实。                                              |
| 会话交接          | Session Handoff                     | 把当前会话的目标、进度、风险和下一步建议打包给下一次会话继续执行。                                            |
| Vibe Coding       | Vibe Coding                         | Andrej Karpathy (2024) 提出的概念：完全依赖自然语言描述意图，让 AI 编写所有代码，不审查细节。Context Engineering 的对立面——一个放手，一个精控。 |
| 提示工程          | Prompt Engineering                  | 手工打磨单条 prompt 以提升 LLM 输出质量的技艺。Context Engineering 的前身。                                  |
| 上下文工程        | Context Engineering                 | 设计动态系统，在正确的时间以正确的格式向 LLM 提供正确的信息和工具。从"写好一条 prompt"演进到"管理整个上下文供给链"。 |
| Agentic 工程      | Agentic Engineering                 | 用 AI agent 工具高效构建软件的工程实践全集——涵盖上下文管理、工具选型、并行编排、反馈闭环、质量验证等全链路。上下文工程是其核心子领域。 |
| Fire-and-forget   | Fire-and-forget                     | 消息发出后不等确认回执的通信模式。简化系统设计，但不能假设每条消息都被处理了。                               |
| Harness Engineering     | Harness Engineering                 | 围绕 LLM 搭建的工程外壳，通常覆盖 agent loop、工具路由、上下文/记忆、skills、hooks、权限/审批、追踪和恢复等机制。 |
| 可执行 Definition of Done | Executable Definition of Done      | 本站用法，非标准术语。指把完成准则写成可被脚本、命令或构建验证的信号，而非只写「测试通过」等描述性文字。      |
| 失败日志回流            | Failure Log Feedback                | 将 `tool_error`、命令输出、前次尝试和恢复建议整理进下一轮 agent 输入，让上一次失败成为下一次的上下文。        |
| 执行隔离                | Execution Isolation                 | 通过文件系统、网络、命令权限、沙箱和会话状态边界限制 agent 的运行范围，避免越权操作和会话互相污染。          |
| 工作流沉淀              | Workflow Formalization              | 将反复执行的一次性 prompt 固化为 skill、command 或 hook，减少每次重新描述的开销。                            |
| 审批闭环                | Approval Loop                       | 自动信号和风险判定先给出分流：低风险放行，高风险暂停并进入人工审批；审批结果再反过来调整规则。              |
| 认知参与                | Cognitive Engagement                | 本站译法。agent 协作中，人通过理解、判断、干预和调整保持对任务的实质掌控，而非仅点击审批按钮。                |
