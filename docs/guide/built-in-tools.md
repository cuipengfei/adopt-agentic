# 内置工具

> **上下文视角**：工具定义是 LLM 行动的说明书，工具返回值是它感知世界的方式。两者共同构成关键上下文。

## 什么是内置工具？

如果说 LLM 是大脑，那内置工具就是它的手、脚和感官。

它们是 Agent 开发者预先编写并集成到 Agent 中的函数，允许 LLM 与你的本地环境互动。这些不是 LLM 与生俱来的能力，而是 Agent 赋予它、供它调用的“超能力”。

常见的内置工具包括：
- **文件操作**：`read_file`, `write_file`, `edit_file`
- **命令执行**：`bash` 或 `shell`
- **代码搜索**：`grep` 或更高级的基于 LSP 的搜索
- **网络访问**：`web_search`, `scrape_url`

LLM 无法直接执行这些操作。它只能生成一个 JSON 对象，请求 Agent 代为执行。

## 工具调用流程

Agentic 工作流的核心是“思考-行动”循环，这个循环正是通过工具调用实现的。让我们通过一个完整的 HTTP 请求/响应流程，看看它如何运作。

假设你对 Agent 说：“把 `logger.js` 里的 `log` 函数改名为 `logEvent`。”

**── 第 1 轮：从意图到工具调用 ──**

Agent 将你的指令，连同包含所有可用工具定义的系统提示（System Prompt），打包发给 LLM。

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个代码助手。你可以使用以下工具：read_file, write_file...",
  "messages": [
    {
      "role": "user",
      "content": "把 logger.js 里的 log 函数改名为 logEvent"
    }
  ]
}
```

LLM 推理后，判断在修改前需要先读取文件内容。因此，它不返回代码块，而是返回一个 `tool_calls` 数组，请求 Agent 执行 `read_file` 工具。

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "好的，我先读取 `logger.js` 的内容。",
  "tool_calls": [
    {
      "name": "read_file",
      "arguments": { "filePath": "src/logger.js" }
    }
  ]
}
```

**重点**：此时，没有任何文件被修改。LLM 只是提出了一个**行动计划**。

---

**本地执行**

Agent 收到响应后，解析 `tool_calls` 数组。它发现一个调用 `read_file` 工具的请求，于是在**本地文件系统**上执行这个函数，读取 `src/logger.js` 的内容。

这个过程完全在你的本地机器上发生，不涉及另一次 LLM API 调用。

---

**── 第 2 轮：带着新上下文继续推理 ──**

Agent 将工具执行的结果（即文件内容）包装成一个 `tool` 角色的消息，追加到对话历史中，然后向 LLM 发送一个新请求。

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个代码助手。你可以使用以下工具...",
  "messages": [
    {
      "role": "user",
      "content": "把 logger.js 里的 log 函数改名为 logEvent"
    },
    {
      "role": "assistant",
      "tool_calls": [
        { "name": "read_file", "arguments": { "filePath": "src/logger.js" } }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123", // 用于关联的 ID
      "content": "export function log(message) { console.log(message); }"
    }
  ]
}
```

现在，LLM 的上下文中包含了文件的真实内容。基于这些信息，它就能准确生成修改计划，请求 `write_file` 或 `edit_file` 工具来应用变更。

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "文件内容已读取。现在我将执行重命名操作。",
  "tool_calls": [
    {
      "name": "write_file",
      "arguments": {
        "filePath": "src/logger.js",
        "content": "export function logEvent(message) { console.log(message); }"
      }
    }
  ]
}
```

Agent 再次在本地执行 `write_file`，完成重命名。一个完整的“读取-修改-写入”循环宣告完成。

## 信任边界

内置工具很强大，但也引入了风险，因为 Agent 会**真实执行** LLM 请求的工具调用。

如果 LLM 幻觉出一个 `bash` 调用，参数是 `rm -rf /`，一个没有安全检查的 Agent 可能会盲目执行它。

因此，好的 Agent 工具会引入信任边界：
- **危险操作确认**：在执行 `rm` 或 `git push --force` 等高风险命令前，征求用户同意。
- **范围限制**：将文件读写工具限制在当前项目目录内，防止意外修改系统文件。
- **变更预览**：在写入文件前，展示一个 diff 供用户审查。

作为用户，你需要清楚你的 Agent 有多大的工具权限，并有意识地监督它的高风险操作。

## 横切关注点

- **上下文流动**：工具定义作为静态上下文，在每次 API 调用中都存在，持续消耗一部分 token 窗口。工具返回值则作为动态上下文，在对话历史中不断累积。
- **风险提示**：巨大的工具返回值（例如读取一个超大文件或日志）会瞬间撑爆上下文窗口，导致关键的早期信息被截断。此外，像 `bash` 这类工具的自动执行，存在运行破坏性命令的风险。
- **可审计性**：每一次工具调用请求（`tool_calls`）和其结果（`tool` 角色消息）都被清晰地记录在对话历史中。这为追踪 Agent 的每一次行动提供了无可辩驳的证据链。
