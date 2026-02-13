# Agent-Native CLI Tools

> **Context Perspective**: The output of a CLI tool becomes context directly—plain text, predictable, and composable, it's the perfect interface for an agent.

If an agent is the hands and feet of an LLM, then command-line interface (CLI) tools are its most trusted Swiss Army knife.

Agent-native CLI tools fall into two categories:
1.  **Traditionally agent-friendly CLIs**: Tools like `git`, `grep`, and `curl`.
2.  **A new generation of CLIs designed for agents**: Tools built specifically for agentic workflows.

Their shared characteristics are that their **input and output are text, their behavior is predictable, they require no graphical interface, and they are composable**. This perfectly matches an agent's working model.

## The Unix Philosophy: Naturally Agent-Friendly

> Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new "features".
> — Doug McIlroy, inventor of Unix pipes

The Unix philosophy, established decades ago, unintentionally paved the way for today's agentic programming.

Tools like `git`, `ripgrep` (rg), `jq`, and `curl` are powerful because they adhere to these design principles. They are ideal collaborators for an agent because they:
- **Do one thing well**: `rg` only searches, `jq` only parses JSON. Their functions are singular and their behavior is stable.
- **Use a plain text interface**: Input is text arguments, output is a text stream (stdout/stderr). There are no complex UI states to manage.
- **Are composable**: Multiple commands can be connected via pipes (`|`) to form powerful workflows, like `rg "error" | jq .message`.

This model is perfect for an agent. An agent doesn't need to understand the position and color of a button in a GUI application; it just needs to know how to construct a command string and then parse the returned text.

## Context Flow: Output is Context

When an agent needs to understand project history, it doesn't "open a Git client." It executes a command.

**── Turn 1 ──**

The agent receives a task and decides to call `git log`.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant...",
  "messages": [{ "role": "user", "content": "Help me check the recent commit history to understand the project's progress." }],
  "tools": [{ "name": "bash", "description": "Execute a shell command" }]
}
```

The LLM decides to use the `bash` tool.

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Okay, I'll check the recent commit history.",
  "tool_calls": [
    { "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }
  ]
}
```

The agent executes the command locally and captures its `stdout`.

**── Turn 2 ──**

The agent appends the output of `git log` as content from the `tool` role, adds it to the context, and sends it to the LLM again.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant...",
  "messages": [
    { "role": "user", "content": "Help me check the recent commit history to understand the project's progress." },
    {
      "role": "assistant",
      "content": "Okay, I'll check the recent commit history.",
      "tool_calls": [{ "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }]
    },
    {
      "role": "tool",
      "content": "f4b3c1d (HEAD -> main) feat: add user authentication\n2a1b9e5 fix: resolve payment gateway timeout\ne8d7f6c docs: update README with setup instructions"
    }
  ],
  "tools": [{ "name": "bash", "description": "Execute a shell command" }]
}
```

The LLM now sees the output from `git` and proceeds with its next reasoning step based on this information.

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "I see. Recent progress mainly includes adding user authentication, fixing a payment gateway timeout, and updating the documentation. What would you like me to do next?"
}
```

The output of `git log`, no more and no less, becomes the LLM's "memory." This is the essence of how CLI tools collaborate with agents—**the output of the CLI becomes a direct part of the context**.

## The New Generation of Agent-Native Tools

In addition to traditional Unix tools, a new wave of CLI tools designed specifically for agents is emerging in the community.

These tools are typically installed via package managers like `npm`, `pip`, or `cargo`. They are designed to be called within an agentic loop, providing more structured (e.g., JSON output) or more LLM-"cognizant" feedback.

For example, a code search tool designed for an agent might return not just the matching lines, but also the function signature and class definition containing those lines, providing richer context in a single step.

## Differences from Built-in Tools and MCP

|                    | Built-in Tools                      | MCP (Model Context Protocol)        | CLI Tools                             |
| ------------------ | ----------------------------------- | ----------------------------------- | ------------------------------------- |
| **Source**         | Hardcoded by the agent developer    | External services via a protocol    | External programs via the shell       |
| **Interface**      | Internal function call within the agent | Standardized network protocol (HTTP)| Standard I/O (stdin/stdout)           |
| **Ecosystem**      | Closed, decided by the agent        | Open, requires MCP compliance       | Extremely mature, vast existing tools |
| **Flexibility**    | Low, user cannot add or remove      | Medium, can connect to any MCP service| High, can install and call any CLI    |

Simply put, CLI tools are the **simplest, most universal, and most mature** way for an agent to interact with the outside world.

## Design Implications

If you are building a tool for an agent, **a CLI-first approach is the safest and most agent-friendly choice**. It forces you to think about the core functionality and expose it in the purest, most composable way.

## Cross-Cutting Concerns

- **Context Flow**: The `stdout` and `stderr` of a CLI command are captured and injected directly into the next turn's context as plain text for the LLM to reason about. If the output is too large, it may be truncated by the agent.
- **Risks**: CLI tools have the power to directly manipulate the operating system; the risk of `rm -rf /` is real. An agent might incorrectly construct a destructive command. Furthermore, the output of some commands could contain sensitive information (like environment variables or private keys).
- **Auditability**: Every shell command executed by the agent and its output should be logged. This provides a complete audit trail for debugging and security reviews.
