# 教程网站 Agent Prompt 体验重构

## TL;DR

> **Quick Summary**: 彻底重构现有的 `<AgentPrompt>` 组件，将其从页面底部的“通用行动指令”升级为页面顶部的“隐藏式私人导读 Prompt 复制按钮”。
> 
> **Deliverables**: 
> - 从 36 个 Markdown 文件中移除旧的组件标签。
> - 全新设计的 `AgentPrompt.vue` 组件（仅高亮复制按钮，无 🤖 emoji）。
> - VitePress Layout 全局顶部注入（仅限文档页）。
> - 纯净 DOM 内容抽取与剪贴板拼接逻辑（正文 + 导读 Prompt）。
> - 中英双语的“私人导读” Prompt 模板（支持术语自适应与链接 Fallback）。
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1/2 → Task 3 → Task 4 → F1-F4

---

## Context

### Original Request
用户要求重构现有的 `<AgentPrompt>` 功能。移除底部显示和老土的 emoji，将其移至页面最顶部，作为一个不可忽视的复制按钮。点击时，不仅复制 Prompt，还要复制整个页面的正文。Prompt 的核心目标是让 Agent 成为“私人导读（private tutor）”，根据当前页面内容向用户讲解，并且要能使用 Agent 自身的术语。还要处理 Agent 无法访问相关链接的 Fallback 情况。

### Interview Summary
**Key Discussions**:
- **剪贴板策略**: 决定使用【当前页正文 + 导读 Prompt 模板】，确保无网页抓取能力的 Agent 也能立刻获得上下文。
- **UI 要求**: 隐藏 Prompt 具体文本，按钮极其醒目。
- **行为规范**: 严禁在用户 review 前进行 commit。所有相关计划文件均使用中文。

### Metis Review
**Identified Gaps** (addressed):
- **实现路径**: 采用 VitePress Theme Layout 全局注入，避免手动维护 36 个页面的组件位置。
- **多语言处理**: 必须根据当前页面的路由（`/en/`）动态切换中英双语 Prompt 模板。
- **SSR/Hydration 安全**: 涉及 DOM 和 Clipboard 的操作必须包裹在 `onMounted` 或客户端专属逻辑中。
- **DOM 内容纯净度**: 提取正文时需剔除 `.header-anchor` 等 UI 干扰元素。

### User Review Focus Areas (For Momus)
1. **No Information Loss**: 确保 Agent 能够毫无风险地获取到完整信息。提取方案：优先通过 VitePress `useData()` 结合 DOM `innerText` 或克隆清理，保证 Mermaid 描述、表格内容、隐藏代码块结构等核心语义无损（对导读场景而言无损即可，无需完全 1:1 Markdown）。
2. **Zero Maintenance Overhead**: DOM 实时提取方案本身就满足这一条，当 Markdown 变更时，DOM 随之变更，复制包自然更新，完全零维护成本。
3. **Prompt Effectiveness**: 强化 Prompt：加入“采用苏格拉底式互动”、“讲解一节后停下来确认理解”、“举与用户正在开发的项目相关的例子”等高阶指导。

---

## Work Objectives

### Core Objective
将现有的静态 Action Prompt 重构为高可见度的全局顶部复制按钮，提供包含纯净页面正文与强力私人导读设定的上下文包。

### Concrete Deliverables
- 清理后的 36 个 `docs/guide` 及 `docs/en/guide` Markdown 文件。
- 独立的 `prompt-templates.ts` 配置文件。
- 重构后的 `AgentPrompt.vue` 和更新的 `theme/index.ts`。

### Definition of Done
- [ ] 所有教程页面顶部均可见该复制按钮。
- [ ] Markdown 源文件底部不再有该组件。
- [ ] 点击复制后，剪贴板包含当前页纯净文本及导读 Prompt。
- [ ] 导读 Prompt 包含 private tutor 设定、术语自适应要求和链接 Fallback 要求。

### Must Have
- 中英双语 Prompt 适配。
- 醒目的 UI 视觉（Unmissable）。
- DOM 提取必须过滤无用干扰符（如锚点 `#`）。

### Must NOT Have (Guardrails)
- 严禁在 UI 上展示 Prompt 具体文本。
- 严禁使用 🤖 emoji。
- 严禁逐页手动在 Markdown 顶部添加组件（必须通过 Theme 注入）。
- 在 review 前绝对不能执行 git commit。

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO (Agent-Executed QA)
- **Agent-Executed QA**: 必须使用 Playwright 测试浏览器剪贴板复制逻辑、UI 渲染位置和中英文 Prompt 切换是否正确。

---

## Execution Strategy

### Parallel Execution Waves

