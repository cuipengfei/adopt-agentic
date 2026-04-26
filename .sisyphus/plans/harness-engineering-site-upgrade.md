# Harness Engineering 站点升级计划

## TL;DR

> **Quick Summary**: 把行业普遍共识里的 7 个 Harness Engineering Gap 落到现有 12 对中英章节里（含 glossary），每章新增 1 个 200-500 字中文小节并对齐英文版，glossary 补 7 个新词条，全部通过 4 路并行 review 后一次性 commit 提 PR。
>
> **Deliverables**:
> - 11 个 `docs/guide/*.md` 各新增 1 个小节（中文）+ `docs/guide/glossary.md` 追加 7 个词条
> - 11 个 `docs/en/guide/*.md` 对齐小节（英文）+ `docs/en/guide/glossary.md` 追加 7 个英文词条
> - `docs/guide/glossary.md` + `docs/en/guide/glossary.md` 各补 7 个词条
> - `bun run docs:build` 通过
> - 单 commit + PR 描述列出 7 个 Gap 摘要
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 个 Wave（Wave 0 单 task → Wave 1 中文 12 路并行 → Wave 2 英文 12 路并行，按 task 级依赖 staggered → Final 4 路 reviewer 并行）
> **Critical Path**: 0.1 → 1.x → 2.x → F1-F4 → commit

---

## Context

### Original Request

把 `.sisyphus/plans/harness-engineering-site-upgrade.md`（之前的「升级路线说明书」）转成可执行 real plan：真改 docs/ 双语正文，跑 `bun run docs:build`，准备好提 PR。

### 5 条高频共识

> 这 5 条是后续每章新增小节的概念锚点。属于行业普遍共识，agent 写作时不必逐条标注来源，但必须命中论点。

1. **Hooks vs Rules 边界**：Hooks 处理「必须发生」的事，规则文件处理「应该这样做」的事。
2. **Subagent 的真正价值**：上下文隔离，不只是并行——隔离让短链路能复用主线索，长链路能独立失败。
3. **Definition of Done 必须可执行**：DoD 不能只写「测试通过」，要尽量转成可执行信号（命令、脚本、grep、构建）。
4. **harness 从真实失败里长出来**：CLAUDE.md / hooks / skills 是踩坑后沉淀，不是预先设计。
5. **审批策略的目标不是「更少点按钮」**：而是把人的注意力留给高价值判断；多数审批应自动化或转事后回顾。

### 7 个 Gap（GAP-HE-001 ~ GAP-HE-007）

| Gap ID | 主题 | 类型 | 落点章节 |
| --- | --- | --- | --- |
| GAP-HE-001 (B) | 可执行 Definition of Done | 深度 | actors / human-in-the-loop / in-practice |
| GAP-HE-002 (C) | 失败日志回流到 system instructions | 框架 | knowledge-feeding / in-practice / system-instructions |
| GAP-HE-003 (D) | 执行隔离（subagent / 沙箱 / 工具） | 概念 | sub-agents / orchestration / built-in-tools |
| GAP-HE-004 (E) | 重复工作流沉淀路径（skills / commands / hooks） | 框架 | skills / commands / hooks-and-plugins |
| GAP-HE-005 (F) | 审批疲劳与权限策略闭环 | 深度 | human-in-the-loop / hooks-and-plugins / built-in-tools |
| GAP-HE-006 (F2) | 人的长期能力与认知参与 | 概念 | actors / human-in-the-loop / in-practice |
| GAP-HE-007 (G) | 术语表补项 | 框架 | glossary |

### 来源处理约定

本计划不再列具体来源 URL。所有论点按「行业普遍共识」处理，agent 在写作时：

- 直接陈述共识，不写「根据某某文章」「来源：xxx」之类的 attribution 句式
- 不在站点正文中出现 URL
- 共识范围以本节「5 条高频共识」+「7 个 Gap」+「启发式」三段为准，不向外扩张
- 涉及具体产品名（Anthropic / Cognition 等）的论述，按 Must NOT Have 规则改写为通用表达，除非落在 `built-in-tools` 章节例外区

### 启发式（不能讲太满的）

> 这些数字在共识里出现频率高但口径不一，agent 写作时**不要**当成定论：

- `/clear` 上下文阈值（不同模型、不同任务差异大）
- CLAUDE.md / AGENTS.md 行数上限（团队差异大）
- subagent 单次最长时长 / token 预算（项目差异大）
- 审批 batch size（与权限模型耦合）

### 术语规约

本 plan 所有 agent 写作时必须遵守：

- **Harness Engineering**：保留英文，不造中文译名（无「线束工程」「护栏工程」「外层工程」）。中文正文**首次出现**时配一句中文解释，例：「Harness Engineering（围绕 LLM 搭建的工程外壳）」，之后直接用英文术语。
- **Definition of Done**：保留英文缩写 DoD 可用，首次出现展开。
- **subagent**：小写一词，不写「sub-agent」「Sub Agent」「子 Agent」（正文中可用「子代理」但要与 subagent 标注对应）。
- **hooks**：小写，不写「Hooks」（专有名词上下文除外）。
- **skills / commands**：小写复数形式，不写「技能」「命令」作为术语替代（中文可用「技能」「命令」但需在首次出现时与 skill/command 对照）。
- 其他英文术语（`context window` / `system prompt` / `orchestration` / `workflow`）出现时保持英文，不硬译。

### Interview 关键决策

