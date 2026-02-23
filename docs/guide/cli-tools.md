# Agent-Native CLI 工具

> **上下文视角**：CLI 工具的输出直接成为上下文——纯文本、可预测、可组合，天然就是 agent 的最佳接口。

上一节的 Skills 给 Agent 注入行为知识——"怎么做"。但知识需要落地执行。Agent 怎么真正操作你的系统？

回到内置工具那一节的结论：`bash` 是最万能的工具，理论上它能做任何事。CLI 工具正是 bash 的弹药库——Agent 通过 bash 调用 `git`、`curl`、`jq`、`rg`，CLI 的输出直接成为上下文的一部分。

<SvgIllustration name="cli-tools.svg" interactive />

## 为什么 CLI 天然适合 Agent

> 做一件事，做好它，并与其他程序良好协作。
> — Doug McIlroy, Unix 管道发明者

几十年前的 Unix 哲学，为今天的 agentic 编程铺了路：

- **纯文本接口**：输入是参数，输出是 stdout/stderr。没有 GUI 状态需要管理。
- **行为可预测**：同样的输入，同样的输出。Agent 可以靠谱地解析结果。
- **可组合**：通过管道（`|`）串联多个命令。`curl -s https://api.example.com/users | jq '.[0].name'`——一行拿到结果。

Agent 不需要理解一个图形界面里按钮的位置。它只需要构造一个命令字符串，然后解析返回的文本。

换个角度看这件事。GUI 是给人看的——图标、按钮、拖拽，利用视觉认知。API 是给程序调的——函数签名、参数类型、返回值。CLI 是给文本处理用的——接收文本，输出文本。

LLM 是什么？一个文本进、文本出的推理引擎。CLI 和 LLM 天然就是同一种语言。

还有一个容易忽略的优势：自发现。Agent 第一次遇到一个陌生的 CLI 工具，调一次就够了——工具返回 help 信息，能做什么、怎么用、有哪些 flag，直接进入上下文。下次 agent 就会用了。不需要提前把完整文档塞进上下文，按需获取，用多少拿多少。

## 输出即上下文

当 Agent 需要了解项目历史时，它不会"打开 Git 客户端"。它执行一个命令。

**── 第 1 轮 ──**

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个代码助手...",
  "messages": [{ "role": "user", "content": "帮我看看最近的提交记录。" }],
  "tools": [{ "name": "bash", "description": "执行 shell 命令" }]
}
```

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_001",
      "name": "bash",
      "arguments": { "command": "git log -n 3 --oneline" }
    }
  ]
}
```

Agent 在本地执行命令，捕获 stdout。

**── 第 2 轮 ──**

注意 messages 比第 1 轮长了——上下文在增长。

```json
// → REQUEST（agent → LLM API）
{
  "messages": [
    { "role": "user", "content": "帮我看看最近的提交记录。" },
    {
      "role": "assistant",
      "tool_calls": [
        {
          "id": "call_001",
          "name": "bash",
          "arguments": { "command": "git log -n 3 --oneline" }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_001",
      "content": "f4b3c1d (HEAD -> main) feat: add user authentication\n2a1b9e5 fix: resolve payment gateway timeout\ne8d7f6c docs: update README with setup instructions"
    }
  ]
}
```

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "最近的进展：新增用户认证、修复支付超时、更新文档。需要我深入看哪个？"
}
```

`git log` 的输出，原封不动地成了 LLM 的上下文。不只是 stdout——**exit code 和 stderr 同样是上下文信号**。命令返回非零 exit code？Agent 知道执行失败了。stderr 有报错？Agent 据此调整策略。

## 结构化输出：对 Agent 更友好

传统 CLI 输出纯文本，LLM 需要自己解析。但越来越多的现代 CLI 支持结构化输出（JSON、YAML），让 Agent 可以精确提取信息而不靠猜：

- `gh pr list --json number,title,state` — GitHub CLI，直接输出 JSON
- `kubectl get pods -o json` — Kubernetes，结构化集群状态
- `rg --json "pattern"` — ripgrep，JSON 格式的搜索结果
- `docker inspect` — 容器详情，原生 JSON
- `ast-grep --json "pattern"` — AST 级代码搜索，JSON 输出

结构化输出意味着：**更少的解析错误，更精确的信息提取，更可靠的后续操作。** 如果你调用的 CLI 支持 `--json` flag，优先用它。

## 更多常见场景

CLI 工具的使用范围远不止 `git`。几个常见的 agent 调用模式：

**代码质量检查**

- `tsc --noEmit` — 类型检查，exit code 直接就是信号。没有干扰输出，agent 只需要看返回值是 0 还是非 0。
- `eslint --format json` — 代码质量问题，结构化到文件、行号、规则名，精确。

**依赖管理**

- `ncu --jsonUpgraded` — 检查哪些包有更新，JSON 输出，agent 可以直接推理升级策略。

**专为 AI 工作流设计的 CLI**

以上工具是"恰好对 agent 友好"——纯文本接口、可预测、有结构化输出选项。还有一类工具走得更远——**主动为 AI 工作流设计**。`openspec` 就是例子：

```bash
openspec list          # 当前有哪些进行中的变更
openspec show <name>   # 展示某个变更的 spec、task 清单、proposal
```

Agent 调用这些命令，拿到的不是原始代码或系统状态，而是**结构化的任务上下文**——这个功能该做什么、约束是什么、当前进度如何。这代表了一个方向：CLI 工具不只是执行操作或查询状态，还可以主动成为 agent 的任务上下文注入点。

## 与内置工具和 MCP 的区别

|            | 内置工具            | MCP                         | CLI 工具                 |
| ---------- | ------------------- | --------------------------- | ------------------------ |
| **来源**   | Agent 开发者硬编码  | 外部服务，通过协议接入      | 外部程序，通过 bash 调用 |
| **接口**   | Agent 内部函数      | 协议层抽象（stdio 或 HTTP） | stdin/stdout             |
| **生态**   | 封闭，由 Agent 决定 | 开放，需遵循 MCP 规范       | 极其成熟，海量现有工具   |
| **灵活性** | 低，用户无法增减    | 中，可接入任何 MCP Server   | 高，可安装和调用任何 CLI |

CLI 是 Agent 与外部世界交互**最简单、最普遍、生态最成熟**的方式。如果你要为 Agent 构建工具，CLI-first 通常是最稳妥的选择——它迫使你以最纯粹的方式暴露核心功能。

## 本节小结

- **上下文流动**：CLI 的 stdout/stderr 被捕获，直接注入下一轮上下文。exit code 作为执行成败的信号。输出过大会被 Agent 截断——注意控制输出量。
- **风险**：CLI 工具直接操作系统，`rm -rf /` 的风险真实存在。Agent 可能错误构造破坏性命令。某些命令输出可能包含敏感信息（环境变量、API key、私钥）。
- **可审计性**：Agent 执行的每条 shell 命令及其输出都应被记录——完整的操作追溯链，调试和安全审计的基础。

下一节看 Hooks & Plugins——从"往上下文里放东西"转向"在上下文流动过程中拦截和修改"。
