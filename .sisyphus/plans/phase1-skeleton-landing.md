# Phase 1 — 13 节点骨架落地实施计划

## TL;DR

> **Quick Summary**: 将已审核通过的 13 节点内容骨架（0-12）落地到 adopt-agentic 站点——新建页面、更新 sidebar、增补现有页面子项骨架，确保构建通过。
>
> **Deliverables**:
> - 6 个新 markdown 文件（中文骨架 × 3 + 英文占位 × 3）
> - config.ts sidebar 中英双语更新（插入 3 新节点 + 调整顺序）
> - 7 个现有中文页面增补子项 section 骨架
> - `bun run docs:build` 通过 + 所有 sidebar 链接可访问
>
> **Estimated Effort**: Short（~30 min agent work）
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Wave 1 (全部并行) → Wave 2 (验证)

---

## Context

### Original Request

将 adopt-agentic 教程站从 10 节点升级到 13 节点（0-12），经过完整的 gap audit → brainstorming → Metis/Momus review 流程后，将升级后的骨架落地到实际站点。

### Interview Summary

**Key Discussions**:
- 新增 3 个节点：知识喂养(8)、编排模式(9)、Human-in-the-loop(12)
- 现有节点增补子项：context + State&Memory, actors + 任务下达, system-instructions + prompt 是资产(轻提), built-in-tools/mcp + 信任边界(轻提), eval + 可靠性&错误恢复
- eval 和 sub-agents 顺序互换（原 eval→sub-agents，新 sub-agents→eval）
- 中英结构强一致，英文为占位页
- Eval 深度边界 = 个人可操作层
- 每个新页面使用现有骨架格式

**Research Findings**:
- 现有页面格式一致：标题 → 上下文视角引言 → sections(TODO Phase2) → 横切关注点三栏
- 英文占位页格式统一：标题 → "Translation coming in Phase 2." → TODO comment
- config.ts sidebar 是按路径前缀映射到扁平数组
- eval.md 有 "企业关注：认知债务与漂移" section 需替换（认知债务已移到 HITL）
- index.md 有 "10 个节点" 占位文字需更新为 13

### Metis Review

**Identified Gaps** (addressed):
- slug 确认：使用用户已确认的 `knowledge-feeding` / `orchestration` / `human-in-the-loop`
- 介绍页深度：只更新 TODO 注释中的数字（10→13），不写正文
- eval 认知债务：section 替换为"可靠性 & 错误恢复"，横切关注点改措辞
- 术语表：Phase 2 范围，本次不改
- "轻提"形态：新增 `##` 标题 + TODO，保持页面结构一致性
- 全站搜索 "10 个节点" 残留并修正

### Authority Source

内容骨架的唯一真相来源：`.sisyphus/plans/phase1-content-structure.md`（节点 0-12）。

---

## Work Objectives

### Core Objective

将 13 节点内容骨架的结构变更落地到站点文件系统，使站点反映最新的节点序列和子项设计。

### Concrete Deliverables

- 6 个新 markdown 文件
- 1 个 config.ts 文件更新
- 7 个现有 markdown 文件更新
- 构建通过 + 所有页面可访问

### Definition of Done

- [x] `bun run docs:build` exit code = 0
- [x] 所有 14 个新/改文件存在且内容正确
- [x] 6 个新 dist HTML 文件存在
- [x] sidebar 顺序与 phase1-content-structure.md 一致

### Must Have

- 新页面必须 follow 现有骨架格式（上下文视角引言 + sections + 横切关注点）
- 中英 sidebar 条目数和顺序完全一致
- 每个新 section 都是 `##` 标题 + `<!-- TODO(Phase2): 内容填充 -->` 形式
- eval.md "企业关注" section 替换为"可靠性 & 错误恢复"
- eval.md 横切关注点中不主讲"认知债务"（已移到 HITL）

### Must NOT Have (Guardrails)

