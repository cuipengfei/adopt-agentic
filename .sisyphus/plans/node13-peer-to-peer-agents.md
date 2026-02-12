# Plan: 节点 13 — Peer-to-Peer Agents 骨架落地

## TL;DR

> **Quick Summary**: 在教程站骨架中新增节点 13: Peer-to-Peer Agents，作为 frontier 概念放在序列末尾。和之前新增 3 个节点完全同样的流程：新页面 + sidebar + 设计文档同步 + build 通过。
>
> **Deliverables**:
> - 中文骨架页面 `docs/guide/peer-to-peer-agents.md`
> - 英文占位页面 `docs/en/guide/peer-to-peer-agents.md`
> - Sidebar 更新（中英各加一条目）
> - `phase1-content-structure.md` 同步（新增节点 13 定义 + 主线表格 + 决策记录）
> - `docs/guide/index.md` 节点计数注释更新（13→14）
> - Build 通过 + Commit
>
> **Estimated Effort**: Quick
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: Task 1 + Task 2 (parallel) → Task 3 (验证+commit)

---

## Context

### Original Request

用户看了 `materials/industry-insights/global/multi-agent-peer-messaging-analysis.md`，认为 peer-to-peer agents（从层级委派到平级协作的质变）值得在骨架中占一个独立位置。

### Interview Summary

**Key Discussions**:
- 位置: 方案 B — 最末尾（frontier 收尾），节点 12 (HITL) 之后
- 名称: Peer-to-Peer Agents，slug: `peer-to-peer-agents.md`
- 内容框架 4 点（用户确认 "yes, good"）:
  1. 心智模型对比：层级式 vs 平级式
  2. 为什么大多数还是层级：trade-off 分析
  3. 什么任务值得上 team 模式：决策框架
  4. 这是 frontier：方向明确但生态未成熟
- 与现有节点边界: 节点 9（编排通用模型）/ 节点 10（单向委派+隔离）/ 节点 13（双向协作前沿）

### Metis Review

**Identified Gaps** (addressed):
- 节点计数 13→14: auto-resolved，更新 index.md 注释
- Sidebar 是否标 "(Frontier)": default applied，不标——保持纯标题风格一致
- 中文标题是否加括注: default applied，纯英文——与 HITL 风格一致
- Glossary 保持 sidebar 最后: 新条目插在 HITL 后、glossary 前
- Agent-agnostic 破功风险: 写入 guardrail
- Scope creep 风险: 只做最小改动，不顺手重构

---

## Work Objectives

### Core Objective
在 14 节点骨架（0-13）中落地节点 13: Peer-to-Peer Agents 的页面骨架、sidebar 和设计文档。

### Concrete Deliverables
- `docs/guide/peer-to-peer-agents.md` — 中文骨架页面
- `docs/en/guide/peer-to-peer-agents.md` — 英文占位页面
- `docs/.vitepress/config.ts` — sidebar 新增条目 × 2
- `docs/guide/index.md` — 节点计数注释 13→14
- `.sisyphus/plans/phase1-content-structure.md` — 新增节点 13 定义

### Definition of Done
- [x] `bun run docs:build` exit 0
- [x] 2 个新 HTML 文件存在于 dist
- [x] Sidebar 中英均含新链接
- [x] 设计文档包含"节点 13"

### Must Have
- 中文骨架遵循三栏模式（核心概念 + 上下文视角 + 横切关注点）
- Peer-to-peer-agents 在 sidebar 中位于 HITL 之后、glossary 之前
- Agent agnostic：页面不点名任何具体产品
- 页面不引用 `materials/` 内部路径

### Must NOT Have (Guardrails)
- ❌ Phase 2 内容填充（不写正文、不补案例、不补图表）
- ❌ 发布页面出现具体产品名（如 "Claude Code Agent Teams" / "Gas Town"）
- ❌ 重构/分组 sidebar 或顺手调整其它节点
- ❌ 引用 `materials/...` 路径
- ❌ 时间锁定的叙述（如"2026年只有2个产品"）

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**

### Test Decision
- **Infrastructure exists**: YES (bun run docs:build)
- **Automated tests**: None (静态站点，build 即验证)
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY)

