# 行业洞见素材库 — Phase 1 参考

> 来自 12 组并行研究 agent 的完整发现（A-L）。按来源分类，附来源标注。
> Phase 2 内容填充时可按节点引用对应段落。

---

## 来源 A：Steve Yegge + Andrej Karpathy

### Steve Yegge

**洞见 1：上下文是生产力的瓶颈，AI 编程的关键是让模型"知晓代码库"**

- 传统 IDE/静态索引无法满足 LLM 需要的上下文密度，AI coding 要把"全局代码语境 + 开发者意图 + 历史变更"喂给模型，才能减少幻觉与重写轮子。
- 关联节点：Context、System Instructions、Skills
- 来源：博客《AI Is Eating Software Development》（约 2024 Q1）、Sourcegraph/Cody 博文与访谈（2024）

**洞见 2：工具链要"可组合"且"可记忆"**

- LLM 需要可调用的工具（搜索、重构、测试），并把调用后的状态回写到"可共享的上下文"中；否则每次都是无记忆的 stateless 调用。
- 关联节点：Tools、Commands、MCP、Sub-agents
- 来源：Cody 产品反思文《Cody: Autocomplete Was Just the Start》（约 2024 Q2）

**洞见 3：多 agent 协作需要"角色隔离 + 共享事实库"**

- 不同专长的 agent 应有清晰的角色/系统指令，协作通过共享的事实（project graph、codebase map）而非共享的 prompt。
- 关联节点：Actors、System Instructions、Context、Sub-agents
- 来源：博客/演讲中对"协作式 Cody"的设想（2024 下半年）

**上下文论述要点**：

- 强调"全局代码索引 + 变更历史 + 需求描述"构成有效上下文
- 反对"只靠大模型参数记忆"，主张外部检索与持久记忆层
- Prompt 更像接口契约，强调边界与责任，而非冗长咒语

---

### Andrej Karpathy

**洞见 1："Software 2.0/3.0" = 用数据和上下文编程**

- 模型参数是"通用能力"，真实应用逻辑来自外部上下文（代码、文档、交互日志）；未来开发是"构造与过滤上下文"而非手写规则。
- 关联节点：Context、System Instructions、Skills
- 来源：演讲《State of GPT》（2023）、《Software 2.0》博文（2017，持续更新）

**洞见 2：Tool use 是让 LLM 成为"可微编排器"的关键**

- LLM 调工具 = 把大模型当控制器，外部工具完成可靠计算/检索；强化循环（Plan-Act-Observe）是提高正确率与可验证性的主路。
- "LLM as OS kernel / API router" 比喻
- 关联节点：Tools、Commands、MCP、Sub-agents
- 来源：X 推文串与公开讲座《LLM Agents》（2024 中）

**洞见 3：多 agent 协作要有"调度与记忆"**

- 多 agent 需要角色化（planner/worker/critic）+ 共享记忆；否则只是费用翻倍的噪声。
- 关联节点：Actors、Sub-agents、Context、System Instructions
- 来源：X 推文讨论"self-play/self-debug loops"（2024）

**上下文论述要点**：

- "一切皆上下文"：模型推理质量主要取决于上下文构造
- 好的系统是"检索正确的 10-50 条事实"而不是"喂 200k token 文本"
- 提倡 RAG/可微检索作为默认路径；长上下文模型也需要"裁剪 + 结构化"
- Prompt 越像"接口与测试"越好，短而明确

---

## 来源 B：Gene Kim + Martin Fowler + Simon Willison

### Gene Kim

**洞见 1：AI 是"Jevons Paradox"式的放大器**

- 自动化越多，业务想做的事越多，反而需要更多开发者。
- 来源：LinkedIn 帖子（2026-02-09）

**洞见 2：价值流堵点在"上下文传递"与"合规/安全护栏"**

- AI 代码生成若不嵌入组织标准，会造成交付不稳。
- 来源：IT Revolution 指南《Unclogging the Value Stream》（2026-01-05）

**洞见 3："人本、价值导向"仍是第一性原则**

- People first, technology second
- 来源：Lean Summit 2026 预告

**上下文论述**：

- 将组织编码规范、合规清单作为"内嵌上下文"
- 把"标准作业程序"前置到提示词中，减少返工
- 安全与合规变成"默认上下文"而非事后审查

---

### Martin Fowler

**洞见 1："认知债务"风险**

- 把太多工作交给 LLM 后，团队对系统的理解可能流失，需要新的"理解内循环"。
- 来源：《Fragments: February 9》（2026-02-09）

**洞见 2：「上下文工程」是代理时代的核心技能**

- 可复用指令、工具接口、技能/服务注册表，都是上下文设计范畴。
- 来源：《Context Engineering for Coding Agents》（2026-02-05）

**洞见 3：企业需重构基座架构**

- 不仅是增加模型调用，而是为 agentic AI 时代重构基础设施。
- 来源：Thoughtworks Looking Glass 2026

**上下文分层模型（最重要贡献）**：

- Policy 层（指令/规范）
- State 层（任务/历史）
- Knowledge 层（RAG/检索）
- Tools 层（skills/MCP）

**其他要点**：

- "理解内循环"：在 agent 工作流中加入"总结+重构"步骤
- 对长任务引入"上下文检查点"减少漂移
- 将测试/重构视作"认知巩固"步骤

---

### Simon Willison

**洞见 1："上下文工程"胜于"prompt engineering"**

- 核心是填满上下文窗口的取舍与压缩，而非写花哨的单条提示。
- 来源：blog tags/prompt-engineering（2026-01）

**洞见 2：2026 预测**

- "LLMs 写好代码已成定论"
- "将出现一次代理安全灾难"
- "会真正解决沙盒化"
- 来源：《LLM predictions for 2026》（2026-01-08）

**洞见 3：CLI / 可控接口优先**

- 工具调用应优先 CLI 以提升成功率和可观测性，降低上下文成本。
- 来源：blog（2026-01-17）

**上下文预算四步法**：

- 写（Write）：构造有效的上下文
- 选（Select）：选择最相关的内容
- 压缩（Compress）：减少不必要的 token
- 隔离（Isolate）：防止不同任务的上下文互相污染

**安全要点**：

- 默认沙盒执行与速率/配额限制
- 可重放日志 + 最小权限 token + 文件系统隔离

---

## 来源 C：AI Coding Tools 创建者

### Cline（原 Claude Dev）

- **安全边界与可审计性**："AI 不是风险，差的架构才是"
- **"Primitives/CLI"哲学**：可组合原语，保持透明、可脚本化
- **持久 loop**：任务在 IDE/CLI/JetBrains/CI 间转移不丢上下文
- 来源：架构博文（2026-01-27）、CLI 博文（2025-10-15）

### Roo Code（Cline fork）

- 更强可配置性与本地/云解耦
- 30+ 模型支持、无厂商锁定
- 云端 Autonomous Agents（$5/h）面向无人值守 PR 流程
- 来源：HN 讨论（2025-02）、Ry Walker 研究（2026-02-09）

### Aider（Paul Gauthier）

- **"终端内结对编程"**而非全自治
- **repo map**：构建代码地图以提升上下文相关性
- 用户显式 /add 文件，减少幻觉与越权
- 自动 git commit 作为安全网
- 多聊天模式（code/architect/ask/help）
- 来源：Aider 文档

### Claude Code（Anthropic）

- **简单单环路优先可靠性**：while tool_use 循环
- 以顺序工具调用保证可预测、可审计，再通过 MCP 扩展
- Agent SDK 作为统一框架驱动代码/研究/多模态代理
- 来源：Anthropic 文档、Rubric Labs 解构文章（2026-02-10）

### Cursor（Anysphere）

- **"让 IDE 成为意图延伸"**
- 大规模自治多代理：数千 agent 一周
- shadow workspaces 避免污染主仓
- 语义搜索/嵌入索引减少提示体积
- 锁/协调/并行计划机制
- 来源：Cursor blogs（2026-01-14、2026-02-05）

