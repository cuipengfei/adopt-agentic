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

## 写作风格与 Persona

- 这不是代码库文档，而是**内容站**。写作规则本身就是仓库级约束，不是可有可无的个人偏好。
- 目标风格：深度够、措辞狠、但不装；复杂概念要讲得像常识，读者看完能立刻拿去用。
- **一句话自检**：这句话如果删掉，读者会损失什么？没损失就删。

## 审校必备 Skills

- 对 `docs/` 下教程内容做文本编辑或审校时，必须加载：
  - `humanizer-zh`
  - `adopt-agentic-writer`
- 主 agent 亲自编辑时也要遵守这两个 skill 的规则；委托 sub-agent 时通过 `load_skills` 传入。

## 写作纪律

### 术语纪律

- 不要用装腔或学术化中文。像“心智模型”“物理形态”“施力”“杠杆”“宪法”这类词，优先换成开发者一看就懂的大白话。
- 不常见术语必须先解释，再引入术语本身。不能直接丢名词让读者自己猜。
- 同一节里术语要统一，不要来回切换同义词。
- 控制 AI filler 词密度：中文“本质上”，英文 `essentially` / `fundamentally` / `basically` / `actually` / `in essence`，同一篇不要高频重复。
- 禁用词替换表：

| 禁用 | 替代 |
| --- | --- |
| 心智模型 | “理解方式” / “怎么想这件事” / 直接描述概念 |
| 物理形态 | “实际样子” / “底层长这样” |
| 施力 | “影响” / “带偏” / 直接描述作用 |
| 杠杆 | “最有效的方式” / “回报最高的做法” |
| 宪法 | “规则书” / “行为基准” / 直接说系统指令 |
| 瞎子 | “看不见屏幕” / 直接描述感知限制 |
| 发疯 | “跑偏” / “出错” / “走歪” |
| 伤疤 / 结晶 | “踩坑教训” / “验证过的好做法” |
| 半年前 / 半小时 / 几千行 / 几十分钟 | 用相对描述：之前、一段时间、大量、很久 |
| 节点 1 / Chapter 1 | 直接写章节名并给链接 |
| 交接便签 | `initial prompt` / `任务描述` |

### 段落与逻辑

- 每段只讲一个点。不要把 3-4 个并列概念塞进同一段。
- 长句拆短；超过 5 句话的段落必须拆。
- 列举关键概念时，用列表或分行，不要挤在一句里。
- 引用必须明确：说“两种模式”“这三点”时，前文必须刚给出这两个/三个点。
- 不做逻辑跳跃：段落之间要有自然过渡。
- 论点必须解释 `why/how`，不能丢一句结论就跑。
- 跨章节重复概念时，主讲章节展开，其余章节用链接引用，不重复铺陈。

### 可视化节奏

- 连续 3 段以上纯文字后，要考虑插入 Mermaid、表格、代码块或示意图。
- 流程/顺序优先 Mermaid；对比/分类优先表格；交互示例优先代码块。
- 表格不是自解释的，旁边要配一句具体例子。
- 禁止纯装饰性插图。
- Mermaid 图必须包含关键参与者；示例 JSON 只保留理解概念必需的字段。
- 修改 Mermaid、SVG 或布局后，必须跑 `bun run docs:build` 检查渲染问题。

### 内容格式规则

- 全站禁止 ASCII art 流程图，必须用 Mermaid。
- 示例尽量使用文中已出现的真实工具/服务，不要突然引入新技术栈。
- 技术机制描述要精确，不夸大、不模糊；不确定时加限定词，不做跨工具硬断言。
- VitePress 的 `::: tip / ::: warning / ::: danger / ::: details` 容器可优先用于提示/警告/补充说明。

## 审美优先级

冲突时按这个顺序裁决：

1. **中性描述** > 判断性标签
2. **精确** > 生动
3. **朴素** > 华丽
4. **留余地** > 绝对断言
5. **一遍说清** > 反复强调

风格红线：

- 读起来像学术论文或技术白皮书 → 改写。
- 读起来像在炫耀词汇量 → 简化。
- 不装和精准冲突时，优先不装。
- 标题必须直白、有信息量；不要文艺化，也不要过度口语化。

## 读者定位与内容边界

- 读者是**用 agent tool 的工程师**，不是造 agent 框架的人。
- 讲通用概念，不教 LangChain / LangGraph / CrewAI 这类框架实现。
- 主内容保持 agent-agnostic：`docs/guide/` 和 `docs/en/guide/` 中禁止出现 Cursor、Windsurf、GitHub Copilot 等具体产品名，除非落在既有例外页。
- 例外：`built-in-tools` 章节允许用 Claude Code、Codex、Gemini CLI、OpenCode 做对比示例。
- 选内容时先问三件事：
  1. 能不能翻译成工具使用者视角？
  2. 读者理解后能不能直接受益？
  3. 这个概念是否跨工具成立？

## 技术解释模式

- 解释 agent 和 LLM 的交互时，优先用 HTTP request/response 或 SSE 流的方式把抽象概念拆开讲。

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
