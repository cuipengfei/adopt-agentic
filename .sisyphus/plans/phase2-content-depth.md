# Phase 2 — 内容补深与融入

## TL;DR

> **Quick Summary**: 基于 POMASA Gap Analysis 和全量审视的发现，对 9 个教程节点文件进行内容补深和融入，填补 3 个 P1 盲区（并行治理/长时 Loop/团队配置）、轻量补充 3 个 P2 观察项、融入 3 个"它山之石"洞察。所有改动中英双语同步。
> 
> **Deliverables**: 
> - 9 个中文节点文件（`docs/guide/*.md`）内容扩展
> - 9 个英文节点文件（`docs/en/guide/*.md`）同步更新
> - 全局一致性验证通过
> 
> **Estimated Effort**: Medium-Large（9 个节点 × 2 语言 = 18 个文件修改）
> **Parallel Execution**: YES — 3 waves（受 provider concurrency=3 限制）+ 1 收敛 wave
> **Critical Path**: Wave 1-3 可全并行 → Wave 4 收敛检查

---

## Context

### Original Request
把 POMASA 研究的 review-addendum 中的 9 个待执行项 + 1 个全局方向（STONE-006），转化为可执行的内容扩展计划。

### Interview Summary
**Key Discussions**:
- 按节点文件分组（而非按 GAP/STONE 逐个），减少 context switching
- STONE-006（概念→决策框架）不独立列任务，作为横切写法指令融入每个 TODO
- GAP-002 拆两个 TODO（actors.md + eval.md），可并行
- 5 个位置选择全部按建议确认
- 写作 sub-agent 必须用 opus 4.6（`4141/claude-opus-4.6`）
- 可参考 materials/industry-insights/ 和 POMASA 原始数据

**Research Findings**:
- POMASA Gap Analysis 覆盖率 94.1%，骨架设计合理
- 盲区性质："缺深度"而非"缺概念"——不需要新建节点或修改骨架
- 现有内容已是教程质量（HTTP 请求/响应模式、实操建议、风险提示）
- 行业素材已有按节点索引（`materials/industry-insights/synthesis/consensus-node-map.md`）

### Metis Review
**Identified Gaps** (addressed):
- GAP 子要点需硬绑定为每个 TODO 的 Must-Have 子交付物（已纳入）
- STONE-006 允许形态需显式定义，防止写成 decision tree/checklist（已纳入）
- "Session" 等关键术语需在计划中统一定义（已纳入术语表）
- actors vs eval 的 GAP-002 分工边界需明确（已纳入）
- 最后需要一个全局一致性 pass（已纳入为 TODO 10）
- STONE-005 反模式清单避免写成可执行 checklist，用"症状→后果→修复策略"三段式（已纳入）
- STONE-006 覆盖范围需显式声明（已纳入：本轮只覆盖 9 个 TODO 涉及的节点）

---

## Work Objectives

### Core Objective
补深 3 个 P1 内容盲区、轻量补充 3 个 P2 观察项、融入 3 个"它山之石"洞察，同时对所涉节点应用 STONE-006 的"概念→决策框架"写法升级。

### Concrete Deliverables
- 18 个 markdown 文件的精确 Edit（9 中 + 9 英）
- `bun run docs:build` 构建通过

### Definition of Done
- [ ] 所有 9 个 GAP/STONE 的核心子要点在对应节点中可 grep 到
- [ ] 中英双语同步（每个 TODO 的 CN/EN 文件都被修改）
- [ ] 构建通过（`bun run docs:build` 退出码 0）
- [ ] 无内部路径泄漏（`materials/` `.sisyphus/` 未出现在站点文件中）
- [ ] 无产品名违禁（`Cursor` `Windsurf` `GitHub Copilot` 等未出现在 guide/ 中）

### Must Have
- 每个 GAP 的全部子要点（见各 TODO 的 Must-Have 清单）
- 每个 STONE 的融入内容
- STONE-006 决策框架元素（至少每个高改动量 TODO 包含 1 个）
- 保留现有节点末尾的"读每一节时，留意这三件事"结构
- 中英文同步完成

