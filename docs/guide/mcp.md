# MCP — 外部能力扩展

> **上下文视角**：MCP 工具的定义和返回值与内置工具一样进入上下文，LLM 不区分来源。

内置工具很强，但终究有限。如果想让 Agent 连接你的项目管理工具、调用公司内部的 API、或者集成一个全新的服务，怎么办？

等 Agent 开发者更新？不可能。自己改 Agent 源码？不现实。

你需要一个标准化的方式，让**外部能力**可以被 Agent 发现和使用。这就是 MCP（Model-Context Protocol）的作用。

## 什么是 MCP？

MCP 是一种协议，不是某个具体实现。

它定义了一套标准，允许任何人为 Agent 开发工具，而无需修改 Agent 自身的代码。

可以把它理解为 Agent 世界的 Webhook 或插件系统。你的应用不需要为每个第三方服务都写定制代码，只要大家都遵循一个公开的约定（比如 HTTP POST + JSON），就能互相通信。

MCP 就是这个约定。

它允许 Agent 在运行时动态地发现并集成第三方工具。这些工具运行在独立的“MCP Server”上，由工具开发者自己维护。

## 功能等价，来源不同

对于 LLM 来说，它**完全不区分**一个工具是内置的还是通过 MCP 接入的。

在它眼里，都是工具。

**── 第 1 轮 ──**

假设我们有一个通过 MCP 接入的 `search_jira` 工具。当用户提问时，Agent 会把**所有可用工具**（包括内置的 `read_file` 和外部的 `search_jira`）的定义都放进上下文，发给 LLM。

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个项目助理...",
  "tools": [
    {
      "name": "read_file",
      "description": "读取文件内容",
      "input_schema": { "...": "..." }
    },
    {
      "name": "search_jira",
      "description": "根据关键词搜索 Jira issue",
      "input_schema": { "...": "..." }
    }
  ],
  "messages": [
    { "role": "user", "content": "查一下“数据库性能”相关的 ticket" }
  ]
}
```

LLM 看到有两个工具可用，它会根据用户意图选择最合适的那个。

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "好的，正在搜索 Jira...",
  "tool_calls": [
    { "name": "search_jira", "arguments": { "query": "数据库性能" } }
  ]
}
```

LLM 同样返回一个 `tool_calls` 请求。

区别在于 Agent 如何执行它：
- 如果是 `read_file`，Agent **在本地**直接执行。
- 如果是 `search_jira`，Agent 会向对应的 MCP Server 发起一个**网络请求**，执行这个工具。

```
            ┌────────────────┐        ┌────────────────┐
Agent       │ Executes       │        │ Sends request to │      MCP Server
 in your    │ 'read_file'    │        │ 'search_jira'    │ ──────► on the internet
 editor     │ locally        │        │ tool             │
            └────────────────┘        └────────────────┘
```

MCP Server 执行完搜索后，把结果返回给 Agent。Agent 再把这个结果，连同之前的对话历史，一起打包成新的上下文，发给 LLM 继续下一步。

对于 LLM 来说，后续的上下文和内置工具的返回值**毫无区别**：

```json
// → REQUEST（agent → LLM API）
{
  "messages": [
    // ... (历史消息)
    {
      "role": "tool",
      "tool_use_id": "...",
      "content": "[ { \"id\": \"PROJ-123\", \"title\": \"优化索引\" }, { ... } ]"
    }
  ]
}
```

LLM 只关心拿到了 Jira 的搜索结果，它不知道也不需要知道这个结果是来自本地文件系统还是一个千里之外的服务器。

## 为什么重要：开放生态

MCP 打破了 Agent 的封闭性。

没有 MCP，Agent 的能力边界由其开发者决定。你只能使用它提供的那些内置工具。

有了 MCP，任何开发者都可以为任何兼容此协议的 Agent 创造新能力。一个为 Jira 写的 MCP Server，理论上可以被 Claude Code、Cursor 或任何其他支持 MCP 的 Agent 使用。

这创造了一个开放的、可互操作的工具生态系统。

## 横切关注点

- **上下文流动**：MCP 工具的定义在每次请求时被注入上下文，占用 token 窗口。工具的返回值在执行后被注入上下文，成为后续推理的依据。
- **风险提示**：信任是最大的问题。一个恶意的 MCP Server 可能会返回虚假信息污染你的上下文，或者记录你的敏感请求。Agent 需要有明确的权限控制和用户审批机制，来决定是否信任和执行来自外部的工具。
- **可审计性**：Agent 与 MCP Server 之间的网络请求应该被完整记录。这使得每一次外部工具的调用都变得可追溯，可以清晰地看到请求了什么、返回了什么。
