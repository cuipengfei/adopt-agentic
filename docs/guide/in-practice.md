# In Practice — 从概念到操作

> 前面所有节点保持 agent-agnostic。这一节打破这个约束——用具体工具演示可复制的操作。

你已经读完了上下文管理的完整概念链：从第一原则到载体到编排到验证。现在的问题是：**怎么动手？**

这一节不做全面操作手册——那是各工具自己的文档该干的事。这里只挑**高回报操作**：理解概念后很快能动手、立刻见效的东西。

## 写好你的 System Instructions

> 对应概念：[System Instructions](/guide/system-instructions)、[知识喂养](/guide/knowledge-feeding)

System Instructions 是你能动的最有效的手段——不写代码、不装插件，一个文件改变 Agent 的整体行为。

### 放在哪

不同工具使用不同的文件名，但机制相同：Agent 启动时读取这些文件，内容拼入 system prompt。

| 文件                           | 作用域               | 加载时机     |
| ------------------------------ | -------------------- | ------------ |
| `~/.claude/CLAUDE.md`          | 用户全局             | 每次 session |
| 项目根目录 `CLAUDE.md`         | 当前项目             | 进入项目时   |
| 子目录 `CLAUDE.md`             | 目录级               | 操作该目录时 |
| `AGENTS.md`                    | 同上（不同工具约定） | 同上         |
| `opencode.json` → instructions | 项目配置             | 启动时       |

层级合并：全局 → 项目 → 子目录。越具体的越优先。

### 写什么

一份好的项目级 System Instructions 应该回答三个问题：

**1. 这个项目用什么技术栈？**

```markdown
## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS
- **包管理**: pnpm（不要用 npm 或 yarn）
- **测试**: Vitest + Playwright
```

不要写"请用现代前端技术"——具体到版本和工具。Agent 靠这些做决策。

**2. 项目有什么约定？**

```markdown
## 约定

- 组件放 `src/components/`，按功能分目录
- API 路由放 `src/app/api/`
- commit 消息遵循 Conventional Commits
- 所有 export 必须有 JSDoc 注释
- 禁止 `any` 类型，禁止 `@ts-ignore`
```

**3. 有什么地雷？**

```markdown
## 注意事项

- `src/legacy/` 目录是旧代码，不要改动
- 环境变量在 `.env.local`，禁止提交到 git
- `pnpm db:migrate` 会直接操作生产数据库，谨慎执行
```

### 一句话自检

> 这句话如果删掉，Agent 的行为会变差吗？不会就删。

## 配置 Hooks

> 对应概念：[Hooks & Plugins](/guide/hooks-and-plugins)

### 任务完成通知

最实用的入门 hook——Agent 干完活了通知你。

**Claude Code**（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Task completed' 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}
```

Claude Code 的 hook 是 shell 命令——事件数据从 stdin 传入 JSON，exit code 决定行为。

**OpenCode**（`~/.config/opencode/plugins/notify.ts`）：

```typescript
import type { Plugin } from "@opencode-ai/plugin";

export default (async () => ({
  event: async ({ event }) => {
    if (event.type === "session.idle") {
      Bun.spawn(["notify-send", "OpenCode", "Waiting for input"]);
    }
  },
})) satisfies Plugin;
```

OpenCode 的 hook 是 TypeScript 函数——导出一个 Plugin，声明要监听的事件。放到 `~/.config/opencode/plugins/` 目录下自动加载。

同一个需求（通知），两种截然不同的实现方式。概念相同，接口不同。

### 危险命令拦截

在 `rm`、`git push --force`、`DROP TABLE` 执行前自动拦截。

**Claude Code**：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'CMD=$(cat | jq -r \".tool_input.command\"); echo \"$CMD\" | grep -qiE \"rm -rf|push --force|drop table\" && exit 2; exit 0'"
          }
        ]
      }
    ]
  }
}
```

`exit 2` = 阻断。Agent 会收到"操作被 hook 阻断"的反馈，然后要求你确认。

**OpenCode**：

```typescript
import type { Plugin } from "@opencode-ai/plugin";

const DANGEROUS = /rm\s+-rf|push\s+--force|drop\s+table/i;

export default (async () => ({
  "tool.execute.before": async ({ input }) => {
    if (input.tool === "bash" && DANGEROUS.test(input.args?.command ?? "")) {
      throw new Error("Blocked: dangerous command detected");
    }
    return input;
  },
})) satisfies Plugin;
```

同样的拦截逻辑，一个用 shell + exit code，一个用 TypeScript + throw。

### Token 用量统计

