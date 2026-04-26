# Harness Engineering 站点升级计划

> 来源：Task 1 报告 `.sisyphus/research/harness-engineering-content-gap/report.md`，并纳入两篇 Martin Fowler 站点文章（<https://martinfowler.com/articles/harness-engineering.html>、<https://martinfowler.com/articles/reduce-friction-ai/>）、Sean Goedecke 文章（<https://www.seangoedecke.com/software-engineering-may-no-longer-be-a-lifetime-career/>），以及 18 个早期多源研究 URL 的二次校准结果。本计划只把报告转成后续可执行的站点升级路线，不修改 `docs/` 正文。

## 目标

把 Task 1 报告中的 7 个 harness engineering Gap 转成可执行的双语内容升级任务。

目标不是重写骨架，也不是新增一套独立课程。Task 1 已确认：当前站点已经覆盖规则、Skills、Hooks、Sub Agent、MCP、权限边界、验证、HITL、编排等大多数零件。缺口主要在两处：

- 这些零件还没有被串成“围绕 agent 外层的工程系统”。
- 若干实践点讲了，但还不够集中：可执行 DoD、失败日志回流、运行环境隔离、重复工作流沉淀、审批疲劳与权限策略闭环。

Fowler 的补充来源把这套外层系统拆得更清楚：`Guides (feedforward controls)` 在 agent 动手前引导它，`Sensors (feedback controls)` 在 agent 动手后给它反馈；`Computational` controls 包括 tests、linters、type checkers、structural analysis，`Inferential` controls 包括 semantic analysis、AI code review、LLM-as-judge。后续升级应把这些概念翻译成本站读者能直接用的说法。

Sean Goedecke 的补充来源把人的长期能力问题放回视野：即便 AI 工具带来短期收益，也不能把 harness 写成“人更少思考”的承诺。计划中的 HITL、steering loop 和 Feedback Flywheel 要强调人的 cognitive engagement、监督质量和能力保留。

计划默认不立即编辑 `docs/`。后续 `/start-work` 只有在用户确认术语和高影响改动范围后，才进入正文修改。

## 基于报告的发现

Task 1 报告给出的判断如下：

| Gap | 类型 | 报告结论 | 建议落点 |
| --- | --- | --- | --- |
| GAP-HE-001 framework entrance | 框架 | 零件都在，但缺 harness engineering 的入口、guides / sensors 框架，以及它和 Context Engineering 的关系。 | `docs/guide/index.md` + `docs/en/guide/index.md`；`docs/guide/context.md` + `docs/en/guide/context.md`；`docs/guide/glossary.md` + `docs/en/guide/glossary.md` |
| GAP-HE-002 executable DoD | 深度 | 验证分散在 actors、HITL、In Practice；缺“DoD 要能被命令、exit code、文件状态、证据输出验证”的概念锚点，也缺 computational sensors / keep quality left 的说法。 | `docs/guide/actors.md` + `docs/en/guide/actors.md`；`docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`；`docs/guide/in-practice.md` + `docs/en/guide/in-practice.md` |
| GAP-HE-003 failure-log feedback loop | 深度 | 已讲踩坑写成规则，但没把“失败日志 → 规则 / Hook / 测试 / Skill / Command 改进”讲成 steering loop / Feedback Flywheel。 | `docs/guide/knowledge-feeding.md` + `docs/en/guide/knowledge-feeding.md`；`docs/guide/in-practice.md` + `docs/en/guide/in-practice.md`；`docs/guide/system-instructions.md` + `docs/en/guide/system-instructions.md` |
| GAP-HE-004 execution isolation | 深度 | Sub Agent 的上下文隔离讲得清楚，运行环境隔离讲得少；还可用 harnessability / ambient affordances 解释环境结构如何影响 agent 成功率。 | `docs/guide/sub-agents.md` + `docs/en/guide/sub-agents.md`；`docs/guide/orchestration.md` + `docs/en/guide/orchestration.md`；`docs/guide/built-in-tools.md` + `docs/en/guide/built-in-tools.md` |
| GAP-HE-005 repeatable workflow sedimentation | 框架 | Commands、Skills、Hooks 各自讲了，但缺“重复工作流进入 harness 的路径”；Fowler 五个 friction-reduction patterns 可作为组织方式。 | `docs/guide/skills.md` + `docs/en/guide/skills.md`；`docs/guide/commands.md` + `docs/en/guide/commands.md`；`docs/guide/hooks-and-plugins.md` + `docs/en/guide/hooks-and-plugins.md` |
| GAP-HE-006 approval fatigue and permissions loop | 框架 | 审批疲劳、Hooks、权限梯度都在，但三者还没形成闭环；可用 first-pass acceptance、iteration cycles、review burden 解释为什么目标是减少 review toil，同时用 Sean Goedecke 的条件性提醒说明：减少低价值 review 不等于减少人的思考。 | `docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`；`docs/guide/hooks-and-plugins.md` + `docs/en/guide/hooks-and-plugins.md`；`docs/guide/built-in-tools.md` + `docs/en/guide/built-in-tools.md` |
| GAP-HE-007 glossary term | 概念 | 术语表没有 Harness Engineering；也没有 guides / sensors、feedforward / feedback、computational / inferential controls 的轻量解释。 | `docs/guide/glossary.md` + `docs/en/guide/glossary.md` |

