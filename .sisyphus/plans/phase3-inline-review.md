# Phase 3: Inline Review — 处理 20 条用户评论 + 内容改进

## TL;DR

> **Quick Summary**: 处理用户在 5 个教程 markdown 文件中留下的 20 条 HTML inline 评论和直接文字修改。涵盖术语统一、解释性补充、SVG 修复/重设计、mermaid 图添加、标题打磨、内容结构评估，以及中英双语同步。
> 
> **Deliverables**:
> - 5 个中文 md 文件 + 5 个英文 md 文件的内容改进
> - 全站 "留意这三件事" 标题替换（影响所有章节末尾）
> - 全站 LLM/AI 术语统一
> - 2 个 SVG 修复（context.svg 重设计 + system-instructions-inline-1.svg 重叠修复）
> - 全局 SVG 水印/签名清理
> - 2-3 个新增 mermaid 序列图
> - 1 个工具对比表（需用户确认放置位置）
> - CLAUDE.md 更新新规则
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: T1 扫描 → T4-T8 文件编辑 → T9 全站统一 → F1-F4 验证

---

## Context

### Original Request
用户在 5 个教程页面中用 HTML 评论标记了 20 条反馈意见，并直接做了一些文字修改（已在 git working directory 中）。要求加载 inline-review 和 baoyu 相关 skills，按评论意图逐条处理并改进内容。

### Interview Summary
**Key Discussions**:
- 20 条评论已全部识别并归纳为 7 个通用模式（A 术语一致性, B 解释性缺口, C 可视化补位, D 标题/措辞打磨, E 内容归属/结构, F 渲染 bug, G 缺失内容）
- 用户明确四个 agent 名称为 Claude Code、Codex、Gemini CLI、OpenCode（不是 Cline）
- 用户已做的直接文字修改（删除多余句子、格式化代码块等）视为最终决定，直接保留
- SVG 修改原则："不丢信息、不丢动画、不丢灵魂"

**Research Findings**:
- 项目已有完整写作纪律在 CLAUDE.md 中（禁用词、段落呼吸感、可视化节奏等）
- Phase 1-5 审校已完成，本次是用户的 post-审校反馈
- agent-agnostic 规则明确禁止 docs/guide/ 中出现具体产品名——但评论 #16 要求列出具体工具，需用户裁决

### Metis Review
**Identified Gaps** (addressed):
- **Scope creep 风险**：3 个全局动作（标题替换/术语统一/水印清理）可能拉爆范围 → 已锁定文件列表
- **Anchor 兼容性**：改标题可能破坏站内锚点链接 → 改标题前先扫描引用
- **Agent-agnostic 冲突**：工具对比表与产品名禁令矛盾 → 标记为 DECISION NEEDED
- **评论"假关闭"**：修改了内容但忘删 HTML comment → 验证步骤包含评论清零扫描
- **中英漂移**：以 comment ID 为单位双语同步关闭，不攒到最后统一翻译

---

## Work Objectives

### Core Objective
逐条处理用户的 20 条 inline 评论，改进 5 个教程页面的内容质量，同时保持中英双语同步和 agent-agnostic 规范。

### Concrete Deliverables
- 5 个中文 md 文件改进：`docs/guide/{context,actors,built-in-tools,system-instructions,index}.md`
- 5 个英文 md 文件同步：`docs/en/guide/{context,actors,built-in-tools,system-instructions,index}.md`
- 2 个 SVG 修复：`context.svg` 布局重设计 + `system-instructions-inline-1.svg` 重叠修复
- 全局 SVG 水印清理
- CLAUDE.md 规则更新
- 新增 mermaid 序列图（context.md + built-in-tools.md）

### Definition of Done
- [ ] `bun run docs:build` exit code == 0
- [ ] 所有 20 条 HTML comment 已从文件中删除
- [ ] 禁用产品名扫描通过（docs/guide/ 中无 Cursor/Windsurf/GitHub Copilot）
- [ ] 中英文件一一对应（结构、mermaid 数量匹配）

### Must Have
- 保留用户已做的直接文字修改（git diff 中的非评论改动）
- 每条评论要么执行要么有明确理由不执行
- 所有改动遵循 CLAUDE.md 写作纪律
- mermaid 图中文页用中文、英文页用英文
- SVG 修改保留原有动画和信息

### Must NOT Have (Guardrails)
- **不做练习/checklist/decision tree**（CLAUDE.md 已明确）
- **不做工具适配对照页**（保持 agent-agnostic）
- **不借机重写整章**——只改评论指向的具体问题
- **不跨文件迁移内容**（actors.md #20 在本文件内重组，不移到别的章节）
- **不引入 CSS/JS 动画**——SVG 仅用原生 animate 系列
- **不使用 feTurbulence/feSpecularLighting 等重度滤镜**
- **不在 docs/guide/ 中使用 Cursor/Windsurf/GitHub Copilot 等产品名**
- **不修改用户没评论的段落**（除非是全站统一的术语/标题替换）

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO（纯文档站，无 test framework）
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Markdown content | Bash (bun run docs:build) | 构建通过 + grep 扫描 |
| Mermaid diagrams | Bash (bun run docs:build) | 构建期无 parse error |
| SVG files | Bash (grep viewBox) | 结构校验 + viewBox 存在 |
| 术语/禁词 | Bash (grep/rg) | 全站正则扫描 |
| 评论清零 | Bash (grep `<!--`) | 匹配目标文件无 HTML comment |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (信息收集 — 3 并行):
├── Task 1: 全站扫描：LLM/AI 混用 + "留意这三件事" 位置 + anchor 引用 [quick]
├── Task 2: 全站 SVG 水印/签名扫描 [quick]
└── Task 3: 查阅四个 agent 真实内置工具 + 权限信息 [deep]

