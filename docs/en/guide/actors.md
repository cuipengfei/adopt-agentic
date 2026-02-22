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

<SvgIllustration name="actors.svg" interactive />

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

For a more complete multi-round interaction sequence diagram, see the [Context](/en/guide/context#managing-context) chapter. The focus here isn't on how the request inflates, but on **what each of the three parties did**—the user sends intent, the Agent orchestrates and executes, and the LLM reasons and requests tools.

## API Protocols

Three mainstream formats:

- **Messages API** (Anthropic)
- **Chat Completions** (OpenAI)
- **Responses API** (OpenAI)

All HTTP, same core: send context, receive reasoning. Agent shields you from differences.

Understanding the communication format leads to a natural question: how does this way of working differ from a normal chat?

## Why Agentic, Not Chat

Chat: You speak — LLM speaks — You speak — LLM speaks.

Agentic: **Receive → Reason → Act → Observe → Reason again**.

Key difference: **Tools**. Chat just exchanges text. Agentic means LLM calls tools, modifies files, runs commands—then continues reasoning based on results.

That's why it's called "agent"—it has agency, not just response.

## From Roles to Practice: Working with Your Agent

With the three roles clarified, next comes practical guidance based on these role relationships—how to assign tasks, and how to let the agent run long autonomous tasks without losing control.

### How to Task an Agent

Vague vs precise:

> ❌ `"Optimize this module"`
> Agent modifies 5 files, 3 of which shouldn't have been touched.

> ✅ `"Extract login to src/login.js, keep auth.js export signatures unchanged"`
> One clean cut.

### The readback protocol

It’s the air traffic control rule: tower issues an instruction, the pilot reads it back, and the tower confirms. Only then does the pilot act. Agent collaboration works the same way.

For any complex task, don't let the agent act immediately.
> "Create a plan to refactor the auth module. Don't write code yet. Explain your plan step-by-step."

If the readback misses a key constraint, correcting it costs one sentence. If you wait until it has modified a pile of files, the rework cost is orders of magnitude higher.

Any task with more than trivial complexity needs a readback first.

Break large tasks into small chunks — verify one before starting the next. Far cheaper than running 20 steps then rolling back. Unsure about direction? Have the agent build a minimal working version first. Verify, then expand.

Different products, different mechanisms. But you provide intent, Agent orchestrates context, LLM reasons — **the triangular relationship stays the same.**

### Controlling Long-Running Loops

You can watch short tasks. But for long tasks—spanning extended periods with many tool calls—you can't, and you shouldn't have to.

Hands-off doesn't mean uncontrolled. A long-running agent loop needs to know three things: how far it's come, when to stop, and when to start over.

#### Checkpoints

The worst part of a long task is crashing halfway and starting from scratch.

A checkpoint saves your progress. Good agents automatically save state at key points, like committing after file modifications or logging progress on a subtask. You can also ask for it: "Commit after completing each module."

Checkpoints break a long task into recoverable chunks. If it crashes, you resume from the last checkpoint, not from zero.

#### Stop Conditions

Agents don't know when to stop. You have to tell them.

Clear stop conditions are external signals: all tests pass, the build succeeds, every item on a to-do list is checked off. Vague conditions like "optimize until it's good enough" can trap an agent in an infinite loop of tweaking.

In practice, give the agent a checklist or clear acceptance criteria. It checks off items as it works. When everything is checked, it stops. That's more reliable than asking it to "let me know when you're done."

#### When to Continue, When to Restart

Longer sessions are not always better. Context windows are finite. The longer the conversation, the more likely that early details get compressed or dropped entirely.

| Signal | Recommendation |
|---|---|
| Task is coherent, context window has room | Continue current session |
| Agent "forgets" earlier constraints | Restart, carrying over key context |
| Task topic shifts (e.g., frontend to backend) | Start a new session |
| Agent repeats the same mistake | Restart with a fresh approach |

Restarting isn't failure. It's **context subtraction**. You're cutting away noise to continue with a clean slate. A fresh session is often ten times more productive than a polluted one.

## Key Takeaways

- **Context flow:** Intent enters system + messages → LLM reasons → tool_calls → Agent executes → results appended back to messages → loop. This chapter showed the complete cycle.
- **Risk:** Vague intent, LLM guesses. Excessive permissions, Agent runs wild. LLM hallucinates, parameters go wrong — blur the boundaries between the three roles and problems become much more likely.
- **Auditability:** Every HTTP request body can be exported and replayed. Tool call logs are fully traceable. When things go wrong, trace back from the request body.