- **范围**：Task A + B + C + D + E + F + F2 + G（不含 H/I）
- **交付**：真改 docs/ 双语正文，构建过，可提 PR
- **术语**：保留英文 `Harness Engineering`，中文正文首次出现给一句中文解释，不造中文译名
- **篇幅**：每章 1 个新增小节，200-500 字中文，可配 1 个 Mermaid 或表格
- **双语**：中先英后，task 拆「中文 task → 英文对齐 task」
- **可视化**：默认纯文字，按需加 Mermaid（一旦加 Mermaid 触发 `bun run docs:build`）
- **Commit**：全部合一个 commit，message 列出 7 个 Gap 摘要
- **Wave 切法**：按章节切 Wave，每文件 1 task，最大并发 + MECE
- **Final Wave**：4 路 reviewer 全保留，角色按内容站改写

---

## Work Objectives

### Core Objective

把行业共识收敛出的 7 个 Harness Engineering Gap，以最小破坏方式补强进现有 11 对中英正文章节 + glossary对，让站点对「harness 怎么从经验里长出来」这件事说得更具体、更可执行。

### Concrete Deliverables

- 11 个 `docs/guide/*.md` 各新增 1 个小节（中文，200-500 字）：
  `actors.md` / `built-in-tools.md` / `commands.md` / `hooks-and-plugins.md` / `human-in-the-loop.md` / `in-practice.md` / `knowledge-feeding.md` / `orchestration.md` / `skills.md` / `sub-agents.md` / `system-instructions.md`
- 11 个 `docs/en/guide/*.md` 对齐小节
- `docs/guide/glossary.md` + `docs/en/guide/glossary.md` 各补 7 个新词条（与 Gap 相关概念）
- `bun run docs:build` 通过
- 单 commit + PR description

### Definition of Done

- [ ] 25 个 task 全部完成（1 + 12 + 12 = 25；含 Final Wave 4 路 reviewer 合计 29）
- [ ] `bun run docs:build` exit code 0
- [ ] 4 路 Final reviewer 全部 APPROVE
- [ ] git diff 仅触及 24 个 docs 文件（12 个中文 + 12 个英文），sidebar / knowledge-graph / theme / illustrations 零改动

### Must Have

- 每章新增小节内容必须命中对应 Gap 的核心论点
- 中英版本信息点 1:1 对齐（论点数对等，行文可不同）
- `Harness Engineering` 在中英版本术语统一
- glossary 词条与正文出现的概念名一致

### Must NOT Have（Guardrails）

- ❌ 主内容章节出现产品名（Cursor / Windsurf / GitHub Copilot 等）——**例外**：`built-in-tools.md` 章节允许引用 Claude Code / Codex / Gemini CLI / OpenCode 做对比
- ❌ ASCII art 流程图（必须用 Mermaid）
- ❌ 引用 `materials/` / `.sisyphus/` 等内部路径
- ❌ 使用 AGENTS.md 禁用词：心智模型 / 物理形态 / 施力 / 杠杆 / 宪法 / 瞎子 / 发疯 / 伤疤 / 结晶 / 半年前 / 半小时
- ❌ AI filler 词高密度：本质上 / 基本上 / 实际上 / 关键在于（同章不超过 1-2 次）
- ❌ 中文造译名：不写「线束工程」「外层工程」「护栏工程」等
- ❌ 改 sidebar (`docs/.vitepress/config.ts`)、knowledge-graph (`docs/.vitepress/data/knowledge-graph.ts`)、AgentPrompt 模板、illustrations、theme
- ❌ 写英文版（在 Wave 1 中文 task 中）/ 写中文版（在 Wave 2 英文 task 中）
- ❌ 单 task 触及超出其声明的文件
- ❌ 在站点正文写出任何 URL 或来源 attribution 句式

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — 验证全部 agent 执行。

### Test Decision

- **Infrastructure exists**: NO（这是内容站，无单元测试）
- **Automated tests**: NO unit tests — 改用「构建验证 + 双语对照 + 写作纪律审查」
- **Framework**: VitePress 构建（`bun run docs:build`）+ Final Wave 4 路 reviewer

### QA Policy

- 每个写作 task 必须保存 evidence 到 `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`
  - happy path: `.sisyphus/evidence/task-{N}-happy.txt`（含 `wc -w` + `git diff` + `grep` 输出）
  - 加 Mermaid 时: `.sisyphus/evidence/task-{N}-build.log`
- Final Wave evidence 集中到 `.sisyphus/evidence/final-qa/`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0（启动 / 单 task）:
└── 0.1 terminology-anchor [quick] — 零文件改动，确立 Harness Engineering 保留英文规则

Wave 1（中文写作波 / 12 路并发，MECE）:
├── 1.1  actors-zh             [writing] — Gap B + F2
├── 1.2  human-in-the-loop-zh  [writing] — Gap B + F + F2
├── 1.3  in-practice-zh        [writing] — Gap B + C + F2
├── 1.4  system-instructions-zh[writing] — Gap C
├── 1.5  knowledge-feeding-zh  [writing] — Gap C
├── 1.6  sub-agents-zh         [writing] — Gap D
├── 1.7  orchestration-zh      [writing] — Gap D
├── 1.8  skills-zh             [writing] — Gap E
├── 1.9  commands-zh           [writing] — Gap E
├── 1.10 hooks-and-plugins-zh  [writing] — Gap E + F
├── 1.11 built-in-tools-zh     [writing] — Gap D + F
└── 1.12 glossary-zh           [writing] — Gap G（追加 7 个词条到已有文件）

Wave 2（英文对齐波 / 12 路并发，task 级依赖 1.x）:
├── 2.1  actors-en             [writing] — 依赖 1.1
├── 2.2  human-in-the-loop-en  [writing] — 依赖 1.2
├── 2.3  in-practice-en        [writing] — 依赖 1.3
├── 2.4  system-instructions-en[writing] — 依赖 1.4
├── 2.5  knowledge-feeding-en  [writing] — 依赖 1.5
├── 2.6  sub-agents-en         [writing] — 依赖 1.6
├── 2.7  orchestration-en      [writing] — 依赖 1.7
├── 2.8  skills-en             [writing] — 依赖 1.8
├── 2.9  commands-en           [writing] — 依赖 1.9
├── 2.10 hooks-and-plugins-en  [writing] — 依赖 1.10
├── 2.11 built-in-tools-en     [writing] — 依赖 1.11
└── 2.12 glossary-en           [writing] — 依赖 1.12

