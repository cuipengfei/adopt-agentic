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
│   └── guide/              # 英文教程（与中文同步）
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

**审校必备 Skills**：对 `docs/` 下教程内容做文本编辑或审校时，必须加载 `humanizer-zh`（去 AI 痕迹）和 `adopt-agentic-writer`（十人混血儿风格 + HTTP/SSE 模式）两个 skill。主 agent 亲自编辑时遵循这两个 skill 的规则；委托 sub-agent 时通过 `load_skills` 传入。

### 写作纪律（审校规则）

以下规则从实际内容审校中提炼，适用于 `docs/` 下所有教程内容：

**术语纪律**

- **禁用装逼术语**：不使用"心智模型"、"物理形态"、"施力"等学术化/生僻中文表述。用大白话替代。
- **不常见术语必须先解释**：如果必须用某个不常见术语（如"塌陷区"），先用日常语言把概念讲清楚，再引出术语。不能直接丢术语让读者自行脑补。
- **禁用词替换表**：

| 禁用 | 替代 |
| ---- | ---- |
| 心智模型 | "理解方式"、"怎么想这件事"、直接描述概念本身 |
| 物理形态 | "实际样子"、"长什么样"、"底层长这样" |
| 施力 | "影响"、"拖着你走"、"带偏" |
| 杠杆 | "最强的手段"、"最有效的方式"、"投入产出比最高的操作" |
| 宪法 | "规则书"、"行为基准"、直接说"系统指令" |
| 瞎子 | "看不见屏幕"、直接描述 agent 的感知限制 |
| 发疯 | "跑偏"、"出错"、"走歪" |
| 伤疤 / 结晶 | "踩坑教训" / "验证过的好做法" |
| 无知 | 直接描述具体后果（如"你把不住关"、"你发现不了问题"） |
| 半年前 / 半小时 | 用相对描述（"之前"、"一段时间"），不拍具体数字 |
| 几千行 / 5000 行 | "大量"、"thousands of lines" |
| 几十分钟 / 上百次 | "很长时间"、"频繁调用" |

- **AI filler 词密度控制**：中文"本质上"、英文 essentially / fundamentally / basically / actually / in essence——同一篇文档中不超过 2 处。超出的一律替换为"说白了"/"就是"/"其实"/"说到底"，或直接删掉（英文删掉通常不影响语义）。这些词是 AI 生成文本的高频指纹。
- **同一节内术语必须统一**：选定一个词后贯穿到底。同一节内不要在同义词之间来回切换。常见漂移对（选一个贯穿到底）：

| 概念 | 常见漂移 | 说明 |
| ---- | -------- | ---- |
| 系统指令 | 指令 / prompt / instruction / 提示词 / 系统提示 | 每节选一个，别混用 |
| 工具 | 工具 / 能力 / tool / capability | 技术语境用"工具"，描述 agent 视角用"能力" |
| 上下文 | 上下文 / context / 信息 / 内容 | "上下文"是本站核心词，优先用 |
| 会话 | 会话 / session / 对话 / 聊天 | 技术概念用"会话"，日常描述用"对话" |
- **比喻必须接地气**：比喻服务理解，不是炫文笔。开发者看到"底裤"、"幽灵规则"、"宪法"会觉得在读文学作品而不是技术教程。好比喻=读者一看就懂，不需要解释比喻本身。
- **避免绝对断言**：不说"你无法修改"，说"大多数情况下你改不了"。留合理例外空间。
- **避免无根据的具体数字**：不说"你花半小时"、"几十行"这种拍脑袋数字。用相对对比（"比你花几天适配更有效"→"投入产出比极高"）。
- **例子要通用化**：在 agent-agnostic 的内容中，举例不绑特定技术栈（如"从 REST 切到 GraphQL"太具体）。用开发者都能代入的通用场景。

**段落与呼吸感**

- 每段只讲**一个**点。不把 3-4 个并列概念挤在一个段落里。
- 列举重要概念（如"写 → 选 → 压 → 隔"）时，拆成独立行或列表，不挤在一句话里。
- 长句拆短。一句话超过 40 字，考虑拆成两句。
- **段落硬限**：超过 5 句话的段落必须拆分。一段一点，不堆砌。
- **节奏变化**：连续 3 段以上使用相同句式结构（如"X 是 Y。Z 会 W。"这种平铺直叙）需要变换——穿插反问、类比、短句打断节奏。

