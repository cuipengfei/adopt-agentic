# Built-in Tools

> **Context Perspective**: Tool definitions are the LLM's guide to action, and tool return values are its way of perceiving the world. Together, they form critical context.

## What Are Built-in Tools?

If the LLM is the brain, built-in tools are its hands, feet, and senses.

They are functions pre-written and integrated into the Agent by its developers, allowing the LLM to interact with your local environment. These are not capabilities inherent to the LLM; they are "superpowers" granted by the Agent, available for the LLM to call.

Common built-in tools include:
- **File Operations**: `read_file`, `write_file`, `edit_file`
- **Command Execution**: `bash` or `shell`
- **Code Search**: `grep` or more advanced LSP-based searches
- **Web Access**: `web_search`, `scrape_url`

The LLM cannot execute these operations directly. It can only generate a JSON object requesting the Agent to execute it on its behalf.

## The Tool-Call Flow

The core of an agentic workflow is the "reason-act" loop, which is realized through tool calls. Let's walk through how it works with a complete HTTP request/response flow.

Imagine you ask the Agent: "Rename the `log` function in `logger.js` to `logEvent`."

**── Round 1: From Intent to Tool Call ──**

The Agent packages your instruction, along with the system prompt (which contains definitions for all available tools), and sends it to the LLM.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant. You can use the following tools: read_file, write_file...",
  "messages": [
    {
      "role": "user",
      "content": "Rename the log function in logger.js to logEvent"
    }
  ]
}
```

After reasoning, the LLM determines it needs to read the file's content before making changes. So, instead of replying with a block of code, it returns a `tool_calls` array, requesting the Agent to execute the `read_file` tool.

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Okay, I'll read the contents of `logger.js` first.",
  "tool_calls": [
    {
      "name": "read_file",
      "arguments": { "filePath": "src/logger.js" }
    }
  ]
}
```

**Important**: At this point, no files have been modified. The LLM has only proposed a **plan of action**.

---

**Local Execution**

Upon receiving the response, the Agent parses the `tool_calls` array. It finds a request to call a tool named `read_file`, so it executes this function on the **local filesystem**, reading the contents of `src/logger.js`.

This process happens entirely on your local machine and does not involve another call to the LLM API.

---

**── Round 2: Resuming Reasoning with New Context ──**

The Agent wraps the result of the tool execution (the file's content) into a `tool`-role message, appends it to the conversation history, and sends a new request to the LLM.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a code assistant. You can use the following tools...",
  "messages": [
    {
      "role": "user",
      "content": "Rename the log function in logger.js to logEvent"
    },
    {
      "role": "assistant",
      "tool_calls": [
        { "name": "read_file", "arguments": { "filePath": "src/logger.js" } }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123", // ID for association
      "content": "export function log(message) { console.log(message); }"
    }
  ]
}
```

Now, the LLM's context includes the actual content of the file. Based on this information, it can accurately generate the modification plan, requesting the `write_file` or `edit_file` tool to apply the changes.

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "File content read. I will now perform the rename operation.",
  "tool_calls": [
    {
      "name": "write_file",
      "arguments": {
        "filePath": "src/logger.js",
        "content": "export function logEvent(message) { console.log(message); }"
      }
    }
  ]
}
```

The Agent once again executes `write_file` locally, completing the rename. A full "read-modify-write" cycle is complete.

## The Critical Role of Context

Tools play a dual role in the context of agentic programming:

1.  **Tool Definitions as Input Context**: In every request's `system` prompt or a similar field, the Agent tells the LLM what tools are available and what parameters each tool takes. This is the basis for the LLM's action planning. Without this "tool manifest," the LLM wouldn't know what it can do.

2.  **Tool Return Values as Output Context**: The result of a tool's execution is added back to the `messages` list, becoming critical information for the next round of reasoning. The result of `read_file` lets the LLM see the code; the output of a `bash` command tells the LLM the current Git branch. The LLM relies on these return values to perceive the state of the external world and decide its next move.

## The Trust Boundary

Built-in tools are powerful, but they also introduce risks because the Agent will **actually execute** the tool calls requested by the LLM.

If an LLM hallucinates a `bash` call with `rm -rf /` as arguments, an Agent without safety checks might blindly execute it.

Therefore, good Agent tools incorporate trust boundaries:
- **Confirmation for Dangerous Operations**: Seeking user consent before executing high-risk commands like `rm` or `git push --force`.
- **Scope Limitation**: Restricting tools to read and write files only within the current project directory to prevent accidental modification of system files.
- **Previewing Changes**: Displaying a diff for user review before writing to a file.

As a user, you need to be aware of the extent of your Agent's tool permissions and consciously supervise its high-risk operations.

## Cross-Cutting Concerns

- **Context Flow**: Tool definitions exist as static context in every API call, continuously consuming part of the token window. Tool return values accumulate as dynamic context in the conversation history.
- **Risk Alert**: A large tool return value (e.g., reading a huge file or log) can instantly exhaust the context window, causing critical early information to be truncated. Furthermore, automatic execution of tools like `bash` carries the risk of running destructive commands.
- **Auditability**: Every tool call request (`tool_calls`) and its result (`tool` role message) is clearly logged in the conversation history. This provides an irrefutable evidence chain for tracing every action the Agent takes.
