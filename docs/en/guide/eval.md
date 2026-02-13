# Eval: Verification & Observability

> **Context-aware Perspective**: Verification results are themselves feedback context—telling the agent whether it did the right thing and how to course-correct.

An agent's work isn't a one-shot, black-box operation, but a series of verifiable steps. As a user, understanding verification mechanisms is key to building trust and intervening when it goes off track.

Verification isn't an isolated action but a continuous feedback loop that runs throughout an agent's lifecycle.

## The Three Layers of Verification

Imagine you're coaching a junior developer. You don't wait until the entire project is done to conduct a review; you set checkpoints at different stages. The same principle applies to agents.

### Layer 1: Tool Call Validation

This is the most fundamental check. Every time an agent calls a tool (like `read_file`, `bash`), the system performs sanity checks.

- **Input Validation**: Does the path for `read_file` exist? Is the `bash` command safe?
- **Output Validation**: Did the tool execute successfully or fail? Was the `bash` command's exit code 0? Was the file read without errors?

This layer of validation is typically handled automatically by the agent's framework or the tools themselves. The execution result—success or failure, along with any return value or error message—is packaged into a `tool`-role message and injected back into the context.

```json
// → REQUEST (Agent decides to call a tool)
{
  "role": "assistant",
  "content": "Okay, I will execute `npm install`.",
  "tool_calls": [{ "name": "bash", "arguments": { "command": "npm install" } }]
}

// (The agent executes the bash command locally)

// ← RESPONSE (The tool's execution result is injected into the next context)
{
  "role": "tool",
  "name": "bash",
  "content": "exit code: 1\nnpm: command not found"
}
```

When the LLM sees this `tool` message in the next turn, it knows that `npm install` failed because the `npm` command wasn't found. Based on this new context, it might decide to try `bun install` or ask you for help.

### Layer 2: Task-Level Validation

A successful tool call doesn't mean the task is complete. When the agent says, "I'm done," is it really?

A "refactor code" task is successful not because the `edit_file` tool call succeeded, but because the refactored code passes all unit tests.
A "deploy application" task is successful not because the `bash` command ran without errors, but because the deployed URL returns an HTTP 200 status.

This is task-level validation: **using real-world, external standards to determine if the agent has achieved the user's ultimate intent.**

A smart agent will proactively ask for verification:

> "I've moved the `isValidUser` function to `validators.js` and updated its references. To confirm everything is working correctly, which test file should I run?"

As the user, you need to provide the agent with the means for validation. The most common methods include:
- Running a test command (`npm test`)
- Executing a lint check (`eslint .`)
- Calling an API endpoint and asserting the response
- Checking the file system state (whether a file exists, if its content matches expectations)

### Layer 3: Observability

This is the highest level of "validation"—continuously monitoring the agent's "vital signs." It goes beyond a simple pass/fail for a single task and focuses on the overall health and efficiency of the system.

Observability answers questions like:
- **Resource Consumption**: How much did this task cost (token usage)? How long did it take?
- **Behavioral Patterns**: Is the agent flip-flopping between two solutions? Is it stuck in an "edit -> test fail -> revert" loop?
- **Effectiveness Assessment**: On average, how many steps does the agent need to solve a certain type of problem? What percentage of its proposed solutions do you accept?

Observability data (logs, traces, metrics) is often sent to specialized platforms (like LangSmith or LangFuse), allowing you to analyze the agent's performance from a macro perspective instead of getting lost in the details of a single conversation.

## Reliability & Error Recovery

Even the most capable agent will make mistakes. The crucial part is whether it can recover from them.

- **Rollback Strategy**: When task-level validation fails, the safest course of action is to roll back to the last known good state. For instance, if a code refactor breaks the tests, the agent should be able to undo all file modifications using `git stash` or a similar mechanism before trying again.

- **Infinite Loop Detection**: If an agent attempts the exact same failing step three times in a row, it's likely stuck in a loop. A robust agent will recognize this pattern, pause, and report: "I seem to be stuck. I've tried this three times without success. Perhaps we should try a different approach?"

- **"It said it's done, but it's not"**: This is the trickiest failure mode. The agent's final response might be "Task completed!", but task-level validation shows a failure. This usually stems from insufficient context—the LLM can't see the validation failure signal. The solution is to ensure the validation step is a mandatory part of the agent's workflow, with its result always injected back into the context.

The outcome of verification, whether success or failure, is the most critical fuel driving the agent forward—or correcting its course.

## Cross-Cutting Concerns

- **Context Flow**: Consumes=The validation criteria you provide (e.g., a test command). Produces=Pass/fail signals, error messages, and performance metrics, all of which are injected back as new context to guide the next action.
- **Risk Advisory**: Insufficient or missing validation is the root cause of runaway agent projects. A minor tool-level error, if not caught early, can be amplified in subsequent steps, leading to a catastrophic failure of the entire task.
- **Auditability**: The logs from each layer of verification form a golden audit trail. The inputs and outputs of tool calls, the success/failure records of task validation, and the trace diagrams on an observability platform collectively create a complete, traceable history of operations.