Task 1 报告还明确列出 No Gap：Context Engineering 主线、System Instructions、Skills、Hooks / Plugins、MCP、权限边界、Sub Agent 上下文隔离、并行治理、长循环控制、HITL、In Practice 都已覆盖。后续升级只做补强和串联，不把已覆盖内容包装成“全新发现”。

## 基于 18 个来源的进一步校准

这轮额外校准的意义，不是把站点改成“18 篇文章读书笔记”，而是把已经在 Task 1 中识别出的 7 个 Gap，再用更多来源压实优先级、边界和说法。

### 高可信共识（官方文档 / 官方博客 / Fowler + 多个实践来源反复出现）

1. **Hooks 处理“必须发生”的事，规则文件处理“应该这样做”的事。**
   这是本轮最稳定的共识。`CLAUDE.md` / `AGENTS.md` / rules 文件适合写项目约定、命令、架构边界、禁用做法；Hooks 适合 deterministic gate：危险命令拦截、写后 format/lint/typecheck、Stop 时验证完成条件。

2. **Subagent 的核心价值是上下文隔离，不只是并行。**
   多个来源都强调：探索、调研、review、长日志、批量操作之类的脏活，真正的收益不只在“更快”，而在于主会话只接收摘要，不把试错废料带回主线。

3. **Definition of Done 必须尽量转成可执行信号。**
   官方 best practices、Fowler 的 `Computational` / `Inferential` controls，以及多篇实践文章都指向同一件事：完成标准越能落成 tests、linters、type checks、build、evidence files、exit codes，越少依赖“看起来差不多”。

4. **harness 要从真实失败里长出来，而不是预设一套大全。**
   这是官方 best practices、Fowler、AICodeInvest、SmartScope、Paradime、Heyuan 等多来源共识。站点升级也应保持这个立场：不是介绍“最全配置”，而是介绍“如何把反复出现的问题沉淀成规则、Hook、测试、Skill、Command”。

5. **审批策略的目标不是“更少点按钮”，而是把人的注意力留给高价值判断。**
   这点被 PermissionRequest / PreToolUse 实践、Fowler 的 guides/sensors、Sean Goedec​ke 的 skill-retention 提醒反复支撑。好的 harness 不是把人拿掉，而是减少低价值 review toil。

6. **长会话不是优势；阶段切换和上下文重置是正常工作流的一部分。**
   官方 best practices、SmartScope、ShipWithAI、ZooClaw 都明确把 `/clear`、spec/impl 分 session、explore → plan → implement → verify 视为高回报实践。站内应把它讲成“上下文管理纪律”，不是某个工具的怪癖。

### 可引用但不能讲太满的启发式

