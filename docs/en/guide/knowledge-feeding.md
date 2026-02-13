# Knowledge Feeding: Installing Your Brain into the Agent

> **Context Perspective**: Regardless of the path used to inject knowledge, it's all about putting information into the context—the difference lies in **when, how much, and for how long**.

So far, we've discussed various carriers of context: System Instructions, Tools, MCP, Skills... each on its own. But as a user, you face a unified problem:

**I have a wealth of knowledge about my project, team standards, and personal preferences. How do I systematically make the Agent aware of it?**

This is "Knowledge Feeding." It's not a standalone feature, but a strategy that combines the various context carriers we've discussed into a system for providing domain knowledge to the Agent.

## Why a Unified Perspective is Needed

The upper limit of an Agent's capability is determined by the high-quality context it possesses. The LLM's own general knowledge is like the public internet, whereas the knowledge you feed it is your company's internal GitLab, Confluence, and Slack channels. Without the latter, it cannot perform specific tasks well.

The mechanisms introduced in previous chapters were from the Agent's perspective: "What can I eat?" Now, we switch to your perspective: "What should I feed it, and how?"

If context is like milk—nutritious when fresh, but spoils over time—then knowledge feeding is about establishing a modern dairy supply chain: delivering the right dose of fresh milk through the right pipes at the right time.

## The Three Core Paths

There are three main paths to feed your knowledge to an Agent, each corresponding to one or more mechanisms we've already covered.

| Path | Core Mechanism | Persistence | Volume | Structure | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rule Layer Injection** | `System Instructions` | Always-on | Small (KBs) | Low (Natural Lang) | Project standards, persona, safety rails |
| **Capability Layer Extension** | `Skills` | On-demand Load | Medium (10s of KBs) | Medium (Instructions) | Domain-specific workflows, best practices |
| **Data Layer Retrieval** | RAG (via Tools) | On-demand Query | Large (GBs/TBs) | High (Structured/Vector) | Docs, API specs, codebase, knowledge graphs |

Let's break them down.

### 1. Rule Layer Injection (System Instructions)

This is the most direct and fundamental form of knowledge feeding. By modifying files like `CLAUDE.md`, `copilot-settings.json`, or similar, your defined rules become part of the Agent's core identity, automatically loaded at the start of every session.

- **What it does**: Defines the Agent's code of conduct, persona, tone, and non-negotiable boundaries.
- **How to feed**: Write project specifications, coding conventions, commit message formats, etc., in natural language.
- **Example**: "All code must follow the aio-libs community standards," "Do not use `import` outside of `.py` files," "Always write tests first."

This method is suitable for injecting knowledge that is **global, high-priority, and must be adhered to at all times**. It forms the bedrock of the Agent's worldview.

### 2. Capability Layer Extension (Skills)

If the rule layer is about "setting the rules" for the Agent, the capability layer is about "hiring a tutor."

When you load a Skill (e.g., `git-master` or `frontend-ui-ux`), you are essentially dynamically injecting a large chunk of domain-specific expertise and action guidelines into the Agent's System Prompt.

- **What it does**: Teaches the Agent how to think and act in specific scenarios, such as how to perform a git rebase or how to choose the right CSS layout.
- **How to feed**: Write or install a Skill that contains best practices, decision-making flows, and common commands for that domain.
- **Example**: After loading the `mermaid-diagrams` skill, the Agent "knows" how to use Mermaid syntax to create various diagrams and can produce syntactically correct code when you ask it to "draw a flowchart."

It's suited for encapsulating systematic knowledge that is **only needed for specific task scenarios**.

### 3. Data Layer Retrieval (RAG)

The rule and capability layers handle "how-to" knowledge, but they are powerless against vast amounts of factual "what-is" information (like an entire codebase or hundreds of API documents). This requires data layer retrieval, commonly known as RAG (Retrieval-Augmented Generation).

The Agent implements RAG through built-in tools (like code search, doc query). When you ask, "What are the statuses for our payment interface?", the Agent doesn't guess. Instead, it:

1.  **Calls a tool**: Executes a code search to find the definition of the `PaymentStatus` enum.
2.  **Injects result into context**: Places the retrieved code snippet into the `messages` array.
3.  **LLM answers based on result**: The LLM sees the original code and then summarizes all the statuses to answer your question.

- **What it does**: Enables the Agent to access massive, dynamically changing structured and unstructured data on demand.
- **How to feed**: Maintain your data sources well and ensure the Agent has the right tools to retrieve them. For instance, make your code more `agent-friendly`, or provide an `llms.txt` file to point out key information locations.
- **Example**: The Agent uses the `grep` tool to search for `TODO`s in the codebase, injects the results into the context, and then generates a to-do list for you.

This is the only effective way to handle **large-scale, factual knowledge**.

## Selection Criteria: When to Use What

| If your knowledge is... | Use... | Because... |
| :--- | :--- | :--- |
| A **global rule** that must always be followed | **Rule Layer Injection** | It ensures the knowledge is enforced in every session. |
| A **domain-specific methodology** or workflow | **Capability Layer Extension** | It can be loaded when needed and unloaded after the task, preventing context pollution. |
| **Massive, specific, factual** information | **Data Layer Retrieval** | It allows the Agent to "look up" info on the fly, avoiding the need to cram data into the limited context window. |

A mature Agentic workflow is always a combination of these three paths.

## Cross-Cutting Concerns

- **Context Flow**: Consumes your project documents, internal standards, and domain expertise. Transforms them into persistent System Instructions, on-demand Skill instructions, or just-in-time retrieved data snippets, injecting them into the context window according to the chosen path.
- **Risk Alert**: Injecting too much knowledge can dilute the available context for reasoning ("attention dilution"). Too little, and the Agent will "hallucinate" answers based on its general knowledge that don't fit the project's reality. The quality, freshness, and relevance of knowledge are critical.
- **Auditability**: The source of knowledge must be traceable. When an Agent makes a decision, you should be able to clearly identify whether it was based on a specific rule, guidance from a Skill, or a particular piece of retrieved data.