```
Scenario: Build passes with new pages
  Tool: Bash
  Steps:
    1. bun run docs:build
    2. Assert: exit code == 0
  Expected Result: Build completes without errors

Scenario: New HTML files exist in dist
  Tool: Bash
  Steps:
    1. test -f docs/.vitepress/dist/guide/peer-to-peer-agents.html
    2. test -f docs/.vitepress/dist/en/guide/peer-to-peer-agents.html
  Expected Result: Both files exist

Scenario: Sidebar contains new links (both locales)
  Tool: Bash (grep)
  Steps:
    1. grep "/guide/peer-to-peer-agents" docs/.vitepress/config.ts
    2. grep "/en/guide/peer-to-peer-agents" docs/.vitepress/config.ts
  Expected Result: Both greps return matches

Scenario: Sidebar order correct (peer-to-peer after HITL, before glossary)
  Tool: Bash (grep -n)
  Steps:
    1. grep -n "human-in-the-loop\|peer-to-peer-agents\|glossary" docs/.vitepress/config.ts
    2. Assert: HITL line < peer-to-peer line < glossary line (both ZH and EN)
  Expected Result: Correct ordering in both locales

Scenario: Design doc updated
  Tool: Bash (grep)
  Steps:
    1. grep "节点 13" .sisyphus/plans/phase1-content-structure.md
    2. grep "Peer-to-Peer" .sisyphus/plans/phase1-content-structure.md
  Expected Result: Both greps return matches

Scenario: Index page node count updated
  Tool: Bash (grep)
  Steps:
    1. grep "14 个节点" docs/guide/index.md
    2. Assert: no "13 个节点" remains
  Expected Result: Count updated to 14

Scenario: No product names in published pages
  Tool: Bash (grep)
  Steps:
    1. grep -i "Claude Code Agent Teams\|Gas Town\|gastown" docs/guide/peer-to-peer-agents.md
    2. Assert: no matches (exit code 1)
  Expected Result: No specific product names

Scenario: No materials path references in published pages
  Tool: Bash (grep)
  Steps:
    1. grep "materials/" docs/guide/peer-to-peer-agents.md
    2. Assert: no matches (exit code 1)
  Expected Result: No materials references
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: 站点文件变更（新页面 + sidebar + index.md）
└── Task 2: 设计文档同步（phase1-content-structure.md）

Wave 2 (After Wave 1):
└── Task 3: 全站验证 + commit

Critical Path: Task 1 → Task 3
Parallel Speedup: Task 1 & 2 同时进行
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2 | None | None (final) |

---

## TODOs

- [x] 1. 站点文件变更

  **What to do**:
  - 创建中文骨架页面 `docs/guide/peer-to-peer-agents.md`，遵循三栏模式
  - 创建英文占位页面 `docs/en/guide/peer-to-peer-agents.md`，沿用 "Translation coming in Phase 2." 模式
  - 更新 `docs/.vitepress/config.ts`：中英 sidebar 各加一条目，插在 HITL 之后、glossary 之前
  - 更新 `docs/guide/index.md`：注释从"13 个节点"改为"14 个节点"

  **Must NOT do**:
  - 不写 Phase 2 内容
  - 不在页面中点名任何具体产品
  - 不引用 `materials/` 路径
  - 不重构 sidebar 结构（只插入一项）
  - 不使用时间锁定叙述

  **中文骨架页面内容要求**（`docs/guide/peer-to-peer-agents.md`）:

  ```markdown
  # Peer-to-Peer Agents

  > **上下文视角**：[对应主线表格的描述]

  ## 心智模型：层级式 vs 平级式
  <!-- TODO(Phase2): 内容填充 -->

  ## 为什么大多数选择层级
  <!-- TODO(Phase2): 内容填充 -->

  ## 什么任务值得平级协作
  <!-- TODO(Phase2): 内容填充 -->

  ## 这是前沿
  <!-- TODO(Phase2): 内容填充 -->

  ## 上下文视角：[回扣主线]
  <!-- TODO(Phase2): 内容填充 -->

  ## 横切关注点
  - **上下文流动**：[具体描述]
  - **风险提示**：[具体描述]
  - **可审计性**：[具体描述]
  ```

  **英文占位页面**（`docs/en/guide/peer-to-peer-agents.md`）:
  ```markdown
  # Peer-to-Peer Agents

  > Translation coming in Phase 2.

  <!-- TODO(Phase2): Translate from Chinese version -->
  ```

  **Sidebar 插入**:
  - 中文: `{ text: 'Peer-to-Peer Agents', link: '/guide/peer-to-peer-agents' }` — 在 L36 (HITL) 之后、L37 (术语表) 之前
  - 英文: `{ text: 'Peer-to-Peer Agents', link: '/en/guide/peer-to-peer-agents' }` — 在 L66 (HITL) 之后、L67 (Glossary) 之前

  **index.md 更新**:
  - L15: `<!-- TODO(Phase2): 13 个节点的链接列表 -->` → `<!-- TODO(Phase2): 14 个节点的链接列表 -->`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [] (纯文件创建和编辑，不需要特殊 skill)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/human-in-the-loop.md` — 中文骨架页面模式（标题 + 上下文视角 blockquote + 多个 ## + 横切关注点）
  - `docs/en/guide/human-in-the-loop.md` — 英文占位页面模式（6 行）
  - `docs/.vitepress/config.ts:36-37` — HITL 和 glossary 之间的插入位置（中文 sidebar）
  - `docs/.vitepress/config.ts:66-67` — HITL 和 glossary 之间的插入位置（英文 sidebar）
  - `docs/guide/index.md:15` — 节点计数注释位置

  **内容框架 References**:
  - `.sisyphus/drafts/node13-peer-to-peer-agents.md` — 内容框架 4 点定义
  - `.sisyphus/plans/phase1-content-structure.md:172-181` — 节点 12 (HITL) 骨架定义模式参考

  **Acceptance Criteria**:
  - [x] `docs/guide/peer-to-peer-agents.md` 存在且包含三栏模式
  - [x] `docs/en/guide/peer-to-peer-agents.md` 存在且为占位格式
  - [x] config.ts 中文 sidebar 含 `/guide/peer-to-peer-agents`
  - [x] config.ts 英文 sidebar 含 `/en/guide/peer-to-peer-agents`
  - [x] Sidebar 顺序: HITL < peer-to-peer < glossary（两个 locale 都是）
  - [x] index.md 注释更新为"14 个节点"
  - [x] 页面无具体产品名
  - [x] 页面无 `materials/` 路径引用

  **Commit**: YES (groups with Task 2)
  - Message: `feat(guide): add node 13 Peer-to-Peer Agents skeleton`
  - Files: `docs/guide/peer-to-peer-agents.md`, `docs/en/guide/peer-to-peer-agents.md`, `docs/.vitepress/config.ts`, `docs/guide/index.md`

