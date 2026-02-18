# Sub Agents — Context Isolation

> **Context Perspective**: A Sub Agent creates an isolated context to tackle a specific sub-task, preventing contamination of the main context.

The previous chapter covered orchestration patterns—how to organize steps. This chapter looks at the execution unit: when the main Agent needs a clean environment for a sub-task, it spawns a Sub Agent.

![Sub Agents: context isolation through spawning — main Agent delegates with a handoff note, Sub Agent works in a clean room, returns summary back to main context](/illustrations/sub-agents.svg)

## The Problem: Context Gets Dirty

Remember "context pollution" from [The First Principle](./context.md)?

The longer a conversation goes, the longer the `messages` array gets. Early explorations, rejected solutions, irrelevant tool outputs… all piling up. When you ask the Agent to perform a precise sub-task in this noise—say, "write an integration test based on the latest API schema"—the LLM’s attention gets diluted. It might reference outdated code or follow a deprecated convention.

You need a clean room.

## Spawning a Sub Agent

A Sub Agent is that clean room.

The main Agent can spawn one or more Sub Agents. Each Sub Agent’s `messages` history **starts from zero**—it can’t see what the main Agent discussed with you. But "clean" doesn’t mean "blank": Sub Agents typically inherit the main Agent’s System Instructions. The project standards, coding conventions, and safety rails you wrote in CLAUDE.md—the Sub Agent follows those too.

What’s isolated is the conversation history, not the project rules.

```mermaid
flowchart TD
    A["Main Agent"] -->|Spawn| B["Sub Agent"]
    C["System Instructions
    project standards / coding conventions"] -->|"✅ Inherited"| B
    D["Conversation history
    messages array"] -.->|"❌ Isolated"| B
```

One more thing that’s easy to miss: **the Sub Agent’s initial prompt is constructed by the main Agent, not written by you directly.** You give the main Agent a big task. The main Agent analyzes it, decides "this sub-task needs isolated handling," and constructs an initial prompt for the Sub Agent. You influence the Sub Agent’s quality indirectly through clear instructions to the main Agent—the more precise your input, the better the prompt it constructs.

## The Handoff Note

The most common mistake when delegating to a Sub Agent is dumping the entire chat history.

Write a handoff note instead. It needs just three things:

1.  **Goal:** Be specific. "Fix the login bug in the auth module."
2.  **Constraints:** State the boundaries. "Do not touch the DB schema. Do not add new dependencies."
3.  **Key Context:** Provide only what's necessary. "Relevant files are A and B. Error logs are in C."

Dumping context is lazy. The Sub Agent will get lost in the noise.

## How It Works

The main Agent delegating to a Sub Agent boils down to three steps:

```typescript
// Main Agent’s orchestration logic (local scheduling, not an LLM API call)
function mainWorkflow() {
  // ... The main Agent has had many rounds with the user, context is long ...

  const taskDescription = `
    You are a QA Engineer.
    Here is the API schema file:
    ${await readFile(‘src/api/v2/schema.json’)}

    Write an integration test for the ‘createUser’ endpoint.
    - Use the Vitest framework.
    - Cover both 201 Created and 400 Bad Request.
    - Write to ‘tests/integration/createUser.test.ts’.
  `;

  // 1. Create Sub Agent with a clear, self-contained task description
  const subAgent = createSubAgent(taskDescription);

  // 2. Sub Agent executes independently in isolated context (invisible to main Agent)
  const result = await subAgent.run();

  // 3. Inject result summary into main Agent’s context
  appendToContext(result.summary);

  // ... Main Agent continues based on the summary ...
}
```

**── Inside the Sub Agent ──**

The Sub Agent’s `messages` start from zero, but its system prompt inherits the project’s System Instructions:

**Round 1: Receiving the task**

```json
// → REQUEST (Sub Agent → LLM API)
{
  "system": "You are a code assistant.\n\n[Project System Instructions]\n- TypeScript strict mode\n- Tests use Vitest\n- No any types\n...",
  "messages": [
    { "role": "user", "content": "You are a QA Engineer. Here is the API schema: {...}\nWrite an integration test for createUser..." }
  ]
}
```

