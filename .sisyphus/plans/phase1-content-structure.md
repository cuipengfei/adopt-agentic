# Phase 1 — 主体内容结构与骨架（设计文档）

> Brainstorming 产出。基于 draft-ideas.md phase 1 的构想，经过逐节讨论确认。
> 经 gap audit（详见 phase1-skeleton-gap-audit.md）后增补：知识喂养、编排模式、Human-in-the-loop、Peer-to-Peer Agents 四个新节点，并为多个现有节点增加子项。

## 设计决策记录

| 决策项       | 结论                         | 理由                                       |
| ------------ | ---------------------------- | ------------------------------------------ |
| 目标读者     | 用 agent tool 的开发者       | 不是造 agent 的人；想理解底层机制以用得更好 |
| 叙事起点     | 直接从「上下文」原理切入     | 不需要先 sell motivation，读者来了就是想学 |
| API 讲解深度 | 解释性提及，不展开           | 重点在概念，不是 API spec                  |
| Agent Agnostic | 通用术语，不绑特定产品     | 举例多元，但不让某个工具成为主角           |
| 不分 Persona | 通用概念，不区分谁在读       | 不按角色/市场分内容                        |
| 内容筛选     | "它山之石可以攻玉"三重检验   | 翻译得过来？用户直接受益？工具无关？       |
| 页面粒度     | 不预设，等内容写完再定拆合   | 用户偏好 slides 风格（phase 3 范围）       |
| Sidebar 分组 | 先不管，只定内容节点和顺序   | 分组是呈现层，内容定了再说                 |
| 节点顺序     | 按上下文流动顺序排列         | 三段结构：基础概念→载体→串联与进阶        |
| Eval/验证    | 从横切关注点升级为独立节点   | 多个行业来源反复强调验证的核心地位         |
| 新增节点     | 知识喂养 + 编排模式 + HITL + P2P Agents | Gap audit + 行业素材审计确认对使用者有直接价值 |

## 术语约束

所有内容均为概念层面，使用通用术语，不绑定特定 Agent 产品。不要只用 Claude Code 或 OpenCode 的专有术语。

## 横切关注点

每个概念节点的骨架都包含以下固定栏位：

- **上下文流动**：这一步消耗/产生哪些 context？
- **风险提示**：失控点？
- **可审计性**：操作记录可追溯吗？

## 内容节点序列

### ━━ 基础概念 ━━

### 节点 0 — 介绍页

> 对应现有 `guide/index.md`，需改造。

- 本教程是什么、适合谁（开发者，想理解 agentic 编程的底层机制以用得更好）
- **核心命题预告**：「Agentic 编程的一切归结为上下文管理」
- 节点导航：列出所有概念节点和一句话描述
- 不讲具体概念，只做地图

> 行业视角：Fowler(上下文工程)、Levels(vibe coding 对比)、Anthropic(agent loop)。详见 materials/industry-insights/

### 节点 1 — 上下文（Context）— 第一原则

- 什么是上下文：LLM 每次请求收到的**全部信息**（system prompt + 历史消息 + 工具定义 + 工具返回值）
- 为什么是第一原则：LLM 没有记忆，它看到什么就是什么；一切 agentic 机制本质上都在解决「如何在正确的时机把正确的信息放进上下文」
- 上下文的局限：token 窗口有限、信息越多不一定越好、上下文污染
- **State & Memory**（子项）：为什么 agent 会"忘事"？会话状态 vs 持久上下文（如 CLAUDE.md）的区别；什么时候该断开会话重新开始；session handoff 的概念
- **前瞻**：后续每一节都是在讲上下文的不同载体

> 行业视角：Fowler(四层模型)、Karpathy(质量>数量)、Willison(上下文预算)。详见 materials/industry-insights/

### 节点 2 — Agent / 用户 / LLM API — 三角关系

