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
| **Capability Layer** | Skills | On task demand, loaded as needed | system or messages (varies by tool) | Persists within session (some tools support deactivation) | Domain-specific workflows, best practices |
| **Project Layer** | Codebase + doc structure | When Agent reads files | user/assistant messages | On-demand | Project structure, README, comments, llms.txt |

![Three knowledge feeding paths: Rule Layer (always-on), Capability Layer (on-demand injection), and Project Layer (just-in-time file reads) flow into the Agent's Context Window](/illustrations/knowledge-feeding.svg)

### 1. Rule Layer: Setting the Ground Rules

Through project-level instruction files (e.g. `CLAUDE.md`, `AGENTS.md`—different tools use different filenames), the rules you write get auto-injected into the system prompt at the start of every session.

This is the most direct form of knowledge feeding:

- What language, framework, and package manager the project uses
- Code style conventions (indentation, naming, commit message format)
- Non-negotiable boundaries ("Never use npm," "Always write tests first")

The rule layer's defining trait: **globally effective, enforced on every session, present by default**. It's the foundation of the Agent's worldview.

These rules are two kinds of distilled experience: **hard-learned lessons**—every "never" traces back to a real incident; and **proven practices**—every "always" traces back to a pattern that's been validated again and again. New hires (and Agents) don't need to learn the hard way or reinvent the wheel, because those lessons and practices already remember for them.

The cost is equally clear: it permanently occupies context window space. Cram in too many rules and you leave less room for actual work.

### 2. Capability Layer: Hiring a Tutor

The rule layer tells the Agent "what to do and not do." The capability layer tells it "how to do it."

Loading a Skill—say, one specialized in git operations, or one focused on frontend design—injects an entire body of domain knowledge into the system prompt. The Agent instantly goes from "knows a bit of everything" to "expert in this domain."

The key difference: **loaded on demand.** At startup, only the name and a short description enter the context; the LLM loads the full content only when it determines the task needs it. Almost no context cost when not in use.

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

There's another layer: your technology choices are context too. Mature, well-documented stacks have abundant high-quality training samples, so Agents handle them better out of the box. Niche frameworks or tools with sparse documentation? Agents perform noticeably worse—not because they're dumb, but because they've barely seen them during training.

## On-Demand Knowledge: Treat Agents Like People

Agents, like people, can't remember everything. Hand them an encyclopedia, and they'll just skip it.

Don't stuff your entire API documentation or database schema into `AGENTS.md`. Instead, provide an index. "For the DB schema, see `docs/db-schema.md`."

The Agent will look up that schema file when it actually needs to write SQL. Let it pull knowledge, don't push it.

Your instruction file itself should follow this principle. Rather than cramming every detail into one file, make it a table of contents—pointing to detailed docs under `docs/`. What the Agent sees at startup is a map, not an encyclopedia. When it needs depth, it follows the pointers.

## The Dictionary and the Grammar

Two kinds of knowledge, two different uses.

The dictionary (`llms.txt`, API docs, schema) is for looking things up, not for memorizing. It's facts. It's static. Put it in your project, and let the Agent read it when it needs to.

The grammar (`AGENTS.md`, Skills) is for obeying, not for reading. It's rules. It's instructions. Put it in the Agent's core prompt, where it's enforced.

Putting thousands of lines of API definitions in `AGENTS.md` is like making a developer memorize a dictionary. Putting a critical rule like "never use eval" in some forgotten document is like hanging the "no drunk driving" sign in the bar's bathroom. Both are useless.

## How to Choose

| Your knowledge is... | Use... | Because... |
| :--- | :--- | :--- |
| A global rule that must always hold | **Rule Layer** | Auto-effective every session, can't be skipped |
| A domain-specific methodology or workflow | **Capability Layer** | Loaded on demand, no context cost when idle |
| Project facts (code, docs, structure) | **Project Layer** | Let the Agent read it; you just maintain the source |

A mature agentic workflow is typically a combination of all three. The rule layer sets the baseline, the capability layer fills in skills, the project layer provides facts.

But all three layers go stale.

| Layer | How it goes stale | Consequence |
| :--- | :--- | :--- |
| Rule layer | Rules contradict each other — "must have JSDoc" was silently abandoned, but it's still in the file | Agent dutifully follows obsolete rules |
| Capability layer | Skills clash with new requirements — old code style Skill fights current project conventions | Agent behavior becomes inconsistent |
| Project layer | Docs rot — README describes an outdated approach, project moved on long ago | Agent makes decisions based on wrong information |

Addition decides what to feed. Subtraction decides when to clean. The cost of not cleaning isn't "wasted space"—it's the agent making decisions based on wrong information.

## Team Knowledge Debt

One person's prompt is a habit. A team's prompt is a system.

**Rule Debt**
-   Rules are often added, but not cleaned up in time.
-   A rule added a while back and a rule from last week might contradict each other.
-   The Agent won't complain about conflicting rules. It will just pick one. The outcome is a coin flip.

**Audits**
-   Treat rule files and Skills like code. Review them. Use pull requests.
-   Hold regular meetings to go over the rules. "Is this still relevant?" If not, delete it.
-   Knowledge, like code, accumulates debt. It's easy to take on, and painful to pay back. If you don't audit, you're letting the Agent operate on a set of rules you yourself have forgotten.

## Key Takeaways

- **Context flow**: Three paths, three injection timings. The rule layer claims space at session start; the capability layer appends when a task triggers it; the project layer enters on-demand as the Agent reads files. Knowledge freshness and context cost are always in tension.
- **Risk**: Too much knowledge dilutes reasoning capacity (attention dilution). Too little, and the Agent fabricates answers based on generic knowledge that don't match your project's reality. Stale docs are worse than no docs—the Agent won't question your README.
- **Auditability**: When an Agent makes a decision, you should be able to trace it: was it based on a rule, a Skill's guidance, or a specific file it read? Untraceable knowledge sources = black box.

Next up: orchestration patterns. Knowledge feeding solves "what to feed." Orchestration solves "how to make multiple steps work together efficiently."