- “两次失败就 `/clear`”——这是有用的经验法则，但不是站内应断言的硬规则。
- `CLAUDE.md` 200 行上下的上限——适合作为“保持精简”的经验提醒，不适合作为硬性数值结论。
- “单个 subagent 任务最好控制在约 30 分钟内”——这是工作分解启发，不是普适标准。
- `13` 或 `25` 种 hook 事件、某些 async / setup 行为、特定版本细节——适合出现在 In Practice 或注释型说明，不适合写进主概念层当稳定事实。
- 被 paywall 挡住、或来自 curated list 的信息，只能作为方向校准，不能当成核心证据来源。

### 对升级计划的直接影响

1. **Task B-F 的优先级应高于 Task H-I。**
   因为这轮 18 源校准进一步确认：最有用的不是先发明一个新章节，而是把可执行 DoD、失败回流、执行隔离、工作流沉淀、审批闭环这几条落到已有章节。

2. **Task E 必须显式讲清“哪类东西该沉到哪一层”。**
   多来源已经稳定收敛出分工：
   - 总是要读到的长期规则 → `CLAUDE.md` / `AGENTS.md` / rules
   - 可复用流程 → Skills / Commands
   - 必须由系统强制执行的门禁 → Hooks
   - 噪声重、上下文污染高的工作 → Subagents

3. **Task F / F2 应把“少想一点”排除掉。**
   本轮来源一致支持“减少低价值审批”和“把人从机械劳动里解放出来”，但不支持把 harness 讲成“以后人可以更少思考”。这条红线要写清楚。

4. **Task H 若执行，只能做轻量入口，不做术语主导的重写。**
   多来源都说明 context/harness/skills/hooks/subagents 是层次分工，不是要把一切改名成 harness engineering。首页和 context 页若动，只能轻量解释关系，不重写主线。

## 推荐默认路径

默认路径：不新建章节，不改 sidebar，不立即编辑 `docs/`，先把升级拆成一组用户可批准的现有章节补强任务。

推荐顺序：

1. 先确认术语，不在计划里替用户定中文名。
2. 再确认是否允许触碰基础叙事：`docs/guide/index.md` + `docs/en/guide/index.md`、`docs/guide/context.md` + `docs/en/guide/context.md` 属于 `high-impact requires-user-review`。
3. 若用户暂不批准基础叙事改动，先执行低风险章节补强：DoD、失败日志回流、执行隔离、工作流沉淀、审批闭环。
4. 术语表新增项只在术语选定后执行；`docs/guide/glossary.md` + `docs/en/guide/glossary.md` 不能先写死中文名。

这条默认路径对应 Task 1 报告的结论：机制大多已在，框架层还没成形。更稳的做法是用交叉引用和短段落把已有机制串起来，而不是新开一页重复讲所有零件。

Fowler 两篇文章只改变“怎么串”的语言，不改变默认路径：用 guides/feedforward、sensors/feedback、computational/inferential controls、steering loop、Feedback Flywheel、keep quality left 来补强已有章节；不新增默认章节，不把站点改成外部文章导读。

Sean Goedecke 文章只改变 HITL 和指标 framing：除了 review burden、post-merge rework、first-pass acceptance，也要提醒 harness 应保留人的技能参与和监督质量。不要把它写成“AI 必然导致技能退化”或“软件工程职业确定变短”。

18 个来源的二次校准进一步确认默认路径：

- **不先新增章节**，先补强已有章节的“层次分工”和“可执行闭环”。
- **不把主站写成某个工具的配置说明书**，尤其不把 Hook 事件枚举、某个 CLI flag、某种工作树操作写进概念层正文。
- **不把社区经验法则包装成硬结论**。像 `/clear` 阈值、`CLAUDE.md` 行数、subagent 时长，只能作为 In Practice 的经验建议。
- **先讲“为什么这样分层”**，再讲“这些层各自放什么”。这是避免读者把 Commands、Skills、Hooks、Subagents 混成一团的关键。

## 用户决策点

### 1. “harness engineering” 中文术语

状态：requires-user-approval。

