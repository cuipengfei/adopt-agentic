# Agentic 编程的心智模型

本教程不教你如何**构建** AI agent。

它教你如何**使用**它们——通过理解其底层机制，把 Claude Code、Cursor、GitHub Copilot 这类工具用到极致。

目标读者是开发者。如果你想从“把 agent 当聊天机器人”升级到“把 agent 当结对程序员”，这里就是起点。

## 核心命题：一切皆上下文

Agentic 编程的所有复杂机制，从工具调用到多 agent 协作，都服务于一个目标：

**在正确的时机，把正确的信息，放进上下文。**

LLM 没有记忆。你给它什么，它就看到什么。本教程的每一节，都在从不同角度剖析“上下文如何流动”这件事。理解了上下文，就理解了 agent。

## 概念节点导航

本教程围绕上下文这条主线，分为三部分：基础概念、上下文的载体、串联与进阶。

### 基础概念

*   [**介绍（本页）**](./)
*   [**上下文 — 第一原则**](./context.md)：为什么 LLM 没有记忆，以及为什么这决定了一切。
*   [**Agent、用户与 LLM API**](./actors.md)：三个角色的分工与协作循环。

### 上下文的载体

*   [**System Instructions**](./system-instructions.md)：Agent 在每次 API 请求中注入的系统级 prompt。
*   [**内置工具**](./built-in-tools.md)：Agent 硬编码提供的能力，如读写文件。
*   [**MCP — 外部能力扩展**](./mcp.md)：让用户不修改 Agent 代码就能添加新工具的协议。
*   [**Slash Commands**](./commands.md)：用户预定义的 prompt 模板，一种上下文注入快捷方式。
*   [**Skills — 领域知识模块**](./skills.md)：可加载的行为模式，动态注入的 System Instructions。
*   [**Agent-Native CLI Tools**](./cli-tools.md)：天然对 agent 友好的命令行工具。

### 串联与进阶

*   [**知识喂养**](./knowledge-feeding.md)：如何把你的项目知识系统性地注入 agent。
*   [**编排模式**](./orchestration.md)：Agent 的不同干活方式，如顺序执行、并行分支。
*   [**Sub Agent — 上下文隔离**](./sub-agents.md)：派生独立的上下文环境来处理子任务。
*   [**Eval / 验证 / 可观测性**](./eval.md)：如何知道 agent 做对了，以及如何追溯其行为。
*   [**Human-in-the-Loop**](./human-in-the-loop.md)：你在工作流中的角色——何时放手，何时介入。
*   [**Peer-to-Peer Agents**](./peer-to-peer-agents.md)：从层级委派到平级协作的演进。
