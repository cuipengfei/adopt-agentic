# Sub Agents — Context Isolation

> **Context Perspective**: A Sub Agent creates an isolated, fresh context to solve a specific problem, preventing contamination of the main context.

## The Problem: When Context Gets Too "Dirty"

Remember "context pollution" from [The First Principle](./context.md)?

The longer an agent conversation goes on, the longer the `messages` array gets. It becomes cluttered with early explorations, rejected solutions, and irrelevant tool outputs... all of which are noise.

When you ask the agent to perform a complex, precise sub-task in this "dirty" context, like "write a unit test based on the latest API schema," the risk of failure is high. The LLM's attention gets diluted by irrelevant information. It might reference a long-outdated piece of code or follow a deprecated convention.

You need a clean room.

## The Solution: Spawn a Sub Agent

A Sub Agent is a temporary, clean room.

A Parent Agent can spawn one or more Sub Agents. Each Sub Agent has its own **completely independent context**. It can't see the Parent Agent's message history; it only receives an initial set of instructions given by the Parent Agent when it was created.

Think of it like an expert called in for a short meeting. You give them the briefing materials (the initial instructions), they go into the conference room to work independently, and finally emerge with the meeting minutes (the result summary). They don't need to know what you discussed with others all morning.

## How It Works

The process of a Parent Agent delegating a task to a Sub Agent can be viewed as a function call:

```typescript
// Parent Agent's workflow
function mainWorkflow() {
  // ... The Parent Agent has had many rounds of conversation with the user, context is long ...

  const taskDescription = `
    You are a QA Engineer.
    Here is the API schema file:
    ${await readFile('src/api/v2/schema.json')}

    You need to write an integration test for the 'createUser' endpoint.
    - The test must use the Vitest framework.
    - Cover both the success case (201 Created) and the invalid input case (400 Bad Request).
    - Write the test file to 'tests/integration/createUser.test.ts'.
  `;

  // 1. Create a Sub Agent, giving it a clear, self-contained task description
  const subAgentResult = createSubAgent(taskDescription);

  // 3. After the Sub Agent finishes, inject the result summary into the Parent Agent's context
  const summary = `
    Sub-task completed: An integration test for 'createUser' has been created.
    File location: 'tests/integration/createUser.test.ts'
    The test covers both success and failure scenarios.
  `;
  appendToContext(summary);

  // ... The Parent Agent continues its next steps based on the sub-task's result ...
}
```

**── Inside the Sub Agent ──**

The Sub Agent's context starts **from scratch**. Its `messages` array only contains the `taskDescription` provided by the Parent Agent.

1.  **Request**: The Sub Agent's first request has a clean and focused `messages` array.
    ```json
    // → REQUEST (Sub Agent → LLM API)
    {
      "system": "You are a code assistant.",
      "messages": [
        { "role": "user", "content": "You are a QA Engineer..." }
      ]
    }
    ```

2.  **Execution**: The Sub Agent might go through multiple rounds of tool calls internally (reading specs, writing files, running tests), but this all happens within its **isolated context**. The Parent Agent is neither aware of nor disturbed by this process.

3.  **Return**: Once the task is complete, the Sub Agent returns a **summary** of its work to the Parent Agent. Note, it returns a summary, not its entire internal message history which could be dozens or hundreds of messages long.

This process is like `git stash`: you stash your current complex context, switch to a clean branch to perform an atomic task, and then switch back with the output.

## Connecting Back to the First Principle

A Sub Agent's performance is entirely dependent on how good the initial instructions from the Parent Agent are.

This brings us back to [The First Principle](./context.md): **the quality of the context determines the quality of the output**. The instructions for a Sub Agent must be:
- **Self-contained**: Not reliant on any hidden information from the parent context.
- **Complete**: Including all necessary background materials (like code snippets, file paths, and clear objectives).
- **Focused**: Containing only information relevant to the sub-task, with no added noise.

Poor initial instructions will only spawn an equally confused Sub Agent.

## Cross-cutting Concerns

- **Context Flow**: It consumes a slice of information from the Parent Agent's context (to build the initial prompt) and produces a compressed summary that is injected back into the Parent Agent's context.
- **Risk Advisory**: Isolation is a double-edged sword. If the initial instructions miss a key constraint (like project-wide coding standards), the Sub Agent will complete its task in "ignorance," producing non-compliant code. Over-splitting tasks can also lead to high coordination overhead.
- **Auditability**: The full session log of a Sub Agent should be saved independently for traceability. If the summary received by the Parent Agent is problematic, one can drill down into the Sub Agent's complete context to investigate the root cause.
