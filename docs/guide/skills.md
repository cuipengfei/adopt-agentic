# Skills — 领域知识模块

> **上下文视角**：Skills 是按需加载的系统指令片段——让领域知识以模块形式进入上下文。

上一节的 Command 和这一节的 Skill，底层做的是同一件事——把额外 prompt 注入上下文。区别在两点：

- **谁触发**：Command 是你手动输入 `/` 触发，Skill 由 agent 根据任务需求按需加载。
- **持续多久**：Command 注入一次，留在当前对话中；Skill 的内容被塞进每一轮发给 LLM 的请求里，后续**每一轮**都自动包含。

Command 是"这次做什么"，Skill 是"从现在起怎么做"。

![Skills: on-demand system instruction modules — load domain knowledge that persists across every request until unloaded](/illustrations/skills.svg)

## 加载前后的行为差异

最直观的理解方式：同一个任务，加载 Skill 前后的输出对比。

**── 加载前 ──**

Agent 的 System Instructions 很简单：

```json
// → REQUEST（部分）
{
  "system": "你是一个 AI 编程助手。"
}
```

你说："帮我 commit 这些改动。"

Agent 生成：`git commit -m "update files"`

**── 加载 `git-master` Skill ──**

```json
// → REQUEST（部分）
{
  "system": "你是一个 AI 编程助手。\n\n## git-master Skill\n- commit 消息必须遵循 conventional commit 规范 (fix:, feat:, docs: 等)\n- 消息体解释'为什么'，而不是'什么'\n- 禁止 --no-verify\n- ..."
}
```

**── 加载后 ──**

同样的请求："帮我 commit 这些改动。"

Agent 生成：`feat(auth): add JWT token refresh endpoint`，附上详细的 body 解释为什么需要这个变更。

LLM 没有"学会"新知识。它只是看到了更丰富的指令，并据此行动。加载 Skill 就是把它的内容塞进发给 LLM 的请求里——具体注入到哪个位置（system 字段还是 messages 里）因工具而异，但效果相同：Skill 的规则在后续每轮请求中持续生效。

## Skills vs. Commands

二者底层机制相同——都是把额外 prompt 注入上下文。差异在以下几点：

| 特性         | Slash Commands                    | Skills                                                     |
| ------------ | --------------------------------- | ---------------------------------------------------------- |
| **触发方式** | 用户手动 `/` 触发                 | Agent 按需加载（你给个提示，agent 自己决定加载）            |
| **持续时间** | 注入一次，留在当前对话中          | 塞进每轮请求，自动包含直到手动停用或会话结束                 |
| **粒度**     | "这次做什么"                      | "从现在起怎么做"                                           |
| **举例**     | `/review`                         | 加载 `git-master`                                          |

不同 agent 工具加载 Skill 的语法各异，但底层做的事情相同：**读取 Skill 文件内容 → 注入到请求中 → 后续每轮都带上。**

## 和 Sub Agent 怎么选

Commands、Skills 和 [Sub Agent](./sub-agents.md) 都是往上下文里注入内容的方式，区别在粒度和隔离程度：

- **重复的单步操作？** → Command。一键触发，用完就扔。
- **需要一直遵守的规矩？** → Skill。加载一次，每轮自动生效。
- **怕主对话太乱？** → [Sub Agent](./sub-agents.md)。在隔离的上下文中干活，结果摘要回传。
- **拿不准？** → 先用 Command。用着用着发现总在重复，再升级成 Skill。

## 生态：可复用的行为模式

Commands 和 Skills 都可以封装成文件、提交到仓库、在团队间共享。二者在分发和复用上没有区别。Skills 更适合生态化的原因是**持续性**——一次加载后自动生效，不需要每次手动触发：

- **个人**：把你的工作流和最佳实践封装成 Skill 文件。
- **团队**：为项目创建共享 Skill，确保所有人（包括 Agent）遵循统一规范。
- **社区**：为特定技术栈发布公开 Skill——React 的组件设计原则、Go 的错误处理模式、Terraform 的模块结构。

Agent 的能力边界不再只由开发者决定，而是可以被生态扩展。

但每个加载的 Skill 都持续占着上下文。加载前问一句：这次任务真的需要它吗？"以防万一"就是主动往上下文灌噪声。

加载后注意指令冲突。任务结束后把不再需要的 Skill 停用，给下一个任务腾空间。加载容易停用难，但不停的后果是上下文越来越吵。

## 本节小结

- **上下文流动**：加载 Skill = 其内容注入到每轮请求中，持续占用上下文窗口直到手动停用或会话结束。它产生的是稳定的、可复现的领域行为模式。
- **风险**：加载过多 Skill 会撑爆上下文窗口。更隐蔽的问题：不同 Skill 的指令可能冲突——一个要求注释详尽，另一个要求极简——Agent 行为变得不可预测。
- **可审计性**：Agent 日志应记录哪个 Skill 在何时被加载或停用。Agent 行为异常？先查当前加载的 Skill 列表和它们的内容。

下一节看 Agent-Native CLI Tools——Skills 给 Agent 注入行为知识，CLI Tools 给它可执行的能力。
