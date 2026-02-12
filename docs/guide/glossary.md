# 术语表

> 本教程中使用的核心概念术语对照表。所有术语采用业界通用表述，不绑定特定产品。

| 中文 | English | 定义 |
|------|---------|------|
| 上下文 | Context | LLM 每次请求能看到的全部文本、结构化信息与工具结果。 |
| Agent | Agent | 通过循环调用 LLM 与工具自主完成任务的程序。 |
| LLM API | LLM API | 向大语言模型发送请求并获取回复的编程接口。 |
| 系统指令 | System Instructions (System Prompt) | 注入给模型的高优先级提示，定义身份、约束与行为规则。 |
| 内置工具 | Built-in Tools | Agent 硬编码提供的能力，如读写文件或执行命令。 |
| 工具调用 | Tool Call (Function Calling) | 模型以结构化请求让 Agent 执行某个工具的机制。 |
| MCP | Model Context Protocol | 用于标准化连接外部能力并把结果送入上下文的协议。 |
| 命令 | Slash Commands (Command Macros) | 用户预定义的快捷指令，用固定模板快速触发动作或提示。 |
| 技能模块 | Skills (Domain Modules) | 可按需加载的领域知识或策略片段，动态扩展 Agent 行为。 |
| 子代理 | Sub Agent (Worker Agent) | 在独立上下文中执行子任务并将结果返回的辅助 Agent。 |
| Agent 循环 | Agent Loop | 反复执行“思考→行动→观察”直到达到目标的运行模式。 |
| 上下文窗口 | Context Window | 模型单次请求可处理的最大 token 容量。 |
| 上下文污染 | Context Pollution | 无关或噪声信息累积导致模型推理质量下降。 |

<!-- TODO(Phase2): 补充更多术语和详细解释 -->
