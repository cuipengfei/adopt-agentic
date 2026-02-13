# MCP — External Capabilities

> **Context Perspective**: The definitions and return values of MCP tools enter the context just like built-in tools. The LLM does not distinguish their origins.

The previous chapter's built-in tools all execute locally — reading files, running commands, the agent handles it directly. But what if you want the agent to search Jira tickets, query Slack messages, or call a company-internal API?

Wait for the agent developer to add it? Impractical. Modify the agent's source code yourself? Even less realistic.

You need a standard interface that lets **any external capability** plug into the agent. That's MCP (Model Context Protocol).

## What is MCP?

One sentence: **the USB port of the agent world.**

MCP is an open protocol. It defines a standard that allows anyone to develop tools for an agent without modifying the agent's own code. Just as a USB device doesn't need to understand a computer's internals, an MCP tool doesn't need to know the agent's implementation details.

The agent dynamically discovers and loads these external tools at runtime. You just configure it — no code required.

## Server and Client

These two terms trip people up. Let's clear up a common misconception: **an MCP Server is not necessarily a remote server.**

- **MCP Client**: A component running inside the agent, responsible for discovering, connecting to, and calling tools on MCP Servers. You typically don't interact with it directly.
- **MCP Server**: The party that provides tools. It can be a local process or a remote HTTP service.

You'll encounter all kinds of MCP Servers. Some real examples: Context7 (documentation lookup), Tavily/Exa (search engines), DeepWiki (repository documentation), Firecrawl (web scraping), Grep.app (GitHub code search). Some run locally on your machine via stdio (like Context7, Firecrawl), others run as remote HTTP services (like Exa, DeepWiki, Tavily).

### Two Transport Modes

MCP supports two ways to connect to a Server:

**stdio (local child process)**: The agent spawns a child process to run the MCP Server. Communication goes through stdin/stdout, and the agent manages the process's entire lifecycle — startup, communication, shutdown. When you write `command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres"]` in your config, this is the mechanism behind it.

**Streamable HTTP (remote service)**: The MCP Server runs as an independent HTTP service, and the agent connects via HTTP requests. Suited for scenarios requiring persistent uptime or shared access across multiple agents.

For you, the difference is just configuration. For the LLM, it doesn't know and doesn't care.

## Functionally Equivalent, Different Origin

Here's the key: to the LLM, built-in tools and MCP tools are **indistinguishable**.

**── Round 1 ──**

Say we have a `search_jira` tool accessed via MCP. When the user asks a question, the agent places **all available tools** (built-in + MCP) into the context together:

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
  "messages": [{ "role": "user", "content": "Look up tickets related to 'database performance'" }]
}
```

The LLM picks the most appropriate tool:

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Okay, searching Jira...",
  "tool_calls": [
    { "id": "call_xyz789", "name": "search_jira", "arguments": { "query": "database performance" } }
  ]
}
```

LLM's perspective: identical to calling `read_file` — just a `tool_calls` response.

Agent's perspective: different execution path.

```mermaid
flowchart LR
  A[Agent] -->|Execute locally| B["read_file — Direct filesystem access"]
  A -->|Forward request| C["MCP Server — Execute search_jira"]
```

**── Round 2 ──**

After the MCP Server returns results, the agent wraps them into a `tool`-role message and appends to the conversation history. Same format as built-in tool results:

```json
// → REQUEST (agent → LLM API)
{
  "messages": [
    // ... previous messages
    {
      "role": "tool",
      "tool_call_id": "call_xyz789",
      "content": "[{\"id\": \"PROJ-123\", \"title\": \"Optimize database indexes\"}, {\"id\": \"PROJ-456\", \"title\": \"Slow query investigation\"}]"
    }
  ]
}
```

```json
// ← RESPONSE (LLM API → agent, SSE stream)
{
  "role": "assistant",
  "content": "Found two related tickets:\n1. PROJ-123 — Optimize database indexes\n2. PROJ-456 — Slow query investigation\n\nWant me to look into either of these in detail?"
}
```

The LLM only cares that it got search results. It doesn't know or need to know whether they came from the local machine or a remote server.

One-line summary: **LLM layer — fully equivalent. Agent execution layer — different paths.**

## Why It Matters

MCP's value isn't "yet another protocol." Its value is **freeing you from depending on the agent developer**:

- **Don't wait for updates**: Want Jira integration? Install an MCP Server. No need to wait for the next agent release.
- **Connect internal systems**: Your company's internal API will never get official support, but you can write (or find) an MCP Server for it.
- **Reuse across agents**: An MCP Server can theoretically be used by any agent that supports the protocol — not locked to a specific tool.

## Three Things to Watch in Every Chapter

- **Context flow**: MCP tool definitions are injected into every request (static); return values are appended after execution (dynamic). They travel the same context pipeline as built-in tools — the LLM perceives no difference.
- **Risk**: MCP's trust problem is sharper than built-in tools. A malicious MCP Server could return false data to pollute your context, or log your sensitive requests. Installing an MCP Server is like installing a browser extension — is the source trustworthy? Are the permissions reasonable?
- **Auditability**: Every interaction between the agent and MCP Server should be logged — what was requested, what was returned, how long it took. When something goes wrong, this is your investigation trail.

Next chapter: Slash Commands — how to package common operations into one-click shortcuts.
