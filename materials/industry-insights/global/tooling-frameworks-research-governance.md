# 全球洞见卷二：工具作者、框架方法、评测与治理

> 本分卷覆盖原始来源 G-L 的结构化洞见。
>
> - **快速阅读**：本文件保留关键观点与节点映射。
> - **完整细节**：请查看 [`archive-full.md`](../archive-full.md) 中对应 `## 来源 G` 到 `## 来源 L` 全文。

---

## 来源 G：AI 编码工具创建者（补充）

### Saoud Rizwan（Cline）

- Plan + Act 双阶段降低上下文漂移与返工。
- 将 System Prompt 当作工具 API 契约，而不是“写得漂亮”的提示词。
- 倡导以真实工程任务做 benchmark（cline-bench）。
- 节点：2 三角关系 / 3 System Instructions / 8 Eval。

### RooCodeInc（Roo Code）

- 用 Custom Modes 把角色能力产品化（QA/PM/架构师等）。
- 多代理的关键是权限边界与上下文可见性。
- 节点：4 内置工具 / 9 Sub Agents。

### Sid Sijbrandij / Scott Breitenother（Kilo）

- 模型/供应商解耦是开源 agent 的长期护城河。
- 计费/限流策略会直接改变开发者工作流体验。
- 节点：0 介绍 / 5 MCP。

### Boris Cherny（Claude Code / Anthropic）

- Claude Agent SDK 抽象了 Claude Code 的计划-执行-验证工作方式。
- 终端起步，多入口协作（Desktop/Web/IDE/GitHub/Slack）要求权限模型一致。
- 节点：4 内置工具 / 9 Sub Agents。

### Michael Truell（Cursor）

- AI 写得更多后，人类“品味与取舍”更重要。
- Describe-and-build 不等于放弃控制，审阅与边界约束仍是专业能力核心。
- 节点：0 介绍 / 2 三角关系。

### Dax Raad（OpenCode）

- terminal-first 减少“切出浏览器提问再贴回”的摩擦。
- 对 benchmark 持怀疑态度，强调真实链路体验。
- 节点：6 Commands / 8 Eval。

### YeonGyu Kim（Oh My OpenCode）

- 将编排显式化（ulw 与 planner 模式切换）。
- 强调工具调用确定性（例如文档建议直接 curl 拉原文）。
- 节点：4 内置工具 / 9 Sub Agents。

### Varun Mohan（Windsurf）

- Ask / Plan / Code 三模式本质是权限与工具集切换。
- 工程落地难点在延迟、工具可靠性、可验证性。
- 节点：4 内置工具 / 8 Eval。

### Scott Wu（Devin / Cognition）

- 代理需要在 sandbox 里拥有 shell/editor/browser 等“同款工具”。
- 长任务不是一次生成，而是计划-执行-反馈循环。
- 节点：2 三角关系 / 4 内置工具。

### Thomas Dohmke（GitHub Copilot）

- 把 agent 放进 GitHub 工作流可天然获得审计、保护与审批链路。
- Agentic DevOps 需要控制层，而不只是强模型。
- 节点：2 三角关系 / 8 Eval。

### Eric Simons（Bolt.new）

- 把运行与调试前移到对话，降低环境搭建门槛。
- 体验高度依赖执行环境（WebContainers），不只是提示词。
- 节点：4 内置工具。

### Anton Osika（Lovable）

- Vibe coding 面向“有想法但缺技术栈细节”的用户。
- 组织倾向 generalists + agents 的快速试错。
- 节点：0 介绍 / 9 Sub Agents。

### Continue.dev（Nate Lipp / Ty Dunn）

- 坏上下文比没上下文更糟（context poisoning）。
- Context Providers 把上下文供给变成显式构件。
- Cloud agents 让 agent 进入后台持续运行范式。
- 节点：1 上下文 / 9 Sub Agents。

### Amjad Masad（Replit）

- 减少 accidental complexity，让创意与意图表达前置。
- 业务角色可直接做可演示原型，改变组织沟通方式。
- 节点：0 介绍 / 2 三角关系。

### Quinn Slack（Sourcegraph）

- 代码 AI 的瓶颈是上下文可得性，不是 LeetCode 能力。
- 搜索与对话将融合为统一入口。
- 节点：1 上下文 / 4 内置工具。

### Scott Dietzen（Augment）

- 大代码库需要语义检索与上下文选择，而不是窗口堆料。
- 将上下文能力以 MCP 外部化给多种 agent 复用。
- 节点：1 上下文 / 5 MCP。

### Harjot Gill（CodeRabbit）

- 代码评审是 AI 时代 guardrail，而不是事后挑刺。
- 先对齐意图再写代码，减少 AI slop。
- MCP 可注入外部需求/文档增强评审与生成。
- 节点：5 MCP / 8 Eval。

### OpenHands（Xingyao Wang / Robert Brennan）

- SDK + CLI + GUI + Cloud 的产品化路径。
- 可复现执行环境（ephemeral workspace）是规模化基础。
- 开源动机来自反 walled garden。
- 节点：0 介绍 / 4 内置工具。

### Killian Lucas（Open Interpreter）

- 让模型直接执行本机代码/命令，形成自验证闭环。
- local-first 提升隐私与可控性默认值。
- 节点：1 上下文 / 4 内置工具。

---

## 来源 H：Agent 框架作者

### Embabel（Rod Johnson）

- GOAP 先规划，降低编排不确定性。
- 强类型 domain model 是企业 agent 地基。
- MCP 解决接入，不解决业务编排与发现。

### LangGraph（Harrison Chase）

- 生产 runtime 关键字：control + durability。
- graph/state 表达循环、分支与 interrupt。