---

## 来源 D：OpenCode + Oh My OpenCode + Swyx + LangChain

### OpenCode

- 终端优先、多前端（TUI/CLI/IDE/Web）、多模型（75+ providers）
- 隐私优先（不持久化代码/上下文）
- 会话/消息/工具统一事件总线
- 配置可分层合并（全局+项目）
- 来源：OpenCode 文档、DeepWiki 索引

### Oh My OpenCode

- **Context Continuity**：/handoff 将子代理工作记忆与产物打包传递
- Todo/Continuation 机制保持长流程不中断
- Sisyphus 主编排 + Planning Triad（Prometheus/Metis/Momus）
- 特化子代理（Hephaestus/Oracle/Librarian）
- Atlas Hook 统一进度/状态
- 来源：DeepWiki 架构章节、v3.4.0 发行说明

### Swyx (Shawn Wang)

- **"Scaling without Slop"**：最小化粘合代码与上下文泄漏
- 上下文视作"数据产品"——版本化 prompt + input schema + tool schema
- 可回放（replay）与对齐日志
- 小而专的 tools + 判断/路由节点（router agents）
- 来源：Latent Space（2026-01-23）、Maven AI Engineering 课程

### LangChain / LangGraph

- **有状态图替代线性链**：节点 = 工具/模型/控制逻辑，边 = 条件与循环
- Checkpoint/Resume 让长流程不中断
- 子任务拆为子图
- Guard/Interrupt 节点控制人机回路
- 来源：Medium/TowardsAI 文章（2026-01）

---

## 来源 E：Devin + Guillermo Rauch + Pieter Levels

### Cognition AI / Devin

- Agent-native IDE + 内置知识系统（Search、Wiki、并行实例）
- **"需求清晰、可验证"的任务表现最佳**，PR 合并率 ~67%
- 在软技能、需求模糊和跨团队协作场景易失误
- 来源：Cognition 官方博客（2025-04-03、2025-11-14）、Ry Walker 研究（2026-02-09）

### Guillermo Rauch / Vercel v0

- 从"生成原型"转向"接入生产 90% 问题"
- **极短反馈回路 + 约束模板 + 错误最少呈现**
- Git 集成 + 环境/密钥/后端连接
- 来源：VentureBeat（2026-02-03）、LinkedIn 帖子、ChatPRD 访谈（2026-02-04）

### Pieter Levels / "vibe coding"

- **核心**："描述-生成-运行-再提示"的高节奏循环
- 适合个体/独立开发者的极快探索与变现
- **局限**：缺乏测试、规范和上下文持久化，长任务稳定性差
- **悖论**："It works best for those who do not need it"
- 来源：HackMD 指南（2026-01-28）、DevClass（2025-03-26）

---

## 来源 F：Kent Beck + Anthropic + OpenAI

### Kent Beck

- **"让模型像我一样但更好"**：在提示里加入个性化风格基准
- 仍遵循"红-绿-重构"，但把 AI 视为加速器
- **上下文是新的设计杠杆**：提示 + 现有代码/测试 = "工程化的上下文包"
- 用最小可验证实验逼近目标
- 来源：Substack《Taming the Genie: "Like Kent Beck"》

### Anthropic《Building effective agents》

- **官方模式**：简单、可组合的循环（思考→选工具→执行→观察→再思考）
- "先用最小 orchestrator + 明确工具描述"，过度框架化是常见反模式
- 上下文管理：系统指令 + 近期对话 + 检索结果分层，长任务用摘要/压缩
- 评估：多轮 eval、回放与分层指标（《Demystifying evals for AI agents》）
- 来源：anthropic.com/research/building-effective-agents

### OpenAI Agents Guide

- Responses API 统一"指令 + 工具 + 状态"
- **Server-side compaction** 与 conversation state 管理
- **Skills 白名单** 限定可调用工具
- 高风险操作配合 webhooks + human checkpoints
- **Background mode** 持久运行长任务
- 来源：platform.openai.com/docs/guides/migrate-to-responses

---

## 来源 G：AI 编码工具创建者（补充）

### Saoud Rizwan — Cline（原 Claude Dev）

**洞见 1：Plan + Act 把"聊天写代码"变成可执行工作流**

- Cline 把交互从"连续对话"切成两个阶段：先产出明确的计划（Plan），再按步骤落地执行（Act），降低上下文漂移和返工。
- 关联节点：2 三角关系
- 来源：Cline: The Open Source Code Agent — with Saoud Rizwan（Latent.Space，2025）

**洞见 2：把 System Prompt 当作工具 API 规范**

- Cline 将 tool 列表写进 System Prompt，并强调它既是"接口说明书"也是"使用手册"，让模型以调用工具的方式逐步推进任务，而不是一次性生成大段代码。
- 关联节点：3 System Instructions
- 来源：Chapter 4: System Prompt Advanced（Cline Learn，2025）

**洞见 3：用真实工程场景做 benchmark，避免"玩具题"**

- Cline 提出 cline-bench，目标是用真实开源项目的开发任务构造高保真评测/训练环境，反对过度依赖 LeetCode 式小题。
- 关联节点：8 Eval/验证
- 来源：Introducing cline-bench: A Real-World, Open Source Benchmark for Agentic Coding（Cline Blog，2025）

### RooCodeInc 团队 — Roo Code（Cline fork）

**洞见 1：用"Custom Modes/角色"把 agent 行为产品化**

- Roo Code 把 agent 能力拆成可配置的"模式/角色"（如 QA、PM、架构师等），用同一套工具调用能力服务不同任务范式，降低用户写长提示词的负担。
- 关联节点：9 Sub-agents
- 来源：RooCodeInc/Roo-Code GitHub README（检索于 2026-02）

**洞见 2：多代理叙事的核心其实是权限与边界**

- "一整个 dev team"这类表达背后，关键在于给每个模式限定工具权限/可见上下文，避免代理越权（例如随意删文件、跑危险命令）。
- 关联节点：4 内置工具(Tools)
- 来源：RooCodeInc/Roo-Code GitHub README（检索于 2026-02）

### Sid Sijbrandij / Scott Breitenother — Kilo Code

**洞见 1：模型/供应商解耦是开源 agent 的长期护城河**

- Kilo 公开强调不锁定单一模型或供应商，并把这点作为商业化与用户信任的基础。
- 关联节点：5 MCP
- 来源：Kilo, an open source coding agent, bets on subscriptions…（Forkable，2026）

**洞见 2：计费/限流策略会直接改变开发者的工作流体验**

- Kilo 认为"限流/硬上限"会在你进入心流时随机打断；因此选择更透明的成本呈现与订阅设计，而不是让限制看起来"像随机故障"。
- 关联节点：0 介绍
- 来源：Kilo, an open source coding agent, bets on subscriptions…（Forkable，2026）

### Boris Cherny — Claude Code（Anthropic）

**洞见 1：Claude Agent SDK 是把"Claude Code 的工作方式"抽象成可复用 harness**

- 官方把 Claude Code 作为内部生产力工具的经验沉淀到 SDK：把"计划—行动—验证"的 agent loop 做成可复用组件，支持开发者构建自己的 agents/skills。
- 关联节点：9 Sub-agents
- 来源：Building agents with the Claude Agent SDK（Anthropic Engineering，2025）

**洞见 2：Claude Code 从 terminal 工具演进为多入口协作层**

- Boris 提到 Claude Code 起步于终端，但随后扩展到 Desktop、Web、移动端、IDE、GitHub、Slack 等入口；这类"多表面"意味着同一套 agent 能力要适配不同权限与上下文供给方式。
- 关联节点：4 内置工具(Tools)
- 来源：Boris Cherny Threads 帖子（2026-02）

### Michael Truell — Cursor（Anysphere）

