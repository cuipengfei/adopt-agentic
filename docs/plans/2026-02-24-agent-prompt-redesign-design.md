# Agent Prompt Redesign — Design Document

**Date**: 2026-02-24
**Status**: Approved
**Scope**: Rewrite `prompt-templates.ts` (ZH + EN) and update `AgentPrompt.vue` copy structure

## Background

Every guide page has a copy button. User clicks → clipboard gets tutorial text + prompt instructions + chapter links. User pastes into their coding agent → agent becomes a private tutor for that chapter.

### Current Implementation

- `docs/.vitepress/theme/prompt-templates.ts` — ZH/EN prompt templates
- `docs/.vitepress/theme/AgentPrompt.vue` — copy button component, assembles clipboard content
- `docs/.vitepress/data/knowledge-graph.ts` — chapter relationships for "related chapters" section

### Current Clipboard Structure

```
--- Tutorial Content ---
[full page text, SVG/mermaid/anchors stripped]
--- Instructions ---
[prompt]
[related chapters with URLs + raw markdown links]
[all chapters list]
```

## Analysis Sources

Three specialist agents analyzed the current prompt:

- **Oracle** (prompt engineering quality): Missing boot sequence, no priority system, lost-in-the-middle risk, three-lens-per-concept too mechanical
- **Metis** (instructional design): Need dynamic learner profiling, teaching loop protocol (Anchor→Mechanism→Practice→Checkpoint), jump routing, TEACH/ACT dual mode
- **Artistry** (creative approaches): Live Auditor (scan user codebase), Sandbox Puzzle, Reverse Mentorship — rejected for default prompt, may explore per-chapter later

## Design Decisions (User-Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Default persona | Mode selection (sprint/deep/hands-on) + teaching loop | Oracle's boot protocol + Metis's teaching cycle combined |
| Reading user files | Allowed by default, no extra permission step | Coding agents already have file read permissions |
| Three-lens closing | Removed as hard rule, agent decides | SOTA models are smart, don't micromanage |
| Artistry modes | None in default prompt | Too aggressive for universal default; explore per-chapter later |
| Clipboard structure | Instructions first, then content | Combat lost-in-the-middle effect |
| Chapter list | Keep all 16 chapters | User preference |
| HTTP request/response | Keep but flexible | Core tutorial feature, don't force every concept |
| Hard numeric limits | None ("2 sentences", "6 lines" etc. removed) | SOTA models judge output length themselves |
| Interactive tools | Prompt instructs agent to use native question/choice tools | Better UX than plain text A/B/C |

## New Prompt Design (Modular)

### Module 1: Boot Sequence

Summarize what this chapter solves, then use native interactive tools to let user pick a mode:

- **Sprint**: hit the key points fast
- **Deep dive**: concept by concept
- **Hands-on**: read my codebase, teach with my real files

Default to sprint. If user asks a specific question, skip selection and answer first.

### Module 2: Teaching Loop

Per concept:
1. **Anchor** — map to something user already knows (HTTP, API, Git)
2. **Mechanism** — how it works under the hood, HTTP req/res when appropriate
3. **Micro-practice** — one small action user can do right now
4. **Checkpoint** — native interactive tool: continue / go deeper / skip / show example

Sprint mode: batch a few concepts between checkpoints.
Deep mode: checkpoint after each.
Hands-on mode: use real files from user's project as examples.

### Module 3: Terminology Translation

Translate all generic terms to agent's own ecosystem: System Instructions, Built-in Tools, MCP, Skills, Slash Commands, Hooks, Sub Agents.

In hands-on mode: find actual config files in user's project, use real paths and content.

If unsupported, say so honestly. No forced analogies.

### Module 4: Jump Routing

User asks about a later concept? Don't block.
1. Answer the question first
2. Mention prerequisite knowledge needed
3. Native interactive tool: quick catch-up / skip and continue

### Module 5: Honesty

Don't fabricate features, paths, or commands that don't exist. Unsupported = say unsupported.

### Module 6: Link Handling

Chapter list includes web URLs and Markdown source (GitHub raw) links. Prefer fetching Markdown source. Can't fetch → tell user, ask them to paste content. Never pretend links don't exist.

## Clipboard Structure Change

```
Before:
  [tutorial text] → [instructions] → [chapter links]

After:
  [instructions] → [tutorial text] → [chapter links]
```

## Scope of Changes

### Files to Modify

1. **`docs/.vitepress/theme/prompt-templates.ts`** — Rewrite ZH_PROMPT_TEMPLATE and EN_PROMPT_TEMPLATE
2. **`docs/.vitepress/theme/AgentPrompt.vue`** — Reorder clipboard assembly (instructions before content)
3. **`CLAUDE.md`** — Add documentation for the AgentPrompt feature

### Files NOT Changed

- `knowledge-graph.ts` — no changes
- Tutorial content (`docs/guide/*.md`) — no changes
- Any other theme components — no changes

## Future Exploration (Not In This Scope)

- Per-chapter prompt enhancements (Artistry's sandbox/reverse-mentorship ideas)
- Analytics on copy button usage
- Copy content preview (expandable section showing what gets copied)
