# AGENTS.md

采用 agentic AI 工作流的双语教程站，基于 **VitePress** 构建并部署到 GitHub Pages。这个仓库是 **内容 + 主题代码**，不是后端项目。

## 命令

- 安装依赖：`bun install`
- 本地开发：`bun run docs:dev`
- 生产构建：`bun run docs:build`
- 本地预览构建产物：`bun run docs:preview`

只用 **bun**。不要用 `npm`、`yarn`、`pnpm`。

## 目录重点

- `docs/`：站点正文与 VitePress 配置
  - `docs/guide/`：中文教程
  - `docs/en/guide/`：英文教程，必须与中文同步
  - `docs/.vitepress/config.ts`：双语 nav / sidebar / `base`
  - `docs/.vitepress/data/knowledge-graph.ts`：章节关系图，AgentPrompt 依赖它生成 related/all chapter links
  - `docs/.vitepress/theme/`：自定义主题与 AgentPrompt 组件
  - `docs/illustrations/`：SVG 插图源文件
  - `docs/.vitepress/theme/illustrations/`：SVG 对应的 Vue wrapper；**加新插图通常不只是一份 SVG，还要有对应 wrapper**
  - `docs/public/`：静态资源
- `materials/`：研究素材，不发布到站点
- `.sisyphus/`：agent 工作区；大部分内容是本地/运行时产物
- `draft-ideas.md`：仓库根目录下的私有草稿，**不要修改**

## 高信号规则

- 主教程内容保持 **agent-agnostic**。不要把 `docs/guide/*.md` 或 `docs/en/guide/*.md` 写成某个具体产品的操作手册。
- 改一个已发布章节时，**中文与英文必须同任务同步修改**。
- 新增、删除、重命名章节时，至少同步更新：
  - `docs/.vitepress/config.ts`
  - `docs/.vitepress/data/knowledge-graph.ts`
- 修改教程正文、Mermaid、主题组件、插图后，结束前跑 `bun run docs:build`。
- Mermaid 用代码围栏，**不要用 ASCII art 流程图**。
- `docs/illustrations/*.svg` 是中英共用资源，嵌入文字应保持 **English**。
- `docs/public/` 下资源用根相对路径引用，例如 `/logo.svg`。

## AgentPrompt / 主题联动

- `docs/.vitepress/theme/prompt-templates.ts`：中英 tutor prompt 模板
- `docs/.vitepress/theme/AgentPrompt.vue`：复制到 agent 的入口组件
- `docs/.vitepress/data/knowledge-graph.ts`：章节关系与链接输出

如果章节 URL 或章节清单变了，要同步 prompt / graph wiring，否则 copy-to-agent 功能会失真。

## 写内容前要知道的事

- 内容编辑与审校优先参考项目本地 skills：
  - `adopt-agentic-writer`
  - `adopt-agentic-vitepress`
  - `inline-review`
- 站点正文不要引用 `materials/`、`.sisyphus/` 等内部路径。
- `docs/plans/` 在 VitePress 内容树里；放进去的 Markdown 会变成站点页面，不要把临时设计文档随手丢到这里。

## 部署真相

- GitHub Pages workflow：`.github/workflows/deploy.yml`
- CI 实际监听的是 **`master`**，不是 `main`
- 构建产物目录：`docs/.vitepress/dist`
- 当前 VitePress `base`：`/adopt-agentic/`；仓库改名时必须同步改 `docs/.vitepress/config.ts`

## 这类错误最常见

- 把它当成 Bun 应用，去引入 `Bun.serve`、`bun:sqlite` 或后端式 API —— **不要这样做**。
- 只改中文或只改英文 —— **不可以**。
- 只新增页面，不同步 sidebar / knowledge graph —— 会留下隐藏断链。
- 把主内容写成工具对照表、产品评论或 checklist —— 与本站定位不符。
- 相信旧文档里的部署分支描述而不看 workflow —— 这里以 `.github/workflows/deploy.yml` 为准。

## Git / 运行时注意事项

- `docs/.vitepress/dist` 是构建产物，已忽略。
- `.claude/settings.local.json`、`.sisyphus/boulder.json`、`.sisyphus/notepads/`、`.sisyphus/evidence/` 是本地/运行时产物，已忽略。
- `.sisyphus/research/` 也在 `.gitignore` 中；不要把它当成稳定持久存储。

可执行配置优先于 prose。若文档和脚本/配置冲突，以脚本、workflow、配置文件为准。