### Must NOT Have (Guardrails)
- ❌ 新建页面、新 sidebar 条目、新信息架构改动
- ❌ 修改 `.vitepress/config.ts`
- ❌ Decision tree / 可执行 checklist（已有内容决策禁止）
- ❌ 在 `docs/guide/` 或 `docs/en/guide/` 中引用 `materials/` 或 `.sisyphus/` 路径
- ❌ 在主内容中出现 Cursor、Windsurf、GitHub Copilot 等具体产品名（In Practice 除外）
- ❌ AI 写作痕迹（pivotal, crucial, game-changing 等 puffery 词汇）
- ❌ 重写其他未列入 TODO 的节点文件（STONE-003 不重写 built-in-tools/mcp，只做交叉链接）
- ❌ 组织架构、KPI、权限审批等超纲内容（团队治理限于"个人/小团队可执行动作"）
- ❌ 破坏现有节点的叙事结构和已有内容

---

## 术语统一表（所有 TODO 共享）

> 所有写作 sub-agent 的 prompt 中必须包含此表。防止并行写作导致术语/翻译漂移。

| 英文术语 | 中文固定译法 | 备注 |
|---------|------------|------|
| session | 会话 | 不用"对话"或"线程" |
| parallel session | 并行会话 | 不用"多会话" |
| checkpoint | 检查点 | 不用"存档点" |
| stop condition | 停止条件 | 不用"终止条件" |
| long-running loop | 长时运行循环 | 简称"长循环" |
| decision framework | 决策框架 | **不是** decision tree |
| anti-pattern | 反模式 | |
| conductor | 指挥者 | 音乐比喻语境；不翻译为"导体" |
| governance | 治理 | |
| knowledge debt | 知识债务 | 类比技术债务 |
| context poisoning | 上下文污染 | |
| session handoff | 会话交接 | |
| worktree | 工作树 | Git 术语 |
| vibe coding | vibe coding | 不翻译，保持英文 |
| context engineering | 上下文工程 | |

---

## STONE-006 横切指令（所有 TODO 共享）

> "从概念解释提升到决策框架" 不是独立任务，而是贯穿每个 TODO 的写法升级。

### 允许形态
- ✅ 2-3 条决策启发式（"何时 X / 何时 Y"的简短对比段落）
- ✅ 小对比表格（2-3 行，场景 × 推荐做法）
- ✅ "如果…那么…"的条件判断段落
- ✅ 权衡点的一句话总结

### 禁止形态
- ❌ Decision tree（树形分支决策图）
- ❌ 可执行 Checklist（步骤 1/2/3 的执行清单）
- ❌ 评分矩阵 / 打分卡

### 模板示例（可直接复用）
```markdown
## 何时 X / 何时 Y

| 场景 | 推荐做法 | 理由 |
|------|---------|------|
| 任务间无依赖 | 并行 | 总时间 ≈ 最慢分支 |
| 任务间有顺序依赖 | 串行 | 上一步输出是下一步输入 |
| 不确定有无依赖 | 先串行，证明安全后再并行 | 串行出错容易定位 |
```

### 覆盖范围
本轮 STONE-006 只对这 9 个 TODO 涉及的节点生效。以下高热度节点**本轮不做**决策框架升级，留待后续：
- `built-in-tools.md`（节点 4）
- `mcp.md`（节点 5）
- `sub-agents.md`（节点 12）

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**

### Test Decision
- **Infrastructure exists**: NO（纯文档站，无 unit test 框架）
- **Automated tests**: None（不适用）
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY)

每个 TODO 完成后，执行以下验证：

**Scenario 1: Build 验证**
```
Tool: Bash
Steps:
  1. bun run docs:build
  2. Assert: 退出码 0，无 build error
Evidence: 构建输出截取
```

**Scenario 2: 双语同步验证**
```
Tool: Bash
Steps:
  1. git diff --name-only
  2. Assert: 对应 TODO 的 docs/guide/<x>.md 与 docs/en/guide/<x>.md 均在列表中
Evidence: git diff 输出
```

**Scenario 3: 路径泄漏检查**
```
Tool: Bash (grep)
Steps:
  1. grep -R -n -E "materials/|\.sisyphus/" docs/guide docs/en/guide
  2. Assert: 无输出（grep 退出码 1）
Evidence: grep 退出码
```

**Scenario 4: 产品名禁令检查**
```
Tool: Bash (grep)
Steps:
  1. grep -R -n -E "Cursor|Windsurf|GitHub Copilot|\.cursorrules|copilot-instructions\.md" docs/guide docs/en/guide
  2. Assert: 无输出
Evidence: grep 退出码
```