**洞见 1："Taste"变得更重要：人负责取舍，模型负责产出**

- Cursor 的公开访谈反复强调：当 AI 能写出大量代码时，决定"写什么、不写什么、怎么组织"才是区分优秀工程师的能力。
- 关联节点：0 介绍
- 来源：Cursor CEO: Going Beyond Code, Superintelligent AI Agents…（YC 访谈文字稿，2025）

**洞见 2：Describe-and-build 不等于放弃控制权**

- Cursor 认为 AI 生成占比上升（访谈中提到真实代码库里 AI 贡献大量提交行），但专业开发仍要阅读、评审、约束边界，避免"把大脑外包"。
- 关联节点：2 三角关系
- 来源：Cursor CEO: Going Beyond Code, Superintelligent AI Agents…（YC 访谈文字稿，2025）

### Dax Raad — OpenCode（SST）

**洞见 1：终端/编辑器内闭环，减少"切出—贴回"的摩擦**

- Dax 解释做 OpenCode 的动机：原先要从编辑器切到浏览器提问、粘贴代码、等回复、再复制回编辑器，这个循环频繁且破坏心流；因此做 terminal-first 的 agent 体验。
- 关联节点：6 Commands
- 来源：Building AI agents, open code, and open source: A conversation with Dax（Baseten Blog，2025）

**洞见 2：对"跑分"保持怀疑：产品质量常被 benchmark 误导**

- Dax 在访谈中提到 benchmarks 容易误导真实体验，实际效果取决于工具链、交互设计与上下文组织，而不只是模型分数。
- 关联节点：8 Eval/验证
- 来源：Building AI agents, open code, and open source: A conversation with Dax（Baseten Blog，2025）

### YeonGyu Kim — Oh My OpenCode

**洞见 1：把编排（orchestration）写成"可操作的模式切换"**

- oh-my-opencode 把快速执行的 ultrawork（ulw）与更审慎的 Planner（如 Prometheus 模式）做成用户可显式触发的工作方式，减少用户"靠口头描述让 agent 自己悟"的不确定性。
- 关联节点：9 Sub-agents
- 来源：Oh My OpenCode Overview（code-yeongyu/oh-my-opencode，GitHub 文档，检索于 2026-02）

**洞见 2：工具调用的确定性很重要，文档甚至会指定用 curl 而不是 WebFetch**

- 安装文档明确提醒 LLM agent 用 `curl` 拉取原文，避免 WebFetch 摘要化导致参数/标志丢失；这属于"为 agent 写文档"而不是"为人写文档"。
- 关联节点：4 内置工具(Tools)
- 来源：Installation guide（code-yeongyu/oh-my-opencode/docs/guide/installation.md，检索于 2026-02）

### Varun Mohan — Windsurf / Codeium

**洞见 1：同一 agent 提供 Ask / Plan / Code 三种模式，本质是权限与工具集的切换**

- Windsurf 的 Cascade 把任务分成只搜索的 Ask、先规划的 Plan、可执行改动的 Code；让用户用"模式"表达风险偏好与协作节奏。
- 关联节点：4 内置工具(Tools)
- 来源：Cascade Modes（Windsurf Docs，检索于 2026-02）

**洞见 2：做 agentic IDE 先要解决工程约束：延迟、工具可靠性与可验证性**

- Windsurf 的公开访谈聚焦于构建 AI-native IDE 的工程难点，包括 LLM latency、在真实代码库里稳定执行多步任务等。
- 关联节点：8 Eval/验证
- 来源：Building Windsurf with Varun Mohan（The Pragmatic Engineer，2025）

### Scott Wu — Devin / Cognition AI

**洞见 1：代理要在 sandbox 里拥有"人类开发者同款工具"**

- Cognition 描述 Devin 的核心能力之一是：在沙盒计算环境里使用 shell、editor、browser 来完成端到端工程任务，而不是停留在"只生成代码片段"。
- 关联节点：4 内置工具(Tools)
- 来源：Introducing Devin, the first AI software engineer（Cognition Blog，2024）

**洞见 2：长程任务的关键在于"计划—执行—反馈"的循环，而不是一次生成**

- Cognition 强调 Devin 通过长程推理与规划、持续回忆上下文、修复错误并与用户协作来推进任务。
- 关联节点：2 三角关系
- 来源：Introducing Devin, the first AI software engineer（Cognition Blog，2024）

### Thomas Dohmke — GitHub Copilot

**洞见 1：把 agent 放进 GitHub 工作流里，天然带上审计与保护机制**

- GitHub 介绍 Copilot coding agent：在 GitHub Actions 里启动安全沙盒、克隆仓库、在草稿 PR 中持续提交，并受 branch protection 等策略约束，最终仍由人批准合并。
- 关联节点：8 Eval/验证
- 来源：GitHub Introduces Coding Agent For GitHub Copilot（GitHub Newsroom，2025）

**洞见 2：Agentic DevOps loop 需要"控制层"而不只是模型**

- GitHub 的叙事重点是 control layer：安全、责任边界、与现有协作/审批链路融合，避免 agent 变成不可控的机器人。
- 关联节点：2 三角关系
- 来源：GitHub Introduces Coding Agent For GitHub Copilot（GitHub Newsroom，2025）

### Eric Simons — Bolt.new / StackBlitz

**洞见 1：把"运行与调试"前移到对话里，减少环境搭建门槛**

- Bolt.new 的发布演讲强调：在浏览器内 prompt 生成应用、实时运行、边出错边调试，并可直接部署；用户不必先搭本地环境。
- 关联节点：4 内置工具(Tools)
- 来源：WebContainers & AI: Introducing bolt.new（ViteConf Keynote，2024）

**洞见 2：Agent 体验很依赖执行环境（WebContainers）而非单纯提示词**

- Bolt.new 之所以能"边聊边跑"，核心来自可控的浏览器执行容器；这提醒我们 agentic coding 的一半是系统工程。
- 关联节点：4 内置工具(Tools)
- 来源：WebContainers & AI: Introducing bolt.new（ViteConf Keynote，2024）

### Anton Osika — Lovable（原 GPT Engineer）

**洞见 1：Vibe coding 的目标用户是"有想法但缺技术栈细节的人"**

- Anton 在公开访谈中把 vibe coding 描述为把想法快速变成可运行软件的方式，让非工程背景的人也能构建产品原型。
- 关联节点：0 介绍
- 来源：Lovable's Anton Osika on turning ideas into software without coding（Pioneers of AI，2025）

**洞见 2：更偏好 generalists + agents 的组织形态**

- 相关采访/报道中提到 Lovable 在用人上偏好通才（generalists），因为产品迭代更像"用 agent 快速试错 + 人类做判断"。
- 关联节点：9 Sub-agents
- 来源：Lovable CEO Anton Osika says vibe-coding frees…（Business Insider，2025）

### Nate Lipp / Ty Dunn — Continue.dev

**洞见 1：Context engineering 是决定成败的学科，"坏上下文比没上下文更糟"**

- Ty Dunn 把"context poisoning"当作失败根因：无关/过期信息会让模型自信地产生错误并扩散到代码库。
- 关联节点：1 上下文(Context)
- 来源：Ty Dunn's Context Engineering for AI Coding（self.md，2026）

**洞见 2：用 Context Providers 把上下文供给做成显式、可组合的能力**

- Continue 通过 `@File / @Git Diff / @Repository Map / @Problems …` 等 providers，把"给模型什么信息"变成可选择的构件，而不是隐式猜测。
- 关联节点：1 上下文(Context)
- 来源：Context Providers（Continue Docs，检索于 2026-02）

**洞见 3：把 agent 变成"持续运行的后台流程"，而不是一次性对话**

- Continue 将 Agents 定义为可在后台持续运行的 cloud agents（适合长任务、事件驱动），并区分 IDE agents（同步交互）与 cloud agents（异步自治）。
- 关联节点：9 Sub-agents
- 来源：Introducing Agents: Run Continuous AI in the Background（Continue Blog，2025）