**Claude Code**：在 Stop hook 中读取 `transcript_path`，解析 transcript 统计 token。

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/count_tokens.js"
          }
        ]
      }
    ]
  }
}
```

**OpenCode**：监听 `message.updated` 事件，从消息元数据中提取 token 数。

```typescript
export default (async () => ({
  event: async ({ event }) => {
    if (
      event.type === "message.updated" &&
      event.properties?.role === "assistant"
    ) {
      const tokens = event.properties?.usage;
      // 写入日志或发送到统计服务
    }
  },
})) satisfies Plugin;
```

### 用 Plugin 修改 System Prompt

这是 hooks 最强大的能力之一——在 system prompt 构建时动态注入内容。

**OpenCode**：

```typescript
export default (async () => ({
  "experimental.chat.system.transform": async ({ output }) => {
    output.system += "\n\n调用 task() 时必须使用 run_in_background=true。";
    return output;
  },
})) satisfies Plugin;
```

**Claude Code**：用 `prompt` 类型的 hook 或 `agent` 类型的 hook 可以实现类似效果——在 SessionStart 时注入额外指令。

这种用法模糊了"hook"和"知识注入"的边界——回到概念层，它就是以编程方式往上下文里放东西。

## 知识喂养实操

> 对应概念：[知识喂养](/guide/knowledge-feeding)

### 项目文档的正确组织

你有一堆文档想让 Agent 知道。问题是：全塞进 System Instructions 会撑爆上下文窗口。

分层策略：

| 知识类型           | 放哪                      | 理由                       |
| ------------------ | ------------------------- | -------------------------- |
| 项目约定、禁忌     | `CLAUDE.md` / `AGENTS.md` | 始终需要，体量小（几百字） |
| API 文档、设计文档 | MCP 数据源或按目录放      | 按需检索，体量大           |
| 框架最佳实践       | Skills                    | 按需加载，可复用           |
| 临时上下文         | 对话中直接说              | 用完即走                   |

### 目录级 Instructions 的妙用

大型项目不同目录有不同约定？为每个目录写独立的 instructions 文件：

```
project/
├── CLAUDE.md / AGENTS.md      # 项目全局规则
├── src/
│   ├── CLAUDE.md              # src 目录的编码规范
│   ├── api/
│   │   └── CLAUDE.md          # API 层特有约定
│   └── components/
│       └── CLAUDE.md          # 组件层特有约定
└── scripts/
    └── CLAUDE.md              # 脚本目录的约定
```

不同工具使用不同的文件名（`CLAUDE.md`、`AGENTS.md`、`COPILOT.md`），但层级合并的机制相同。Agent 操作 `src/api/` 下的文件时，会自动加载三层 instructions：项目级 → src 级 → api 级。你不需要在一个文件里塞所有规则。

### 一个实际的 CLAUDE.md 示例

```markdown
# CLAUDE.md

## 技术栈

- **VitePress** 1.6.x（静态站点生成器）
- **Bun**（包管理和脚本运行）

## 命令

- `bun install` — 安装依赖
- `bun run docs:dev` — 开发服务器
- `bun run docs:build` — 构建

## 约定

- 中英双语同步更新
- 禁止使用 npm/yarn/pnpm
- 页面放 `docs/guide/`，英文版放 `docs/en/guide/`

## 反模式

- 禁止引入 Bun.serve 等服务端 API
- 禁止绕过 VitePress 直接做前端
```

短、具体、可操作。Agent 每次请求都带着这些规则，不需要你反复提醒。

## 给 Agent 下任务的正确姿势

> 对应概念：[三角关系](/guide/actors)

### 需求先行

不要上来就说"帮我写一个登录页面"。先描述需求：

```
我需要一个登录页面，要求：
1. 支持邮箱+密码登录
2. 支持 GitHub OAuth
3. 表单验证用 zod
4. 样式用 Tailwind，不需要额外 CSS 文件
5. 登录成功后跳转到 /dashboard
```

具体到什么程度？**到你能验证"做对了没有"的程度**。如果你自己都不知道"做对了"长什么样，Agent 更不知道。

### 小步快跑

不要一次给一个大任务。拆成可验证的小步：

```
第一步：创建登录表单组件，只做 UI，不接 API
（等它做完，你验证 UI 没问题）

第二步：接上 API，实现邮箱+密码登录
（等它做完，你测试登录流程）

第三步：加 GitHub OAuth
（等它做完，你测试 OAuth 流程）
```

每一步结束后你都能验证。发现问题立刻纠偏，不用等整个任务完成后再返工。

### 复述校验

给完需求后，让 Agent 复述一遍它的理解：

```
在开始之前，先告诉我你打算怎么做。
```

如果复述偏了，在它写任何代码之前就能纠正。这比写完一大段代码再推倒重来省事得多。

### 利用 Sub Agent

大任务拆成独立子任务，让 Agent 用 sub-agent 并行处理：

```
这个重构任务涉及三个独立模块：
1. 用户认证模块 (src/auth/)
2. 支付模块 (src/payment/)
3. 通知模块 (src/notification/)

三个模块没有交叉依赖，可以并行处理。
每个模块完成后单独 commit。
```

你在描述任务结构，Agent 根据描述决定是否使用 sub-agent 并行执行。你不需要知道 sub-agent 的 API——你只需要把任务拆清楚。

## 建立反馈循环

> 对应概念：[Eval / 验证](/guide/eval)、[Human-in-the-Loop](/guide/human-in-the-loop)

### 让 Agent 自己验证

在需求里加上验证步骤：

```
实现完成后：
1. 运行 `bun run typecheck` 确认无类型错误
2. 运行 `bun test` 确认测试通过
3. 运行 `bun run build` 确认构建成功
```

不要假设 Agent 会自动做这些。有些 Agent 工具会自动验证，有些不会。明确说出来最可靠。

### 什么时候介入

| 任务类型               | 你的角色       | 理由                 |
| ---------------------- | -------------- | -------------------- |
| 新文件、新功能         | 验证结果       | 低风险，错了改就好   |
| 修改核心逻辑           | 盯着过程       | 中风险，需要理解改动 |
| 删除、部署、数据库操作 | 手动审批每一步 | 高风险，不可逆       |

自动化（auto-approve）的原则：**操作可逆就放手，操作不可逆就盯着。**