**逻辑自洽**

- **引用必须明确**：说"两种模式"，前面必须刚讲过哪两种。说"这三点"，前面必须有三个明确的点。不能让读者回头翻找。
- **不做逻辑跳跃**：段落之间要有自然过渡。一段讲 A，下一段不能突然跳到 C。
- **论点必须解释 why/how**：不能丢一句结论就跑。比如"一句纠正压不住几十条暗示"——为什么压不住？必须讲清楚机制。
- **前后论点不矛盾**：同一节内如果前面说"画路别砌墙（别告诉它不要做什么）"，后面就不能紧接着推荐"写禁令"。如果两者确实共存，必须解释为什么不矛盾。

**可视化节奏**

- 连续 3 段以上纯文字后，必须穿插可视化元素（Mermaid 图、表格、代码块、示意图）。
- 表格不是自解释的——旁边配简短的具体例子帮助理解。
- 优先用 Mermaid 图（项目已集成），其次用表格，再次用代码块模拟示意。
- 禁止纯装饰性插图。
- **扫描标准**：排除标题、列表项、代码块、表格后，连续 3 个以上"普通段落"（纯文字段）= 可视化荒漠，必须打断。
- **选型指南**：流程/顺序 → Mermaid flowchart；对比/分类 → 表格；交互示例 → 代码块（HTTP request/response）；状态变化 → Mermaid stateDiagram。

**插图生成工作流（baoyu skills）**

当需要 Mermaid 无法胜任的插图（跨段落高信息密度、需要整体视觉编排、封面图、文章配图等）时，使用 baoyu skills 生成。

- **Skill 选型表**（供 sub-agent 参考，不是主 agent 替它选）：

| 需求 | Skill | 说明 |
| ---- | ----- | ---- |
| 结构化信息图（流程/对比/模块） | `baoyu-infographic` | 20 种 layout × 17 种 style 组合，规格驱动 |
| 文章中间配图（自动分析插位） | `baoyu-article-illustrator` | 分析文章结构，识别需要图的位置，Type×Style 二维选型 |
| 文章封面图 | `baoyu-cover-image` | 5 维组合（类型/配色/渲染/文字/氛围），支持多种宽高比 |
| 通用图片生成 | `baoyu-image-gen` | 支持 Google/OpenAI/DashScope 三个 provider |
| 知识漫画 | `baoyu-comic` | 多面板教育漫画，多种艺术风格 |

  > **为什么必须是 SVG？** LLM 只能输出文本。SVG 是文本格式（XML），所以任何模型都能生成。PNG/JPEG 是二进制，LLM 无法直接输出——只有路径 2（baoyu-image-gen 脚本调真实图片生成 API）才能产出 PNG。

- **委托原则：给目标，不给实现方式。** 主 agent 只做两件事：
  1. 加载**所有** baoyu skills 给 sub-agent（让它能浏览完整规格库，自己挑最合适的）
  2. 给出需要插图的源文件路径 + 插图要表达的概念

  选哪个 baoyu skill、layout、style、配色、尺寸、字体、图标、动画效果——**全部由 sub-agent 自己决定**。Sub-agent 是专业的视觉设计 agent，不要用 prompt 限制它的想象力。它会自己浏览 skill 规格库，选择最适合内容的组合。

  **反模式**（禁止）：在 prompt 里指定 viewBox 尺寸、要求用 `<text>` 不用 path、指定配色方案、预定义节点标题和描述。这些都是在替专业 agent 做决策。

- **文件位置**：所有插图放 `docs/public/illustrations/`，SVG 格式优先（可缩放、轻量、加载快）。
- **现有插图**（全部暗色赛博朋克风格 + SVG 原生动画）：

| 文件 | 对应节点 | 动画数 |
| ---- | -------- | ------ |
| `context-supply-chain.svg` | 首页（index） | 3 |
| `context.svg` | 节点 1 上下文 | 30 |
| `actors.svg` | 节点 2 三角关系 | 14 |
| `orchestration.svg` | 节点 11 编排模式 | 15 |
| `hooks-and-plugins.svg` | 节点 9 Hooks | 18 |
| `knowledge-feeding.svg` | 节点 10 知识喂养（⭐ 标杆） | 8 |
| `human-in-the-loop.svg` | 节点 14 HITL | 17 |
| `eval.svg` | 节点 13 Eval | 24 |

