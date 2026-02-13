# Skills — Domain Knowledge Modules

> **Context Perspective**: Skills are on-demand system instruction snippets that bring domain knowledge into the context modularly.

## What Are Skills

A Skill is a loadable **domain knowledge module**.

It's a detailed instruction manual containing directives, workflows, and best practices for a specific domain. When an Agent loads a Skill, it acquires an "expert mode" for that domain.

Imagine the Agent is a junior developer joining your team. By default, it knows how to code, but it doesn't know your team's Git commit conventions.

When you have it load a `git-master` Skill, the rules within that Skill—like "commit messages must follow the conventional commit format" or "do not force push to the main branch"—are dynamically added to the Agent's System Prompt.

From then on, when this Agent handles Git-related tasks, it will act like a seasoned veteran, strictly adhering to these standards.

## Skills vs. Commands

One is a one-time action; the other is a persistent behavior.

| Feature | Slash Commands (`/ask`) | Skills (`/load git-master`) |
| --- | --- | --- |
| **Effect** | Triggers a one-off action | Loads a persistent set of behaviors |
| **Essence** | A user-side shortcut for context **injection** | Dynamically modifies **System Instructions** |
| **Lifecycle** | Execute immediately, fire-and-forget | Remains active after loading until unloaded |
| **Example** | `/ask "What's wrong with this code?"` | `/load ui-ux-pro-max` |

A Slash Command is like telling the Agent: "Go get that thing for me." It performs the action once, and the task is over.

Loading a Skill is like telling the Agent: "From now on, you are a senior DBA. Memorize these design principles..." This changes the **way** it handles all subsequent related actions.

## How Context Changes

Loading a Skill is, in essence, dynamically modifying the Agent's System Instructions.

**── Before Loading ──**

The Agent's System Instructions might be simple:

```json
// → REQUEST (partial)
{
  "system": "You are an AI programming assistant."
}
```

If you ask it to create a git commit, it might use a very casual message, like "stuff."

**── Loading the `git-master` Skill ──**

After executing `/load git-master`, the Agent's System Instructions are expanded:

```json
// → REQUEST (partial)
{
  "system": "You are an AI programming assistant.\n\n## git-master Skill\n- Commit messages must follow the conventional commit specification (e.g., fix:, feat:, docs:).\n- The commit body should explain 'why,' not 'what.'\n- Do not use `git commit -m`; an editor must be opened for detailed messages.\n- ..."
}
```

This added instruction snippet is now part of the context and will be sent to the LLM in **every subsequent request**.

**── After Loading ──**

Now, if you ask it to create the same commit, its behavior will be completely different. It will generate a compliant commit message, such as `feat: add user authentication endpoint`, complete with a detailed explanation.

The LLM hasn't "learned" anything new. It simply saw a richer context and acted accordingly.

## Ecosystem: Reusable Behavior Patterns

The power of Skills lies in their shareability.

Communities and teams can create, publish, and share Skills, forming an ecosystem of reusable knowledge packages.

- **Individuals**: You can encapsulate your own workflows and best practices into a private Skill.
- **Teams**: You can create shared Skills for your project to ensure all members (including AI Agents) adhere to uniform engineering standards.
- **Communities**: High-quality public Skills can be created for specific tech stacks (like React, Go, or Terraform), allowing anyone to get an "expert-level" Agent for that domain with a single command.

This allows an Agent's capabilities to be extended infinitely by the entire community ecosystem, not just its original developers.

## Cross-Cutting Concerns

- **Context Flow**: Loading a Skill means its entire content is added to the System Instructions, continuously occupying the context window until unloaded. It produces a predictable, reproducible, and stable domain-specific behavior pattern.
- **Risk Alert**: Loading too many Skills can quickly exhaust the context window. More dangerously, conflicting instructions from different Skills (e.g., one demanding detailed code comments, another demanding minimalist code) can lead to chaotic Agent behavior.
- **Auditability**: The Agent's logs should clearly record when a Skill was loaded or unloaded. When an Agent behaves unexpectedly, checking the list of currently loaded Skills is the first step in troubleshooting.