不能在后续正文中静默选定术语。Task 1 report.md 只给候选：

| 候选 | 适合点 | 风险 |
| --- | --- | --- |
| Harness Engineering（保留英文） | 不误译，方便和英文资料对齐。 | 中文读者第一次见需要解释。 |
| 护栏工程 | 好懂，和权限、Hooks、审批强相关。 | 容易缩成安全概念，盖不住 Skills、MCP、DoD、工作流。 |
| 外层工程 | 朴素，贴近“围绕模型外面的一圈系统”。 | 术语感弱。 |
| 运行框架工程 | 能覆盖 workflow、gates、isolation。 | 容易听成在教框架开发。 |

建议：用户未拍板前，计划和草稿里都写 `harness engineering`，首次出现时用一句中文解释，不造最终中文术语。

### 2. 是否新增章节

状态：requires-user-approval。

默认不新增章节。若用户希望把 harness engineering 做成和 Context Engineering 同级的显性主线，才考虑新增章节。

新章节候选必须标记为 `requires-user-approval`，并且不是默认路径。若未来批准新增章节，至少还要同步：

- 新中文页：`docs/guide/harness-engineering.md` + 英文页：`docs/en/guide/harness-engineering.md`
- sidebar 配置：`docs/.vitepress/config.ts`
- 相关章节链接图：`docs/.vitepress/data/knowledge-graph.ts`
- AgentPrompt 章节关系输出

本计划不建议立即走这条路，因为 Task 1 report.md 说现有骨架已能承载这些内容。

### 3. 是否调整基础叙事

状态：high-impact requires-user-review。

以下改动会改变读者进入全书时看到的框架，不能默认执行：

- `docs/guide/index.md` + `docs/en/guide/index.md`：把 harness engineering 作为 Context Engineering 旁边的外层工程系统引入。
- `docs/guide/context.md` + `docs/en/guide/context.md`：解释 Context Engineering 管“给模型看什么”，harness engineering 管“外层系统如何约束 agent 怎么跑、怎么停、怎么验收、怎么复盘”。

如果用户不批准，仍可先在低风险章节补强 GAP-HE-002 至 GAP-HE-006。

## 任务分解

以下是给未来 `/start-work` 的延后实施纲要。当前 Task 2 不执行这些正文修改。

### Task A：术语与范围确认（不改 docs）

覆盖：GAP-HE-001、GAP-HE-007。

文件：无正文修改。

动作：让用户从中文术语候选中选择，或明确继续保留英文 `harness engineering`。

完成条件：后续正文统一使用同一个术语；术语表任务不再悬空。

### Task B：低风险补强可执行 DoD

覆盖：GAP-HE-002 executable DoD。

文件对：

- `docs/guide/actors.md` + `docs/en/guide/actors.md`
- `docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`
- `docs/guide/in-practice.md` + `docs/en/guide/in-practice.md`

建议内容边界：

- 在 actors 中把 stop condition 和完成标准连接到可执行信号：命令、exit code、文件状态、证据输出。
- 在 HITL 中说明人验收的不应只是“看 agent 说完了”，而是看可执行证据。
- 在 In Practice 中只加概念总结，不写 checklist，不扩成操作手册。
- 引入 Fowler 的 `Computational` / `Inferential` controls：tests、linters、type checkers、structural analysis 属于便宜稳定的 computational sensors；semantic analysis、AI code review、LLM-as-judge 属于更慢、更不确定的 inferential sensors。
- 用 keep quality left 解释：越早给 agent 可执行反馈，越少把问题拖到人工 review。
- 加一层来自官方与实践文档的共识：expected outputs、tests、Stop hook、构建命令，不是四种互斥方案，而是把 DoD 逐步从“口头要求”压成“可运行证据”的一条连续带。

不做：不恢复已删除的 Eval 章节；不做评分表或 decision tree。

### Task C：补强失败日志回流

覆盖：GAP-HE-003 failure-log feedback loop。

文件对：

