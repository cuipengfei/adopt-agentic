# Glossary

> Core terminology used throughout this tutorial. All terms use industry-standard language, not tied to any specific product.

| Term | 中文 | Definition |
|------|------|------------|
| Context | 上下文 | All text, structured data, and tool outputs visible to the model in one request. |
| Context Window | 上下文窗口 | The maximum token capacity the model can process in a single request. |
| Context Isolation | 上下文隔离 | Running a Sub Agent in its own context so its reasoning isn't polluted by the main Agent's history, and the main Agent's window isn't consumed by sub-task details. |
| Context Summarization | 上下文摘要 | Compressing a long context into key points before passing it back—balancing information retention against window space. |
| Context Pollution | 上下文污染 | Accumulated irrelevant or noisy content that degrades model reasoning quality. |
| Agent | Agent | A program that uses repeated LLM and tool calls to complete tasks autonomously. |
| Agent Loop | Agent 循环 | The repeated think→act→observe cycle an agent runs until the goal is met. |
| LLM API | LLM API | The programming interface for sending requests to a language model and receiving replies. |
| Token | Token | The smallest unit of text an LLM processes. Context windows, billing, and rate limits are all measured in tokens. |
| SSE (Server-Sent Events) | SSE | A server-to-client streaming protocol. LLM APIs use it to return generated content token by token, rather than waiting for full completion before responding. |
| Hallucination | 幻觉 | When a model generates content that reads plausibly but is factually wrong. Especially dangerous in multi-Agent collaboration—one Agent's hallucination can pollute others through the message chain. |
| System Instructions (System Prompt) | 系统指令 | High-priority prompts injected to set identity, constraints, and behavioral rules. |
| Tool Call (Function Calling) | 工具调用 | The mechanism for the model to request an agent to run a specific tool via structured data. |
| Built-in Tools | 内置工具 | Capabilities hardwired into the agent, such as reading files or running commands. |
| Model Context Protocol (MCP) | MCP | A protocol that standardizes connecting external capabilities and feeding results into context. |
| Slash Commands (Command Macros) | 命令 | User-defined shortcuts that trigger actions or prompts via fixed templates. |
| Skills (Domain Modules) | 技能模块 | Loadable domain knowledge or strategy modules that extend agent behavior at runtime. |
| Agent-Native CLI Tools | CLI 工具 | Command-line tools designed specifically for Agents—outputting structured data instead of human-readable text, so Agents can parse and act on it. |
| Orchestration | 编排 | Strategies for coordinating multiple Agents or multi-step tasks. Common patterns: sequential chaining, parallel fan-out/fan-in, routing. |
| Sub Agent (Worker Agent) | 子代理 | A helper agent operating in an isolated context to execute sub-tasks and return results. |
| Human-in-the-loop (HITL) | Human-in-the-loop | Inserting human decision points into an Agent's automated flow—for high-risk, irreversible, or validation-failure scenarios. |
| Cognitive Debt | 认知债务 | The comprehension gap that builds when an Agent keeps requesting human input but the human can't keep up. Symptoms: rubber-stamping approvals, accepting diffs unread, skipping logs. |
| Peer-to-Peer Agents (P2P) | P2P Agent | Multiple Agents collaborating as peers, with context flowing bidirectionally among equals rather than in one-way delegation. |
| Fire-and-forget | Fire-and-forget | A messaging model where messages are sent without waiting for acknowledgment. Simplifies system design, but you cannot assume every message was processed. |
