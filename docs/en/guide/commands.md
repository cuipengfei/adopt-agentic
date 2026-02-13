# Slash Commands

> **Context Perspective**: Commands are a user-side shortcut for context injection—sending a predefined prompt template into the context with a single action.

## Definition: What are Slash Commands

A phrase starting with `/`, like `/review` or `/commit`.

It's not a chat. It's a **preset instruction template**. When you type `/review`, the agent doesn't chitchat with you about the philosophy of reviewing; it immediately starts executing a predefined set of actions for code review.

These actions are defined somewhere—either built into the agent or configured by you.

## The Essence: Templated Context Injection

The essence of a command is **packaging a pre-written, potentially complex prompt into a shortcut**.

When you execute `/review`, here’s what might be happening behind the scenes:

The agent reads the template associated with the `/review` command. The template content might be:

```
1. **Identify the changes**: Compare the current branch with the main branch to find all modified files.
2. **Analyze the code**: For each changed file, check for code style violations, potential bugs, and areas for improvement. Specifically, look for inconsistent naming, complex logic that could be simplified, and missing error handling.
3. **Summarize the findings**: Generate a brief report summarizing the key issues and suggestions for each file. Use a bulleted list.
4. **Present the report**: Output the report into the current conversation.
```

The agent takes this text—along with the file changes it found—and stuffs it into the request sent to the LLM.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are an experienced code reviewer...",
  "messages": [
    // ... conversation history ...
    {
      "role": "user",
      "content": "Please follow these steps to conduct a code review:\n1. **Identify the changes**: Compare the current branch with the main branch...\n2. **Analyze the code**: ...\n\nThe content of the changed file `index.js` is as follows:\n// ... file content ..."
    }
  ]
}
```

The LLM doesn't know you typed `/review`. All it sees is a very specific, structured instruction. To the LLM, this is no different from a user manually typing out that entire block of text.

A command is a **shortcut for context injection**.

## What Can Be Embedded

Commands are more than just plain text. A well-designed command system allows you to bundle various elements:

-   **Plain Text Prompts**: The most basic instructions and questions.
-   **Shell Command Execution**: For example, a `/commit` command might include steps to execute `git status` and `git diff --staged`, injecting the results into the context.
-   **File Content Reading**: For example, `/test [filename]` could read the specified test file and the file under test, then ask the LLM to run a thought experiment.
-   **Combined Actions**: A `/publish` command could sequentially execute linting, testing, building, and version bumping.

## Difference from System Instructions

| Feature | System Instructions | Slash Commands |
| :--- | :--- | :--- |
| **Presence** | **Always present**, throughout the entire session | **Triggered on demand**, a one-time injection |
| **Scope** | Global, affecting every response from the agent | Local, only affecting the current task |
| **Role** | The agent's "personality" and "code of conduct" | A specific "task list" for one job |
| **Example** | "You are a Python expert. Your code must adhere to PEP8." | `/test` |

System instructions are the agent's background music, always playing. A command is a song you request; it plays once and then it's over.

Confusing the two is like asking a cautious agent (set by system instructions) to suddenly execute an aggressive deployment script (triggered by a command). The agent will be confused, and the final result might not satisfy either directive.

## Cross-Cutting Concerns

-   **Context Flow**: User types `/command` → Agent expands it into a specific prompt → Injects it into the `messages` array → LLM consumes this prompt → Generates a response.
-   **Risk Advisory**: A poorly defined or overly complex command can conflict with existing context (including system instructions), causing the LLM to receive contradictory directives. For example, a system instruction to "operate cautiously" clashes with a `/force-push` command that demands "overwrite forcefully".
-   **Auditability**: The agent's logs should clearly record which command triggered a subsequent series of actions. When unexpected behavior occurs, tracing it back to the source command definition is key to troubleshooting.