### Amjad Masad — Replit

**洞见 1：把"写代码"目标替换为"保持在创作空间"，减少 accidental complexity**

- Amjad 在访谈中谈到希望用户不必写代码，把更多精力放在创意与意图表达；并认为大量编码工作是琐碎细节与偶然复杂度。
- 关联节点：0 介绍
- 来源：Amjad Masad on vibe coding, AI agents, and the end of boilerplate（Possible.fm Transcript，2026）

**洞见 2：让业务角色能直接做出可演示的软件原型，改变组织沟通方式**

- 访谈里举例 CEO 可以"vibe code 一个东西带进会议展示"，把需求沟通从文档/口头转成可运行原型。
- 关联节点：2 三角关系
- 来源：Amjad Masad on vibe coding, AI agents, and the end of boilerplate（Possible.fm Transcript，2026）

### Quinn Slack — Sourcegraph / Cody

**洞见 1：代码 AI 的瓶颈是"上下文可得性"，不是 LeetCode 能力**

- Sourcegraph 公开文章明确区分：没有足够 repo 上下文的 AI，最多能做小题；要在真实工程里改代码，必须具备可扩展的 context awareness。
- 关联节点：1 上下文(Context)
- 来源：How Cody provides remote repository awareness…（Sourcegraph Blog，2024）

**洞见 2：Search 与 AI chat 会融合为"一个输入框解决问题"**

- Quinn 在播客/视频中把用户需求描述为"一个 box，输入问题就帮你解决"，这解释了 Cody 把 code search 与对话式编程捏在一起的产品路径。
- 关联节点：4 内置工具(Tools)
- 来源：Quinn Slack: Sourcegraph, AI Coding, and Cody（Around the Prompt / YouTube，2024）

### Scott Dietzen — Augment Code

**洞见 1：没有上下文就只能 vibe；大代码库需要语义检索而不是塞满 context window**

- Scott 在公开讨论中指出：把千万行代码硬塞进上下文既贵（计算开销随上下文长度恶化）也更难找到关键片段，因此必须解决"选对上下文"的问题。
- 关联节点：1 上下文(Context)
- 来源：Scott Dietzen LinkedIn 帖子《How Augment Code solved…》（2025）

**洞见 2：把语义上下文能力通过 MCP 外部化，给任何 agent 复用**

- Augment 推出 Context Engine MCP，声称在多种 agent（Claude Code/Cursor/Codex）上能显著提升质量，并把"上下文架构"当作与模型同等重要的变量。
- 关联节点：5 MCP
- 来源：Augment's Context Engine is now available for any AI coding agent（Augment Blog，2026）

### Harjot Gill — CodeRabbit

**洞见 1：把代码评审当作 AI 时代的 guardrail，而不是事后挑刺**

- CodeRabbit 的定位是让 PR review 变成持续的质量门禁：在开发者工作流里提前暴露常见错误、建议测试与改进点。
- 关联节点：8 Eval/验证
- 来源：CodeRabbit Adds CLI Support to Code Review Platform Based on AI（DevOps.com，2025）

**洞见 2：为减少"AI slop"，先对齐意图再写代码**

- CodeRabbit Issue Planner 的叙事是：在 issue/需求阶段把计划讲清楚，以降低返工与低质量生成物，并帮助扩展到更强的 coding agents。
- 关联节点：8 Eval/验证
- 来源：CodeRabbit Introduces CodeRabbit Issue Planner…（Business Wire，2026）

**洞见 3：MCP 用于把外部需求/文档注入评审与生成流程**

- DevOps.com 报道提到 CodeRabbit 增加 MCP client，用于从外部系统抓取需求与工程文档作为额外上下文。
- 关联节点：5 MCP
- 来源：CodeRabbit Adds CLI Support to Code Review Platform Based on AI（DevOps.com，2025）

### Xingyao Wang / Robert Brennan — OpenHands

**洞见 1：用"SDK + CLI + GUI + Cloud"把研究型 agent 平台产品化**

- OpenHands README 把能力拆成可组合 SDK、类似 Claude Code 的 CLI、类 Devin 的 GUI、以及托管 Cloud；同一套 agentic 技术支撑多种交互入口。
- 关联节点：4 内置工具(Tools)
- 来源：All-Hands-AI/OpenHands README（GitHub，检索于 2026-02）

**洞见 2：可复现的执行环境（ephemeral workspace）是规模化 agent 的前提**

- OpenHands Software Agent SDK 强调 agents 可在本地或临时工作区（Docker/K8s）运行；这在工程上对应隔离、回放、并发扩展。
- 关联节点：4 内置工具(Tools)
- 来源：OpenHands/software-agent-sdk GitHub README（检索于 2026-02）

**洞见 3：开源动机来自"反闭源 walled garden"，并用论文定义平台边界**

- OpenHands 官方博客回溯：Devin demo 引发期待也带来担忧，社区因此构建开放平台；同时以论文形式定义其"generalist agents"框架与评测方式。
- 关联节点：0 介绍
- 来源：OpenHands: From README to open source movement（OpenHands Blog，2024）；OpenHands arXiv:2407.16741（2024）

### Killian Lucas — Open Interpreter

**洞见 1：把 LLM 变成"能在本机跑代码/控电脑"的接口层**

- Open Interpreter 的核心主张是自然语言控制计算机：让模型在你的机器上执行代码与命令，从而具备自我验证与迭代能力。
- 关联节点：4 内置工具(Tools)
- 来源：openinterpreter/open-interpreter GitHub README（2023）

**洞见 2：Local-first 能把隐私与可控性做成默认选项**

- 围绕 Open Interpreter 的介绍文章强调"尽量本地运行"的心智（相比纯云端），对个人/企业采纳的心理门槛更低。
- 关联节点：1 上下文(Context)
- 来源：What is Open Interpreter and its first 01 Light AI Device?（Machine Economy Press，2024）

---

## 来源 H：Agent 框架作者

### Rod Johnson（Embabel）

**洞见 1：用 GOAP 先规划，减少 LLM 编排的不确定性**

- 先用确定性的 GOAP 产出可解释 plan，再逐步执行 actions。
- 关联节点：9 Sub-agents
- 来源：AI for your Gen AI: How and Why Embabel Plans（2025）

**洞见 2：类型安全的 domain model 是企业 agent 的"地基"**

- 用强类型领域对象做 actions I/O，减少字符串协议与运行时错配。
- 关联节点：1 上下文(Context)
- 来源：Embabel Year-End Update: Building The Best Agent Framework（2025）

**洞见 3：MCP 解决工具接入，但仍需要 orchestration 层解决发现与可控**

- 仅有 MCP 不足以覆盖工具发现与业务系统集成下的可预测执行。
- 关联节点：5 MCP
- 来源：Embabel: A New Agent Platform For the JVM（2025）

### Harrison Chase（LangChain / LangGraph）

**洞见 1：生产级 agent runtime 的关键词是 control + durability**

- 少抽象换可控性；把长流程的状态持久化与可恢复执行当成核心能力。
- 关联节点：2 三角关系
- 来源：Building LangGraph: Designing an Agent Runtime from first principles（2025）

**洞见 2：用 graph/state 表达循环、分支与 interrupt**

- 把人类介入与回环当"一等公民"，避免线性 chain 变成难维护脚手架。
- 关联节点：9 Sub-agents
- 来源：Building LangGraph: Designing an Agent Runtime from first principles（2025）

### João Moura（CrewAI）

**洞见 1：落地失败多半是架构问题：太硬或太松**

- 主张"确定性 backbone + 在关键点引入智能"，兼顾可控与适配。
- 关联节点：2 三角关系
- 来源：How to build Agentic Systems: The Missing Architecture for Production AI Agents（2025）