```text
Wave 1 (Cleanup & Config):
├── Task 1: 批量清理 Markdown 文件中的旧组件 [quick]
└── Task 2: 编写中英双语 Prompt 模板配置 [writing]

Wave 2 (UI & Logic Implementation):
├── Task 3: AgentPrompt.vue UI 重构及 Theme 注入 [visual-engineering] (depends: 2)
└── Task 4: 纯净 DOM 提取与剪贴板拼接逻辑 [deep] (depends: 3)

Wave FINAL (Verification):
├── Task F1: Plan Compliance Audit (oracle)
├── Task F2: Code Quality Review (unspecified-high)
├── Task F3: Real Manual QA (unspecified-high)
└── Task F4: Scope Fidelity Check (deep)
```

---

## TODOs

- [x] 1. 清理 36 个 Markdown 教程页面底部的旧组件

  **What to do**:
  - 批量搜索 `docs/guide/*.md` 和 `docs/en/guide/*.md`。
  - 删除文件末尾所有的 `<AgentPrompt ... />` 或相关的使用标签。
  - 确保删除后不要留下多余的空行。

  **Must NOT do**:
  - 不要手动在这些页面的顶部加上 `<AgentPrompt />`（此工作由 Theme 布局接管）。
  - 不要修改首页（`index.md`）或其他非教程页的内容。

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 这是一个简单的基于正则表达式或精确搜索的批量文本删除任务。
  - **Skills**: [`git-master`]
    - `git-master`: 防止误提交，方便在出错时安全撤销。

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: [Task 3]
  - **Blocked By**: None

  **References**:
  - 现有页面示例：`docs/guide/context.md` (查看末尾的旧组件)。

  **Acceptance Criteria**:
  - [ ] `git diff` 显示 36 个文件中 `<AgentPrompt>` 相关的标签被完全删除。

  **QA Scenarios (MANDATORY)**:

  ```text
  Scenario: 验证旧组件是否被全量清除
    Tool: Bash
    Preconditions: 执行完批量清理脚本
    Steps:
      1. 执行 `grep -r "<AgentPrompt" docs/guide docs/en/guide`
      2. 验证输出是否为空
    Expected Result: 没有找到匹配项（无输出）。
    Failure Indicators: 输出中仍有文件包含旧的 AgentPrompt。
    Evidence: .sisyphus/evidence/task-1-grep-empty.txt
  ```

  **Commit**: NO (Wait for review)