Final Wave（4 路 reviewer 并发）:
├── F1 plan-compliance-audit          [oracle]
├── F2 writing-discipline-review      [unspecified-high + humanizer-zh]
├── F3 build-and-bilingual-check      [unspecified-high]
└── F4 scope-fidelity-check           [deep]

→ 4 路全 APPROVE → 单 commit → PR

Critical Path: 0.1 → 1.x（最长一个）→ 2.x（对应英文）→ F1-F4 → commit
Max Concurrent: 12（Wave 1 / Wave 2 阶段），4（Final Wave）
```

### Dependency Matrix

| Task | Blocked By | Blocks |
| --- | --- | --- |
| 0.1 | — | 1.1-1.12 |
| 1.1-1.12 | 0.1 | 对应 2.x |
| 2.x | 对应 1.x | F1-F4 |
| F1-F4 | 2.1-2.12 全完成 | commit |

### Agent Dispatch Summary

- **Wave 0**: 1 task → `quick`
- **Wave 1**: 12 task → `writing`（11 个挂 `humanizer-zh` + `adopt-agentic-writer`，`glossary-zh` 仅挂 `adopt-agentic-writer`）
- **Wave 2**: 12 task → `writing`（仅挂 `adopt-agentic-writer`，不挂 `humanizer-zh` 因其为中文专用）
- **Final**: F1 → `oracle`, F2 → `unspecified-high` + `humanizer-zh`, F3 → `unspecified-high`, F4 → `deep`
- **总计**: 25 task + 4 reviewer = 29 个 agent 调度点

---

## TODOs

- [x] 0.1 **terminology-anchor** — Wave 0

  **What to do**:
  - 在本 plan 顶部「Interview 关键决策」之上插入一段「术语规约」声明：保留英文 `Harness Engineering`，中文正文首次出现配中文解释（例：「Harness Engineering（围绕 LLM 搭建的工程外壳）」），不造中文译名。
  - 列出本 plan 涉及的其他英文术语（`Definition of Done` / `subagent` / `hooks` / `skills` 等）的统一写法。
  - 零 docs 文件改动。

  **Must NOT do**: 不动 docs/，不改 sidebar / config / knowledge-graph。

  **Recommended Agent Profile**:
  - **Category**: `quick` — 仅 plan 内文字编辑
  - **Skills**: none

  **Parallelization**: Wave 0，串行；Blocks: 1.1-1.12；Blocked By: 无

  **References**: 本 plan 现有「Interview 关键决策」节、AGENTS.md 写作纪律节

  **Acceptance Criteria**:
  - [ ] plan 中存在「术语规约」段落且明确「保留英文 Harness Engineering」
  - [ ] git diff 仅触及本 plan 文件

  **QA Scenarios**:
  ```
  Scenario: 术语规约段落正确插入（happy）
    Tool: Bash + Read
    Steps:
      1. grep -n '术语规约' .sisyphus/plans/harness-engineering-site-upgrade.md
      2. grep -n '保留英文.*Harness Engineering' .sisyphus/plans/harness-engineering-site-upgrade.md
      3. git diff --name-only HEAD 仅显示 plan 文件
    Expected: 三步全 pass
    Evidence: .sisyphus/evidence/task-0.1-happy.txt
  ```

  **Commit**: NO（统一 commit）

- [x] 1.1 **actors-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/actors.md` 适当位置插入 1 个新增小节（候选标题：「## 角色边界与可执行 Definition of Done」），200-500 字中文。
  - 融合 Gap B（DoD 转可执行信号）+ Gap F2（人的长期能力）的 actors 维度。
  - 引用共识 3：DoD 必须尽量转成可执行信号；共识 5：审批策略把人的注意力留给高价值判断。
  - 首次出现 `Harness Engineering` 配中文解释。
  - 可选：1 个表格列「角色 → 可执行信号 → 兜底人审」三列。

  **Must NOT do**: 见 plan 顶部 Must NOT Have；本 task 额外不写英文版（Wave 2 负责）。

  **Recommended Agent Profile**:
  - **Category**: `writing` — 中文教程内容创作
  - **Skills**: `humanizer-zh`（中文 AI 痕迹清除）, `adopt-agentic-writer`（项目本地写作风格）
  - **Skills Evaluated but Omitted**: `adopt-agentic-vitepress`（不动站点结构）

  **Parallelization**: Wave 1（与 1.2-1.12 并发）；Blocks: 2.1；Blocked By: 0.1

  **References**:
  - `docs/guide/actors.md` 现状：决定新小节插入位置和过渡句
  - 本 plan「5 条高频共识」+「7 个 Gap」节：actors / DoD 相关论点
  - `AGENTS.md` 写作纪律节：禁用词表、AI filler 控制、段落与逻辑、可视化节奏

  **Acceptance Criteria**:
  - [ ] 新增 1 个小节，中文 200-500 字（`wc -m` 字符数 ~ 字数）
  - [ ] 首次出现 `Harness Engineering` 配中文解释
  - [ ] 段落数若 ≥ 3 段需考虑表格
  - [ ] git diff `docs/guide/actors.md` 仅显示新增 hunk
  - [ ] grep 禁用词表在新小节段落内为空
  - [ ] 若加 Mermaid → `bun run docs:build` exit 0

  **QA Scenarios**:
  ```
  Scenario: 新小节合规插入（happy）
    Tool: Bash + Read
    Steps:
      1. Read docs/guide/actors.md 找到新小节
      2. wc -m 验证中文字数 200-500
      3. grep 'Harness Engineering' docs/guide/actors.md
      4. git diff docs/guide/actors.md 仅新增 hunk
      5. grep -E '心智模型|物理形态|施力|杠杆|宪法|瞎子|发疯' 该 hunk 为空
    Expected: 5 步全 pass
    Evidence: .sisyphus/evidence/task-1.1-happy.txt

  Scenario: 加 Mermaid 时构建通过（条件性）
    Tool: Bash
    Preconditions: 新小节含 ```mermaid 块
    Steps: 1. bun run docs:build
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-1.1-build.log
  ```

  **Commit**: NO（统一 commit）

- [x] 1.2 **human-in-the-loop-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/human-in-the-loop.md` 插入 1 个新增小节（候选标题：「## 审批闭环与人的注意力配额」），200-500 字中文。
  - 融合 Gap B（DoD 信号哪些必须人审）+ Gap F（审批疲劳与权限策略闭环）+ Gap F2（人的长期能力）。
  - 引用共识 5：审批策略目标不是「更少点按钮」而是把注意力留给高价值判断。
  - 可选：1 个 Mermaid 图示「自动信号 → 抽样回顾 → 人审升级」三层 funnel。

  **Must NOT do**: 同 plan Must NOT Have；本章节是 HITL 主战场，但避免重复已有内容。

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `humanizer-zh`, `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.2；Blocked By: 0.1

  **References**:
  - `docs/guide/human-in-the-loop.md` 现状
  - 本 plan「5 条高频共识」+ Gap F 表述：审批闭环与权限策略
  - `AGENTS.md` 写作纪律

  **Acceptance Criteria**:
  - [ ] 新增 1 个小节 200-500 字中文
  - [ ] 命中 Gap B + F + F2 三个 Gap 的核心论点（审批 funnel + 注意力配额 + 人长期能力）
  - [ ] 若加 Mermaid → `bun run docs:build` exit 0
  - [ ] git diff 仅 `docs/guide/human-in-the-loop.md` 新增 hunk
  - [ ] 禁用词扫描通过

  **QA Scenarios**:
  ```
  Scenario: 新小节合规且覆盖三 Gap（happy）
    Tool: Bash + Read
    Steps:
      1. Read 新小节
      2. 验证含「审批 / 注意力 / 长期能力」相关表述
      3. wc -m 字数 200-500
      4. git diff 范围正确
      5. 禁用词扫描
    Evidence: .sisyphus/evidence/task-1.2-happy.txt

  Scenario: Mermaid 构建（条件性）
    Tool: Bash; Steps: bun run docs:build; Expected: exit 0
    Evidence: .sisyphus/evidence/task-1.2-build.log
  ```

  **Commit**: NO

- [x] 1.3 **in-practice-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/in-practice.md` 插入 1 个新增小节（候选标题：「## 把 DoD、失败回流、人审节奏放进同一个工作日」），200-500 字中文。
  - 融合 Gap B（DoD 实践场景）+ Gap C（失败日志回流的实操路径）+ Gap F2（开发者长期能力）。
  - 引用共识 4：harness 从真实失败里长出来。
  - 给一个具体场景叙述（如「修一个 bug 的一次完整 agent 协作」），不要抽象列表。

  **Must NOT do**: 不引产品名；不写假大空场景。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.3；Blocked By: 0.1

  **References**: `docs/guide/in-practice.md` 现状；本 plan「5 条高频共识」+ Gap B/C/F2 表述；`AGENTS.md`

  **Acceptance Criteria**:
  - [ ] 新增 1 个小节 200-500 字
  - [ ] 含具体场景叙述而非抽象 bullet list
  - [ ] 命中 B + C + F2 三 Gap
  - [ ] git diff 仅本文件新增 hunk
  - [ ] 禁用词扫描通过

  **QA Scenarios**:
  ```
  Scenario: 场景叙述合规（happy）
    Tool: Bash + Read
    Steps: 1. Read 新小节; 2. 验证含场景叙述; 3. wc -m 200-500; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.3-happy.txt
  ```

  **Commit**: NO