**洞见 2：guardrails / memory / observability 要内建**

- 没有这些能力，问题通常在规模化后才集中暴露。
- 关联节点：8 Eval/验证
- 来源：How to build Agentic Systems: The Missing Architecture for Production AI Agents（2025）

### Chi Wang（AutoGen）

**洞见 1：把 multi-agent conversation 当作可编程的协作协议**

- 通过"可对话的 agent + 可编程交互规则"来定义协作与分工，而不是只写 prompt。
- 关联节点：9 Sub-agents
- 来源：AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation（2023）

**洞见 2：human-in-the-loop 应是运行模式，而不是 UI 补丁**

- 把人类输入/参与设计为可组合的模式，适配不同风险等级任务。
- 关联节点：8 Eval/验证
- 来源：AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation（2023）

### Omar Khattab（DSPy）

**洞见 1：从"写 prompt 模板"转向"写可优化的程序"**

- 用模块化与编译优化，把质量提升变成围绕 metric 的系统优化问题。
- 关联节点：8 Eval/验证
- 来源：DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines（2023）

**洞见 2：把 pipeline 统一成可组合的 text transformation graph**

- 让复杂 RAG/推理/loop 更易组合复用，减少一次性脚手架。
- 关联节点：2 三角关系
- 来源：DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines（2023）

### Samuel Colvin（PydanticAI）

**洞见 1：结构化输出要"类型 + 校验"，否则 agent 只是在赌**

- 把解析、校验、错误处理做成默认路径，降低生产事故。
- 关联节点：3 System Instructions
- 来源：Why we built PydanticAI, and why you might care（2024）

**洞见 2：agent 工程需要可观测性闭环**

- tracing/metrics 不只是运维指标，也是迭代质量的输入。
- 关联节点：8 Eval/验证
- 来源：Agent Engineering with Pydantic + Graphs — with Samuel Colvin（2025）

### Jerry Liu（LlamaIndex）

**洞见 1：naive RAG 只够 demo，复杂问题需要 agentic layer**

- 在 routing / query planning / tool use / loop 等层面加 agent，按复杂度渐进增强。
- 关联节点：9 Sub-agents
- 来源：Jerry Liu talk on RAG and agents（YouTube，2024）

**洞见 2：agentic RAG 走向生产离不开可观测与控制点**

- 否则很难定位错检索、错路由、上下文污染等失败模式。
- 关联节点：8 Eval/验证
- 来源：Jerry Liu talk on RAG and agents（YouTube，2024）

### Toran Bruce Richards（AutoGPT）

**洞见 1：把 loop / state / memory / tools 拆成清晰模块边界**

- 用工程化架构笔记明确组件职责，才能让实验 agent 演进为可维护系统。
- 关联节点：2 三角关系
- 来源：AutoGPT core ARCHITECTURE_NOTES.md（v0.4.5，2023）

**洞见 2：开源的目标是"能力扩散"，避免黑盒垄断**

- 强调开放协作与可访问性。
- 关联节点：0 介绍
- 来源：Fireside Chat: Toran Bruce Richards, Founder of AutoGPT（OpenUK，2025）

### Yohei Nakajima（BabyAGI）

**洞见 1：最小"任务循环"框架的价值在启发，不是生产**

- BabyAGI 作为实验项目，把规划→执行→生成新任务的闭环拆到最简单。
- 关联节点：0 介绍
- 来源：yoheinakajima/babyagi（GitHub，2023）

**洞见 2：task management prompt 的结构决定可控性**

- BabyBeeAGI 主要通过更结构化的任务管理提示来提升分析/综合质量。
- 关联节点：3 System Instructions
- 来源：BabyBeeAGI: Task Management and Functionality Expansion on top of BabyAGI（2023）

### Aymeric Roucher / Thomas Wolf（Hugging Face smolagents）

**洞见 1：用 CodeAgent 写代码块，比 JSON tool calls 更自然**

- 把多步工具调用合并进一段可执行代码，减少碎片化与中间态出错。
- 关联节点：4 内置工具(Tools)
- 来源：Introducing smolagents: simple agents that write actions in code（Hugging Face Blog，2024）

**洞见 2：框架要极简，并默认考虑安全执行与评估**

- 强调 low abstraction（~1000 LOC）与 sandbox 执行。
- 关联节点：8 Eval/验证
- 来源：Introducing smolagents: simple agents that write actions in code（Hugging Face Blog，2024）

### Kye Gomez（Swarms）

**洞见 1：multi-agent 先选"沟通拓扑"，再谈能力堆叠**

- hierarchical / concurrent 等拓扑决定协调成本与故障模式。
- 关联节点：9 Sub-agents
- 来源：Multi-Agent Architectures（Swarms Docs，无日期）

**洞见 2：agent / memory / tools / telemetry 要模块化可插拔**

- 先把组件边界做清楚，才能支持规模化组合与演进。
- 关联节点：4 内置工具(Tools)
- 来源：Understanding Swarms Architecture（Swarms Docs，无日期）

### Vaibhav Gupta（BAML / BoundaryML）

**洞见 1：结构化输出是把失败率打下来的工程手段**

- 用类型系统/structured outputs 把输出变成可验证对象，不接受"LLM 天生会错"的借口。
- 关联节点：8 Eval/验证
- 来源：Supercharged Structured Outputs for AI Agents（O'Reilly / AI Superstream，2026）

**洞见 2：Prompt 是代码资产，需要语法与工具链（BAML）**

- 目标是把散落字符串提示变成可维护、可复用、可演进的工件。
- 关联节点：6 Commands
- 来源：AI Agents Need a New Syntax（BoundaryML Blog，无日期）

### Luyu Zhang / John Wang（Dify）

**洞见 1：平台价值在"可组合的 workflow engine"，不是少写几行代码**

- Workflow/Chatflow 做统一底座，把常用能力节点化并可发布为 API。
- 关联节点：2 三角关系
- 来源：Dify Docs - Key Concepts（2025）

**洞见 2：把"发布为 MCP server"当成产品能力边界**

- 这会倒逼节点粒度、权限与发布形态的设计。
- 关联节点：5 MCP
- 来源：Dify Docs - Key Concepts（2025）

**洞见 3：open/neutral/transparent 是与巨头竞争的信任策略**

- 强调开放与透明带来的开发者信任与生态协作。
- 关联节点：0 介绍
- 来源：Luyu Zhang LinkedIn Post: "Does this product named Coze look familiar? …"（2023）

### Henry Heng（Flowise）

**洞见 1：可视化编排也要支持 loop / conditional / human-in-the-loop**

- v2.0 把 sequential agentic workflow（回环、条件、人类介入、Plan&Execute）做成核心能力。
- 关联节点：9 Sub-agents
- 来源：Release flowise@2.0.0 · FlowiseAI/Flowise（2024）

**洞见 2：production use cases + evaluation 要提前进入产品叙事**

- 公开分享中直接提到生产使用与评估，目标是从"搭积木 UI"走向工程闭环。
- 关联节点：8 Eval/验证
- 来源：ZhenJing Heng (Henry) LinkedIn Post: "Flowise … production use cases and evaluation."（2023）

---

## 来源 I：思想领袖 & 学术

### Andrew Ng

**洞见 1：用"多次提示"的工作流替代一次性生成**

- 与其让 LLM 一次性吐出最终答案，不如把任务拆成多轮提示，让模型有机会自我修正，输出质量会明显上升。
- 关联节点：1 上下文(Context)
- 来源：Four AI Agent Strategies That Improve GPT-4 and GPT-3.5 Performance（2024）

**洞见 2：四种常用 agentic 设计模式可直接复用**

- Reflection、Tool Use、Planning、Multi-agent collaboration 是最常见、也最容易组合的模式集合；复杂任务往往靠组合而不是单点技巧。
- 关联节点：9 Sub-agents
- 来源：Four AI Agent Strategies That Improve GPT-4 and GPT-3.5 Performance（2024）

