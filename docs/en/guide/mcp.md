# MCP — External Capabilities

> **Context Perspective**: The definitions and return values of MCP tools enter the context just like built-in tools. The LLM does not distinguish their origins.

Built-in tools are powerful, but ultimately limited. What if you want your agent to connect to your project management tool, call a company-internal API, or integrate a brand-new service?

Waiting for the agent's developer to add it? Impractical. Modifying the agent's source code yourself? Unrealistic.

You need a standardized way for **external capabilities** to be discovered and used by the agent. This is where MCP (Model-Context Protocol) comes in.

## What is MCP?

MCP is a protocol, not a specific implementation.

It defines a set of standards that allow anyone to develop tools for an agent without modifying the agent's own code.

Think of it as the webhooks or plugin system of the agent world. Your application doesn't need custom code for every third-party service; as long as everyone follows a public convention (like HTTP POST + JSON), they can communicate.

MCP is that convention.

It allows an agent to dynamically discover and integrate third-party tools at runtime. These tools run on independent "MCP Servers," maintained by the tool developers themselves.

## Functionally Equivalent, Different Origin

To the LLM, it makes **absolutely no difference** whether a tool is built-in or accessed via MCP.

In its eyes, they are all just tools.

**── Round 1 ──**

Let's say we have a `search_jira` tool accessed via MCP. When a user asks a question, the agent places the definitions of **all available tools** (both the built-in `read_file` and the external `search_jira`) into the context and sends it to the LLM.

```json
// → REQUEST (agent → LLM API)
{
  "system": "You are a project assistant...",
  "tools": [
    {
      "name": "read_file",
      "description": "Reads the content of a file",
      "input_schema": { "...": "..." }
    },
    {
      "name": "search_jira",
      "description": "Searches for Jira issues by keyword",
      "input_schema": { "...": "..." }
    }
  ],
  "messages": [
    { "role": "user", "content": "Look up tickets related to 'database performance'" }
  ]
}
```

The LLM sees two available tools and chooses the most appropriate one based on the user's intent.

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Okay, searching Jira...",
  "tool_calls": [
    { "name": "search_jira", "arguments": { "query": "database performance" } }
  ]
}
```

The LLM returns a `tool_calls` request, same as always.

The difference lies in how the agent executes it:
- For `read_file`, the agent executes it **locally**.
- For `search_jira`, the agent makes a **network request** to the corresponding MCP Server to execute the tool.

```
            ┌────────────────┐        ┌────────────────┐
Agent       │ Executes       │        │ Sends request to │      MCP Server
 in your    │ 'read_file'    │        │ 'search_jira'    │ ──────► on the internet
 editor     │ locally        │        │ tool             │
            └────────────────┘        └────────────────┘
```

The MCP Server performs the search and returns the result to the agent. The agent then packages this result, along with the previous conversation history, into a new context to send to the LLM for the next step.

For the LLM, the subsequent context is **indistinguishable** from a built-in tool's return value:

```json
// → REQUEST (agent → LLM API)
{
  "messages": [
    // ... (previous messages)
    {
      "role": "tool",
      "tool_use_id": "...",
      "content": "[ { \"id\": \"PROJ-123\", \"title\": \"Optimize indexes\" }, { ... } ]"
    }
  ]
}
```

The LLM only cares that it received Jira search results; it doesn't know or need to know whether these results came from the local filesystem or a server miles away.

## Why It Matters: An Open Ecosystem

MCP breaks the closed nature of agents.

Without MCP, an agent's capabilities are determined solely by its developers. You can only use the built-in tools they provide.

With MCP, any developer can create new capabilities for any agent compatible with the protocol. An MCP Server written for Jira could, in theory, be used by Claude Code, Cursor, or any other agent that supports MCP.

This creates an open, interoperable ecosystem of tools.

## Cross-Cutting Concerns

- **Context Flow**: The definitions of MCP tools are injected into every request, consuming tokens in the context window. The tool's return value is injected after execution, becoming the basis for subsequent reasoning.
- **Risk Advisory**: Trust is the biggest issue. A malicious MCP Server could return false information to pollute your context or log your sensitive requests. Agents need clear permission controls and user approval mechanisms to decide whether to trust and execute tools from external sources.
- **Auditability**: Network requests between the agent and the MCP Server should be fully logged. This makes every external tool call traceable, providing a clear record of what was requested and what was returned.
