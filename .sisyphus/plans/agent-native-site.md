# Agent-Native Tutorial Site

## TL;DR

> **Quick Summary**: 让 adopt-agentic 教程站自身变得 agent native——每个教程页面底部增加 AgentPrompt 组件，包含手写行动指令 + 自动注入的相关章节导航。读者一键复制 prompt 给任何 agent，agent 即可理解当前概念并导航到相关章节。
> 
> **Deliverables**:
> - `AgentPrompt.vue` — 自定义 Vue 组件（按钮 + 复制到剪贴板）
> - `knowledge-graph.ts` — 18 节点关系数据（集中维护）
> - 36 个手写 prompt（18 页 × 中英双语）
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: T1 → T2 → T3-T8 → T9 → F1-F4

---

## Context

### Original Request

用户想让这个讲 agent native 的教程站本身也变得 agent native。从多个创意方向中选定了两个：
- **方向 4**（概念关系图）：18 个节点的依赖/相关关系，供 agent 导航
- **方向 6**（Agent 读这页）：每页底部一个按钮，一键复制 agent-ready prompt

最终确认：**方向 4 融入方向 6**。关系图不做独立端点，而是作为每个 prompt 的导航部分自动注入。

### Interview Summary

**Key Discussions**:
- 关系图载体：不做 MCP（太重），不做前端可视化，纯给 agent 消费
- Prompt 定制度：手写行动指令（不自动生成），不放 frontmatter
- 导航数据维护：集中维护 + 自动注入（不手写在每个 prompt 里）
- 交互形式：复制到剪贴板，不弹窗
- 覆盖范围：18 页全量，中英双语
- llms.txt：本次不做

### Self-Review (Metis Substitute)

Metis 超时未返回。以下为自行识别的 gap：

**Slide Deck 兼容性**（已处理）：
layout.ts 把 H2 sections 分组成 slide 卡片。AgentPrompt 组件放在页面最底部，需确保不被 slide deck 逻辑干扰。两种策略：(1) 让组件自然成为最后一个 slide 的一部分；(2) 组件在 slide deck 之外独立渲染。由执行者根据实际效果决定。

**i18n 路由匹配**（已处理）：
中文路径 `/guide/context`，英文 `/en/guide/context`。组件需根据 `useData().lang` 判断 locale，展示对应语言的导航标题和 URL。

**复制内容格式**（已处理）：
复制到剪贴板的文本 = 手写行动指令（纯文本）+ 自动拼入的相关章节导航链接。需要从渲染后的 slot HTML 提取纯文本（用 `element.innerText`）。

---

## Work Objectives

### Core Objective

在每个教程页面底部增加一个 agent-ready prompt 组件，让读者可以一键复制 prompt 给任何 AI agent，同时 prompt 内包含相关章节导航——使教程站自身成为 agent 的知识源。

### Concrete Deliverables

- `docs/.vitepress/data/knowledge-graph.ts` — 18 节点关系数据
- `docs/.vitepress/theme/AgentPrompt.vue` — Vue SFC 组件
- `docs/.vitepress/theme/index.ts` — 修改：注册全局组件
- 18 个中文 `.md` 文件底部各加 `<AgentPrompt>` + 手写行动指令
- 18 个英文 `.md` 文件底部各加 `<AgentPrompt>` + 手写行动指令

### Definition of Done

- [ ] `bun run docs:build` 构建通过
- [ ] 所有 18 个中文页面底部显示 AgentPrompt 组件
- [ ] 所有 18 个英文页面底部显示 AgentPrompt 组件
- [ ] 点击复制按钮，剪贴板内容包含行动指令 + 相关章节链接
- [ ] 中文页面显示中文标题和链接，英文页面显示英文标题和链接

### Must Have

- 每个 prompt 的行动指令必须手写、与页面内容强相关
- 导航链接从 knowledge-graph.ts 自动注入，不手写
- 复制功能使用 `navigator.clipboard.writeText()`
- 中英文页面分别展示对应语言的内容
- 组件视觉风格与现有站点（slide deck 卡片风格）协调

### Must NOT Have (Guardrails)