- **禁止 Phase 2 内容填充**：除标题/上下文视角引言/TODO 占位外不写正文
- **禁止改 sidebar 分组/主题样式**：sidebar 保持扁平数组
- **禁止改 config.ts 非 sidebar 部分**：base/head/favicon/搜索/footer 不动
- **禁止改术语表内容**：Phase 2 范围
- **禁止改英文页面内容**：英文页面只做占位
- **禁止站点页面引用 materials/ 路径**
- **禁止使用 npm/yarn/pnpm**：统一用 bun

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES（VitePress build）
- **Automated tests**: None（静态站不需要 unit tests）
- **Framework**: N/A
- **Primary Verification**: Agent-Executed QA（build + file existence + sidebar order check）

### Agent-Executed QA Scenarios (MANDATORY)

所有验收由 agent 直接执行命令完成，零人工介入。

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 全部并行):
├── Task 1: 新建 6 个页面文件（中文骨架 × 3 + 英文占位 × 3）
├── Task 2: 更新 config.ts sidebar（中英双语）
└── Task 3: 更新 7 个现有中文页面

Wave 2 (After Wave 1):
└── Task 4: 全站验证 + 残留文字清理 + 最终 build

Critical Path: Wave 1 → Wave 2
Parallel Speedup: Wave 1 内 3 个 task 可并行
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4 | 2, 3 |
| 2 | None | 4 | 1, 3 |
| 3 | None | 4 | 1, 2 |
| 4 | 1, 2, 3 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | task(category="quick", load_skills=[], run_in_background=true) × 3 并行 |
| 2 | 4 | task(category="quick", load_skills=[], run_in_background=false) |

---

## TODOs

### ━━ Wave 1 — 并行执行 ━━

