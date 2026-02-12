# Phase 1 — 主体内容结构与骨架

## TL;DR

> **Quick Summary**: 重建 adopt-agentic 教程网站的内容结构，以「一切皆上下文」为叙事主线，按上下文流动顺序排列 10 个概念节点，配置中英双语 i18n 路由。
> 
> **Deliverables**:
> - VitePress i18n 配置（中文 root + 英文子目录）
> - 10 个中文版页面骨架（每页 ≤10 行大纲 + 固定栏位）
> - 10 个英文版页面占位
> - 中英双语首页
> - 最小术语表
> - 修正错误外链
> 
> **Estimated Effort**: Medium（i18n 路由 + 双语页面增加工作量）
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 3/4/5 → Task 6

---

## Context

### Original Request
为 adopt-agentic VitePress 教程网站完成 Phase 1 — 主体内容结构与骨架。基于 draft-ideas.md 的构想，以「上下文（Context）」为第一原则，重建页面结构。

### Interview Summary
**Key Discussions**:
- 目标读者：落后于 AI 浪潮的企业开发者（有开发经验，对 agentic 空白）
- 叙事起点：直接从「上下文」原理切入，不铺 motivation
- API 讲解深度：解释性提及，不展开
- 页面粒度：Phase 1 先 1:1 节点=页面，后续可拆合
- Sidebar 分组：Phase 1 先不管，只定内容节点和顺序
- 站点语言：中英双语，VitePress i18n 正统路由
- 术语命名：用 de facto 业界通用词，正文解释通用性
- 横切关注点：Memory/Safety/Eval 极轻量融入每页固定栏位

**Research Findings**:
- VitePress i18n 用 `locales` 配置，根目录放默认语言，子目录放其他语言
- 现有骨架 9 页与新设计完全不匹配，需完全重建
- 外链指向不存在的 `anthropics/adopt-agentic`，需修正

### Metis Review
**Identified Gaps** (addressed):
- 节点≠页面映射未定 → 决定 1:1
- 站点语言未定 → 决定双语 i18n
- URL slug 未定 → 决定 kebab-case
- 术语中立性 → 用 de facto 通用词 + 正文解释
- "Sub Agent 唯一创造新上下文" → 软化表述
- 外链修正 → Phase 1 顺手修
- 防滑坡 → 每页 ≤10 行大纲 + `TODO(Phase2)` 占位

### Oracle Review
**Identified Gaps** (addressed):
- 节点 0 需要 Agent action loop 落地抽象 → 纳入介绍页骨架
- Memory/Safety/Eval 作为横切关注点 → 极轻量固定栏位
- Built-in Tools vs MCP 容易混淆 → 骨架中明确区分角度
- 叙事可能像"功能列表" → 每页固定"上下文视角"栏位强制叙事回扣

---

## Work Objectives

### Core Objective
重建 VitePress 页面结构和导航配置，使其匹配以「一切皆上下文」为核心的 10 节点叙事线，并配置中英双语 i18n 路由。

### Concrete Deliverables
- `docs/.vitepress/config.ts` — 完全重写（i18n locales + 双语 sidebar + nav）
- `docs/guide/*.md` — 10 个中文版页面骨架（替换旧页面）
- `docs/en/guide/*.md` — 10 个英文版页面占位
- `docs/index.md` — 中文首页（改造）
- `docs/en/index.md` — 英文首页（新建）
- `docs/guide/glossary.md` — 中文术语表
- `docs/en/guide/glossary.md` — 英文术语表

### Definition of Done
- [x] `bun run docs:build` 退出码 0
- [x] 中文版 10 个 guide 页面存在且包含骨架大纲
- [x] 英文版 10 个 guide 页面存在（占位）
- [x] Sidebar 反映新的 10 节点顺序
- [x] 无残留旧页面 slug（why-agentic, prerequisites 等）
- [x] 无指向 anthropics/adopt-agentic 的外链
- [x] 每个中文骨架页包含固定"上下文视角"栏位

