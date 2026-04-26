# System Instructions

> **Context View**: System instructions are the "behavioral baseline" injected into every API request—setting the agent's identity, rules, and goals. They are the first and highest-priority context the LLM receives.

## How It Works

As the previous chapter covered, the Agent orchestrates context. System instructions are the first context the Agent injects into **every** API request.

Before you type anything, they're already there.

<SvgIllustration name="system-instructions.svg" interactive />

**── Round 1 ──**

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are an AI programming assistant. Follow Google TypeScript style guide. Only write or modify code, never answer non-programming questions.",
  "messages": [{ "role": "user", "content": "Help me write a Fibonacci function" }]
}
```

```json
// <- RESPONSE (LLM API -> agent, SSE stream)
{
  "role": "assistant",
  "content": "function fibonacci(n: number): number { ... }"
}
```

**── Round 2 ──**

```json
// -> REQUEST (agent -> LLM API)
{
  "system": "You are an AI programming assistant. Follow Google TypeScript style guide. Only write or modify code, never answer non-programming questions.",
  "messages": [
    { "role": "user", "content": "Help me write a Fibonacci function" },
    { "role": "assistant", "content": "function fibonacci(n: number)..." },
    { "role": "user", "content": "Add JSDoc comments and input validation" }
  ]
}
```

`messages` grew, but `system` is **unchanged**. Fifty rounds in, it's still identical. System instructions aren't part of the conversation — they're the conversation's **rules**.

## What It Contains

- **Identity**: What role the LLM plays
- **Capabilities**: What operations the LLM can perform
- **Rules**: Constraints and standards it must follow
- **Goal**: What it's working toward
- **Output Format**: How results should be presented

These turn a general-purpose LLM into your specialized tool.

## Who Writes It?

System instructions come from three sources:

1.  **The Agent's Developers**: They write the bulk of the base instructions, defining the agent's core capabilities and behavioral patterns. You mostly cannot change this part.
2.  **You (The User)**: Most agentic tools provide an entry point for custom instructions, such as a `CLAUDE.md` file, an `AGENTS.md`, or a configuration option within the tool.
3.  **The Agent Itself, During a Conversation**: The agent and LLM can also become authors. This typically happens in two scenarios:
    -   The user gives a direct order: "Add this convention to our rules file."
    -   The system instructions authorize the agent to update itself under certain conditions: "If you identify a new coding convention, append it to the instruction file."
    
    This transforms system instructions from a static configuration into a living document that evolves with the project.

## User Customization is Your Most Effective Handle

User-defined system instructions are the **most effective handle** you have to influence an agent's behavior.

You don't need to modify the agent's core code or understand its internals. Write your rules and expectations in plain language, and you globally alter the agent's behavior.

<SvgIllustration name="system-instructions-inline-1.svg" interactive />

Want it to follow your team's unique coding style? Put it in the system instructions.
Want it to avoid touching a sensitive module? Put it in the system instructions.
Want it to run a specific check before every commit? Put it in the system instructions.

For example, your instruction file might look like this:

```markdown
## Code Style
- All functions must have JSDoc comments
- Variables use camelCase, constants use UPPER_SNAKE_CASE

## Safety Boundaries
- Do not read or write .env and credentials/ directories