**洞见 3：Reflection 的本质是把"自我批评"自动化**

- 自动生成批评/改进意见，再让模型重写一次，往往以很小的工程代价换到意外的增益。
- 关联节点：8 Eval/验证
- 来源：Agentic Design Patterns Part 2: Reflection（2024）

### Ethan Mollick

**洞见 1：agentic AI 时代的瓶颈在"管理"，不在模型**

- 一旦 AI 能做更完整的任务，关键变成如何委派、监督、复核与定责；组织需要把"管理 AI"当作新能力。
- 关联节点：9 Sub-agents
- 来源：Management as AI superpower（2026）

**洞见 2：现实任务里，模型常输在"不按要求交付"**

- 在更贴近工作的评测里，失败原因经常不是幻觉，而是格式、结构、指令遵循差；这类问题更需要流程化验收与反馈回路。
- 关联节点：8 Eval/验证
- 来源：Real AI Agents and Real Work（2025）

### Jim Fan

**洞见 1：Foundation Agent 的规模化维度不是"语料"，而是"现实"**

- 他的表述里，Foundation Agent 需要在大量不同"世界/环境"中学习行动；掌握 10,000 个模拟世界，才可能泛化到物理世界（第 10,001 个）。
- 关联节点：4 内置工具(Tools)
- 来源：My TED talk is finally live!! I proposed the recipe for the "Foundation Agent"（2024，LinkedIn）

**洞见 2：三条扩展轴：skills / embodiments / realities**

- "通用"不只是一堆任务（skills），还要能控制不同形态的身体（embodiments），并适应不同机制与规则的环境（realities）。
- 关联节点：2 三角关系
- 来源：The Foundation Agent should be scaled across 3 axes…（2024，LinkedIn 引用贴）

### Lilian Weng

**洞见 1：经典 agent 架构可以拆成三块：Planning / Memory / Tool Use**

- Planning 负责拆解与反思迭代；Memory 提供短期上下文与长期外部记忆；Tool Use 让 agent 通过 API/程序与环境交互。
- 关联节点：1 上下文(Context)
- 来源：LLM Powered Autonomous Agents（2023）

**洞见 2：长期记忆通常意味着"外部存储 + 快速检索"**

- 仅靠上下文窗口不够稳定，常见做法是向量库/检索（如 MIPS）承载长期记忆，再把相关片段取回到 prompt。
- 关联节点：1 上下文(Context)
- 来源：LLM Powered Autonomous Agents（2023）

### Shunyu Yao

**洞见 1：ReAct 把"推理轨迹"和"行动"交织在一起**

- 通过交替生成 reasoning traces 与与环境交互的 actions，让模型用外部观察校正推理，减少纯 CoT 的"闭门造车"。
- 关联节点：4 内置工具(Tools)
- 来源：ReAct: Synergizing Reasoning and Acting in Language Models（2022，arXiv）

**洞见 2：闭环交互比一次性计划更抗不确定性**

- 重点不是先想完再做，而是做一步、看反馈、再更新计划；对网页/文本环境等开放式任务更稳。
- 关联节点：4 内置工具(Tools)
- 来源：ReAct: Synergizing Reasoning and Acting in Language Models（2022，Google Research Blog）

### John Yang / Carlos E. Jimenez

**洞见 1：Agent-Computer Interface（ACI）决定 agent 能否"像人一样用电脑"**

- 通过更简单、LM 友好的命令与反馈格式，显著提升 agent 浏览仓库、编辑文件、运行测试的成功率；这是一类"为 agent 设计的 IDE"。
- 关联节点：6 Commands
- 来源：SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering（2024，arXiv / NeurIPS 2024）

**洞见 2：真实 GitHub issue 是可持续的评测基准**

- SWE-bench 用真实 issue 评测修复能力，逼迫系统解决长上下文、工具调用、回归测试等工程难点。
- 关联节点：8 Eval/验证
- 来源：SWE-bench: Can Language Models Resolve Real-World GitHub Issues?（2023，arXiv）

### Dex Horthy

**洞见 1：多数"agent"卡在 70%-80%，根因是抽象层把可控性吃掉了**

- 为了继续提升质量，需要"own your prompts / own your control flow"，减少框架黑盒，才能定位为什么失败、哪里该加约束。
- 关联节点：3 System Instructions
- 来源：humanlayer/12-factor-agents（2025，GitHub）

**洞见 2：生产级 agent 更像软件工程，而不是更"agentic"的 loop**

- 可靠性来自可观测、可回放、可评测、可人工介入的系统设计，而非无限自循环。
- 关联节点：8 Eval/验证
- 来源：humanlayer/12-factor-agents（2025，GitHub）

### Adam Fourney / Saleema Amershi / Victor Dibia（Magentic-One）

**洞见 1：用 Orchestrator 做动态规划与委派，其他 agent 各司其职**

- Orchestrator 生成任务特定计划、分派给工具型/浏览型/编码型 agent，并在新观察出现后调整计划。
- 关联节点：9 Sub-agents
- 来源：Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks（2024，Microsoft Research / arXiv）

**洞见 2：通用多 agent 系统的关键能力是"从错误中恢复"**

- 复杂任务天然会偏航，系统需要显式的进度跟踪与纠错机制，而不是假设每一步都对。
- 关联节点：8 Eval/验证
- 来源：Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks（2024，arXiv）

### Shreya Rajpal

**洞见 1：把输出结构与质量标准"写进规格"，再让系统自动修复**

- RAIL 既定义期望的 JSON/字段类型，也定义失败时的动作（reask / filter / programmatically fix），把可靠性交给可执行约束。
- 关联节点：3 System Instructions
- 来源：Use Guardrails via RAIL（2025，Guardrails 文档）

**洞见 2：从 demo 到生产，核心是可验证与可治理**

- 她反复强调 LLM 的脆弱性与一致性问题，需要把验证、重试、监控与组织层面 buy-in 当成"第一等公民"。
- 关联节点：8 Eval/验证
- 来源：The Sequence Chat: Shreya Rajpal… About Ensuring the Safety and Robustness of LLMs（2023）

### Jason Liu（Instructor）

**洞见 1：结构化输出要靠"验证层"，不是祈祷模型听话**

- Instructor 用 Pydantic 做类型校验与约束，把 LLM 输出变成可解析、可失败重试的接口，而不是一次性文本。
- 关联节点：3 System Instructions
- 来源：GitHub - 567-labs/instructor（2026，README）

**洞见 2：把"重试/修复"标准化，才能让工具链稳定**

- 当输出不符合 schema 时自动 retries，让下游工具（解析、写库、调用函数）不必为脏数据兜底。
- 关联节点：4 内置工具(Tools)
- 来源：Instructor 官方文档（python.useinstructor.com，2026）

### Zach Lloyd（Warp）

**洞见 1：终端正在变成 agent 的工作台（ADE），不是命令行输入框**

- Warp 2.0 的定位是让开发者用"提示—审阅—协作"的方式驱动多个 agent，覆盖从编码到部署的全流程。
- 关联节点：6 Commands
- 来源：Introducing Warp 2.0: the Agentic Development Environment（2025，Warp Blog）

**洞见 2：多线程 agent 工作流需要"可介入的 UI"**

- 关键不是让 agent 全自动，而是让人随时接管、审阅 diff、重放步骤；工具形态决定了人控的成本。
- 关联节点：9 Sub-agents
- 来源：Warp 2.0: the Agentic Development Environment（2025，Latent Space 访谈）

---

## 来源 J：可观测性 / 评测基础设施

### Marc Klingen（Langfuse）

**洞见 1：把 LLM 调用当作"产品事件"，用同一套指标盯质量/成本/延迟**

