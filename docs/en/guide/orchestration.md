# Orchestration Patterns

> **Context Perspective**: Different orchestration patterns determine how context flows, splits, and merges across multiple steps and branches.

The previous chapter solved "what to feed." This one solves "how to organize execution."

A single task can be too complex for an Agent to tackle at once. It needs to break the task into steps and organize them in a specific pattern—this is orchestration.

Why should you care? Because it directly affects how you give instructions:

- If you know an Agent can process sub-tasks in parallel, you'll proactively break your request into independent parts that can run simultaneously.
- If you know an Agent plans before executing, you can intervene at the planning stage. A single sentence can correct the entire subsequent workflow, rather than waiting for it to go off the rails and then redoing everything.
- If you know it validates in a loop, you'll give it a clear "done" signal so it exits.

When your mental model aligns with the Agent's, the quality of your instructions changes completely.

## Common Patterns

An agent's orchestration patterns are like a circuit board: series, parallel, or more complex combinations. We don't care how the underlying framework implements them, only the behavioral patterns they present to you.

One industry consensus to internalize first: **start with the simplest loop**. If a single agent running sequentially can handle it, don't reach for parallelism. If one loop solves it, don't nest two. Complex orchestration isn't "more powerful" — it's "more failure points." Every added layer of abstraction doubles the difficulty of keeping context aligned. Start simple. Upgrade only when you've genuinely outgrown it.

### 1. Sequential Execution

The simplest pattern: step by step.

The agent completes step 1, puts the result into the context, and then starts step 2 based on the new context. This is the most intuitive pattern, suitable for task chains with clear dependencies.

**Use Cases**:
- **Code Refactoring**: First read the file → then analyze dependencies → then modify the code → finally run tests. If one step fails, the process stops.
- **Data Processing**: Download data → clean data → transform format → load into the database.

The context flows linearly, with each round building upon the complete output of the previous one.

### 2. Parallel Branches

When a task can be broken down into multiple independent sub-tasks, the Agent will choose to process them in parallel.

It will simultaneously launch multiple independent execution branches (often implemented via [Sub Agents](./sub-agents.md)), each working in its own isolated context. Once all branches are complete, the results are aggregated and returned to the main context.

**Use Cases**:
- **Cross-File Operations**: Simultaneously modifying the same function name in 5 different files.
- **Information Gathering**: Simultaneously fetching data from three different APIs.
- **Multi-Angle Analysis**: Asking the agent to review the same piece of code from three perspectives: "performance," "security," and "readability."

Here, the context **splits** into multiple copies, evolves independently, and finally **merges**. This greatly improves efficiency but also introduces the risk of context fragmentation.

This is also the most natural form of context subtraction. Each branch explores independently; detours and noise stay in the branch. When merging back to the main line, carry only conclusions and evidence—not the process junk. You already do this with Git: experiment freely on a feature branch, but only clean, reviewed code gets merged into main. Agent branching works the same way.

### 3. Plan-and-Execute

When faced with complex, high-risk, or unclear paths, an agent will first generate a plan of action, sometimes requesting your approval.

**── Round 1: Plan ──**

You give a vague goal: "Optimize my application's Docker image size."

The agent returns not code, but a plan:

```markdown
Okay, to optimize the Docker image size, I plan to take four steps:

1.  **Analyze Current Image**: Use `docker history` and `dive` to analyze the image layers and identify the largest parts.
2.  **Optimize Base Image**: Check if I can switch from `ubuntu` to a smaller image like `alpine` or `distroless`.
3.  **Optimize Dockerfile**: Merge `RUN` instructions, clean up cache, and use multi-stage builds.
4.  **Verify**: Build the new image and run tests to ensure functionality is intact and the size is reduced.

Please confirm if this plan is feasible.
```

**── Round 2: Execute ──**

You reply, "Feasible, but skip step 2; the base image cannot be changed."

The agent receives your feedback, adjusts the plan, and only then begins to execute the tool calls one by one.

**Use Cases**:
- **Exploratory Development**: "Help me build a prototype with a new tech stack."
- **High-Risk Operations**: "Refactor the database schema."
- **Multi-Step Deployments**: Involving complex processes like database migrations, service restarts, and CDN cache invalidation.

The context here goes through a "draft" (the plan) and a "final" (execution after your confirmation) stage. Remember the [triangle relationship](./actors.md)? Plan-and-Execute is the most natural entry point for Human-in-the-loop—you're the approver at the planning stage.

### 4. Iterative Loop (ReAct / Reflect)

Execute → Verify → Correct → Re-execute.

Plan-and-Execute corrects before doing; iterative loops correct after doing. The Agent executes a step, then checks the result: did it meet expectations? If not, what went wrong? How to adjust?

This makes the Agent more robust under uncertainty. It doesn't stubbornly follow one path but takes small steps and adjusts as it goes.

**Use Cases**:
- **Debugging**: Run tests → see an error → read the error log → guess the cause → modify the code → re-run tests.
- **API Integration**: Try to send a request → receive a 400 error → read the API documentation → correct the request body → send again.

The context here spirals upward, with each loop carrying the "lessons" from the previous one.

## Relationship with Sub Agents

A Sub Agent is a **means** to implement certain orchestration patterns (especially parallel branches), but it is not an orchestration pattern itself.

- **Orchestration Pattern** is a higher-level **organizational method** (how to organize steps).
- **Sub Agent** is a lower-level **execution unit** (who does the work).

You can use Sub Agents to implement sequential execution (one Sub Agent passes its result to the next), or you can implement sequential execution without them (the main agent does it step by step).

## Three Things to Watch in Every Chapter

- **Context Flow**: Sequential mode is linear accumulation; parallel mode is splitting and merging; plan-and-execute is draft to final; iterative loop is spiral enrichment.
- **Risk Advisory**: Parallel branches can lead to result conflicts, requiring well-designed merge logic. In the plan-and-execute phase, the agent might hallucinate in its plan, which needs your careful review. Iterative loops can get stuck in infinite cycles and need an exit mechanism.
- **Auditability**: The execution path, branch decisions, and intermediate results of all orchestration patterns should be logged. This allows you to trace "what the agent was thinking" and replay the entire process.

Next up: Sub Agents. Orchestration patterns are the organizational method; Sub Agents are the execution units. When a task calls for parallelism or context isolation, the main Agent spawns independent child agents to do the work.
