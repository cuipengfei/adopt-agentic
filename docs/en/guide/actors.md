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

Be specific—tell the Agent what "done" looks like:

- Which test command to run (`bun test`, `pytest`)
- Which lint check to run (`eslint .`, `tsc --noEmit`)
- What file states to verify

The clearer the criteria, the stronger the Agent's ability to self-verify.

A common trap: the Agent announces "Done!" but tests haven't been run, lint hasn't passed, or the feature hasn't been implemented. This is **false completion**—the most common mode of losing control. The fix: make verification a mandatory step—"After changes, you must run `bun test`; all tests passing is the definition of done." Let external signals (exit codes) define completion, not the Agent's self-assessment.

#### Recognizing Infinite Loops

The Agent keeps trying the same approach but keeps failing—the same error shows up three or four times in the conversation.

When you see this pattern, intervene directly. Give a new direction ("Stop trying this approach, switch to X"), or restart the session. Some Agents can self-detect and report "I'm stuck"—which is better than silently banging their head against the wall.

#### When to Continue, When to Restart

Longer sessions are not always better. Context windows are finite. The longer the conversation, the more likely that early details get compressed or dropped entirely.

| Signal | Recommendation |
|---|---|
| Task is coherent, context window has room | Continue current session |
| Agent "forgets" earlier constraints | Restart, carrying over key context |
| Task topic shifts (e.g., frontend to backend) | Start a new session |
| Agent repeats the same mistake | Restart with a fresh approach |

Restarting isn't failure. It's **context subtraction**. You're cutting away noise to continue with a clean slate. A fresh session is often far more productive than a polluted one.

## Role Boundaries and Executable Definition of Done

Once the three roles are clear, the most commonly overlooked question is: **who decides when a task is done?**

A Definition of Done written in natural language is usually a trap. "Tests pass," "code is clean," "feature works" — the agent can read these, but it can't reliably produce the same set of verification actions every time, and your own judgment tends to drift with your subjective state. A useful DoD is an executable signal: run a command, check the exit code; run a grep, check for matches; kick off a build, see whether it errors. Commands can be run directly by the agent, and the result reduces how much weight rides on in-the-moment subjective judgment. This is the core logic of Harness Engineering — the engineering wrapper built around an LLM — which makes verification something more than the LLM's own self-assessment, turning "done" from a description into a machine-verifiable assertion.

Executable signals also draw role boundaries more precisely.

| Role | Executable signal examples | When human review is still needed |
| ----- | -------------------------- | --------------------------------- |
| You | Define `<test-command> && <type-check-command>` as DoD | Business judgments that signals can't cover |
| Agent | Run signals automatically after each step and report results | Pause on signal failure, wait for instructions |
| LLM | Use signal results as input when reasoning about next steps | No fallback — it just continues reasoning from the available context |

Human review isn't about clicking fewer buttons. Automated checks reduce mechanical confirmation, not judgment itself. What deserves your attention is what the agent can't self-verify: does this change match the product intent? Does this refactor cross a boundary it shouldn't? That kind of judgment can't be compiled into a shell command — it stays with the human. Everything that *can* become an executable signal should become one. What can't goes into the human queue. That's how review actually saves cognitive resources, rather than turning you into a rubber stamp.

From some teams' experience, this division of labor also shapes your judgment over time. If every decision gets delegated to the agent, your sense of how the system actually behaves can quietly dull. Keeping high-value decisions in your own hands at least keeps you in continuous contact with the real state of the codebase.

## Key Takeaways

- **Context flow:** Intent enters system + messages → LLM reasons → tool_calls → Agent executes → results appended back to messages → loop. This chapter showed the complete cycle.
- **Risk:** Vague intent, LLM guesses. Excessive permissions, Agent runs wild. LLM hallucinates, parameters go wrong — blur the boundaries between the three roles and problems become much more likely.
- **Auditability:** Every HTTP request body can be exported and replayed. Tool call logs are fully traceable. When things go wrong, trace back from the request body.
