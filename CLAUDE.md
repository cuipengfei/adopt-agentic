# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

采用 agentic AI 工作流的教程网站，基于 VitePress 构建，部署到 GitHub Pages。

## 技术栈

- **VitePress** 1.6.x — 静态站点生成器（基于 Vite，不是 Bun.serve）
- **Bun** — 仅用于包管理和脚本运行
- 无 linter/formatter 配置。无后端。无数据库。

## 项目结构

```
docs/                       # VitePress 内容根目录
├── .vitepress/config.ts    # 站点配置：i18n locales、双语 sidebar/nav、搜索
├── index.md                # 中文首页（layout: home）
├── guide/                  # 中文教程（概念节点 + 术语表）
│   ├── index.md ~ sub-agents.md  # 各概念节点页面
│   └── glossary.md         # 术语表
├── en/                     # 英文版（i18n 子目录，Phase 2 翻译）
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
├── drafts/                 # 设计草稿（git tracked，.claude/ 除外）
│   ├── draft-ideas.md      # 用户私有构想（禁止 agent 修改）
│   └── ...
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

### 读者定位

- **用 agent tool 的人**，不是造 agent 的人。读者是开发者，使用 Claude Code、Cursor、Windsurf 等工具，想理解底层机制以用得更好。
- **不造框架**：不教 LangChain / LangGraph / CrewAI 等框架实现。

### Agent Agnostic 原则

- 所有概念使用**通用术语**，不绑任何特定 agent 产品。
- 举例可以多元（各种工具都可以提），但不能让某个产品成为主角。
- 不分 persona、不分市场——讲通用概念，不区分谁在读。

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

轻提即可不展开的：工具信任边界/安全、prompt 作为可维护资产。

### 骨架主线

**上下文流动**——每个节点都显式关联回"上下文"这条主线。结构分三段：

```
基础概念 → 上下文的载体（从静态到动态）→ 串联与进阶
```

骨架详见 `.sisyphus/plans/phase1-content-structure.md`。

### 骨架状态

**已锁定**。14 个概念节点 + 术语表，不再增减节点。完整序列：

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
━━ 串联与进阶 ━━
 8  知识喂养
 9  编排模式
10  Sub Agent — 上下文隔离
11  Eval / 验证 / 可观测性               [+ 可靠性]
12  Human-in-the-loop                    [+ 认知债务]
13  Peer-to-Peer Agents                  ← frontier
```

### 内容决策（已确认，不可违反）

| 决策                             | 结论                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| 练习 / checklist / decision tree | **不做**。纯概念教程，不附可执行件                                    |
| 工具适配附录 / 对照页            | **不做**。保持纯 agent-agnostic，不做 Cursor/Claude Code/Copilot 对照 |
| 双语策略                         | **同步更新**。中英文每个节点同时填充，不接受英文滞后                  |
| 站点页面引用 materials/          | **禁止**。站点页面不引用 materials/ 内部路径                          |

### 内容填充时可借鉴的竞品素材

以下来自竞品调研，Phase 2 填充时融入，不改骨架：

| 借鉴点                                    | 融入位置    | 力度     |
| ----------------------------------------- | ----------- | -------- |
| "上下文即资产"叙事                        | 节点 1 或 8 | 正常融入 |
| "AI context is like milk"类比             | 节点 1      | 正常融入 |
| amplifier 心智模型（agents 放大已有模式） | 适当位置    | **极轻** |
| agent-friendly code 概念                  | 节点 3 或 8 | 提一嘴   |
| llms.txt 作为知识注入方式                 | 节点 8      | 提一嘴   |

### 文件约定

| 路径                              | 用途                       | 谁动                |
| --------------------------------- | -------------------------- | ------------------- |
| `docs/guide/*.md`                 | 发布到站点的教程正文       | agent 填充内容      |
| `materials/`                      | 行业洞见研究素材（不发布） | agent 可读可写      |
| `.sisyphus/plans/`                | 设计计划（git tracked）    | agent 工作区        |
| `.sisyphus/drafts/`               | 设计草稿（git tracked）    | agent 工作区        |
| `.sisyphus/drafts/draft-ideas.md` | 用户私有构想               | **禁止 agent 修改** |
| `.sisyphus/notepads/`             | 临时工作记录（gitignored） | agent 临时用        |
| `.sisyphus/boulder.json`          | 运行时状态（gitignored）   | 自动生成            |

## 已知问题 / TODO

- `themeConfig.logo` 用 `/logo.svg`，但 `head` favicon 用 `/adopt-agentic/logo.svg` — 写法不一致（因 VitePress base 处理两者都能工作，但应统一）
- 所有教程页面目前是骨架大纲（Phase 2 填充内容）

## 反模式（本项目禁止）

- 禁止使用 `npm`、`yarn`、`pnpm` — 统一用 `bun`
- 禁止引入 Bun.serve / bun:sqlite 等服务端 Bun API — 这是静态文档站，不是 Bun 应用
- 禁止绕过 VitePress 做前端 — bun init 模板中的 "Don't use vite" 规则在此**不适用**（VitePress 本身基于 Vite）