**Scenario 5: 占位符残留检查**
```
Tool: Bash (grep)
Steps:
  1. grep -R -n -E "TBD|TODO:|FIXME" docs/guide docs/en/guide
  2. Assert: 无输出（或仅匹配已有的合法上下文）
Evidence: grep 输出
```

---

## Execution Strategy

### Sub-Agent 指定（所有写作 TODO 共用）

> **关键约束**：用户要求写作/编辑 sub-agent 必须使用 `4141/claude-opus-4.6` 模型。

**调度方式**：
```
task(
  subagent_type="sisyphus",           ← opus 4.6（oh-my-opencode.json 中 sisyphus 绑定的模型）
  load_skills=["adopt-agentic-writer"],  ← 十人混血儿写作风格 + HTTP 技术解释模式
  ...
)
```

**为什么不用其他选项**：
- `category="writing"` → 会使用 `4142/gemini-2.5-pro`，不是 opus 4.6 ❌
- `subagent_type="sisyphus-junior"` → 会使用 `4141/claude-sonnet-4.5`，不是 opus 4.6 ❌
- `subagent_type="hephaestus"` → 会使用 `4141/gpt-5.3-codex`，不是 opus 4.6 ❌

**Provider 并发限制**：`4141` 的 `providerConcurrency: 3`，所以最多同时跑 3 个 sisyphus sub-agent。

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 重量级优先):
├── TODO 1: orchestration.md (GAP-001 + STONE-004) [重]
├── TODO 2: actors.md (GAP-002 Part A) [中]
└── TODO 3: eval.md (GAP-002 Part B + STONE-005) [重]

Wave 2 (After Wave 1):
├── TODO 4: system-instructions.md (GAP-003 Part A) [中]
├── TODO 5: knowledge-feeding.md (GAP-003 Part B) [中]
└── TODO 6: context.md (GAP-004) [轻]

Wave 3 (After Wave 2):
├── TODO 7: index.md (STONE-001) [轻]
├── TODO 8: skills.md (STONE-002) [轻]
└── TODO 9: hooks-and-plugins.md (STONE-003) [轻]

Wave 4 (After Wave 3 — 收敛):
└── TODO 10: 全局一致性检查
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1-3 | None | 10 | Each other (Wave 1) |
| 4-6 | None | 10 | Each other (Wave 2) |
| 7-9 | None | 10 | Each other (Wave 3) |
| 10 | 1-9 (all) | None | None (final) |

> **Note**: TODO 1-9 之间无真正的文件级依赖。分 wave 纯粹是因为 provider concurrency=3 的限制。如果并发允许，1-9 可全部同时启动。

### Agent Dispatch Summary

| Wave | Tasks | Agent Spec |
|------|-------|-----------|
| 1 | 1, 2, 3 | `task(subagent_type="sisyphus", load_skills=["adopt-agentic-writer"], run_in_background=true)` |
| 2 | 4, 5, 6 | 同上 |
| 3 | 7, 8, 9 | 同上 |
| 4 | 10 | `task(subagent_type="sisyphus-junior", load_skills=[], run_in_background=false)` — 收敛检查不需要 opus |

---

## TODOs

### 每个 TODO 的共享指令（必须包含在所有写作 prompt 中）

```
共享指令（复制到每个 TODO 的 prompt 中）：
1. 加载 adopt-agentic-writer skill 并严格遵循其写作规范
2. 使用"术语统一表"中的固定译法
3. 遵循 STONE-006 横切指令：在合适位置添加决策框架元素（用允许形态，禁止 decision tree/checklist）
4. 保留现有节点末尾的"读每一节时，留意这三件事"结构，新增内容放在该结构之前
5. 不破坏现有内容的叙事结构——是"扩展"不是"重写"
6. 中英文双语同步完成：先写中文，再写对应英文
7. 站点正文禁止引用 materials/ 或 .sisyphus/ 路径
8. 主内容禁止出现 Cursor/Windsurf/GitHub Copilot 等产品名
9. 读取参考素材时走 materials/industry-insights/synthesis/consensus-node-map.md 按节点索引
```

---

