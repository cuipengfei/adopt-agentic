# Skills — 领域知识模块

> **上下文视角**：Skills 是按需加载的系统指令片段——让领域知识以模块形式进入上下文。

上一节的命令是一次性注入——触发一次，用完即走。但有些知识需要**持续生效**：Git 提交规范、代码风格要求、特定框架的最佳实践。你不想每次都手动提醒 Agent。

Skill 解决这个问题。它是一份可加载的指令集，一旦加载，其内容被追加到 Agent 的 System Instructions 中，在后续**每一轮**请求中持续发送给 LLM。

Commands 是"这次做什么"，Skills 是"从现在起怎么做"。

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

LLM 没有"学会"新知识。它只是看到了更丰富的系统指令，并据此行动。加载 Skill = 动态扩展 System Instructions。

## Skills vs. Commands

| 特性 | Slash Commands | Skills |
| --- | --- | --- |
| **本质** | 用户侧的上下文**注入** | 动态修改 **System Instructions** |
| **粒度** | 任务级注入——"这次做什么" | 行为级配置——"从现在起怎么做" |
| **生命周期** | 触发一次，用完即走 | 加载后持续生效，直到卸载 |
| **举例** | `/review` | 加载 `ui-ux-pro-max` |

不同 Agent 工具加载 Skills 的语法可能不同，但底层机制相同：**读取 Skill 文件 → 追加到 System Instructions → 后续每轮请求都带上。**

## Commands、Skills 与 Sub Agent 的职责边界

Commands 和 Skills 不是你影响 Agent 行为的全部手段。加上 [Sub Agent](./sub-agents.md)，三者覆盖了不同粒度的行为控制：

| | Commands | Skills | Sub Agent |
| --- | --- | --- | --- |
| **本质** | 一次性 prompt 注入 | 持续性系统指令扩展 | 隔离的上下文环境 |
| **粒度** | 任务级——"这次做什么" | 行为级——"从现在起怎么做" | 子任务级——"这件事交给专人" |
| **生命周期** | 触发即走 | 加载后持续，手动卸载 | 任务完成后销毁 |
| **上下文影响** | 追加到当前对话 | 追加到 System Instructions | 新建一份独立上下文 |
| **典型场景** | `/review`、`/commit` | 加载 Git 规范、代码风格 | 复杂子任务需要干净环境 |

### 何时用哪个

| 场景 | 推荐 | 理由 |
|------|------|------|
| 重复性单步操作 | Command | 一键触发，用完即走 |
| 持续生效的规范或知识 | Skill | 加载一次，后续每轮都生效 |
| 需要干净上下文的子任务 | Sub Agent | 避免主对话的噪声干扰 |
| 不确定该用哪个 | 先用 Command，重复了再升级为 Skill | 从简单开始，按需升级 |

## 生态：可复用的行为模式

Skills 的核心价值在于可共享：

- **个人**：把你的工作流和最佳实践封装成私有 Skill。
- **团队**：为项目创建共享 Skill，确保所有人（包括 Agent）遵循统一规范。
- **社区**：为特定技术栈发布公开 Skill——React 的组件设计原则、Go 的错误处理模式、Terraform 的模块结构。

Agent 的能力边界不再只由开发者决定，而是可以被生态扩展。

但每个加载的 Skill 都持续占着上下文。加载前问一句：这次任务真的需要它吗？"以防万一"就是主动往上下文灌噪声。加载后注意指令冲突——一个 Skill 要求详细注释，另一个要求极简，agent 不知道听谁的。任务结束后把不再需要的 Skill 停用，给下一个任务腾空间。加载容易停用难，但不停的后果是上下文越来越吵。

## 读每一节时，留意这三件事

- **上下文流动**：加载 Skill = 其全部内容追加到 System Instructions，持续占用上下文窗口直到卸载。它产生的是稳定的、可复现的领域行为模式。
- **风险**：加载过多 Skill 会撑爆上下文窗口。更隐蔽的问题：不同 Skill 的指令可能冲突——一个要求注释详尽，另一个要求极简——Agent 行为变得不可预测。
- **可审计性**：Agent 日志应记录哪个 Skill 在何时被加载或卸载。Agent 行为异常？先查当前加载的 Skill 列表和它们的内容。

下一节看 Agent-Native CLI Tools——Skills 给 Agent 注入行为知识，CLI Tools 给它可执行的能力。
