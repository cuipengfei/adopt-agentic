# Agent Prompt Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the tutor prompt that gets copied to clipboard, reorder clipboard structure (instructions first), and document the feature in CLAUDE.md.

**Architecture:** Three file changes. Prompt templates rewritten with modular design (boot sequence, teaching loop, terminology translation, jump routing, honesty, links). Vue component reordered to put instructions before tutorial content. CLAUDE.md gets a new section documenting AgentPrompt.

**Tech Stack:** TypeScript (prompt-templates.ts), Vue 3 SFC (AgentPrompt.vue), Markdown (CLAUDE.md)

---

### Task 1: Rewrite Chinese Prompt Template

**Files:**
- Modify: `docs/.vitepress/theme/prompt-templates.ts` (lines 1-32, `ZH_PROMPT_TEMPLATE`)

**Step 1: Read current Chinese prompt template**

Read `docs/.vitepress/theme/prompt-templates.ts` lines 1-32 to confirm current content.

**Step 2: Replace `ZH_PROMPT_TEMPLATE` with new modular prompt**

New content for `ZH_PROMPT_TEMPLATE`:

```typescript
export const ZH_PROMPT_TEMPLATE = `
你是用户的私人导读。下面附了一篇教程章节，帮用户真正理解它——理解到能用出来的程度。

[开始前]
简短总结本章能帮用户解决什么问题，然后用你的原生交互工具（选择题、按钮等，不要纯文字列选项）让用户选一个模式：
- 速通：过完要点
- 深入：逐概念讲透
- 落地到我的项目：读我的代码库，结合真实文件来教
用户不选就默认速通。用户直接问了具体问题就跳过选择，先解决问题。

[教学节奏]
不要照搬原文，用你自己的话讲。
每个概念：
1. 挂到用户已经懂的东西（HTTP、API、Git 等）
2. 讲清楚底层怎么工作的，适当时用 HTTP 请求/响应拆解
3. 给一个用户能马上做的小动作
4. 用原生交互工具问用户：继续 / 深入 / 跳过 / 举个例子
速通模式下可以连续讲几个概念再问；深入模式每个都问。
落地模式下结合用户代码库里的真实文件做例子。

[术语翻译]
教程用通用术语（不绑工具）。你讲的时候，把每个通用概念翻译成你自己生态里的具体名称、文件路径、命令。包括但不限于：System Instructions、内置工具、MCP、Skills、Slash Commands、Hooks、Sub Agent。
落地模式下直接在用户项目里找到对应配置文件，用真实内容做例子。
不支持的功能直接说"我不支持这个"，不要硬凑类比。

[跳读]
用户问了后面的概念？不要拦。先回答，再提一下依赖的前置知识，用原生交互工具让用户选：快速补前置 / 不用补继续。

[链接]
下方章节列表里每个章节有网页链接和 Markdown source 链接。优先 fetch Markdown source（GitHub raw 文件，内容干净）。不能 fetch 就告诉用户，请用户粘贴内容过来。不要假装链接不存在。
`
```

**Step 3: Verify syntax**

Run: `bun run docs:build 2>&1 | head -20`
Expected: No syntax errors in prompt-templates.ts

**Step 4: Commit**

```bash
git add docs/.vitepress/theme/prompt-templates.ts
git commit -m "refactor: rewrite Chinese tutor prompt with modular design"
```

---

### Task 2: Rewrite English Prompt Template

**Files:**
- Modify: `docs/.vitepress/theme/prompt-templates.ts` (lines 34-65, `EN_PROMPT_TEMPLATE`)

**Step 1: Replace `EN_PROMPT_TEMPLATE` with new modular prompt**

New content for `EN_PROMPT_TEMPLATE`:

```typescript
export const EN_PROMPT_TEMPLATE = `
You're the user's private tutor for this material. A tutorial chapter is attached below — help them truly understand it, to the point where they can apply it.

[Before you start]
Briefly summarize what this chapter helps the user do, then use your native interactive tools (selection prompts, buttons — not plain-text A/B/C) to let the user pick a mode:
- Sprint: hit the key points fast
- Deep dive: concept by concept
- Hands-on: read my codebase, teach with my real files
Default to sprint if user doesn't choose. If user asks a specific question, skip selection and answer it first.

[Teaching rhythm]
Don't parrot the source material — explain in your own words.
For each concept:
1. Anchor it to something the user already knows (HTTP, APIs, Git, etc.)
2. Explain the underlying mechanism — use HTTP request/response breakdowns when appropriate
3. Suggest one small action the user can do right now
4. Use native interactive tools to ask: continue / go deeper / skip / show me an example
In sprint mode, batch a few concepts between checkpoints. In deep dive mode, checkpoint after each. In hands-on mode, use real files from the user's project as examples.

[Terminology translation]
The tutorial uses generic, tool-agnostic terms. When you explain, translate every generic concept into the specific names, file paths, and commands from your own ecosystem. Including but not limited to: System Instructions, Built-in Tools, MCP, Skills, Slash Commands, Hooks, Sub Agents.
In hands-on mode, find the actual config files in the user's project and use real content as examples.
If you don't support something, say so honestly. Don't force analogies.

