# WOW 功能 — 从文档站到产品级体验

## TL;DR

> **Quick Summary**: 为 adopt-agentic 教程站增加 4 个 wow 功能——交互式上下文构造器、终端启动序列、31 个 SVG 内联化交互式插图、概念星图（融合术语表）。把静态文档站升级为"可操作的认知工具"。
> 
> **Deliverables**:
> - 交互式上下文构造器（嵌入 context.md，前端模拟 HTTP 请求组装 + Token 压力计）
> - 终端启动序列（首页首次访问 2-3 秒 boot 动画，环境嗅探 + 平滑转场）
> - 31 个 SVG 全部内联化为 Vue 组件（解锁滚动联动、hover 交互、动画控制）
> - 概念星图（Canvas 2D + d3-force，替换并融合 glossary，含 SEO fallback）
> 
> **Estimated Effort**: XL
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: T1 → T5/T6/T7 → T12/T13/T14 → F1-F4

---

## Context

### Original Request
用户想让教程站做出让读者 "wow" 的东西。跳出文档站思维，把站点从"文档"变成"产品"。

### Interview Summary
**Key Discussions**:
- 5 路 agent 并行头脑风暴（Oracle/GPT 5.3, Visual Engineering/Gemini 3.1, Artistry/Gemini 3.1, Explore, Writing/Opus 4.6）
- 用户从 7+ 个方向中选定 4 个
- 明确不做阅读进度追踪
- 星图融合术语表（先审计准确性）
- 全部 31 个 SVG 一次性内联化
- 四个方向全部规划一次性推进

**Research Findings**:
- Oracle: "可操作的认知工具" > "更好看的文档"。统一叙事线 Launch→Navigate→Inspect→Execute→Share
- Visual Eng: Canvas 2D + d3-force（18 节点用 Three.js 是杀鸡焉用牛刀），Token 压力计是上下文流的最亮想法
- Artistry: Ghost in the Shell 隐喻框架可统一全站叙事
- Explore: 31 SVG 当死图片用，每篇开头的"上下文视角"blockquote 是可提取的隐藏元数据
- Writing: 交互式构造器 P0——"操作比阅读记忆深 10 倍"

### Metis Review
**Identified Gaps** (addressed):
- Boot Sequence 挂载位：用 VitePress `layout-top` slot，不改 markdown
- d3 是 mermaid 的 transitive 依赖：需显式声明，避免漂移
- SSR 安全：所有 window/navigator/canvas 操作在 onMounted+nextTick 后
- Glossary SEO fallback：星图页保留 SSR 可索引文本层（表格或等价 HTML）
- slide-deck opacity:0 时序：交互组件初始化需在 mounted+nextTick 后测量布局
- `visualRhythm: false` frontmatter：星图页用此关掉 slide-card 包装
- Boot 范围：`/` + `/en/` 都播放，按 locale 记录 sessionStorage

---

## Work Objectives

### Core Objective
把 adopt-agentic 从静态文档站升级为沉浸式产品级体验——进门有仪式感（Boot）、有知识全景（星图）、核心概念可亲手操作（构造器）、插图与内容实时联动（SVG 内联化）。

### Concrete Deliverables
- `docs/.vitepress/theme/BootSequence.vue` — 终端启动序列组件
- `docs/.vitepress/theme/KnowledgeConstellation.vue` — 概念星图组件
- `docs/.vitepress/theme/ContextBuilder.vue` — 交互式上下文构造器组件
- `docs/.vitepress/theme/SvgIllustration.vue` — 通用 SVG 包装器组件
- `docs/.vitepress/theme/illustrations/*.vue` — 31 个内联 SVG Vue 组件
- `docs/guide/glossary.md` + `docs/en/guide/glossary.md` — 重构为星图+术语融合页
- `docs/guide/context.md` + `docs/en/guide/context.md` — 嵌入交互式构造器
- `docs/.vitepress/theme/layout.ts` — 集成 Boot Sequence（layout-top slot）