- [x] 1. orchestration.md — 并行 Session 治理 + Conductor 比喻（GAP-001 + STONE-004）

  **What to do**:
  - 读取现有 `docs/guide/orchestration.md`（127 行），理解当前结构（顺序/并行/计划-执行/迭代四种模式）
  - 在"并行分支"section 后新增"并行会话治理"子节（GAP-001 子要点）
  - 在"常见模式"或"与 Sub Agent 的关系"附近融入 Conductor 比喻（STONE-004）
  - 添加"何时并行/何时串行"的 STONE-006 决策框架元素
  - 同步更新 `docs/en/guide/orchestration.md`

  **GAP-001 Must-Have 子交付物**:
  - 任务分区：怎么把一个大任务拆成可并行的独立块
  - 状态同步：多个并行会话之间怎么共享进度和发现
  - 冲突收敛：并行会话产出有冲突时怎么合并
  - 统一验收：所有分支完成后怎么做最终集成验证

  **STONE-004 融入要点**:
  - Conductor（指挥者）比喻："人"不写代码，而是负责分发任务和验收结果
  - 轻提即可（"提一嘴"力度），不需要完整 section

  **STONE-006 决策框架**:
  - 添加"何时并行/何时串行"对比（用允许形态的小表格或段落）

  **Must NOT do**:
  - 不改现有四种模式的描述
  - 不引入特定工具的并行实现细节（保持 agent-agnostic）

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`
    - `adopt-agentic-writer`: 十人混血儿写作风格 + HTTP 技术解释模式 + 双语规范

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/orchestration.md` — 当前完整内容，重点看"并行分支"section 的写法和深度
  - `docs/en/guide/orchestration.md` — 英文版，同步修改的目标

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/review-addendum.md:92` — GAP-001 的具体子要点定义
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-010（并行 Session）和 TOPIC-015（Plan Mode/Conductor）的社区讨论角度
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/social/` — 原始社区讨论（SRC-S001, SRC-S006, SRC-S008, SRC-S014）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/hackernews/` — HN 讨论（SRC-H005, SRC-H008）

  **Materials References**（写作灵感来源，不得在站点中引用路径）:
  - `materials/industry-insights/synthesis/consensus-node-map.md` — 节点 11 对应的行业素材索引
  - `materials/industry-insights/global/foundations-core-voices.md` — Karpathy(planner/worker/critic)、Andrew Ng(四种模式) 相关段落

  **Acceptance Criteria**:
  - [ ] `grep -n "并行" docs/guide/orchestration.md` 命中 ≥3 次（含新增内容）
  - [ ] `grep -n "指挥" docs/guide/orchestration.md` 命中 ≥1 次（conductor 比喻）
  - [ ] `grep -n "parallel" docs/en/guide/orchestration.md` 命中 ≥3 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with other Wave 1 tasks
  - Message: `content(orchestration): 补深并行会话治理 + 融入 conductor 比喻`
  - Files: `docs/guide/orchestration.md`, `docs/en/guide/orchestration.md`

---

- [x] 2. actors.md — 长时 Loop 控制面（GAP-002 Part A）

  **What to do**:
  - 读取现有 `docs/guide/actors.md`（146 行），理解"协作循环"和"Agent Loop"section
  - 在 Agent Loop 相关内容后新增"长时循环的控制"子节
  - 添加"何时继续/何时重启"的 STONE-006 决策框架元素
  - 同步更新 `docs/en/guide/actors.md`

  **GAP-002 Part A Must-Have 子交付物**:
  - 检查点（checkpoint）：怎么在长任务中设置进度存档，以便恢复
  - 停止条件（stop condition）：怎么定义"什么时候该停"——PRD/TODO 驱动的退出标准
  - 何时重启：会话太长导致上下文退化时，重启比继续更好的信号

  **分工边界（与 TODO 3 eval.md 的分工）**:
  - actors.md 负责"跑得久时如何控制"（控制面：checkpoint / stop condition / 何时重启）
  - eval.md 负责"怎么证明跑得对 & 跑偏了怎么办"（验证面：恢复策略 / 验证闭环）

  **STONE-006 决策框架**:
  - "何时继续当前会话 / 何时重启新会话"对比

  **Must NOT do**:
  - 不改现有"三个角色"和"协作循环"的描述
  - 不重复 eval.md 的"错误恢复"内容

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/actors.md` — 当前完整内容，重点看"协作循环"section
  - `docs/en/guide/actors.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/review-addendum.md:93` — GAP-002 子要点
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-011（长时 Loop 治理）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/reddit/` — SRC-R008
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/social/` — SRC-S002, SRC-S011, SRC-S013

  **Materials References**:
  - `materials/industry-insights/synthesis/consensus-node-map.md` — 节点 2 索引
  - `materials/industry-insights/global/foundations-core-voices.md` — Anthropic(简单循环)、Karpathy(LLM as OS) 段落

  **Acceptance Criteria**:
  - [ ] `grep -n "检查点\|checkpoint" docs/guide/actors.md` 命中 ≥1 次
  - [ ] `grep -n "停止条件\|stop.condition" docs/guide/actors.md` 命中 ≥1 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 1
  - Message: `content(actors): 补深长时 Loop 控制面 — checkpoint/stop condition`
  - Files: `docs/guide/actors.md`, `docs/en/guide/actors.md`

