# Agentic 编程的心智模型

本教程不教你如何**构建** AI agent。

它教你如何**使用**它们——通过理解其底层机制，把你手边的 agentic 编程工具用到极致。

目标读者是开发者。如果你想从"把 agent 当聊天机器人"升级到"把 agent 当结对程序员"，这里就是起点。

## 核心命题：一切皆上下文

Agentic 编程的所有复杂机制，从工具调用到多 agent 协作，都服务于一个目标：

**在正确的时机，把正确的信息，放进上下文。**

LLM 没有记忆。你给它什么，它就看到什么。本教程的每一节，都在从不同角度剖析"上下文如何流动"这件事。这里所有的能力——工具、协议、编排——本质都是上下文工程。

行业把这件事叫 **Context Engineering**（上下文工程）——从"写好一条 prompt"演进到"设计动态系统管理整条上下文供给链"。而整个用 agent 工具做软件的工程实践，正在被称为 **Agentic Engineering**——上下文工程是其中最核心的子领域，也是本教程的主线。

很多开发者的起点是 **vibe coding**——凭直觉给 agent 几句话，看它能不能搞定。简单任务上够用。但任务一复杂，随机性就暴露了：同样的描述今天能跑明天翻车，一个项目没问题另一个项目全是 bug。问题往往不在 agent 能力不足，而在你喂进去的上下文不可控。

从 vibe coding 到上下文工程，不是技术升级，是心智模型的切换——从"试试看能不能行"到"设计上下文让它必须行"。这本教程就是这个切换的地图。

下一节[《上下文 — 第一原则》](./context.md)会用两轮 HTTP 请求把这件事拆开给你看。

## 概念节点导航

全书按上下文主线分三段：基础概念、上下文的载体、串联与进阶。

### 基础概念

*   [**上下文 — 第一原则**](./context.md)：为什么 LLM 没有记忆，以及为什么这决定了一切。
*   [**Agent、用户与 LLM API**](./actors.md)：三个角色的分工与协作循环。

### 上下文的载体

*   [**System Instructions**](./system-instructions.md)：每次 API 请求中注入的系统级 prompt，定义 agent 的身份和规则。
*   [**内置工具**](./built-in-tools.md)：Agent 硬编码提供的能力——读写文件、执行命令、搜索代码。
*   [**MCP — 外部能力扩展**](./mcp.md)：把外部工具定义注入上下文，让 agent 不改代码就能获得新能力。
*   [**Slash Commands**](./commands.md)：用户预定义的 prompt 模板，一键把固定上下文注入对话。
*   [**Skills — 领域知识模块**](./skills.md)：可按需加载的行为模式，运行时动态注入的 System Instructions。
*   [**Agent-Native CLI Tools**](./cli-tools.md)：输出结构化数据而非人类可读文本的命令行工具——agent 的天然盟友。
*   [**Hooks & Plugins**](./hooks-and-plugins.md)：在上下文流动的关键节点拦截、修改、记录——最细粒度的行为扩展。

### 串联与进阶

*   [**知识喂养**](./knowledge-feeding.md)：如何把你的项目知识系统性地注入 agent 的上下文。
*   [**编排模式**](./orchestration.md)：顺序执行、并行分支、路由分发——agent 的不同干活方式。
*   [**Sub Agent — 上下文隔离**](./sub-agents.md)：派生独立的上下文环境来处理子任务，结果摘要回传。
*   [**Eval / 验证 / 可观测性**](./eval.md)：如何知道 agent 做对了，以及如何追溯其行为。
*   [**Human-in-the-Loop**](./human-in-the-loop.md)：你在工作流中的角色——何时放手，何时介入。
*   [**Peer-to-Peer Agents**](./peer-to-peer-agents.md)：从层级委派到平级协作——上下文的双向流动。

### 实战

*   [**In Practice**](./in-practice.md)：打破 agent-agnostic 约束，用具体工具演示可复制的高杠杆操作。