- `docs/guide/knowledge-feeding.md` + `docs/en/guide/knowledge-feeding.md`
- `docs/guide/in-practice.md` + `docs/en/guide/in-practice.md`
- `docs/guide/system-instructions.md` + `docs/en/guide/system-instructions.md`

建议内容边界：

- 失败不是只修本次问题，还要判断是否进入外层约束。
- 四个去向：规则、Hook、测试 / 构建门禁、Skill / Command。
- 强调不是每个失败都要沉淀；一次性误差不必写成长期规则，反复出现的才值得进入 harness。
- 明确连接 Fowler 的 steering loop 和 Feedback Flywheel：重复问题应改进 feedforward guides、feedback sensors、Context Anchoring 或团队标准，而不是让人反复手改。
- 借 18 源共识把“失败回流”讲得更具体：不要只说“记下来”，而要说明为什么有的东西应进长期规则文件，有的应进 Skill / Command，有的必须升格为 Hook。

不做：不新增失败日志模板，不要求用户维护固定表格。

### Task D：补强执行隔离

覆盖：GAP-HE-004 execution isolation。

文件对：

- `docs/guide/sub-agents.md` + `docs/en/guide/sub-agents.md`
- `docs/guide/orchestration.md` + `docs/en/guide/orchestration.md`
- `docs/guide/built-in-tools.md` + `docs/en/guide/built-in-tools.md`

建议内容边界：

- 并排解释两种隔离：上下文隔离解决“LLM 看见什么”，执行隔离解决“agent 能碰到什么”。
- 举例保持通用：独立分支、临时工作区、沙箱、只读模式。
- 与权限边界相连：执行隔离不是替代审批，而是减少错误影响面。
- 用 harnessability / ambient affordances 解释为什么环境结构重要：类型系统、模块边界、结构化检查、清晰目录和可回滚工作区，会让 agent 更容易被约束。
- 结合多篇实践来源再补一句：spec / implementation 分 session、reviewer subagent 只读、探索任务 fork 到隔离上下文，都是执行隔离的日常形式，不必等到“上容器/上沙箱”才算隔离。

不做：不绑定具体产品，不写某工具 worktree / container 操作手册。

### Task E：补强重复工作流沉淀路径

覆盖：GAP-HE-005 repeatable workflow sedimentation。

文件对：

- `docs/guide/skills.md` + `docs/en/guide/skills.md`
- `docs/guide/commands.md` + `docs/en/guide/commands.md`
- `docs/guide/hooks-and-plugins.md` + `docs/en/guide/hooks-and-plugins.md`

建议内容边界：

- Command：这次要执行的一段固定流程。
- Skill：从现在起要遵守的一组方法和规则。
- Hook：必须由系统拦截或自动执行的门禁。
- 项目文档：低频但需要被读到的背景知识。
- 把 Fowler 的五个 friction-reduction patterns 映射到现有章节：Knowledge Priming → 知识喂养；Design-First Collaboration → 编排 / HITL；Context Anchoring → 上下文与会话交接；Encoding Team Standards → System Instructions / Skills；Feedback Flywheel → 失败回流。
- 加入 18 源二次校准后的分层原则：长期 always-on 规则不要塞进 Skill；必须 deterministically 发生的事不要只放进 Command；噪声重又消耗上下文的工作不要一直留在主会话。

不做：不扩成 checklist；不把已有 Command / Skill / Sub-agent 对比推翻重写。

### Task F：补强审批疲劳与权限策略闭环

覆盖：GAP-HE-006 approval fatigue and permissions loop。

文件对：

- `docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`
- `docs/guide/hooks-and-plugins.md` + `docs/en/guide/hooks-and-plugins.md`
- `docs/guide/built-in-tools.md` + `docs/en/guide/built-in-tools.md`

建议内容边界：