### Definition of Done
- [ ] `bun run docs:build` → exit 0（零构建错误）
- [ ] 首页首次访问显示 boot 序列，二次访问不显示，ESC 可跳过
- [ ] glossary 页面展示可交互星图 + 术语 tooltip/面板
- [ ] context.md 内嵌交互式构造器，用户可操作 5 步 context 组装
- [ ] 31 个 SVG 全部内联，`grep -R "/illustrations/.*\.svg" docs/guide docs/en/guide` → 0 匹配 `<img>` 引用
- [ ] glossary 保留 SEO 可索引文本（curl glossary 页面含术语文本）
- [ ] 所有功能在暗色/亮色模式下正常显示
- [ ] 移动端（≤640px）优雅降级

### Must Have
- Boot Sequence 环境嗅探（真实 userAgent/屏幕信息）
- Token 压力计随操作实时变化
- 星图节点按 group 分色，hover 显示关联路径
- SVG 内联后动画在 viewport 内触发（IntersectionObserver）
- 中英双语支持

### Must NOT Have (Guardrails)
- 不做阅读进度追踪
- 不做跨会话存储/账号/分享/云同步
- 不把星图升级为推荐系统/学习路径引擎
- 不把 SVG 内联化扩展为全站插画重设计（保留现有 SVG 内容不变）
- 不调真实 LLM API（构造器全前端模拟）
- 不在 SSR 路径访问 window/sessionStorage/navigator/canvas
- 不先做 31 SVG 全交互再回头补性能预算
- 不依赖 d3 的 transitive 路径（显式声明依赖）
 **UI 风格克制、专业**：面向企业读者，所有视觉效果追求精致而非炫技——不用赛博朋克/黑客风、不用荧光色、不用 Glitch 撕裂效果。动效要平滑微妙，配色跟随站点主题色体系。"wow" 来自功能本身的巧妙，不是视觉的张扬

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO（项目无测试框架）
- **Automated tests**: None（纯前端视觉/交互功能）
- **Framework**: none
- **Primary QA**: Agent-Executed QA Scenarios（Playwright for 浏览器交互, Bash for 构建验证）

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **前端交互**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **构建验证**: Use Bash — `bun run docs:build`, grep assertions
- **SSR 安全**: Use Bash — `bun run docs:preview` + curl 验证 SSR 输出

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 基础设施, 3 tasks):
├── T1: 依赖安装 + 组件注册机制 [quick]
├── T2: SVG 内联化工具链（批量转换脚本 + 通用 Wrapper）[deep]
├── T3: Glossary 内容审计 [writing]

Wave 2 (Core Components — 核心组件开发, MAX PARALLEL, 4 tasks):
├── T4: Boot Sequence 组件 (depends: T1) [visual-engineering]
├── T5: 概念星图组件 (depends: T1) [visual-engineering]
├── T6: 交互式上下文构造器组件 (depends: T1) [deep]
├── T7: SVG 基础交互层 — IntersectionObserver 联动 (depends: T2) [visual-engineering]

Wave 3 (SVG Bulk Migration — 批量迁移, 4 parallel tasks):
├── T8: SVG 内联化 — Foundation group (depends: T2, T7) [quick]
├── T9: SVG 内联化 — Carriers group (depends: T2, T7) [quick]
├── T10: SVG 内联化 — Advanced group (depends: T2, T7) [quick]
├── T11: SVG 内联化 — Appendix + Inline + 首页 (depends: T2, T7) [quick]

Wave 4 (Page Integration — 页面集成, 3 tasks):
├── T12: 星图替换 glossary 页面 (depends: T3, T5) [deep]
├── T13: 构造器嵌入 context.md (depends: T6) [deep]
├── T14: Boot Sequence 集成到 layout (depends: T4) [quick]

Wave FINAL (Verification — 4 parallel):
├── F1: Plan compliance audit [oracle]
├── F2: Code quality review [unspecified-high]
├── F3: Real manual QA [unspecified-high]
├── F4: Scope fidelity check [deep]

