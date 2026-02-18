# In Practice — From Concepts to Action

> All previous sections stayed agent-agnostic. This one breaks that constraint—concrete tools, copyable operations.

You've read through the complete concept chain of context management: from first principles to carriers to orchestration to verification. Now the question is: **how do you actually do it?**

This section isn't a comprehensive operations manual—that's the job of each tool's own documentation. Here we only pick **high-payoff operations**: things you can quickly do after understanding the concepts, with immediate results.

## Write Your System Instructions Well

> Related concepts: [System Instructions](/en/guide/system-instructions), [Knowledge Feeding](/en/guide/knowledge-feeding)

System Instructions are the most effective handle you have—no code, no plugins, one file changes the agent's entire behavior.

### Where to Put Them

Different tools use different filenames, but the mechanism is identical: the agent reads these files on startup, and their content is spliced into the system prompt.

| File | Scope | Loaded When |
| --- | --- | --- |
| `~/.claude/CLAUDE.md` | User global | Every session |
| Project root `CLAUDE.md` | Current project | When entering the project |
| Subdirectory `CLAUDE.md` | Directory-level | When operating on that directory |
| `AGENTS.md` | Same (different tool convention) | Same |
| `opencode.json` → instructions | Project config | On startup |

Scopes merge hierarchically: global → project → subdirectory. The more specific, the higher priority.

### What to Write

A good project-level System Instructions file should answer three questions:

**1. What's the tech stack?**

```markdown
## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm (do NOT use npm or yarn)
- **Testing**: Vitest + Playwright
```

Don't write "please use modern frontend technologies"—be specific down to versions and tools. The agent relies on these to make decisions.

**2. What are the project conventions?**

```markdown
## Conventions
- Components go in `src/components/`, organized by feature
- API routes go in `src/app/api/`
- Commit messages follow Conventional Commits
- All exports must have JSDoc comments
- No `any` types, no `@ts-ignore`
```

**3. Where are the landmines?**

```markdown
## Watch Out
- `src/legacy/` is old code, do NOT modify
- Environment variables are in `.env.local`, never commit to git
- `pnpm db:migrate` hits the production database directly, use with extreme caution
```

### One-Line Self-Check

> If you deleted this line, would the agent's behavior get worse? If not, delete it.

## Configure Hooks

> Related concepts: [Hooks & Plugins](/en/guide/hooks-and-plugins)

### Task Completion Notification

The most practical starter hook—get notified when the agent finishes.

**Claude Code** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Task completed' 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}
```

Claude Code hooks are shell commands—event data arrives as JSON via stdin, exit code determines behavior.

**OpenCode** (`~/.config/opencode/plugins/notify.ts`):

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export default (async () => ({
  event: async ({ event }) => {
    if (event.type === "session.idle") {
      Bun.spawn(["notify-send", "OpenCode", "Waiting for input"])
    }
  }
})) satisfies Plugin
```

OpenCode hooks are TypeScript functions—export a Plugin, declare which events to listen to. Drop it into `~/.config/opencode/plugins/` and it auto-loads.

Same need (notification), two completely different implementations. Same concept, different interfaces.

### Dangerous Command Interception

Auto-block before `rm`, `git push --force`, or `DROP TABLE` execute.

**Claude Code**:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'CMD=$(cat | jq -r \".tool_input.command\"); echo \"$CMD\" | grep -qiE \"rm -rf|push --force|drop table\" && exit 2; exit 0'"
          }
        ]
      }
    ]
  }
}
```

`exit 2` = block. The agent receives "operation blocked by hook" feedback, then asks you to confirm.

**OpenCode**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const DANGEROUS = /rm\s+-rf|push\s+--force|drop\s+table/i

export default (async () => ({
  "tool.execute.before": async ({ input }) => {
    if (input.tool === "bash" && DANGEROUS.test(input.args?.command ?? "")) {
      throw new Error("Blocked: dangerous command detected")
    }
    return input
  }
})) satisfies Plugin
```

Same interception logic—one uses shell + exit codes, the other uses TypeScript + throw.

### Token Usage Tracking