- 不做 llms.txt（本次 scope 外）
- 不做前端知识图谱可视化
- 不做 MCP server
- 不自动生成 prompt 内容（必须手写）
- 不把 prompt 存在 frontmatter 里
- 不引入新的 npm 依赖（纯 Vue 3 + VitePress API 实现）
- 不改动现有页面的正文内容

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO（项目无 test framework）
- **Automated tests**: None
- **Framework**: none

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — `bun run docs:build` 验证构建

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — data + component infrastructure):
├── Task 1: Knowledge graph data file [quick]
└── Task 2: AgentPrompt Vue component + global registration [visual-engineering]

Wave 2 (After Wave 1 — content fill, MAX PARALLEL):
├── Task 3: Prompts - 基础概念 (index, context, actors) [writing]
├── Task 4: Prompts - 载体前半 (system-instructions, built-in-tools, mcp) [writing]
├── Task 5: Prompts - 载体中段 (commands, skills, cli-tools) [writing]
├── Task 6: Prompts - 载体后半 (hooks, knowledge-feeding, orchestration) [writing]
├── Task 7: Prompts - 进阶中 (sub-agents, eval, hitl) [writing]
└── Task 8: Prompts - 进阶后+附录 (p2p, in-practice, glossary) [writing]

Wave 3 (After Wave 2 — verification):
└── Task 9: Build + Browser QA [unspecified-high]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: T1 → T2 → T3-T8 → T9 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 2)
```

### Dependency Matrix

| Task | Blocked By | Blocks |
|------|-----------|--------|
| T1 | — | T2 |
| T2 | T1 | T3-T8 |
| T3-T8 | T2 | T9 |
| T9 | T3-T8 | F1-F4 |
| F1-F4 | T9 | — |

### Agent Dispatch Summary

- **Wave 1**: **2** — T1 → `quick`, T2 → `visual-engineering`
- **Wave 2**: **6** — T3-T8 → `writing` (all with `adopt-agentic-writer` + `humanizer-zh` skills)
- **Wave 3**: **1** — T9 → `unspecified-high`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Knowledge Graph 数据文件

  **What to do**:
  - 创建 `docs/.vitepress/data/knowledge-graph.ts`
  - 定义 TypeScript 类型：`KnowledgeNode`（id, titleZh, titleEn, urlZh, urlEn, group, related: string[]）
  - 填充 18 个节点的完整数据，节点 ID 与 markdown 文件名一致（如 `context`, `actors`, `system-instructions`）
  - `related` 字段：每个节点 3-5 个相关节点 ID，基于概念依赖和主题相关性
  - 分组：`foundation`（index, context, actors）、`carriers`（system-instructions ~ hooks-and-plugins）、`advanced`（knowledge-feeding ~ peer-to-peer-agents）、`appendix`（in-practice, glossary）
  - 导出查询函数：`getRelatedNodes(nodeId: string, lang: 'zh' | 'en'): { title: string, url: string }[]`
  - URL 必须包含 VitePress base 前缀 `/adopt-agentic/`

  **Must NOT do**:
  - 不引入任何 npm 依赖
  - 不做前端可视化渲染
  - 不做 REST API 或 MCP server

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 纯数据文件，结构清晰，无复杂逻辑
  - **Skills**: [`adopt-agentic-vitepress`]
    - `adopt-agentic-vitepress`: VitePress 项目结构和配置约定

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `docs/.vitepress/config.ts:28-53` — 中文 sidebar 配置，包含所有 18 个页面的 text + link 数据，作为节点列表来源
  - `docs/.vitepress/config.ts:68-111` — 英文 sidebar 配置，对应英文标题

  **API/Type References**:
  - 节点 ID 命名：与 `docs/guide/` 下的文件名一致（如 `context.md` → id: `context`）

  **External References**:
  - CLAUDE.md 的「骨架主线」部分：定义了三段结构（基础概念 → 载体 → 进阶），用于分组
  - CLAUDE.md 的「内容节点摘要索引」：每个节点讲什么，用于确定 related 关系

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 数据文件可正常导入
    Tool: Bash
    Preconditions: bun 已安装
    Steps:
      1. 运行 `bun -e "import { getRelatedNodes } from './docs/.vitepress/data/knowledge-graph'; console.log(JSON.stringify(getRelatedNodes('context', 'zh')))"`
      2. 验证输出是 JSON 数组，每个元素包含 title（中文）和 url（以 /adopt-agentic/guide/ 开头）
      3. 验证数组长度 >= 3（context 至少有 3 个相关节点）
    Expected Result: 输出有效 JSON 数组，标题为中文，URL 含 base 前缀
    Failure Indicators: import 报错、输出为空数组、URL 缺少 base 前缀
    Evidence: .sisyphus/evidence/task-1-import-test.txt

  Scenario: 英文 locale 返回英文数据
    Tool: Bash
    Steps:
      1. 运行 `bun -e "import { getRelatedNodes } from './docs/.vitepress/data/knowledge-graph'; console.log(JSON.stringify(getRelatedNodes('context', 'en')))"`
      2. 验证标题为英文，URL 以 /adopt-agentic/en/guide/ 开头
    Expected Result: 英文标题 + 英文 URL
    Evidence: .sisyphus/evidence/task-1-i18n-test.txt

  Scenario: 所有 18 个节点 ID 都有数据
    Tool: Bash
    Steps:
      1. 运行脚本遍历所有节点 ID，调用 getRelatedNodes 验证每个都返回非空结果
    Expected Result: 18/18 节点均返回有效数据
    Evidence: .sisyphus/evidence/task-1-completeness.txt
  ```

  **Commit**: YES (groups with T2)
  - Message: `feat(theme): add AgentPrompt component and knowledge graph data`
  - Files: `docs/.vitepress/data/knowledge-graph.ts`

