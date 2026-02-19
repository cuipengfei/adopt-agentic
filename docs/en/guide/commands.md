# Slash Commands

> **Context Perspective**: Commands are a user-side shortcut for context injection — sending a predefined prompt template into the context with a single action.

The previous chapter covered how MCP gives agents external capabilities. Capabilities are in place — how do you trigger them efficiently?

Type `/review`, and the agent doesn't philosophize about code review — it immediately executes a predefined set of review actions. Type `/commit`, and it doesn't ask whether you want to commit — it reads the diff, generates a message, and commits.

That's a Slash Command: **a shortcut starting with `/`, backed by a pre-written prompt template**. You trigger it, the agent expands the template and injects it into the request sent to the LLM. The LLM has no idea what you pressed — all it sees is a structured instruction.

![Slash Commands: user triggers a shortcut, Agent expands the prompt template and injects it into the LLM request — one-shot context injection](/illustrations/commands.svg)

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

## Key Takeaways

- **Context flow**: User types `/command` → agent expands it into a prompt → injects into `messages` → LLM consumes and responds. Command-injected content stays in the current conversation but doesn't persist across sessions.
- **Risk**: Commands can conflict with system instructions. Also, commands containing dangerous operations (like `/deploy` or `/force-push`) should have confirmation gates — not every shortcut should be fire-and-forget.
- **Auditability**: Agent logs should record which command triggered subsequent actions. When something goes wrong, tracing back to the source command definition is the key to troubleshooting.

Next chapter: Skills — commands are triggered manually by the user and expand to full text immediately; Skills are loaded on demand by the LLM, starting as metadata at launch.
