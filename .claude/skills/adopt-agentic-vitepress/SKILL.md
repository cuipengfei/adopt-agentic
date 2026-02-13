---
name: adopt-agentic-vitepress
description: VitePress 站点操作 SOP。加载此 skill 来创建/修改页面、更新 sidebar、管理骨架结构。触发：新建页面、修改 sidebar、骨架变更、config 更新。
---

# adopt-agentic VitePress 操作指南

VitePress 双语站点的页面管理和骨架维护完整操作指南。

## 适用场景

- 新建教程页面（中英双语）
- 修改 sidebar 结构
- 骨架节点增删改（联动更新所有相关文件）
- 站点配置调整

## 技术栈

- **VitePress** 1.6.x — 静态站点生成器（基于 Vite）
- **Bun** — 包管理和脚本运行（禁止 npm/yarn/pnpm）
- **GitHub Pages** — 部署目标
- **base path**: `/adopt-agentic/`

## 新建页面流程

### 步骤 1：创建中英文 Markdown 文件

```bash
# 中文
docs/guide/<page-name>.md

# 英文
docs/en/guide/<page-name>.md
```

### 步骤 2：更新 sidebar 配置

编辑 `docs/.vitepress/config.ts`，在**两个 locale** 下都添加 sidebar 条目：

```ts
// 中文 sidebar
locales['/'].themeConfig.sidebar['/guide/'] = [
  { text: '分组名称', items: [
    { text: '页面标题', link: '/guide/<page-name>' },
  ]},
]

// 英文 sidebar
locales['/en/'].themeConfig.sidebar['/en/guide/'] = [
  { text: 'Group Name', items: [
    { text: 'Page Title', link: '/en/guide/<page-name>' },
  ]},
]
```

### 步骤 3：构建验证

```bash
bun run docs:build
```

必须 exit code 0，零错误。

## 骨架联动更新清单

当骨架结构变更时（新增/删除/重排节点），以下文件必须**全部更新**：

| 序号 | 文件 | 更新内容 |
|------|------|---------|
| 1 | `.sisyphus/plans/phase1-content-structure.md` | 骨架唯一真相来源 — 节点定义、编号、主线表格 |
| 2 | `docs/guide/<node>.md` | 中文页面（创建或更新） |
| 3 | `docs/en/guide/<node>.md` | 英文页面（创建或更新） |
| 4 | `docs/.vitepress/config.ts` | 双语 sidebar 条目 |
| 5 | `CLAUDE.md` | 骨架状态序列表 |

**遗漏任何一个 = 不完整。**

## 当前骨架（15 节点 + 术语表）

```
━━ 基础概念 ━━
 0  介绍页 (index.md)
 1  上下文 — 第一原则 (context.md)           ✅ 初稿完成
 2  三角关系 + Agent Loop (actors.md)
━━ 上下文的载体（从静态到动态）━━
 3  System Instructions (system-instructions.md)
 4  内置工具 (built-in-tools.md)
 5  MCP (mcp.md)
 6  Slash Commands (commands.md)
 7  Skills (skills.md)
 8  Agent-Native CLI Tools (cli-tools.md)
━━ 串联与进阶 ━━
 9  知识喂养 (knowledge-feeding.md)
10  编排模式 (orchestration.md)
11  Sub Agent (sub-agents.md)
12  Eval / 验证 (eval.md)
13  Human-in-the-loop (human-in-the-loop.md)
14  Peer-to-Peer Agents (peer-to-peer-agents.md)
+   术语表 (glossary.md)
```

## 文件保护规则

| 文件 | 规则 |
|------|------|
| `draft-ideas.md` | **禁止 agent 修改** — 用户私有文件 |
| `materials/` | 站点页面**禁止引用** materials/ 内部路径 |
| `.sisyphus/plans/phase1-content-structure.md` | 骨架唯一真相来源 — 变更此文件需格外谨慎 |

## VitePress 约定

### Frontmatter

- 首页：`layout: home`，配合 `hero` + `features`
- 教程页面：默认布局（基本页面不需要 frontmatter）
- 支持：`title`、`description`、`outline`、`editLink`

### 静态资源

放在 `docs/public/` 下，使用根相对路径（如 `/logo.svg`）。VitePress 自动处理 base 前缀。

### 已知问题

- `themeConfig.logo` 用 `/logo.svg`，`head` favicon 用 `/adopt-agentic/logo.svg` — 写法不一致

## 命令参考

```bash
bun install          # 安装依赖
bun run docs:dev     # 开发服务器（HMR）
bun run docs:build   # 构建（验证用）
bun run docs:preview # 本地预览生产构建
```

## 反模式

- **禁止** npm / yarn / pnpm
- **禁止** Bun.serve / bun:sqlite 等服务端 API
- **禁止** 绕过 VitePress 做前端
- **禁止** 只更新中文不更新英文（双语必须同步）
- **禁止** 新增页面不更新 sidebar

## 完成标准

1. 中英文文件都已创建/更新
2. 双语 sidebar 都已更新
3. `bun run docs:build` 构建通过
4. 骨架变更时所有联动文件都已更新（5 个文件检查清单）