Notice `messages` has exactly one entry—clean, focused, no baggage from the main Agent’s history.

**Round 2: Context grows after tool calls**

The Sub Agent reads the schema, writes a test file, runs the test, sees a failure, and corrects:

```json
// → REQUEST (Sub Agent → LLM API, Round 2)
{
  "system": "(same as above, unchanged)",
  "messages": [
    { "role": "user", "content": "You are a QA Engineer..." },
    { "role": "assistant", "content": "Let me read the schema first...", "tool_calls": [{ "name": "read_file", "arguments": {"path": "src/api/v2/schema.json"} }] },
    { "role": "tool", "content": "{ \"endpoints\": { \"createUser\": { ... } } }" },
    { "role": "assistant", "content": "Schema loaded. Writing the test...", "tool_calls": [{ "name": "write_file", "arguments": {"path": "tests/integration/createUser.test.ts", "content": "..."} }] },
    { "role": "tool", "content": "File written." },
    { "role": "assistant", "content": "Running the test to verify...", "tool_calls": [{ "name": "bash", "arguments": {"command": "vitest run createUser"} }] },
    { "role": "tool", "content": "FAIL: expected 201 but got 500..." },
    { "role": "assistant", "content": "Test failed with 500. Checking the endpoint implementation—missing DB connection config. Fixing the test mock..." }
  ]
}
```

The Sub Agent might go through a dozen rounds of tool calls internally—reading specs, writing code, running tests, fixing bugs. **All of this happens in the isolated context. The main Agent can’t see it and isn’t disturbed by it.**

**The Final Return**

When the Sub Agent finishes, it returns a **summary** to the main Agent—not dozens of raw messages, but a compressed result. Think of it like `git stash`: stash your current complex context, do an atomic task on a clean branch, then switch back with the output.

What the main Agent receives is just: "Tests created, covering 201 and 400, file at `tests/integration/createUser.test.ts`." Whatever struggles the Sub Agent went through in between—the main Agent doesn’t need to know.

## Connecting Back to the First Principle

A Sub Agent’s performance depends on two things:

1. **The quality of System Instructions**: The project rules you wrote in CLAUDE.md—the Sub Agent consumes those too. Good rules mean the Sub Agent’s behavior aligns with project standards. This is the [knowledge feeding](./knowledge-feeding.md) rule layer at work inside Sub Agents.

2. **The quality of the initial prompt the main Agent constructs**: This loops back to [The First Principle](./context.md)—context quality determines output quality. A good initial prompt must be:
   - **Self-contained**: Not reliant on hidden information from the parent context.
   - **Complete**: Including all necessary background materials (code snippets, file paths, clear objectives).
   - **Focused**: Only information relevant to the sub-task, no noise.

What you can do: give the main Agent clear instructions and sufficient background. The better the raw material the main Agent has, the better the prompt it constructs for the Sub Agent.

## Three Things to Watch in Every Chapter

- **Context flow**: The main Agent extracts information from its own context to construct the initial prompt → Sub Agent executes independently in isolated context → returns a summary that gets injected back into the main Agent’s context. Runtime isolation and full logging coexist—they don’t conflict.
- **Risk**: Isolation is a double-edged sword. If the main Agent omits a key constraint when constructing the prompt, the Sub Agent works without critical information and may produce non-compliant code. Over-splitting also has costs—each Sub Agent needs to rebuild context from scratch, and coordination overhead accumulates.
- **Auditability**: Each Sub Agent’s full session log is saved independently and can be traced. When a summary looks wrong, you can drill down into the Sub Agent’s complete context to investigate. A summary is compression, not truth—the next chapter covers how to verify.

Next up: verification and observability. Is the summary a Sub Agent returned actually reliable? Every output from an Agent needs a verification mechanism as a safety net.
