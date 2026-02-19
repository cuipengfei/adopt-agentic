# Skills — Domain Knowledge Modules

> **Context Perspective**: Skills are on-demand system instruction snippets — bringing domain knowledge into the context modularly.

The previous chapter's commands are one-time injections — trigger once, gone. But some knowledge needs to **persist**: Git commit conventions, code style requirements, framework-specific best practices. You don't want to remind the agent manually every time.

Skills solve this. A Skill is a loadable instruction set. Once loaded, its content is appended to the agent's System Instructions and sent to the LLM in **every subsequent request**.

Commands are "what to do this time." Skills are "how to behave from now on."

![Skills: on-demand system instruction modules — load domain knowledge that persists across every request until unloaded](/illustrations/skills.svg)

## Behavior Before and After Loading

The most intuitive way to understand: compare outputs for the same task, before and after loading a Skill.

**── Before Loading ──**

The agent's System Instructions are simple:

```json
// → REQUEST (partial)
{
  "system": "You are an AI programming assistant."
}
```

You say: "Commit these changes."

Agent generates: `git commit -m "update files"`

**── Loading the `git-master` Skill ──**

```json
// → REQUEST (partial)
{
  "system": "You are an AI programming assistant.\n\n## git-master Skill\n- Commit messages must follow the conventional commit spec (fix:, feat:, docs:, etc.)\n- The body explains 'why,' not 'what'\n- Never use --no-verify\n- ..."
}
```

**── After Loading ──**

Same request: "Commit these changes."

Agent generates: `feat(auth): add JWT token refresh endpoint`, with a detailed body explaining why the change is needed.

The LLM hasn't "learned" anything new. It simply saw richer system instructions and acted accordingly. Loading a Skill = dynamically extending System Instructions.

## Skills vs. Commands

| Feature | Slash Commands | Skills |
| --- | --- | --- |
| **Essence** | User-side context **injection** | Dynamically modifies **System Instructions** |
| **Granularity** | Task-level injection — "what to do this time" | Behavior-level configuration — "how to behave from now on" |
| **Lifecycle** | Trigger once, fire-and-forget | Remains active after loading until unloaded |
| **Example** | `/review` | Load `ui-ux-pro-max` |

Different agent tools may use different syntax for loading Skills, but the underlying mechanism is the same: **read the Skill file → append to System Instructions → include in every subsequent request.**

## Commands, Skills, and Sub Agents

Commands, Skills, and [Sub Agents](./sub-agents.md) control agent behavior at different levels.

| | Commands | Skills | Sub Agent |
| --- | --- | --- | --- |
| **Essence** | One-shot prompt injection | Persistent system instruction extension | Isolated context environment |
| **Granularity** | Task-level: "what to do this time" | Behavior-level: "how to behave from now on" | Sub-task-level: "hand this to a specialist" |
| **Lifecycle** | Fire and forget | Active until manually unloaded | Destroyed after task completion |
| **Context impact** | Appended to current conversation | Appended to System Instructions | Creates a fresh, independent context |
| **Typical use** | `/review`, `/commit` | Loading Git conventions, code style | Complex sub-tasks needing a clean environment |

### When to Use Which

| Scenario | Recommendation | Rationale |
|----------|---------------|-----------|
| Repetitive, single-step operations | Command | One-click trigger, fire and forget. |
| Persistent standards or knowledge | Skill | Load once, active in every turn. |
| Sub-task requiring a clean slate | Sub Agent | Avoids noise from the main conversation. |
| Not sure which to use | Start with a Command. If you repeat it, upgrade to a Skill. | Start simple, escalate as needed. |

## Ecosystem: Reusable Behavior Patterns

The core value of Skills is shareability:

- **Individuals**: Encapsulate your workflows and best practices into a private Skill.
- **Teams**: Create shared Skills for your project to ensure everyone (including agents) follows uniform standards.
- **Communities**: Publish public Skills for specific tech stacks — React component design principles, Go error handling patterns, Terraform module structure.

Agent capabilities are no longer limited to what the developer ships — they can be extended by the ecosystem.

But every loaded Skill keeps occupying context. Before loading, ask: does this task actually need it? "Just in case" is voluntarily injecting noise.

After loading, watch for instruction conflicts. When the task ends, deactivate what's no longer needed to free space for the next job. Loading is easy; deactivating is the discipline. Skip it, and your context just gets noisier.

## Key Takeaways

- **Context flow**: Loading a Skill = its full content appended to System Instructions, continuously occupying context window until unloaded. It produces stable, reproducible domain-specific behavior patterns.
- **Risk**: Too many Skills loaded will exhaust the context window. A subtler problem: different Skills' instructions may conflict — one demands detailed comments, another demands minimalism — and agent behavior becomes unpredictable.
- **Auditability**: Agent logs should record when each Skill was loaded or unloaded. Agent behaving strangely? Check the currently loaded Skill list and their contents first.

Next chapter: Agent-Native CLI Tools — Skills inject behavioral knowledge into the agent, CLI tools give it executable capabilities.