---

- [x] 3. eval.md — 验证闭环 + 反模式清单（GAP-002 Part B + STONE-005）

  **What to do**:
  - 读取现有 `docs/guide/eval.md`（128 行），理解"错误恢复"和"验证金字塔"section
  - 扩展"错误恢复"section，补充恢复策略体系和验证闭环
  - 在"错误恢复"后或适当位置新增"常见反模式"子节（STONE-005）
  - 添加"何时回滚/何时继续"的 STONE-006 决策框架元素
  - 同步更新 `docs/en/guide/eval.md`

  **GAP-002 Part B Must-Have 子交付物**:
  - 恢复策略：agent 搞砸了怎么办——回滚 vs 修正 vs 重来的选择
  - 验证闭环：执行→验证→反馈→修正 的完整循环

  **STONE-005 融入要点**:
  - 反模式用"症状→后果→修复策略"三段式（不用步骤清单）
  - 常见反模式举例：
    - "Agent 说搞定了但其实没搞定"
    - 死循环（同一个错误反复尝试同一个修复）
    - 速度提升 + 质量下降的张力

  **STONE-006 决策框架**:
  - "何时回滚 / 何时继续修正 / 何时彻底重来"对比

  **Must NOT do**:
  - 不改现有"验证金字塔"的三层结构
  - 反模式不写成可执行 checklist

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/eval.md` — 当前完整内容
  - `docs/en/guide/eval.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/review-addendum.md:93,100` — GAP-002 + STONE-005
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-009（验证/可靠性）、TOPIC-013（局限与批评）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/hackernews/` — SRC-H001, SRC-H007（社区对 AI 编程局限性的批评）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/reddit/` — SRC-R009, SRC-R010

  **Materials References**:
  - `materials/industry-insights/synthesis/consensus-node-map.md` — 节点 8（Eval/验证）索引
  - `materials/industry-insights/global/foundations-core-voices.md` — Anthropic(evals)、Kent Beck(TDD)、Fowler(认知债务) 段落

  **Acceptance Criteria**:
  - [ ] `grep -n "恢复\|回滚" docs/guide/eval.md` 命中 ≥2 次
  - [ ] `grep -n "反模式\|症状" docs/guide/eval.md` 命中 ≥1 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 1
  - Message: `content(eval): 补深验证闭环 + 融入反模式清单`
  - Files: `docs/guide/eval.md`, `docs/en/guide/eval.md`

---

- [x] 4. system-instructions.md — 团队级 Prompt 治理（GAP-003 Part A）

  **What to do**:
  - 读取现有 `docs/guide/system-instructions.md`（114 行），理解"Prompt 是可维护资产"section
  - 扩展"Prompt 是可维护资产"section，补充团队级治理实践
  - 同步更新 `docs/en/guide/system-instructions.md`

  **GAP-003 Part A Must-Have 子交付物**:
  - 版本化：prompt/instructions 文件应纳入 git 管理
  - PR 审查：变更 prompt 像变更代码一样做 review
  - 变更触发更新：项目架构变了，prompt 也要跟着更新的意识

  **分工边界（与 TODO 5 knowledge-feeding.md 的分工）**:
  - system-instructions.md 负责"prompt/规则文件的团队治理"（版本化/review/更新触发）
  - knowledge-feeding.md 负责"团队知识的共建/审查/生命周期"（知识库治理/债务回收）

  **STONE-006 决策框架**:
  - "什么放 system instructions / 什么留给运行时注入"

  **Must NOT do**:
  - 不改现有"怎么写好指令"的两条建议
  - 团队治理限于"个人/小团队可执行动作"，不引入组织架构/KPI

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/system-instructions.md` — 当前完整内容
  - `docs/en/guide/system-instructions.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/review-addendum.md:94` — GAP-003
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-001（规则文件）、TOPIC-014（团队协作）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/blogs/` — SRC-B001, SRC-B006
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/github/` — SRC-G007

  **Materials References**:
  - `materials/industry-insights/synthesis/consensus-node-map.md` — 节点 3 索引
  - `materials/industry-insights/global/foundations-core-voices.md` — Gene Kim(合规前置)、Kent Beck(风格基准) 段落

  **Acceptance Criteria**:
  - [ ] `grep -n "版本化\|git\|review\|PR" docs/guide/system-instructions.md` 命中 ≥2 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 2
  - Message: `content(system-instructions): 补深团队级 prompt 治理`
  - Files: `docs/guide/system-instructions.md`, `docs/en/guide/system-instructions.md`