- 三个角色是谁：**用户**（发指令的人）、**Agent**（编排层，代码程序）、**LLM**（推理引擎，通过 API 调用）
- 谁做什么：用户给意图 → Agent 编排上下文/调用工具 → LLM 做推理/决策 → Agent 执行 → 循环
- API 格式点到为止：提及 Messages API / Chat Completions / Responses API 的存在和差异（不展开），指出它们是 Agent 与 LLM 之间的通信协议
- Agent Loop：Agent 的核心循环（接收 → 推理 → 行动 → 观察 → 再推理），解释为什么这是「agentic」而不只是「chat」
- **怎么给 agent 下任务**（子项）：需求先行与复述校验；任务拆解的粒度；极短反馈回路（小步快跑、描述-生成-运行-再提示）；最小可验证实验
- 术语通用化原则提醒

> 行业视角：Karpathy(LLM as OS)、Anthropic(简单循环)。详见 materials/industry-insights/

### ━━ 上下文的载体（从静态到动态）━━

### 节点 3 — System Instructions — 第一份上下文

- 定义：Agent 在每次 API 请求中注入的**系统级 prompt**，LLM 看到的第一份上下文
- 它包含什么：Agent 的身份设定、行为规则、可用工具的说明、输出格式要求
- 谁写的：Agent 开发者硬编码 + 用户可扩展（如自定义指令文件等机制）
- 关键洞察：用户自定义的 system instructions 是**最强大的杠杆之一**——不需要写代码，只需要写对 prompt，就能改变 Agent 的整体行为
- 轻提：你写的 prompt 和 instructions 是**可维护资产**——值得版本化、review、持续迭代，不是写一次丢那儿
- 通用术语：system prompt / system instructions

> 行业视角：Gene Kim(合规前置)、Kent Beck(风格基准)、Yegge(接口契约)。详见 materials/industry-insights/

### 节点 4 — 内置工具（Built-in Tools）

- 定义：Agent 硬编码提供的能力，LLM 可以通过 tool call 请求调用
- 举例（通用）：读写文件、执行命令、代码搜索、LSP 操作、浏览器控制等
- 工具调用流程：LLM 决定调用 → Agent 执行 → 结果放回上下文 → LLM 继续推理
- 上下文视角：工具定义本身是上下文的一部分（LLM 需要知道有哪些工具可用）；工具返回值也是上下文（LLM 靠它来做下一步决策）
- 限制：内置工具由 Agent 决定，用户无法增减
- 轻提：工具有信任边界——不是所有操作都该自动执行，有些需要人确认

> 行业视角：Karpathy(确定性工具)、Aider(repo map)、Cline(可组合原语)。详见 materials/industry-insights/

### 节点 5 — MCP（Model Context Protocol）

- 定义：标准化的外部能力扩展协议，让用户可以**不修改 Agent 代码**就添加新工具
- 与内置工具的关系：功能等价（都是 tool call），区别在于**谁提供**——内置工具是 Agent 自带的，MCP 是外部服务通过协议接入的
- 上下文视角：MCP 工具的定义和返回值与内置工具一样进入上下文，LLM 不区分来源
- 为什么重要：打破了 Agent 的封闭生态，任何人都可以为任何 Agent 写 MCP server
- 轻提：外部接入的工具同样有信任边界，来源越开放越需要留意权限

> 行业视角：Claude Code(MCP 扩展)、OpenCode(解耦)、OpenAI(skills 签名)。详见 materials/industry-insights/

### 节点 6 — Slash Commands

- 定义：用户预定义的 prompt 模板，通过 `/command` 触发，Agent 执行后将结果注入上下文
- 本质：一种**用户侧的上下文注入快捷方式**——把常用的、复杂的指令打包成一键触发
- 可以内嵌什么：纯文本 prompt、Bash 命令执行、文件读取、组合动作
- 与 System Instructions 的区别：System Instructions 是**始终存在**的上下文；Slash Commands 是**按需触发**的上下文注入
- 上下文视角：输出最终进入对话上下文，LLM 并不知道这段信息来自一个 slash command

> 行业视角：Cline CLI(原语)、Willison(CLI 偏好)。详见 materials/industry-insights/