- [x] 1.4 **system-instructions-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/system-instructions.md` 插入 1 个新增小节（候选标题：「## 从失败日志回流到系统指令」），200-500 字中文。
  - 融合 Gap C（失败日志回流到 system instructions 的实操路径）。
  - 说明「什么该进 system instructions / CLAUDE.md」与「什么只在特定 session 用」的判别准则。
  - 可选：1 个表格列「失败类别 → 是否进 system instructions → 原因」。

  **Must NOT do**: 同 plan Must NOT Have；不重复 knowledge-feeding 已讲的内容。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.4；Blocked By: 0.1

  **References**: `docs/guide/system-instructions.md` 现状；`docs/guide/knowledge-feeding.md` 避免重复；本 plan 共识 4；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字中文 / 命中 Gap C / git diff 仅本文件 / 禁用词扫描 / 若加 Mermaid 构建过

  **QA Scenarios**:
  ```
  Scenario: 判别准则明确（happy）
    Tool: Bash + Read
    Steps: 1. Read 新小节; 2. 验证含判别准则叙述; 3. wc -m 200-500; 4. git diff; 5. 禁用词扫描
    Evidence: .sisyphus/evidence/task-1.4-happy.txt
  ```

  **Commit**: NO

- [x] 1.5 **knowledge-feeding-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/knowledge-feeding.md` 插入 1 个新增小节（候选标题：「## 失败日志怎么变成下一轮的 context」），200-500 字中文。
  - 融合 Gap C（回流机制的 knowledge-feeding 维度）。
  - 与 1.4 划清边界：本章讲「怎么采集、怎么限范围、怎么补进下一轮」，不讲「是否进 system instructions」。

  **Must NOT do**: 同 plan Must NOT Have；不跳进 system-instructions 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.5；Blocked By: 0.1

  **References**: `docs/guide/knowledge-feeding.md` 现状；`docs/guide/system-instructions.md` 避免重复；本 plan 共识 4；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字中文 / 命中 Gap C / 与 1.4 话题不重 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: 话题与 1.4 不重复（happy）
    Tool: Bash + Read
    Steps: 1. Read 两者新小节; 2. 论点不重叠; 3. wc -m 200-500; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.5-happy.txt
  ```

  **Commit**: NO

- [x] 1.6 **sub-agents-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/sub-agents.md` 插入 1 个新增小节（候选标题：「## 隔离才是主价值，并发只是顺带」），200-500 字中文。
  - 融合 Gap D（执行隔离 → subagent 维度）。
  - 引用共识 2：subagent 核心价值是上下文隔离，不只是并行。
  - 说明「什么场景需要隔离」：探索 / review / 粗活 / 长日志。

  **Must NOT do**: 同 plan Must NOT Have；不重复 orchestration 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.6；Blocked By: 0.1

  **References**: `docs/guide/sub-agents.md` 现状；`docs/guide/orchestration.md` 边界；本 plan 共识 2；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字中文 / 命中 Gap D / 与 orchestration 话题不重 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: 隔离论点明确（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「隔离 / 上下文」关键字; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.6-happy.txt
  ```

  **Commit**: NO

- [x] 1.7 **orchestration-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/orchestration.md` 插入 1 个新增小节（候选标题：「## 主会话与分会话之间的令牌」），200-500 字中文。
  - 融合 Gap D（执行隔离 → orchestration 维度）。
  - 与 1.6 划清边界：本章讲「主/分 agent 怎么传件、怎么交付、怎么合并结果」。

  **Must NOT do**: 同 plan Must NOT Have；不重复 sub-agents 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.7；Blocked By: 0.1

  **References**: `docs/guide/orchestration.md` 现状；`docs/guide/sub-agents.md` 边界；本 plan 共识 2；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字中文 / 命中 Gap D 交付维度 / 与 1.6 话题不重 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: 交付令牌论点明确（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「交付 / 令牌 / 合并」关键字; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.7-happy.txt
  ```

  **Commit**: NO

- [x] 1.8 **skills-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/skills.md` 插入 1 个新增小节（候选标题：「## 一个重复出现的任务什么时候该沉成 skill」），200-500 字中文。
  - 融合 Gap E（重复工作流沉淀路径 → skill 维度）。
  - 与 1.9/1.10 划清：本章讲 skill 的粒度与触发场景，不讲 command/hook。

  **Must NOT do**: 同 plan Must NOT Have；不跳进 commands / hooks 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.8；Blocked By: 0.1

  **References**: `docs/guide/skills.md` 现状；`docs/guide/commands.md` + `docs/guide/hooks-and-plugins.md` 边界；本 plan 共识 1+4；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字 / 命中 Gap E skill 维度 / 与 1.9/1.10 不重 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: skill 粒度论点明确（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「重复 / 沉淀 / skill」关键字; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.8-happy.txt
  ```

  **Commit**: NO

- [x] 1.9 **commands-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/commands.md` 插入 1 个新增小节（候选标题：「## 什么该写成 command」），200-500 字中文。
  - 融合 Gap E（command 维度）：「Reusable but explicit」的调用点。
  - 与 1.8/1.10 边界：本章讲「显式调用」不讲「被动触发」。

  **Must NOT do**: 同 plan Must NOT Have；不重复 skills/hooks 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.9；Blocked By: 0.1

  **References**: `docs/guide/commands.md` 现状；`docs/guide/skills.md` + `docs/guide/hooks-and-plugins.md` 边界；本 plan 共识 1+4；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字 / 命中 Gap E command 维度 / 与 1.8/1.10 不重 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: command 调用点明确（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「显式 / 调用 / command」关键字; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.9-happy.txt
  ```

  **Commit**: NO

- [x] 1.10 **hooks-and-plugins-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/hooks-and-plugins.md` 插入 1 个新增小节（候选标题：「## hooks 管「必须发生」，规则管「应该这样」」），200-500 字中文。
  - 融合 Gap E（hook 维度）+ Gap F（权限策略闭环）。
  - 引用共识 1：Hooks vs Rules 边界。

  **Must NOT do**: 同 plan Must NOT Have；不重复 skills/commands 话题。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.10；Blocked By: 0.1

  **References**: `docs/guide/hooks-and-plugins.md` 现状；`docs/guide/skills.md` + `docs/guide/commands.md` 边界；本 plan 共识 1+5；`AGENTS.md`

  **Acceptance Criteria**: 200-500 字 / 命中 Gap E hook 维度 + 边界论点 / git diff 仅本文件 / 禁用词扫描

  **QA Scenarios**:
  ```
  Scenario: hooks vs rules 边界明确（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「必须 / 应该 / 边界」论述; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.10-happy.txt
  ```

  **Commit**: NO

