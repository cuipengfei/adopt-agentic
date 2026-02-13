# Peer-to-Peer Agents

> **Context Perspective**: Context flows bidirectionally among peer agents—it's no longer a one-way injection but a mutual exchange, forming a dynamic, shared understanding.

In the world of [Sub Agents](./sub-agents.md), the relationship is a clear hierarchy: the main agent is the general, and sub-agents are the soldiers. The general gives orders, soldiers execute tasks, and then report back. This is a one-way, predictable flow of context.

The Peer-to-Peer (P2P) Agents model is entirely different. It breaks the hierarchy and introduces a more complex, and potentially more powerful, collaboration paradigm: **peer-level collaboration**.

## Mental Models: Hierarchical vs. Peer-to-Peer

Imagine a software development team:

- **Hierarchical**: This is like a traditional waterfall model team. The project manager breaks down the work and assigns tasks to the frontend, backend, and database specialists. Each person completes their part independently and reports back to the manager. This is a classic "divide and conquer" approach. The Sub Agent model works this way, excelling at tasks that can be clearly decomposed and have explicit dependencies.

- **Peer-to-Peer**: This is more like an agile development squad. A frontend expert, a backend expert, and a testing expert sit together for pair programming. There's no single leader; instead, they advance a feature through continuous dialogue, mutual challenges, and shared discoveries.
  - Frontend Expert: "I need an API endpoint that looks like this."
  - Backend Expert: "This endpoint design will have performance issues under concurrent load. How about we try a different approach..."
  - Test Expert: "Got it. Based on this new idea, I'll write a couple of integration tests to lock in the behavior upfront."

In this P2P model, there is no absolute "commander," only **multi-perspective collaboration** around a common goal.

## Why Most Tools Choose Hierarchy

If P2P collaboration sounds so powerful, why do the agentic tools we use daily (like Claude Code, Cursor, etc.) mostly rely on hierarchical or single-agent models?

The answer: **Coordination Overhead**.

1.  **Communication Complexity**: For a team of `N` agents, there are `N * (N-1) / 2` potential communication channels. Three agents mean 3 channels; five agents mean 10. The coordination cost grows exponentially.
2.  **Error Propagation**: When one agent "hallucinates" or goes off-track, its faulty conclusions can quickly pollute the entire collaborative network through the message chain, leading to collective deviation.
3.  **Debugging Difficulty**: When the final result is wrong, it's incredibly hard to pinpoint which agent's decision caused the problem. This is a classic distributed systems problem—"Whose fault is it anyway?"
4.  **Cost**: Multiple agents reasoning and communicating in parallel mean multiple parallel LLM API call costs.

The hierarchical delegation model is simple, controllable, and economical. For the vast majority of daily development tasks, it's good enough.

## What Tasks Are Worthy of Peer Collaboration?

P2P collaboration is not a silver bullet. It's only suitable for specific types of problems—**complex issues that cannot be effectively solved from a single perspective**.

A simple decision framework:

- **Can the task be clearly broken down into independent sub-tasks?**
  - **Yes** → Use the hierarchical model (Sub Agents). E.g., "Refactor modules A, B, and C independently."
  - **No** → Consider the peer model.

- **Does the task require the fusion of knowledge from multiple distinct professional domains?**
  - **Yes** → Consider the peer model. E.g., "Design a registration flow that balances user experience, technical feasibility, and business goals." You'd need a "Product Manager Agent," a "Designer Agent," and an "Engineer Agent" to deliberate.
  - **No** → Use a hierarchical or single-agent model.

- **Is the task's goal exploratory, with no single correct answer?**
  - **Yes** → Consider the peer model. E.g., "Brainstorm three potential monetization models for our product." Multiple agents brainstorming from different angles, stimulating each other, is more effective than a single agent's linear thinking.
  - **No** → Use the hierarchical model.

The power of P2P lies in the **collision of perspectives** and **collective intelligence**, not merely in parallel execution.

## This is the Frontier

Frankly, we are in the early days of the evolution of agentic workflows. P2P agent collaboration is a widely recognized frontier, but a mature ecosystem of tools and best practices has yet to form.

Currently, frameworks like `crewAI` and `AutoGen` allow developers to build multi-agent systems, but they are more for "people who build agents" rather than "people who use agentic tools."

For those of us using agents to assist in daily development, understanding the P2P mental model is valuable for:
1.  **Expanding Imagination**: Knowing the future possibilities of agent collaboration.
2.  **Recognizing Scenarios**: When faced with a complex problem that truly requires multiple perspectives, recognizing the limitations of current tools and being able to manually "role-play" as different agents in a dialogue with the main agent.

## Context Perspective: Bidirectional Context Flow

In a P2P model, the flow of context is bidirectional and web-like.

The output (`content`) of Agent A is not just a report to a "superior" but becomes an input (`messages`) into the context of Agent B and Agent C. Agent B then reasons based on this, and its output, in turn, influences Agents A and C.

**── Agent A & B Collaboration: Round 1 ──**

Agent A (Frontend Expert) initiates the conversation:

```json
// → REQUEST (Agent A → LLM API)
{
  "system": "You are a frontend expert...",
  "messages": [{ "role": "user", "content": "I need a user info API, preferably `/users/{id}`" }]
}
```
*The LLM returns Agent A's thought, which is captured by the P2P framework.*

**── Agent A & B Collaboration: Round 2 ──**

The P2P framework passes Agent A's output to Agent B (Backend Expert). Agent B's context now includes Agent A's proposal:

```json
// → REQUEST (Agent B → LLM API)
{
  "system": "You are a backend expert focused on performance and security...",
  "messages": [
    { "role": "user", "content": "The frontend expert proposed: 'I need a user info API, preferably `/users/{id}`.' Please evaluate this proposal." }
  ]
}
```

The LLM reasons based on Agent B's identity and the received information, posing a challenge:

```json
// ← RESPONSE (LLM API → Agent B)
{
  "role": "assistant",
  "content": "Exposing numeric IDs directly poses a security risk (enumeration attacks). I recommend using UUIDs. Also, fetching one user at a time will cause N+1 query issues on list pages. It's better to provide a batch endpoint like `/users?ids=...`."
}
```

This response from Agent B is then fed back into Agent A's context by the framework, creating a closed loop.

The key here is that **context is mutually exchanged and constructed among peers**, ultimately forming a shared understanding that is richer and more accurate than any single agent's initial context.

## Cross-Cutting Concerns

- **Context Flow**: Consumes the independent initial contexts of each agent; produces a shared context and collective discoveries dynamically formed through bidirectional messaging.
- **Risk Advisory**: Coordination overhead grows exponentially (`O(n²)`), making communication costs extremely high. An error or "hallucination" from one agent can be amplified through the message chain, causing cascading failures. When problems arise, root cause analysis and debugging in the complex interaction history are exceedingly difficult.
- **Auditability**: All message records between agents (requests, responses, challenges, confirmations) must be traceable and replayable. Otherwise, the entire collaboration process becomes an incomprehensible black box.
