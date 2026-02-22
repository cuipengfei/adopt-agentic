# Hooks & Plugins — Behavior Interception and Extension

> **Context perspective**: Hooks programmatically execute user logic at critical points in the context flow—intercepting operations, modifying context content, logging events. Plugins are third-party extension packages for the agent, expanding capabilities through programming interfaces far beyond just mounting hooks.

Previous sections covered various ways to "put things into context": System Instructions inject rules, MCP injects tools, Skills inject knowledge, CLI Tools inject capabilities.

But some needs can't be solved by writing files or configs—static approaches hit their limit:

- Before the agent executes `rm -rf`, you want to **automatically block it**.
- After the agent finishes a task, you want a **desktop notification**.
- During session compaction, you want to **rewrite the compaction instructions**, force-preserving specific context.
- When building the system prompt, you want to **dynamically append rules** based on runtime state.
- On every tool call, you want to **log** to an external system.

These need a new mechanism: not statically placing content, but **programmatically intervening in the context flow**.

## Hooks — Event-Driven Behavior Control

An agent goes through a series of **lifecycle events** during execution—starting a session, user submitting a prompt, calling a tool, finishing a task. Hooks let you attach your own logic to these events.

Same pattern as HTTP middleware: intercept → inspect → allow, deny, or modify.

```
User submits prompt
    ↓
Agent prepares to call tool
    ↓ Fires "before tool call" event
    ↓ Executes your hook logic
    ↓ Hook returns: allow / block / modify parameters
    ↓
Agent continues or aborts based on hook decision
    ↓
Tool execution completes
    ↓ Fires "after tool call" event
    ↓ Executes your hook logic (logging, validation, result modification)
    ↓
Agent continues reasoning
```

The flow above shows the most intuitive hook scenario—intercepting tool calls. But hooks do far more than that: desktop notifications, token counting, compaction control, dynamic rule injection are all hooks. Interception is just one use case.

## The gatekeeper pattern

An agent is capable and fast—but it has no instinct for "this operation is risky, I should ask first."
You need a gatekeeper to stop it before it executes a high-risk operation.

- **Read-only** (`ls`, `cat`): Let it look.
- **Low-risk write** (`npm install`): Probably fine, but it's better to check things silently, like making sure `package-lock.json` is unchanged before running `npm install`.
- **High-risk write** (`rm -rf`, `git push --force`): Must be stopped. A popup should ask, "Are you sure?"

This is the core value of a hook: a programmable firewall between the agent and the real world.

<SvgIllustration name="hooks-and-plugins.svg" interactive />

### Lifecycle Events

Different agent tools support different event sets and naming. Below are representative types — **before/after tool calls** and **agent stop** are the most universal; session start, prompt submit, system prompt transform, and session compaction vary by tool:

| Event Type | When | What You Can Do |
| --- | --- | --- |
| **Session start** | Session launches | Initialize environment, inject env vars |
| **Prompt submit** | User submits prompt | Intercept or rewrite the prompt |
| **Before tool call** | Tool about to execute | Block dangerous commands, auto-approve safe operations |
| **After tool call** | Tool finished | Logging, result validation, modify return values |
| **System prompt transform** | Building system prompt | Dynamically modify system prompt content |
| **Session compaction** | Context about to be compacted | Inject compaction instructions, force-preserve specific info |
| **Agent stop** | Task complete or paused | Notifications, statistics, cleanup |

Note "system prompt transform" and "session compaction"—hooks in these categories **directly modify context content**. So hooks aren't just "side-channel interception"—they can also "put things into context."

The "session compaction" hook is one of the less universal types — not all tools support it, but if yours does, it's worth using well. When agents automatically compress early history in long conversations, your core constraints may get compressed away—the agent "forgets" rules in the second half, not because it's stupid, but because that rule is simply no longer in the context. A compaction hook lets you solve this at the mechanism level: specify which information must be preserved verbatim, and which can be summarized. Far more reliable than manually restating constraints every few turns.

### Event Processing Pattern

Different agent tools implement hooks very differently—some use shell scripts with JSON communication, some use TypeScript async functions, some use declarative configuration. But the **conceptual pattern** is universal:

```
Event fires
    → Event data passed in (session info, tool name, parameters, etc.)
    → Your logic executes
    → Return a decision (allow / block / modified data)
```

Core elements:

1. **Event**: Which lifecycle point to hook into
2. **Matching**: Filter conditions—only handle specific tools or operations (e.g., only intercept bash commands, ignore file reads)
3. **Processing**: What logic to execute—can be a shell command, a code function, or even launching a sub-agent to make the judgment

### Scope Hierarchy

Where a hook is defined determines its reach:

| Location | Scope | Typical Use |
| --- | --- | --- |
| User-level global config | All projects | Desktop notifications, token stats, global security rules |
| Project config | Current project | Project-specific tool permission restrictions |
| Plugin-bundled | When plugin is enabled | Plugin's built-in behavior enhancements |

