# Skills — Domain Knowledge Modules

> **Context Perspective**: Skills are on-demand system instruction snippets — bringing domain knowledge into the context modularly.

The previous chapter's Commands and this chapter's Skills do the same thing under the hood — inject extra prompt into the context. The difference is two-fold:

- **Who triggers it**: A Command is triggered manually when you type `/`. A Skill is loaded by the agent on demand, based on task requirements.
- **How long it lasts**: A Command is injected once and stays in the current conversation. A Skill's content is included in every request sent to the LLM, automatically present in **every subsequent turn**.

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

The LLM hasn't "learned" anything new. It simply saw richer instructions and acted accordingly. Loading a Skill means injecting its content into the request sent to the LLM — the exact injection point (the `system` field vs. `messages`) varies by tool, but the effect is the same: the Skill's rules persist in every subsequent request.

## Skills vs. Commands

Both share the same underlying mechanism — injecting extra prompt into the context. The differences are:

| Feature | Slash Commands | Skills |
| --- | --- | --- |
| **Trigger** | User manually types `/` | Agent loads on demand (you give a hint, agent decides to load) |
| **Duration** | Injected once, stays in the current conversation | Included in every request, automatically present every turn until manually deactivated or session ends |
| **Granularity** | "What to do this time" | "How to behave from now on" |
| **Example** | `/review` | Load `git-master` |

Different agent tools use different syntax for loading Skills, but they all do the same thing under the hood: **read the Skill file → inject into the request → include in every subsequent turn.**

## When to Use What

Commands, Skills, and [Sub Agents](./sub-agents.md) all inject content into the context. The difference is granularity and isolation:

- **Repetitive single-step operation?** → Command. One-click trigger, fire and forget.
- **Persistent standards or knowledge?** → Skill. Load once, active every turn.
- **Worried about context getting noisy?** → [Sub Agent](./sub-agents.md). Works in an isolated context, returns a summary.
- **Not sure?** → Start with a Command. If you keep repeating it, upgrade to a Skill.

## Ecosystem: Reusable Behavior Patterns

Both Commands and Skills can be packaged into files, committed to a repository, and shared across teams. There's no difference in distribution and reuse. Skills are better suited for ecosystem-level sharing because of **persistence** — load once and it takes effect automatically, no need to manually trigger each time:

- **Individuals**: Encapsulate your workflows and best practices into a Skill file.
- **Teams**: Create shared Skills for your project to ensure everyone (including agents) follows uniform standards.
- **Communities**: Publish public Skills for specific tech stacks — React component design principles, Go error handling patterns, Terraform module structure.

Agent capabilities are no longer limited to what the developer ships — they can be extended by the ecosystem.

But every loaded Skill keeps occupying context. Before loading, ask: does this task actually need it? "Just in case" is voluntarily injecting noise.

After loading, watch for instruction conflicts. When the task ends, deactivate what's no longer needed to free space for the next job. Loading is easy; deactivating is the discipline. Skip it, and your context just gets noisier.

## Key Takeaways

- **Context flow**: Loading a Skill = its content injected into every request sent to the LLM, continuously occupying context window until manually deactivated or the session ends. It produces stable, reproducible domain-specific behavior patterns.
- **Risk**: Too many Skills loaded will exhaust the context window. A subtler problem: different Skills' instructions may conflict — one demands detailed comments, another demands minimalism — and agent behavior becomes unpredictable.
- **Auditability**: Agent logs should record when each Skill was loaded or deactivated. Agent behaving strangely? Check the currently loaded Skill list and their contents first.

Next chapter: Agent-Native CLI Tools — Skills inject behavioral knowledge into the agent, CLI tools give it executable capabilities.