- [x] 2. AgentPrompt Vue 组件 + 全局注册

  **What to do**:
  - 创建 `docs/.vitepress/theme/AgentPrompt.vue`（Vue 3 SFC，`<script setup lang="ts">`）
  - 组件功能：
    - 接收 slot 内容作为手写行动指令（markdown 渲染后的 HTML）
    - 通过 VitePress `useRoute()` 获取当前路径，匹配 knowledge-graph.ts 中的节点 ID
    - 通过 VitePress `useData()` 获取 `lang`，决定中文/英文内容
    - 调用 `getRelatedNodes()` 获取相关章节列表
    - 渲染一个视觉区域：显示行动指令 + 相关章节链接
    - 按钮：点击时将完整 prompt 文本（行动指令纯文本 + 导航链接纯文本）复制到剪贴板
    - 复制成功后按钮文字短暂变化（如 ✓ 已复制 / ✓ Copied）
  - 复制逻辑：用 `navigator.clipboard.writeText()`，从 slot 容器的 `innerText` 提取纯文本，拼上导航链接格式化文本
  - 样式：与站点整体 slide deck 风格协调（圆角、渐变背景、dark mode 适配、mobile 响应式）
  - 在 `docs/.vitepress/theme/index.ts` 的 theme 对象中添加 `enhanceApp({ app }) { app.component('AgentPrompt', AgentPrompt) }`
  - 确保组件不被 layout.ts 的 slide deck 分组逻辑干扰（组件放在页面最底部，在最后一个 H2 section 之后）

  **Must NOT do**:
  - 不引入新 npm 依赖（不用 clipboard.js 等库）
  - 不做动画过度复杂的效果
  - 不修改 layout.ts 的 slide deck 逻辑

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Vue 组件开发 + CSS 样式设计 + 交互实现
  - **Skills**: [`adopt-agentic-vitepress`, `frontend-ui-ux`]
    - `adopt-agentic-vitepress`: VitePress 主题扩展约定
    - `frontend-ui-ux`: UI/UX 设计 + 组件开发

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1, parallel with T1 for component skeleton; T1 must complete before import wiring)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3-8
  - **Blocked By**: Task 1 (needs knowledge-graph.ts to import)

  **References**:

  **Pattern References**:
  - `docs/.vitepress/theme/index.ts:1-12` — 现有主题入口，需在此注册全局组件
  - `docs/.vitepress/theme/style.css:1-178` — 站点整体视觉风格参考（色彩变量、圆角、渐变、dark mode、mobile breakpoints）
  - `docs/.vitepress/theme/layout.ts:50-89` — slide deck 逻辑，理解组件将被如何包裹

  **API/Type References**:
  - `docs/.vitepress/data/knowledge-graph.ts` — Task 1 创建的数据文件，导入 `getRelatedNodes`
  - VitePress `useRoute()` — 获取当前路径
  - VitePress `useData()` — 获取 `lang`、`frontmatter`

  **External References**:
  - VitePress custom theme: https://vitepress.dev/guide/custom-theme
  - VitePress using Vue in markdown: https://vitepress.dev/guide/using-vue
  - Vue 3 `<script setup>`: https://vuejs.org/api/sfc-script-setup

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 组件在中文页面正确渲染
    Tool: Playwright
    Preconditions: dev server 运行中 (bun run docs:dev)
    Steps:
      1. 导航到 http://localhost:5173/adopt-agentic/guide/context
      2. 滚动到页面底部
      3. 断言存在 `.agent-prompt` 容器元素
      4. 断言容器内包含行动指令文本
      5. 断言容器内包含「相关章节」导航链接，标题为中文
      6. 断言存在复制按钮
    Expected Result: 组件渲染完整，行动指令 + 中文导航链接 + 复制按钮均存在
    Failure Indicators: 元素不存在、导航链接为英文、按钮缺失
    Evidence: .sisyphus/evidence/task-2-render-cn.png

  Scenario: 组件在英文页面正确渲染
    Tool: Playwright
    Steps:
      1. 导航到 http://localhost:5173/adopt-agentic/en/guide/context
      2. 断言 `.agent-prompt` 存在
      3. 断言导航链接标题为英文，URL 包含 /en/guide/
    Expected Result: 英文标题 + 英文 URL
    Evidence: .sisyphus/evidence/task-2-render-en.png

  Scenario: 复制按钮功能正常
    Tool: Playwright
    Steps:
      1. 导航到任意教程页面
      2. 点击 `.agent-prompt button`（复制按钮）
      3. 读取剪贴板内容（Playwright `page.evaluate(() => navigator.clipboard.readText())`）
      4. 断言剪贴板文本包含行动指令
      5. 断言剪贴板文本包含相关章节 URL
      6. 断言按钮文字变为「已复制」或「Copied」
    Expected Result: 剪贴板包含格式化的完整 prompt 文本
    Failure Indicators: 剪贴板为空、缺少导航链接、按钮无反馈
    Evidence: .sisyphus/evidence/task-2-copy-function.txt

  Scenario: Dark mode 适配
    Tool: Playwright
    Steps:
      1. 导航到任意页面，切换 dark mode
      2. 截图 `.agent-prompt` 区域
      3. 验证无白色背景穿帮、文字可读
    Expected Result: dark mode 下组件视觉协调
    Evidence: .sisyphus/evidence/task-2-dark-mode.png

  Scenario: 构建不报错
    Tool: Bash
    Steps:
      1. 运行 `bun run docs:build`
      2. 验证退出码为 0
    Expected Result: 构建成功
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: YES (groups with T1)
  - Message: `feat(theme): add AgentPrompt component and knowledge graph data`
  - Files: `docs/.vitepress/theme/AgentPrompt.vue`, `docs/.vitepress/theme/index.ts`