**风格红线**

- 读起来像学术论文或正式报告 → 改写。
- 读起来像在炫耀词汇量 → 简化。
- "不装逼"和"精准"冲突时，选"不装逼"。开发者更信大白话。
- "不 fit 我们风格"的标准：如果这段话放进一篇正式技术白皮书里毫无违和感，那就要改——我们是教程，不是白皮书。

**审美优先级（五轮审校提炼）**

以下 5 条从五轮审校（含多模型交叉审校：Opus 4.6 / Kimi K2.5 / MiniMax / Codex）中归纳，遇到冲突时按此排序：

| 优先 | 不优先 | 判断标准 |
| ---- | ------ | -------- |
| 中性描述 | 判断性标签 | 描述现象本身，不替读者下结论。"Agent 看不见屏幕" > "Agent 是瞎子" |
| 精确 | 生动 | 宁可牺牲比喻，换精确的技术描述。能用一句技术事实说清的，不包装成修辞 |
| 朴素 | 华丽 | 英文博客里的精妙比喻（constitution、scar tissue）直译成中文容易装逼。翻回大白话 |
| 留余地 | 绝对 | 给例外留口子。"大多数情况下" > "永远不会"、"大概率" > "绝对" |
| 一遍够了 | 重复强调 | 同一个观点说清楚一次就走。在不同段落用不同措辞重复同一个点 = 冗余 |

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

从"造 agent"的行业知识中，筛选出对"用 agent tool 的人"有价值的概念。筛选标准：

1. **翻译得过来吗？** — 这个概念能否从框架实现视角翻译成工具使用者视角？
2. **用户直接受益吗？** — 理解这个概念后，用户能更好地使用工具吗？
3. **工具无关吗？** — 这个概念放到任何 agent tool 上都成立吗？

通过筛选的概念进骨架；通不过的留在 `materials/` 作为参考素材。

### Scope 边界

| In scope                  | Out of scope                 |
| ------------------------- | ---------------------------- |
| 概念、通用原则            | 特定框架实现（LangChain 等） |
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

**Phase 1 + Phase 2 均已完成**。所有 16 个概念节点 + In Practice + 术语表均已填充实质内容，中英双语同步。Phase 3-5 为多轮审校（详见下文）。

Phase 2 对 9 个节点做了内容补深，填补了 POMASA Gap Analysis 发现的 3 个 P1 盲区（并行会话治理、长时 Loop 控制、团队级配置治理）、1 个 P2 观察项（长期记忆），融入了 6 个"它山之石"洞察（Vibe→CE 叙事、Command/Skill/Sub-agent 职责边界、权限梯度索引、Conductor 比喻、反模式清单、决策框架元素）。涉及节点覆盖了 STONE-006"概念→决策框架"的写法升级。

Phase 3 做了三轮 inline review 审校（humanizer-zh + 十人混血儿风格），对全站 16 个教程节点执行写作纪律清洗。覆盖：禁用词替换（杠杆→回报、伤疤/结晶→踩坑教训/好做法、瞎子→看不见屏幕、发疯→跑偏）、绝对断言软化（永远不会→大概率不会）、拍脑袋数字泛化（半小时→一段时间、半年前→之前、10分钟→很快）、特定技术栈通用化（REST/GraphQL→旧方案/新做法）、重复段落合并、格言腔朴素化。共 29 处修改（中文 15 + 英文 14），中英双语同步。审校过程提炼出 5 条"审美优先级"，已编码进写作纪律。

Phase 4 做了两轮多模型交叉审校（Kimi K2.5 + MiniMax），引入不同模型视角交叉检验，修复了第 3 轮遗漏的术语漂移、段落过长、比喻不接地气等问题。

