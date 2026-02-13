# Agent-Native CLI 工具

> **上下文视角**：CLI 工具的输出直接成为上下文——纯文本、可预测、可组合，天然就是 agent 的最佳接口。

如果说 agent 是 LLM 的手和脚，那么命令行工具（CLI）就是它最称手的瑞士军刀。

Agent-native CLI tool 指的是两类工具：
1.  **传统上就对 agent 友好的 CLI**：比如 `git`, `grep`, `curl`。
2.  **专门为 agent 设计的新一代 CLI**：为特定 agentic 工作流打造的工具。

它们共同的特点是：**输入输出皆为文本，行为可预测，无需图形界面，且可组合**。这完美契合了 agent 的工作模式。

## Unix 哲学：天然的 Agent-Friendly

> 做一件事，做好它，并与其他程序良好协作。
> — Doug McIlroy, Unix 管道发明者

几十年前的 Unix 哲学，无意中为今天的 agentic 编程铺平了道路。

`git`, `ripgrep` (rg), `jq`, `curl`——这些工具之所以强大，是因为它们遵循了 Unix 的设计原则。它们是 agent 最理想的协作者，因为它们：
- **只做一件事**：`rg` 只负责搜索，`jq` 只负责解析 JSON。功能单一，行为稳定。
- **纯文本接口**：输入是文本参数，输出是文本流（stdout/stderr）。没有复杂的 UI 状态需要管理。
- **可组合性**：通过管道（`|`）可以连接多个命令，形成强大的工作流。`rg "error" | jq .message`

这种模式对 agent 来说是完美的。Agent 不需要理解一个图形界面应用里按钮的位置和颜色，它只需要知道如何构造一个命令字符串，然后解析返回的文本。

## 上下文流动：输出即上下文

当 agent 需要了解项目历史时，它不会去"打开 Git 客户端"。它会执行一个命令。

**── 第 1 轮 ──**

Agent 接到任务，决定调用 `git log`。

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个代码助手...",
  "messages": [{ "role": "user", "content": "帮我看看最近的提交记录，了解下项目进展。" }],
  "tools": [{ "name": "bash", "description": "执行 shell 命令" }]
}
```

LLM 决定使用 `bash` 工具。

```json
// ← RESPONSE（LLM API → agent, SSE 流）
{
  "role": "assistant",
  "content": "好的，我来查看一下最近的提交记录。",
  "tool_calls": [
    { "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }
  ]
}
```

Agent 在本地执行该命令，捕获 `stdout`。

**── 第 2 轮 ──**

Agent 将 `git log` 的输出作为 `tool` 角色的内容，追加到上下文中，再次发给 LLM。

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个代码助手...",
  "messages": [
    { "role": "user", "content": "帮我看看最近的提交记录，了解下项目进展。" },
    {
      "role": "assistant",
      "content": "好的，我来查看一下最近的提交记录。",
      "tool_calls": [{ "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }]
    },
    {
      "role": "tool",
      "content": "f4b3c1d (HEAD -> main) feat: add user authentication\n2a1b9e5 fix: resolve payment gateway timeout\ne8d7f6c docs: update README with setup instructions"
    }
  ],
  "tools": [{ "name": "bash", "description": "执行 shell 命令" }]
}
```

LLM 现在看到了 `git` 的输出，并基于这些信息进行下一步推理。

```json
// ← RESPONSE（LLM API → agent, SSE 流）
{
  "role": "assistant",
  "content": "看到了。最近的进展主要是增加了用户认证功能，修复了支付网关的超时问题，并更新了文档。接下来你需要我做什么？"
}
```

`git log` 的输出，不多不少，原封不动地成了 LLM 的"记忆"。这就是 CLI 工具与 agent 协作的本质——**CLI 的输出直接成为上下文的一部分**。

## 新一代 Agent-Native 工具

除了传统的 Unix 工具，社区也开始涌现专门为 agent 设计的 CLI 工具。

这些工具通常通过 `npm` / `pip` / `cargo` 等包管理器安装，它们被设计为在 agentic 循环中被调用，提供更结构化（例如，输出 JSON）或更符合 LLM "思维"的反馈。

例如，一个为 agent 设计的代码搜索工具，可能不仅仅返回匹配的行，还会返回包含该行的函数签名和类定义，一步到位地提供更丰富的上下文。

## 与内置工具和 MCP 的区别

|            | 内置工具 (Built-in Tools) | MCP (Model Context Protocol) | CLI 工具 (CLI Tools) |
| ---------- | ------------------------- | ---------------------------- | -------------------- |
| **来源**   | Agent 开发者硬编码        | 外部服务，通过协议接入       | 外部程序，通过 shell 调用 |
| **接口**   | Agent 内部函数调用        | 标准化网络协议 (HTTP)        | 标准输入/输出 (stdin/stdout) |
| **生态**   | 封闭，由 Agent 决定       | 开放，需遵循 MCP 规范        | 极其成熟，海量的现有工具 |
| **灵活性** | 低，用户无法增减          | 中，可接入任何 MCP 服务      | 高，可安装和调用任何 CLI |

简单说，CLI 工具是 agent 与外部世界交互**最简单、最普遍、生态最成熟**的方式。

## 设计启示

如果你要为 agent 构建一个工具，**CLI-first 是最稳妥、最 agent-friendly 的选择**。它迫使你思考最核心的功能，并以最纯粹、可组合的方式暴露出来。

## 横切关注点

- **上下文流动**：CLI 命令的 `stdout` 和 `stderr` 被捕获，直接作为纯文本注入到下一轮的上下文中，供 LLM 推理。如果输出过大，可能会被 agent 截断。
- **风险提示**：CLI 工具拥有直接操作系统的能力，`rm -rf /` 的风险真实存在。Agent 可能会错误地构造破坏性命令。此外，某些命令的输出可能包含敏感信息（如环境变量、私钥）。
- **可审计性**：Agent 执行的每一条 shell 命令及其输出都应被记录。这提供了完整的操作追溯链，是调试和安全审计的基础。
