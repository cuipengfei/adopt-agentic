# Skills — 领域知识模块

> **上下文视角**：Skills 是按需加载的系统指令片段 — 让领域知识以模块形式进入上下文。

## 什么是 Skills

Skill 是一个可加载的**领域知识模块**。

它是一份详细的说明书，包含特定领域的指令、工作流程和最佳实践。当 Agent 加载一个 Skill，它就获得了该领域的"专家模式"。

把 Agent 想象成一个刚入职的新手程序员。默认情况下，它懂代码，但不懂你们团队的 Git 提交规范。

当你给它加载一个 `git-master` Skill，这份 Skill 包含的规则——比如"commit message 必须遵循 conventional commit 格式"、"不允许 force push 到 main 分支"——就被动态添加到了 Agent 的 System Prompt 中。

此后，这个 Agent 在处理 Git 相关任务时，就会像一个经验丰富的老手一样，严格遵循这些规范。

## Skills vs. Commands

一个是一次性动作，一个是持续性行为。

| 特性 | Slash Commands (`/ask`) | Skills (`/load git-master`) |
| --- | --- | --- |
| **效果** | 触发一次性动作 | 加载一套持续的行为模式 |
| **本质** | 用户侧的上下文**注入**快捷方式 | 动态修改 **System Instructions** |
| **生命周期** | 立即执行，用完即走 | 加载后持续生效，直到被卸载 |
| **举例** | `/ask "这段代码有什么问题？"` | `/load ui-ux-pro-max` |

一个 Slash Command 就像你对 Agent 说："帮我拿下那个东西"。它执行一次，任务结束。

加载一个 Skill 就像你对 Agent 说："从现在开始，你是一名资深数据库管理员，记住这些设计原则..."。这会改变它后续所有相关行为的**方式**。

## 上下文如何变化

加载 Skill 的本质，是动态修改 Agent 的 System Instructions。

**── 加载前 ──**

Agent 的 System Instructions 可能很简单：

```json
// → REQUEST (部分)
{
  "system": "你是一个 AI 编程助手。"
}
```

你让它创建一个 git commit，它可能会用一个非常随意的消息，比如 "stuff"。

**── 加载 `git-master` Skill ──**

执行 `/load git-master` 后，Agent 的 System Instructions 被扩充了：

```json
// → REQUEST (部分)
{
  "system": "你是一个 AI 编程助手。\n\n## git-master Skill\n- commit 消息必须遵循 conventional commit 规范 (fix:, feat:, docs: 等)。\n- commit 消息体要解释'为什么'，而不是'什么'。\n- 禁止使用 `git commit -m`，必须打开编辑器写详细消息。\n- ..."
}
```

这份新增的指令片段，现在是上下文的一部分，将在后续的**每一轮**请求中发送给 LLM。

**── 加载后 ──**

现在，你再让它创建同一个 commit，它的行为就完全不同了。它会生成一条符合规范的 commit message，比如 `feat: add user authentication endpoint`，并附上详细的解释。

LLM 并没有"学会"新知识。它只是看到了更丰富的上下文，并据此行动。

## 生态：可复用的行为模式

Skills 的强大之处在于其可共享性。

社区和团队可以创建、发布和共享 Skills，形成一个可复用的知识包生态。

- **个人**：你可以把你自己的工作流和最佳实践封装成一个私有 Skill。
- **团队**：可以为项目创建共享 Skill，确保所有成员（包括 AI Agent）遵循统一的工程规范。
- **社区**：可以为特定技术栈（如 React、Go、Terraform）创建高质量的公开 Skills，让任何人都能一键获得该领域的"专家级" Agent。

这使得 Agent 的能力不再仅仅由其开发者决定，而是可以被整个社区生态系统无限扩展。

## 横切关注点

- **上下文流动**：加载一个 Skill，意味着它的全部内容被添加到 System Instructions 中，持续占用上下文窗口，直到被卸- 载。它产生的是一种可预测、可复现的、稳定的领域行为模式。
- **风险提示**：加载过多的 Skills 会迅速撑爆上下文窗口。更危险的是，不同 Skills 的指令可能相互冲突（比如一个要求代码注释详尽，另一个要求代码极简），导致 Agent 行为混乱。
- **可审计性**：Agent 的日志中应明确记录哪个 Skill 在何时被加载或卸载。当 Agent 行为异常时，检查当前加载的 Skills 列表是排查问题的第一步。