- 权限太松，风险上升。
- 权限太紧，人会疲劳，最后无脑批准。
- 好的 harness 同时减少危险操作和无意义审批。
- 用 collaboration-quality framing 解释收益：first-pass acceptance 更高，iteration cycles per task 更少，post-merge rework 更少，review burden 更低。这里是理解框架，不是团队 KPI。
- 加入 Sean Goedecke 的条件性提醒：如果 AI 让人更少通过亲手做任务学习，harness 更需要保留人的 cognitive engagement。文中不能断言 AI 必然造成技能退化，只能说这是需要设计时留意的风险。
- 标明目标不是“少思考”，而是把人的注意力从机械批准转到目标设定、关键 review、失败复盘和规则更新。
- 再补一条高频共识：allowlist / denylist、PermissionRequest hook、敏感路径阻断，这些都应被讲成“减少无意义批准”的工程手段，而不是单纯的安全姿态。

不做：不引入组织审批流程，不写企业合规制度。

### Task F2：补强人的长期能力与认知参与

覆盖：GAP-HE-006 approval fatigue and permissions loop；连接 HITL 与 cognitive debt。

文件对：

- `docs/guide/human-in-the-loop.md` + `docs/en/guide/human-in-the-loop.md`
- `docs/guide/in-practice.md` + `docs/en/guide/in-practice.md`

建议内容边界：

- 用 Sean Goedecke 文章作为温和来源：软件工程师可能需要新的方法保持 mental engagement；不能默认旧的 learning-by-doing 循环不变。
- 把 Feedback Flywheel / steering loop 写成人也学习的循环：失败不只喂给规则，也让人更新判断标准。
- 指标不仅看速度，还看 review burden、post-merge rework、first-pass acceptance，以及团队是否还能发现高价值问题。
- 明确排除一种误读：站点不能把 harness engineering 写成“以后你更少自己做、也能越来越强”；更稳妥的说法是“把人的时间从低价值机械环节移到更高价值的判断、设计、复盘”。

不做：不预测软件工程职业会不会终结；不说 AI 一定让工程师变笨；不写职业规划建议。

### Task G：术语表补项

覆盖：GAP-HE-007 glossary term。

前置条件：Task A 已完成，用户已批准术语。

文件对：

- `docs/guide/glossary.md` + `docs/en/guide/glossary.md`

建议内容边界：

- 中文术语按用户批准结果写。
- 英文术语为 `Harness Engineering`。
- 定义必须保持使用者视角：围绕 coding agent 外层的工程约束系统，不是造 agent 框架。
- 可轻量补充：Guides / Sensors、feedforward / feedback、Computational / Inferential controls。中文解释要朴素，不把术语表写成 Fowler 文章摘要。

不做：不把术语表变成长文；不引入未经批准的中文名。

### Task H：基础叙事轻量入口

覆盖：GAP-HE-001 framework entrance。

状态：high-impact requires-user-review。

前置条件：用户明确批准触碰基础叙事。

文件对：

- `docs/guide/index.md` + `docs/en/guide/index.md`
- `docs/guide/context.md` + `docs/en/guide/context.md`

建议内容边界：

- 只加轻量入口，不改变全书主线“上下文流动”。
- 解释两者关系：Context Engineering 处理上下文供给；harness engineering 处理外层约束、门禁、隔离和复盘。
- 使用 Fowler 的关系表述：Context Engineering 提供把 guides 和 sensors 放到 agent 面前的手段；为 coding agent 做 user harness engineering，是 Context Engineering 的一种具体形式。
- 保持 agent-agnostic，不引入产品名。

不做：不把首页改成 harness engineering 主题站；不把 context 章节重写成术语争论。

### Task I：新章节备选方案

覆盖：GAP-HE-001 framework entrance。

状态：requires-user-approval，非默认路径。

文件对：

- `docs/guide/harness-engineering.md` + `docs/en/guide/harness-engineering.md`

附带配置：

- `docs/.vitepress/config.ts`
- `docs/.vitepress/data/knowledge-graph.ts`

仅当用户明确要求“新增章节”时才执行。若执行，这会从规划任务升级为 VitePress 站点结构变更，应单独加载 `adopt-agentic-vitepress`，并做完整构建验证。

## 双语同步

每个正文任务必须同时修改中文和英文文件。不能先改中文、英文以后补。

最小双语约束：