---

- [x] 5. knowledge-feeding.md — 团队知识治理（GAP-003 Part B）

  **What to do**:
  - 读取现有 `docs/guide/knowledge-feeding.md`（104 行）
  - 在"怎么选"section 后或适当位置新增团队知识治理子节
  - 同步更新 `docs/en/guide/knowledge-feeding.md`

  **GAP-003 Part B Must-Have 子交付物**:
  - 团队知识共建：多人维护同一份项目知识的协作模式
  - 知识债务回收：过时的知识怎么识别和清理

  **Must NOT do**:
  - 不改现有"三条路径"框架
  - 不引入具体的知识管理工具名称

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/knowledge-feeding.md` — 当前完整内容
  - `docs/en/guide/knowledge-feeding.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-014
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/github/` — SRC-G007, SRC-G009
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/social/` — SRC-S005, SRC-S013

  **Acceptance Criteria**:
  - [ ] `grep -n "团队\|共建\|债务" docs/guide/knowledge-feeding.md` 命中 ≥2 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 2
  - Message: `content(knowledge-feeding): 补深团队知识治理 — 共建/债务回收`
  - Files: `docs/guide/knowledge-feeding.md`, `docs/en/guide/knowledge-feeding.md`

---

- [x] 6. context.md — 长期记忆最小心智模型（GAP-004）

  **What to do**:
  - 读取现有 `docs/guide/context.md`（215 行），理解"State & Memory"section
  - 在"State & Memory"section 内补充长期记忆的最小心智模型（轻量补充）
  - 同步更新 `docs/en/guide/context.md`

  **GAP-004 Must-Have 子交付物**:
  - 长期记忆 vs 会话内记忆的区别（最小心智模型）
  - 自动积累 vs 人工维护的边界
  - 过时记忆的风险（一句话提及）

  **Must NOT do**:
  - 不大篇幅展开（"轻量补"力度——几段话即可）
  - 不深入讲具体的记忆实现机制（那是框架层的事）

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/context.md` — 当前完整内容，重点看"State & Memory"section
  - `docs/en/guide/context.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-016（长期持久记忆）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/github/` — SRC-G006
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/social/` — SRC-S010

  **Acceptance Criteria**:
  - [ ] `grep -n "长期\|持久\|记忆" docs/guide/context.md` 命中 ≥1 次（新增内容）
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 2
  - Message: `content(context): 轻量补充长期记忆心智模型`
  - Files: `docs/guide/context.md`, `docs/en/guide/context.md`

---