Critical Path: T1 → T5 → T12 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 4 (Waves 2 & 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T4, T5, T6 | 1 |
| T2 | — | T7, T8-T11 | 1 |
| T3 | — | T12 | 1 |
| T4 | T1 | T14 | 2 |
| T5 | T1 | T12 | 2 |
| T6 | T1 | T13 | 2 |
| T7 | T2 | T8-T11 | 2 |
| T8-T11 | T2, T7 | F1-F4 | 3 |
| T12 | T3, T5 | F1-F4 | 4 |
| T13 | T6 | F1-F4 | 4 |
| T14 | T4 | F1-F4 | 4 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

| Wave | Tasks | Categories |
|------|-------|-----------|
| 1 | 3 | T1→quick, T2→deep, T3→writing |
| 2 | 4 | T4→visual-engineering, T5→visual-engineering, T6→deep, T7→visual-engineering |
| 3 | 4 | T8-T11→quick |
| 4 | 3 | T12→deep, T13→deep, T14→quick |
| FINAL | 4 | F1→oracle, F2→unspecified-high, F3→unspecified-high, F4→deep |

---

## TODOs

- [x] 1. 依赖安装 + 全局组件注册机制

  **What to do**:
  - 安装 `d3-force` 和 `d3-selection` 作为显式依赖（`bun add d3-force d3-selection`），安装 `@types/d3-force` `@types/d3-selection` 作为 devDependency
  - 在 `docs/.vitepress/theme/index.ts` 添加 `enhanceApp` 钩子，全局注册：BootSequence, KnowledgeConstellation, ContextBuilder, SvgIllustration
  - 创建占位组件文件（空 Vue SFC），确保 import 不报错
  - 验证 `bun run docs:build` 通过

  **Must NOT do**: 不安装整个 d3 包，不改动 layout.ts 现有逻辑

  **Recommended Agent Profile**: `quick`, Skills: []

  **Parallelization**: Wave 1 | Blocks: T4, T5, T6 | Blocked By: None

  **References**:
  - `docs/.vitepress/theme/index.ts` — 当前无 enhanceApp，需添加
  - `package.json` — 当前依赖列表

  **QA Scenarios**:
  ```
  Scenario: Build with new deps
    Tool: Bash
    Steps: 1. `bun run docs:build` 2. Assert exit 0
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES (groups with T2, T3) — `feat(theme): add d3-force dependency and component registration`

- [x] 2. SVG 内联化工具链 + 通用 Wrapper

  **What to do**:
  - 创建 `docs/.vitepress/theme/SvgIllustration.vue` 通用 SVG 包装器：Props `name` (SVG 文件名), `interactive` (是否启用交互)。Vite `?raw` import 加载 SVG，`v-html` 内联渲染。内置 IntersectionObserver（viewport 触发 `data-in-view`）。SSR 安全：Observer 只在 `onMounted` 创建
  - 创建 1 个示范替换（如 context.svg），验证 `?raw` import + `v-html` 渲染 + 暗色/亮色兼容。全量替换由 T8-T11 分组完成
  - SVG 内联 `<style>` 标签需 scoped 处理避免样式泄漏

  **Must NOT do**: 不修改 SVG 文件内容（只做包装），不在 SSR 路径用 window/document

  **Recommended Agent Profile**: `deep`, Skills: []

  **Parallelization**: Wave 1 | Blocks: T7, T8-T11 | Blocked By: None

  **References**:
  - `docs/public/illustrations/` — 31 个 SVG 文件
  - `docs/guide/*.md` + `docs/en/guide/*.md` — 所有 `<img>` 引用
  - Vite raw import: https://vite.dev/guide/assets#importing-asset-as-string

  **QA Scenarios**:
  ```
  Scenario: Wrapper renders SVG inline
    Tool: Playwright
    Steps:
      1. Navigate to context page（示范替换页）
      2. Assert SvgIllustration 组件存在且内部有 `<svg>` 元素（非 `<img>`）
      3. Assert SVG 内联样式未泄漏到页面其他元素
    Evidence: .sisyphus/evidence/task-2-wrapper-render.png
  ```

  **Commit**: YES (groups with T1, T3) — `feat(theme): add SVG inline wrapper component`

- [x] 3. Glossary 内容审计

  **What to do**:
  - 逐条比对 `docs/guide/glossary.md` 和 `docs/en/guide/glossary.md` 的 34 个术语与当前教程内容
  - 检查：术语是否改名、概念是否在 Phase 2-5 审校中变化、是否需添加新术语
  - 参考 CLAUDE.md 的禁用词替换表和术语纪律
  - 输出审计报告到 `.sisyphus/evidence/task-3-glossary-audit.md`，直接修复，中英双语同步

  **Must NOT do**: 不改变 glossary 的 markdown 结构（T12 需解析），不添加教程中未出现的术语

  **Recommended Agent Profile**: `writing`, Skills: [`adopt-agentic-writer`, `humanizer-zh`]

  **Parallelization**: Wave 1 | Blocks: T12 | Blocked By: None

  **References**:
  - `docs/guide/glossary.md` / `docs/en/guide/glossary.md`
  - `CLAUDE.md` — 写作纪律、禁用词、术语纪律
  - `docs/guide/*.md` — 各概念节点（交叉验证）

  **QA Scenarios**:
  ```
  Scenario: Glossary builds after audit
    Tool: Bash
    Steps: 1. `bun run docs:build` 2. Assert exit 0
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES (groups with T1, T2) — `fix(content): audit and update glossary terms`

- [x] 4. Boot Sequence 组件

  **What to do**:
  - 创建 `docs/.vitepress/theme/BootSequence.vue`：
    - 全屏 overlay（position: fixed, z-index 最高）
    - 打字效果：`requestAnimationFrame` + `Math.random()` 10-150ms 随机停顿（不用 Typed.js）
    - 内容为简洁的系统初始化日志，混入真实 `navigator.userAgent`、`screen.width x screen.height`、`navigator.language`——语气专业克制，不用“黑客故意担忇”的论调
    - 数据来源：从 knowledge-graph.ts 读取真实节点数（"SCANNING KNOWLEDGE GRAPH... 18 NODES"）
    - 最后一行后平滑 fade out（opacity 0.3s ease-out）——不用 Glitch/撕裂/色彩分离效果
    - `sessionStorage.setItem('aa-booted', '1')` 控制首次 only，按 locale 分别记录
    - 右下角常驻 `[ESC to skip]`（柔和明灭，不闪烁），监听 keydown
    - 中文版中文日志，英文版英文日志（根据 VitePress locale 判断）
  - 深色背景 `#0a0a0a`，字体 Space Mono，颜色使用站点主题色（`var(--vp-c-brand)`）——不用荧光绿 `#00FF41`
  - 支持亮色/暗色模式（都用深色背景，这是 overlay）

  **Must NOT do**: 不用第三方打字机库，不在 SSR 路径访问 window/navigator/sessionStorage

  **Recommended Agent Profile**: `visual-engineering`, Skills: []

  **Parallelization**: Wave 2 | Blocks: T14 | Blocked By: T1

  **References**:
  - `docs/.vitepress/data/knowledge-graph.ts` — 节点数据（用于真实数字）
  - `docs/.vitepress/theme/style.css` — Space Mono 字体已定义为 `--vp-font-family-mono`
  - VitePress `useData()` — 获取 locale 信息

  **QA Scenarios**:
  ```
  Scenario: Boot plays on first visit
    Tool: Playwright
    Steps:
      1. Clear sessionStorage
      2. Navigate to homepage
      3. Assert overlay element visible
      4. Wait for animation complete (< 5s)
      5. Assert overlay removed/hidden
      6. Assert sessionStorage contains 'aa-booted'
    Evidence: .sisyphus/evidence/task-4-boot-first-visit.png

  Scenario: Boot skipped on second visit
    Tool: Playwright
    Steps:
      1. Set sessionStorage 'aa-booted' = '1'
      2. Navigate to homepage
      3. Assert overlay NOT visible
    Evidence: .sisyphus/evidence/task-4-boot-skip.png

  Scenario: ESC skips boot
    Tool: Playwright
    Steps:
      1. Clear sessionStorage
      2. Navigate to homepage
      3. Press Escape key
      4. Assert overlay fades out within 0.5s
    Evidence: .sisyphus/evidence/task-4-boot-esc.png
  ```

  **Commit**: YES — `feat(theme): add boot sequence with environment sniffing`

- [x] 5. 概念星图组件

  **What to do**:
  - 创建 `docs/.vitepress/theme/KnowledgeConstellation.vue`：
    - 使用 Canvas 2D 渲染 + `d3-force` 仅做物理计算（力导向布局）
    - 数据源：直接 import `knowledge-graph.ts` 的 18 个节点 + related 关系
    - 节点形状：圆角矩形或圆形，风格简洁专业——不用赛博朋克风格的缺角六边形
    - 分组配色：使用站点主题色体系的柔和变体（从 `style.css` 的 CSS 变量中派生），不用高饱和度荧光色（`#00F0FF`/`#FF0055` 等）
    - 入场动画：节点从中心平滑展开（d3-force 自然稳定），不用“爆炸式推开”
    - Hover 交互：非活跃节点柔和降低为 40% 透明度，当前节点柔和高亮，一阶关联节点通过连线点亮——不用“亮度翻倍 + 光晕”、不用流动光点
    - Click：平滑过渡 → 路由跳转到对应章节——不用涟漪动画
    - 术语面板：节点旁或底部展示关联术语定义（从 glossary 数据解析）
    - 不用 `globalCompositeOperation = 'screen'` Bloom 效果——保持清晰干净的渲染
    - 响应式：移动端退化为静态布局（CSS grid 卡片列表）
    - SSR 安全：Canvas 操作全在 onMounted 中
    - 中英双语：根据 locale 显示 titleZh 或 titleEn

  **Must NOT do**: 不用 Three.js（18 节点杀鸡焉用牛刀），不做阅读进度追踪，不做推荐系统

  **Recommended Agent Profile**: `visual-engineering`, Skills: []

  **Parallelization**: Wave 2 | Blocks: T12 | Blocked By: T1

  **References**:
  - `docs/.vitepress/data/knowledge-graph.ts` — 完整的 18 节点图谱数据
  - `docs/.vitepress/theme/style.css` — 配色变量、字体
  - d3-force API: https://d3js.org/d3-force
  - 每篇文章开头的 "上下文视角" blockquote 可提取为 tooltip 内容

  **QA Scenarios**:
  ```
  Scenario: Star map renders 18 nodes
    Tool: Playwright
    Steps:
      1. Navigate to glossary page
      2. Wait for canvas element
      3. Assert canvas has non-zero dimensions
      4. Screenshot
    Evidence: .sisyphus/evidence/task-5-starmap.png

  Scenario: Node click navigates
    Tool: Playwright
    Steps:
      1. Navigate to glossary page
      2. Click on a node (simulate canvas click at computed position)
      3. Assert URL changed to corresponding chapter
    Evidence: .sisyphus/evidence/task-5-navigation.txt
  ```

  **Commit**: YES — `feat(theme): add knowledge constellation component`

- [x] 6. 交互式上下文构造器组件

  **What to do**:
  - 创建 `docs/.vitepress/theme/ContextBuilder.vue`：
    - Step-by-step 交互（5 步）：
      1. 空 request → 显示 `{ "messages": [] }`
      2. 点击"添加 System Prompt" → messages 插入 system 消息，Token 计数跳到 ~120
      3. 点击"发送用户消息" → messages 追加 user 消息，Token 跳到 ~180
      4. 点击"模拟 LLM 响应" → assistant 消息 + tool_calls JSON 出现，Token 跳到 ~450
      5. 点击"追加 Tool 结果 & 第 2 轮" → 完整 messages 重发，Token 翻倍到 ~900+
    - 右上角 Token 压力计：数字实时变化，颜色 green→yellow→red——红色时仅颜色变化提示，不用抖动动画
    - 代码区用 Space Mono，JSON 语法高亮（颜色区分：system=青，user=白，assistant=绿，tool=品红）
    - 每步注入的代码块用对应颜色平滑滑入（slide-down, 0.2s ease）
    - 全前端预设数据，不调 API
    - 中英双语预设内容
    - 响应式：移动端代码块宽度自适应
    - SSR 安全

  **Must NOT do**: 不调真实 LLM API，不做自由输入（全是预设步骤），不超出 context.md 页面范围

  **Recommended Agent Profile**: `deep`, Skills: []

  **Parallelization**: Wave 2 | Blocks: T13 | Blocked By: T1

  **References**:
  - `docs/guide/context.md` — 将嵌入此页面，理解 context 章节的内容结构
  - `docs/.vitepress/theme/style.css` — Space Mono 已定义
  - 教程中的 HTTP 请求/响应示例格式

  **QA Scenarios**:
  ```
  Scenario: 5-step walkthrough
    Tool: Playwright
    Steps:
      1. Navigate to context page
      2. Find ContextBuilder component
      3. Click step 1 button → assert JSON shows system message
      4. Click step 2 → assert user message added
      5. Click step 3 → assert assistant + tool_calls
      6. Click step 4 → assert tool result
      7. Click step 5 → assert full round 2 request
      8. Assert token counter value > 800
    Evidence: .sisyphus/evidence/task-6-walkthrough.png

  Scenario: Token counter color changes
    Tool: Playwright
    Steps:
      1. At step 1, assert counter is green
      2. At step 4, assert counter is yellow or red
      3. At step 5, assert counter color is red
    Evidence: .sisyphus/evidence/task-6-token-counter.png
  ```

  **Commit**: YES — `feat(theme): add interactive context builder`

- [x] 7. SVG 交互层 — IntersectionObserver 联动

  **What to do**:
  - 增强 `SvgIllustration.vue`（T2 创建的）：
    - 当 SVG 进入 viewport 时，触发 SMIL 动画重置（让动画在用户视野里"第一次"播放）
    - 实现方式：进入 viewport 时 `beginElement()` 所有 `<animate>` / `<animateTransform>` 元素
    - 为有 `data-concept` 属性的 SVG 内部元素添加 hover 高亮（CSS class toggle）
    - 支持与 aa-slide section 联动：当特定 slide 进入视口时，发送自定义事件通知对应 SVG 高亮相关元素
    - 注意性能：31 个 SVG 共享一个 IntersectionObserver 实例（不要每个创建一个）

  **Must NOT do**: 不修改 SVG 源文件内容，不添加重量级动画库

  **Recommended Agent Profile**: `visual-engineering`, Skills: []

  **Parallelization**: Wave 2 | Blocks: T8-T11 | Blocked By: T2

  **References**:
  - `docs/.vitepress/theme/SvgIllustration.vue` — T2 创建的基础组件
  - `docs/public/illustrations/context.svg` — 参考 SMIL animate 标签结构
  - IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver

  **QA Scenarios**:
  ```
  Scenario: Animation triggers on viewport entry
    Tool: Playwright
    Steps:
      1. Navigate to context page
      2. Scroll to SVG illustration
      3. Assert `data-in-view` attribute present
      4. Screenshot showing animation state
    Evidence: .sisyphus/evidence/task-7-viewport-trigger.png
  ```

  **Commit**: YES — `feat(theme): add SVG viewport animation and interaction layer`

- [x] 8. SVG 内联化 — Foundation group

  **What to do**:
  - 内联化 Foundation group 的 SVG（context-supply-chain.svg, context.svg, actors.svg）
  - 对 `context.svg`（30 个动画节点，地铁线路图风格）添加深度交互：
    - 为 Request Line / Response Line 等关键 `<g>` 元素添加 `data-concept` 属性
    - 当用户读到对应 H2 section 时，高亮对应轨道
  - 更新 `docs/guide/context.md`、`docs/guide/actors.md`、`docs/guide/index.md` 和对应英文版的引用

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3 | Blocked By: T2, T7

  **QA Scenarios**:
  ```
  Scenario: Foundation SVGs render
    Tool: Playwright
    Steps: 1. Navigate to context, actors, index pages 2. Assert SVG elements present
    Evidence: .sisyphus/evidence/task-8-foundation-svgs.png
  ```

  **Commit**: YES (groups with T9-T11)

- [x] 9. SVG 内联化 — Carriers group

  **What to do**:
  - 内联化 Carriers group 的 SVG：system-instructions.svg, built-in-tools.svg, mcp.svg, commands.svg, skills.svg, cli-tools.svg, hooks-and-plugins.svg（7 个）
  - 更新对应的 7 个中文 + 7 个英文 markdown 引用

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3 | Blocked By: T2, T7

  **Commit**: YES (groups with T8, T10, T11)

- [x] 10. SVG 内联化 — Advanced group

  **What to do**:
  - 内联化 Advanced group 的 SVG：knowledge-feeding.svg, orchestration.svg, sub-agents.svg, eval.svg, human-in-the-loop.svg, peer-to-peer-agents.svg（6 个）
  - 更新对应的 6 个中文 + 6 个英文 markdown 引用

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3 | Blocked By: T2, T7

  **Commit**: YES (groups with T8, T9, T11)

- [x] 11. SVG 内联化 — 其余 SVG（Inline 系列 + 首页图标）

  **What to do**:
  - 内联化剩余所有 SVG：orchestration-inline-*.svg 系列、其他 inline 变体、首页 icons 等
  - 使用 `glob docs/public/illustrations/*.svg` 确认完整列表，与 T8-T10 做差集
  - 更新对应 markdown 引用
  - 最终验证：`grep -R '<img.*illustrations.*svg' docs/guide docs/en/guide` → 0 匹配

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3 | Blocked By: T2, T7

  **QA Scenarios**:
  ```
  Scenario: Zero remaining img references
    Tool: Bash
    Steps: 1. `grep -rn '<img.*illustrations.*svg' docs/guide/ docs/en/guide/` 2. Assert 0 matches
    Evidence: .sisyphus/evidence/task-11-zero-img.txt
  ```

  **Commit**: YES (groups with T8-T10) — `feat(theme): inline all 31 SVG illustrations as Vue components`

- [x] 12. 星图替换 glossary 页面

  **What to do**:
  - 重构 `docs/guide/glossary.md` 和 `docs/en/guide/glossary.md`：
    - 添加 `visualRhythm: false` frontmatter（关闭 slide-card 包装）
    - 页面主体嵌入 `<KnowledgeConstellation />` 组件
    - 在 Canvas 下方保留完整的术语表文本（表格或定义列表），作为 SEO fallback
    - 术语表数据通过 props 或 provide/inject 传给星图组件用于 tooltip
  - 更新 sidebar 配置（config.ts）：将 "术语表" 改为更合适的名称（如"知识星图 & 术语表"）
  - 确保 `curl glossary 页面 | grep "Context Window"` 仍然通过（SEO 验证）

  **Must NOT do**: 不删除术语文本内容（必须保留 SSR 可索引层）

  **Recommended Agent Profile**: `deep`, Skills: []
  **Parallelization**: Wave 4 | Blocks: F1-F4 | Blocked By: T3, T5

  **References**:
  - `docs/guide/glossary.md` — 当前术语表结构
  - `docs/.vitepress/config.ts` — sidebar 配置
  - T3 的审计结果
  - T5 的星图组件

  **QA Scenarios**:
  ```
  Scenario: Star map visible on glossary page
    Tool: Playwright
    Steps: 1. Navigate to glossary 2. Assert canvas element 3. Screenshot
    Evidence: .sisyphus/evidence/task-12-starmap-page.png

  Scenario: SEO fallback - terms indexable
    Tool: Bash
    Steps:
      1. `bun run docs:build && bun run docs:preview &`
      2. `curl -s http://localhost:4173/adopt-agentic/guide/glossary | grep -q 'Context Window'`
      3. Assert exit 0
    Evidence: .sisyphus/evidence/task-12-seo-fallback.txt
  ```

  **Commit**: YES — `feat(guide): replace glossary with knowledge constellation + terms`

- [x] 13. 构造器嵌入 context.md

  **What to do**:
  - 在 `docs/guide/context.md` 和 `docs/en/guide/context.md` 中合适位置嵌入 `<ContextBuilder />`
  - 最佳位置：在讲解"四个动作：写、选、压、隔"之前，让读者先亲手体验上下文如何累积
  - 添加简短的引导文字（中英双语）："亲手试一试：点击下面的按钮，看看一次完整的 Agent-LLM 交互中上下文是怎么一层层堆起来的"
  - 确保组件在 slide-deck 布局中正常显示（可能需要独占一个 slide section）

  **Recommended Agent Profile**: `deep`, Skills: [`adopt-agentic-writer`]
  **Parallelization**: Wave 4 | Blocks: F1-F4 | Blocked By: T6

  **References**:
  - `docs/guide/context.md` — 当前内容结构
  - T6 的构造器组件

  **QA Scenarios**:
  ```
  Scenario: Builder visible and interactive on context page
    Tool: Playwright
    Steps:
      1. Navigate to context page
      2. Scroll to ContextBuilder
      3. Click first step button
      4. Assert JSON content appears
      5. Screenshot
    Evidence: .sisyphus/evidence/task-13-builder-in-context.png
  ```

  **Commit**: YES — `feat(guide): embed context builder in context chapter`

- [x] 14. Boot Sequence 集成到 layout

  **What to do**:
  - 修改 `docs/.vitepress/theme/layout.ts`：
    - 添加 `layout-top` slot（或等价的全局 overlay 方案），渲染 `BootSequence` 组件
    - 只在首页路由（`/` 和 `/en/`）显示
    - 组件内部自行处理 sessionStorage 首次判断
  - 注意：不要影响现有的 `doc-before` slot（AgentPrompt）
  - 验证：首页首次访问 → boot 播放 → fade out → 正常首页

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 4 | Blocks: F1-F4 | Blocked By: T4

  **References**:
  - `docs/.vitepress/theme/layout.ts` — 现有 Layout，第 132 行的 return 语句
  - VitePress Layout Slots: https://vitepress.dev/guide/extending-default-theme#layout-slots

  **QA Scenarios**:
  ```
  Scenario: Boot only on homepage
    Tool: Playwright
    Steps:
      1. Clear sessionStorage
      2. Navigate directly to /guide/context
      3. Assert NO boot overlay
      4. Navigate to /
      5. Assert boot overlay appears
    Evidence: .sisyphus/evidence/task-14-boot-homepage-only.png
  ```

  **Commit**: YES — `feat(theme): integrate boot sequence into layout`

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run docs:build`. Review all changed/new files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify all Vue components have proper TypeScript typing. Check bundle size impact of d3-force + 31 SVG components.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | Bundle [size delta] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state (clear sessionStorage). Execute EVERY QA scenario from EVERY task. Test cross-feature integration: Boot → Star Map → Context Builder → SVG interaction. Test dark/light mode. Test mobile viewport (375px). Test i18n (中/英). Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes. Verify no SVG content was modified (only wrapped). Verify glossary text still indexable.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **Wave 1 完成**: `feat(theme): add d3-force dependency and component registration` — package.json, theme/index.ts
- **T4 完成**: `feat(theme): add boot sequence with environment sniffing` — BootSequence.vue
- **T5 完成**: `feat(theme): add knowledge constellation component` — KnowledgeConstellation.vue
- **T6 完成**: `feat(theme): add interactive context builder` — ContextBuilder.vue
- **Wave 3 完成**: `feat(theme): inline all 31 SVG illustrations as Vue components` — illustrations/*.vue, guide/*.md, en/guide/*.md
- **Wave 4 完成**: `feat(guide): integrate star map, context builder, and boot sequence` — glossary.md, context.md, layout.ts
- **Wave FINAL 完成**: `chore: verify wow features integration` — evidence files

---

## Success Criteria

### Verification Commands
```bash
bun run docs:build                    # Expected: exit 0
grep -R '<img.*illustrations.*svg' docs/guide docs/en/guide  # Expected: 0 matches
curl -s http://localhost:4173/adopt-agentic/guide/glossary | grep -q "Context Window"  # Expected: true (SEO fallback)
```

### Final Checklist
- [x] All "Must Have" present
- [x] All "Must NOT Have" absent
- [x] Build passes
- [x] Boot sequence plays on first visit, skippable
- [x] Star map interactive with 18 nodes + glossary terms
- [x] Context Builder has 5-step walkthrough with token counter
- [x] All 31 SVGs inline, animations viewport-triggered
- [x] Dark/light mode works
- [x] Mobile graceful degradation
- [x] Chinese + English pages both work