- [x] 1.11 **built-in-tools-zh** — Wave 1 中文写作

  **What to do**:
  - 在 `docs/guide/built-in-tools.md` 插入 1 个新增小节（候选标题：「## 内置工具的权限闸与执行隔离」），200-500 字中文。
  - 融合 Gap D（执行隔离 → 内置工具维度）+ Gap F（权限策略）。
  - 本章节是 Must NOT Have 产品名规则的例外：可引 Claude Code / Codex / Gemini CLI / OpenCode 做对比。

  **Must NOT do**: 同 plan Must NOT Have（产品名例外范围仅限本章且仅举其内置工具不做营销）。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.11；Blocked By: 0.1

  **References**: `docs/guide/built-in-tools.md` 现状；本 plan 共识 5 + Gap D/F；`AGENTS.md` 产品名例外规则

  **Acceptance Criteria**: 200-500 字 / 命中 Gap D 内置工具 + Gap F 权限 / git diff 仅本文件 / 禁用词扫描 / 产品名仅出现在对比语境

  **QA Scenarios**:
  ```
  Scenario: 内置工具权限论点（happy）
    Tool: Bash + Read
    Steps: 1. Read; 2. 含「权限 / 隔离」表述; 3. wc -m; 4. git diff; 5. 禁用词
    Evidence: .sisyphus/evidence/task-1.11-happy.txt
  ```

  **Commit**: NO

