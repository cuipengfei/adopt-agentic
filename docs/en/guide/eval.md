# Verification & Observability

> **Context Perspective**: Verification results are themselves context—exit codes, test reports, lint output all get injected back into messages, driving the Agent’s next decision.

The previous chapter established that a Sub Agent’s summary is compression, not truth. So how do you know it got things right?

Not just Sub Agents. Every output from an Agent—every tool call, every task result—could be wrong. Verification is the safety net.

## Step-by-Step Verification: From Commands to Tasks

Verification isn’t something you do at the end. It runs throughout every step of the Agent’s work, from fine-grained to coarse.

### Layer 1: Did the command succeed?

Every time the Agent calls a tool, the system automatically checks the result.

- **What’s verified**: A single tool call (`bash`, `read_file`, `write_file`…)
- **Success signal**: Exit code 0, file read successfully, API returns 200
- **On failure**: Error message injected back into context; Agent adjusts automatically

```json
// → REQUEST (Agent decides to call a tool)
{
  "role": "assistant",
  "tool_calls": [{ "name": "bash", "arguments": { "command": "npm install" } }]
}

// ← RESPONSE (Tool result injected into next context round)
{
  "role": "tool",
  "name": "bash",
  "content": "exit code: 1\nnpm: command not found"
}
```

The LLM sees this `tool` message in the next turn, knows `npm install` failed—`npm` not found—and decides to try `bun install` instead.

This layer is fully automatic. You don’t need to be involved. But it’s the foundation of the entire verification stack: if signals from this layer don’t get properly injected into context, everything above it breaks.

### Layer 2: Is the task actually done?

A successful command ≠ a completed task.

`edit_file` succeeding doesn’t mean the refactor is correct—you need to run the tests. `bash deploy.sh` returning exit code 0 doesn’t mean the deployment worked—you need to hit the URL and check for a 200.

- **What’s verified**: The completed task’s actual intent
- **Success signal**: Real-world external standards (tests pass, build succeeds, API reachable)
- **On failure**: Failure signal injected into context; Agent enters a correction loop (the iterative pattern from the previous chapter)

The key point: **task-level pass/fail must also be injected back into context.** If the Agent runs tests but can’t see the results, it can’t judge whether the task is truly done.

```json
// Agent ran the tests; result injected into messages
{
  "role": "tool",
  "name": "bash",
  "content": "exit code: 1\nFAILED tests/auth.test.ts > should reject expired tokens\nExpected: 401, Received: 200"
}
```

The Agent sees this message, realizes the refactor broke expired token validation, and targets the fix.

As the user, your job is to **define what "done" means**:
- Which test command to run (`bun test`, `pytest`)
- Which lint check to run (`eslint .`, `tsc --noEmit`)
- What file state to verify

The clearer your definition of "done," the stronger the Agent’s self-verification capability.

### Layer 3: Is the system reliable overall?

The first two layers focus on individual tasks. Layer 3 steps back to look at the big picture.

After using an Agent for a while, you start asking:
- How many tokens did that task burn? Is it too expensive?
- On average, how many tool-call rounds does the Agent need for this type of task? Getting better or worse?
- Is it flip-flopping between two approaches?

This is observability—continuous monitoring of the Agent’s behavioral patterns.

- **What’s verified**: Long-term behavioral patterns and resource consumption
- **Success signal**: Completion rate rising, average steps declining, token cost reasonable
- **Triggered action**: On anomaly—downgrade strategy, pause task, or escalate to human

Some Agent tools have basic observability built in (token counts, execution time). For deeper analysis, platforms like LangSmith or LangFuse exist—but for most users, watching token consumption and execution rounds is sufficient.

## Error Recovery

Agents make mistakes. What matters is whether they can pick themselves back up.

**Rollback**: When task-level verification fails, return to the last known good state. Say a code refactor breaks the tests—the Agent uses `git checkout` to undo the changes and tries a different approach. The key is establishing a rollback point before making changes. Good Agents check that git status is clean before starting major edits.

**Stuck loop detection**: If the Agent keeps trying the same approach but keeps failing (hitting the retry threshold), it should stop and switch strategies instead of continuing to hit the wall. When you see the Agent say "I seem to be stuck"—that’s a good sign. It recognized the loop.

**False completion**: The trickiest failure mode. The Agent says "Done!" but task-level verification shows failure. Usually because the verification step wasn’t enforced—the Agent skipped tests and declared victory. The fix: make verification mandatory in your instructions ("After editing, you must run `bun test`. All tests passing = done"), ensuring the result gets injected back into context.

## Three Things to Watch in Every Chapter

- **Context flow**: Each verification layer produces signals (exit codes, test reports, metrics) that get injected back into context, becoming the basis for the Agent’s next decision. Verification isn’t a post-mortem—it’s real-time navigation.
- **Risk**: Insufficient verification is the root cause of runaway Agent projects. A small tool-level error, if not caught early, gets amplified through subsequent steps—leading to catastrophic task failure.
- **Auditability**: Logs from all three verification layers form a complete audit chain. Tool call inputs/outputs, task verification pass/fail records, observability metrics—these let you trace what the Agent saw, what it did, and why, at every decision point.

Next up: Human-in-the-Loop. Verification tells you whether things are right or wrong. When the answer is "wrong" and the operation is irreversible—it’s time for a human to step in.
