# Peer-to-Peer Agents

> **Context Perspective**: Context flows bidirectionally among peer Agents—no longer one-way injection, but mutual exchange, forming a dynamic shared understanding.

The previous chapter established the human as the ultimate arbiter of context. Even in multi-Agent collaboration, that doesn't change—but the way context flows gets more complex.

<SvgIllustration name="peer-to-peer-agents.svg" interactive />

## Hierarchical vs. Peer-to-Peer

In the [Sub Agent](./sub-agents.md) world, the relationship is a clear hierarchy: the main Agent is the general, Sub Agents are the soldiers. The general gives orders, soldiers execute and report back. Context flows one way—clean and controllable.

The P2P model breaks the hierarchy. Multiple Agents collaborate as peers, with no absolute commander—only multi-perspective collision around a shared goal:

- Frontend Agent: "I need a `/users/{id}` endpoint."
- Backend Agent: "Exposing numeric IDs directly risks enumeration attacks—switch to UUIDs. And single-record queries will cause N+1 on list pages. Better to offer a batch endpoint."
- Test Agent: "Got it. I'll write two integration tests based on the new design to lock in behavior."

The key difference: Agent A's output doesn't go back to a "superior"—it goes directly into Agent B's context. B's reasoning then flows back to A. **Context is mutually exchanged and constructed among peers.**

## Why the Vast Majority of Tools Choose Hierarchy

The answer: **coordination overhead.**

A team of `N` Agents has `N × (N-1) / 2` potential communication channels. 3 Agents = 3 channels, 5 = 10, 10 = 45. Coordination cost grows quadratically (O(n²)), not linearly.

<SvgIllustration name="peer-to-peer-agents-inline-1.svg" interactive />

And in practice, the communication types go well beyond A ↔ B. Direct peer conversations, coordinator broadcasts, shared task state—just two Agents already generate this many channels. The messaging model is typically fire-and-forget: sent without waiting for ACK, no error if the receiver has already shut down. You cannot assume every message was processed.

<SvgIllustration name="peer-to-peer-agents-inline-2.svg" interactive />

The specific costs:

1. **Error cascade**: One Agent hallucinates, and the faulty conclusion pollutes the entire collaboration network through the message chain
2. **Debugging is brutal**: When the final result is wrong, pinpointing "which Agent's which decision caused it" is a classic distributed systems problem
3. **Token cost multiplies**: Each Agent is billed independently, and communication itself consumes tokens
4. **Timing races**: Each Agent has its own processing cadence; messages arrive and get processed out of sync—a classic distributed systems headache, except the actors are LLMs

The hierarchical delegation model is simple, controllable, and economical. For the vast majority of daily development tasks, it's enough.

As of now, products that truly support bidirectional messaging between Agents can be counted on one hand. Not orchestrator → worker one-way delegation, but agent A directly messaging agent B, with B able to reply and even challenge A.

Most products—including many that market themselves as "multi-agent"—are actually parallel execution (each working independently without communicating) or hierarchical delegation (superior directing subordinates). The step from "parallel execution" to "team collaboration" is much harder than it looks.

## What Tasks Are Worth Peer Collaboration

P2P is not the default choice. The default is still hierarchical or single-Agent.

Quick veto condition: **if the task can be independently decomposed into sub-tasks, each with a clear completion criterion—you don't need P2P.** Sub Agents will do.

P2P is only worth considering when ALL of the following hold:

- **The task can't be cleanly decomposed**: Sub-tasks have deep dependencies; one decision cascades into others
- **Multiple domain expertise must fuse**: e.g., "Design a registration flow balancing UX, technical feasibility, and business goals"—needs product, design, and engineering perspectives deliberating together
- **The goal is exploratory**: No single correct answer; multiple Agents brainstorming from different angles and challenging each other is more effective than a single Agent thinking linearly

The power of P2P lies in **perspective collision and collective intelligence**, not merely parallel execution.

## Bidirectional Context Flow

Let's see how context actually flows in P2P collaboration.

**── Round 1: Agent A Initiates ──**