- [x] 3. Prompts — 基础概念（index, context, actors）

  **What to do**:
  - 阅读以下 3 个中文页面的完整内容，提炼每页 2-3 条最核心的行动指令
  - 在每个页面的 markdown 文件**最底部**添加 `<AgentPrompt>` 组件调用
  - 行动指令用自然语言撰写，面向开发者——读者复制给 agent 后，agent 能立即应用这些原则
  - 同步撰写对应英文版本（独立撰写，不是翻译）
  - 页面列表：
    - `docs/guide/index.md` + `docs/en/guide/index.md`（介绍页）
    - `docs/guide/context.md` + `docs/en/guide/context.md`（上下文）
    - `docs/guide/actors.md` + `docs/en/guide/actors.md`（三角关系）

  **Must NOT do**:
  - 不修改页面现有正文内容
  - 不自动生成 prompt 内容
  - 不使用"心智模型"、"本质上"等 CLAUDE.md 禁用词
  - 不做翻译——英文版独立撰写

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 内容撰写任务，需要阅读理解 + 提炼 + 双语写作
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]
    - `adopt-agentic-writer`: 十人混血儿风格 + 写作规则
    - `humanizer-zh`: 去 AI 痕迹

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References** (read these pages to write prompts):
  - `docs/guide/index.md` — 全书主线"一切皆上下文"，vibe coding → context engineering
  - `docs/guide/context.md` — LLM 无记忆，窗口有限，四个动作：写/选/压/隔
  - `docs/guide/actors.md` — Agent 是胶水代码，用户→Agent→LLM 分工，协作循环

  **Component Reference**:
  - `docs/.vitepress/theme/AgentPrompt.vue` — Task 2 创建的组件，在 markdown 底部直接使用 `<AgentPrompt>` 标签

  **Style References**:
  - CLAUDE.md「写作风格」section — 十人混血儿标准
  - CLAUDE.md「写作纪律」section — 禁用词表、段落规则

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 中文 prompt 质量检查
    Tool: Bash
    Steps:
      1. 读取 docs/guide/context.md 底部的 <AgentPrompt> 内容
      2. 验证包含 2-3 条行动指令
      3. 验证不含 CLAUDE.md 禁用词（心智模型、本质上、杠杆、宪法等）
      4. 验证语言为中文
    Expected Result: 2-3 条中文行动指令，无禁用词
    Evidence: .sisyphus/evidence/task-3-cn-quality.txt

  Scenario: 英文 prompt 独立撰写（非翻译）
    Tool: Bash
    Steps:
      1. 读取 docs/en/guide/context.md 底部的 <AgentPrompt> 内容
      2. 验证语言为英文
      3. 对比中文版——内容主旨相同但措辞不同（不是逐句翻译）
    Expected Result: 英文版独立撰写，非逐句翻译
    Evidence: .sisyphus/evidence/task-3-en-quality.txt

  Scenario: 构建验证
    Tool: Bash
    Steps:
      1. 运行 `bun run docs:build`
      2. 验证退出码为 0
    Expected Result: 构建成功
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES (groups with T4-T8)
  - Message: `content(guide): add agent-ready prompts to all tutorial pages`
  - Files: 6 个 .md 文件

