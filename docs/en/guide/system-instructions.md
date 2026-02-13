# System Instructions

> **Context View**: System instructions are the "constitution" injected into every API request—setting the agent's identity, rules, and goals. They are the first and highest-priority context the LLM receives.

## How It Works

As the previous chapter covered, the Agent orchestrates context. System instructions are the first context the Agent injects into **every** API request.

Before you type anything, they're already there.

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

- **Identity**: `"You are a senior frontend engineer"`
- **Capabilities**: `"You can read/write files, execute terminal commands, search the codebase"`
- **Rules**: `"All code must include JSDoc comments"`
- **Goal**: `"Help the user build a fully functional web application"`
- **Output Format**: `"Present code changes in diff format"`

These turn a general-purpose LLM into your specialized tool.

## Who Writes It?

System instructions come from two sources:

1.  **The Agent's Developers**: They write the bulk of the base instructions, defining the agent's core capabilities and behavioral patterns. This is the part you cannot change.
2.  **You (The User)**: Most agentic tools provide an entry point for custom instructions, such as a `CLAUDE.md` file, an `AGENTS.md`, or a custom instructions field in the settings.

## Key Insight: User Customization is the Strongest Lever

User-defined system instructions are the **strongest lever** you have to influence an agent's behavior.

You don't need to modify the agent's core code or understand its internals. Write your rules and expectations in plain language, and you globally alter the agent's behavior.

Want it to follow your team's unique coding style? Put it in the system instructions.
Want it to avoid touching a sensitive module? Put it in the system instructions.
Want it to run a specific check before every commit? Put it in the system instructions.

These user-level instructions are typically appended to the agent's base instructions or, using specific syntax, can override default behaviors. The half-hour you spend polishing a few dozen lines of instructions can be more effective than days spent working around the agent's defaults.

## Prompts are Maintainable Assets

Don't treat your system instructions as a one-off note. They are a **living document, an asset that needs to be maintained just like code**.

Some call project-level instruction files "organizational scar tissue"—every prohibition traces back to a real incident. But instruction files aren't only scars. The proven patterns that survived repeated validation are in there too. **Scars tell the Agent what not to do; crystals tell it how things should be done.** Together, they form the team's complete institutional wisdom.

-   **Version it**: Use Git to manage your instruction files and track every change.
-   **Review it**: Have colleagues review your instructions just as they would review code.
-   **Iterate on it**: Continuously refine and add new rules based on the agent's performance.

A well-crafted set of system instructions is a part of your project's institutional knowledge.

## Three Things to Watch in Every Chapter

- **Context flow**: System instructions are the "static layer" of context — present unchanged in every request, providing a stable behavioral baseline for all dynamic context that follows (user inputs, tool results).
- **Risk**: When base instructions and your custom instructions conflict, LLM behavior becomes unpredictable. Agent acting strange? Check for instruction conflicts first.
- **Auditability**: System instructions are fully readable — open the agent's defaults and your customizations, and you know exactly what's driving its behavior.

Next chapter: tools — how tool definitions and return values enter the same context loop.