- [x] 2. 编写中英双语“私人导读” Prompt 模板

  **What to do**:
  - 新建或重构 `docs/.vitepress/theme/prompt-templates.ts`。
  - 编写两个常量 `ZH_PROMPT_TEMPLATE` 和 `EN_PROMPT_TEMPLATE`。
  - 模板必须包含：
    1. 角色设定：作为用户的“私人导读（private tutor）”，根据传入的正文向用户逐步讲解当前章节。
    2. 术语自适应要求：明确指示 Agent“如果你是 Cursor/Claude/Copilot，请使用你生态内的相关术语（如 System Instructions 类比为 `.cursorrules`）”。
    3. Fallback 防御机制：如果当前页面包含“相关阅读”或“后续章节”的链接，若你无法自动抓取网络内容，请明确告知人类用户：“我需要补充这些链接的内容，请手动复制给我”。
  - 不得在其中使用 🤖 emoji。

  **Must NOT do**:
  - Prompt 语气不要死板，要求生动且循序渐进。

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 需要编写能够深刻影响 LLM 行为的高质量提示词（Prompt Engineering）。
  - **Skills**: [`writing-clearly-and-concisely`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: [Task 3, Task 4]
  - **Blocked By**: None

  **References**:
  - 用户原始语录："agent when walk the human thru, should talk its own relevant terminology"

  **Acceptance Criteria**:
  - [ ] 配置文件 `docs/.vitepress/theme/prompt-templates.ts` 被创建且包含中英双语内容。
  - [ ] 包含 tutor、terminology、fallback 三大要素。

  **QA Scenarios (MANDATORY)**:

  ```text
  Scenario: 验证 Prompt 模板包含必须的关键字
    Tool: Bash
    Preconditions: 模板文件创建完成
    Steps:
      1. 执行 `cat docs/.vitepress/theme/prompt-templates.ts | grep "tutor\|terminology\|fallback\|导读\|术语\|手动"`
    Expected Result: 输出中明确显示包含这些概念的指示语句。
    Failure Indicators: 找不到相关的指导。
    Evidence: .sisyphus/evidence/task-2-prompt-grep.txt
  ```

  **Commit**: NO

- [x] 3. UI 重构及 Theme 顶层注入 (AgentPrompt.vue & index.ts/layout.ts)

  **What to do**:
  - 重构 `docs/.vitepress/theme/AgentPrompt.vue`。
  - **UI 设计**: 不显示 Prompt 具体内容，只渲染一个显眼（Unmissable）的“复制此页交由 Agent 导读”类型的按钮。移除 🤖。
  - **注入方式**: 在 `docs/.vitepress/theme/index.ts` (或如果存在自定义的 `layout.ts`) 中，使用 VitePress 的 Layout 拓展能力。**注意保护现有的布局逻辑**：
    ```ts
    // 示例：在现有 Layout 基础上提供 doc-before 插槽，不要破坏现存的其他自定义 slot
    import DefaultTheme from 'vitepress/theme'
    import CustomLayout from './Layout.vue' // 或者是当前使用中的 Layout
    import AgentPrompt from './AgentPrompt.vue'
    import { h } from 'vue'

    export default {
      extends: DefaultTheme,
      Layout: () => {
        return h(CustomLayout || DefaultTheme.Layout, null, {
          'doc-before': () => h(AgentPrompt)
        })
      }
    }
    ```
  - **路由判断**: 只有 `/guide/` 或 `/en/guide/` 下才渲染（注意剔除可能存在的根目录或特殊页面）。

  **Must NOT do**:
  - 严禁影响页面的初始 SSR 渲染（注意处理 window 变量或使用 ClientOnly）。
  - 不要通过手写 JavaScript 去 DOM 中动态 `prependChild`。

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 需要编写 Vue 组件和处理 VitePress 布局层 API，要求高超的前端框架和样式技能。
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: [Task 4]
  - **Blocked By**: [Task 2]

  **References**:
  - [VitePress Layout Slots Docs](https://vitepress.dev/guide/extending-default-theme#layout-slots)
  
  **Acceptance Criteria**:
  - [ ] 按钮组件在所有的 `/guide/` 页面顶部渲染。
  - [ ] 按钮上没有 emoji。
  - [ ] 构建无 SSR 错误。

  **QA Scenarios (MANDATORY)**:

  ```text
  Scenario: 检查按钮的渲染和路由屏蔽
    Tool: Playwright (dev-browser)
    Preconditions: 本地 dev server 已启动
    Steps:
      1. 访问 `/guide/context`，检查是否存在 `.agent-prompt-btn`。
      2. 访问 `/` (首页)，检查是否存在 `.agent-prompt-btn`。
    Expected Result: 教程页存在按钮，首页不存在。
    Failure Indicators: 找不到按钮或首页上出现了按钮。
    Evidence: .sisyphus/evidence/task-3-ui-check.png
  ```

  **Commit**: NO

- [x] 4. 纯净 DOM 内容抽取与剪贴板逻辑实现

  **What to do**:
  - 获取正文内容策略：优先尝试从 `useData().page.value.frontmatter` 等内置 API，否则使用可靠的 DOM 遍历（克隆 `.vp-doc` 节点）。
  - **剔除策略**：删除无关元素，例如：`.header-anchor`（# 号）、代码复制按钮文本、不需要的侧边栏菜单等。
  - **保留策略**：针对代码块、表格、Mermaid 源码和链接文字必须保留（满足语义无损的要求，供 LLM 理解）。
  - **Prompt 组装**：通过 `import { ZH_PROMPT_TEMPLATE }` 加上提取出的正文。
  - **Fallback 交互**：当 `navigator.clipboard.writeText` 失败时（如 HTTP 协议、Safari 权限），通过 UI Toast + Fallback Modal 或文字明确提示。

  **Must NOT do**:
  - 不要把按钮自身包含进去。
  - 复制成功后只允许短期的 UI 变化（例如 “Copied ✓” 持续 2 秒），不要弹出侵入式的浏览器原生 alert。

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 涉及深度的 DOM 遍历和提取，以及浏览器 clipboard API 的降级处理。
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: []
  - **Blocked By**: [Task 3]

  **References**:
  - `document.cloneNode` 方案提取纯净文本。

  **Acceptance Criteria**:
  - [ ] 点击按钮后剪贴板中的内容排版工整，无冗余的 HTML class 或锚点字符串 (`#`)。
  - [ ] 中英文页面能正确对应不同语言的 Prompt 模板。

  **QA Scenarios (MANDATORY)**:

  ```text
  Scenario: 点击复制并验证提取的文本纯净度
    Tool: Playwright (dev-browser)
    Preconditions: 本地 dev server 已启动
    Steps:
      1. 访问 `/guide/context`，点击顶部的 Copy 按钮。
      2. 拦截并读取写入到 clipboard 的文本。
      3. 验证文本中不包含 `#` 或 "Copied!" 这种无关字符。
      4. 验证文本最后包含对应的中文导读 Prompt。
    Expected Result: 提取出纯净的教程文本及关联 Prompt。
    Failure Indicators: 含有杂质数据。
    Evidence: .sisyphus/evidence/task-4-clipboard-content.txt
  ```

  **Commit**: NO

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. Verify implementation exists. Check evidence files. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run build and check for SSR issues. Review all changed files.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Agent-Executed QA (Playwright)** — `unspecified-high`
  Start from clean state. Execute EVERY QA scenario from EVERY task. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Verify 1:1 match with specs. Detect cross-task contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- 本计划明确禁止在 Review 前 Commit。因此，所有任务在执行后仅保留 working tree 状态。

## Success Criteria

### Verification Commands
```bash
bun run docs:build  # Expected: build successfully without SSR mismatch
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Clipboard data perfectly formatted