- 每个任务都必须列出 `docs/guide/*.md` + `docs/en/guide/*.md` 文件对。
- 中文术语未定前，英文版统一保留 `Harness Engineering`；中文版保留 `harness engineering` 并解释，不自行翻译。
- 若中文出现 “可执行 DoD”“失败日志回流”“执行隔离”“审批疲劳”等新增概念，英文必须有对应概念表达，并保持章节位置同步。
- 任何 cross-link 都要确认中英文路径分别可用。

建议的同步检查：

```bash
git diff --name-only -- docs/guide docs/en/guide
```

预期：每个中文文件都有对应英文文件出现在 diff 中。

## 验证策略

当前 Task 2 只验证计划产物，不构建站点，因为不修改 `docs/`。

本任务验证命令：

```bash
test -f .sisyphus/plans/harness-engineering-site-upgrade.md
grep -E "^## (目标|基于报告的发现|推荐默认路径|用户决策点|任务分解|双语同步|验证策略|不做事项)" .sisyphus/plans/harness-engineering-site-upgrade.md
grep -E "report.md|Task 1|Gap|martinfowler.com/articles/harness-engineering.html|martinfowler.com/articles/reduce-friction-ai|seangoedecke.com/software-engineering-may-no-longer-be-a-lifetime-career" .sisyphus/plans/harness-engineering-site-upgrade.md
grep -E "requires-user-approval|high-impact requires-user-review" .sisyphus/plans/harness-engineering-site-upgrade.md
grep -E "docs/guide/.+\.md" .sisyphus/plans/harness-engineering-site-upgrade.md
grep -E "docs/en/guide/.+\.md" .sisyphus/plans/harness-engineering-site-upgrade.md
```

证据文件：

- `.sisyphus/evidence/task-2-plan-structure.txt`：保存文件存在、H2 结构、Task 1 report / Gap 可追踪性。
- `.sisyphus/evidence/task-2-scope-and-bilingual.txt`：保存 `docs/` diff、决策门标签、双语路径检查。

未来 `/start-work` 修改正文后，至少还要执行：

```bash
bun run docs:build
git diff --name-only -- docs/guide docs/en/guide
grep -R -n -E "materials/|\.sisyphus/" docs/guide docs/en/guide
grep -R -n -E "Cursor|Windsurf|GitHub Copilot|\.cursorrules|copilot-instructions\.md" docs/guide docs/en/guide
```

预期：构建通过；双语文件成对出现；站点正文不泄漏内部路径；主内容不新增禁用产品名。

若后续要验证这轮 18 源校准已沉到计划中，至少还应补跑：

```bash
grep -E "Hooks 处理“必须发生”的事|Subagent 的核心价值是上下文隔离|Definition of Done 必须尽量转成可执行信号|harness 要从真实失败里长出来|审批策略的目标不是“更少点按钮”" .sisyphus/plans/harness-engineering-site-upgrade.md
```

预期：这 5 条高频共识都能在计划中找到对应表述。

## 不做事项

- 不修改 `docs/`、`docs/.vitepress/`、配置、package 文件或源码。
- 不修改 `.sisyphus/plans/harness-engineering-content-gap-and-upgrade.md`。
- 不把新章节作为默认方案；任何新章节都是 `requires-user-approval`。
- 不替用户确定 “harness engineering” 的最终中文术语。
- 不把 `index.md` 或 `context.md` 的基础叙事改动当成低风险任务；它们必须标记 `high-impact requires-user-review`。
- 不引入主内容产品名，除非未来任务明确落在既有例外范围。
- 不写完整文章草稿，不写 checklist / worksheet / decision tree。
- 不做外部文献综述；Task 1 report.md 已是本计划的事实来源。
- 不把社区经验法则写成站点硬结论；像 `/clear` 阈值、CLAUDE.md 行数上限、subagent 理想时长，只能作为经验提示。
- 不把 paywall 后不可见内容、curated list 的二手描述，当成主论证的核心证据。
- 不安装依赖，不创建 `.opencode/`，不提交 git commit。