- [x] 1.12 **glossary-zh** — Wave 1 中文写作

  **What to do**:
  - 在现有 `docs/guide/glossary.md` 追加 7 个词条，一词条一个 Gap：
    1. **Harness Engineering**（Gap A/术语）— 围绕 LLM 搭建的工程外壳。
    2. **可执行 Definition of Done**（Gap B）— 可被脚本/命令/构建验证的完成准则。
    3. **失败日志回流**（Gap C）— 将调试/运行失败转化为下一轮输入的机制。
    4. **执行隔离**（Gap D）— 上下文/权限/工具范围上的分区。
    5. **工作流沉淀**（Gap E）— 重复工作转为 skill/command/hook 的路径。
    6. **审批闭环**（Gap F）— 从自动信号到抑制、抽样、人审升级的完整量化路径。
    7. **认知参与**（Gap F2）— 在 agent 协作中人保持的主动理解、判断、指导质量。
  - 每个词条 1-2 句中文。

  **Must NOT do**: 同 plan Must NOT Have；不造中文译名（「Harness Engineering」保留英文）。

  **Recommended Agent Profile**: `writing` + `humanizer-zh` + `adopt-agentic-writer`

  **Parallelization**: Wave 1；Blocks: 2.12；Blocked By: 0.1

  **References**: `docs/guide/glossary.md` 现状词条格式与排序、上下文；Wave 1 另 11 个 task 产出的概念名（保词条与正文一致）

  **Acceptance Criteria**: 7 个新词条全部追加 / 词条名与 Wave 1 正文出现的概念名一致 / 首词条 Harness Engineering 保留英文 / git diff 仅本文件

  **QA Scenarios**:
  ```
  Scenario: 7 词条均存在且名称一致（happy）
    Tool: Bash + Read
    Steps:
      1. Read docs/guide/glossary.md
      2. grep 上述 7 个词条名
      3. 交叉验证词条名在 Wave 1 产出的 11 个新小节中出现
      4. git diff 仅本文件
    Evidence: .sisyphus/evidence/task-1.12-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.1 **actors-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.1 的中文 diff，把新增小节平行落到 `docs/en/guide/actors.md`
  - 对齐论点 N:N，不引入新概念，不省略
  - 风格对齐已有英文章节，平实工程英文

  **Must NOT do**:
  - 不引入中文版没有的论点 / 术语 / 例子
  - 不写 URL 或来源 attribution
  - 不出现产品名

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]
    - `adopt-agentic-writer`: 教程内容创作 / 双语同步规则
  - **Skills Evaluated but Omitted**:
    - `humanizer-zh`: 中文专用

  **Parallelization**:
  - **Parallel Group**: Wave 2 (与 2.2-2.12 并行)
  - **Blocks**: F1
  - **Blocked By**: 1.1

  **References**:
  - 本 plan「5 条高频共识」第 1、2、3 条
  - Gap 表 GAP-HE-001 / GAP-HE-002
  - `docs/guide/actors.md` 1.1 完成后的 git diff（权威信息源）
  - `docs/en/guide/` 已有英文章节（风格对照）

  **Acceptance Criteria**:
  - [ ] `docs/en/guide/actors.md` 新增小节，论点与 1.1 中文 N:N 对齐
  - [ ] 标题、列表、Mermaid（如有）结构与中文一致
  - [ ] 不出现产品名 / URL / attribution 句式

  **QA Scenarios**:
  ```
  Scenario: 双语对照检查
    Tool: Bash (diff + grep)
    Steps:
      1. 列出中文 1.1 新增小节的所有论点（bullet 标题）
      2. 列出英文 2.1 新增小节的所有论点
      3. 验证条数一致 + 顺序一致 + 信息点一致
      4. grep -E 'Cursor|Windsurf|Copilot|http|martinfowler|seangoedecke' docs/en/guide/actors.md → 仅历史命中
    Evidence: .sisyphus/evidence/task-2.1-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.2 **human-in-the-loop-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.2 中文 diff 平行落到 `docs/en/guide/human-in-the-loop.md`
  - 覆盖审批疲劳 / 高价值判断 / 长期认知参与三条线

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.2

  **References**:
  - 本 plan「5 条高频共识」第 5 条
  - Gap GAP-HE-005 / GAP-HE-006
  - `docs/guide/human-in-the-loop.md` 1.2 git diff

  **Acceptance Criteria**:
  - [ ] 新增小节论点 N:N 对齐 1.2
  - [ ] 三条线（审批 / 判断 / 认知）均落地
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.2-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.3 **in-practice-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.3 中文 diff 平行落到 `docs/en/guide/in-practice.md`
  - 覆盖可执行 DoD / 失败日志回流 / 长期认知参与的实操片段

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.3

  **References**:
  - 本 plan「5 条高频共识」第 3、4 条
  - Gap GAP-HE-003 / GAP-HE-004 / GAP-HE-006
  - `docs/guide/in-practice.md` 1.3 git diff

  **Acceptance Criteria**:
  - [ ] 新增小节论点 N:N 对齐 1.3
  - [ ] 三个 in-practice 片段全部落地
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.3-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.4 **system-instructions-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.4 中文 diff 平行落到 `docs/en/guide/system-instructions.md`
  - 落地「什么进 system instructions / CLAUDE.md vs 什么只在特定 session 用」判别准则

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.4

  **References**:
  - 本 plan「5 条高频共识」第 1 条
  - Gap GAP-HE-001
  - `docs/guide/system-instructions.md` 1.4 git diff

  **Acceptance Criteria**:
  - [ ] 判别准则 N:N 对齐 1.4
  - [ ] 与 knowledge-feeding 的边界用同样的英文表述区分
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.4-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.5 **knowledge-feeding-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.5 中文 diff 平行落到 `docs/en/guide/knowledge-feeding.md`
  - 覆盖失败日志 → 下一轮 context 的回流路径

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.5

  **References**:
  - 本 plan「5 条高频共识」第 4 条
  - Gap GAP-HE-004
  - `docs/guide/knowledge-feeding.md` 1.5 git diff

  **Acceptance Criteria**:
  - [ ] 回流路径 N:N 对齐 1.5
  - [ ] 与 system-instructions 的边界一致
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.5-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.6 **sub-agents-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.6 中文 diff 平行落到 `docs/en/guide/sub-agents.md`
  - 主张「隔离才是主价值，并行只是副产品」

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.6

  **References**:
  - 本 plan「5 条高频共识」第 2 条
  - Gap GAP-HE-002
  - `docs/guide/sub-agents.md` 1.6 git diff

  **Acceptance Criteria**:
  - [ ] 论点 N:N 对齐 1.6
  - [ ] 与 orchestration 的分工区分清楚
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.6-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.7 **orchestration-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.7 中文 diff 平行落到 `docs/en/guide/orchestration.md`
  - 主会话 / 分会话之间的令牌（输入条件 / 返回结构）

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.7

  **References**:
  - 本 plan「5 条高频共识」第 2 条
  - Gap GAP-HE-002
  - `docs/guide/orchestration.md` 1.7 git diff

  **Acceptance Criteria**:
  - [ ] 令牌结构 N:N 对齐 1.7
  - [ ] 与 sub-agents 边界一致
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.7-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.8 **skills-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.8 中文 diff 平行落到 `docs/en/guide/skills.md`
  - 覆盖「什么时候该把重复操作沉成 skill」判别条件

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.8

  **References**:
  - Gap GAP-HE-005
  - `docs/guide/skills.md` 1.8 git diff

  **Acceptance Criteria**:
  - [ ] 判别条件 N:N 对齐 1.8
  - [ ] 与 commands / hooks 的边界用相同英文表述
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.8-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.9 **commands-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.9 中文 diff 平行落到 `docs/en/guide/commands.md`
  - 覆盖「什么该写成显式 command」

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.9

  **References**:
  - Gap GAP-HE-005
  - `docs/guide/commands.md` 1.9 git diff

  **Acceptance Criteria**:
  - [ ] 判别条件 N:N 对齐 1.9
  - [ ] 与 skills / hooks 的边界一致
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.9-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.10 **hooks-and-plugins-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.10 中文 diff 平行落到 `docs/en/guide/hooks-and-plugins.md`
  - hooks 处理「必须发生」/ rules 处理「应该这样做」边界

  **Must NOT do**: 同 2.1

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.10

  **References**:
  - 本 plan「5 条高频共识」第 1 条
  - Gap GAP-HE-005 / GAP-HE-006
  - `docs/guide/hooks-and-plugins.md` 1.10 git diff

  **Acceptance Criteria**:
  - [ ] 边界划分 N:N 对齐 1.10
  - [ ] 与 skills / commands 一致
  - [ ] 无产品名 / URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照
    Tool: Bash
    Steps: 同 2.1 模式
    Evidence: .sisyphus/evidence/task-2.10-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.11 **built-in-tools-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.11 中文 diff 平行落到 `docs/en/guide/built-in-tools.md`
  - 权限闸 + 执行隔离视角；本章允许产品名（Claude Code / Codex / Gemini CLI / OpenCode）但仅作对比

  **Must NOT do**:
  - 不写营销话术
  - 不引入未在中文版出现的产品名
  - 不写 URL 或来源 attribution

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.11

  **References**:
  - 本 plan「5 条高频共识」第 5 条
  - Gap GAP-HE-006
  - `docs/guide/built-in-tools.md` 1.11 git diff

  **Acceptance Criteria**:
  - [ ] 论点与产品名表 N:N 对齐 1.11
  - [ ] 不引入新产品名
  - [ ] 无 URL / attribution

  **QA Scenarios**:
  ```
  Scenario: 双语对照 + 产品名白名单
    Tool: Bash
    Steps:
      1. 对比中英新增小节论点条数
      2. grep 产品名集合，确认与中文版一致
    Evidence: .sisyphus/evidence/task-2.11-happy.txt
  ```

  **Commit**: NO