### 节点 7 — Skills

- 定义：可加载的**领域知识模块**，包含详细的指令、工作流程和最佳实践
- 与 Slash Commands 的区别：Slash Commands 是触发一次性动作；Skills 是加载**一整套行为模式**——加载后持续影响 Agent 的行为方式
- 上下文视角：Skills 本质上是动态注入的 System Instructions 片段——加载一个 skill 就是往上下文里追加一段专业知识
- 举例（通用）：brainstorming skill（改变 Agent 为咨询模式）、git 操作 skill（注入 git 最佳实践）、UI/UX skill（注入设计规范）
- 生态系统：Skills 可以由社区创建和共享，形成可复用的知识包生态

> 行业视角：OMO(声明式注册)、Kent Beck(上下文包)、OpenAI(白名单)。详见 materials/industry-insights/

### 节点 8 — Agent-Native CLI Tools（新）

- 定义：天然对 AI agent 友好的命令行工具，以及专门为 agent 使用场景设计的新一代 CLI 工具
- 为什么 CLI 天然 agent-friendly：纯文本输入输出、行为可预测、无需 GUI 交互、可组合（pipe）、返回值直接就是上下文
- 传统 CLI 工具的 agent-native 特质：git、ripgrep、jq、curl、docker 等——这些工具的设计哲学（Unix 哲学：做一件事、做好它、可组合）恰好就是 agent 需要的
- 新一代 agent-native 工具：从 npm/pip/cargo 等 registry 安装的、专为 agent 设计的 CLI 工具包（类似 Skills 是可安装的知识模块，CLI Tools 是可安装的可执行能力）
- 与内置工具的区别：内置工具由 Agent 硬编码提供；CLI Tools 是外部安装的，agent 通过 bash/shell 调用
- 与 MCP 的区别：MCP 通过标准化协议接入；CLI Tools 通过传统命令行接口——更简单、更普遍、生态更成熟
- 上下文视角：CLI 工具的输出直接成为上下文的一部分——agent 调用 `git log` 的结果、`rg` 的搜索结果，都被注入上下文供 LLM 推理
- 设计启示：如果你要为 agent 构建工具，CLI-first 是最 agent-friendly 的选择

> 行业视角：Willison(CLI优先)、Cline(Primitives/CLI哲学)、OpenCode(终端优先)、Aider(终端内结对)。详见 materials/industry-insights/

### 节点 9 — Hooks & Plugins — 行为拦截与扩展（新）

- 定义：在 Agent 的**生命周期事件**上挂载用户逻辑——拦截、修改、记录、扩展
- 与前面节点的区别：前面的载体是"往上下文里放东西"；Hooks 是"在上下文流动过程中拦截和修改"
- Hooks 核心概念：
  - 生命周期事件：SessionStart、PreToolUse、PostToolUse、Stop、Notification 等
  - 输入/输出协议：stdin JSON 输入、stdout JSON + exit code 输出
  - 配置三层结构：事件 → 匹配器（正则过滤）→ 处理器（shell/prompt/agent）
  - 作用域层级：用户全局 → 项目级 → 插件级
- Plugins 核心概念：
  - 打包的行为扩展模块——可以包含多个 hooks、自定义工具、skills、命令
  - 安装与分发：marketplace（GitHub repos）/ npm 包 / 本地文件
  - 生态正在演进：官方市场、社区市场、个人插件
- 对比：Skills 告诉 LLM "该怎么做"，MCP 给 LLM "能做什么"，Hooks 在 LLM 不知情的情况下"控制边界"
- 上下文视角：Hooks 不往上下文里"放"东西，而是在上下文流动的**节点**上拦截和修改——这是用户可用的最细粒度的上下文控制机制

> 行业视角：Claude Code hooks/plugins 生态、OpenCode @opencode-ai/plugin 插件系统。详见本地配置参考。

### ━━ 串联与进阶 ━━

### 节点 10 — 知识喂养（原节点 9）

