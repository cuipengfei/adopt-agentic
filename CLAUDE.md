# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

采用 agentic AI 工作流的教程网站，基于 VitePress 构建，部署到 GitHub Pages。

## 技术栈

- **VitePress** 1.6.x — 静态站点生成器（基于 Vite，不是 Bun.serve）
- **Bun** — 仅用于包管理和脚本运行
- **Mermaid** — 用于站内图表渲染（通过 `vitepress-plugin-mermaid` 集成）
- 无 linter/formatter 配置。无后端。无数据库。

## 项目结构

```
docs/                       # VitePress 内容根目录
├── .vitepress/config.ts    # 站点配置：i18n locales、双语 sidebar/nav、搜索
├── index.md                # 中文首页（layout: home）
├── guide/                  # 中文教程（概念节点 + 术语表）
│   ├── index.md ~ sub-agents.md  # 各概念节点页面
│   └── glossary.md         # 术语表
├── en/                     # 英文版（i18n 子目录，已同步完成）
│   ├── index.md            # 英文首页
│   └── guide/              # 英文教程占位页
└── public/logo.svg         # 静态资源

materials/                  # 行业洞见与研究素材（不发布到站点）
└── industry-insights/      # 语义化分层
    ├── README.md           # 结构索引
    ├── global/             # 全球基础 + 工具/框架/治理
    ├── china/              # 中国市场与实践者
    ├── synthesis/          # 共识映射与节点交叉索引
    └── archive-full.md     # 完整归档

.sisyphus/                  # Agent 工作区（选择性 git track）
├── plans/                  # 设计计划（git tracked）
│   └── phase1-content-structure.md  # 骨架唯一真相来源
│       └── phase2-content-depth.md     # Phase 2 内容补深计划（已完成）
├── drafts/                 # 设计草稿（git tracked，.claude/ 除外）
│   ├── draft-ideas.md      # 用户私有构想（禁止 agent 修改）
│   └── ...
├── research/               # POMASA 研究项目（git tracked，notepads 除外）
│   ├── adopt-agentic-gap-analysis/   # 内容覆盖度分析（已完成）
│   └── agent-user-mental-models/     # 用户心智模型研究（已完成）
├── notepads/               # Agent 临时工作记录（gitignored）
└── boulder.json            # 运行时状态（gitignored）
```

## 命令

```bash
bun install                 # 安装依赖（用 bun，不要用 npm/yarn/pnpm）
bun run docs:dev            # 开发服务器（HMR 热更新）
bun run docs:build          # 构建到 docs/.vitepress/dist/
bun run docs:preview        # 本地预览生产构建
```

## VitePress 约定

### 添加新页面

1. 中文：创建 `docs/guide/new-page.md`；英文：创建 `docs/en/guide/new-page.md`
2. 在 `docs/.vitepress/config.ts` 的对应 locale 下配置 sidebar（例如 `locales['/'].themeConfig.sidebar`、`locales['/en/'].themeConfig.sidebar`）
3. 侧边栏仍使用按路径前缀分组的对象格式：

```ts
sidebar: {
  '/guide/': [
    { text: '分组名称', items: [
      { text: '页面标题', link: '/guide/new-page' },
    ]},
  ],
}
```

### Frontmatter

- 首页使用 `layout: home`，配合 `hero` 和 `features` 字段
- 教程页面使用默认布局（基本页面不需要 frontmatter）
- VitePress 支持 `title`、`description`、`outline`、`editLink` 等

### Mermaid 图表