### Must Have
- 中英双语 i18n 路由完整工作
- 10 个节点按上下文流动顺序排列
- 每页骨架 ≤10 行大纲
- 所有导航链接正确（sidebar、nav、首页）
- 术语表覆盖核心概念

### Must NOT Have (Guardrails)
- ❌ 不写任何可被视为 Phase 2 的"解释段落/示例/代码/对比表"
- ❌ 不做 Phase 3/4/5（样式、图表、交互）相关改动
- ❌ 不使用绑定特定 Agent 产品的专有术语作为页面标题
- ❌ 每页骨架不超过 10 行大纲 bullet（防滑坡硬限）
- ❌ 不添加 CSS/主题/组件/动画等视觉改动

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision
- **Infrastructure exists**: NO（纯静态站点，无 test framework）
- **Automated tests**: NO
- **Framework**: none

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

所有验证通过 Bash 命令执行，无需人工操作。

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: i18n 配置 + config.ts 重建 + 清理旧页面
└── Task 2: 创建术语表（中英文）

Wave 2 (After Wave 1):
├── Task 3: 中文版 10 个页面骨架
├── Task 4: 英文版 10 个页面占位
└── Task 5: 首页改造 + 外链修正

Wave 3 (After Wave 2):
└── Task 6: 构建验证 + 全站链接检查

Critical Path: Task 1 → Task 3 → Task 6
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5 | 2 |
| 2 | None | None | 1 |
| 3 | 1 | 6 | 4, 5 |
| 4 | 1 | 6 | 3, 5 |
| 5 | 1 | 6 | 3, 4 |
| 6 | 3, 4, 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | task(category="unspecified-high") / task(category="quick") |
| 2 | 3, 4, 5 | task(category="unspecified-high") × 3 parallel |
| 3 | 6 | task(category="quick") |

---

## TODOs

### 前置信息（所有 Task 共享）

**新页面结构 — URL slugs（中英通用）**:

| 节点 | Slug | 中文标题 | 英文标题 |
|------|------|---------|---------|
| 0 | `index.md` | 介绍 | Introduction |
| 1 | `context.md` | 上下文 — 第一原则 | Context — The First Principle |
| 2 | `actors.md` | Agent、用户与 LLM API | Agents, Users & LLM APIs |
| 3 | `system-instructions.md` | System Instructions | System Instructions |
| 4 | `built-in-tools.md` | 内置工具 | Built-in Tools |
| 5 | `mcp.md` | MCP — 外部能力扩展 | MCP — External Capabilities |
| 6 | `commands.md` | Slash Commands | Slash Commands |
| 7 | `skills.md` | Skills — 领域知识模块 | Skills — Domain Modules |
| 8 | `eval.md` | Eval / 验证 / 可观测性 | Eval / Verification / Observability |
| 9 | `sub-agents.md` | Sub Agent — 上下文隔离 | Sub Agents — Context Isolation |
| - | `glossary.md` | 术语表 | Glossary |

**每页骨架模板**（中文版）:
```markdown
# {中文标题}

> **上下文视角**：{一句话说明本节与上下文的关系}

## {要点 1 标题}
<!-- TODO(Phase2): 内容填充 -->

## {要点 2 标题}
<!-- TODO(Phase2): 内容填充 -->

## {要点 N 标题}
<!-- TODO(Phase2): 内容填充 -->

## 横切关注点
- **上下文流动**：{这一步消耗/产生哪些 context？}
- **风险提示**：{失控点？}
- **可审计性**：操作记录可追溯吗？

<!-- TODO(Phase2): 详细内容、示例、图表 -->
```

**每页骨架模板**（英文版占位）:
```markdown
# {English Title}

> Translation coming in Phase 2.

<!-- TODO(Phase2): Translate from Chinese version -->
```

---

