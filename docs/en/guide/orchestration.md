# Orchestration Patterns

> **Context Perspective**: Different orchestration patterns determine how context flows, splits, and merges across multiple steps and branches.

The previous chapter solved "what to feed." This one solves "how to organize execution."

A single task can be too complex for an Agent to tackle at once. It needs to break the task into steps and organize them in a specific pattern—this is orchestration.

Why should you care? Because it directly affects how you give instructions:

- If you know an Agent can process sub-tasks in parallel, you'll proactively break your request into independent parts that can run simultaneously.
- If you know an Agent plans before executing, you can intervene at the planning stage. A single sentence can correct the entire subsequent workflow, rather than waiting for it to go off the rails and then redoing everything.
- If you know it validates in a loop, you'll give it a clear "done" signal so it exits.

When your understanding aligns with how the Agent actually works, the quality of your instructions changes completely.

## Conductor unity

Biggest taboo: **fighting for the wheel.** Tell the driver the destination, then don't grab the steering wheel while it's turning.

The Agent is editing a file and you insert a command to modify the same file? Context desyncs from disk. Conflict. Either wait for it to stop (task done) or take over completely (kill task). Don't micromanage while it's driving.

## Parallel span

Human brain juggles 1-2 balls. Agent capacity depends on the orchestrator.

Sequential is 1 ball, stable but slow. Parallel is 10 balls, fast but hard to catch them all.

Rule of thumb: maximize parallelism for read tasks (search, research). Be conservative for write tasks (editing code). Reads rarely conflict. Writes often do.

![Control and concurrency: one driver, one wheel; parallelize reads, serialize writes](/illustrations/orchestration-inline-1.svg)

## Common Patterns

An agent's orchestration patterns are like a circuit board: series, parallel, or more complex combinations. We don't care how the underlying framework implements them, only the behavioral patterns they present to you.

One industry consensus to internalize first: **start with the simplest loop**. If a single agent running sequentially can handle it, don't reach for parallelism. If one loop solves it, don't nest two. Complex orchestration isn't "more powerful" — it's "more failure points." Every added layer of abstraction doubles the difficulty of keeping context aligned. Start simple. Upgrade only when you've genuinely outgrown it.

![Four orchestration patterns compared: Sequential (linear accumulation), Parallel (split and merge), Plan-and-Execute (draft to frozen), and Iterative Loop (spiral ascent)](/illustrations/orchestration.svg)

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

## Parallel Session Governance

Parallel branches are easy to understand. **Governance** is the hard part.

One person runs three sessions modifying the same project simultaneously—this isn't a parallel branch pattern; it's **parallel sessions**. Each session has its own context, blind to what the others are doing. Without coordination, collisions become highly likely.

![Parallel session governance playbook: partition, sync, converge, accept](/illustrations/orchestration-inline-2.svg)

### Task Partitioning

Parallelism requires **clean cuts**.

Each session owns an independent area—different files, different modules, different responsibilities. If two sessions both need to modify the same file, don't parallelize.

Rule of thumb: partition by file boundaries. If one task's file set has zero overlap with another's, parallelize with confidence. Overlap? Go sequential, or extract the overlapping part into its own task.

### State Synchronization

Three sessions have been running for a while. How do you know their progress?

The filesystem is the natural shared bus. Each session's output—modified files, generated code—lands on disk directly. Other sessions don't need notifications; they just read the latest file state when needed.

But context doesn't sync. Session A discovers a key constraint ("this API is deprecated"), and Sessions B and C have no idea. You need to relay that discovery manually—mention it in B/C's next message, or write it to a project knowledge file where they'll pick it up.

### Conflict Convergence

Two sessions both modified the same function signature, but differently. Git will tell you there's a conflict. It won't tell you which approach is correct.

Convergence strategies:

- **First-come-first-served**: Whoever commits first wins; the other rebases on the new state. Blunt but sufficient for most cases.
- **Human arbitration**: Review both approaches, pick one or merge them. Best when changes are substantial and both have merit.
- **Prevention over cure**: If partitioning was clean, conflicts should be rare. Frequent conflicts mean the partitioning itself is flawed.

### Unified Acceptance

All branches are done. How do you confirm the integrated whole is correct?

Tests passing individually ≠ passing after integration. Three sessions each modified different modules, each passing their own tests—merge them together and dependency relationships might blow up.

Acceptance must happen post-merge: full build, full test suite, full lint. It's not enough for each branch to pass on its own—you need one final run after all changes land in the same codebase.

### When to Parallelize / When to Serialize

| Scenario | Recommendation | Rationale |
|----------|---------------|-----------|
| No file overlap between tasks | Parallelize | Total time ≈ slowest branch |
| Sequential dependency between tasks | Serialize | Previous output feeds next input |
| Uncertain whether dependencies exist | Serialize first, parallelize after proving safety | Easier to debug sequentially |
| Large, uncertain scope of changes | Serialize + verify each | Reduces merge conflict risk |

## Relationship with Sub Agents

A Sub Agent is a **means** to implement certain orchestration patterns (especially parallel branches), but it is not an orchestration pattern itself.

- **Orchestration Pattern** is a higher-level **organizational method** (how to organize steps).
- **Sub Agent** is a lower-level **execution unit** (who does the work).

You can use Sub Agents to implement sequential execution (one Sub Agent passes its result to the next), or you can implement sequential execution without them (the main agent does it step by step).

Think of an orchestra conductor: the conductor doesn't play any instrument, but controls tempo, assigns sections, and coordinates all the parts. When you use parallel sessions + Sub Agents to handle complex tasks, you're playing the conductor—dispatching work, tracking progress, accepting deliverables. You're not writing the code, but the overall direction is yours to command.

## Key Takeaways

- **Context Flow**: Sequential mode is linear accumulation; parallel mode is splitting and merging; plan-and-execute is draft to final; iterative loop is spiral enrichment.
- **Risk Advisory**: Parallel branches can lead to result conflicts, requiring well-designed merge logic. In the plan-and-execute phase, the agent might hallucinate in its plan, which needs your careful review. Iterative loops can get stuck in infinite cycles and need an exit mechanism.
- **Auditability**: The execution path, branch decisions, and intermediate results of all orchestration patterns should be logged. This allows you to trace "what the agent was thinking" and replay the entire process.

Next up: Sub Agents. Orchestration patterns are the organizational method; Sub Agents are the execution units. When a task calls for parallelism or context isolation, the main Agent spawns independent child agents to do the work.