## Workflow
- After modifying code, you must run tests. All passing = done.
```

These user-level instructions are typically appended to the agent's base instructions or, using specific syntax, can override default behaviors. A well-crafted set of instructions offers an exceptional return on investment—far more effective than spending days working around the agent's defaults.

Your project's existing engineering constraints—`tsconfig strict`, lint rules, pre-commit hooks—matter for both humans and Agents, just in different ways. For humans, these checks guard your baseline. Agents generate at higher volume, so every line passes through the same gates—the effect is even more pronounced. Rules you encode once benefit every line of code it produces.

## Two Approaches to Writing Good Instructions

Instructions aren't for "controlling" the Agent. They're for helping it join your team.

### Approach 1: Show the Path, Don't Fence the Pitfalls

Don't tell the Agent "don't delete files." Like humans, LLMs focus on the prohibited action when they see a negative constraint.

- ❌ "Do not use the delete_file tool unless requested."
- ✅ "Only use the delete_file tool when the user explicitly requests 'delete'."
- ✅✅ Write it as a check: "Before executing delete_file, verify the user's request contains the keyword 'delete'; otherwise, reject."

Show it the path, don't fence off every pitfall. That's positive invariants.

### Approach 2: Onboard It, Don't Lint It

`AGENTS.md` only has code styles ("use tabs, not spaces")? You're treating it like a linter. Treat it like a new hire. Don't just give it rules; tell it **"how we do things here."**

When fixing a bug, is the flow "reproduce → test → commit" or "check logs → guess blindly"? Write it down. Do you want a submissive executor or a senior engineer who challenges bad decisions? Say so: "When you think my request will break the architecture, refuse me and propose an alternative."

Instructions are a protocol for aligning expectations.

## Instructions are Maintainable Assets

Don't treat your system instructions as a one-off note. They are a **living document, an asset that needs to be maintained just like code**.

Some describe project-level instruction files as an "institutional lessons log"—every rule traces back to a real incident. But instruction files aren't just postmortems. Proven patterns that survived repeated validation belong there too. **Lessons learned tell the Agent what paths fail; proven practices tell it how the team prefers to work.** Together, they form the team's institutional wisdom.

<SvgIllustration name="system-instructions-inline-2.svg" interactive />

> "Show the path, don't fence the pitfalls" is about **how you write instructions**—using positive descriptions instead of negations. "Lessons learned" is about **where instruction content comes from**—recording real mistakes the team has made and crystallizing experience into rules. These don't conflict: the content comes from lessons learned, the writing style stays positive.

-   **Version it**: Use Git to manage your instruction files and track every change.
-   **Review it**: Have colleagues review your instructions just as they would review code.
-   **Iterate on it**: Continuously refine and add new rules based on the agent's performance.

A well-crafted set of system instructions is a part of your project's institutional knowledge.

### Team-Level Instruction Governance

One person maintaining an instruction file? Just iterate. A team maintaining the same file? That requires governance.

**Instruction files belong in Git.** Every change gets a commit record. Later on, when you wonder "who added this rule and why"—`git blame` tells you. Instruction files outside version control are untraceable when something goes wrong.

**Changes need review.** Modifying one line of instructions can alter the Agent's global behavior. One person adds "always use tabs," another person's project is all spaces—the conflict only surfaces in the next session. Run instruction file changes through PR review, just like code. The review focus isn't syntax; it's "who does this rule affect?"

**When the project changes, instructions must follow.** Tech stack upgraded? Architecture restructured? Dependencies switched? Related rules in instruction files need synchronized updates. This isn't "we'll get to it"—it's "the next Agent session will make decisions based on stale rules."

### What Goes in Instructions / What Stays Runtime

| Characteristic | Put in System Instructions | Leave for Runtime Injection |
|----------------|--------------------------|---------------------------|
| Needed every session | ✅ | |
| Only needed for specific tasks | | ✅ (use Skills or project files) |
| Under 10 lines | ✅ | |
| Over 100 lines | | ✅ (put in files, let Agent read on demand) |
| Low change frequency (monthly/quarterly) | ✅ | |
| High change frequency (daily/weekly) | | ✅ (frequently changing system prompts invite errors) |

## Routing Failure Logs Back into System Instructions

After an agent completes a task, it leaves behind failure records — deleted the wrong file, used a deprecated API, committed without running tests. Which failures belong in system instructions, and which ones do you just fix on the spot?

Before judging, first confirm the cause of the failure: is this an instruction gap, or a problem with tools, permissions, or workflow design? Insufficient permissions, missing hooks, a workflow with no approval step — system instructions alone can rarely backstop those.

Then ask three questions:

1. **Is the root cause an instruction gap?** If the real issue is an unavailable tool, wrong permissions, or a poorly designed workflow, fix the tools and the workflow first.
2. **Will this type of failure repeat?** Across different tasks, different people, or after time passes — is the same trap still there?
3. **Can the rule generalize?** Can it be written as one instruction that holds for all similar tasks, rather than a special case for this one task?

All three answers yes: it's usually worth considering for system instructions. If the rule needs hard enforcement, it fits better in a hook, an approval step, or a validation check. Otherwise, correct it in the conversation first; don't rush to crystallize it.

| Failure Type | Goes in System Instructions | Reason |
| :--- | :--- | :--- |
| Agent deleted a config file it shouldn't have | ✅ Yes | High-risk, broadly applicable; system instructions can serve as a first-layer reminder, but irreversible operations must also be backed by a hook or approval |
| Formatting deviation in one specific task | ❌ No | One-off deviation — correct it in that conversation |
| Used a deprecated API | ✅ Yes | The whole codebase is affected; a global rule gives a unified reminder, and where it can be detected automatically, pair it with lint or tests |
| Reasoning drifted, analysis went off-track | Depends | That specific reasoning trace doesn't crystallize well; only when it can be distilled into a stable practice should it become a rule |
| Always forgot to run lint before committing | ✅ Yes | A workflow gap — fits as a global rule; also push it into pre-commit or CI, where automated blocking is more reliable |

One more operational principle: rules that go into system instructions should be tight. A good rule is short, executable, and reusable across different tasks. Every rule consumes the context window — pile in too many, and you crowd out the information the current task actually needs; the more rules, the easier it is for them to conflict.

It's worth writing in only when a failure log can be distilled into one accurate behavioral instruction. If all you can say is "something went wrong last time," leave it in the failure log, an issue, or a postmortem until the trace is clear enough and the pattern is stable enough to crystallize.

This is the boundary between system instructions and in-session correction: system instructions handle "how it should be done every time from now on"; in-session correction handles "how to fix this one task right now." The former mainly addresses predictable, repeatable systemic risks; one-off, task-specific deviations are usually corrected in the conversation first. Force things in that don't belong, and the instruction file bloats — rules pile up and become harder to maintain.

## Key Takeaways

- **Context flow**: System instructions are the "static layer" of context — present unchanged in every request, providing a stable behavioral baseline for all dynamic context that follows (user inputs, tool results).
- **Risk**: When base instructions and your custom instructions conflict, LLM behavior becomes unpredictable. Agent acting strange? Check for instruction conflicts first.
- **Auditability**: System instructions are fully readable — open the agent's defaults and your customizations, and you know exactly what's driving its behavior.

Next chapter: tools — how tool definitions and return values enter the same context loop.

