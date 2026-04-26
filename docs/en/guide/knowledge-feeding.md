# Knowledge Feeding

> **Context Perspective**: No matter which path you use to inject knowledge, it all ends up as information in the context—the difference is **when it enters, how much, and how long it stays**.

The previous nine chapters dissected context carriers—System Instructions, Tools, MCP, Commands, Skills, CLI Tools, Hooks & Plugins. Each solves one problem: how to get information into the context, or how to intercept and modify the context flow.

This chapter flips the perspective: **you're on the supply side. You have project knowledge, team conventions, personal preferences—how do you systematically get them in?**

## Context Is Like Milk

An Agent's capability ceiling = the quality of its context. The LLM has general knowledge built in, but it doesn't know what framework your project uses, how your code is organized, or what conventions your team follows. Without that project-level knowledge, it can only give generic advice.

But context is like milk: nutritious when fresh, spoils over time, and you can only fit so much in the fridge. Knowledge feeding is building a supply chain—delivering the right dose of fresh milk through the right pipes at the right time.


<SvgIllustration name="knowledge-feeding-inline-1.svg" interactive />

## Three Paths

| Path | Core Mechanism | Injection Timing | Context Landing | Persistence | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rule Layer** | System Instructions | Session start, auto-loaded | system prompt | Always-on | Project standards, coding conventions, safety rails |
| **Capability Layer** | Skills | On task demand, loaded as needed | system or messages (varies by tool) | Persists within session (some tools support deactivation) | Domain-specific workflows, best practices |
| **Project Layer** | Codebase + doc structure | When Agent reads files | user/assistant messages | On-demand | Project structure, README, comments, llms.txt |

<SvgIllustration name="knowledge-feeding.svg" interactive />

### 1. Rule Layer: Setting the Ground Rules

Through project-level instruction files (e.g. `CLAUDE.md`, `AGENTS.md`—different tools use different filenames), the rules you write get auto-injected into the system prompt at the start of every session.

This is the most direct form of knowledge feeding:

- What language, framework, and package manager the project uses
- Code style conventions (indentation, naming, commit message format)
- Non-negotiable boundaries ("Never use npm," "Always write tests first")

The rule layer's defining trait: **globally effective, enforced on every session, present by default**. It's the foundation of the Agent's worldview.

These rules are two kinds of distilled experience: **hard-learned lessons**—every "never" traces back to a real incident; and **proven practices**—every "always" traces back to a pattern that's been validated again and again. New hires (and Agents) don't need to learn the hard way or reinvent the wheel, because those lessons and practices already remember for them.

The cost is equally clear: it permanently occupies context window space. Cram in too many rules and you leave less room for actual work.

### 2. Capability Layer: Loading Domain Knowledge On Demand

The rule layer tells the Agent "what to do and not do." The capability layer tells it "how to do it."

Loading a Skill—say, one specialized in git operations, or one focused on frontend design—injects an entire body of domain knowledge into the system prompt. The Agent instantly goes from "knows a bit of everything" to "expert in this domain."

The key difference: **loaded on demand.** At startup, only the name and a short description enter the context; the LLM loads the full content only when it determines the task needs it. Almost no context cost when not in use.

Writing a good Skill is like writing a domain handbook for the Agent. It contains: decision flows, best practices, common commands, common pitfalls. This knowledge is only needed in specific task scenarios—not worth stuffing into global rules, but must be fully present when called upon.

### 3. Project Layer: Making Your Project Agent-Friendly

The first two layers address "how-to" knowledge. But when an Agent works, it also needs a wealth of "what-is" factual information—what your codebase looks like, how APIs are called, how business logic flows.

You don't directly "feed" this information. The Agent "reads" it during work. What you can do is **make it easier to read**.

This is the core idea of the project layer: **your codebase itself is the Agent's largest knowledge source. Make it Agent-friendly.**

How:

- **Knowledge entry files**: `CLAUDE.md`, `AGENTS.md`, and `llms.txt` (supported by some frameworks and documentation sites)—tell the Agent "start here to understand this project." Like an onboarding doc for a new hire.
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

API definitions don't belong in instruction files—they're reference material, meant for the agent to look up when needed. Critical rules don't belong in some forgotten corner document—put them where the agent reads on every startup, or they might as well not exist.

## How Failure Logs Feed Back into the Next Round

Knowledge feeding isn't only about pushing documents, conventions, and rules to the Agent. There's another path: **failure information the Agent generates while working**, and how it flows back into the next request automatically.

To be precise: this happens in the conversation history, not the system prompt. Every time a tool call fails, a command errors out, or a test doesn't pass, the error output the Agent receives gets appended to subsequent requests as a tool result. The exact API shape varies: OpenAI typically appends a `role: "tool"` message; Claude typically puts a `tool_result` block inside a `user` message. The LLM reads it in the next round and decides how to adjust.

The problem: **if failure output gets pushed in unfiltered, it quickly becomes context noise.**

A complete dependency-install error log can be very long. Stuff it all into messages and every subsequent round drags it along. Old error logs crowd out context, and information actually needed for the task gets diluted.

How to control it:

| Granularity | Approach | When to use |
| :---------- | :------- | :---------- |
| **Coarse**: final status only | Pass "failed / succeeded" plus a one-line summary | Simple tool calls where the LLM doesn't need to diagnose the cause |
| **Medium**: truncated + key segments | Keep error type, first error message, top of the stack trace, plus the summary at the tail of the log | A reasonable default for most situations |
| **Fine**: full log | Pass it as-is, no truncation; for very long logs, save them to a file and put only the path and a summary into context | Exception cases: complex debugging where the LLM needs the complete picture to locate the issue |

Some agent tools' hooks mechanism lets you preprocess at the "tool return" stage: intercept raw output, filter by format, keep only the fields that matter, then push into context. That's the summarize/filter gate failure logs pass through before reaching the next round. A practical output shape can look like this: `{status, exit_code, failing_command, first_error, relevant_tail}`.

Another approach: **diff-first, not diff-only**. If a hook or orchestration layer can control input, and a previous round already passed the full content of a file, prefer a diff this round; supplement with relevant snippets when intent, interfaces, or context need to be judged. Avoid the same information appearing three times in messages.

Scope control matters just as much. Not every failure deserves to flow back. Low-risk lint warnings usually don't need to enter messages, but you should evaluate four things first: does it block execution, does it require changing the plan, does it contain new facts, does it recur. If all four answers are no, the hook can discard it or write it only to a local log. Only failures that block execution and require an LLM decision are worth spending context space on.


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