- [x] 7. guide/index.md — Vibe→CE 范式迁移叙事（STONE-001）

  **What to do**:
  - 读取现有 `docs/guide/index.md`（51 行，节点 0 介绍页），理解"核心命题"section
  - 在"核心命题"section 或开头补充 Vibe Coding → Context Engineering 的范式迁移叙事钩子
  - 同步更新 `docs/en/guide/index.md`

  **注意**：是 `docs/guide/index.md`（节点 0 介绍页），**不是** `docs/index.md`（站点首页）。

  **STONE-001 融入要点**:
  - Vibe coding（凭感觉写代码）→ Context Engineering（系统化管理上下文）的转变
  - 作为"为什么需要这本教程"的开篇叙事钩子
  - 正常融入力度——几段话，不需要完整 section

  **Must NOT do**:
  - 不改现有"概念节点导航"的清单
  - 不改 `docs/index.md`（站点首页）
  - 不深入讲 vibe coding 的具体技术（那不是教程主题）

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/index.md` — 当前完整内容
  - `docs/en/guide/index.md` — 英文版

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-008（Vibe→CE）
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/blogs/` — SRC-B005, SRC-B009
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/01.raw-data/hackernews/` — SRC-H003, SRC-H011, SRC-H012

  **Materials References**:
  - `materials/industry-insights/synthesis/consensus-node-map.md` — 节点 0 索引（Fowler/Levels/Anthropic）
  - `materials/industry-insights/global/foundations-core-voices.md` — Fowler(上下文工程)、Levels(vibe coding 对比) 段落

  **Acceptance Criteria**:
  - [ ] `grep -in "vibe" docs/guide/index.md` 命中 ≥1 次
  - [ ] `grep -in "上下文工程\|context.engineering" docs/guide/index.md` 命中 ≥1 次
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 3
  - Message: `content(index): 融入 Vibe→CE 范式迁移叙事钩子`
  - Files: `docs/guide/index.md`, `docs/en/guide/index.md`

---

- [x] 8. skills.md — Command/Skill/Sub-agent 职责边界速查（STONE-002）

  **What to do**:
  - 读取现有 `docs/guide/skills.md`（76 行），理解"Skills vs. Commands"section
  - 扩展现有的"Skills vs. Commands"对比，加入 Sub-agent 形成三者职责边界速查
  - 同步更新 `docs/en/guide/skills.md`

  **STONE-002 融入要点**:
  - Command / Skill / Sub-agent 三者的职责边界对比
  - 何时用哪个（STONE-006 决策框架元素）
  - 正常融入力度——扩展现有对比 section，不新建独立页

  **Must NOT do**:
  - 不重复 commands.md 或 sub-agents.md 已有的内容
  - 对比限于"快速索引"，不展开每个概念的完整解释

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/skills.md` — 当前完整内容，重点看"Skills vs. Commands"section
  - `docs/en/guide/skills.md` — 英文版
  - `docs/guide/commands.md` — 参考 commands 的定义
  - `docs/guide/sub-agents.md` — 参考 sub-agent 的定义

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-006 + TOPIC-007

  **Acceptance Criteria**:
  - [ ] `grep -n "Sub.*[Aa]gent\|sub.*agent\|子代理" docs/guide/skills.md` 命中 ≥1 次（新增对比）
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 3
  - Message: `content(skills): 融入 Command/Skill/Sub-agent 职责边界速查`
  - Files: `docs/guide/skills.md`, `docs/en/guide/skills.md`

---

- [x] 9. hooks-and-plugins.md — 统一权限心智模型索引（STONE-003）

  **What to do**:
  - 读取现有 `docs/guide/hooks-and-plugins.md`（155 行），理解"Hooks + Plugins vs. Skills vs. MCP"对比 section
  - 在对比 section 或"守门人模式"附近补充统一权限心智模型的交叉索引
  - 同步更新 `docs/en/guide/hooks-and-plugins.md`

  **STONE-003 融入要点**:
  - 权限/信任边界在不同节点中的表现的统一索引
  - 内置工具（节点 4）→ MCP（节点 5）→ Hooks（节点 9）的权限梯度
  - "提一嘴"力度——一段话 + 简短交叉链接即可

  **Must NOT do**:
  - 不重写 built-in-tools.md 或 mcp.md 的内容
  - 只做索引/交叉链接，不做完整权限框架

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus"`（`4141/claude-opus-4.6`）
  - **Skills**: `["adopt-agentic-writer"]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/hooks-and-plugins.md` — 当前完整内容
  - `docs/en/guide/hooks-and-plugins.md` — 英文版
  - `docs/guide/built-in-tools.md` — 参考"信任边界"相关内容
  - `docs/guide/mcp.md` — 参考"信任边界"相关内容

  **Research References**:
  - `.sisyphus/research/adopt-agentic-gap-analysis/workspace/02.topics/topic-list.md` — TOPIC-012（权限管理）

  **Acceptance Criteria**:
  - [ ] `grep -n "权限\|信任\|边界" docs/guide/hooks-and-plugins.md` 命中 ≥3 次（含新增）
  - [ ] `bun run docs:build` 退出码 0
  - [ ] 两个文件均在 `git diff --name-only` 中

  **Commit**: YES — group with Wave 3
  - Message: `content(hooks): 融入统一权限心智模型索引`
  - Files: `docs/guide/hooks-and-plugins.md`, `docs/en/guide/hooks-and-plugins.md`

---