- Langfuse 的定位更像给 LLM app 的"Mixpanel + tracing"：把每次调用、提示版本、用户会话串成可分析的数据。
- 关联节点：8 Eval/验证
- 来源：Langfuse - Open source observability and analytics for LLM Apps（2023）

**洞见 2：先把 trace 打通，再谈得上 debug agent / RAG 的根因**

- multi-step（RAG/agents）里，一次失败往往是某个 span 的输入/输出出了问题；trace 是评测、回放、告警的共同底座。
- 关联节点：4 内置工具(Tools)
- 来源：langfuse/langfuse（2023，GitHub）

### Jason Lopatecki / Aparna Dhinakaran（Arize AI / Phoenix）

**洞见 1：先有 tracing，才有可复现的 LLM eval 与定位**

- Phoenix 用 spans 记录 prompts、retrieval chunks、tool calls，把"为什么变差/变贵"落到具体步骤，而不是只看最终输出。
- 关联节点：8 Eval/验证
- 来源：LLM Tracing and Observability（2023，Arize AI / Phoenix）

**洞见 2：把 RAG/agent 的调试当作"分布式系统排障"**

- 把 token/cost/latency 与每一步的输入输出对齐，才能判断问题在模型、检索还是工具调用。
- 关联节点：8 Eval/验证
- 来源：LLM Tracing and Observability（2023，Arize AI / Phoenix）

### Justin Torre（Helicone）

**洞见 1：用"AI Gateway"把请求日志、成本、实验开关前置到基础设施层**

- 通过代理层统一接入多模型，把 observability（latency/cost/feedback）变成默认能力，而不是每个应用各埋一次点。
- 关联节点：4 内置工具(Tools)
- 来源：Helicone/helicone（2023，GitHub）

**洞见 2：对 agent 来说，tracing 的价值在"回放"而不只是看板**

- 一旦能把一次失败的链路（输入、模型输出、工具调用）完整复现，调试与评测才不会变成猜。
- 关联节点：8 Eval/验证
- 来源：Helicone/helicone（2023，GitHub）

---

## 来源 K：安全 / 治理

### Beth Barnes（METR）

**洞见 1：评估"危险自主能力"需要明确威胁模型，并给出可复现协议**

- METR 把目标聚焦在 autonomous systems 端到端完成高风险任务的能力，并把 protocol（流程、注意事项、版本化）作为评测的一部分。
- 关联节点：8 Eval/验证
- 来源：Example Protocol（2024，METR's Autonomy Evaluation Resources）

**洞见 2：把"复制/扩散"当作首要威胁路径来拆解，方便对齐 eval 维度**

- Rogue Replication Threat Model 把可能的行动链条拆开，便于把评测映射到具体能力点（比如自主获取资源、持久化等）。
- 关联节点：8 Eval/验证
- 来源：The Rogue Replication Threat Model（2024，METR）

### Dan Hendrycks（CAIS）

**洞见 1：把"极端风险"压缩成一句可复述的共识语句，方便进入治理议程**

- CAIS 的 Statement on AI Risk 试图把灭绝级风险与核战/疫情放到同一层级，让政策与行业讨论有共同锚点。
- 关联节点：8 Eval/验证
- 来源：Statement on AI Risk（2023，Center for AI Safety）

**洞见 2：安全讨论需要可执行的标准与检查点，而不只是原则口号**

- 他的路线更偏"设立门槛/标准化流程"，让评测与审计能落地到组织动作。
- 关联节点：8 Eval/验证
- 来源：Reducing Societal-scale Risks from AI（CAIS，safe.ai）

### Riley Goodside

**洞见 1：prompt injection 的本质是"数据通道被当成指令通道"**

- 只要把不可信文本（网页内容/用户输入/检索片段）直接拼进 prompt，模型就可能优先执行攻击者写进去的新指令。
- 关联节点：3 System Instructions
- 来源：Riley Goodside on Twitter（2022，Wayback Machine 归档）

**洞见 2：工程上最可靠的缓解是结构性隔离，而不是堆提示词**

- 把指令和数据分层（明确引用/转义/分隔符、最小权限工具调用、人工确认关键动作），比"再强调一次不要泄露"更稳。
- 关联节点：4 内置工具(Tools)
- 来源：Riley Goodside on Twitter（2022，Wayback Machine 归档）

### Johann Rehberger

**洞见 1：prompt injection 会同时打穿 CIA triad，尤其在自动工具调用场景**

- 他总结了现实漏洞如何影响保密性（数据外泄）、完整性（指令被篡改）、可用性（循环/阻断）；agent + tools 会放大冲击面。
- 关联节点：4 内置工具(Tools)
- 来源：Trust No AI: Prompt Injection Along The CIA Security Triad（2024，arXiv）

**洞见 2：间接注入常来自网页/文档等"外部内容"，因此默认要把检索视为不可信**

- 只要 agent 会读外部内容并把它当上下文，就要假设其中可能夹带指令，并对工具权限做最小化。
- 关联节点：1 上下文(Context)
- 来源：Indirect Prompt Injections in the Wild – Real World exploits and mitigations（2023，ekoparty）

---

## 来源 L：其他补充

### Jacob Jackson（Supermaven）

**洞见 1：代码助手体验首先是延迟，其次才是"更大模型/更长上下文"**

- 他把多家工具的端到端延迟拉出来对比，认为交互速度决定了开发者是否会把补全当作默认动作。
- 关联节点：4 内置工具(Tools)
- 来源：Introducing Supermaven, the first code completion tool with a 300,000-token context window（2024）

**洞见 2：长上下文必须用基准证明"能利用"，而不只是"能塞进去"**

- 用 needle-in-a-haystack + 不同位置深度测试，检查模型是否随位置衰减。
- 关联节点：8 Eval/验证
- 来源：Benchmarking Supermaven's Long-Context Capabilities（2024）

### Lucy Gao / Meng Zhang（TabbyML）

**洞见 1：把代码补全服务做成可自托管开源件，优先解决合规与代码外泄焦虑**

- Tabby 的核心是 self-hosted：团队自己跑模型与补全服务，IDE 只连内网端点，减少把上下文发到外部闭源平台的阻力。
- 关联节点：4 内置工具(Tools)
- 来源：TabbyML/tabby（2023，GitHub）

**洞见 2：开源在这里不只是"便宜"，而是可审计、可二次定制**

- 需要时能加自定义检索/权限/日志策略，把代码助手纳入现有工程规范。
- 关联节点：3 System Instructions
- 来源：TabbyML/tabby（2023，GitHub）

### Malte Pietsch（deepset / Haystack）

**洞见 1：框架层要"可组合"，让 RAG/agent 变成可替换的组件图**

- Haystack 2.0 强调 components + pipelines：检索、生成、工具调用按图组合，结构可读可控，便于调试与评测。
- 关联节点：4 内置工具(Tools)
- 来源：Haystack 2.0: The Composable Open-Source LLM Framework（2024）

**洞见 2：生产化的关键是把"连接器/组件契约"做稳定**

- 当组件接口稳定，可替换性才成立（换模型、换向量库、换检索策略），也更容易做回归测试。
- 关联节点：8 Eval/验证
- 来源：Haystack 2.0: The Composable Open-Source LLM Framework（2024）

### Shayak Sen（TruLens）

**洞见 1：把 eval 与实验追踪并到同一套记录里，才能让结论可复现**

- TruLens 主张同时记录链路 traces、质量度量与反馈，方便对比不同 prompt/chain/模型版本，而不是凭感觉选。
- 关联节点：8 Eval/验证
- 来源：Evaluate and Track your LLM Experiments: Introducing TruLens（2023）

**洞见 2：评估 agent 不能只看最终答案，中间的检索与工具步骤也要纳入**

- 当你能看到每一步拿了哪些上下文、调用了哪些工具，才知道问题出在哪一环。
- 关联节点：8 Eval/验证
- 来源：TruLens: Evals and Tracing for Agents（2023，trulens.org）

