# System Instructions

> **Context View**: System instructions are the "constitution" injected into every API request—setting the agent's identity, rules, and goals. They are the first and highest-priority context the LLM receives.

## How It Works

Every interaction between an agent and an LLM doesn't start from a blank slate. Before your own prompt is even considered, a special piece of context has already been injected into the request. This is the system instruction.

Its physical form in an API request is a `system` field:

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are an AI programming assistant named Sisyphus-Junior. Your goal is to help users with coding tasks. You only write or modify code and never answer questions unrelated to programming. You follow the Google TypeScript style guide.",
  "messages": [
    { "role": "user", "content": "Help me write a Fibonacci function" }
  ]
}
```

See that `system` field? It acts like a note printed on every single envelope, ensuring the mail carrier (the LLM) understands its identity and mission before even reading the letter (`messages`). No matter how many turns the conversation takes, this instruction remains present in every request, consistently constraining the LLM's behavior.

## What It Contains

System instructions typically include:

- **Identity**: Who are you? (e.g., "You are a senior frontend engineer.")
- **Capabilities**: What can you do? (e.g., "You can read and write files, execute terminal commands, and search the codebase.")
- **Rules**: What must you adhere to? (e.g., "All code must include JSDoc comments," "Do not modify the `package.json` file.")
- **Goal**: What is your ultimate objective? (e.g., "To help the user build a fully functional web application.")
- **Output Format**: How should you respond? (e.g., "Present code changes in a diff format," "Explain your decision-making process in bullet points.")

Together, these elements form a behavioral framework that "calibrates" a general-purpose LLM into a domain-specific agent.

## Who Writes It?

System instructions come from two sources:

1.  **The Agent's Developers**: They write the bulk of the base instructions, defining the agent's core capabilities and behavioral patterns. This is the part you cannot change.
2.  **You (The User)**: Most agentic tools provide an entry point for custom instructions, such as a `CLAUDE.md` file, an `.aiscript`, or a custom instructions field in the settings.

## Key Insight: User Customization is the Strongest Lever

User-defined system instructions are the single **most powerful lever** a non-developer has to influence an agent's behavior.

You don't need to learn to code or understand the agent's internal implementation. You just need to write your rules and expectations in plain language to globally alter the agent's behavior.

Want it to follow your team's unique coding style? Put it in the system instructions.
Want it to avoid touching a sensitive module? Put it in the system instructions.
Want it to run a specific check before every commit? Put it in the system instructions.

These user-level instructions are typically appended to the agent's base instructions or, using specific syntax, can override default behaviors. The half-hour you spend polishing a few dozen lines of instructions can be more effective than days spent trying to work around the agent's default behavior.

## Prompts are Maintainable Assets

Don't treat your system instructions as a one-off note. They are a **living document, an asset that needs to be maintained just like code**.

-   **Version it**: Use Git to manage your instruction files and track every change.
-   **Review it**: Have colleagues review your instructions just as they would review code.
-   **Iterate on it**: Continuously refine and add new rules based on the agent's performance.

A well-crafted set of system instructions is a part of your project's institutional knowledge.

## Cross-Cutting Concerns

- **Context Flow**: System instructions are the "static" part of the context, predefined by developers and users. They remain largely unchanged throughout a session, providing a stable behavioral baseline for all subsequent "dynamic" context (user inputs, tool outputs, etc.).
- **Risk Alert**: Conflicting instructions (e.g., a contradiction between the agent's base instructions and your custom ones) can lead to chaotic and unpredictable LLM behavior. When an agent acts strangely, checking for instruction conflicts is an effective troubleshooting step.
- **Auditability**: System instructions are fully legible. You can review the agent's default instructions and your own customizations to understand exactly what is driving its behavior. This is the starting point for auditing and debugging agent actions.