- [x] 10. 全局一致性检查（收敛 Wave）

  **What to do**:
  - 跑完 TODO 1-9 后的最终收敛
  - 术语一致性检查（按术语统一表逐条 grep）
  - 交叉链接有效性验证（新增的 `[xxx](./yyy.md)` 链接是否正确）
  - 重复/矛盾内容检查（GAP-002 Part A vs Part B 是否有重复）
  - 完整构建验证（`bun run docs:build`）
  - 全局 QA Scenarios（Scenario 1-5）一次性执行

  **Must NOT do**:
  - 不做内容改写（只做检查和最小修复）
  - 最小修复限于：修正交叉链接、修正术语不一致、删除残留占位符

  **Recommended Agent Profile**:
  - **SubAgent**: `subagent_type="sisyphus-junior"`（`4141/claude-sonnet-4.5`，检查任务不需要 opus）
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO — 必须等 1-9 全部完成
  - **Parallel Group**: Wave 4 (solo)
  - **Blocks**: None (final)
  - **Blocked By**: Tasks 1-9

  **Acceptance Criteria**:
  - [ ] `bun run docs:build` 退出码 0
  - [ ] `grep -R -n -E "materials/|\.sisyphus/" docs/guide docs/en/guide` 无输出
  - [ ] `grep -R -n -E "Cursor|Windsurf|GitHub Copilot|\.cursorrules|copilot-instructions\.md" docs/guide docs/en/guide` 无输出
  - [ ] `grep -R -n -E "TBD|TODO:|FIXME" docs/guide docs/en/guide` 无意外输出
  - [ ] 所有 18 个文件在 `git diff --name-only` 中

  **Commit**: YES
  - Message: `content: Phase 2 全局一致性检查 — 术语/链接/构建验证`
  - Files: 仅修复的文件

---

## Commit Strategy

| After Wave | Message | Files | Verification |
|-----------|---------|-------|--------------|
| Wave 1 (TODOs 1-3) | 各自独立 commit（见各 TODO） | 6 个 md 文件 | `bun run docs:build` |
| Wave 2 (TODOs 4-6) | 各自独立 commit | 6 个 md 文件 | `bun run docs:build` |
| Wave 3 (TODOs 7-9) | 各自独立 commit | 6 个 md 文件 | `bun run docs:build` |
| Wave 4 (TODO 10) | `content: Phase 2 全局一致性检查` | 仅修复文件 | 全套 QA Scenarios |

---

## Success Criteria

### Verification Commands
```bash
# 构建验证
bun run docs:build          # Expected: 退出码 0

# 双语同步验证
git diff --name-only        # Expected: 18 个文件（9 guide/ + 9 en/guide/）

# 路径泄漏检查
grep -R -n -E "materials/|\.sisyphus/" docs/guide docs/en/guide   # Expected: 无输出

# 产品名禁令
grep -R -n -E "Cursor|Windsurf|GitHub Copilot" docs/guide docs/en/guide   # Expected: 无输出

# GAP 子要点存在性（抽样）
grep -n "并行" docs/guide/orchestration.md                    # Expected: ≥3 命中
grep -n "checkpoint" docs/guide/actors.md                     # Expected: ≥1 命中
grep -n "反模式" docs/guide/eval.md                           # Expected: ≥1 命中
grep -n "版本化\|review" docs/guide/system-instructions.md    # Expected: ≥2 命中
grep -in "vibe" docs/guide/index.md                           # Expected: ≥1 命中
```

### Final Checklist
- [ ] All GAP Must-Have sub-deliverables present in target files
- [ ] All STONE items integrated at specified locations
- [ ] STONE-006 decision framework elements present in high-impact TODOs (1, 2, 3, 4)
- [ ] All files build successfully
- [ ] No internal path leakage
- [ ] No banned product names in main content
- [ ] Chinese and English versions in sync
- [ ] Existing narrative structure preserved (no "读每一节时" sections broken)

---

## STONE-006 Deferred Scope（本轮未覆盖）

以下高热度节点本轮**不做**决策框架升级，记录在此留待后续：

| 节点 | 原因 |
|------|------|
| built-in-tools.md（节点 4）| 本轮无 GAP/STONE 落在此节点 |
| mcp.md（节点 5）| 同上 |
| sub-agents.md（节点 12）| 同上 |

后续 Phase 可选择性对这些节点补充 STONE-006 升级。