---

- [x] 2.12 **glossary-en** — Wave 2 英文对齐

  **What to do**:
  - 基于 1.12 中文 diff 平行落到 `docs/en/guide/glossary.md`
  - 追加 7 个词条英文版：Harness Engineering / Executable DoD / Failure-log feedback / Execution isolation / Workflow distillation / Approval-loop closure / Cognitive engagement
  - `Harness Engineering` 词条本身不翻译（与 1.12 一致）

  **Must NOT do**:
  - 不动既有词条
  - 不引入中文版没有的术语

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`]

  **Parallelization**:
  - **Parallel Group**: Wave 2
  - **Blocks**: F1
  - **Blocked By**: 1.12

  **References**:
  - `docs/guide/glossary.md` 1.12 git diff
  - 既有英文 glossary 风格

  **Acceptance Criteria**:
  - [ ] 7 个词条全部追加
  - [ ] 词条名与中文 N:N 对齐（含 Harness Engineering 不翻译）
  - [ ] 风格与既有英文词条一致

  **QA Scenarios**:
  ```
  Scenario: 词条数量与名称对照
    Tool: Bash (grep)
    Steps:
      1. 列出中文新增词条 7 个
      2. 列出英文新增词条 7 个
      3. 验证名称一一对应
    Evidence: .sisyphus/evidence/task-2.12-happy.txt
  ```

  **Commit**: NO


## Final Verification Wave

> 4 路 reviewer 并行。**全部 APPROVE 才能进 commit 步骤**；任意一路 REJECT → 修复对应 task → 重跑该路 + F4 → 全 APPROVE 才放行。

- [x] F1. **plan-compliance-audit** — `oracle`
  读 plan，对照「Must Have」逐条验证：24 个文件是否都有新增小节或 glossary 追加、术语是否统一、glossary 是否补了 7 个词条。扫「Must NOT have」：grep 整个 docs/ diff 找产品名（built-in-tools 章节例外）、ASCII art、`materials/` / `.sisyphus/` 路径引用。验证 evidence 文件全部存在。
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [25/25] | VERDICT: APPROVE/REJECT`
  Evidence: `.sisyphus/evidence/final-qa/F1-compliance.md`