---

- [x] 2. 设计文档同步

  **What to do**:
  - 更新 `.sisyphus/plans/phase1-content-structure.md`:
    - 在"设计决策记录"表格的"新增节点"行，从 `知识喂养 + 编排模式 + HITL` 更新为 `知识喂养 + 编排模式 + HITL + Peer-to-Peer Agents`
    - 在节点 12 之后新增"节点 13 — Peer-to-Peer Agents"定义（遵循现有节点定义格式）
    - 在"贯穿全篇的主线"表格新增一行: `Peer-to-Peer Agents | 上下文如何在平级 agent 之间双向流动`
    - 在文档开头 blockquote 更新描述（提及 4 个新节点而非 3 个）

  **Must NOT do**:
  - 不修改其他节点的已有定义
  - 不改变文件整体结构

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [] (纯 markdown 编辑)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `.sisyphus/plans/phase1-content-structure.md:172-181` — 节点 12 的定义格式（最近新增的节点，结构最规范）
  - `.sisyphus/plans/phase1-content-structure.md:186-200` — 主线表格格式
  - `.sisyphus/plans/phase1-content-structure.md:8-20` — 设计决策记录表格格式
  - `.sisyphus/plans/phase1-content-structure.md:3-4` — 文档开头 blockquote

  **节点 13 定义内容**:
  ```markdown
  ### 节点 13 — Peer-to-Peer Agents（新）

  - 定义：从层级委派（orchestrator → worker）到平级协作（agent ↔ agent）的质变——agent 之间可以直接通信、互相 challenge、共享发现
  - 为什么独立成节：这是编排模式的前沿演进，和 sub-agent 的单向委派形成鲜明对比
  - 关键维度：
    - 心智模型对比：层级式 vs 平级式，两者的适用场景
    - 为什么大多数选择层级：协调开销、错误传播、debug 困难、成本等 trade-off
    - 什么任务值得平级协作：用户的决策框架
  - 这是前沿：方向明确但生态尚未成熟，大多数工具仍在层级编排阶段
  - 上下文视角：上下文如何在平级 agent 之间双向流动——不再是单向注入，而是互相交换
  ```

  **Acceptance Criteria**:
  - [x] phase1-content-structure.md 包含"节点 13"和"Peer-to-Peer Agents"
  - [x] 主线表格包含 Peer-to-Peer Agents 行
  - [x] 决策记录表反映 4 个新增节点
  - [x] 文档开头 blockquote 更新

  **Commit**: YES (groups with Task 1)

