# Orchestration Patterns

# Orchestration Patterns

> **Context Perspective**: Different orchestration patterns determine how context flows, splits, and merges across multiple steps and branches.

A single task can be too complex for an agent to tackle at once. It needs to break the task into steps and organize them according to a specific "way of working."

This is an orchestration pattern.

By understanding these patterns, you can consciously guide the agent instead of watching it perform randomly.

## Why Users Need to Understand This

If you know an agent can process sub-tasks in parallel, you'll proactively break down your request into independent parts that can be worked on simultaneously.

If you know an agent plans before executing, you can intervene at the planning stage. A single sentence can correct the entire subsequent workflow, rather than waiting for it to go completely 성능 and then redoing it.

If you know it validates in a loop, you'll give it a clear "done" signal to exit the loop.

When your mental model aligns with the agent's, collaboration efficiency increases exponentially.

## Common Patterns

An agent's orchestration patterns are like a circuit board: series, parallel, or more complex combinations. We don't care how the underlying framework implements them, only the behavioral patterns they present to you.

### 1. Sequential Execution

The simplest pattern: step by step.

The agent completes step 1, puts the result into the context, and then starts step 2 based on the new context. This is the most intuitive pattern, suitable for task chains with clear dependencies.

**Use Cases**:
- **Code Refactoring**: First read the file → then analyze dependencies → then modify the code → finally run tests. If one step fails, the process stops.
- **Data Processing**: Download data → clean data → transform format → load into the database.

The context flows linearly, with each round building upon the complete output of the previous one.

### 2. Parallel Branches

When a task can be broken down into multiple independent sub-tasks, a smart agent will choose to process them in parallel.

It will simultaneously launch multiple independent execution branches (often implemented via [Sub Agents](./sub-agents.md)), each working in its own isolated context. Once all branches are complete, the results are aggregated and returned to the main context.

**Use Cases**:
- **Cross-File Operations**: Simultaneously modifying the same function name in 5 different files.
- **Information Gathering**: Simultaneously fetching data from three different APIs.
- **Multi-Angle Analysis**: Asking the agent to review the same piece of code from three perspectives: "performance," "security," and "readability."

Here, the context **splits** into multiple copies, evolves independently, and finally **merges**. This greatly improves efficiency but also introduces the risk of context fragmentation.

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

The context here goes through a "draft" (the plan) and a "final" (execution after your confirmation) stage.

### 4. Iterative Loop (ReAct / Reflect)

Execute → Verify → Correct → Re-execute.

This is a self-correcting loop pattern. After executing a step, the agent pauses to "reflect": Did the result meet expectations? If not, what was the cause? How should the next step be adjusted?

This pattern makes the agent more robust when facing uncertainty. It doesn't stubbornly follow one path but takes small steps and adjusts as needed.

**Use Cases**:
- **Debugging**: Run tests → see an error → read the error log → guess the cause → modify the code → re-run tests.
- **API Integration**: Try to send a request → receive a 400 error → read the API documentation → correct the request body → send again.

The context here spirals upward, with each loop carrying the "lessons" from the previous one.

## Relationship with Sub Agents

A Sub Agent is a **means** to implement certain orchestration patterns (especially parallel branches), but it is not an orchestration pattern itself.

- **Orchestration Pattern** is a higher-level **organizational method** (how to organize steps).
- **Sub Agent** is a lower-level **execution unit** (who does the work).

You can use Sub Agents to implement sequential execution (one Sub Agent passes its result to the next), or you can implement sequential execution without them (the main agent does it step by step).

## Cross-Cutting Concerns

- **Context Flow**: Sequential mode is linear accumulation; parallel mode is splitting and merging; plan-and-execute is draft to final; iterative loop is spiral enrichment.
- **Risk Advisory**: Parallel branches can lead to result conflicts, requiring well-designed merge logic. In the plan-and-execute phase, the agent might hallucinate in its plan, which needs your careful review. Iterative loops can get stuck in infinite cycles and need an exit mechanism.
- **Auditability**: The execution path, branch decisions, and intermediate results of all orchestration patterns should be logged. This allows you to trace "what the agent was thinking" and replay the entire process.
