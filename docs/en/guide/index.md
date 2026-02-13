# Mental Models for Agentic Programming

This guide doesn't teach you how to **build** AI agents.

It teaches you how to **use** them—to get the most out of tools like Claude Code, Cursor, and GitHub Copilot by understanding their underlying mechanics.

It's for developers. If you want to level up from treating an agent like a chatbot to treating it like a pair programmer, this is your starting point.

## The Core Thesis: It's All About Context

All the complex mechanisms of agentic programming, from tool use to multi-agent collaboration, serve one purpose:

**Putting the right information into the context at the right time.**

LLMs have no memory. What you give them is what they see. Every section of this guide dissects how context flows. Understand context, and you'll understand agents.

## Concept Map

This guide follows the flow of context, organized into three parts: The Basics, Context Carriers, and Advanced Orchestration.

### The Basics

*   [**Introduction (This Page)**](./)
*   [**Context — The First Principle**](./context.md): Why LLMs have no memory and why that changes everything.
*   [**Agent, User & LLM API**](./actors.md): The division of labor and the core loop between the three key players.

### Context Carriers

*   [**System Instructions**](./system-instructions.md): The system-level prompt injected into every API request by the agent.
*   [**Built-in Tools**](./built-in-tools.md): The agent's hard-coded capabilities, like reading and writing files.
*   [**MCP — External Capabilities**](./mcp.md): A protocol allowing users to add new tools without modifying the agent.
*   [**Slash Commands**](./commands.md): User-defined prompt templates, a shortcut for context injection.
*   [**Skills — Domain Knowledge**](./skills.md): Loadable behavior patterns that act as dynamically injected System Instructions.
*   [**Agent-Native CLI Tools**](./cli-tools.md): Command-line tools that are inherently agent-friendly.

### Advanced Orchestration

*   [**Knowledge Ingestion**](./knowledge-feeding.md): How to systematically feed your project's knowledge to an agent.
*   [**Orchestration Patterns**](./orchestration.md): The different ways an agent can work, like sequential execution or parallel branching.
*   [**Sub Agents — Context Isolation**](./sub-agents.md): Spawning isolated context environments to handle sub-tasks.
*   [**Eval / Validation / Observability**](./eval.md): How to know if the agent did the right thing and how to trace its actions.
*   [**Human-in-the-Loop**](./human-in-the-loop.md): Your role in the workflow—when to delegate, when to intervene.
*   [**Peer-to-Peer Agents**](./peer-to-peer-agents.md): The evolution from hierarchical delegation to parallel collaboration.