Phase 5 切回 Opus 4.6 做穷尽审校，新增"AI filler 词密度控制"维度——清理中文"本质上"（8→2 处）和英文 essentially/fundamentally/In essence（6 处），软化残留绝对断言（"总是"→"通常"、"读不冲突"→"读很少冲突"），泛化残留拍脑袋数字（"几千行/5000 lines"→"大量/thousands of lines"）。共 20 处修改（10 中文 + 10 英文），14 个文件。审校 patterns 提炼为新增写作纪律规则（AI filler 词密度控制、禁用词表扩充），已编码进本文件。

| 内容量区间 | 节点 |
| ---------- | ---- |
| 重量级（>400W） | context、hooks-and-plugins、sub-agents、in-practice |
| 中量级（250-400W） | actors、built-in-tools、mcp、cli-tools、knowledge-feeding、eval、human-in-the-loop、peer-to-peer-agents、glossary、orchestration |
| 轻量级（<250W） | index、system-instructions、commands、skills |

写作特征：HTTP 请求/响应模式贯穿核心节点，具体例子先行，每节末尾有"上下文流动 / 风险 / 可审计性"三件事收尾。Phase 2 新增了决策框架元素（"何时 X / 何时 Y"对比表格）贯穿高改动量节点。

### 内容节点摘要索引

每个节点讲什么——agent 进 repo 快速定位用。

**━━ 基础概念 ━━**

| # | 节点 | 文件 | 讲了什么 |
| --- | --- | --- | --- |
| 0 | 介绍页 | `index.md` | 全书主线"一切皆上下文"；从 vibe coding 到 context engineering 的思考方式切换；概念节点导航 |
| 1 | 上下文 | `context.md` | LLM 没有记忆，每轮重发全部历史；窗口有限噪声会累积；四个动作：写、选、压、隔；用 HTTP request/response 拆解多轮交互 |
| 2 | 三角关系 | `actors.md` | Agent 是胶水代码不是 AI；用户→Agent→LLM 分工；协作循环（多轮 tool_calls）；怎么给 agent 下任务；长时循环治理 |

**━━ 上下文的载体（从静态到动态）━━**

| # | 节点 | 文件 | 讲了什么 |
| --- | --- | --- | --- |
| 3 | System Instructions | `system-instructions.md` | 每次请求最先注入的基准规则；用户自定义是最有效的手段；画路别砌墙；团队级版本化/Review |
| 4 | 内置工具 | `built-in-tools.md` | Agent 硬编码的能力（读写文件、执行命令）；LLM 生成 tool_calls JSON，Agent 本地执行；工具定义占上下文；信任分级 |
| 5 | MCP | `mcp.md` | Agent 的 USB 接口；标准协议让外部工具接入；stdio vs Streamable HTTP；对 LLM 与内置工具无区别；上下文成本 |
| 6 | Slash Commands | `commands.md` | `/` 开头的快捷方式，背后是 prompt 模板；一次性注入用完即走；可内嵌 shell 命令和文件读取 |
| 7 | Skills | `skills.md` | 可按需加载的系统指令片段；Commands 是"这次做什么"，Skills 是"从现在起怎么做"；Command/Skill/Sub-agent 职责边界 |
| 8 | CLI Tools | `cli-tools.md` | Unix 哲学天然适合 agent：纯文本、可预测、可组合；CLI 输出即上下文；JSON 输出更 agent-friendly |
| 9 | Hooks & Plugins | `hooks-and-plugins.md` | 编程式介入上下文流动；守门人模式拦截危险操作；7 类生命周期事件；权限梯度（读→低风险写→高风险写） |

**━━ 串联与进阶 ━━**

| # | 节点 | 文件 | 讲了什么 |
| --- | --- | --- | --- |
| 10 | 知识喂养 | `knowledge-feeding.md` | 三条路径：规则层（全局指令）、能力层（Skills）、项目层（代码库本身）；上下文像牛奶；按需喂养别硬推 |
| 11 | 编排模式 | `orchestration.md` | 顺序/并行/计划-执行/迭代循环四种模式；一个司机一个方向盘；并行会话治理；简单循环优先 |
| 12 | Sub Agent | `sub-agents.md` | 派生隔离上下文处理子任务，结果摘要回传；交接便签三要素（目标、约束、关键上下文）；别急着擦掉错误 |
| 13 | Eval | `eval.md` | 三层验证：命令级→任务级→系统级；验证结果回注上下文驱动下一步；反模式清单；可观测性 |
| 14 | HITL | `human-in-the-loop.md` | 三个介入位置：定义任务、审批、验收；铺轨策略（人搭骨架 agent 填空）；认知债务；纠偏三条路 |
| 15 | P2P Agents | `peer-to-peer-agents.md` | 从层级委派到平级协作；协调开销 O(n²)；绝大多数工具选层级式；什么任务值得 P2P |