Agent A (Frontend Expert) states a requirement:

```json
// → REQUEST (Agent A → LLM API)
{
  "system": "You are a frontend expert focused on UX and API design...",
  "messages": [
    { "role": "user", "content": "I need a user info API, preferably GET /users/{id}, returning JSON." }
  ]
}
```

```json
// ← RESPONSE (LLM API → Agent A, SSE stream)
{
  "role": "assistant",
  "content": "Proposed design: GET /users/{id}, returns { id, name, email, avatar }. Need backend to confirm field availability and performance implications."
}
```

The P2P framework captures Agent A's output and passes it to Agent B.

**── Round 2: Agent B Challenges ──**

Agent B (Backend Expert) now has Agent A's proposal in its context. Notice `messages` is longer than Round 1—because Agent A's output has been injected:

```json
// → REQUEST (Agent B → LLM API)
{
  "system": "You are a backend expert focused on performance, security, and database design...",
  "messages": [
    { "role": "user", "content": "Collaboration context: Frontend expert proposed GET /users/{id}, returning { id, name, email, avatar }. Please evaluate from a backend perspective." },
    { "role": "assistant", "content": "Received. Let me analyze this API design..." },
    { "role": "assistant", "content": "Found two issues: 1) Exposing numeric IDs risks enumeration attacks 2) Single-record queries will N+1 on list pages. Recommending UUID + batch endpoint." }
  ]
}
```

```json
// ← RESPONSE (LLM API → Agent B, SSE stream)
{
  "role": "assistant",
  "content": "Exposing numeric IDs poses a security risk (enumeration attacks). Recommendations: 1) Use UUIDs instead of auto-increment IDs; 2) Provide a batch endpoint GET /users?ids=uuid1,uuid2 to solve N+1. This requires the frontend to adjust its calling pattern."
}
```

Agent B's response is then fed back into Agent A's context by the framework, forming a closed loop. **With each exchange, the shared understanding becomes richer and more accurate.**

Reality is messier than these two clean rounds. A sends a proposal, but B is busy processing another message and doesn't see it. A doesn't know whether B hasn't received it or is still thinking, so A nudges again. B finally replies, but A is now processing something else—two Agents stuck nudging each other in circles. This isn't a bug; it's an inherent property of P2P: each Agent has its own context window and processing cadence, and timing races are unavoidable.

## This Is the Frontier

Frankly, P2P Agent collaboration is a recognized frontier, but the ecosystem is far from mature. Products that support true peer messaging are extremely few; most frameworks (like AutoGen, MetaGPT) are aimed at "people who build agents," not "people who use agentic tools."

For you, understanding how P2P works has one practical payoff: when you encounter a problem that truly needs multiple perspectives, you can **manually role-play multiple viewpoints** in your conversation with the Agent—"If you were a backend engineer, how would you evaluate this API design?"—which is effectively simulating P2P collaboration.

## Key Takeaways

- **Context flow**: From one-way (hierarchical) to two-way (peer), context is no longer a linear "inject → produce" path but a web-like exchange among peers. Every Agent's output is simultaneously input for the others.
- **Risk**: Coordination overhead grows quadratically (O(n²)). One Agent's hallucination can cascade through the message chain to other Agents, causing collective deviation. Root cause analysis in complex interaction histories is extremely difficult—a classic distributed systems pain point.
- **Auditability**: All messages between Agents must be traceable and replayable—but full visibility means flooding the coordinator's context window with all inter-agent communication, which is too expensive. Most implementations compromise: pass summaries, not full text.

---

This is the final concept chapter of the tutorial.

Back to [The First Principle](./context.md): **the quality of context determines the quality of output.** From the first chapter to this one, we've seen context evolve from static rules (System Instructions) to dynamic tool calls, from a single Agent's linear accumulation to Sub Agent isolation and summarization, to P2P's web-like exchange. The carriers change, the flow patterns change, but this principle never does.

Once you understand how context flows, you understand how Agents work. The rest is just [putting it into practice](./in-practice.md).