Wave 2 (单文件内容编辑 — 5 并行):
├── Task 4: context.md 评论处理 (#1,#2,#3,#4,#6) + mermaid + 英文同步 (depends: T1) [unspecified-high]
├── Task 5: actors.md 评论处理 (#18,#19,#20) + 英文同步 (depends: T1) [unspecified-high]
├── Task 6: built-in-tools.md 评论处理 (#11,#13,#14,#15) + mermaid + 英文同步 (depends: T1) [unspecified-high]
├── Task 7: system-instructions.md 评论处理 (#9) + 英文同步 [unspecified-high]
└── Task 8: index.md 修改 + CLAUDE.md 更新 [quick]

Wave 3 (跨文件 + SVG + 工具表 — 5 并行):
├── Task 9: 全站"留意这三件事"标题替换 + LLM/AI 术语统一 + 英文同步 (depends: T1,T4-T8) [unspecified-high]
├── Task 10: context.svg 布局重设计 (#5) [artistry]
├── Task 11: system-instructions-inline-1.svg 重叠修复 (#10) [artistry]
├── Task 12: SVG 水印清理 (depends: T2) [quick]
└── Task 13: built-in-tools.md 工具对比表 (#16) + 英文同步 (depends: T3) [unspecified-high]

Wave FINAL (验证 — 4 并行):
├── F1: 构建验证 + 评论清零 + 链接检查 [unspecified-high]
├── F2: 禁词 + 产品名 + 术语一致性扫描 [unspecified-high]
├── F3: 中英文一致性检查 [deep]
└── F4: SVG 结构验证 [quick]

Critical Path: T1 → T4-T8 → T9 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 5 (Waves 2 & 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| T1 | — | T4, T5, T6, T9 | 1 |
| T2 | — | T12 | 1 |
| T3 | — | T13 | 1 |
| T4 | T1 | T9 | 2 |
| T5 | T1 | T9 | 2 |
| T6 | T1 | T9 | 2 |
| T7 | — | T9 | 2 |
| T8 | — | T9 | 2 |
| T9 | T1, T4-T8 | F1-F4 | 3 |
| T10 | — | F4 | 3 |
| T11 | — | F4 | 3 |
| T12 | T2 | F4 | 3 |
| T13 | T3 | F1-F4 | 3 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 1 | **3** | T1 → `quick`, T2 → `quick`, T3 → `deep` |
| 2 | **5** | T4-T6 → `unspecified-high`, T7 → `unspecified-high`, T8 → `quick` |
| 3 | **5** | T9 → `unspecified-high`, T10-T11 → `artistry`, T12 → `quick`, T13 → `unspecified-high` |
| FINAL | **4** | F1-F2 → `unspecified-high`, F3 → `deep`, F4 → `quick` |

---

## TODOs

### Wave 1 — 信息收集（3 并行）

- [ ] 1. 全站扫描：LLM/AI 术语混用 + "留意这三件事"位置 + anchor 引用

  **What to do**:
  - 用 Grep 扫描 `docs/guide/*.md` 和 `docs/en/guide/*.md` 中所有 "AI" 和 "LLM" 的出现位置
  - 统计每个文件中两个术语的使用频率，识别不一致处（同一段落内混用、同一概念两种称呼）
  - 用 Grep 搜索所有包含 "留意这三件事" 和 "three things" 的文件及行号
  - 记录这些标题的确切 heading 层级（## / ### 等），以便后续统一替换
  - 检查是否有站内链接（`[text](#xxx)` 或 `[text](/guide/xxx#yyy)`）指向这些 heading 的 anchor
  - 输出一份结构化报告：{ 术语扫描结果, 标题位置列表, anchor 引用列表 }

  **Must NOT do**:
  - 不修改任何文件——只读扫描
  - 不扩展到 `docs/guide/` 和 `docs/en/guide/` 之外的目录

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 纯扫描任务，不涉及复杂逻辑或代码修改
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `adopt-agentic-writer`: 本任务不做内容编辑

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6, 9
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `CLAUDE.md` 中的 "同一节内术语必须统一" 规则——定义了扫描标准
  - `CLAUDE.md` 中的 "AI filler 词密度控制" 规则——相关上下文

  **Acceptance Criteria**:
  - [ ] 输出包含每个文件的 AI/LLM 使用位置和频率
  - [ ] 输出包含 "留意这三件事"/"three things" 的文件列表和行号
  - [ ] 输出包含指向这些 heading 的 anchor 引用列表（可能为空）
  - [ ] 未修改任何文件

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 扫描结果完整性
    Tool: Bash (grep)
    Preconditions: 工作目录为项目根目录
    Steps:
      1. 运行 Grep "留意这三件事" 搜索 docs/guide/*.md
      2. 运行 Grep "three things" 搜索 docs/en/guide/*.md
      3. 确认输出行数 > 0（至少 context.md 有此标题）
    Expected Result: 至少在 context.md 和其他若干文件中找到匹配
    Evidence: .sisyphus/evidence/task-1-scan-results.md

  Scenario: anchor 引用检查
    Tool: Bash (grep)
    Preconditions: 同上
    Steps:
      1. 从扫描结果提取 heading 文本，推导可能的 anchor（如 "留意这三件事" → "#留意这三件事"）
      2. 用 Grep 搜索这些 anchor 在全站 md 文件中的引用
    Expected Result: 列出所有引用（可能为 0）
    Evidence: .sisyphus/evidence/task-1-anchor-refs.md
  ```

  **Commit**: NO

- [ ] 2. 全站 SVG 水印/签名扫描

  **What to do**:
  - 读取 `docs/public/illustrations/` 下所有 `.svg` 文件
  - 检查每个 SVG 文件的右下角区域（viewBox 的右下 1/4 象限）是否有疑似水印/签名的元素
  - 查找包含 "watermark"、"signature"、"credit"、"©"、"created by"、"generated" 等文本的元素
  - 查找 viewBox 右下象限中 opacity < 0.5 的小文本元素
  - 输出：{ 文件名: [疑似水印元素的 id/位置/内容] } 清单

  **Must NOT do**:
  - 不修改任何 SVG——只读扫描
  - 不删除任何看起来像是图表内容的元素

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 文件扫描任务
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 12
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - 用户评论 #8（index.md line 15）："rigtt lower corner of the svg, should not have watermark stuff or signature thing, all of svgs"
  - `docs/public/illustrations/` — 全部 SVG 文件清单见 CLAUDE.md 的"现有插图"表

  **Acceptance Criteria**:
  - [ ] 所有 `docs/public/illustrations/*.svg` 均已扫描
  - [ ] 输出清单列出每个文件的扫描结果（有/无疑似水印）
  - [ ] 未修改任何文件

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: SVG 扫描覆盖率
    Tool: Bash
    Preconditions: 项目根目录
    Steps:
      1. 统计 docs/public/illustrations/*.svg 文件数量
      2. 确认扫描报告中的文件数量与实际文件数量一致
    Expected Result: 扫描报告覆盖 15+ 个 SVG 文件
    Evidence: .sisyphus/evidence/task-2-watermark-scan.md

  Scenario: 误报检查
    Tool: Bash (read)
    Preconditions: 扫描完成
    Steps:
      1. 对标记为"有水印"的文件，读取对应 SVG 区域
      2. 确认标记的元素确实是水印/签名而非图表内容
    Expected Result: 0 个误报
    Evidence: .sisyphus/evidence/task-2-watermark-verification.md
  ```

  **Commit**: NO

- [ ] 3. 查阅四个 agent 真实内置工具 + 权限信息

  **What to do**:
  - 研究以下四个 AI coding agent 的**真实**内置工具列表和权限控制机制：
    1. **Claude Code** — 内置工具有哪些？（Read, Write, Edit, Bash, Grep, Glob 等）权限模型是什么？（allowedTools, permissions prompt 等）
    2. **Codex** — 内置工具有哪些？权限模型？（sandbox, network access 等）
    3. **Gemini CLI** — 内置工具有哪些？权限模型？
    4. **OpenCode** — 内置工具有哪些？权限模型？
  - 查找**官方文档**或**可靠来源**（GitHub README、官方 docs site、官方 blog）
  - 对于无法确认的信息，标注 "待核查" 而非编造
  - 输出结构化对比表：{ agent_name: { tools: [...], permission_model: "...", source_url: "..." } }

  **Must NOT do**:
  - 不编造不确定的信息
  - 不使用过时信息（标注查询日期）
  - 不修改任何项目文件

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 需要深入研究多个产品的文档，交叉验证信息
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 13
  - **Blocked By**: None

  **References**:
  **External References**:
  - 用户评论 #16（built-in-tools.md line 172）："list some examples of the default built in tools agents like cloud code or Gemini CLI or Open Code...should look them up...give people concrete example"
  - 用户纠正：四个 agent 为 Claude Code、Codex、Gemini CLI、OpenCode（不是 Cline）

  **Acceptance Criteria**:
  - [ ] 四个 agent 均有工具列表和权限模型描述
  - [ ] 每项信息有来源 URL 或标注 "待核查"
  - [ ] 无编造内容
  - [ ] 输出为结构化对比格式

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 信息完整性
    Tool: 人工审阅报告
    Preconditions: 研究报告已输出
    Steps:
      1. 检查四个 agent 是否全部覆盖
      2. 检查每个 agent 是否有 tools、permission_model、source_url 三个字段
      3. 检查 source_url 是否为可访问的真实链接
    Expected Result: 4/4 agent 覆盖，每个有 3 个字段，链接可访问
    Evidence: .sisyphus/evidence/task-3-agent-tools-research.md

  Scenario: 无编造验证
    Tool: Bash (webfetch)
    Preconditions: 研究报告已输出
    Steps:
      1. 抽查至少 2 个 source_url，访问并确认内容与报告描述一致
    Expected Result: 抽查的 URL 内容与报告一致
    Evidence: .sisyphus/evidence/task-3-source-verification.md
  ```

  **Commit**: NO

---

### Wave 2 — 单文件内容编辑（5 并行）

- [ ] 4. context.md 评论处理 (#1,#2,#3,#4,#6) + mermaid 序列图 + 英文同步

  **What to do**:

  处理 context.md 中的 5 条评论，保留用户已做的直接文字修改，删除已处理的 HTML 评论标记。英文 `docs/en/guide/context.md` 同步修改。

  **评论 #1（line 33 附近）— 解释 LLM 如何推断文件路径**:
  - 在第一轮请求/响应示例后，添加 1-2 句解释：LLM 从项目上下文（如 README、目录结构、import 语句）和用户指令中的关键词（"processOrder"）推断出文件路径。这不是魔法——是基于上下文中的线索做的概率推理。
  - 如果当前示例中上下文没有包含目录信息，在 request 的 system/context 部分补一条表示 agent 已注入项目结构的注释。

  **评论 #2（line 83 附近）— 添加 mermaid 序列图 + OpenAI Responses API**:
  - 在"上下文累积"段落后添加 mermaid `sequenceDiagram`，展示 3 轮 agent loop 的完整交互：User→Agent→LLM（request 1, response 1, tool call, tool result, request 2, response 2, request 3, response 3），重点展示每轮 request 体积递增。
  - 中文版用中文标签，英文版用英文标签。
  - 在合适位置添加 `::: tip` 框，简短提到 OpenAI 的 Responses API 作为减少上下文膨胀的一种新 API 设计尝试（不深入讲——只是"提一嘴"级别，符合 CLAUDE.md 的轻提力度）。

  **评论 #3（line 107 附近）— 重组"上下文的局限"section**:
  - 重命名标题："上下文的局限" → 更具体的标题，例如"窗口有限，噪声会累积"或"上下文不是无限的"
  - 重组 section 内容使其连贯：按逻辑顺序排列（窗口大小限制 → 注意力退化 → 噪声累积 → 应对策略），用过渡句连接各个点
  - 消除碎片感——如果有多个独立的小段落在讲同一件事，合并它们
  - 英文版做对应调整

  **评论 #4（line 123 附近）— 修复 mermaid 图文字截断**:
  - 读取当前 mermaid 代码块，检查节点文本长度
  - 如果节点文本过长导致渲染截断：
    a) 缩短文本（用换行 `<br>` 或简写）
    b) 或调整 mermaid 图类型/方向（如 `LR` 改 `TB`）
  - 确保修复后的图在 VitePress 渲染中不再截断

  **评论 #6（line 221 附近）— CLAUDE.md 改为 agent-agnostic 术语**:
  - 将文中具体的 `CLAUDE.md` 引用替换为 agent-agnostic 的通用表述
  - 中文可用：`项目级指令文件`、`项目规则文件`、或者用通用格式如 `AGENTS.md / .cursorrules / CLAUDE.md` 列举几个然后说"这类文件"
  - 英文对应调整
  - 注意：不要把所有出现都改——有些地方如果是在讲通用概念（"你可以在项目根目录放一个指令文件"），应该用通用名；如果是在举具体例子，可以保留具体名但列举多个工具

  **通用步骤**:
  - 删除所有已处理的 `<!-- -->` HTML 评论标记
  - 保留用户已做的直接文字修改（如删除"这听起来像真的。"、删除"断开，"等）
  - 检查修改是否符合 CLAUDE.md 写作纪律（禁用词、段落长度、呼吸感）
  - 英文版 `docs/en/guide/context.md` 做对应修改

  **Must NOT do**:
  - 不改评论 #5（context.svg 重设计）——那是 Task 10
  - 不改评论 #7（"留意这三件事"标题）——那是 Task 9 的全站统一
  - 不借机重写没评论的段落
  - 不在 docs/guide/ 中使用具体产品名（Cursor/Windsurf/GitHub Copilot）

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 多条评论涉及内容重组、mermaid 图创建、术语替换，工作量中等偏高
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 教程内容编辑必须遵循十人混血儿风格和 HTTP/SSE 技术解释模式
    - `humanizer-zh`: 去 AI 痕迹，确保修改后的文字自然

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1（需要术语扫描结果来避免引入新的不一致）

  **References**:

  **Pattern References**:
  - `docs/guide/context.md` — 当前文件（包含用户的评论和直接修改）
  - `docs/en/guide/context.md` — 英文版（需同步修改）
  - `CLAUDE.md` "技术解释模式" 段 — HTTP request/response 解释风格
  - `CLAUDE.md` "Agent Agnostic 原则" 段 — 具体产品名替换指导

  **External References**:
  - OpenAI Responses API 官方文档：需查阅以准确描述（只需"提一嘴"级别的准确性）

  **Acceptance Criteria**:
  - [ ] context.md 中 5 条评论（#1,#2,#3,#4,#6）均已处理
  - [ ] 所有 `<!-- -->` HTML 评论标记已删除
  - [ ] 新增 mermaid sequenceDiagram 展示多轮交互
  - [ ] "上下文的局限" section 已重命名并重组
  - [ ] mermaid 图文字截断问题已修复
  - [ ] CLAUDE.md 引用已改为 agent-agnostic 表述
  - [ ] 英文版同步更新
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: mermaid 序列图渲染
    Tool: Bash (bun run docs:build)
    Preconditions: context.md 已添加 mermaid 代码块
    Steps:
      1. 运行 bun run docs:build
      2. 检查输出中无 mermaid parse error
    Expected Result: 构建成功，无 mermaid 相关错误
    Evidence: .sisyphus/evidence/task-4-build.txt

  Scenario: 评论清零验证
    Tool: Bash (grep)
    Preconditions: 编辑完成
    Steps:
      1. Grep "<!--" docs/guide/context.md
      2. Grep "<!--" docs/en/guide/context.md
    Expected Result: 两个文件均无 HTML 评论匹配
    Evidence: .sisyphus/evidence/task-4-comment-check.txt

  Scenario: agent-agnostic 合规
    Tool: Bash (grep)
    Preconditions: 编辑完成
    Steps:
      1. Grep "CLAUDE\.md" docs/guide/context.md — 检查是否还有遗留的具体引用
      2. 如果有，确认是在列举多工具的上下文中（可接受）还是单独出现（需修改）
    Expected Result: 无单独出现的 CLAUDE.md 引用
    Evidence: .sisyphus/evidence/task-4-agnostic-check.txt
  ```

  **Commit**: YES (groups with T5, T6, T7, T8 — Wave 2 一起 commit)
  - Message: `docs: address inline review comments for 5 tutorial pages (CN+EN)`
  - Files: `docs/guide/context.md`, `docs/en/guide/context.md`
  - Pre-commit: `bun run docs:build`

- [ ] 5. actors.md 评论处理 (#18,#19,#20) + 英文同步

  **What to do**:

  处理 actors.md 中的 3 条评论，保留用户已做的直接文字修改，删除 HTML 评论。英文版同步。

  **评论 #18（line 101 附近）— 评估 mermaid 重复 + 处理**:
  - 先读 context.md 的 mermaid 图（特别是 Task 4 新增的序列图），评估 actors.md 这里是否真的需要另一个序列图
  - 如果与 context.md 高度重复：不添加新图，而是添加一句交叉引用（"详见[上下文](/guide/context#xxx)中的序列图"）
  - 如果 actors.md 需要展示不同角度（如强调 agent 的中间人角色而非上下文累积）：添加一个**不同侧重点**的 mermaid 序列图，明确标注与 context.md 的区别

  **评论 #19（line 113 附近）— 改善过渡跳跃**:
  - 在 "API 协议" 和 "为什么是 agentic 而非 chat" 之间添加过渡句，解释从"通信格式"到"工作模式"的逻辑跳转
  - 例如："理解了通信格式之后，自然的问题是：为什么这叫 agentic，而不是普通的 chat？"

  **评论 #20（line 125 附近）— 评估下半部分内容归属**:
  - 读取从"怎么给 agent 下任务"到文末的所有内容
  - 评估这些内容（复述协议、控制长时循环、检查点、停止条件）是否属于"角色"章节
  - **默认决策**：不移动内容到其他章节（避免破坏骨架），但在 actors.md 内部重组：
    a) 将这些内容放到一个明确的子 section 下，标题说明这是"角色理解后的实操建议"
    b) 加一句引子解释为什么放在这里（"理解了三方角色后，以下是基于这些角色关系的实操指导"）
    c) 如果内容与其他章节的节点有重叠（如"长时循环"在节点 2 和节点 13 都出现），添加交叉引用而非重复

  **通用步骤**:
  - 保留用户已做的直接修改（如删除"没了。"、表格格式化）
  - 删除所有 `<!-- -->` HTML 评论
  - 英文版 `docs/en/guide/actors.md` 同步

  **Must NOT do**:
  - 不将内容移到其他文件（只在 actors.md 内部重组）
  - 不改评论 #17（LLM/AI 术语统一）——那是 Task 9 的全站统一
  - 不借机添加练习或 checklist

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 涉及内容归属判断和段落重组，需要理解章节间的逻辑关系
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 教程内容编辑风格
    - `humanizer-zh`: 去 AI 痕迹

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6, 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1（需要术语扫描结果）

  **References**:

  **Pattern References**:
  - `docs/guide/actors.md` — 当前文件（包含用户评论和直接修改）
  - `docs/en/guide/actors.md` — 英文版
  - `docs/guide/context.md` — 需要对比以避免重复（评论 #18）
  - `.sisyphus/plans/phase1-content-structure.md` — 骨架定义，确认 actors 章节的职责边界

  **Acceptance Criteria**:
  - [ ] 3 条评论（#18,#19,#20）均已处理
  - [ ] 所有 HTML 评论标记已删除
  - [ ] 与 context.md 的重复问题已评估并处理（添加交叉引用或差异化图表）
  - [ ] 过渡跳跃已修复
  - [ ] 下半部分内容在本文件内重组，有清晰的引子说明为什么放在这里
  - [ ] 英文版同步
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 评论清零
    Tool: Bash (grep)
    Preconditions: 编辑完成
    Steps:
      1. Grep "<!--" docs/guide/actors.md
      2. Grep "<!--" docs/en/guide/actors.md
    Expected Result: 两个文件均无 HTML 评论
    Evidence: .sisyphus/evidence/task-5-comment-check.txt

  Scenario: 与 context.md 不重复
    Tool: Read
    Preconditions: 编辑完成
    Steps:
      1. 读取 actors.md 的 mermaid 代码块
      2. 读取 context.md 的 mermaid 代码块
      3. 对比两者的侧重点是否不同
    Expected Result: 如果都有 mermaid 图，两者侧重点明确不同；或只有交叉引用
    Evidence: .sisyphus/evidence/task-5-no-duplication.md
  ```

  **Commit**: YES (groups with T4, T6, T7, T8)
  - Message: `docs: address inline review comments for 5 tutorial pages (CN+EN)`
  - Files: `docs/guide/actors.md`, `docs/en/guide/actors.md`

- [ ] 6. built-in-tools.md 评论处理 (#11,#12,#13,#14,#15) + mermaid 序列图 + 英文同步

  **What to do**:

  处理 built-in-tools.md 中的 5 条评论，保留用户直接修改，删除 HTML 评论。英文版同步。

  **评论 #11（line 11 附近）— 解释"循环"是什么**:
  - 在首次提到"循环"时展开解释 agentic loop 的概念
  - 简明描述：agent 发送请求 → LLM 返回 tool_calls → agent 执行工具 → 将结果作为新上下文发送下一轮请求 → 重复，直到 LLM 认为任务完成（返回纯文本而非 tool_calls）
  - 2-3 句话即可，不要变成独立章节（节点 2 actors.md 已有详细讲解，这里只需让读者理解"循环"指什么）

  **评论 #12（line 123 附近）— 添加 mermaid 序列图**:
  - 在工具调用流程讲解完成后添加 `sequenceDiagram`
  - 展示一次完整的工具调用循环：User→Agent→LLM（请求含 tool 定义）→ LLM 返回 tool_calls JSON → Agent 执行工具 → Agent 将结果拼入 messages → Agent 再次请求 LLM → LLM 返回最终回答
  - 与 context.md 的 mermaid 图区分：这里侧重展示 **工具调用细节**（tool_calls JSON 格式、工具执行、结果回注），context.md 侧重展示**上下文膨胀**

  **评论 #13（line 131 附近）— 修复"世界"用词**:
  - "通过返回值知道世界是什么样" → 改为更准确的表述，如"通过返回值获知当前状态"或"通过返回值了解执行结果"
  - 英文版做对应调整

  **评论 #14（line 136 附近）— 明确谁负责分页/裁剪**:
  - 在讲上下文裁剪的段落中明确：
    - **分页/行数限制**：通常是 agent 开发者在**工具实现层**做的（如 Read 工具限制返回行数、Bash 工具截断过长输出）
    - **用户不直接控制**这些裁剪行为——它们是工具定义的一部分
    - agent 做这些限制的目的是保护上下文窗口不被单个工具返回值淹没
  - 1-2 句简明解释即可

  **评论 #15（line 140 附近）— 重新措辞"别骂它瞎跑"标题**:
  - 当前标题过于口语化/不严肃
  - 替换为更准确但仍有个性的标题，如："工具不对？先检查定义"或"工具调用出错时怎么想"或"当工具行为不符预期"
  - 保持非学术感，但比"别骂它瞎跑"更正式一格

  **通用步骤**:
  - 保留用户已做的直接修改（如"核心引擎"→"核心"、JSON 代码块格式化、段落合并）
  - 删除所有 `<!-- -->` HTML 评论
  - 英文版 `docs/en/guide/built-in-tools.md` 同步

  **Must NOT do**:
  - 不处理评论 #16（工具对比表）——那是 Task 13
  - 不借机添加练习或 checklist

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 涉及概念解释、mermaid 创建、标题打磨、多处修改
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 教程内容编辑风格 + HTTP/SSE 技术解释模式
    - `humanizer-zh`: 去 AI 痕迹

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `docs/guide/built-in-tools.md` — 当前文件
  - `docs/en/guide/built-in-tools.md` — 英文版
  - `docs/guide/actors.md` 中关于 agentic loop 的描述 — 避免重复但保持一致（评论 #11）
  - `docs/guide/context.md` 中的 mermaid 图 — 与本文 mermaid 区分侧重点（评论 #12）

  **Acceptance Criteria**:
  - [ ] 5 条评论（#11,#12,#13,#14,#15）均已处理
  - [ ] 所有 HTML 评论标记已删除
  - [ ] agentic loop 概念已简明解释
  - [ ] 新增 mermaid sequenceDiagram 展示工具调用细节
  - [ ] "世界"用词已修正
  - [ ] 分页/裁剪的责任方已明确
  - [ ] "别骂它瞎跑"标题已替换
  - [ ] 英文版同步
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: mermaid 图渲染 + 差异化
    Tool: Bash + Read
    Preconditions: 编辑完成
    Steps:
      1. bun run docs:build — 无 mermaid 错误
      2. 读取 built-in-tools.md 的 mermaid 代码块
      3. 确认图中包含 tool_calls、工具执行等关键节点（区别于 context.md 的上下文膨胀视角）
    Expected Result: 构建通过，mermaid 图侧重工具调用细节
    Evidence: .sisyphus/evidence/task-6-mermaid.txt

  Scenario: 评论清零
    Tool: Bash (grep)
    Steps:
      1. Grep "<!--" docs/guide/built-in-tools.md
      2. Grep "<!--" docs/en/guide/built-in-tools.md
    Expected Result: 无 HTML 评论
    Evidence: .sisyphus/evidence/task-6-comment-check.txt
  ```

  **Commit**: YES (groups with T4, T5, T7, T8)
  - Message: `docs: address inline review comments for 5 tutorial pages (CN+EN)`
  - Files: `docs/guide/built-in-tools.md`, `docs/en/guide/built-in-tools.md`

- [ ] 7. system-instructions.md 评论处理 (#9) + 英文同步

  **What to do**:

  处理 system-instructions.md 中的 1 条内容评论，保留用户直接修改，删除 HTML 评论。英文版同步。

  **评论 #9（line 63 附近）— 补充系统指令的第三来源**:
  - 当前内容讲了两个系统指令来源（开发者预设 + 用户自定义）
  - 补充第三来源：**agent 在对话中自动生成/更新**
    - 场景：用户指示 agent 把当前讨论的决定写入项目规则文件（如 "把这个约定加到 AGENTS.md"）
    - 场景：系统指令本身要求 agent 在特定时刻更新规则（如 "每次发现新的代码约定，追加到规则文件"）
    - 这使得系统指令成为可演进的活文档，而非静态配置
  - 篇幅：1-2 段，不超过 context.md 中对此概念的讲解深度
  - 保持 agent-agnostic：不具名任何特定 agent

  **用户直接修改**:
  - 保留标题"关键洞察：用户自定义指令是你手里最有效的手段"中删除"关键洞察："前缀的修改
  - 保留 markdown 代码块空行修复

  **通用步骤**:
  - 删除 `<!-- -->` HTML 评论
  - 英文版 `docs/en/guide/system-instructions.md` 同步

  **Must NOT do**:
  - 不处理评论 #10（SVG 重叠修复）——那是 Task 11
  - 不在此文件中使用具体产品名

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 需要准确补充新概念并保持与已有内容的一致性
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 教程内容风格
    - `humanizer-zh`: 去 AI 痕迹

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6, 8)
  - **Blocks**: Task 9
  - **Blocked By**: None（不依赖 T1 的扫描结果）

  **References**:

  **Pattern References**:
  - `docs/guide/system-instructions.md` — 当前文件
  - `docs/en/guide/system-instructions.md` — 英文版
  - `docs/guide/knowledge-feeding.md` — 参考"知识喂养"章节中关于规则层/能力层的描述，确保新增内容不与之矛盾

  **Acceptance Criteria**:
  - [ ] 评论 #9 已处理——第三来源（agent 自动生成/更新系统指令）已补充
  - [ ] 用户直接修改已保留
  - [ ] 所有 HTML 评论标记已删除
  - [ ] 英文版同步
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 评论清零
    Tool: Bash (grep)
    Steps:
      1. Grep "<!--" docs/guide/system-instructions.md
      2. Grep "<!--" docs/en/guide/system-instructions.md
    Expected Result: 无 HTML 评论
    Evidence: .sisyphus/evidence/task-7-comment-check.txt

  Scenario: 第三来源内容准确性
    Tool: Read
    Steps:
      1. 读取新增段落
      2. 确认描述了 agent 在对话中生成/更新系统指令的场景
      3. 确认无具体产品名
    Expected Result: 新增内容准确、agent-agnostic
    Evidence: .sisyphus/evidence/task-7-content-check.md
  ```

  **Commit**: YES (groups with T4, T5, T6, T8)
  - Message: `docs: address inline review comments for 5 tutorial pages (CN+EN)`
  - Files: `docs/guide/system-instructions.md`, `docs/en/guide/system-instructions.md`

- [ ] 8. index.md 修改 + CLAUDE.md 规则更新

  **What to do**:

  **Part A — index.md 修改**:
  - 保留用户已做的直接修改（删除"先看一张静态示意图，感受一次任务里的'上下文供给链'："）
  - 删除 index.md 中的 HTML 评论（评论 #8 本身——水印清理由 T2+T12 处理）
  - 英文版 `docs/en/guide/index.md` 同步

  **Part B — CLAUDE.md 规则更新**:
  将从 20 条评论中归纳的 7 个通用模式写入 CLAUDE.md 的写作纪律 section：
  1. **解释性缺口规则**：首次提到技术概念时必须解释清楚（谁做的、怎么做的、为什么），不能假设读者已知
  2. **标题准确性规则**：标题必须准确传达 section 内容，避免口语化/模糊/不恰当的措辞
  3. **section 连贯性规则**：同一 section 内的段落必须有逻辑顺序和过渡，不能碎片化
  4. **交叉引用规则**：不同章节讲同一概念时，主讲章节展开，其他章节用交叉引用而非重复
  5. **渲染验证规则**：mermaid 图和 SVG 修改后必须验证渲染效果（文字截断、元素重叠）
  6. **agent-agnostic 引用规则**：在 docs/guide/ 中引用配置文件名时，使用通用表述或列举多个工具的格式
  7. **内容归属规则**：每段内容应明确属于当前章节的主题；如果像是"技巧/方法论"，要么有引子解释为什么放在这里，要么添加交叉引用

  **Part C — CLAUDE.md 产品名禁令放宽**:
  在 "主内容产品名禁令" 段落中添加例外说明：`built-in-tools.md` 中的具体工具示例对比表允许使用产品名（Claude Code、Codex、Gemini CLI、OpenCode），作为用户对评论 #16 的特批。

  **Must NOT do**:
  - 不重写 CLAUDE.md 的现有规则——只追加新规则
  - 不删除或修改 `.sisyphus/drafts/draft-ideas.md`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: index.md 修改很小（保留用户编辑 + 删评论），CLAUDE.md 是追加规则
  - **Skills**: [`writing-clearly-and-concisely`]
    - `writing-clearly-and-concisely`: 规则文本需要清晰简洁

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6, 7)
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/guide/index.md` — 当前文件
  - `docs/en/guide/index.md` — 英文版
  - `CLAUDE.md` "写作纪律（审校规则）" section — 追加位置
  - 7 个模式的完整定义见 handoff context 中的 "归纳出的通用模式" 表

  **Acceptance Criteria**:
  - [ ] index.md 用户直接修改已保留
  - [ ] index.md HTML 评论已删除
  - [ ] 英文版同步
  - [ ] CLAUDE.md 新增 7 条规则，追加在现有写作纪律 section 中
  - [ ] 新规则清晰简洁，可操作

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 评论清零
    Tool: Bash (grep)
    Steps:
      1. Grep "<!--" docs/guide/index.md
    Expected Result: 无 HTML 评论
    Evidence: .sisyphus/evidence/task-8-comment-check.txt

  Scenario: CLAUDE.md 规则完整性
    Tool: Read
    Steps:
      1. 读取 CLAUDE.md 的写作纪律 section
      2. 确认 7 条新规则均已存在
      3. 确认未删改现有规则
    Expected Result: 7/7 新规则存在，现有规则完整
    Evidence: .sisyphus/evidence/task-8-rules-check.md
  ```

  **Commit**: YES (groups with T4, T5, T6, T7)
  - Message: `docs: address inline review comments for 5 tutorial pages (CN+EN)`
  - Files: `docs/guide/index.md`, `docs/en/guide/index.md`, `CLAUDE.md`

---

### Wave 3 — 跨文件 + SVG + 工具表（5 并行）

- [ ] 9. 全站"留意这三件事"标题替换 + LLM/AI 术语统一 + 英文同步

  **What to do**:

  基于 Task 1 的扫描结果，在全站范围执行两项统一性修改。

  **Part A — "留意这三件事"标题替换**:
  - 用户评论 #7 要求替换所有章节末尾的 "读每一节时，留意这三件事" 标题
  - 根据 Task 1 的扫描结果，逐文件替换
  - 新标题建议：`本节小结` 或 `关键要点` 或 `这一节的三个关键点`（选择最符合写作纪律"不装逼"原则的）
  - 英文版对应标题也统一替换（如 "Three Things to Watch For" → "Key Takeaways" 或 "Section Summary"）
  - **注意 anchor 兼容**：如果 Task 1 发现有其他页面链接到这些 heading 的 anchor，需要保留兼容锚点（`<a id="旧anchor"></a>`）

  **Part B — LLM/AI 术语统一**:
  - 根据 Task 1 的扫描结果，统一全站 LLM 和 AI 的使用
  - **统一规则**：
    - 技术语境（描述 API、模型推理、token 处理等）：用 **LLM**
    - 泛称/日常语境（"AI 编程助手"、"AI 时代"等）：可用 **AI**
    - 同一段落/同一 section 内不混用
    - 术语表 `glossary.md` 中如有定义，以术语表为准
  - 逐个不一致处理：判断该处应该是 LLM 还是 AI，统一修改
  - 英文版同步

  **Must NOT do**:
  - 不修改 T4-T8 未涉及的段落的**内容**（只改术语和标题）
  - 不添加新内容
  - 不改变标题层级（如 ### 保持 ###，不升降级）

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 全站范围的精确替换，需要逐文件判断每处是否应该改
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 确保替换后的标题和术语符合风格
    - `humanizer-zh`: 替换后语句自然

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12, 13)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 1, 4, 5, 6, 7, 8（必须在所有单文件编辑完成后执行，避免冲突）

  **References**:

  **Pattern References**:
  - Task 1 的输出报告 — 扫描结果（标题位置、术语分布、anchor 引用）
  - `CLAUDE.md` "同一节内术语必须统一" — 统一标准
  - `docs/guide/glossary.md` — 术语表中 LLM/AI 的定义

  **Acceptance Criteria**:
  - [ ] 所有 "留意这三件事" / "three things" 标题已替换
  - [ ] 替换后的标题全站统一
  - [ ] 如有 anchor 引用，兼容锚点已添加
  - [ ] LLM/AI 使用在每个 section 内一致
  - [ ] 英文版同步
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 标题替换完整性
    Tool: Bash (grep)
    Steps:
      1. Grep "留意这三件事" docs/guide/*.md — 应返回 0 结果
      2. Grep "three things" docs/en/guide/*.md — 应返回 0 结果（如果旧英文标题包含此短语）
      3. Grep 新标题 docs/guide/*.md — 确认替换到位
    Expected Result: 旧标题 0 匹配，新标题在所有原有位置出现
    Evidence: .sisyphus/evidence/task-9-title-check.txt

  Scenario: 术语一致性抽查
    Tool: Read
    Steps:
      1. 随机读取 3 个文件，检查每个 section 内 LLM/AI 是否统一
    Expected Result: 同一 section 内无 LLM/AI 混用
    Evidence: .sisyphus/evidence/task-9-terminology-check.md
  ```

  **Commit**: YES
  - Message: `docs: unify section titles and LLM/AI terminology site-wide (CN+EN)`
  - Files: `docs/guide/*.md`, `docs/en/guide/*.md`
  - Pre-commit: `bun run docs:build`

- [ ] 10. context.svg 布局重设计 (#5)

  **What to do**:
  - 用户评论 #5（context.md line 163）："This SVG does not look very clear the four things in a linear line does not seem appropriate"
  - 当前 `docs/public/illustrations/context.svg` 中四个动作（写/选/压/隔）排成一条线
  - 重新设计布局，使四个动作的关系更清晰。建议方案：
    a) 2×2 网格布局（写+选 上排，压+隔 下排）
    b) 中心辐射布局（中心是"上下文管理"，四个动作围绕）
    c) 流程型布局但带分支/并行关系
  - **保留原有的所有信息和动画**（SVG 原生 animate 系列）
  - **保留原有的视觉风格**（暗色赛博朋克风 + 配色方案）
  - viewBox 保持 `1200 675`
  - 文字使用英文
  - 不使用 CSS/JS 动画
  - 不使用 feTurbulence/feSpecularLighting 等重度滤镜

  **Must NOT do**:
  - 不丢失任何原有信息
  - 不丢失任何原有动画
  - 不改变 viewBox 尺寸
  - 不引入 CSS/JS 动画
  - 不改变文件名或路径

  **Recommended Agent Profile**:
  - **Category**: `artistry`
    - Reason: SVG 布局重设计需要视觉创意
  - **Skills**: [`baoyu-infographic`]
    - `baoyu-infographic`: SVG 信息图设计规格库

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11, 12, 13)
  - **Blocks**: F4
  - **Blocked By**: None（SVG 文件不依赖 markdown 编辑）

  **References**:

  **Pattern References**:
  - `docs/public/illustrations/context.svg` — 当前文件（需要读取完整内容以保留信息和动画）
  - `docs/public/illustrations/knowledge-feeding.svg` — 标杆参考（CLAUDE.md 标注为⭐标杆）
  - CLAUDE.md "SVG 硬约束" — viewBox/动画/文字/滤镜限制

  **Acceptance Criteria**:
  - [ ] 四个动作不再排成一条线
  - [ ] 所有原有信息保留
  - [ ] 所有原有动画保留（animate 元素数量 ≥ 原文件）
  - [ ] viewBox 为 `1200 675`
  - [ ] 文字为英文
  - [ ] 无 CSS/JS 动画
  - [ ] 无重度滤镜
  - [ ] XML 合法（无未转义 `&`）

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: SVG 结构验证
    Tool: Bash (grep)
    Steps:
      1. Grep "viewBox" docs/public/illustrations/context.svg — 确认值为 "0 0 1200 675"
      2. Grep "<style" docs/public/illustrations/context.svg — 应返回 0（无 CSS）
      3. Grep "<script" docs/public/illustrations/context.svg — 应返回 0（无 JS）
      4. Grep "feTurbulence\|feSpecularLighting" docs/public/illustrations/context.svg — 应返回 0
    Expected Result: 所有检查通过
    Evidence: .sisyphus/evidence/task-10-svg-validation.txt

  Scenario: 信息保留验证
    Tool: Read
    Steps:
      1. 读取原 context.svg，记录所有文本内容和 animate 元素数量
      2. 读取新 context.svg，对比文本内容和 animate 元素数量
    Expected Result: 文本内容完整保留，animate 元素数量 ≥ 原文件（30 个）
    Evidence: .sisyphus/evidence/task-10-info-preservation.md
  ```

  **Commit**: YES
  - Message: `art: redesign context.svg layout for better clarity`
  - Files: `docs/public/illustrations/context.svg`

- [ ] 11. system-instructions-inline-1.svg 重叠修复 (#10)

  **What to do**:
  - 用户评论 #10（system-instructions.md line 76）报告两个视觉问题：
    1. "highest leverage" 文字与左侧文字重叠
    2. 右侧旋转动画元素（spinning thing）与下方文字重叠
  - 读取当前 `docs/public/illustrations/system-instructions-inline-1.svg`
  - 修复两个重叠问题：
    a) 调整 "highest leverage" 文本的位置（增大 x 坐标或缩小字号）
    b) 调整旋转元素的位置或大小，使其不与下方文字冲突
  - **保留原有信息和动画**
  - 遵循 SVG 硬约束

  **Must NOT do**:
  - 不删除任何信息或动画
  - 不改变文件的整体视觉风格

  **Recommended Agent Profile**:
  - **Category**: `artistry`
    - Reason: 精确的 SVG 位置调整需要视觉感知
  - **Skills**: [`baoyu-infographic`]
    - `baoyu-infographic`: SVG 信息图修复参考

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 12, 13)
  - **Blocks**: F4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/public/illustrations/system-instructions-inline-1.svg` — 当前文件

  **Acceptance Criteria**:
  - [ ] "highest leverage" 文字不再与左侧文字重叠
  - [ ] 旋转元素不再与下方文字重叠
  - [ ] 所有信息和动画保留
  - [ ] viewBox 不变
  - [ ] XML 合法

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 重叠修复验证
    Tool: Read
    Steps:
      1. 读取修复后的 SVG
      2. 检查 "highest leverage" 相关文本元素的 x/y 坐标
      3. 检查旋转动画元素的位置和大小
      4. 确认相邻元素之间有足够间距（至少 20px）
    Expected Result: 无元素重叠
    Evidence: .sisyphus/evidence/task-11-overlap-fix.md

  Scenario: SVG 完整性
    Tool: Bash (grep)
    Steps:
      1. Grep "viewBox" — 确认存在
      2. Grep "<style\|<script" — 应返回 0
    Expected Result: 通过
    Evidence: .sisyphus/evidence/task-11-svg-integrity.txt
  ```

  **Commit**: YES
  - Message: `art: fix text overlap in system-instructions-inline-1.svg`
  - Files: `docs/public/illustrations/system-instructions-inline-1.svg`

- [ ] 12. SVG 水印/签名清理

  **What to do**:
  - 基于 Task 2 的扫描结果，清理所有被标记为有水印/签名的 SVG 文件
  - 对每个标记的文件：
    a) 读取 SVG 内容
    b) 定位水印/签名元素
    c) 删除该元素（或将其 opacity 设为 0 / display 设为 none）
    d) 确认删除不影响图表其他部分
  - 如果 Task 2 扫描结果为"无水印"，则本 task 不执行（标记为 N/A 完成）

  **Must NOT do**:
  - 不删除图表内容元素（只删水印/签名）
  - 不修改图表的信息内容或布局
  - 不改变 viewBox 或动画

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 定点删除操作，位置已由 T2 确定
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11, 13)
  - **Blocks**: F4
  - **Blocked By**: Task 2（需要扫描结果）

  **References**:

  **Pattern References**:
  - Task 2 的输出报告 — 水印位置清单
  - `docs/public/illustrations/*.svg` — 全部 SVG 文件

  **Acceptance Criteria**:
  - [ ] Task 2 标记的所有水印/签名已清理
  - [ ] 清理后的 SVG 信息内容完整
  - [ ] XML 合法
  - [ ] 无误删图表内容

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 水印清理验证
    Tool: Bash (grep)
    Steps:
      1. 对 Task 2 标记的每个文件，Grep 原水印文本内容
      2. 应返回 0 结果
    Expected Result: 水印文本已不存在
    Evidence: .sisyphus/evidence/task-12-watermark-clean.txt

  Scenario: 内容保留验证
    Tool: Read
    Steps:
      1. 对每个修改的文件，比较修改前后的 animate 元素数量
    Expected Result: animate 元素数量不变
    Evidence: .sisyphus/evidence/task-12-content-preserved.md
  ```

  **Commit**: YES
  - Message: `art: remove watermarks/signatures from SVG illustrations`
  - Files: 被清理的 SVG 文件

- [ ] 13. built-in-tools.md 工具对比表 (#16) + 英文同步

  **What to do**:
  - 用户评论 #16（built-in-tools.md line 172）要求列出 Claude Code / Codex / Gemini CLI / OpenCode 的具体内置工具和权限控制示例
  - 基于 Task 3 的研究结果，创建工具对比表

  **放置位置：直接在 `built-in-tools.md` 中添加（用户特批放宽产品名禁令）**
  - 用户裁决：视评论 #16 为对 CLAUDE.md "主内容产品名禁令"的特批
  - 直接在 `built-in-tools.md` 信任边界分级段之后添加四工具对比表
  - Task 8 需同步更新 CLAUDE.md，在产品名禁令处添加例外说明：`built-in-tools.md` 中的具体工具示例表允许使用产品名（Claude Code、Codex、Gemini CLI、OpenCode）
  - 对比表内容必须基于 Task 3 的研究结果（真实信息）
  - 无法确认的信息标注 "待核查"
  - 英文版同步
  - 对比维度建议：工具分类（读/写/执行/搜索/网络）、权限模型（自动/确认/沙箱）、用户可配置性

  **Must NOT do**:
  - 不编造工具信息
  - 不使用 Cursor/Windsurf/GitHub Copilot 等 CLAUDE.md 明确禁止的产品名

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 需要组织研究结果为清晰的对比表格，处理 agent-agnostic 约束
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 内容风格
    - `humanizer-zh`: 自然表述

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11, 12)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 3（需要研究结果）

  **References**:

  **Pattern References**:
  - Task 3 的输出报告 — 四个 agent 的工具和权限信息
  - `docs/guide/built-in-tools.md` — 放置位置（方案 B）
  - `docs/guide/in-practice.md` — 放置位置（方案 A）
  - `CLAUDE.md` "主内容产品名禁令" — 约束规则
  - `CLAUDE.md` "In Practice 打破 agent-agnostic" — 例外规则

  **Acceptance Criteria**:
  - [ ] 工具对比表已创建，内容基于 Task 3 研究
  - [ ] 无编造信息
  - [ ] 放置位置符合用户裁决的方案
  - [ ] 英文版同步
  - [ ] `bun run docs:build` 通过

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: 信息来源验证
    Tool: Read
    Steps:
      1. 读取对比表内容
      2. 对每个数据点，检查是否有 Task 3 的来源支撑
      3. 未确认的信息应标注 "待核查"
    Expected Result: 所有数据点有来源或标注
    Evidence: .sisyphus/evidence/task-13-source-verification.md

  Scenario: 产品名合规
    Tool: Bash (grep)
    Steps:
      1. Grep "Cursor\|Windsurf\|GitHub Copilot" docs/guide/built-in-tools.md
    Expected Result: 0 匹配
    Evidence: .sisyphus/evidence/task-13-name-compliance.txt
  ```

  **Commit**: YES
  - Message: `docs: add tool comparison table for built-in tools`
  - Files: 取决于方案选择

---

## Final Verification Wave

- [ ] F1. **构建验证 + 评论清零** — `unspecified-high`
  读取所有目标文件（10 个 md），运行 `bun run docs:build`，然后用 Grep 扫描 `<!--` 确认所有 HTML 评论已删除。检查构建输出中无 Mermaid parse error。
  Output: `Build [PASS/FAIL] | Comments [0 remaining/N found] | Mermaid [PASS/FAIL] | VERDICT`

- [ ] F2. **禁词 + 产品名 + 术语一致性扫描** — `unspecified-high`
  扫描 `docs/guide/` 和 `docs/en/guide/`：1) 禁用产品名（Cursor/Windsurf/GitHub Copilot/.cursorrules/copilot-instructions.md）；2) CLAUDE.md 禁用词表中的词汇；3) LLM/AI 使用是否一致。
  Output: `Banned products [CLEAN/N found] | Banned terms [CLEAN/N found] | Term consistency [PASS/FAIL] | VERDICT`

- [ ] F3. **中英文一致性检查** — `deep`
  对比 5 对中英文件：1) 结构匹配（标题层级、section 数量）；2) mermaid 图数量匹配；3) 新增/修改的段落在英文版中有对应内容。标记任何不一致。
  Output: `Files [5/5 pairs checked] | Structure [N/N match] | Mermaid [N/N match] | VERDICT`

- [ ] F4. **SVG 结构验证** — `quick`
  检查所有修改过的 SVG 文件：1) viewBox 属性存在；2) 尺寸符合规范（1200×675 或 1200×500）；3) XML 合法性（无未转义 `&`）；4) 无 CSS/JS 动画（只有 SVG 原生 animate 系列）；5) 文字为英文。
  Output: `SVGs checked [N/N valid] | ViewBox [PASS/FAIL] | XML [PASS/FAIL] | Animation [PASS/FAIL] | VERDICT`

---

## Commit Strategy

| After Wave | Message | Files | Verification |
|------------|---------|-------|--------------|
| Wave 2 | `docs: address inline review comments for 5 tutorial pages (CN+EN)` | docs/guide/*.md + docs/en/guide/*.md | bun run docs:build |
| Wave 3 | `art+docs: fix SVG issues, add tool comparison, unify terminology site-wide` | docs/public/illustrations/*.svg + docs/guide/*.md + docs/en/guide/*.md + CLAUDE.md | bun run docs:build |

---

## Success Criteria

### Verification Commands
```bash
bun run docs:build                    # Expected: exit code 0
rg "<!--" docs/guide/context.md docs/guide/actors.md docs/guide/built-in-tools.md docs/guide/system-instructions.md docs/guide/index.md  # Expected: no matches
rg "Cursor|Windsurf|GitHub Copilot|\.cursorrules|copilot-instructions\.md" docs/guide/ docs/en/guide/  # Expected: no matches
rg "viewBox=" docs/public/illustrations/context.svg docs/public/illustrations/system-instructions-inline-1.svg  # Expected: matches
```

### Final Checklist
- [ ] All 20 inline comments addressed and deleted
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build passes
- [ ] CN+EN synchronized
