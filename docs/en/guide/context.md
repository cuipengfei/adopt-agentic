# Context — The First Principle

> **Context perspective:** Context itself is the first principle — an LLM's capabilities and limitations are entirely determined by its context.

## What Is Context

Everything you give the LLM is context.

There's no hidden knowledge base. No "it should know this." Every piece of information the LLM sees when processing your request — system prompt, conversation history, tool definitions, tool results — all of it together, that's context. Nothing more.

Let's make this concrete: look at what happens under the hood.

### Requests and Responses: The Physical Shape of Context

Communication between an agent and an LLM is HTTPS requests. Not one request that does everything — it's **multiple round trips**, each a complete request → response cycle.

**── Round 1 ──**

The agent sends a POST to the LLM API. The `messages` array in the request body is the context:

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are an experienced developer. Follow the project's coding standards...",
  "messages": [
    { "role": "user", "content": "Refactor processOrder, extract the validation logic" }
  ]
}
```

The LLM streams its response back via SSE (Server-Sent Events) — that character-by-character text appearing in your terminal is the SSE stream:

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Let me read the current implementation...",
  "tool_calls": [{ "name": "read_file",
                   "arguments": { "path": "src/processOrder.ts" } }]
}
```

Notice: the LLM didn't give a direct answer — it requested a tool call. The agent executes `read_file` **locally** and gets the file contents. This step doesn't go through the LLM API.

**── Round 2 ──**

The agent **appends** the previous LLM response and the tool result to the `messages` array, then sends the whole thing again:

