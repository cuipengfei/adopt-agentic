# Agent-Native CLI Tools

> **Context Perspective**: The output of a CLI tool becomes context directly — plain text, predictable, and composable, it's the natural best interface for an agent.

The previous chapter's Skills inject behavioral knowledge — "how to do things." But knowledge needs to be put into action. How does the agent actually operate your system?

Back to the conclusion from the built-in tools chapter: `bash` is the most versatile tool — in theory it can do anything. CLI tools are bash's ammo — the agent calls `git`, `curl`, `jq`, `rg` through bash, and their output becomes part of the context directly.

![Agent-Native CLI Tools: Unix philosophy meets agentic workflows — plain text output becomes context, composable through pipes, predictable and auditable](/illustrations/cli-tools.svg)

## Why CLI Is Naturally Agent-Friendly

> Make each program do one thing well.
> — Doug McIlroy, inventor of Unix pipes

The Unix philosophy, established decades ago, unintentionally paved the way for today's agentic programming:

- **Plain text interface**: Input is arguments, output is stdout/stderr. No GUI state to manage.
- **Predictable behavior**: Same input, same output. The agent can reliably parse results.
- **Composable**: Chain multiple commands via pipes (`|`). `curl -s https://api.example.com/users | jq '.[0].name'` — one line, result in hand.

An agent doesn't need to understand the position of buttons in a GUI. It just needs to construct a command string and parse the returned text.

Look at it from a different angle. GUIs are designed for human visual cognition — icons, buttons, drag-and-drop. APIs are designed for programs to call — function signatures, parameter types, return values. CLIs are designed for text processing — text in, text out.

What is an LLM? A reasoning engine that takes text in and produces text out. CLI and LLM speak the same language natively.

There's one more advantage that's easy to overlook: self-discovery. The first time an agent encounters an unfamiliar CLI tool, one call is enough — the tool returns its help output, listing what it can do, how to use it, and what flags are available, all injected directly into context. From then on, the agent knows how to use it. No need to pre-load full documentation into context — fetch on demand, take only what you need.

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

## More Common Patterns

CLI tools go far beyond `git`. A few patterns agents commonly use:

**Code Quality**

- `tsc --noEmit` — type checking; exit code is the signal. No noise, the agent just reads whether it's 0 or non-zero.
- `eslint --format json` — code quality issues, structured by file, line number, and rule name. Precise.

**Dependency Management**

- `ncu --jsonUpgraded` — check which packages have updates; JSON output lets the agent reason directly about upgrade strategy.

**CLI Tools Designed for AI Workflows**

The tools above are "incidentally agent-friendly" — plain text interface, predictable, with structured output options. Some tools go further: **actively designed for AI workflows**. `openspec` is one example:

```bash
openspec list          # What changes are in progress
openspec show <name>   # Show spec, task list, and proposal for a change
```

When an agent calls these, the output isn't raw code or system state — it's **structured task context**: what this feature should do, what the constraints are, where things stand. This points to a direction: CLI tools not just for executing operations or querying state, but as active task context injection points for agents.

## Differences from Built-in Tools and MCP

|                | Built-in Tools | MCP | CLI Tools |
| -------------- | -------------- | --- | --------- |
| **Source**     | Hardcoded by agent developer | External services via protocol | External programs via bash |
| **Interface**  | Internal agent function | Protocol abstraction (stdio or HTTP) | stdin/stdout |
| **Ecosystem**  | Closed, decided by agent | Open, requires MCP compliance | Extremely mature, vast existing tools |
| **Flexibility**| Low, user cannot add/remove | Medium, connect any MCP Server | High, install and call any CLI |

CLI tools are the **simplest, most universal, and most mature** way for an agent to interact with the outside world. If you're building a tool for agents, CLI-first is usually the safest bet — it forces you to expose core functionality in the purest, most composable way.

## Key Takeaways

- **Context flow**: CLI stdout/stderr is captured and injected directly into the next round's context. Exit codes serve as success/failure signals. Oversized output gets truncated by the agent — mind your output volume.
- **Risk**: CLI tools directly manipulate the OS; the risk of `rm -rf /` is real. An agent might incorrectly construct a destructive command. Some command outputs may contain sensitive information (environment variables, API keys, private keys).
- **Auditability**: Every shell command the agent executes and its output should be logged — a complete audit trail, the foundation for debugging and security reviews.

Next chapter: Hooks & Plugins — shifting from "putting things into context" to "intercepting and modifying the context flow."