[Jump routing]
User asks about a later concept? Don't block them. Answer the question first, mention prerequisite knowledge needed, then use native interactive tools to offer: quick catch-up / skip and continue.

[Links]
Each chapter in the list below has a web link and a Markdown source link. Prefer fetching the Markdown source (GitHub raw file, clean content). If you can't fetch, tell the user and ask them to paste the content. Never pretend links don't exist.
`
```

**Step 2: Verify syntax**

Run: `bun run docs:build 2>&1 | head -20`
Expected: No syntax errors

**Step 3: Commit**

```bash
git add docs/.vitepress/theme/prompt-templates.ts
git commit -m "refactor: rewrite English tutor prompt with modular design"
```

---

### Task 3: Reorder Clipboard Assembly (Instructions First)

**Files:**
- Modify: `docs/.vitepress/theme/AgentPrompt.vue` (line 86, `fullText` assembly)

**Step 1: Read current clipboard assembly logic**

Read `docs/.vitepress/theme/AgentPrompt.vue` lines 58-88 to confirm the current `fullText` assembly order.

**Step 2: Change assembly order from `content → instructions` to `instructions → content`**

Current line 86:
```typescript
const fullText = `${separator}\n\n${pageText}\n\n${instructionSep}\n\n${prompt.trim()}${relatedText}${allText}`
```

New line 86:
```typescript
const fullText = `${instructionSep}\n\n${prompt.trim()}\n\n${separator}\n\n${pageText}${relatedText}${allText}`
```

**Step 3: Verify build**

Run: `bun run docs:build 2>&1 | head -20`
Expected: Build succeeds

**Step 4: Manual smoke test**

Run: `bun run docs:dev`
Open a guide page, click copy button, paste into a text editor. Verify:
- Instructions appear before tutorial content
- Related chapters and all chapters still appended at end
- No duplicated or missing separators

**Step 5: Commit**

```bash
git add docs/.vitepress/theme/AgentPrompt.vue
git commit -m "refactor: reorder clipboard — instructions before content"
```

---

### Task 4: Document AgentPrompt Feature in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (add new section after "## 反模式" or at appropriate location)

**Step 1: Read CLAUDE.md to find insertion point**

Find the best location — likely after the "已知问题 / TODO" section or before "反模式".

**Step 2: Add AgentPrompt documentation section**

Insert the following section:

```markdown
## AgentPrompt — 私人导读功能

每个 guide 页面顶部有一个"复制"按钮（📋），用户点击后把教程正文 + 导师 prompt + 章节链接列表复制到剪贴板。用户粘贴到自己的 coding agent，agent 变成这篇教程的私人导师。

### 实现文件

| 文件 | 职责 |
| ---- | ---- |
| `docs/.vitepress/theme/prompt-templates.ts` | 中英双语 prompt 模板（`ZH_PROMPT_TEMPLATE` / `EN_PROMPT_TEMPLATE`） |
| `docs/.vitepress/theme/AgentPrompt.vue` | 复制按钮组件，组装剪贴板内容，挂载在 layout.ts 的 `doc-before` 插槽 |
| `docs/.vitepress/data/knowledge-graph.ts` | 章节关系图，用于生成"相关章节"和"全部章节"列表 |

### 剪贴板内容结构

```
[导师指令（prompt-templates.ts）]
[教程正文（页面文字，已去除 SVG/mermaid/anchor）]
[相关章节链接 + Markdown source 链接]
[全部章节链接列表]
```

指令在前、正文在后——对抗 LLM 的 lost-in-the-middle 效应。

### Prompt 设计原则

- **模式选择**：开场让用户选速通/深入/落地到项目，用 agent 原生交互工具（不是纯文字 A/B/C）
- **教学循环**：Anchor（挂到已知概念）→ Mechanism（底层机制）→ Micro-practice（小动作）→ Checkpoint
- **术语翻译**：通用术语映射到用户所用工具的具体名称、路径、命令
- **跳读支持**：用户乱序提问不拦，先答后补前置
- **诚实原则**：不编造不存在的功能/路径/命令
- **不微管理**：不限制输出长度、不强制固定格式，信任 SOTA 模型的判断力

### 修改规则

- 改 prompt 时**中英文必须同步**
- 不加硬性数字限制（"X 句话"、"X 行以内"）
- 保持 agent-agnostic（prompt 不绑特定工具，术语翻译由执行 agent 自己完成）
- 章节链接由 `knowledge-graph.ts` 驱动，新增/删除章节需同步更新
```

**Step 3: Verify CLAUDE.md renders correctly**

Visually check the markdown formatting.

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document AgentPrompt tutor feature in CLAUDE.md"
```

---

### Task 5: Final Verification

**Step 1: Full build**

Run: `bun run docs:build`
Expected: Exit code 0, no errors

**Step 2: Smoke test dev server**

Run: `bun run docs:dev`
- Visit a Chinese guide page → copy button works, clipboard has instructions-first structure
- Visit an English guide page → copy button works, English prompt appears
- Paste clipboard content into text editor → verify structure is correct

**Step 3: Review all changes**

Run: `git diff HEAD~4` to review all 4 commits together. Verify:
- No leftover old prompt text
- ZH and EN prompts are semantically equivalent
- No broken template literals or syntax errors