- 定义：如何把**你的知识**（项目文档、内部规范、领域经验）系统性地注入 agent
- 为什么需要统一视角：前面三个节点（System Instructions / MCP / Skills）分别讲了知识注入的不同机制，但用户面对的实际问题是一个——"我有一堆知识，怎么让 agent 知道这些"
- 三条路径对比：
  - System Instructions：始终存在，全局生效，适合项目级规范和约束
  - MCP 数据源：按需检索，适合大量结构化/非结构化知识（文档库、API spec、wiki）
  - Skills：按需加载，适合特定领域的工作流和最佳实践
- 选择标准：知识的持久性（始终需要 vs 偶尔需要）、体量（几百字 vs 几万字）、结构化程度
- 上下文视角：无论哪条路径，最终都是在往上下文里放信息——区别在于**什么时候放、放多少、放多久**

### 节点 11 — 编排模式（原节点 10）

- 定义：agent 有不同的**干活方式**（顺序执行、并行分支、计划-执行循环），理解这些模式才能有意识地引导它
- 为什么使用者需要懂：你知道 agent 能并行跑子任务，就会把任务拆成可并行的块；你知道它会做计划再执行，就能在计划阶段介入纠偏
- 常见模式（心智模型，不讲框架实现）：
  - 顺序执行：一步一步来，适合依赖链明确的任务
  - 并行分支：多个子任务同时跑，适合相互独立的工作
  - 计划-执行：先做计划、人审批、再执行，适合复杂或高风险任务
  - 迭代循环：执行→验证→修正→再执行，适合探索性任务
- 上下文视角：不同编排模式决定了上下文如何在多步骤/多分支间**流动、分裂、汇合**
- 与 Sub Agent 的关系：Sub Agent 是实现隔离的手段之一，编排模式是更高层的组织方式

### 节点 12 — Sub Agent — 上下文隔离（原节点 11）

- 定义：从主 Agent 派生出的**独立上下文环境**，执行特定子任务后返回结果
- 解决什么问题：主 Agent 上下文随着对话增长会被污染（无关信息越来越多），Sub Agent 提供了一种**上下文隔离**机制
- 工作方式：主 Agent 创建 Sub Agent → 给它初始 prompt（全新上下文）→ Sub Agent 独立完成任务 → 结果摘要返回主 Agent 的上下文
- 上下文视角：fork/隔离/压缩上下文的手段之一
- 关键洞察：Sub Agent 的初始 prompt 质量决定了它的效果——这又回到了节点 1 的第一原则

> 行业视角：Karpathy(planner/worker/critic)、Yegge(角色+事实库)、LangGraph(子图)、OMO(handoff)。详见 materials/industry-insights/

### 节点 13 — Eval / 验证 / 可观测性（原节点 12）

- 定义：如何知道 agent 做对了？验证机制是让 agentic 工作流可信赖的关键
- 为什么独立成节：agent 不是"用一次就扔"，需要持续验证其行为
- 验证层次：
  - 工具调用级：单次调用结果是否正确（自检/重试）
  - 任务级：整个任务链的输出是否符合预期（TDD 锁定需求）
  - 可观测性：操作日志可追溯、可重放
- **可靠性 & 错误恢复**（子项）：agent 搞砸了怎么办——回滚策略、识别死循环、"agent 说搞定了但其实没搞定"的验证意识
- 上下文视角：验证结果本身也是上下文——agent 可以利用验证反馈来自我修正

> 行业视角：Anthropic(evals)、Kent Beck(TDD)、Devin(可验证=表现好)、Willison(重放)。详见 materials/industry-insights/

### 节点 14 — Human-in-the-loop（原节点 13）

- 定义：你——使用 agent tool 的人——在 agentic 工作流中的角色：什么时候放手、什么时候介入、怎么纠偏
- 为什么独立成节：前面所有节点讲的是 agent 的机制；这一节回到**人**——你才是最终决策者
- 关键维度：
  - 放手 vs 介入：哪些任务可以 auto-approve 让 agent 全自动跑？哪些必须盯着？判断标准是什么？
  - 审批点设置：在高风险操作前插入人工确认（如删除、push、部署）
  - 纠偏策略：agent 跑偏时，是中途打断、等它跑完再改、还是直接重来？