- [x] 4. Prompts — 载体前半（system-instructions, built-in-tools, mcp）

  **What to do**:
  - 与 Task 3 相同流程，覆盖以下 3 个页面（中英双语）：
    - `docs/guide/system-instructions.md` + `docs/en/guide/system-instructions.md`
    - `docs/guide/built-in-tools.md` + `docs/en/guide/built-in-tools.md`
    - `docs/guide/mcp.md` + `docs/en/guide/mcp.md`
  - 每页底部添加 `<AgentPrompt>` + 2-3 条手写行动指令

  **Must NOT do**: 同 Task 3

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5-8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References**:
  - `docs/guide/system-instructions.md` — 每次请求最先注入的基准规则，用户自定义最有效
  - `docs/guide/built-in-tools.md` — Agent 硬编码能力，LLM 生成 tool_calls，信任分级
  - `docs/guide/mcp.md` — Agent 的 USB 接口，标准协议让外部工具接入

  **Component/Style References**: 同 Task 3

  **Acceptance Criteria**: 同 Task 3 格式，覆盖 system-instructions/built-in-tools/mcp 三页
  Evidence: .sisyphus/evidence/task-4-*.txt

  **Commit**: YES (groups with T3, T5-T8)

- [x] 5. Prompts — 载体中段（commands, skills, cli-tools）

  **What to do**:
  - 与 Task 3 相同流程，覆盖以下 3 个页面（中英双语）：
    - `docs/guide/commands.md` + `docs/en/guide/commands.md`
    - `docs/guide/skills.md` + `docs/en/guide/skills.md`
    - `docs/guide/cli-tools.md` + `docs/en/guide/cli-tools.md`

  **Must NOT do**: 同 Task 3

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References**:
  - `docs/guide/commands.md` — `/` 快捷方式，prompt 模板，一次性注入
  - `docs/guide/skills.md` — 可按需加载的系统指令片段，Command/Skill/Sub-agent 边界
  - `docs/guide/cli-tools.md` — Unix 哲学适合 agent，CLI 输出即上下文

  **Acceptance Criteria**: 同 Task 3 格式
  Evidence: .sisyphus/evidence/task-5-*.txt

  **Commit**: YES (groups with T3-T4, T6-T8)

