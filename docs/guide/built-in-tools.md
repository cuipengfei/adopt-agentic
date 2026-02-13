# 内置工具

> **上下文视角**：工具定义是 LLM 行动的说明书，工具返回值是它感知世界的方式。两者共同构成关键上下文。

上一节讲了系统指令如何定义 LLM 的行为基准。但光有身份不够——LLM 还需要**行动能力**。

内置工具就是这种能力。它们是 Agent 开发者预先编写的函数——读文件、执行命令、搜代码、访问网络——集成在 Agent 内部，由 Agent 在你的本地机器上执行。

其中 `bash`（或 `shell`）是最万能的一个。理论上它能做任何事——读文件、装依赖、跑测试、查 Git 历史、curl 一个 API。那为什么还需要其他工具？因为专用工具更安全、更精确：`read_file` 比 `cat` 更可控，`edit_file` 比手动拼接文件内容更不容易出错。

LLM 自己不能运行这些函数。它能做的是生成一个 JSON 请求，告诉 Agent "帮我执行这个操作"。Agent 执行后，把结果喂回给 LLM。这个循环就是 agentic 工作流的核心引擎。

## 工具调用流程

让我们通过一个完整的 HTTP 请求/响应流程，看看这个引擎怎么转。

假设你对 Agent 说："把 `logger.js` 里的 `log` 函数改名为 `logEvent`。"

**── 第 1 轮：从意图到工具调用 ──**

Agent 将你的指令，连同包含所有可用工具定义的系统提示，打包发给 LLM。

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

LLM 推理后，判断需要先看文件内容。它不直接输出代码，而是返回一个 `tool_calls` 请求：

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "好的，我先读取 logger.js 的内容。",
  "tool_calls": [
    {
      "id": "call_abc123",
      "name": "read_file",
      "arguments": { "filePath": "src/logger.js" }
    }
  ]
}
```

此时没有任何文件被修改。LLM 只是提出了一个**行动计划**。

---

**本地执行**

Agent 收到响应，解析 `tool_calls`，在**本地文件系统**上执行 `read_file`，读取 `src/logger.js` 的内容。

整个过程在你的机器上完成，不涉及另一次 LLM API 调用。

---

**── 第 2 轮：带着新上下文继续推理 ──**

Agent 把工具执行结果包装成 `tool` 角色消息，追加到对话历史，发起新请求。注意 messages 比第 1 轮长了——上下文在增长。

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
        { "id": "call_abc123", "name": "read_file", "arguments": { "filePath": "src/logger.js" } }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "export function log(message) { console.log(message); }"
    }
  ]
}
```

LLM 的上下文中现在有了文件真实内容。它生成修改计划：

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "文件内容已读取。现在执行重命名。",
  "tool_calls": [
    {
      "id": "call_def456",
      "name": "write_file",
      "arguments": {
        "filePath": "src/logger.js",
        "content": "export function logEvent(message) { console.log(message); }"
      }
    }
  ]
}
```

Agent 再次在本地执行 `write_file`。一个完整的读取-修改-写入循环完成。

## 工具如何塑造上下文

走完这个流程，你会发现工具从两个方向塑造了 LLM 的上下文：

1. **工具定义 → 静态上下文**：每次请求的 `system` 或 `tools` 字段里，都带着完整的工具清单。你的 Agent 有 15 个工具？那每一轮请求——不管用户问的是什么——都会把这 15 个工具的名称、描述、参数 schema 全部发给 LLM。这就是"静态"的含义：它不会因为对话内容而变化，但始终占用上下文窗口。LLM 靠它规划行动——不知道有哪些工具，就无法决定下一步。
2. **工具返回值 → 动态上下文**：每次工具执行结果追加到 `messages`，成为下一轮推理的输入。`read_file` 让 LLM 看到代码，`bash` 让它知道当前 Git 分支。

LLM 通过工具定义知道能做什么，通过返回值知道世界是什么样。

## 信任边界

内置工具很强大，但也有风险——Agent 会**真实执行** LLM 请求的操作。

LLM 幻觉出 `bash rm -rf /`？没有安全检查的 Agent 会照做。

好的 Agent 工具会设置信任边界：

- **危险操作确认**：执行 `rm` 或 `git push --force` 前征求用户同意。
- **范围限制**：文件读写限制在项目目录内，不碰系统文件。
- **变更预览**：写入文件前展示 diff 供审查。

你需要清楚你的 Agent 有多大权限，并有意识地监督高风险操作。

## 读每一节时，留意这三件事

- **上下文流动**：工具定义是静态上下文，每次请求都在；工具返回值是动态上下文，执行后追加。两者共同驱动 LLM 的行动-感知循环。
- **风险**：`read_file` 读一个 10MB 的日志？上下文窗口瞬间爆掉，早期关键信息被截断。`bash` 自动执行 `rm -rf`？没有确认机制的 Agent 真的会执行。
- **可审计性**：每次 `tool_calls` 请求和对应的 `tool` 角色消息都在对话历史中——完整的行动证据链。

下一节看 MCP——当内置工具不够用时，如何让 Agent 调用外部服务。执行路径变了，但对 LLM 来说，一切照旧。