```json
// → REQUEST (agent → LLM API — notice messages is longer than Round 1)
{
  "system": "You are an experienced developer. Follow the project's coding standards...",
  "messages": [
    { "role": "user",
      "content": "Refactor processOrder, extract the validation logic" },
    { "role": "assistant",
      "content": "Let me read the current implementation...",
      "tool_calls": [{ "name": "read_file", "arguments": "..." }] },
    { "role": "tool",
      "content": "export function processOrder(order) {\n  // 300 lines of tangled logic\n}" }
  ]
}
```

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Got it. The validation logic can be extracted into three functions..."
}
```

See it? Round 2's request **re-sends everything from Round 1** — the user message, the LLM's previous reply, the tool result — all of it.

**This is the essence of context accumulation: each round, the `messages` array grows, then gets re-sent in full.**

::: tip Different APIs, Same Essence
Anthropic's Messages API, OpenAI's Chat Completions API, Google's Gemini API — formats differ, but the core structure is identical: a message list, appended each turn, sent in full. Every agent tool you use is doing this under the hood.
:::

## Why It's the First Principle

Three words: **no memory**.

An LLM is not your coworker — it doesn't remember yesterday's design discussion. Even within the same conversation, it hasn't "remembered" what you said. It simply **re-reads the entire message list from scratch** each time, then reasons.

This means every agent tool — regardless of vendor — does one core job:

> **Put the right information into context at the right time.**

Your project rules file got loaded? It takes effect. Didn't get loaded? Might as well not exist.

Your codebase got indexed? The LLM can reference it. Didn't get indexed? It guesses, and guesses wrong.

A tool returned the precise database schema? The next operation matches perfectly. Returned garbage? Garbage in, garbage out.

**Most of the frustrating problems you encounter** — generated code ignoring conventions, edits to wrong files, forgotten agreements — **are context problems at their root.** The model isn't stupid. It just didn't see what it needed to see.

Every mechanism covered in subsequent chapters — System Instructions, tools, MCP, Commands, Skills — **is fundamentally answering the same set of questions: what information to put in, when to put it in, and how to get it into context.**

## The Limits of Context

More context is not always better.

### The Window Is Finite

Every LLM has a context window limit. 128K, 200K tokens — sounds like a lot, but in agentic workflows it's consumed faster than you'd expect:

- System prompt + all tool definitions eat a large chunk upfront
- Complete conversation history accumulates with every turn
- Tool results (file contents, search results, command output) easily run thousands of tokens each

What happens when the window fills up? Earlier messages get truncated or compressed. The agent **literally forgets** what you discussed at the start — you think it still knows, but those messages are no longer in the `messages` array.

### Noise Drowns Signal

Stuffing an entire codebase into context is tempting, and disastrous.

Good context management means "retrieving the right few dozen key facts," not "dumping all text in at once." The goal is to **include only what the LLM actually needs to make its decision**—just enough, not one wasted sentence. When irrelevant information dominates, the model's attention dilutes — it may ignore critical constraints, or "borrow" wrong patterns from unrelated code.

Hand an extremely smart stranger an entire filing cabinet and say "the relevant stuff is in there somewhere." They'll find some useful things, but they'll also be misled by the noise.

"Just enough" isn't a fixed bar. It depends on what you're asking the agent to do.

Understanding project structure, mapping module dependencies? Large context is fine. These tasks tolerate fuzziness; a wide view helps see the big picture. Modifying a specific function, fixing a precise bug? Feed only the files it needs. The more context you give for precision tasks, the more likely it'll "see things but use them wrong," copying the wrong variable name, missing a constraint, mixing in patterns from unrelated files.

Precision edits have a collapse zone: more information goes in, accuracy drops.

Two modes. Open up for understanding. Tighten for editing.

Context management boils down to four actions: **Write** (generate useful information) → **Select** (pick only what's relevant) → **Compress** (distill to the minimum necessary) → **Isolate** (give different tasks different context slices). Every tool and mechanism in subsequent chapters is essentially helping you do these four things.

### Context Pollution

In long conversations, context gradually gets "dirty." Early explorations, rejected approaches, wrong assumptions — no longer relevant, but still sitting in the message history, continuously influencing the LLM's judgment.

Bad context is worse than no context. With no context, the LLM knows it doesn't know and will at least say "I need more information." With stale or wrong context, it treats noise as fact and reasons confidently from false premises — you don't get "I'm not sure," you get an answer that looks plausible but is quietly wrong.

This explains a common phenomenon: the agent is fast and accurate early on, then starts making baffling mistakes later. The model didn't get dumber. The context got dirty.

A sneakier form of pollution: early wrong turns don't just take up space, they **keep exerting force**. A bad judgment in round 5 becomes an implicit premise in round 15. You say "don't do X" and it briefly course-corrects, but five rounds later it drifts back. One correction can't outweigh dozens of hints.

What do you do when it's dirty?

Roll back to the last clean checkpoint. Throttle at the source, only feed the agent the files it needs for the current step, never "just in case."

The most effective move: start a new session. But don't copy-paste chat history. Distill what's worth keeping: confirmed facts, finalized decisions, acceptance criteria. Compress that into a clean input and carry only that forward. Leave the detours in the old session.

Addition decides what the agent sees. Subtraction decides what doesn't drown it.

One more actionable principle: put your most important constraints at the beginning and end of the conversation. Models pay the least attention to the middle—researchers call this "lost-in-the-middle." Your core rules buried at message 50 will probably be ignored.

## State & Memory

Why does the agent "forget" things?

Because it has no memory at all. What it has is **session state** — the accumulated message list in the current conversation.

Your project rules file takes effect in every new conversation. Coding conventions are always respected. That's not memory. That's **persistent context** — the agent proactively reads these files at the start of each new session, re-injecting them into the `messages` array. Looks like memory. It's a fresh reload every time.

| | Session State | Persistent Context |
|---|---|---|
| Lifetime | Disappears when conversation ends | Persists across sessions |
| Storage | Message list in memory | Files on the filesystem |
| Maintained by | Agent automatically | You lead, tools assist |
| Typical contents | Chat history, tool results | Project standards, architecture decisions, coding conventions |

### Context Has a Shelf Life

Context is like milk — nutritious when fresh, spoiled when stale.

A session that's gone through hundreds of tool calls has almost certainly suffered context degradation. Early key information has been pushed to the edge of the window or truncated entirely, stale intermediate state has piled up in the middle, and later reasoning is built on a foundation of noise.

**When should you start a new conversation?** When the agent starts "forgetting" early agreements, repeating mistakes you've already corrected, or behaving erratically — the context has spoiled. Cut it off, start fresh, and let the agent begin from clean persistent context. That's far more efficient than fighting pollution in a degraded session.

### Session Handoff

Before ending a session, write key decisions, intermediate outputs, and next steps into persistent context — your project rules file, a handoff document, or anywhere the agent will read on next startup.

Pay special attention: **what's easiest to lose isn't "what changed," git tracks that, it's "why you changed it."** The reasoning behind choosing A over B, the reason a constraint exists, the trade-off behind an odd-looking design. The next session can see the diff but not the decision logic behind it.

This isn't relying on "memory." It's **explicit context transfer**: converting information worth keeping from the current session into initial context for the next one.

## What's Next: Context Carriers in Subsequent Chapters

Context is the first principle. But "how to get information into context" has many different approaches, each suited to different scenarios.

Every subsequent chapter covers a different context carrier:

| Carrier | Role in Context |
|---|---|
| System Instructions | The first context the LLM receives, always present |
| Built-in Tools | Tool definitions + return values = context |
| MCP | External capability extensions, also entering context |
| Slash Commands | On-demand context injection |
| Skills | Dynamically loaded domain knowledge |
| Agent-Native CLI Tools | External tool output becomes context directly |
| Knowledge Feeding | Turn what you know into what the agent knows |
| Orchestration Patterns | How context flows, forks, and merges across steps |
| Sub Agents | Creating fresh context (isolation) |
| Eval / Verification | Verification results = feedback context |
| Human-in-the-Loop | Humans determine context's final direction |
| Peer-to-Peer Agents | Context flows bidirectionally between peer agents |

One thread runs through it all: **how context flows.**

## Three Things to Watch in Every Chapter

- **Context flow:** This chapter's context starts with the system prompt. Every subsequent chapter adds more — different injection methods, but it all ends up in the `messages` array.
- **Risk:** Get the context boundary wrong and errors snowball — from this step to every step after it.
- **Auditability:** Good news — the complete `messages` array in each HTTP request is your log. Something went wrong? Replay from the start.

Next chapter breaks apart the three roles — you, the Agent, and the LLM — to see how context flows between them.
