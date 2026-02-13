# Agent-Native CLI Tools

> **Context Perspective**: The output of a CLI tool becomes context directly — plain text, predictable, and composable, it's the natural best interface for an agent.

The previous chapter's Skills inject behavioral knowledge — "how to do things." But knowledge needs to be put into action. How does the agent actually operate your system?

Back to the conclusion from the built-in tools chapter: `bash` is the most versatile tool — in theory it can do anything. CLI tools are bash's ammo — the agent calls `git`, `curl`, `jq`, `rg` through bash, and their output becomes part of the context directly.

## Why CLI Is Naturally Agent-Friendly

> Make each program do one thing well.
> — Doug McIlroy, inventor of Unix pipes

The Unix philosophy, established decades ago, unintentionally paved the way for today's agentic programming:

- **Plain text interface**: Input is arguments, output is stdout/stderr. No GUI state to manage.
- **Predictable behavior**: Same input, same output. The agent can reliably parse results.
- **Composable**: Chain multiple commands via pipes (`|`). `curl -s https://api.example.com/users | jq '.[0].name'` — one line, result in hand.

An agent doesn't need to understand the position of buttons in a GUI. It just needs to construct a command string and parse the returned text.

## Output Is Context

When an agent needs to understand project history, it doesn't "open a Git client." It executes a command.

**── Round 1 ──**

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant...",
  "messages": [{ "role": "user", "content": "Show me the recent commit history." }],
  "tools": [{ "name": "bash", "description": "Execute a shell command" }]
}
```

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "tool_calls": [
    { "id": "call_001", "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }
  ]
}
```

The agent executes the command locally and captures stdout.

**── Round 2 ──**

Notice the messages are longer than Round 1 — the context is growing.

```json
// → REQUEST (agent → LLM API)
{
  "messages": [
    { "role": "user", "content": "Show me the recent commit history." },
    {
      "role": "assistant",
      "tool_calls": [{ "id": "call_001", "name": "bash", "arguments": { "command": "git log -n 3 --oneline" } }]
    },
    {
      "role": "tool",
      "tool_call_id": "call_001",
      "content": "f4b3c1d (HEAD -> main) feat: add user authentication\n2a1b9e5 fix: resolve payment gateway timeout\ne8d7f6c docs: update README with setup instructions"
    }
  ]
}
```

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Recent progress: added user authentication, fixed payment gateway timeout, updated docs. Want me to dig into any of these?"
}
```

The output of `git log`, as-is, becomes the LLM's context. And it's not just stdout — **exit codes and stderr are context signals too**. Command returns a non-zero exit code? The agent knows execution failed. stderr has an error message? The agent adjusts its strategy accordingly.

## Structured Output: More Agent-Friendly

Traditional CLIs output plain text that the LLM has to parse on its own. But more and more modern CLIs support structured output (JSON, YAML), letting the agent extract information precisely instead of guessing:

- `gh pr list --json number,title,state` — GitHub CLI, direct JSON output
- `kubectl get pods -o json` — Kubernetes, structured cluster state
- `rg --json "pattern"` — ripgrep, search results in JSON format
- `docker inspect` — container details, native JSON
- `ast-grep --json "pattern"` — AST-level code search, JSON output

Structured output means: **fewer parsing errors, more precise information extraction, more reliable subsequent actions.** If the CLI you're calling supports a `--json` flag, prefer it.

## Differences from Built-in Tools and MCP

|                | Built-in Tools | MCP | CLI Tools |
| -------------- | -------------- | --- | --------- |
| **Source**     | Hardcoded by agent developer | External services via protocol | External programs via bash |
| **Interface**  | Internal agent function | Protocol abstraction (stdio or HTTP) | stdin/stdout |
| **Ecosystem**  | Closed, decided by agent | Open, requires MCP compliance | Extremely mature, vast existing tools |
| **Flexibility**| Low, user cannot add/remove | Medium, connect any MCP Server | High, install and call any CLI |

CLI tools are the **simplest, most universal, and most mature** way for an agent to interact with the outside world. If you're building a tool for agents, CLI-first is usually the safest bet — it forces you to expose core functionality in the purest, most composable way.

## Three Things to Watch in Every Chapter

- **Context flow**: CLI stdout/stderr is captured and injected directly into the next round's context. Exit codes serve as success/failure signals. Oversized output gets truncated by the agent — mind your output volume.
- **Risk**: CLI tools directly manipulate the OS; the risk of `rm -rf /` is real. An agent might incorrectly construct a destructive command. Some command outputs may contain sensitive information (environment variables, API keys, private keys).
- **Auditability**: Every shell command the agent executes and its output should be logged — a complete audit trail, the foundation for debugging and security reviews.

Next chapter: Knowledge Feeding — CLI tool output is ephemeral context. How do you distill it into knowledge the agent can use persistently?
