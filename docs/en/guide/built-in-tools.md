# Built-in Tools

> **Context Perspective**: Tool definitions are the LLM's guide to action, and tool return values are its way of perceiving the world. Together, they form critical context.

The previous chapter covered how system instructions define the LLM's behavioral baseline. But identity alone isn't enough — the LLM needs the ability to **act**.

Built-in tools are that ability. They're functions pre-written by agent developers — reading files, executing commands, searching code, accessing the web — integrated directly into the agent, executed on your local machine.

Of these, `bash` (or `shell`) is the most versatile. In theory it can do anything — read files, install dependencies, run tests, check Git history, curl an API. So why have other tools at all? Because specialized tools are safer and more precise: `read_file` is more controllable than `cat`, `edit_file` is less error-prone than manually splicing file contents.

The LLM can't run these functions itself. What it can do is generate a JSON object telling the agent, "execute this operation for me."

This operation is a tool call.

The agent executes the tool locally, then packages the result—success or failure, along with any output—into a new message. It appends this message to the conversation history and sends it back to the LLM. Seeing the result, the LLM decides whether to call another tool or to answer the user's question.

This closed loop of "generate tool call → execute locally → return result → reason based on result" is the core engine of agentic workflows.

![Built-in Tools: LLM generates tool_calls JSON, Agent executes locally, results feed back as context — the action-perception loop powering agentic workflows](/illustrations/built-in-tools.svg)

## The Tool-Call Flow

Let's trace this engine through a complete HTTP request/response flow.

Imagine you ask the agent: "Rename the `log` function in `logger.js` to `logEvent`."

**── Round 1: From Intent to Tool Call ──**

The agent packages your instruction along with the system prompt containing all available tool definitions, and sends it to the LLM.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant. You can use the following tools: read_file, write_file...",
  "messages": [
    {
      "role": "user",
      "content": "Rename the log function in logger.js to logEvent"
    }
  ]
}
```

After reasoning, the LLM decides it needs to see the file contents first. Instead of outputting code directly, it returns a `tool_calls` request:

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Okay, I'll read the contents of logger.js first.",
  "tool_calls": [
    {
      "id": "call_abc123",
      "name": "read_file",
      "arguments": { "filePath": "src/logger.js" }
    }
  ]
}
```

At this point, no files have been modified. The LLM has only proposed a **plan of action**.

---

**Local Execution**

The agent receives the response, parses `tool_calls`, and executes `read_file` on the **local filesystem**, reading the contents of `src/logger.js`.

This happens entirely on your machine — no additional LLM API call involved.

---

**── Round 2: Resuming Reasoning with New Context ──**

