# Glossary

> Core terminology used throughout this tutorial. All terms use industry-standard language, not tied to any specific product.

| Term | 中文 | Definition |
|------|------|------------|
| Context | 上下文 | All text, structured data, and tool outputs visible to the model in one request. |
| Agent | Agent | A program that uses repeated LLM and tool calls to complete tasks autonomously. |
| LLM API | LLM API | The programming interface for sending requests to a language model and receiving replies. |
| System Instructions (System Prompt) | 系统指令 | High-priority prompts injected to set identity, constraints, and behavioral rules. |
| Built-in Tools | 内置工具 | Capabilities hardwired into the agent, such as reading files or running commands. |
| Tool Call (Function Calling) | 工具调用 | The mechanism for the model to request an agent to run a specific tool via structured data. |
| Model Context Protocol (MCP) | MCP | A protocol that standardizes connecting external capabilities and feeding results into context. |
| Slash Commands (Command Macros) | 命令 | User-defined shortcuts that trigger actions or prompts via fixed templates. |
| Skills (Domain Modules) | 技能模块 | Loadable domain knowledge or strategy modules that extend agent behavior at runtime. |
| Sub Agent (Worker Agent) | 子代理 | A helper agent operating in an isolated context to execute sub-tasks and return results. |
| Agent Loop | Agent 循环 | The repeated think→act→observe cycle an agent runs until the goal is met. |
| Context Window | 上下文窗口 | The maximum token capacity the model can process in a single request. |
| Context Pollution | 上下文污染 | Accumulated irrelevant or noisy content that degrades model reasoning quality. |

<!-- TODO(Phase2): Add more terms and detailed explanations -->