- [x] F2. **writing-discipline-review** — `unspecified-high` + skill `humanizer-zh`
  对 11 个中文新增小节 + glossary 中文追加部分逐一跑 humanizer-zh 检测。grep AGENTS.md 禁用词表；检测 AI filler 词密度（同章不超过 1-2 次）；段落与逻辑（每段单一主旨、长句拆短、列举用 list）。
  Output: `Humanizer [N/11 pass] | 禁用词 [CLEAN/N issues] | Filler [CLEAN/N issues] | VERDICT`
  Evidence: `.sisyphus/evidence/final-qa/F2-writing.md`

- [x] F3. **build-and-bilingual-check** — `unspecified-high`
  跑 `bun install && bun run docs:build`，验证 exit code 0。中英对照阅读 12 对文件（含 glossary），列出每对中文核心论点 → 验证英文有对应表达。验证 `Harness Engineering` 中英术语一致。验证 glossary 中英 7 个词条对齐。
  Output: `Build [PASS/FAIL] | Bilingual [12/12 aligned] | Glossary [7/7 aligned] | VERDICT`
  Evidence: `.sisyphus/evidence/final-qa/F3-build.log` + `F3-bilingual.md`

- [x] F4. **scope-fidelity-check** — `deep`
  `git diff --stat HEAD` 列出所有改动文件，验证只在 `docs/guide/*.md`（12 个）+ `docs/en/guide/*.md`（12 个）范围内。验证 sidebar / knowledge-graph / AgentPrompt 模板 / illustrations / theme 未被偷改。验证邻近章节文件（`cli-tools.md` / `context.md` / `index.md` / `mcp.md` / `peer-to-peer-agents.md`）未被偷改。每个 task 的 git log 只触及它声明的文件。
  Output: `Files [24 in scope/0 out] | Sidebar [INTACT] | KG [INTACT] | Theme [INTACT] | Cross-task [CLEAN/N issues] | VERDICT`
  Evidence: `.sisyphus/evidence/final-qa/F4-scope.md`

---

## Commit Strategy

**单 commit 一次性提交所有 24 个文件**。Final Wave 4 路全 APPROVE 后执行：

```bash
git add docs/guide/{actors,built-in-tools,commands,glossary,hooks-and-plugins,human-in-the-loop,in-practice,knowledge-feeding,orchestration,skills,sub-agents,system-instructions}.md
git add docs/en/guide/{actors,built-in-tools,commands,glossary,hooks-and-plugins,human-in-the-loop,in-practice,knowledge-feeding,orchestration,skills,sub-agents,system-instructions}.md
git commit -m "docs(harness): 补强 Harness Engineering 七大维度，覆盖中英双语正文

- DoD 可执行信号（actors / human-in-the-loop / in-practice）
- 失败日志回流（knowledge-feeding / system-instructions）
- 执行隔离（sub-agents / orchestration / built-in-tools）
- 重复工作流沉淀（skills / commands / hooks-and-plugins）
- 审批疲劳与权限闭环（human-in-the-loop / hooks-and-plugins / built-in-tools）
- 人的长期能力与认知参与（actors / human-in-the-loop / in-practice）
- 术语表统一收录 Harness Engineering 相关 7 个新条目

术语保留英文 Harness Engineering，中文正文首次出现给中文解释。"
```

---

## Success Criteria

### Verification Commands

```bash
# 构建验证
bun install && bun run docs:build  # exit 0

# 范围验证
git diff --stat HEAD --name-only | grep -v -E '^docs/(guide|en/guide)/(actors|built-in-tools|commands|glossary|hooks-and-plugins|human-in-the-loop|in-practice|knowledge-feeding|orchestration|skills|sub-agents|system-instructions)\.md$'
# 期望: 输出为空（无任何越界文件）

# 禁用词验证
grep -nE '心智模型|物理形态|施力|杠杆|宪法|瞎子|发疯|伤疤|结晶|半年前|半小时' docs/guide/*.md
# 期望: 在新增小节中无匹配
```

### Final Checklist

- [x] 25 个 task 全部 ✅
- [x] Final Wave 4 路全 APPROVE
- [x] `bun run docs:build` PASS
- [x] git diff 范围正确（24 个 docs 文件）
- [x] sidebar / knowledge-graph / theme / illustrations 零改动
- [x] 中英术语统一
- [x] glossary 中英对齐
- [x] 单 commit message 列出 7 个 Gap 摘要