- [x] 6. Prompts — 载体后半 + 进阶前（hooks-and-plugins, knowledge-feeding, orchestration）

  **What to do**:
  - 与 Task 3 相同流程，覆盖以下 3 个页面（中英双语）：
    - `docs/guide/hooks-and-plugins.md` + `docs/en/guide/hooks-and-plugins.md`
    - `docs/guide/knowledge-feeding.md` + `docs/en/guide/knowledge-feeding.md`
    - `docs/guide/orchestration.md` + `docs/en/guide/orchestration.md`

  **Must NOT do**: 同 Task 3

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References**:
  - `docs/guide/hooks-and-plugins.md` — 编程式介入，守门人模式，权限梯度
  - `docs/guide/knowledge-feeding.md` — 三条路径：规则层/能力层/项目层，按需喂养
  - `docs/guide/orchestration.md` — 四种模式：顺序/并行/计划-执行/迭代，简单循环优先

  **Acceptance Criteria**: 同 Task 3 格式
  Evidence: .sisyphus/evidence/task-6-*.txt

  **Commit**: YES (groups with T3-T5, T7-T8)

- [x] 7. Prompts — 进阶中（sub-agents, eval, human-in-the-loop）

  **What to do**:
  - 与 Task 3 相同流程，覆盖以下 3 个页面（中英双语）：
    - `docs/guide/sub-agents.md` + `docs/en/guide/sub-agents.md`
    - `docs/guide/eval.md` + `docs/en/guide/eval.md`
    - `docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`

  **Must NOT do**: 同 Task 3

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References**:
  - `docs/guide/sub-agents.md` — 上下文隔离，交接三要素，别急着擦掉错误
  - `docs/guide/eval.md` — 三层验证，验证结果回注上下文，反模式清单
  - `docs/guide/human-in-the-loop.md` — 三个介入位置，铺轨策略，认知债务

  **Acceptance Criteria**: 同 Task 3 格式
  Evidence: .sisyphus/evidence/task-7-*.txt

  **Commit**: YES (groups with T3-T6, T8)

- [x] 8. Prompts — 进阶后 + 附录（peer-to-peer-agents, in-practice, glossary）

  **What to do**:
  - 与 Task 3 相同流程，覆盖以下 3 个页面（中英双语）：
    - `docs/guide/peer-to-peer-agents.md` + `docs/en/guide/peer-to-peer-agents.md`
    - `docs/guide/in-practice.md` + `docs/en/guide/in-practice.md`
    - `docs/guide/glossary.md` + `docs/en/guide/glossary.md`

  **Must NOT do**: 同 Task 3

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Content References**:
  - `docs/guide/peer-to-peer-agents.md` — 层级 vs 平级，协调开销 O(n²)
  - `docs/guide/in-practice.md` — 打破 agent-agnostic，用具体工具演示
  - `docs/guide/glossary.md` — 34 个核心术语

  **Acceptance Criteria**: 同 Task 3 格式
  Evidence: .sisyphus/evidence/task-8-*.txt

  **Commit**: YES (groups with T3-T7)

