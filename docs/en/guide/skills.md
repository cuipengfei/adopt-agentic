# Skills — Domain Knowledge Modules

> **Context Perspective**: Skills are on-demand system instruction snippets — bringing domain knowledge into the context modularly.

The previous chapter's Commands and this chapter's Skills do the same thing under the hood — inject extra prompt into the context. There's no difference in persistence: once something enters the context, it's carried in every subsequent request (recall the [Context](./context.md) chapter — LLMs are stateless; everything is resent every turn).

So what's different? Two things:

- **Who triggers it**: A Command is triggered manually when you type `/`. A Skill is loaded by the LLM based on task requirements, via a tool call.
- **How it enters**: A Command expands to its full text immediately upon trigger. A Skill first appears in the context as just a name and short description (metadata); the LLM loads the full content only when it determines the task requires it.

Commands are "what to do this time." Skills are "how to behave from now on."

<SvgIllustration name="skills.svg" interactive />

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

The LLM hasn't "learned" anything new—it simply saw richer instructions. Loading a Skill means injecting its content into the request sent to the LLM. Whether it lands in the `system` field or `messages` varies by tool, but the effect is the same: the Skill's rules persist in every subsequent request.

### Discover First, Load Later

The example above simplifies the loading process. In practice, a Skill enters the context in two steps.

**Step 1: At startup, the agent injects metadata for all available Skills into the context.**

```json
// → REQUEST (at startup, partial)
{
  "system": "...\n\n## Available Skills\n- git-master: Git operations expert, follows conventional commit spec\n- frontend-ui-ux: Frontend design and UI/UX best practices\n- ..."
}
```

The LLM sees a catalog — names and short descriptions, not full content. The context cost is minimal.

**Step 2: When the LLM determines the current task needs a Skill, it proactively calls a tool to load the full content.**

```json
// ← RESPONSE (LLM decides to load skill)
{
  "tool_calls": [{
    "name": "load_skill",
    "arguments": { "name": "git-master" }
  }]
}
```

The agent reads the Skill file's full content and injects it into subsequent requests. From this point on, the Skill's rules actually occupy the context.

This is progressive disclosure — unused Skills cost only a single line of metadata; full content is loaded only when needed. Major open-source tools (Codex, Gemini CLI, OpenCode) all adopt this pattern, differing only in the name of the trigger tool.

## Skills vs. Commands

Both share the same underlying mechanism — injecting extra prompt into the context. The differences are:

| Feature | Slash Commands | Skills |
| --- | --- | --- |
| **Trigger** | User manually types `/` | LLM determines need based on task, loads via tool call |
| **How it enters** | Full text expanded immediately, enters conversation history as a user message | Only metadata (name + description) at startup; LLM loads full content on demand |
| **Persistence** | Carried in every subsequent request (part of conversation history) | Carried in every subsequent request (some tools support mid-session deactivation) |
| **Granularity** | "What to do this time" | "How to behave from now on" |
| **Example** | `/review` | Load `git-master` |

Different agent tools use different syntax for loading Skills, but the flow is the same: **inject metadata at startup → LLM loads full content on demand → included in every subsequent request.**


## Ecosystem: Reusable Behavior Patterns

Both Commands and Skills can be packaged into files, committed to a repository, and shared across teams. There's no difference in distribution. Skills are better suited for reusable modules because of persistence—load once and it takes effect automatically, no need to manually trigger each time.

- **Individuals**: Encapsulate your workflows into a Skill file.
- **Teams**: Create shared Skills to enforce consistent coding standards.
- **Communities**: Publish public Skills for specific tech stacks—React component design principles, Go error handling patterns.

The cost? Every loaded Skill keeps occupying context. Load three Skills, and every request carries three extra sets of instructions. Before loading, ask yourself: does this task actually need it?

Then there's instruction conflicts. One Skill demands detailed comments, another demands minimalism—how does the Agent choose? Some tools support mid-session deactivation; others don't—if they don't, a loaded Skill stays until session end. The decision to load matters more than managing what's already loaded.

## When Should a Repeated Task Be Distilled into a Skill?

A useful rule of thumb: you're on the same project, and this is the third time you've explained the same set of rules to the agent in plain language.

Verbal repetition doesn't scale. You have to say it every time, and every time it costs context; deeper into the conversation, those rules may already be truncated or compressed away. Even if they survive, they get diluted by other content. The longer the session, the higher the chance the rule gets ignored, truncated, or buried.

Three dimensions to check: frequency, stability, scope.

**Repetition frequency.** A one-off task isn't worth distilling. A practical guideline: the same thing comes up three or more times, you re-explain it each round, and the maintenance or error cost is now clearly higher than writing the Skill once. Only then is it worth crystallizing.

**"How to do" vs. "what to do."** Skills encapsulate persistent behavior patterns, not single actions. "Do a review for me" is "what to do" — say it once and you're done. "Always check error paths and type safety during reviews" is "how to do" — write it as a Skill, load it once, and it rides along every turn.

What's easiest to overlook here is the skill description itself. Write the trigger condition precisely, and the agent knows when to load it; write it too broadly, and the Skill will land in unrelated tasks and burn context. If a rule only serves the current task, just say it inline; only consider distillation when it keeps recurring.

**Reuse scope.** Static conventions that only hold for the current project usually belong in a project-level rules file first. Repeated step-based workflows — for example, "how to verify the site before a release" — are better split into project-level Skills. Rules that transfer across projects — commit message format, Go error handling style — are the ones worth packaging into a reusable Skill.

Granularity also matters. A Skill that covers too much is like dumping a book into the context — most of which the current task won't touch. A better pattern is progressive disclosure (layered loading): the description carries only the trigger condition and a one-line capability summary; the body holds the stable workflow; detailed templates, long examples, and script notes go into referenced files, read only when needed.

Split by cohesive domain and load on demand — that beats one big catch-all Skill. Conversely, a single rule with no independent trigger scenario shouldn't get its own Skill; merge it into an existing one.

## Key Takeaways

- **Context flow**: Loading a Skill = its content injected into every request sent to the LLM, continuously occupying the context window. Some tools support mid-session deactivation to free space; others keep it until session end. It produces stable, reproducible domain-specific behavior patterns.
- **Risk**: Too many Skills loaded will exhaust the context window. A subtler problem: different Skills' instructions may conflict — one demands detailed comments, another demands minimalism — and agent behavior becomes unpredictable.
- **Auditability**: Agent logs should record when each Skill was loaded or deactivated. Agent behaving strangely? Check the currently loaded Skill list and their contents first.

Skills aren't free. Every one you load is context that can't be used for the actual work.

Next chapter: Agent-Native CLI Tools — Skills inject behavioral knowledge into the agent, CLI tools give it executable capabilities.