### CrewAI（João Moura）

- 落地失败多源于架构过硬/过松。
- guardrails、memory、observability 要内建。

### AutoGen（Chi Wang）

- 多 agent conversation 应做成可编程协作协议。
- HITL 应是运行模式而非 UI 补丁。

### DSPy（Omar Khattab）

- 从 prompt 模板转向可优化程序。
- pipeline 统一为可组合 transformation graph。

### PydanticAI（Samuel Colvin）

- 结构化输出要类型 + 校验 + 错误处理。
- tracing/metrics 是迭代输入，不只是运维指标。

### LlamaIndex（Jerry Liu）

- naive RAG 仅够 demo，复杂问题要 agentic layer。
- 生产化离不开可观测和控制点。

### AutoGPT（Toran Bruce Richards）

- 把 loop/state/memory/tools 拆清边界才能演进维护。
- 开源目标是能力扩散与可访问性。

### BabyAGI（Yohei Nakajima）

- 最小任务循环的价值是启发而非直接生产。
- task management prompt 结构决定可控性。

### smolagents（Aymeric Roucher / Thomas Wolf）

- CodeAgent（代码动作）可减少 JSON 工具调用碎片错误。
- 极简框架 + sandbox + eval 默认化。

### Swarms（Kye Gomez）

- multi-agent 先选沟通拓扑再谈能力堆叠。
- agent/memory/tools/telemetry 模块化可插拔。

### BoundaryML / BAML（Vaibhav Gupta）

- 结构化输出是降低失败率的工程手段。
- Prompt 是代码资产，需要语法与工具链。

### Dify（Luyu Zhang / John Wang）

- 平台价值在 workflow engine，而不是少写几行代码。
- 发布为 MCP server 会反推能力边界设计。
- open/neutral/transparent 是生态信任策略。

### Flowise（Henry Heng）

- 可视化编排也要 loop/conditional/HITL。
- production use cases + evaluation 要提前进入产品叙事。

---

## 来源 I：思想领袖 & 学术

### Andrew Ng

- 多次提示工作流优于一次性生成。
- 四种常用模式：Reflection / Tool Use / Planning / Multi-agent。

### Ethan Mollick

- agentic 时代瓶颈在“管理”，不在模型。
- 真实任务中，很多失败来自“不按要求交付”。

### Jim Fan

- Foundation Agent 的规模化轴是 skills / embodiments / realities。

### Lilian Weng

- 经典架构三件套：Planning / Memory / Tool Use。
- 长期记忆常依赖外部存储与检索。

### ReAct（Shunyu Yao）

- 推理轨迹与行动交织，闭环比一次性计划更稳。

### SWE-agent / SWE-bench（John Yang / Carlos E. Jimenez）

- ACI 设计决定 agent 像人用电脑的成功率。
- 真实 issue 是可持续评测基准。

### Dex Horthy（12-factor-agents）

- 想突破 70%-80% 上限，必须自控 prompt 与 control flow。
- 生产级 agent 是软件工程系统，不是无限自循环。

### Magentic-One（Adam Fourney / Saleema Amershi / Victor Dibia）

- Orchestrator 做动态规划委派，系统必须具备纠偏与恢复。

### Guardrails（Shreya Rajpal）

- 把输出结构与质量标准写进规格，再自动修复。

### Instructor（Jason Liu）

- 用验证层与重试标准化把输出变成可用接口。

### Warp（Zach Lloyd）

- 终端演进为 ADE，需要可介入 UI 支撑多线程 agent。

---

## 来源 J：可观测性 / 评测基础设施

### Langfuse（Marc Klingen）

- 把 LLM 调用当作产品事件统一度量质量/成本/延迟。
- trace 打通后才谈得上 debug agent/RAG 根因。

### Arize / Phoenix（Jason Lopatecki / Aparna Dhinakaran）

- 先有 tracing，才有可复现 eval 与定位。
- 把 RAG/agent 调试当作分布式系统排障。

### Helicone（Justin Torre）

- AI Gateway 前置日志、成本、实验开关。
- tracing 对 agent 的核心价值在回放链路。

---

## 来源 K：安全 / 治理

### METR（Beth Barnes）

- 危险自主能力评估需明确威胁模型与可复现协议。

### CAIS（Dan Hendrycks）

- 安全讨论要落地为可执行标准与检查点。

### Riley Goodside

- prompt injection 本质是数据通道被当成指令通道。
- 最有效缓解是结构性隔离，不是堆提示词。

### Johann Rehberger

- 注入会打穿 CIA 三元组，工具自动化会放大攻击面。
- 默认将外部检索视为不可信内容。

---

## 来源 L：其他补充

### Supermaven（Jacob Jackson）

- 编码助手首先是延迟体验，其次才是更大上下文。
- 长上下文要证明“能利用”，而不只是“能塞”。

### TabbyML（Lucy Gao / Meng Zhang）

- self-hosted 缓解合规与代码外泄焦虑。
- 开源价值是可审计与可定制策略。

### Haystack（Malte Pietsch）

- components + pipelines 让 RAG/agent 可组合、可替换、可评测。

### TruLens（Shayak Sen）

- eval 与实验追踪合并记录，结论才可复现。
- 评估不能只看最终答案，要看中间检索与工具步骤。

### Semantic Kernel（Evan Chaki）

- embeddings + memory 降低外部知识接入成本。
- 把 prompt 能力做成可组合函数资产。

---

## 备注

- 完整来源明细、原始描述与补充细节请见 [`archive-full.md`](./archive-full.md) 的 `来源 G` 到 `来源 L`。
- 本分卷用于 Phase 2 写作阶段的快速检索与引用导航。

**本文件版本**：2026-02-12 初版
