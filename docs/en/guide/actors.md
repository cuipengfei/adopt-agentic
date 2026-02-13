# Agent, User, and LLM API

> **Context perspective:** Three roles jointly construct, consume, and update context. Clarify boundaries first before talking about controlled collaboration.

## The Three Roles

Agent is not AI. Agent is glue code.

| Role | What It Does |
|------|--------------|
| You | Give intent |
| Agent | Orchestrate context + execute tools |
| LLM | Reason |

That's it. The LLM has never touched your files — it only reasons about what to do. The Agent doesn't think — it faithfully executes the LLM's decisions.

You think AI messed up your code? More likely the Agent fed the wrong context in, and the LLM faithfully reasoned on garbage.

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
    {
      "role": "assistant",
      "content": "Let me read first...",
      "tool_calls": [
        { "name": "read_file", "arguments": { "path": "auth.js" } }
      ]
    },
    { "role": "tool", "content": "function login() { ... }" }
  ]
}
```

LLM returns the plan, Agent executes file operations.

Notice Round 2's request: the Agent **re-sent the entire history** — user message, LLM's previous reply, tool result, every last bit. The LLM has no memory; it reads from scratch every time. Every piece of junk you add to the message list, it has to re-consume every single round.

The LLM may return multiple tool_calls at once. After extracting a function, it might request both writing a new file and modifying the old one:

```json
{
  "name": "write_file",
  "arguments": {
    "path": "src/login.js",
    "content": "function login() { ... }"
  }
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

Agent executes them one by one, appending each result back to `messages` — next round the LLM sees all execution results.

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

Vague vs precise:

> ❌ `"Optimize this module"`
> Agent modifies 5 files, 3 of which shouldn't have been touched.

> ✅ `"Extract login to src/login.js, keep auth.js export signatures unchanged"`
> One clean cut.

Not sure the agent understood? Have it restate your intent. Confirm alignment before it moves.

Break large tasks into small chunks — verify one before starting the next. Far cheaper than running 20 steps then rolling back. Unsure about direction? Have the agent build a minimal working version first. Verify, then expand.

Different products, different mechanisms. But you provide intent, Agent orchestrates context, LLM reasons — **the triangular relationship stays the same.**

## Three Things to Watch in Every Chapter

- **Context flow:** Intent enters system + messages → LLM reasons → tool_calls → Agent executes → results appended back to messages → loop. This chapter showed the complete cycle.
- **Risk:** Vague intent, LLM guesses. Excessive permissions, Agent runs wild. LLM hallucinates, parameters go wrong — blur the boundaries between the three roles and problems are inevitable.
- **Auditability:** Every HTTP request body can be exported and replayed. Tool call logs are fully traceable. When things go wrong, trace back from the request body.