- [x] 1. 新建 6 个页面文件

  **What to do**:

  创建 3 个中文骨架页面和 3 个英文占位页面。

  **中文骨架页面**（参照 `docs/guide/context.md` 格式）：

  **A) `docs/guide/knowledge-feeding.md`（节点 8 — 知识喂养）**

  ```markdown
  # 知识喂养

  > **上下文视角**：无论哪条路径注入知识，最终都是往上下文里放信息 — 区别在于什么时候放、放多少、放多久。

  ## 定义：系统性知识注入
  <!-- TODO(Phase2): 内容填充 -->

  ## 为什么需要统一视角
  <!-- TODO(Phase2): 内容填充 -->

  ## 三条路径对比
  <!-- TODO(Phase2): System Instructions / MCP 数据源 / Skills -->

  ## 选择标准：什么时候用什么
  <!-- TODO(Phase2): 内容填充 -->

  ## 上下文视角：殊途同归
  <!-- TODO(Phase2): 内容填充 -->

  ## 横切关注点
  - **上下文流动**：消耗=项目文档、内部规范、领域经验；产生=结构化知识进入上下文窗口。
  - **风险提示**：知识注入过多会挤占推理空间，过少会导致 Agent 臆造。
  - **可审计性**：知识来源可追溯，注入路径可对照。

  <!-- TODO(Phase2): 详细内容、示例、图表 -->
  ```

  **B) `docs/guide/orchestration.md`（节点 9 — 编排模式）**

  ```markdown
  # 编排模式

  > **上下文视角**：不同编排模式决定了上下文如何在多步骤、多分支间流动、分裂与汇合。

  ## 定义：Agent 的干活方式
  <!-- TODO(Phase2): 内容填充 -->

  ## 为什么使用者需要懂
  <!-- TODO(Phase2): 内容填充 -->

  ## 常见模式
  <!-- TODO(Phase2): 顺序执行 / 并行分支 / 计划-执行 / 迭代循环 -->

  ## 上下文视角：上下文如何在多分支间流动
  <!-- TODO(Phase2): 内容填充 -->

  ## 与 Sub Agent 的关系
  <!-- TODO(Phase2): 内容填充 -->

  ## 横切关注点
  - **上下文流动**：消耗=任务拆解与分支策略；产生=多路上下文汇合为最终结果。
  - **风险提示**：编排不当导致上下文碎片化或分支结果冲突。
  - **可审计性**：编排路径与分支决策可追溯、可重放。

  <!-- TODO(Phase2): 详细内容、示例、图表 -->
  ```

  **C) `docs/guide/human-in-the-loop.md`（节点 12 — Human-in-the-Loop）**

  ```markdown
  # Human-in-the-Loop

  > **上下文视角**：人决定上下文的最终走向 — 选择接受、修正或丢弃 Agent 的产出。

  ## 定义：你在工作流中的角色
  <!-- TODO(Phase2): 内容填充 -->

  ## 为什么独立成节
  <!-- TODO(Phase2): 内容填充 -->

  ## 放手 vs 介入
  <!-- TODO(Phase2): 内容填充 -->

  ## 审批点设置
  <!-- TODO(Phase2): 内容填充 -->

  ## 纠偏策略
  <!-- TODO(Phase2): 内容填充 -->

  ## 认知债务
  <!-- TODO(Phase2): 内容填充 -->

  ## 上下文视角：人决定上下文的走向
  <!-- TODO(Phase2): 内容填充 -->

  ## 横切关注点
  - **上下文流动**：消耗=Agent 产出与验证结果；产生=人的决策反馈回注上下文。
  - **风险提示**：过度委托导致对系统理解的稀释（认知债务）。
  - **可审计性**：人的每次介入决策（批准/拒绝/修正）可记录。

  <!-- TODO(Phase2): 详细内容、示例、图表 -->
  ```

  **英文占位页面**（参照 `docs/en/guide/eval.md` 格式）：

  **D) `docs/en/guide/knowledge-feeding.md`**
  ```markdown
  # Knowledge Feeding

  > Translation coming in Phase 2.

  <!-- TODO(Phase2): Translate from Chinese version -->
  ```

  **E) `docs/en/guide/orchestration.md`**
  ```markdown
  # Orchestration Patterns

  > Translation coming in Phase 2.

  <!-- TODO(Phase2): Translate from Chinese version -->
  ```

  **F) `docs/en/guide/human-in-the-loop.md`**
  ```markdown
  # Human-in-the-Loop

  > Translation coming in Phase 2.

  <!-- TODO(Phase2): Translate from Chinese version -->
  ```

  **Must NOT do**:
  - 不写任何 Phase 2 正文内容
  - 不偏离现有骨架格式
  - 不加 frontmatter（现有概念页面都没有 frontmatter）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的文件创建，模板化操作
  - **Skills**: `[]`
    - 无需特殊 skill

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References** (现有页面格式模板):
  - `docs/guide/context.md:1-23` — 中文骨架完整示例：标题 + 上下文视角引言 + sections + 横切关注点
  - `docs/guide/sub-agents.md:1-23` — 另一个中文骨架示例
  - `docs/en/guide/eval.md:1-6` — 英文占位页格式模板

  **Content References** (新节点的内容定义):
  - `.sisyphus/plans/phase1-content-structure.md:126-148` — 节点 8（知识喂养）的完整定义
  - `.sisyphus/plans/phase1-content-structure.md:137-148` — 节点 9（编排模式）的完整定义
  - `.sisyphus/plans/phase1-content-structure.md:172-181` — 节点 12（HITL）的完整定义

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 6 个新文件全部存在
    Tool: Bash
    Steps:
      1. test -f docs/guide/knowledge-feeding.md
      2. test -f docs/guide/orchestration.md
      3. test -f docs/guide/human-in-the-loop.md
      4. test -f docs/en/guide/knowledge-feeding.md
      5. test -f docs/en/guide/orchestration.md
      6. test -f docs/en/guide/human-in-the-loop.md
    Expected Result: 全部 exit code = 0

  Scenario: 中文页面包含横切关注点
    Tool: Bash (grep)
    Steps:
      1. grep -l "横切关注点" docs/guide/knowledge-feeding.md docs/guide/orchestration.md docs/guide/human-in-the-loop.md
    Expected Result: 3 个文件全部匹配

  Scenario: 英文页面包含占位文字
    Tool: Bash (grep)
    Steps:
      1. grep -l "Translation coming in Phase 2" docs/en/guide/knowledge-feeding.md docs/en/guide/orchestration.md docs/en/guide/human-in-the-loop.md
    Expected Result: 3 个文件全部匹配
  ```

  **Commit**: YES (groups with Tasks 2, 3, 4)
  - Message: `feat(guide): land 13-node skeleton — add 3 new concept pages, update sidebar & existing pages`
  - 等 Wave 2 验证通过后统一 commit

---

- [x] 2. 更新 config.ts sidebar（中英双语）

  **What to do**:

  编辑 `docs/.vitepress/config.ts`，在中英两套 sidebar 中：
  1. 在 Skills 后面插入 3 个新节点
  2. 调换 Eval 和 Sub Agents 的顺序（Sub Agents 在前，Eval 在后）

  **目标 sidebar 顺序（中文，`config.ts:23-35`）**:
  ```typescript
  sidebar: {
    '/guide/': [
      { text: '介绍', link: '/guide/' },
      { text: '上下文 — 第一原则', link: '/guide/context' },
      { text: 'Agent、用户与 LLM API', link: '/guide/actors' },
      { text: 'System Instructions', link: '/guide/system-instructions' },
      { text: '内置工具', link: '/guide/built-in-tools' },
      { text: 'MCP — 外部能力扩展', link: '/guide/mcp' },
      { text: 'Slash Commands', link: '/guide/commands' },
      { text: 'Skills — 领域知识模块', link: '/guide/skills' },
      { text: '知识喂养', link: '/guide/knowledge-feeding' },
      { text: '编排模式', link: '/guide/orchestration' },
      { text: 'Sub Agent — 上下文隔离', link: '/guide/sub-agents' },
      { text: 'Eval / 验证 / 可观测性', link: '/guide/eval' },
      { text: 'Human-in-the-Loop', link: '/guide/human-in-the-loop' },
      { text: '术语表', link: '/guide/glossary' },
    ],
  },
  ```

  **目标 sidebar 顺序（英文，`config.ts:49-62`）**:
  ```typescript
  sidebar: {
    '/en/guide/': [
      { text: 'Introduction', link: '/en/guide/' },
      { text: 'Context — The First Principle', link: '/en/guide/context' },
      { text: 'Agents Users & LLM APIs', link: '/en/guide/actors' },
      { text: 'System Instructions', link: '/en/guide/system-instructions' },
      { text: 'Built-in Tools', link: '/en/guide/built-in-tools' },
      { text: 'MCP — External Capabilities', link: '/en/guide/mcp' },
      { text: 'Slash Commands', link: '/en/guide/commands' },
      { text: 'Skills — Domain Modules', link: '/en/guide/skills' },
      { text: 'Knowledge Feeding', link: '/en/guide/knowledge-feeding' },
      { text: 'Orchestration Patterns', link: '/en/guide/orchestration' },
      { text: 'Sub Agents — Context Isolation', link: '/en/guide/sub-agents' },
      { text: 'Eval / Verification / Observability', link: '/en/guide/eval' },
      { text: 'Human-in-the-Loop', link: '/en/guide/human-in-the-loop' },
      { text: 'Glossary', link: '/en/guide/glossary' },
    ],
  },
  ```

  **关键变更点**:
  - Skills 后面插入：知识喂养 → 编排模式
  - Sub Agents **移到** Eval **之前**（原来是 Eval 在前）
  - Eval 后面插入：Human-in-the-Loop
  - Glossary 保持最后

  **Must NOT do**:
  - 不改 sidebar 以外的任何 config（base/head/nav/search/footer 不动）
  - 不改 sidebar 为分组格式（保持扁平数组）
  - 不改 locale 配置

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件编辑，明确的目标状态
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/.vitepress/config.ts:23-35` — 当前中文 sidebar（需要修改的确切位置）
  - `docs/.vitepress/config.ts:49-62` — 当前英文 sidebar（需要修改的确切位置）

  **Content References**:
  - `.sisyphus/plans/phase1-content-structure.md:34-201` — 节点 0-12 权威序列

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: sidebar 包含所有 13 个节点 + glossary
    Tool: Bash (grep)
    Steps:
      1. grep "knowledge-feeding" docs/.vitepress/config.ts
      2. grep "orchestration" docs/.vitepress/config.ts
      3. grep "human-in-the-loop" docs/.vitepress/config.ts
    Expected Result: 每个 grep 至少匹配 2 行（中英各 1）

  Scenario: sidebar 顺序正确（sub-agents 在 eval 前）
    Tool: Bash
    Steps:
      1. 在 config.ts 中检查中文 sidebar：sub-agents 行号 < eval 行号
      2. 在 config.ts 中检查英文 sidebar：sub-agents 行号 < eval 行号
    Expected Result: 两套 sidebar 中 sub-agents 都在 eval 之前

  Scenario: config.ts 非 sidebar 部分未被修改
    Tool: Bash
    Steps:
      1. 检查 base 仍为 '/adopt-agentic/'
      2. 检查 search provider 仍为 'local'
    Expected Result: 配置值未变
  ```

  **Commit**: YES (groups with Tasks 1, 3, 4)

---

- [x] 3. 更新 7 个现有中文页面

  **What to do**:

  为 7 个现有中文页面增补子项 section 骨架（`##` 标题 + TODO），以及修正 eval.md 的结构变更。

  **A) `docs/guide/context.md` — 加 State & Memory 子项**

  在 `## 上下文的局限` 之后、`## 前瞻` 之前插入：
  ```markdown
  ## State & Memory
  <!-- TODO(Phase2): 内容填充 -->
  ```

  **B) `docs/guide/actors.md` — 加"怎么给 Agent 下任务"子项**

  在 `## 为什么是 agentic 而非 chat` 之后、`## 横切关注点` 之前插入：
  ```markdown
  ## 怎么给 Agent 下任务
  <!-- TODO(Phase2): 内容填充 -->
  ```

  **C) `docs/guide/system-instructions.md` — 轻提 prompt 是资产**

  在 `## 关键洞察：用户自定义是最强杠杆` 之后、`## 横切关注点` 之前插入：
  ```markdown
  ## 轻提：Prompt 是可维护资产
  <!-- TODO(Phase2): 内容填充 -->
  ```

  **D) `docs/guide/built-in-tools.md` — 轻提信任边界**

  在 `## 上下文视角：为什么工具会改变推理` 之后、`## 横切关注点` 之前插入：
  ```markdown
  ## 轻提：信任边界
  <!-- TODO(Phase2): 内容填充 -->
  ```

  **E) `docs/guide/mcp.md` — 轻提信任边界**

  在 `## 为什么重要：生态与可移植性` 之后、`## 横切关注点` 之前插入：
  ```markdown
  ## 轻提：信任边界
  <!-- TODO(Phase2): 内容填充 -->
  ```

  **F) `docs/guide/eval.md` — 替换 section + 更新横切关注点**

  1. 将 `## 企业关注：认知债务与漂移` 替换为：
  ```markdown
  ## 可靠性 & 错误恢复
  <!-- TODO(Phase2): 内容填充 -->
  ```

  2. 更新横切关注点中的风险提示（移除"认知债务"主讲）：
  将：
  ```
  - **风险提示**：验证不足会把问题延后，最终变成难以偿还的认知债务。
  ```
  替换为：
  ```
  - **风险提示**：验证不足会把问题延后放大，错误在链路中层层累积。
  ```

  **G) `docs/guide/index.md` — 更新节点数**

  将 `<!-- TODO(Phase2): 10 个节点的链接列表 -->` 改为：
  ```
  <!-- TODO(Phase2): 13 个节点的链接列表 -->
  ```

  **Must NOT do**:
  - 不写 Phase 2 正文内容（只加 `##` 标题 + TODO）
  - 不改现有 section 的标题或内容（除 eval.md 明确要求的替换）
  - 不改横切关注点的结构格式
  - 不改英文页面（英文增补等 Phase 2 翻译时统一做）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 多文件小幅编辑，每个编辑点都有明确的 before/after
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References** (编辑位置):
  - `docs/guide/context.md:12-14` — 插入点：`## 上下文的局限` 后
  - `docs/guide/actors.md:14-16` — 插入点：`## 为什么是 agentic 而非 chat` 后
  - `docs/guide/system-instructions.md:14-16` — 插入点：`## 关键洞察` 后
  - `docs/guide/built-in-tools.md:14-16` — 插入点：`## 上下文视角` 后
  - `docs/guide/mcp.md:14-16` — 插入点：`## 为什么重要` 后
  - `docs/guide/eval.md:14-15` — 替换目标：`## 企业关注：认知债务与漂移`
  - `docs/guide/eval.md:19` — 替换目标：横切关注点中的风险提示
  - `docs/guide/index.md:15` — 替换目标：`10 个节点`

  **Content References** (增补内容来源):
  - `.sisyphus/plans/phase1-content-structure.md:49-56` — 节点 1 State & Memory 定义
  - `.sisyphus/plans/phase1-content-structure.md:59-67` — 节点 2 "怎么给 agent 下任务" 定义
  - `.sisyphus/plans/phase1-content-structure.md:74-79` — 节点 3 prompt 是资产
  - `.sisyphus/plans/phase1-content-structure.md:86-90` — 节点 4 信任边界
  - `.sisyphus/plans/phase1-content-structure.md:96-100` — 节点 5 信任边界
  - `.sisyphus/plans/phase1-content-structure.md:159-169` — 节点 11 可靠性 & 错误恢复

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 新增 section 标题存在
    Tool: Bash (grep)
    Steps:
      1. grep "## State & Memory" docs/guide/context.md
      2. grep "## 怎么给 Agent 下任务" docs/guide/actors.md
      3. grep "## 轻提：Prompt 是可维护资产" docs/guide/system-instructions.md
      4. grep "## 轻提：信任边界" docs/guide/built-in-tools.md
      5. grep "## 轻提：信任边界" docs/guide/mcp.md
      6. grep "## 可靠性 & 错误恢复" docs/guide/eval.md
    Expected Result: 全部匹配

  Scenario: eval.md "企业关注" 已移除
    Tool: Bash (grep)
    Steps:
      1. grep "企业关注" docs/guide/eval.md
    Expected Result: exit code = 1（无匹配）

  Scenario: eval.md 横切关注点中不再主讲认知债务
    Tool: Bash (grep)
    Steps:
      1. grep "认知债务" docs/guide/eval.md
    Expected Result: exit code = 1（无匹配）

  Scenario: index.md 已更新为 13 节点
    Tool: Bash (grep)
    Steps:
      1. grep "13 个节点" docs/guide/index.md
    Expected Result: 匹配 1 行

  Scenario: 没有残留的 "10 个节点" 文字
    Tool: Bash (grep)
    Steps:
      1. grep -r "10 个节点" docs/guide/
    Expected Result: exit code = 1（无匹配）
  ```

  **Commit**: YES (groups with Tasks 1, 2, 4)

---

### ━━ Wave 2 — 依赖 Wave 1 ━━

- [x] 4. 全站验证

  **What to do**:

  1. 搜索全站可能遗漏的 "10 个节点" / "10 nodes" 残留文字并修正
  2. 运行 `bun run docs:build`
  3. 验证 dist 产物中新页面 HTML 文件存在
  4. 验证 sidebar 顺序正确

  **Must NOT do**:
  - 不修正任何非本次任务范围的问题（如 favicon 不一致等已知 TODO）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 命令执行 + 验证检查
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential, final)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  - `docs/.vitepress/config.ts` — sidebar 配置
  - `docs/guide/*.md` — 所有中文 guide 页面
  - `docs/en/guide/*.md` — 所有英文 guide 页面
  - `CLAUDE.md` — 构建命令参考

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 全站无 "10 个节点" 残留
    Tool: Bash (grep -r)
    Steps:
      1. grep -r "10 个节点" docs/
      2. grep -r "10 nodes" docs/
    Expected Result: 两个 grep 都 exit code = 1（无匹配）

  Scenario: bun run docs:build 通过
    Tool: Bash
    Steps:
      1. bun run docs:build
    Expected Result: exit code = 0

  Scenario: 新页面 dist HTML 存在
    Tool: Bash
    Steps:
      1. test -f docs/.vitepress/dist/guide/knowledge-feeding.html
      2. test -f docs/.vitepress/dist/guide/orchestration.html
      3. test -f docs/.vitepress/dist/guide/human-in-the-loop.html
      4. test -f docs/.vitepress/dist/en/guide/knowledge-feeding.html
      5. test -f docs/.vitepress/dist/en/guide/orchestration.html
      6. test -f docs/.vitepress/dist/en/guide/human-in-the-loop.html
    Expected Result: 全部 exit code = 0

  Scenario: sidebar 顺序验证
    Tool: Bash
    Steps:
      1. 用 grep -n 获取 config.ts 中 sub-agents 和 eval 的行号
      2. 验证中文 sidebar: sub-agents 行号 < eval 行号
      3. 验证英文 sidebar: sub-agents 行号 < eval 行号
    Expected Result: 两套 sidebar 中 sub-agents 都在 eval 之前

  Scenario: 中英 sidebar 节点数一致
    Tool: Bash
    Steps:
      1. grep -c "link:" docs/.vitepress/config.ts 的中文 sidebar 部分
      2. grep -c "link:" docs/.vitepress/config.ts 的英文 sidebar 部分
    Expected Result: 两边条目数相同（14 条：13 节点 + glossary）
  ```

  **Commit**: YES (统一 commit)
  - Message: `feat(guide): land 13-node skeleton — add 3 new concept pages, update sidebar & existing pages`
  - Files: 全部 14 个新建/修改的文件
  - Pre-commit: `bun run docs:build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 4 (final) | `feat(guide): land 13-node skeleton — add 3 new concept pages, update sidebar & existing pages` | 6 new + 8 edited files | `bun run docs:build` exit 0 |

所有改动统一为一个 commit。不做中间 commit，因为 sidebar 指向不存在的页面会导致构建警告。

---

## Success Criteria

### Verification Commands
```bash
# 构建通过
bun run docs:build                    # Expected: exit 0

# 新文件存在（中文）
test -f docs/guide/knowledge-feeding.md && echo ok     # Expected: ok
test -f docs/guide/orchestration.md && echo ok          # Expected: ok
test -f docs/guide/human-in-the-loop.md && echo ok      # Expected: ok

# 新文件存在（英文）
test -f docs/en/guide/knowledge-feeding.md && echo ok   # Expected: ok
test -f docs/en/guide/orchestration.md && echo ok        # Expected: ok
test -f docs/en/guide/human-in-the-loop.md && echo ok    # Expected: ok

# dist 产物存在
test -f docs/.vitepress/dist/guide/knowledge-feeding.html && echo ok
test -f docs/.vitepress/dist/guide/orchestration.html && echo ok
test -f docs/.vitepress/dist/guide/human-in-the-loop.html && echo ok
test -f docs/.vitepress/dist/en/guide/knowledge-feeding.html && echo ok
test -f docs/.vitepress/dist/en/guide/orchestration.html && echo ok
test -f docs/.vitepress/dist/en/guide/human-in-the-loop.html && echo ok

# 无残留旧数字
grep -r "10 个节点" docs/ ; echo "exit: $?"    # Expected: exit: 1
grep -r "10 nodes" docs/ ; echo "exit: $?"      # Expected: exit: 1
```

### Final Checklist
- [x] 所有 "Must Have" 满足
- [x] 所有 "Must NOT Have" 未违反
- [x] `bun run docs:build` exit 0
- [x] 6 个新 dist HTML 文件存在
- [x] 中英 sidebar 各 14 条（13 节点 + glossary），顺序一致
- [x] eval.md 不再包含"企业关注"和"认知债务"
- [x] 所有新 section 使用 `## 标题 + TODO(Phase2)` 格式