---

- [x] 3. 全站验证 + Commit

  **What to do**:
  - 运行 `bun run docs:build`，确认 exit 0
  - 验证 2 个新 dist HTML 文件存在
  - 验证 sidebar 顺序正确（HITL < peer-to-peer < glossary）
  - 验证 agent-agnostic guardrail（无产品名、无 materials 引用）
  - Stage 所有变更文件并 commit

  **Must NOT do**:
  - 不 push（用户自行决定）
  - 不修改任何额外文件

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]
    - `git-master`: commit 操作需要遵循规范

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential, after Wave 1)
  - **Blocks**: None (final)
  - **Blocked By**: Task 1, Task 2

  **References**:

  **Verification References**:
  - `docs/.vitepress/dist/guide/peer-to-peer-agents.html` — 构建产物（需存在）
  - `docs/.vitepress/dist/en/guide/peer-to-peer-agents.html` — 构建产物（需存在）

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Build passes
    Tool: Bash
    Steps:
      1. bun run docs:build
      2. Assert: exit code == 0
    Expected Result: Build completes

  Scenario: New HTML files exist
    Tool: Bash
    Steps:
      1. test -f docs/.vitepress/dist/guide/peer-to-peer-agents.html && echo "ZH OK"
      2. test -f docs/.vitepress/dist/en/guide/peer-to-peer-agents.html && echo "EN OK"
    Expected Result: Both "OK"

  Scenario: Sidebar order correct
    Tool: Bash
    Steps:
      1. grep -n "human-in-the-loop\|peer-to-peer-agents\|glossary" docs/.vitepress/config.ts
      2. Verify: HITL line < peer-to-peer line < glossary line (both locales)
    Expected Result: Correct ordering

  Scenario: No product names in new page
    Tool: Bash
    Steps:
      1. grep -iE "Claude Code Agent Teams|Gas Town|gastown" docs/guide/peer-to-peer-agents.md || echo "CLEAN"
    Expected Result: "CLEAN"

  Scenario: No materials references in new page
    Tool: Bash
    Steps:
      1. grep "materials/" docs/guide/peer-to-peer-agents.md || echo "CLEAN"
    Expected Result: "CLEAN"

  Scenario: Node count updated
    Tool: Bash
    Steps:
      1. grep "14 个节点" docs/guide/index.md
      2. ! grep "13 个节点" docs/guide/index.md
    Expected Result: 14 present, 13 absent
  ```

  **Acceptance Criteria**:
  - [x] `bun run docs:build` → exit 0
  - [x] 2 个新 dist HTML 存在
  - [x] Sidebar 顺序正确
  - [x] 无产品名泄漏
  - [x] 无 materials 路径泄漏
  - [x] 节点计数 = 14
  - [x] Commit 完成，工作区干净

  **Commit**: YES
  - Message: `feat(guide): add node 13 Peer-to-Peer Agents skeleton`
  - Files: `docs/guide/peer-to-peer-agents.md`, `docs/en/guide/peer-to-peer-agents.md`, `docs/.vitepress/config.ts`, `docs/guide/index.md`, `.sisyphus/plans/phase1-content-structure.md`
  - Pre-commit: `bun run docs:build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 3 (final) | `feat(guide): add node 13 Peer-to-Peer Agents skeleton` | 5 files | `bun run docs:build` exit 0 |

---

## Success Criteria

### Verification Commands
```bash
bun run docs:build                                    # Expected: exit 0
test -f docs/guide/peer-to-peer-agents.md             # Expected: exists
test -f docs/en/guide/peer-to-peer-agents.md          # Expected: exists
test -f docs/.vitepress/dist/guide/peer-to-peer-agents.html    # Expected: exists
test -f docs/.vitepress/dist/en/guide/peer-to-peer-agents.html # Expected: exists
grep "14 个节点" docs/guide/index.md                  # Expected: match
grep "节点 13" .sisyphus/plans/phase1-content-structure.md     # Expected: match
```

### Final Checklist
- [x] Peer-to-Peer Agents 骨架页面存在（中英）
- [x] Sidebar 正确（中英，HITL < P2P < glossary）
- [x] 设计文档同步（14 节点序列）
- [x] Build 通过
- [x] Commit 完成
- [x] 无 agent-agnostic 违规