The agent wraps the tool execution result into a `tool`-role message, appends it to the conversation history, and sends a new request. Notice the messages are longer than Round 1 — the context is growing.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant. You can use the following tools...",
  "messages": [
    {
      "role": "user",
      "content": "Rename the log function in logger.js to logEvent"
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

The LLM's context now includes the actual file content. It generates the modification plan:

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "File content read. Performing the rename now.",
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

The agent executes `write_file` locally again. A complete "read-modify-write" cycle is done.

````mermaid
sequenceDiagram
    participant User
    participant Agent
    participant LLM_API

    User->>Agent: "Rename `log` to `logEvent`"
    Agent->>LLM_API: POST /chat/completions (with tool definitions)
    LLM_API-->>Agent: SSE: `tool_calls` (to call read_file)
    Agent->>Agent: Local execution: read_file('src/logger.js')
    Note right of Agent: Read file content
    Agent->>LLM_API: POST /chat/completions (with file content)
    LLM_API-->>Agent: SSE: `tool_calls` (to call write_file)
    Agent->>Agent: Local execution: write_file(...)
    Note right of Agent: Write modified content
    Agent->>LLM_API: POST /chat/completions (with write success message)
    LLM_API-->>Agent: SSE: "Operation complete"
    Agent->>User: "I have renamed the `log` function to `logEvent`."
````

## How Tools Shape Context

After walking through this flow, you can see tools shape the LLM's context from two directions:

1. **Tool definitions → static context**: Every request's `system` or `tools` field carries the full tool manifest. Your agent has 15 tools? Then every single request — regardless of what the user asked — sends all 15 tool names, descriptions, and parameter schemas to the LLM. That's what "static" means: it doesn't change based on conversation content, but it always occupies context window. The LLM relies on it to plan actions — without knowing what tools are available, it can't decide what to do next.
2. **Tool return values → dynamic context**: Each tool execution result is appended to `messages`, becoming input for the next round of reasoning. `read_file` lets the LLM see the code; `bash` output tells it the current Git branch.

The LLM knows "what it can do" from tool definitions, and learns "what the current state of the outside world is" from return values.

![How tools shape context: static tool definitions vs dynamic tool results](/illustrations/built-in-tools-inline-1.svg)

But tool return values are also the fastest source of context bloat. One unrestricted `ls -R` or reading a log file with tens of thousands of lines can blow through most of the context window in a single call.

The smart move is to trim at the tool layer. Agent developers typically build in safeguards, like a `read_file` tool that only returns the first 2000 lines, or a `bash` tool that truncates long outputs. Users don't control these behaviors directly; they are necessary limits to keep the agent running stably.

Instead of waiting for the context to overflow and then scrambling to compress, don't let the junk in to begin with.

## Understanding the Agent's Exploratory Actions

When you see the agent run `ls` and `grep` for the third time, you might get impatient. "Why don't you just fix the code?"

**The agent can't see your screen.** It doesn't know what's open in your IDE or what your file tree looks like. Tool return values are the only way it "sees" the world.

- `ls` is its eyes, confirming where files are.
- `grep` is its scanner, locating what needs fixing.
- `read_file` is its microscope, examining code details.

These "redundant" operations build navigational context. Without them, the agent is coding blind. Let it explore.

## Trust Boundary Levels

The agent will **actually execute** whatever the LLM requests. Good tools split trust into two levels:

### Read Tools (Let it run)

`ls`, `read_file`, `grep`. Let these run freely. Don't interrupt its observation. If it needs to read 10 files before acting, let it.

### Write/Execute Tools (Intervene)

`write_file`, `bash` (for mutating operations). This is your intervention point.

Watch one thing: did it read before writing? An agent that calls `write_file` without ever running `read_file` should be stopped, even if the fix looks right. That's a hallucination that got lucky.

You need to know the extent of your agent's permissions and consciously supervise high-risk operations.

![Tool trust boundary levels: allow read-only, review writes, confirm high-risk operations](/illustrations/built-in-tools-inline-2.svg)

Just saying "tools" is too abstract. What do the built-in tools of different agents actually look like? A few examples make it clear. Here’s a comparison of the toolsets for four common AI coding assistants to give you a concrete idea of what "built-in" means.

### Tool Category Comparison

| Tool Type | Claude Code | Codex | Gemini CLI | OpenCode |
| :--- | :--- | :--- | :--- | :--- |
| **Read** | `Read`, `Glob`, `Grep` | `read_file`, `list_dir` | `read_file`, `list_directory`, `glob` | `read`, `glob`, `grep` |
| **Write** | `Write`, `Edit` | `apply_patch` | `write_file`, `replace` | `edit`, `write` |
| **Execute** | `Bash` | `shell` (sandboxed) | `run_shell_command` | `bash` |
| **Search** | `Grep`, `Glob` | `grep_files` | `search_file_content`, `glob` | `grep`, `lsp` |
| **Network** | `WebFetch`, `WebSearch` | `web_search` | `web_fetch`, `google_web_search` | `webfetch` |

### Permission Control Comparison

| Agent | Permission Model | User Configuration |
| :--- | :--- | :--- |
| **Claude Code** | Tiered permissions (default, acceptEdits, plan, dontAsk) | `allowedTools` list + interactive prompts |
| **Codex** | Sandbox + approval policy (Auto / Read-only / Full Access presets) | CLI parameters + `~/.codex/config.toml` |
| **Gemini CLI** | Interactive confirmation + Trusted Folders + Sandbox | `~/.gemini/settings.json` |
| **OpenCode** | Per-tool modes (allow, ask, deny) | `opencode.json` file |

The tool names and categories differ, but the pattern is the same: read, write, execute, and search, plus tiered permission controls. This combination is the foundation of how an agent interacts with the world.

## Key Takeaways

- **Context flow**: Tool definitions are static context, present in every request; tool return values are dynamic context, appended after execution. Together they drive the LLM's "act-perceive" loop.
- **Risk**: `read_file` on a 10MB log? Context window instantly blown, critical early information truncated. `bash` auto-executing `rm -rf`? An agent without confirmation will likely do it.
- **Auditability**: Every `tool_calls` request and its corresponding `tool`-role message lives in the conversation history — a complete evidence chain of actions.

Next chapter: MCP — when built-in tools aren't enough, how to let agents call external services. The execution path changes, but to the LLM, everything looks the same.