**━━ 附录 ━━**

| # | 节点 | 文件 | 讲了什么 |
| --- | --- | --- | --- |
| — | In Practice | `in-practice.md` | **唯一例外**打破 agent-agnostic，用具体工具演示：写 System Instructions、配 Hooks（通知/拦截）、知识分层、任务拆解与验证 |
| — | 术语表 | `glossary.md` | 34 个核心术语中英对照定义（上下文/窗口/污染、工具与编排、HITL、CE/AE/PE 等） |

### 内容决策（已确认，不可违反）

| 决策                             | 结论                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| 练习 / checklist / decision tree | **不做**。纯概念教程，不附可执行件                                    |
| 工具适配附录 / 对照页            | **不做**。保持纯 agent-agnostic，不做 Cursor/Claude Code/Copilot 对照 |
| 双语策略                         | **同步更新**。中英文每个节点同时填充，不接受英文滞后                  |
| 站点页面引用 materials/          | **禁止**。站点页面不引用 materials/ 内部路径                          |
| AGENTS.md                        | **不创建**。所有项目知识保持在 CLAUDE.md 中                           |
| In Practice 打破 agent-agnostic       | **唯一例外**。该节用具体工具演示高回报操作，主内容产品名禁令不适用于此页 |

### 内容填充时可借鉴的竞品素材

以下来自竞品调研，已在 Phase 1 和 Phase 2 中融入，不改骨架：

| 借鉴点                                    | 融入位置    | 力度     | 状态   |
| ----------------------------------------- | ----------- | -------- | ------ |
| "上下文即资产"叙事                        | 节点 1 或 9 | 正常融入 | ✅ 已入 |
| "AI context is like milk"类比             | 节点 1      | 正常融入 | ✅ 已入 |
| amplifier 概念（agents 放大已有模式） | 适当位置    | **极轻** | ✅ 已入 |
| agent-friendly code 概念                  | 节点 3 或 9 | 提一嘴   | ✅ 已入 |
| llms.txt 作为知识注入方式                 | 节点 9      | 提一嘴   | ✅ 已入 |
| CE/AE/PE 术语定义                         | 术语表      | 正常融入 | ✅ 已入 |
| "只放决策需要的东西"（信噪比）            | 节点 1      | 正常融入 | ✅ 已入 |
| scar tissue & crystals 比喻               | 节点 3 + 9  | 正常融入 | ✅ 已入 |
| "别急着擦掉错误"洞察                     | 节点 12     | 正常融入 | ✅ 已入 |
| "Vibe → CE" 范式迁移叙事钩子           | 节点 0        | 正常融入 | ✅ 已入 |
| Command / Skill / Sub-agent 职责边界   | 节点 7        | 正常融入 | ✅ 已入 |
| 权限分级统一交叉索引               | 节点 9        | 提一嘴   | ✅ 已入 |
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

**P2 观察（1 个）**：GAP-004 长期持久记忆 — 已在节点 1 轻量补充基本概念（会话内 vs 跨会话、自动积累风险）。

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
- **字体选择**：不应依赖浏览器默认字体。需要为标题、正文、代码块分别选择合适的字体，并保持各页面间视觉一致性
- **首页图标风格**：features 区域的 emoji 图标风格偏 AI 风，考虑统一为更合适的风格
- **内容可视化**：所有节点需审查是否存在连续长段纯文字缺少图表/示意的情况，按写作纪律的"可视化节奏"规则补充

## 反模式（本项目禁止）

- 禁止使用 `npm`、`yarn`、`pnpm` — 统一用 `bun`
- 禁止引入 Bun.serve / bun:sqlite 等服务端 Bun API — 这是静态文档站，不是 Bun 应用
- 禁止绕过 VitePress 做前端 — bun init 模板中的 "Don't use vite" 规则在此**不适用**（VitePress 本身基于 Vite）
