# Knowledge Feeding: Installing Your Brain into the Agent

> **Context Perspective**: No matter which path you use to inject knowledge, it all ends up as information in the context—the difference is **when it enters, how much, and how long it stays**.

The previous nine chapters dissected context carriers—System Instructions, Tools, MCP, Commands, Skills, CLI Tools, Hooks & Plugins. Each solves one problem: how to get information into the context, or how to intercept and modify the context flow.

This chapter flips the perspective: **you're on the supply side. You have project knowledge, team conventions, personal preferences—how do you systematically get them in?**

## Context Is Like Milk

An Agent's capability ceiling = the quality of its context. The LLM's built-in general knowledge is the public internet; what you feed it is your company intranet. Without the latter, it can't do the actual work.

But context is like milk: nutritious when fresh, spoils over time, and you can only fit so much in the fridge. Knowledge feeding is building a supply chain—delivering the right dose of fresh milk through the right pipes at the right time.

## Three Paths

| Path | Core Mechanism | Injection Timing | Context Landing | Persistence | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rule Layer** | System Instructions | Session start, auto-loaded | system prompt | Always-on | Project standards, coding conventions, safety rails |
| **Capability Layer** | Skills | On task demand, loaded as needed | system prompt (dynamic append) | Task-scoped | Domain-specific workflows, best practices |
| **Project Layer** | Codebase + doc structure | When Agent reads files | user/assistant messages | On-demand | Project structure, README, comments, llms.txt |

### 1. Rule Layer: Setting the Ground Rules

Through files like `CLAUDE.md`, `.cursorrules`, `copilot-instructions.md`, or similar, the rules you write get auto-injected into the system prompt at the start of every session.

This is the most direct form of knowledge feeding:

- What language, framework, and package manager the project uses
- Code style conventions (indentation, naming, commit message format)
- Non-negotiable boundaries ("Never use npm," "Always write tests first")

The rule layer's defining trait: **globally effective, enforced on every session, always present**. It's the foundation of the Agent's worldview.

The cost is equally clear: it permanently occupies context window space. Cram in too many rules and you leave less room for actual work.

### 2. Capability Layer: Hiring a Tutor

The rule layer tells the Agent "what to do and not do." The capability layer tells it "how to do it."

Loading a Skill—say, one specialized in git operations, or one focused on frontend design—essentially injects an entire body of domain knowledge into the system prompt. The Agent instantly goes from "knows a bit of everything" to "expert in this domain."

The key difference: **loaded on demand, unloaded when done.** No context cost when not needed.

Writing a good Skill is like writing a domain handbook for the Agent. It contains: decision flows, best practices, common commands, common pitfalls. This knowledge is only needed in specific task scenarios—not worth stuffing into global rules, but must be fully present when called upon.

### 3. Project Layer: Making Your Project Agent-Friendly

The first two layers address "how-to" knowledge. But when an Agent works, it also needs a wealth of "what-is" factual information—what your codebase looks like, how APIs are called, how business logic flows.

You don't directly "feed" this information. The Agent "reads" it during work. What you can do is **make it easier to read**.

This is the core idea of the project layer: **your codebase itself is the Agent's largest knowledge source. Make it Agent-friendly.**

How:

- **Knowledge entry files**: `CLAUDE.md`, `AGENTS.md`, `llms.txt`—tell the Agent "start here to understand this project." Like an onboarding doc for a new hire.
- **Clear project structure**: Semantically named directories, clean module boundaries. Agents infer context from file paths—`src/utils/helpers.js` conveys almost nothing; `src/auth/jwt-validator.ts` is instantly understood.
- **Code as documentation**: Meaningful variable and function names, comments on critical logic. Agents read code the same way you do—clear code is clear to them too.
- **Keep READMEs and API docs up to date**: Stale documentation is worse than no documentation—the Agent will make decisions based on wrong information.

The project layer's defining trait: **no extra context window cost** (information only enters the context when the Agent actually reads a file), but its quality directly determines how accurately the Agent understands your project.

Think of it this way: optimizing your project structure for an Agent also optimizes it for human teammates. A codebase that an Agent can't navigate is one that new human team members probably can't either.

## How to Choose

| Your knowledge is... | Use... | Because... |
| :--- | :--- | :--- |
| A global rule that must always hold | **Rule Layer** | Auto-effective every session, can't be skipped |
| A domain-specific methodology or workflow | **Capability Layer** | Loaded on demand, no context cost when idle |
| Project facts (code, docs, structure) | **Project Layer** | Let the Agent read it; you just maintain the source |

A mature agentic workflow is always a combination of all three. The rule layer sets the baseline, the capability layer fills in skills, the project layer provides facts.

## Three Things to Watch in Every Chapter

- **Context flow**: Three paths, three injection timings. The rule layer claims space at session start; the capability layer appends when a task triggers it; the project layer enters on-demand as the Agent reads files. Knowledge freshness and context cost are always in tension.
- **Risk**: Too much knowledge dilutes reasoning capacity (attention dilution). Too little, and the Agent fabricates answers based on generic knowledge that don't match your project's reality. Stale docs are worse than no docs—the Agent won't question your README.
- **Auditability**: When an Agent makes a decision, you should be able to trace it: was it based on a rule, a Skill's guidance, or a specific file it read? Untraceable knowledge sources = black box.

Next up: orchestration patterns. Knowledge feeding solves "what to feed." Orchestration solves "how to make multiple steps work together efficiently."
