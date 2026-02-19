# Skills — 领域知识模块

> **上下文视角**：Skills 是按需加载的系统指令片段——让领域知识以模块形式进入上下文。

上一节的 Command 和这一节的 Skill，底层做的是同一件事——把额外 prompt 注入上下文。持续性上二者没有区别：一旦进入上下文，后续每轮请求都跟着（参见[上下文](./context.md)一节——LLM 无状态，每次重发全部）。

真正的区别在两点：

- **谁触发**：Command 是你手动输入 `/` 触发；Skill 由 LLM 根据任务判断，通过工具调用按需加载。
- **怎么进入**：Command 触发即全文展开；Skill 先以名称和简短描述的形式出现在上下文中，LLM 判断需要时再加载完整内容。

Command 是"这次做什么"，Skill 是"从现在起怎么做"。

![Skills: on-demand system instruction modules — LLM discovers available skills via metadata, loads full content when needed](/illustrations/skills.svg)

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

### 先发现，后加载

上面的例子简化了加载过程。实际上，Skill 进入上下文分两步。

**第一步：启动时，Agent 把所有可用 Skill 的元数据注入上下文。**

```json
// → REQUEST（启动时，部分）
{
  "system": "...\n\n## Available Skills\n- git-master: Git 操作专家，遵循 conventional commit 规范\n- frontend-ui-ux: 前端设计与 UI/UX 最佳实践\n- ..."
}
```

LLM 看到的是一份清单——名称和简短描述，不是完整内容。上下文成本极低。

**第二步：LLM 判断当前任务需要某个 Skill 时，主动调用工具加载全文。**

```json
// ← RESPONSE（LLM 决定加载 skill）
{
  "tool_calls": [
    {
      "name": "load_skill",
      "arguments": { "name": "git-master" }
    }
  ]
}
```

Agent 读取 Skill 文件的完整内容，注入到后续请求中。从这一刻起，Skill 的规则才真正占用上下文。

这就是渐进式披露（progressive disclosure）——不用的 Skill 只占一行元数据的空间；用到了才展开全文。主流开源工具（Codex、Gemini CLI、OpenCode）都采用了这个模式，只是触发工具的名称各异。

## Skills vs. Commands

二者底层机制相同——都是把额外 prompt 注入上下文。差异在以下几点：

| 特性         | Slash Commands                                 | Skills                                          |
| ------------ | ---------------------------------------------- | ----------------------------------------------- |
| **触发方式** | 用户手动 `/` 触发                              | LLM 根据任务判断，通过工具调用加载              |
| **进入方式** | 触发即全文展开，作为 user message 进入对话历史 | 启动时只有元数据（名称+描述）；LLM 按需加载全文 |
| **持续性**   | 进入后每轮请求都带（随对话历史）               | 进入后每轮请求都带（部分工具支持中途停用）      |
| **粒度**     | "这次做什么"                                   | "从现在起怎么做"                                |
| **举例**     | `/review`                                      | 加载 `git-master`                               |

不同工具加载 Skill 的语法各异，但流程相同：**启动时注入元数据 → LLM 按需加载全文 → 注入后每轮请求都带上。**


## 生态：可复用的行为模式

Commands 和 Skills 都可以封装成文件、提交到仓库、在团队间共享。二者在分发和复用上没有区别。Skills 更适合生态化的原因是**持续性**——一次加载后自动生效，不需要每次手动触发：

- **个人**：把你的工作流和最佳实践封装成 Skill 文件。
- **团队**：为项目创建共享 Skill，确保所有人（包括 Agent）遵循统一规范。
- **社区**：为特定技术栈发布公开 Skill——React 的组件设计原则、Go 的错误处理模式、Terraform 的模块结构。

Agent 的能力边界不再只由开发者决定，而是可以被生态扩展。

但每个加载的 Skill 都持续占着上下文。加载前问一句：这次任务真的需要它吗？"以防万一"就是主动往上下文灌噪声。

加载后注意指令冲突。有的工具支持中途停用 Skill，有的不支持——不支持的，加载了就到会话结束。所以加载前的判断比加载后的管理更重要。

## 本节小结

- **上下文流动**：加载 Skill = 其内容注入到每轮请求中，持续占用上下文窗口。部分工具支持中途停用释放空间，其余到会话结束。它产生的是稳定的、可复现的领域行为模式。
- **风险**：加载过多 Skill 会撑爆上下文窗口。更隐蔽的问题：不同 Skill 的指令可能冲突——一个要求注释详尽，另一个要求极简——Agent 行为变得不可预测。
- **可审计性**：Agent 日志应记录哪个 Skill 在何时被加载或停用。Agent 行为异常？先查当前加载的 Skill 列表和它们的内容。

下一节看 Agent-Native CLI Tools——Skills 给 Agent 注入行为知识，CLI Tools 给它可执行的能力。