### Evan Chaki（Microsoft Semantic Kernel）

**洞见 1：把"embeddings + memory"做成框架一等公民，降低把外部知识接进 prompt 的成本**

- 通过 memory store + retrieval，把检索到的片段变成可控的上下文输入，服务于插件/工具调用与更复杂的 workflow。
- 关联节点：1 上下文(Context)
- 来源：Semantic Kernel Embeddings and Memories: Explore GitHub Repos with Chat UI（2023，Microsoft DevBlogs）

**洞见 2：Semantic Kernel 的定位是"把提示变成可组合的函数"，而不是只写 prompt**

- 更像把 LLM 能力做成可版本化、可测试的组件，让传统代码和 prompt 能在同一套工程体系里协作。
- 关联节点：4 内置工具(Tools)
- 来源：The Sequence Chat: Microsoft's Evan Chaki on Semantic Kernel and Combining LLMs with Conventional Programming Languages（2023）

---

## 跨源共识（3+ 独立来源重复出现）

| 共识                                    | 来源（原 A-F → 新 G-L 补充）                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| "上下文工程"取代"prompt engineering"    | Fowler、Willison、Karpathy、Swyx → +Continue.dev(Dunn)、Augment(Dietzen)、Sourcegraph(Slack)          |
| 确定性工具优先                          | Karpathy、Yegge、Aider、Claude Code → +OMO(Kim)、Haystack(Pietsch)、ReAct(Yao)                        |
| 角色化 + 共享记忆                       | Karpathy、Yegge、LangGraph、OMO → +Roo Code、AutoGen(Wang)、Magentic-One                              |
| 可审计/可回放                           | Cline、Willison、Swyx、LangGraph → +Langfuse(Klingen)、Arize、Helicone、Copilot(Dohmke)               |
| 合规/标准前置到上下文                   | Gene Kim、Cline、Devin → +Guardrails(Rajpal)、Goodside、Rehberger                                     |
| 简单循环优先                            | Anthropic、Claude Code、Kent Beck → +12-Factor(Horthy)、smolagents(Roucher)、BabyAGI(Nakajima)        |
| 上下文质量 > 数量                       | Karpathy、Willison、Fowler → +Continue.dev、Supermaven(Jackson)、Augment(Dietzen)                     |
| **[新]** 结构化输出 / 类型安全          | Embabel(Johnson)、PydanticAI(Colvin)、BAML(Gupta)、DSPy(Khattab)、Instructor(Liu)、Guardrails(Rajpal) |
| **[新]** 可观测性 / tracing 是生产基石  | Langfuse(Klingen)、Arize/Phoenix、Helicone(Torre)、CrewAI(Moura)、TruLens(Sen)                        |
| **[新]** 开源 / 可控 / 反锁定           | OpenHands(Wang)、Kilo(Sijbrandij)、TabbyML、AutoGPT(Richards)、Open Interpreter(Lucas)、Dify(Zhang)   |
| **[新]** Plan→Act→Observe 循环          | ReAct(Yao)、Cline(Rizwan)、LangGraph(Chase)、Magentic-One、Devin(Wu)、Andrew Ng                       |
| **[新]** Human-in-the-loop 一等公民     | LangGraph(Chase)、AutoGen(Wang)、Flowise(Heng)、Warp(Lloyd)、Cursor(Truell)                           |
| **[新]** Agent 评测需要真实任务         | SWE-bench(Yang)、cline-bench(Rizwan)、METR(Barnes)、12-Factor(Horthy)、Mollick                        |
| **[新]** 安全 / prompt injection 未解决 | Willison、Goodside、Rehberger、METR(Barnes)、Hendrycks                                                |

## 按节点映射索引

便于 Phase 2 写内容时快速定位相关素材：

| 节点                  | 关键素材来源                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 介绍                | Fowler(上下文工程)、Levels(vibe coding)、Anthropic(agent loop)、Kilo(计费体验)、Lovable(vibe coding受众)、Replit(减少偶然复杂度)、AutoGPT(能力扩散)、Dify(开放策略)                                                                                                                                                                                                                                   |
| 1 上下文              | Fowler(四层模型)、Karpathy(质量>数量)、Willison(上下文预算)、Swyx(上下文=资产)、Continue.dev(context poisoning)、Augment(语义检索)、Sourcegraph(上下文可得性)、Lilian Weng(Planning/Memory/Tool Use)、Andrew Ng(多次提示)、Semantic Kernel(embeddings+memory)、Rehberger(间接注入=不可信上下文)                                                                                                       |
| 2 三角关系            | Karpathy(LLM as OS)、Anthropic(简单循环)、Cline(Plan+Act)、Cursor(taste+控制)、Devin(计划-执行-反馈)、Jim Fan(三轴扩展)、Embabel(GOAP+确定性)、LangGraph(control+durability)、CrewAI(确定性backbone)、DSPy(可组合graph)、AutoGPT(模块边界)、Dify(workflow engine)                                                                                                                                     |
| 3 System Instructions | Gene Kim(合规前置)、Kent Beck(风格基准)、Yegge(接口契约)、OpenAI(可做/不可做)、Cline(System Prompt=工具API)、Dex Horthy(own your prompts)、Guardrails(RAIL规格)、Instructor(类型校验)、Goodside(注入隔离)、PydanticAI(类型+校验)、BabyAGI(task management prompt)、TabbyML(可审计)                                                                                                                    |
| 4 内置工具            | Karpathy(确定性工具)、Aider(repo map)、Cline(可组合原语)、Anthropic(工具描述)、Roo Code(权限边界)、OMO(curl vs WebFetch)、Windsurf(模式切换)、Bolt.new(运行环境前移)、OpenHands(SDK多入口)、ReAct(推理+行动)、Haystack(可组合组件)、Rehberger(工具权限)、Semantic Kernel(稳定API面)、smolagents(CodeAgent)                                                                                            |
| 5 MCP                 | Claude Code(MCP扩展)、OpenCode(解耦)、OpenAI(skills签名)、Kilo(供应商解耦)、Augment(Context Engine MCP)、CodeRabbit(MCP注入文档)、Embabel(MCP不够需orchestration)、Dify(发布为MCP server)                                                                                                                                                                                                             |
| 6 Commands            | Cline CLI(原语)、Willison(CLI偏好)、v0(约束模板)、OpenCode(terminal-first)、SWE-agent(ACI接口)、Warp(终端→ADE)、BAML(prompt语法)                                                                                                                                                                                                                                                                      |
| 7 Skills              | OMO(声明式注册)、Kent Beck(上下文包)、OpenAI(白名单)、TruLens(Agent Skills)、BAML(Prompt=代码资产)                                                                                                                                                                                                                                                                                                    |
| 8 Eval/验证           | Anthropic(evals)、Kent Beck(TDD)、Devin(可验证=表现好)、Willison(重放)、Fowler(认知债务)、cline-bench(真实工程)、SWE-bench(真实issue)、Andrew Ng(Reflection)、Mollick(指令遵循)、Magentic-One(错误恢复)、Langfuse(trace)、Arize(trajectory eval)、Helicone(事件流)、METR(能力上限)、Hendrycks(基准升级)、Supermaven(长上下文验证)、TruLens(全周期)、CrewAI(guardrails内建)、Dex Horthy(可观测+可回放) |
| 9 Sub Agent           | Karpathy(planner/worker/critic)、Yegge(角色+事实库)、LangGraph(子图)、OMO(handoff)、Cursor(并行)、Roo Code(Custom Modes)、Claude Code(Agent SDK)、Continue.dev(后台agent)、Warp(多线程agent)、Andrew Ng(四种模式)、Mollick(管理AI)、Magentic-One(Orchestrator)、AutoGen(可编程协作)、Flowise(loop/conditional/HITL)、Swarms(沟通拓扑)、Semantic Kernel(agent+process)                                 |