- [ ] 9. Build 验证 + 全站 QA

  **What to do**:
  - 运行 `bun run docs:build`，确保构建通过
  - 启动 dev server，用 Playwright 遍历所有 36 个页面（18 CN + 18 EN）
  - 验证每个页面底部都有 AgentPrompt 组件渲染
  - 在至少 6 个页面（3 CN + 3 EN，覆盖不同分组）上测试复制功能
  - 验证复制内容包含行动指令 + 导航链接
  - 验证中文页面导航为中文，英文页面为英文
  - 测试 dark mode 和 mobile viewport（375px 宽）
  - 所有证据保存到 `.sisyphus/evidence/task-9-*/`

  **Must NOT do**:
  - 不修改任何代码或内容（纯验证）

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 全站级别 QA，需要系统性验证
  - **Skills**: [`adopt-agentic-vitepress`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential after Wave 2)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 3-8

  **References**:

  **Verification Targets**:
  - 所有 `docs/guide/*.md` 页面（18 个）
  - 所有 `docs/en/guide/*.md` 页面（18 个）

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 全站构建
    Tool: Bash
    Steps:
      1. 运行 `bun run docs:build`
      2. 验证退出码为 0，无错误输出
    Expected Result: 构建成功
    Evidence: .sisyphus/evidence/task-9-build.txt

  Scenario: 中文页面 100% 覆盖
    Tool: Playwright
    Steps:
      1. 依次访问所有 18 个中文页面 URL
      2. 每页断言 `.agent-prompt` 元素存在
      3. 记录通过/失败页面列表
    Expected Result: 18/18 页面渲染 AgentPrompt
    Evidence: .sisyphus/evidence/task-9-cn-coverage.txt

  Scenario: 英文页面 100% 覆盖
    Tool: Playwright
    Steps:
      1. 依次访问所有 18 个英文页面 URL
      2. 每页断言 `.agent-prompt` 元素存在
    Expected Result: 18/18 页面渲染 AgentPrompt
    Evidence: .sisyphus/evidence/task-9-en-coverage.txt

  Scenario: 复制功能跨分组验证
    Tool: Playwright
    Steps:
      1. 选择 6 个页面（context, mcp, hooks, orchestration, eval, glossary）中英各 1
      2. 每页点击复制按钮
      3. 读取剪贴板验证内容完整性
    Expected Result: 6/6 复制成功，内容包含指令 + 导航
    Evidence: .sisyphus/evidence/task-9-copy-test.txt

  Scenario: Dark mode 视觉检查
    Tool: Playwright
    Steps:
      1. 切换 dark mode
      2. 截图 3 个页面的 AgentPrompt 组件
    Expected Result: 无视觉穿帮
    Evidence: .sisyphus/evidence/task-9-dark-*.png

  Scenario: Mobile viewport 检查
    Tool: Playwright
    Steps:
      1. 设置 viewport 375×812（iPhone SE）
      2. 访问 2 个页面，截图 AgentPrompt 组件
      3. 验证不溢出、按钮可点击
    Expected Result: 移动端布局正常
    Evidence: .sisyphus/evidence/task-9-mobile-*.png
  ```

  **Commit**: NO (pure verification)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check DOM). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Review all new/changed files for: TypeScript errors, unused imports, console.log in prod, CSS issues, accessibility concerns. Run `bun run docs:build`. Check Vue component follows VitePress conventions.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start dev server. Visit EVERY page (18 CN + 18 EN). Verify AgentPrompt component renders. Click copy button on at least 6 pages (3 CN + 3 EN). Verify clipboard content includes action items + navigation links. Test dark mode. Test mobile viewport. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Pages [N/N render] | Copy [N/N work] | Dark Mode [PASS/FAIL] | Mobile [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual changes. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Flag unaccounted changes. Verify knowledge-graph.ts contains exactly 18 nodes with correct relationships.
  Output: `Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Commit 1** (after Wave 1): `feat(theme): add AgentPrompt component and knowledge graph data`
  - `docs/.vitepress/data/knowledge-graph.ts`
  - `docs/.vitepress/theme/AgentPrompt.vue`
  - `docs/.vitepress/theme/index.ts`
  - Pre-commit: `bun run docs:build`

- **Commit 2** (after Wave 2): `content(guide): add agent-ready prompts to all tutorial pages`
  - All 36 modified `.md` files
  - Pre-commit: `bun run docs:build`

---

## Success Criteria

### Verification Commands

```bash
bun run docs:build          # Expected: Build succeeds, no errors
```

### Final Checklist

- [ ] AgentPrompt component renders on all 18 CN + 18 EN pages
- [ ] Copy button works, clipboard contains formatted prompt text
- [ ] Prompt text includes hand-written action items + auto-injected navigation
- [ ] Navigation links match current locale (CN titles for CN pages, EN for EN)
- [ ] No new npm dependencies added
- [ ] No existing page content modified
- [ ] All "Must NOT Have" items absent
