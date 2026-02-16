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

### The readback protocol

Air traffic control rule: tower issues instruction, pilot reads it back, tower confirms, then execution. Agent collaboration works the same way.

Task is complex? Don't let it act immediately:
> "Create a plan to refactor the auth module. Do not write code yet. Explain your plan step-by-step."

Readback misses a key constraint? Correcting it now takes one sentence. Wait until it has modified 20 files? Half an hour.

Any task with complexity > 1: readback first.

Break large tasks into small chunks — verify one before starting the next. Far cheaper than running 20 steps then rolling back. Unsure about direction? Have the agent build a minimal working version first. Verify, then expand.

Different products, different mechanisms. But you provide intent, Agent orchestrates context, LLM reasons — **the triangular relationship stays the same.**

## Controlling Long-Running Loops

Short tasks? Just watch. Long tasks—tens of minutes, hundreds of tool calls—you can't watch, and you shouldn't have to.

But hands-off doesn't mean uncontrolled. A long-running Agent loop needs three things: knowing how far it's come, knowing when to stop, and knowing when to start over.

### Checkpoints

The worst thing about a long task is crashing halfway and starting from scratch.

A checkpoint is a progress save. Good Agents automatically save state at key points—committing after modifying a set of files, recording progress after completing a subtask. You can also request this explicitly: "Commit after completing each module."

Checkpoints fundamentally **break a continuous long task into recoverable segments**. Crash? Resume from the latest checkpoint instead of starting from zero.

### Stop Conditions

Agents don't know when to stop. You have to tell them.

The clearest stop conditions are external signals: all tests pass, build succeeds, every item on the TODO list checked off. Vague stop conditions—"optimize until you think it's good enough"—trap Agents in infinite loops, endlessly tweaking and never satisfied.

In practice: give the Agent a checkable TODO list or explicit acceptance criteria. It checks off items as it completes them. All checked? Stop. Far more reliable than "let me know when you're done."

### When to Continue / When to Restart

Long sessions aren't better just because they're long. Context windows are finite; the longer the conversation, the higher the probability that early information gets compressed or dropped.

| Signal | Recommendation |
|--------|---------------|
| Task is coherent, context window has room | Continue current session |
| Agent starts "forgetting" earlier constraints | Restart with key context carried over |
| Task topic shifts (frontend → backend) | Start a new session |
| Repeatedly making the same mistake | Restart with a fresh approach |

Restarting isn't failure. Restarting is **context subtraction**—cutting away accumulated noise and setting off again with clean context. Sometimes a fresh session is ten times more productive than a polluted long one.

## Three Things to Watch in Every Chapter

- **Context flow:** Intent enters system + messages → LLM reasons → tool_calls → Agent executes → results appended back to messages → loop. This chapter showed the complete cycle.
- **Risk:** Vague intent, LLM guesses. Excessive permissions, Agent runs wild. LLM hallucinates, parameters go wrong — blur the boundaries between the three roles and problems are inevitable.
- **Auditability:** Every HTTP request body can be exported and replayed. Tool call logs are fully traceable. When things go wrong, trace back from the request body.
