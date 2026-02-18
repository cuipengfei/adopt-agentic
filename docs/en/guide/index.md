# How to Think About Agentic Programming

This guide doesn't teach you how to **build** AI agents.

It teaches you how to **use** them—to get the most out of your agentic programming tools by understanding their underlying mechanics.

It's for developers. If you want to level up from chatting with an agent and hoping for the best to precisely controlling its output quality, this is your starting point.

## The Core Thesis: It's All About Context

All the complex mechanisms of agentic programming, from tool use to multi-agent collaboration, serve one purpose:

**Putting the right information into the context at the right time.**

Here's a static visual showing what a "context supply chain" looks like in one task:

![Context supply chain in one task: Task Goal flows into System Instructions, Project Context, and Tool Capabilities; the Agent builds the request to the LLM API, then receives SSE Response and takes the Next Action.](/illustrations/context-supply-chain.svg)

LLMs have no memory. What you give them is what they see. Every section of this guide dissects how context flows. Every capability here—tools, protocols, orchestration—is context engineering in disguise.

The industry calls this **Context Engineering**—the evolution from "writing a good prompt" to "designing dynamic systems that manage an entire context supply chain." The broader discipline of building software with agent tools is emerging as **Agentic Engineering**—context engineering is its most essential sub-discipline, and the throughline of this guide.

Many developers start with **vibe coding**—tossing a few sentences at the agent and seeing if it works. Fine for simple tasks. But as complexity grows, the randomness shows: the same description works today but fails tomorrow, one project runs clean while another is riddled with bugs. The problem usually isn't the agent's capability—it's that the context you're feeding it hasn't been designed.

Going from vibe coding to context engineering isn't a technology upgrade. It's a shift in how you think—from "let's see if this works" to "design the context so it has to work." This guide is the map for that shift.

| | Vibe Coding | Context Engineering |
| :--- | :--- | :--- |
| Approach | Toss a few sentences at the agent | Design the context supply chain |
| Simple tasks | Works fine | Also works fine |
| Complex tasks | Random — works today, fails tomorrow | Reproducible, predictable |
| Core difference | "Let's see if this works" | "Design it so it has to work" |

The next chapter, [Context — The First Principle](./context.md), cracks this open with two rounds of HTTP requests.

## Concept Map

This guide follows the flow of context in three parts: The Basics, Context Carriers, and Integration & Beyond.

### The Basics

*   [**Context — The First Principle**](./context.md): Why LLMs have no memory and why that changes everything.
*   [**Agent, User & LLM API**](./actors.md): The division of labor and the core loop between the three key players.

### Context Carriers

*   [**System Instructions**](./system-instructions.md): The system-level prompt injected into every API request, defining the agent's identity and rules.
*   [**Built-in Tools**](./built-in-tools.md): The agent's hard-coded capabilities—reading files, running commands, searching code.
*   [**MCP — External Capabilities**](./mcp.md): Inject external tool definitions into context so the agent gains new abilities without code changes.
*   [**Slash Commands**](./commands.md): User-defined prompt templates that inject fixed context into the conversation in one keystroke.
*   [**Skills — Domain Knowledge**](./skills.md): Loadable behavior patterns—dynamically injected System Instructions at runtime.
*   [**Agent-Native CLI Tools**](./cli-tools.md): Command-line tools that output structured data instead of human-readable text—the agent's natural allies.
*   [**Hooks & Plugins**](./hooks-and-plugins.md): Intercept, modify, and log at critical points in the context flow—the most fine-grained behavior extension.

### Integration & Beyond

*   [**Knowledge Ingestion**](./knowledge-feeding.md): How to systematically feed your project's knowledge into the agent's context.
*   [**Orchestration Patterns**](./orchestration.md): Sequential execution, parallel branching, routing—the different ways an agent works.
*   [**Sub Agents — Context Isolation**](./sub-agents.md): Spawning isolated context environments for sub-tasks, with summarized results passed back.
*   [**Eval / Validation / Observability**](./eval.md): How to know if the agent did the right thing and how to trace its actions.
*   [**Human-in-the-Loop**](./human-in-the-loop.md): Your role in the workflow—when to delegate, when to intervene.
*   [**Peer-to-Peer Agents**](./peer-to-peer-agents.md): From hierarchical delegation to peer collaboration—bidirectional context flow.

### Hands-On

*   [**In Practice**](./in-practice.md): Breaking the agent-agnostic constraint—concrete tools, copyable high-payoff operations.
