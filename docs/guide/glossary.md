# 术语表

> 本教程中使用的核心概念术语对照表。所有术语采用业界通用表述，不绑定特定产品。

| 中文              | English                             | 定义                                                                                                         |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 上下文            | Context                             | LLM 每次请求能看到的全部文本、结构化信息与工具结果。                                                         |
| 上下文窗口        | Context Window                      | 模型单次请求可处理的最大 token 容量。                                                                        |
| 上下文隔离        | Context Isolation                   | 让 Sub Agent 在独立的上下文中运行，使其推理不被主 Agent 的历史干扰，主 Agent 的窗口也不被子任务细节撑满。    |
| 上下文摘要        | Context Summarization               | 将长上下文压缩为要点后回传，在信息保留和窗口空间之间取平衡。                                                 |
| 上下文污染        | Context Pollution                   | 无关或噪声信息累积导致模型推理质量下降。                                                                     |
| Agent             | Agent                               | 通过循环调用 LLM 与工具自主完成任务的程序。                                                                  |
| Agent 循环        | Agent Loop                          | 反复执行"思考→行动→观察"直到达到目标的运行模式。                                                             |
| LLM API           | LLM API                             | 向大语言模型发送请求并获取回复的编程接口。                                                                   |
| Token             | Token                               | LLM 处理文本的最小单位。上下文窗口、计费、速率限制都以 token 计量。                                          |
| SSE               | Server-Sent Events                  | 服务器向客户端单向推送的流式传输协议。LLM API 用它逐 token 返回生成内容，而非等全部生成完再一次性返回。      |
| 幻觉              | Hallucination                       | 模型生成看似合理但事实上错误的内容。在多 Agent 协作中尤其危险——一个 Agent 的幻觉会通过消息链污染其他 Agent。 |
| 系统指令          | System Instructions (System Prompt) | 注入给模型的高优先级提示，定义身份、约束与行为规则。                                                         |
| 工具调用          | Tool Call (Function Calling)        | 模型以结构化请求让 Agent 执行某个工具的机制。                                                                |
| 内置工具          | Built-in Tools                      | Agent 硬编码提供的能力，如读写文件或执行命令。                                                               |
| MCP               | Model Context Protocol              | 用于标准化连接外部能力并把结果送入上下文的协议。                                                             |
| 命令              | Slash Commands (Command Macros)     | 用户预定义的快捷指令，用固定模板快速触发动作或提示。                                                         |
| 技能模块          | Skills (Domain Modules)             | 可按需加载的领域知识或策略片段，动态扩展 Agent 行为。                                                        |
| CLI 工具          | Agent-Native CLI Tools              | 专为 Agent 设计的命令行工具——输出结构化数据而非人类可读文本，便于 Agent 解析和行动。                         |
| 编排              | Orchestration                       | 协调多个 Agent 或多步骤任务的执行策略。常见模式：顺序链、并行扇出/扇入、路由分发。                           |
| 子代理            | Sub Agent (Worker Agent)            | 在独立上下文中执行子任务并将结果返回的辅助 Agent。                                                           |
| Human-in-the-loop | HITL                                | 在 Agent 自动执行流程中插入人类决策点——用于高风险、不可逆或验证失败的场景。                                  |
| 认知债务          | Cognitive Debt                      | Agent 持续要求人类介入但人类跟不上时产生的理解差距。症状：无脑批准、跳过 diff 直接 accept、不看日志。        |
| P2P Agent         | Peer-to-Peer Agents                 | 多个 Agent 平级协作，上下文在对等体之间双向流动而非单向委派。                                                |
| Fire-and-forget   | Fire-and-forget                     | 消息发出后不等确认回执的通信模式。简化系统设计，但不能假设每条消息都被处理了。                               |
