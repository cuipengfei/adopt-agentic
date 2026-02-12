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
├── guide/                  # 中文教程（10 个概念节点 + 术语表）
│   ├── index.md            # 介绍
│   ├── context.md          # 上下文 — 第一原则
│   ├── actors.md           # Agent、用户与 LLM API
│   ├── system-instructions.md  # System Instructions
│   ├── built-in-tools.md   # 内置工具
│   ├── mcp.md              # MCP — 外部能力扩展
│   ├── commands.md         # Slash Commands
│   ├── skills.md           # Skills — 领域知识模块
│   ├── eval.md             # Eval / 验证 / 可观测性
│   ├── sub-agents.md       # Sub Agent — 上下文隔离
│   └── glossary.md         # 术语表
├── en/                     # 英文版（i18n 子目录）
│   ├── index.md            # 英文首页
│   └── guide/              # 英文教程（占位，Phase 2 翻译）
│       ├── index.md ~ sub-agents.md  # 同结构 10 个占位页
│       └── glossary.md     # 英文术语表
└── public/logo.svg         # 静态资源
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

## 已知问题 / TODO

- `themeConfig.logo` 用 `/logo.svg`，但 `head` favicon 用 `/adopt-agentic/logo.svg` — 写法不一致（因 VitePress base 处理两者都能工作，但应统一）
- 所有教程页面目前是骨架大纲（Phase 2 填充内容）

## 反模式（本项目禁止）

- 禁止使用 `npm`、`yarn`、`pnpm` — 统一用 `bun`
- 禁止引入 Bun.serve / bun:sqlite 等服务端 Bun API — 这是静态文档站，不是 Bun 应用
- 禁止绕过 VitePress 做前端 — bun init 模板中的 "Don't use vite" 规则在此**不适用**（VitePress 本身基于 Vite）
