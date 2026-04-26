# Slash Commands

> **Context Perspective**: Commands are a user-side shortcut for context injection — sending a predefined prompt template into the context with a single action.

The previous chapter covered how MCP gives agents external capabilities. Capabilities are in place — how do you trigger them efficiently?

Type `/review`, and the agent doesn't philosophize about code review — it immediately executes a predefined set of review actions. Type `/commit`, and it doesn't ask whether you want to commit — it reads the diff, generates a message, and commits.

That's a Slash Command: **a shortcut starting with `/`, backed by a pre-written prompt template**. You trigger it, the agent expands the template and injects it into the request sent to the LLM. The LLM has no idea what you pressed — all it sees is a structured instruction.

<SvgIllustration name="commands.svg" interactive />

## How a Command Expands

When you execute `/review`, the agent reads the associated template:

```
1. Compare the current branch with the main branch to find all modified files.
2. For each changed file, check for code style violations, potential bugs, and areas for improvement.
3. Generate a brief report summarizing key issues and suggestions for each file.
```

The agent takes this text — along with the file changes it found — and injects it into the request:

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are an experienced code reviewer...",
  "messages": [
    {
      "role": "user",
      "content": "Please follow these steps to conduct a code review:\n1. Compare the current branch with the main branch...\n2. Check for code style violations...\n\nThe content of the changed file `index.js` is as follows:\n// ... file content ..."
    }
  ]
}
```

The LLM doesn't know you typed `/review`. All it sees is a very specific, structured instruction. To the LLM, this is no different from a user manually typing that entire block of text.

## What Can Be Embedded

Commands aren't just plain text. A well-designed command can bundle multiple elements:

- **Plain text prompts**: Instructions and questions.
- **Shell command execution**: `/commit` might first run `git status` and `git diff --staged`, injecting results into context.
- **File reading**: `/test [filename]` reads the test file and source file, then asks the LLM to run a thought experiment.
- **Combined actions**: `/publish` sequentially runs lint, test, build, and version bump.

## Difference from System Instructions

| Feature | System Instructions | Slash Commands |
| :--- | :--- | :--- |
| **Presence** | **Present by default**, automatically included every turn | **Triggered on demand**, injected when user types `/` |
| **Scope** | Global, affecting every response | Injected once, stays in the current conversation |
| **Role** | The agent's behavioral code | A specific task list for one job |
| **Example** | "You are a Python expert. Code must adhere to PEP8." | `/test` |

System instructions define how the agent behaves *by default*. Commands define what it does *this time*. When the two conflict — say, system instructions demand "operate cautiously" while `/force-push` demands "overwrite forcefully" — the LLM receives contradictory signals and behavior becomes unpredictable.

## When Should Something Be a Command?

Just because something *can* be a command doesn't mean it *should* be. The threshold is simple: you've done it three or more times, the steps are fixed, and you always know when you want to trigger it.

The most obvious candidates are **workflow checkpoints**. Before every code review, you check the diff, run lint, and confirm tests pass. The core steps are relatively fixed and the timing is clear — you already know you want to do this, you just don't want to type it out every time. Teams often write `/review` as a command for exactly this reason: it doesn't depend on whether a tool is built-in, it just expresses a stable set of trigger actions.

Another category is **context switching**. Moving from debug mode to documentation work, or from feature development to performance investigation, carries cognitive overhead on its own. A `/debug-mode` or `/doc-mode` tells the agent what kind of task is ahead, and makes the mode switch a deliberate, visible act.

The core value of a command is **explicit invocation**. You trigger it actively, then the agent executes; some tools also allow the model to invoke commands, but that doesn't mean every command should be exposed to the model. Actions involving deploy, migrate, or force push shouldn't be allowed for automatic model invocation. When you press that `/`, you should be actively owning that operation.

**Boundary with skills**: skills are more like capability packs the agent can pick up on demand; commands are more like buttons the user actively presses. Different tools implement this differently — some put commands and skills in the same system, controlling trigger behavior through configuration (for instance, recent Claude Code uses frontmatter to distinguish invoke modes), so the boundary is no longer just a folder name, but who holds the trigger right. If a workflow needs "I decide when this happens," it shouldn't allow automatic model invocation; if it's "let the agent carry these rules at the right moment," it can be loaded by the model on its own.

**Boundary with hooks**: hooks don't need you to trigger them — they fire when an event occurs. Don't use a command to replace what a hook should do. `/start-logging` is the wrong tool; a hook that mounts logging logic at session start is the right one. Explicit invocation fits "I pick the moment." Event-driven fits "run whenever this happens."

## Key Takeaways

- **Context flow**: User types `/command` → agent expands it into a prompt → injects into `messages` → LLM consumes and responds. Command-injected content stays in the current conversation but doesn't persist across sessions.
- **Risk**: Commands can conflict with system instructions. Also, commands containing dangerous operations (like `/deploy` or `/force-push`) should have confirmation gates — not every shortcut should be fire-and-forget.
- **Auditability**: Agent logs should record which command triggered subsequent actions. When something goes wrong, tracing back to the source command definition is the key to troubleshooting.

Next chapter: Skills — commands are triggered manually by the user and expand to full text immediately; Skills are loaded on demand by the LLM, starting as metadata at launch.