`config.ts` 已用 `withMermaid()` 包装。在 markdown 中直接使用 ```` ```mermaid ```` 代码块即可渲染图表。

### 静态资源

放在 `docs/public/` 下。使用根相对路径引用（如 `/logo.svg`）。
VitePress 在大多数场景会自动拼接 `base` 前缀。

## 部署（GitHub Pages）

### 关键配置

`docs/.vitepress/config.ts` → `base: '/adopt-agentic/'`

此值**必须**与 GitHub 仓库名一致。仓库改名时同步更新。

### CI 流程

推送到 `main` → GitHub Actions → `bun install` → `bun run docs:build` → 通过 `actions/deploy-pages` 部署 `docs/.vitepress/dist/`。也支持 `workflow_dispatch` 手动触发。

### 首次部署设置

GitHub 仓库 → Settings → Pages → Source：选择 **GitHub Actions**（不是 "Deploy from a branch"）。

## 内容设计原则

### 写作风格

**十人混血儿** — Martin Fowler 的深度、Elon Musk 的锐利、Paul Graham 的常识感、Julia Evans 的可视化直觉、Derek Sivers 的节奏、Joel Spolsky 的幽默，再加上阮一峰的信息密度、陈皓的技术狠劲、张小龙的克制极简、李笑来的落地能力——全融合在一个人身上。

这娃写东西会是什么样：

| 从谁那继承       | 表现形式                               |
| ---------------- | -------------------------------------- |
| **Fowler**       | 概念挖得深，但不炫技                   |
| **Musk**         | 一刀切开废话，直奔本质                 |
| **Graham**       | 把复杂讲得像常识，读者觉得"我本就该懂" |
| **Julia Evans**  | 具体例子先行，抽象靠边                 |
| **Derek Sivers** | 一句话一段，呼吸感                     |
| **Joel Spolsky** | 技术硬核，但不端着                     |
| **阮一峰**       | 每周五的信息密度，长文也能一口气读完   |
| **陈皓**         | 技术观点狠，不妥协，不留情面           |
| **张小龙**       | 极简克制，"用完即走"，不拖泥带水       |
| **李笑来**       | 抽象概念落地到可操作，读完能动手       |

**一句话自检**：这句话如果删掉，读者会损失什么？没损失就删。

### 技术解释模式

**用 HTTP 请求/响应来解释概念。** 读者是开发者——用 `→ REQUEST（agent → LLM API）` 和 `← RESPONSE（LLM API → agent，SSE 流）` 的方式展示 agent 和 LLM 之间的交互。让抽象概念落地到可感知的技术机制。所有涉及 agent-LLM 通信的节点内容都应遵循此模式。

### 读者定位

- **用 agent tool 的人**，不是造 agent 的人。读者是开发者，日常使用各类 AI coding agent，想理解底层机制以用得更好。
- **不造框架**：不教 LangChain / LangGraph / CrewAI 等框架实现。

### Agent Agnostic 原则

- 所有概念使用**通用术语**，不绑任何特定 agent 产品。
- 举例可以多元（各种工具都可以提），但不能让某个产品成为主角。
- 不分 persona、不分市场——讲通用概念，不区分谁在读。
- **主内容产品名禁令**：`docs/guide/` 和 `docs/en/guide/` 中**禁止**出现 Cursor、Windsurf、GitHub Copilot 等具体产品名（含衍生名如 `.cursorrules`、`copilot-instructions.md`）。`materials/` 研究素材中可以提及。

### 内容选择标准（"它山之石可以攻玉"）

从"造 agent"的行业知识中，筛选出对"用 agent tool 的人"有价值的心智模型。筛选标准：

1. **翻译得过来吗？** — 这个概念能否从框架实现视角翻译成工具使用者视角？
2. **用户直接受益吗？** — 理解这个概念后，用户能更好地使用工具吗？
3. **工具无关吗？** — 这个概念放到任何 agent tool 上都成立吗？

通过筛选的概念进骨架；通不过的留在 `materials/` 作为参考素材。

### Scope 边界

| In scope                  | Out of scope                 |
| ------------------------- | ---------------------------- |
| 概念、心智模型、通用原则  | 特定框架实现（LangChain 等） |
| 对使用者有直接价值的知识  | 成本/性能预算                |
| Agent agnostic 的机制解释 | 特定工具操作手册             |

已深入覆盖（不再只是"轻提"）：工具信任边界/安全（节点 4/5/9）、prompt 作为可维护资产（节点 3）。

### 骨架主线

**上下文流动**——每个节点都显式关联回"上下文"这条主线。结构分三段：

```
基础概念 → 上下文的载体（从静态到动态）→ 串联与进阶
```

骨架详见 `.sisyphus/plans/phase1-content-structure.md`。

### 骨架状态

**已锁定**。16 个概念节点 + In Practice + 术语表。完整序列：

```
━━ 基础概念 ━━
 0  介绍页
 1  上下文 — 第一原则                    [+ State & Memory]
 2  三角关系 + Agent Loop                [+ 怎么给 agent 下任务]