- **认知债务**（子项）：过度委托的代价——agent 把活干了，但你还懂不懂你的系统？团队对代码的理解会不会被稀释？如何保持对系统的掌控
- 上下文视角：人决定上下文的最终走向——选择接受、修正或丢弃 agent 的产出

### 节点 15 — Peer-to-Peer Agents（原节点 14）

- 定义：从层级委派（orchestrator → worker）到平级协作（agent ↔ agent）的质变——agent 之间可以直接通信、互相 challenge、共享发现
- 为什么独立成节：这是编排模式的前沿演进，和 sub-agent 的单向委派形成鲜明对比
- 关键维度：
  - 心智模型对比：层级式 vs 平级式，两者的适用场景
  - 为什么大多数选择层级：协调开销、错误传播、debug 困难、成本等 trade-off
  - 什么任务值得平级协作：用户的决策框架
- 这是前沿：方向明确但生态尚未成熟，大多数工具仍在层级编排阶段
- 上下文视角：上下文如何在平级 agent 之间双向流动——不再是单向注入，而是互相交换

> 行业视角：详见 materials/industry-insights/global/multi-agent-peer-messaging-analysis.md

### ━━ 实战 ━━

### 节点 16 — In Practice — 从概念到操作（新）

- 定义：前面所有节点都保持 agent-agnostic；这一节打破约束，用具体工具（Claude Code、OpenCode 等）演示可复制的操作
- 为什么独立成段：读者学完概念后需要一个"怎么动手"的出口——不是完整操作手册，而是精选的高杠杆实操
- 内容选择标准：只选"理解概念后，10 分钟内能动手、立刻见效"的操作
- 涵盖主题（按前面节点组织）：
  - System Instructions 实操：CLAUDE.md / AGENTS.md 的写法
  - Hooks 实操：配置通知 hook、安全拦截 hook
  - 知识喂养实操：项目文档的组织方式
  - 给 Agent 下任务的正确姿势：需求先行、小步快跑
- 不做什么：不覆盖所有节点，不做全面操作手册，不做工具对照表
- 双语同步

## 贯穿全篇的主线

每个节点都显式关联回「上下文」这条主线：

| 节点                | 上下文角色                             |
| ------------------- | -------------------------------------- |
| 上下文              | 第一原则本身                           |
| 三角关系            | 谁在操作上下文                         |
| System Instructions | LLM 收到的第一份上下文                 |
| 内置工具            | 工具定义 + 返回值 = 上下文             |
| MCP                 | 外部工具，同样进入上下文               |
| Slash Commands      | 按需注入的上下文                       |
| Skills              | 动态注入的 System Instructions         |
| CLI Tools           | 外部 CLI 工具输出直接成为上下文        |
| Hooks & Plugins     | 在上下文流动节点上拦截和修改           |
| 知识喂养            | 统一回顾：所有知识如何进入上下文       |
| 编排模式            | 上下文如何在多步骤/多分支间流动        |
| Sub Agent           | 创造全新上下文（隔离）                 |
| Eval/验证           | 验证结果 = 反馈上下文                  |
| Human-in-the-loop   | 人决定上下文的最终走向                 |
| Peer-to-Peer Agents | 上下文如何在平级 agent 之间双向流动    |
| In Practice         | 把上下文管理的概念落地到具体工具操作   |

## 待定事项

- 页面粒度：等内容填充后再决定拆合
- Sidebar 分组：等节点内容确定后再设计
- Slides 风格：Phase 3 范围
- "怎么给 agent 下任务"子项的最终位置：暂挂节点 2，可能调整
- "认知债务"子项的最终位置：暂挂节点 12，可能独立
- "可靠性 & 错误恢复"子项的最终位置：暂归节点 11，可能调整
