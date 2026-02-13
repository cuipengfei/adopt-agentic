# Agent, User, and LLM API

> **Context perspective:** Three roles jointly construct, consume, and update context. Clarify boundaries first before talking about controlled collaboration.

## Who Are the Three Roles

| Role | What It Does |
|------|--------------|
| You | Gives intent |
| Agent | Orchestrates context + executes tools |
| LLM | Reasons |

Agent doesn't think—it **executes** the LLM's decisions. LLM doesn't act—it **reasons** what to do.

## Collaboration Loop

Watch one round.

**── Round 1 ──**

Agent sends request to LLM:

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a coding assistant...",
  "messages": [{ "role": "user", "content": "Extract login function" }]
}
```

LLM responds:

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Let me read first...",
  "tool_calls": [{ "name": "read_file", "arguments": { "path": "auth.js" } }]
}
```

LLM didn't modify code—it **requested a tool call**, executed locally by Agent.

**── Round 2 ──**

Agent appends tool result, sends again:

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a coding assistant...",
  "messages": [
    { "role": "user", "content": "Extract login function" },
    { "role": "assistant", "content": "Let me read first...", "tool_calls": [{ "name": "read_file", "arguments": { "path": "auth.js" } }] },
    { "role": "tool", "content": "function login() { ... }" }
  ]
}
```

LLM returns plan. Agent executes file operations.

Three roles, each doing one thing: LLM reasons, Agent executes, You provide intent.

A complete interaction should include full tool_calls:

## File Operation Examples

See a complete real-world example:

```json
{
  "name": "write_file",
  "arguments": {
    "path": "src/login.js",
    "content": "function login() { ... }"
  }

{
  "name": "edit_file",
  "arguments": {
    "path": "src/auth.js",
    "old": "function authenticate() { ... }",
    "new": "import { login } from './login.js';\n\nfunction authenticate() { ... }"
  }
}
```

## API Protocols

Three mainstream formats:

- **Messages API** (Anthropic)
- **Chat Completions** (OpenAI)
- **Responses API** (OpenAI)

All HTTP, same core: send context, receive reasoning. Agent shields you from differences.

## Why Agentic, Not Chat

Chat: You speak — LLM speaks — You speak — LLM speaks.

Agentic: **Receive → Reason → Act → Observe → Reason again**.

Key difference: **Tools**. Chat just exchanges text. Agentic means LLM calls tools, modifies files, runs commands—then continues reasoning based on results.

That's why it's called "agent"—it has agency, not just response.

## How to Task an Agent

### Be Clear About What You Want

"Optimize this" → "Extract login to separate file, stay compatible".

Have agent restate, confirm before proceeding.

### Break Into Chunks

Large tasks into verifiable chunks. Check after each. Cheaper than running 20 files then rolling back.

### Minimal Experiment

Have agent do minimal working version first. Verify direction before refining.

## Generic Terminology

- Agent: Claude Code, Cursor, Windsurf, Copilot Chat are all agents
- LLM API: Claude, OpenAI, Gemini all work
- Tools: file read/write, code search, command execution, browser control

Different mechanisms, **triangular relationship stays the same**.

## Cross-Cutting Concerns

- **Context flow:** Intent → system + messages → reasoning → tool_calls → execution → results back to messages → loop.
- **Risk:** Ambiguous intent → wrong reasoning; excessive permissions → chaos; LLM hallucinations → wrong parameters.
- **Auditability:** Each round's request body exportable, replayable; tool call logs traceable.