- [x] 1. VitePress i18n 配置 + config.ts 重建 + 清理旧页面

  **What to do**:
  - 重写 `docs/.vitepress/config.ts`：
    - 添加 `locales` 配置：`root` = 中文（`zh-CN`），`en` = 英文
    - 中文 sidebar：按新 10 节点顺序（暂不分组，平铺）+ 术语表
    - 英文 sidebar：同结构，英文标题
    - 中文 nav：首页 + 教程
    - 英文 nav：Home + Guide
    - 双语搜索配置（local search + 中文翻译）
    - 保留 `base: '/adopt-agentic/'`
  - 删除旧的 9 个占位页面：`why-agentic.md`, `prerequisites.md`, `agentic-workflows.md`, `tool-use.md`, `prompt-engineering.md`, `first-agent.md`, `multi-agent.md`, `best-practices.md`（保留 `index.md` 但后续会重写）
  - 创建英文目录结构：`docs/en/` 和 `docs/en/guide/`

  **Must NOT do**:
  - 不要写任何页面内容（那是 Task 3/4 的事）
  - 不要加主题/CSS 改动
  - 不要改 `base` 路径

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 配置文件重写涉及多处联动（locales、sidebar、nav、search），需要仔细处理
  - **Skills**: [`git-master`]
    - `git-master`: 需要删除旧文件

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/.vitepress/config.ts` — 现有完整配置，需要完全重写但保留 base 和 head 设置

  **API/Type References**:
  - VitePress i18n 文档：`locales` 配置用 `root` 表示默认语言，子目录表示其他语言
  - VitePress i18n 目录结构：根目录 = 默认语言，`/en/` 子目录 = 英文

  **Documentation References**:
  - `.sisyphus/drafts/phase1-content-structure.md` — 完整的节点列表和顺序

  **External References**:
  - VitePress i18n 官方文档：https://vitepress.dev/guide/i18n

  **VitePress i18n 配置示例**（来自官方文档）:
  ```ts
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/'
    }
  }
  ```

  **要删除的旧文件列表**:
  ```
  docs/guide/why-agentic.md
  docs/guide/prerequisites.md
  docs/guide/agentic-workflows.md
  docs/guide/tool-use.md
  docs/guide/prompt-engineering.md
  docs/guide/first-agent.md
  docs/guide/multi-agent.md
  docs/guide/best-practices.md
  ```

  **新目录结构**:
  ```
  docs/
  ├── .vitepress/config.ts    # 重写
  ├── index.md                # 中文首页（Task 5 改造）
  ├── guide/                  # 中文教程（Task 3 填充）
  │   ├── index.md            # 介绍页
  │   ├── context.md
  │   ├── actors.md
  │   ├── system-instructions.md
  │   ├── built-in-tools.md
  │   ├── mcp.md
  │   ├── commands.md
  │   ├── skills.md
  │   ├── eval.md
  │   ├── sub-agents.md
  │   └── glossary.md
  ├── en/
  │   ├── index.md            # 英文首页（Task 5 创建）
  │   └── guide/              # 英文教程（Task 4 填充）
  │       ├── index.md
  │       ├── context.md
  │       ├── actors.md
  │       ├── system-instructions.md
  │       ├── built-in-tools.md
  │       ├── mcp.md
  │       ├── commands.md
  │       ├── skills.md
  │       ├── eval.md
  │       ├── sub-agents.md
  │       └── glossary.md
  └── public/logo.svg         # 不动
  ```

  **Acceptance Criteria**:

  - [x] `docs/.vitepress/config.ts` 包含 `locales` 配置（root=zh-CN, en=English）
  - [x] `docs/.vitepress/config.ts` 中文 sidebar 包含 10 个节点 + glossary（共 11 条）
  - [x] `docs/.vitepress/config.ts` 英文 sidebar 同结构
  - [x] 旧页面文件已删除（8 个）
  - [x] `docs/en/guide/` 目录已创建

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: config.ts 包含 i18n locales
    Tool: Bash (grep)
    Steps:
      1. grep -c "locales" docs/.vitepress/config.ts
      2. Assert: 输出 >= 1
      3. grep "root:" docs/.vitepress/config.ts
      4. Assert: 匹配存在
      5. grep "zh-CN" docs/.vitepress/config.ts
      6. Assert: 匹配存在
    Expected Result: i18n 配置存在且中文为 root
    Evidence: grep 输出

  Scenario: 旧页面已清理
    Tool: Bash
    Steps:
      1. ls docs/guide/why-agentic.md 2>/dev/null && echo "EXISTS" || echo "GONE"
      2. Assert: 输出为 "GONE"
      3. ls docs/guide/prerequisites.md 2>/dev/null && echo "EXISTS" || echo "GONE"
      4. Assert: 输出为 "GONE"
      5. 对所有 8 个旧文件重复
    Expected Result: 所有旧文件不存在
    Evidence: ls 输出

  Scenario: 英文目录结构已创建
    Tool: Bash
    Steps:
      1. test -d docs/en/guide && echo "EXISTS" || echo "MISSING"
      2. Assert: 输出为 "EXISTS"
    Expected Result: docs/en/guide/ 目录存在
    Evidence: test 输出

  Scenario: sidebar 无旧 slug 残留
    Tool: Bash (grep)
    Steps:
      1. grep -E "why-agentic|prerequisites|agentic-workflows|tool-use|prompt-engineering|first-agent|multi-agent|best-practices" docs/.vitepress/config.ts
      2. Assert: 无输出（退出码 1）
    Expected Result: config.ts 不引用任何旧页面 slug
    Evidence: grep 输出
  ```

  **Commit**: YES
  - Message: `refactor(docs): rebuild VitePress config with i18n and new page structure`
  - Files: `docs/.vitepress/config.ts`, deleted old pages, `docs/en/guide/` directory
  - Pre-commit: `bun run docs:build` (may fail until pages exist — that's expected)

---

- [x] 2. 创建术语表（中英文）

  **What to do**:
  - 创建 `docs/guide/glossary.md`（中文版）：
    - 覆盖 9 个核心概念的中英对照术语
    - 每个术语：中文名 / 英文名 / 一句话定义 / 通用性说明
    - 格式：表格或定义列表
  - 创建 `docs/en/guide/glossary.md`（英文版）：
    - 同结构，英文为主
  - 术语列表（最小版）：
    - 上下文 / Context
    - Agent / Agent
    - LLM API / LLM API
    - 系统指令 / System Instructions (System Prompt)
    - 内置工具 / Built-in Tools
    - 工具调用 / Tool Call (Function Calling)
    - MCP / Model Context Protocol
    - 命令 / Slash Commands (Command Macros)
    - 技能模块 / Skills (Domain Modules)
    - 子代理 / Sub Agent (Worker Agent)
    - Agent 循环 / Agent Loop
    - 上下文窗口 / Context Window
    - 上下文污染 / Context Pollution

  **Must NOT do**:
  - 不写详细定义段落（每条 ≤ 1 句话）
  - 不绑定特定产品名（如 "Claude Code 的 slash command"）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 内容明确，两个文件，格式固定
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Documentation References**:
  - `.sisyphus/drafts/phase1-content-structure.md` — 节点定义和术语约束
  - `draft-ideas.md:50` — 术语通用化原则

  **Acceptance Criteria**:

  - [x] `docs/guide/glossary.md` 存在
  - [x] `docs/en/guide/glossary.md` 存在
  - [x] 中文版包含 ≥ 10 个术语条目
  - [x] 无绑定特定 Agent 产品的术语

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: 术语表文件存在且有内容
    Tool: Bash
    Steps:
      1. test -f docs/guide/glossary.md && wc -l docs/guide/glossary.md
      2. Assert: 文件存在且行数 >= 15
      3. test -f docs/en/guide/glossary.md && wc -l docs/en/guide/glossary.md
      4. Assert: 文件存在且行数 >= 15
    Expected Result: 两个术语表都存在且有实质内容
    Evidence: wc -l 输出

  Scenario: 术语表不含产品专有名词
    Tool: Bash (grep)
    Steps:
      1. grep -i "claude code\|cursor\|copilot\|opencode" docs/guide/glossary.md docs/en/guide/glossary.md
      2. Assert: 无输出（退出码 1）
    Expected Result: 无产品名称绑定
    Evidence: grep 输出
  ```

  **Commit**: YES (groups with Task 1 if same wave)
  - Message: `docs: add bilingual glossary for agentic terminology`
  - Files: `docs/guide/glossary.md`, `docs/en/guide/glossary.md`

---

- [x] 3. 中文版 10 个页面骨架

  **What to do**:
  - 创建/重写 10 个 guide 页面（中文版），每页按骨架模板填充
  - 每页包含：
    - `# 标题`
    - `> 上下文视角：一句话`
    - 3-6 个 `## 要点标题`（每个下面只有 `<!-- TODO(Phase2) -->` 占位）
    - `## 横切关注点`（极轻量：上下文流动 / 风险提示 / 可审计性，各一句话）
    - 尾部 `<!-- TODO(Phase2) -->` 总占位
  - 严格遵守每页 ≤ 10 行大纲 bullet 的限制
  - 具体每页大纲参照下方「各页骨架详情」

  **各页骨架详情**:

  **guide/index.md — 介绍页**:
  ```
  - 本教程是什么、适合谁
  - 核心命题：「一切皆上下文」
  - Agent action loop 概览（Intent → Policy → Actions → Observations → Update → Iterate）
  - 节点导航列表
  ```

  **guide/context.md — 上下文 — 第一原则**:
  ```
  - 什么是上下文（LLM 每次请求的全部信息）
  - 为什么是第一原则（LLM 无记忆）
  - 上下文的局限（token 窗口、信噪比、污染）
  - 前瞻：后续每节的上下文载体
  ```

  **guide/actors.md — Agent、用户与 LLM API**:
  ```
  - 三个角色各是谁
  - 协作循环：意图 → 编排 → 推理 → 执行 → 观察
  - API 格式提及（Messages / Chat Completions / Responses）
  - Agent Loop：为什么是 agentic 而非 chat
  ```

  **guide/system-instructions.md — System Instructions**:
  ```
  - 定义：Agent 注入的系统级 prompt
  - 内容：身份、规则、工具说明、输出格式
  - 来源：开发者硬编码 + 用户可扩展
  - 关键洞察：用户自定义是最强杠杆
  ```

  **guide/built-in-tools.md — 内置工具**:
  ```
  - 定义：Agent 硬编码的能力
  - 通用举例
  - 调用流程：LLM 决定 → Agent 执行 → 结果回上下文
  - 上下文视角：定义 + 返回值都是上下文
  ```

  **guide/mcp.md — MCP**:
  ```
  - 定义：标准化外部能力扩展协议
  - 与内置工具的关系：功能等价，来源不同
  - 上下文视角：LLM 不区分来源
  - 为什么重要：打破封闭生态
  ```

  **guide/commands.md — Slash Commands**:
  ```
  - 定义：用户预定义 prompt 模板
  - 本质：用户侧上下文注入快捷方式
  - 可内嵌内容
  - 与 System Instructions 区别：始终存在 vs 按需触发
  ```

  **guide/skills.md — Skills**:
  ```
  - 定义：可加载的领域知识模块
  - 与 Slash Commands 区别：一次性 vs 持续行为模式
  - 上下文视角：动态注入的 System Instructions 片段
  - 生态系统：社区创建与共享
  ```

  **guide/eval.md — Eval / 验证 / 可观测性**:
  ```
  - 定义：如何知道 agent 做对了
  - 验证层次：工具调用级 / 任务级 / 可观测性
  - 上下文视角：验证结果 = 反馈上下文
  - 企业关注：认知债务
  ```

  **guide/sub-agents.md — Sub Agent**:
  ```
  - 定义：独立上下文环境
  - 解决的问题：主上下文污染
  - 工作方式：创建 → 初始 prompt → 独立执行 → 摘要返回
  - 上下文视角：fork/隔离/压缩上下文的手段之一
  - 回扣第一原则
  ```

  **Must NOT do**:
  - 不写解释段落、示例、代码、对比表
  - 不超过 10 行大纲 bullet per page
  - 不用产品专有名词作为标题

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 10 个文件，每个需要精确匹配骨架模板和设计文档
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - 骨架模板见本计划「前置信息」section

  **Documentation References**:
  - `.sisyphus/drafts/phase1-content-structure.md` — 各节点详细骨架大纲

  **Acceptance Criteria**:

  - [x] 10 个中文 guide 页面存在（index, context, actors, system-instructions, built-in-tools, mcp, commands, skills, eval, sub-agents）
  - [x] 每页包含 `> **上下文视角**` 引用块
  - [x] 每页包含 `## 横切关注点` section
  - [x] 每页包含 `TODO(Phase2)` 占位标记
  - [x] 每页大纲 bullet ≤ 10 行

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: 所有 10 个中文页面存在
    Tool: Bash
    Steps:
      1. for f in index context actors system-instructions built-in-tools mcp commands skills eval sub-agents; do test -f "docs/guide/$f.md" && echo "$f: OK" || echo "$f: MISSING"; done
      2. Assert: 所有 10 个输出 "OK"
    Expected Result: 10 个文件全部存在
    Evidence: 循环输出

  Scenario: 每页包含上下文视角和横切关注点
    Tool: Bash (grep)
    Steps:
      1. for f in docs/guide/context.md docs/guide/actors.md docs/guide/system-instructions.md docs/guide/built-in-tools.md docs/guide/mcp.md docs/guide/commands.md docs/guide/skills.md docs/guide/eval.md docs/guide/sub-agents.md; do echo "=== $f ==="; grep -c "上下文视角" "$f"; grep -c "横切关注点" "$f"; done
      2. Assert: 每个文件的两个 grep 计数都 >= 1
    Expected Result: 所有概念页包含固定栏位
    Evidence: grep 计数输出

  Scenario: 每页包含 Phase2 占位标记
    Tool: Bash (grep)
    Steps:
      1. grep -rl "TODO(Phase2)" docs/guide/ | wc -l
      2. Assert: 输出 >= 10
    Expected Result: 所有页面都有占位标记
    Evidence: grep 输出

  Scenario: 防滑坡检查 — 无过度内容
    Tool: Bash
    Steps:
      1. for f in docs/guide/context.md docs/guide/actors.md docs/guide/system-instructions.md docs/guide/built-in-tools.md docs/guide/mcp.md docs/guide/commands.md docs/guide/skills.md docs/guide/eval.md docs/guide/sub-agents.md; do echo "=== $f: $(wc -l < "$f") lines ==="; done
      2. Assert: 每个文件 ≤ 40 行（骨架模板约 25-35 行）
    Expected Result: 无文件超过合理骨架长度
    Evidence: wc -l 输出
  ```

  **Commit**: YES
  - Message: `docs(zh): add skeleton outlines for 9 concept pages`
  - Files: `docs/guide/*.md`

---

- [x] 4. 英文版 10 个页面占位

  **What to do**:
  - 在 `docs/en/guide/` 下创建 10 个英文页面占位
  - 每页只包含：英文标题 + "Translation coming in Phase 2." + `<!-- TODO(Phase2) -->`
  - 文件名与中文版完全一致（共用 slug）

  **Must NOT do**:
  - 不翻译任何实质内容（Phase 2 的事）
  - 不做任何超出模板的内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 10 个文件，每个只有 5 行，纯模板化操作
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - 英文占位模板见本计划「前置信息」section

  **Documentation References**:
  - 本计划的 slug 和英文标题对照表

  **Acceptance Criteria**:

  - [x] 10 个英文 guide 页面存在于 `docs/en/guide/`
  - [x] 每页包含 `TODO(Phase2)` 标记

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: 所有 10 个英文页面存在
    Tool: Bash
    Steps:
      1. for f in index context actors system-instructions built-in-tools mcp commands skills eval sub-agents; do test -f "docs/en/guide/$f.md" && echo "$f: OK" || echo "$f: MISSING"; done
      2. Assert: 所有 10 个输出 "OK"
    Expected Result: 10 个文件全部存在
    Evidence: 循环输出

  Scenario: 英文页面是占位而非实质内容
    Tool: Bash
    Steps:
      1. for f in docs/en/guide/context.md docs/en/guide/actors.md; do wc -l < "$f"; done
      2. Assert: 每个文件 ≤ 10 行
    Expected Result: 占位文件保持极简
    Evidence: wc -l 输出
  ```

  **Commit**: YES (groups with Task 3)
  - Message: `docs(en): add placeholder pages for English translation`
  - Files: `docs/en/guide/*.md`

---

- [x] 5. 首页改造 + 外链修正

  **What to do**:
  - 重写 `docs/index.md`（中文首页）：
    - hero 标题和 tagline 改为中文
    - 核心命题突出：「一切皆上下文」
    - features 区域匹配新的节点叙事（不是旧的 4 个 feature）
    - "Get Started" 链接指向 `/guide/`
    - "View on GitHub" 链接改为正确的 repo URL（或先用占位 `[DECISION NEEDED: 实际 GitHub repo URL]`，因为目前无 remote）
  - 创建 `docs/en/index.md`（英文首页）：
    - 同结构，英文内容
    - "Get Started" 指向 `/en/guide/`
  - 修正所有指向 `anthropics/adopt-agentic` 的外链：
    - `docs/.vitepress/config.ts` 的 `socialLinks`
    - 任何 markdown 文件中的引用

  **Must NOT do**:
  - 不加花哨的 CSS/动画（Phase 3）
  - 不写超出 hero + features 的内容

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 3 个文件改动，内容明确
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `docs/index.md` — 现有首页结构（VitePress home layout 格式）

  **External References**:
  - VitePress Home Layout 文档：frontmatter `layout: home` + `hero` + `features`

  **Acceptance Criteria**:

  - [x] `docs/index.md` hero 包含中文标题
  - [x] `docs/en/index.md` 存在且包含英文 hero
  - [x] 全站无 `anthropics/adopt-agentic` 引用

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: 中文首页已改造
    Tool: Bash (grep)
    Steps:
      1. grep "layout: home" docs/index.md
      2. Assert: 匹配存在
      3. grep "上下文" docs/index.md
      4. Assert: 匹配存在（核心命题体现）
    Expected Result: 中文首页存在且包含核心命题
    Evidence: grep 输出

  Scenario: 英文首页存在
    Tool: Bash
    Steps:
      1. test -f docs/en/index.md && echo "EXISTS" || echo "MISSING"
      2. Assert: 输出为 "EXISTS"
      3. grep "layout: home" docs/en/index.md
      4. Assert: 匹配存在
    Expected Result: 英文首页存在且使用 home layout
    Evidence: test + grep 输出

  Scenario: 无错误外链残留
    Tool: Bash (grep)
    Steps:
      1. grep -r "anthropics/adopt-agentic" docs/ docs/.vitepress/
      2. Assert: 无输出（退出码 1）
    Expected Result: 全站无错误外链
    Evidence: grep 输出
  ```

  **Commit**: YES
  - Message: `docs: rebuild bilingual home pages and fix external links`
  - Files: `docs/index.md`, `docs/en/index.md`, `docs/.vitepress/config.ts`

---

- [x] 6. 构建验证 + 全站完整性检查

  **What to do**:
  - 运行 `bun run docs:build`，确认退出码 0
  - 验证产物目录 `docs/.vitepress/dist/` 存在
  - 执行全部 QA 场景的综合检查
  - 更新 `CLAUDE.md` 的项目结构部分（反映新的目录结构和 i18n 配置）

  **Must NOT do**:
  - 不做内容修改（只做验证和文档更新）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 纯验证 + 小文档更新
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 3, 4, 5

  **References**:

  **Documentation References**:
  - `CLAUDE.md` — 需更新项目结构部分

  **Acceptance Criteria**:

  - [x] `bun run docs:build` 退出码 0
  - [x] `docs/.vitepress/dist/index.html` 存在
  - [x] `docs/.vitepress/dist/en/index.html` 存在（英文版）
  - [x] CLAUDE.md 反映新的目录结构

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: VitePress 构建成功
    Tool: Bash
    Steps:
      1. bun run docs:build
      2. Assert: 退出码 0
      3. test -f docs/.vitepress/dist/index.html && echo "OK" || echo "MISSING"
      4. Assert: 输出 "OK"
    Expected Result: 构建成功，产物存在
    Evidence: 构建输出 + test 结果

  Scenario: 英文版产物存在
    Tool: Bash
    Steps:
      1. test -f docs/.vitepress/dist/en/index.html && echo "OK" || echo "MISSING"
      2. Assert: 输出 "OK"
    Expected Result: 英文版页面已生成
    Evidence: test 输出

  Scenario: 综合文件计数检查
    Tool: Bash
    Steps:
      1. ls docs/guide/*.md | wc -l
      2. Assert: 输出为 11（10 节点 + 1 glossary）
      3. ls docs/en/guide/*.md | wc -l
      4. Assert: 输出为 11
    Expected Result: 中英版各 11 个文件
    Evidence: wc -l 输出

  Scenario: 术语中立性全站检查
    Tool: Bash (grep)
    Steps:
      1. grep -ri "claude code\|cursor ai\|github copilot chat" docs/guide/ docs/en/guide/
      2. Assert: 无输出（退出码 1）
    Expected Result: 无产品名称绑定
    Evidence: grep 输出
  ```

  **Commit**: YES
  - Message: `docs: update CLAUDE.md to reflect new i18n structure`
  - Files: `CLAUDE.md`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `refactor(docs): rebuild VitePress config with i18n and new page structure` | config.ts, deleted pages, en/ dir | grep checks |
| 2 | `docs: add bilingual glossary for agentic terminology` | glossary.md × 2 | file existence |
| 3 | `docs(zh): add skeleton outlines for 9 concept pages` | docs/guide/*.md | grep + wc |
| 4 | `docs(en): add placeholder pages for English translation` | docs/en/guide/*.md | file existence |
| 5 | `docs: rebuild bilingual home pages and fix external links` | index.md × 2, config.ts | grep |
| 6 | `docs: update CLAUDE.md to reflect new i18n structure` | CLAUDE.md | build success |

---

## Success Criteria

### Verification Commands
```bash
# 构建必须通过
bun run docs:build
# Expected: 退出码 0

# 中文版页面数量
ls docs/guide/*.md | wc -l
# Expected: 11

# 英文版页面数量
ls docs/en/guide/*.md | wc -l
# Expected: 11

# 无旧 slug 残留
grep -E "why-agentic|prerequisites|agentic-workflows|tool-use|prompt-engineering|first-agent|multi-agent|best-practices" docs/.vitepress/config.ts
# Expected: 无输出

# 无错误外链
grep -r "anthropics/adopt-agentic" docs/ docs/.vitepress/
# Expected: 无输出

# 主线回扣覆盖率
grep -rl "上下文视角" docs/guide/ | wc -l
# Expected: >= 9（9 个概念页，介绍页除外）

# 术语中立性
grep -ri "claude code\|cursor ai\|copilot chat" docs/guide/ docs/en/guide/
# Expected: 无输出
```

### Final Checklist
- [x] 所有 "Must Have" 已满足
- [x] 所有 "Must NOT Have" 已遵守
- [x] 构建通过
- [x] 双语导航完整工作
- [x] CLAUDE.md 已更新