Scopes merge from high to low. Project-level hooks can override global behavior.

### Two Faces of Hooks

The most important thing to understand: the same mechanism can do two very different things.

**Side-channel**—Agent and LLM completely unaware. The hook quietly executes alongside the event stream, modifying no context. Desktop notifications, log recording, token statistics—pure side effects.

**Interventional**—Directly altering context content or agent behavior. The hook blocks a tool call, or modifies the system prompt to inject new rules, or rewrites tool input parameters. These changes are "seen" by the LLM (reflected in context), even though the LLM doesn't know the changes came from a hook.

## Plugins — Third-Party Extension Packages

If a hook is a single event handler, a plugin is a complete extension package.

A plugin's capability far exceeds "a collection of hooks." A single plugin can simultaneously:

- Mount multiple **Hooks** (lifecycle event handling)
- Register new **Tools** (extend the agent's available toolset)
- Provide **Slash Commands** (shortcut commands, supported by some tools)
- Inject **Skills** (domain knowledge, supported by some tools)
- Provide authentication flows, output styles, configuration modifications, etc.

A plugin is a programmable extension point for the agent—what it can do depends on which interfaces the agent tool exposes.

### Installation and Distribution

Two mainstream models are evolving in parallel:

**Marketplace model**: Browse and install pre-packaged plugins from centralized repositories. Official and community repos coexist, one-click install, auto-activate. Great for common scenarios—code review, frontend design, TDD workflows, etc.

**Local file / package manager model**: Write code files directly into a conventional directory, or install via package managers like npm. Great for personal customization—your project has unique needs with no off-the-shelf plugin. Some frameworks also auto-scan all files in a `plugins/` directory—drop it in and it takes effect, no manual registration needed.

The two models aren't mutually exclusive. You can run marketplace-installed general-purpose plugins alongside your own custom ones.

### Ecosystem Status

The plugin ecosystem is still early. Each agent tool's plugin interfaces, distribution mechanisms, and security models are iterating rapidly. But the direction is clear: **agent capabilities are no longer solely defined by developers—users and communities can extend them programmatically.**

Same evolution path as browser extensions and editor plugins—first core functionality, then open extension interfaces, then ecosystem explosion.

## Hooks + Plugins vs. Skills vs. MCP

All three can extend an agent's capabilities. The difference is in **approach and capability boundary**:

| | Skills | MCP | Hooks / Plugins |
| --- | --- | --- | --- |
| **What it does** | Injects knowledge | Extends tools | Programmatic extension (intercept + modify + register + …) |
| **Implementation** | Declarative (write docs) | Protocol-based (implement server) | Programmatic (write code) |
| **Trigger** | Manually loaded | LLM decides to call | Event-driven, automatic |
| **LLM knows it exists?** | ✅ Content directly visible | ✅ Tool definitions visible | ❌ Mechanism itself invisible |
| **Can modify context?** | ✅ Appends to system prompt | ✅ Tool return values enter context | ✅ Can modify system prompt, tool I/O |

Note the last row: the **results** of hook modifications appear in context (the LLM sees the modified system prompt), but the hook's **own existence** is invisible to the LLM.

**Skills** tell the LLM "how to behave." **MCP** gives the LLM "what it can do." **Hooks / Plugins** programmatically control the agent's behavioral boundaries—the LLM doesn't know there's code making decisions for it.

All three can be combined. A single plugin that injects a Skill (Git convention knowledge) + mounts a Hook (auto-lint before commits) is perfectly normal.

### The Trust and Permission Gradient

If you care about security, you'll notice a theme running through several nodes: a gradient of permissions.

[Built-in tools](./built-in-tools.md) are safest; the agent's developer has your back.
[MCP](./mcp.md) is next. Its permissions are bound by a protocol, but you have to trust the provider.
Hooks and plugins have the most power and the most risk. They are just code. They can do anything.

With great power comes great responsibility to review. You can use built-in tools without a thought. You should glance at an MCP's declared permissions. You must review hooks and plugins line-by-line, just like any other code.

## Key Takeaways

- **Context flow**: Hooks execute at **critical points** in the context flow—before and after tool calls, during system prompt construction, during session compaction. They can either work as side channels (not affecting context) or directly modify context content. Plugins bundle multiple context manipulation mechanisms. This is the most fine-grained context control available to users.
- **Risk**: Hook and plugin code runs with **extensive** system privileges—a broken before-tool-call hook can block all tool calls, completely paralyzing the agent. This isn't prompt-level "fix the wording"—it's code-level "break it and it crashes." Plugin sources also need vetting—you're installing code that executes on every agent run.
- **Auditability**: Hook execution logs are the most fine-grained observability data—every event, every interception, every decision timestamped. But you need to implement the logging logic yourself.

Next up: "Knowledge Feeding"—a unified review of all the carriers we've covered, answering the one question: "I have a bunch of knowledge, how do I get the agent to know it?"