**Claude Code**: In a Stop hook, read `transcript_path` from stdin, parse the transcript to count tokens.

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/count_tokens.js"
          }
        ]
      }
    ]
  }
}
```

**OpenCode**: Listen to the `message.updated` event, extract token counts from message metadata.

```typescript
export default (async () => ({
  event: async ({ event }) => {
    if (event.type === "message.updated" && event.properties?.role === "assistant") {
      const tokens = event.properties?.usage
      // Write to log or send to statistics service
    }
  }
})) satisfies Plugin
```

### Using Plugins to Modify System Prompt

One of hooks' most powerful capabilities—dynamically injecting content during system prompt construction.

**OpenCode**:

```typescript
export default (async () => ({
  "experimental.chat.system.transform": async ({ output }) => {
    output.system += "\n\nWhen calling task(), always use run_in_background=true."
    return output
  }
})) satisfies Plugin
```

**Claude Code**: Using `prompt`-type or `agent`-type hooks can achieve similar effects—injecting additional instructions at SessionStart.

This usage blurs the line between "hook" and "knowledge injection"—back at the concept level, it's just programmatically putting things into context.

## Knowledge Feeding in Practice

> Related concepts: [Knowledge Feeding](/en/guide/knowledge-feeding)

### Organizing Project Documentation

You have a pile of docs you want the agent to know. The problem: stuffing everything into System Instructions will blow out the context window.

Layered strategy:

| Knowledge Type | Where to Put It | Why |
| --- | --- | --- |
| Project conventions, prohibitions | `CLAUDE.md` / `AGENTS.md` | Always needed, small volume (a few hundred words) |
| API docs, design docs | MCP data sources or per-directory | On-demand retrieval, large volume |
| Framework best practices | Skills | On-demand loading, reusable |
| Temporary context | Say it directly in conversation | Use once, discard |

### The Power of Directory-Level Instructions

Large project with different conventions in different directories? Write independent instruction files for each:

```
project/
├── CLAUDE.md / AGENTS.md      # Project-wide rules
├── src/
│   ├── CLAUDE.md              # src directory coding standards
│   ├── api/
│   │   └── CLAUDE.md          # API layer-specific conventions
│   └── components/
│       └── CLAUDE.md          # Component layer-specific conventions
└── scripts/
    └── CLAUDE.md              # Scripts directory conventions
```

Different tools use different filenames (`CLAUDE.md`, `AGENTS.md`, `COPILOT.md`), but the hierarchical merging mechanism is the same. When the agent works on files under `src/api/`, it automatically loads three layers of instructions: project → src → api. You don't need to cram everything into one file.

### A Real CLAUDE.md Example

```markdown
# CLAUDE.md

## Tech Stack
- **VitePress** 1.6.x (static site generator)
- **Bun** (package management and script runner)

## Commands
- `bun install` — install dependencies
- `bun run docs:dev` — dev server
- `bun run docs:build` — build

## Conventions
- Chinese and English updated in sync
- Do NOT use npm/yarn/pnpm
- Pages go in `docs/guide/`, English in `docs/en/guide/`

## Anti-Patterns
- Do NOT introduce Bun.serve or other server APIs
- Do NOT bypass VitePress for frontend work
```

Short, specific, actionable. The agent carries these rules in every request—no need to repeat yourself.

## How to Give Tasks to an Agent

> Related concepts: [The Triangle](/en/guide/actors)

### Requirements First

Don't start with "build me a login page." Describe the requirements:

```
I need a login page with:
1. Email + password login
2. GitHub OAuth support
3. Form validation with zod
4. Styling with Tailwind, no extra CSS files
5. Redirect to /dashboard on successful login
```

How specific should you be? **Specific enough that you can verify "did it do it right?"** If you yourself don't know what "right" looks like, the agent definitely doesn't.

### Small Steps, Fast Feedback

Don't give one massive task. Break it into verifiable steps:

```
Step 1: Create the login form component, UI only, no API connection
(Wait for completion, verify the UI looks right)

Step 2: Connect the API, implement email+password login
(Wait for completion, test the login flow)

Step 3: Add GitHub OAuth
(Wait for completion, test the OAuth flow)
```

You can verify after each step. Catch problems immediately—don't wait for the entire task to finish before reworking.

### Replay Check

After giving requirements, ask the agent to replay its understanding:

```
Before you start, tell me your plan.
```

If the replay is off, you can correct it before a single line of code is written. Much cheaper than rewriting a large chunk of code.

### Leverage Sub-Agents

Break large tasks into independent subtasks, let the agent use sub-agents for parallel processing:

```
This refactoring involves three independent modules:
1. User authentication module (src/auth/)
2. Payment module (src/payment/)
3. Notification module (src/notification/)

The three modules have no cross-dependencies and can be processed in parallel.
Commit each module separately when done.
```

You're describing the task structure; the agent decides whether to use sub-agents for parallel execution. You don't need to know the sub-agent API—you just need to decompose the task clearly.

## Build Feedback Loops

> Related concepts: [Eval / Verification](/en/guide/eval), [Human-in-the-Loop](/en/guide/human-in-the-loop)

### Make the Agent Self-Verify

Include verification steps in your requirements:

```
After implementation:
1. Run `bun run typecheck` to confirm no type errors
2. Run `bun test` to confirm tests pass
3. Run `bun run build` to confirm build succeeds
```

Don't assume the agent will do these automatically. Some agent tools do, some don't. Being explicit is most reliable.

### When to Step In

| Task Type | Your Role | Why |
| --- | --- | --- |
| New files, new features | Verify the result | Low risk, easy to fix |
| Modifying core logic | Watch the process | Medium risk, need to understand changes |
| Deletion, deployment, database ops | Manually approve each step | High risk, irreversible |

The principle of automation (auto-approve): **if the operation is reversible, let go; if it's irreversible, watch closely.**