━━ 上下文的载体（从静态到动态）━━
 3  System Instructions                  [+ Prompt 是资产]
 4  内置工具                              [+ 信任边界]
 5  MCP                                  [+ 信任边界]
 6  Slash Commands
 7  Skills
 8  Agent-Native CLI Tools
 9  Hooks & Plugins                      [+ 守门人模式]
━━ 串联与进阶 ━━
10  知识喂养
11  编排模式
12  Sub Agent — 上下文隔离
13  Eval / 验证 / 可观测性               [+ 可靠性]
14  Human-in-the-loop                    [+ 认知债务]
15  Peer-to-Peer Agents                  ← frontier
━━ 附录 ━━
    In Practice — 从概念到操作            [打破 agent-agnostic，用具体工具演示]
    术语表
```

### 内容填充状态

**Phase 1 + Phase 2 均已完成**。所有 16 个概念节点 + In Practice + 术语表均已填充实质内容，中英双语同步。

Phase 2 对 9 个节点做了内容补深，填补了 POMASA Gap Analysis 发现的 3 个 P1 盲区（并行会话治理、长时 Loop 控制、团队级配置治理）、1 个 P2 观察项（长期记忆心智模型），融入了 6 个"它山之石"洞察（Vibe→CE 叙事、Command/Skill/Sub-agent 职责边界、权限梯度索引、Conductor 比喻、反模式清单、决策框架元素）。涉及节点覆盖了 STONE-006"概念→决策框架"的写法升级。

| 内容量区间 | 节点 |
| ---------- | ---- |
| 重量级（>400W） | context、hooks-and-plugins、sub-agents、in-practice |
| 中量级（250-400W） | actors、built-in-tools、mcp、cli-tools、knowledge-feeding、eval、human-in-the-loop、peer-to-peer-agents、glossary、orchestration |
| 轻量级（<250W） | index、system-instructions、commands、skills |

写作特征：HTTP 请求/响应模式贯穿核心节点，具体例子先行，每节末尾有"上下文流动 / 风险 / 可审计性"三件事收尾。Phase 2 新增了决策框架元素（"何时 X / 何时 Y"对比表格）贯穿高改动量节点。

### 内容决策（已确认，不可违反）

| 决策                             | 结论                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| 练习 / checklist / decision tree | **不做**。纯概念教程，不附可执行件                                    |
| 工具适配附录 / 对照页            | **不做**。保持纯 agent-agnostic，不做 Cursor/Claude Code/Copilot 对照 |
| 双语策略                         | **同步更新**。中英文每个节点同时填充，不接受英文滞后                  |
| 站点页面引用 materials/          | **禁止**。站点页面不引用 materials/ 内部路径                          |
| AGENTS.md                        | **不创建**。所有项目知识保持在 CLAUDE.md 中                           |
| In Practice 打破 agent-agnostic       | **唯一例外**。该节用具体工具演示高杠杆操作，主内容产品名禁令不适用于此页 |

### 内容填充时可借鉴的竞品素材

以下来自竞品调研，已在 Phase 1 和 Phase 2 中融入，不改骨架：

| 借鉴点                                    | 融入位置    | 力度     | 状态   |
| ----------------------------------------- | ----------- | -------- | ------ |
| "上下文即资产"叙事                        | 节点 1 或 9 | 正常融入 | ✅ 已入 |
| "AI context is like milk"类比             | 节点 1      | 正常融入 | ✅ 已入 |
| amplifier 心智模型（agents 放大已有模式） | 适当位置    | **极轻** | ✅ 已入 |
| agent-friendly code 概念                  | 节点 3 或 9 | 提一嘴   | ✅ 已入 |
| llms.txt 作为知识注入方式                 | 节点 9      | 提一嘴   | ✅ 已入 |
| CE/AE/PE 术语定义                         | 术语表      | 正常融入 | ✅ 已入 |
| "只放决策需要的东西"（信噪比）            | 节点 1      | 正常融入 | ✅ 已入 |
| scar tissue & crystals 比喻               | 节点 3 + 9  | 正常融入 | ✅ 已入 |
| "别急着擦掉错误"洞察                     | 节点 12     | 正常融入 | ✅ 已入 |
| "Vibe → CE" 范式迁移叙事钩子           | 节点 0        | 正常融入 | ✅ 已入 |
| Command / Skill / Sub-agent 职责边界   | 节点 7        | 正常融入 | ✅ 已入 |
| 权限心智模型统一交叉索引               | 节点 9        | 提一嘴   | ✅ 已入 |
| Conductor 模式比喻（人分发/验收）       | 节点 11       | 提一嘴   | ✅ 已入 |
| 反模式清单化（社区吐槽→显式清单）       | 节点 13       | 正常融入 | ✅ 已入 |
| "概念→决策框架" 升级方向               | 节点 0/2/3/10/11/13 | 方向性 | ✅ 已入（Phase 2 涉及的 9 个节点） |

### 社区覆盖度研究结论（POMASA Gap Analysis）

基于 62 条社区来源（blogs/reddit/hackernews/social/github）归纳的 17 个话题，与骨架覆盖率 **94.1%**。骨架设计合理，盲区在"缺深度"而非"缺概念"。

完整报告：`.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/gap-analysis-report.md`
审视附录：`.sisyphus/research/adopt-agentic-gap-analysis/workspace/04.report/review-addendum.md`

**P1 盲区（3 个，已补深）**：

| GAP | 问题 | 处理方式 | 状态 |
| --- | ---- | -------- | ---- |
| GAP-001 并行 Session 治理 | 有并行概念，缺多会话协同方法 | 扩展节点 11（编排模式） | ✅ 已补深 |
| GAP-002 长时 Loop 治理 | 有 loop 概念，缺 checkpoint/stop/恢复体系 | 扩展节点 2 + 13 | ✅ 已补深 |
| GAP-003 团队级配置治理 | 有"prompt 是资产"，缺团队共建/审查/回收 | 扩展节点 3 + 10 | ✅ 已补深 |

**P2 观察（1 个）**：GAP-004 长期持久记忆 — 已在节点 1 轻量补充最小心智模型（会话内 vs 跨会话、自动积累风险）。

**全局升级方向**：STONE-006"概念→决策框架"已在 Phase 2 涉及的 9 个节点中应用（何时并行/何时串行、何时继续/何时重启、何时回滚/何时修正等对比表格）。剩余高热度节点（built-in-tools、mcp、sub-agents）可在后续 Phase 补充。

### 文件约定

| 路径                              | 用途                       | 谁动                |
| --------------------------------- | -------------------------- | ------------------- |
| `docs/guide/*.md`                 | 发布到站点的教程正文       | agent 填充内容      |
| `materials/`                      | 行业洞见研究素材（不发布） | agent 可读可写      |
| `.sisyphus/plans/`                | 设计计划（git tracked）    | agent 工作区        |
| `.sisyphus/drafts/`               | 设计草稿（git tracked）    | agent 工作区        |
| `.sisyphus/research/`               | POMASA 研究项目（git tracked，notepads 除外） | agent 工作区        |
| `.sisyphus/drafts/draft-ideas.md` | 用户私有构想               | **禁止 agent 修改** |
| `.sisyphus/notepads/`             | 临时工作记录（gitignored） | agent 临时用        |
| `.sisyphus/boulder.json`          | 运行时状态（gitignored）   | 自动生成            |

## 已知问题 / TODO

- `themeConfig.logo` 用 `/logo.svg`，但 `head` favicon 用 `/adopt-agentic/logo.svg` — 写法不一致（因 VitePress base 处理两者都能工作，但应统一）

## 反模式（本项目禁止）

- 禁止使用 `npm`、`yarn`、`pnpm` — 统一用 `bun`
- 禁止引入 Bun.serve / bun:sqlite 等服务端 Bun API — 这是静态文档站，不是 Bun 应用
- 禁止绕过 VitePress 做前端 — bun init 模板中的 "Don't use vite" 规则在此**不适用**（VitePress 本身基于 Vite）
