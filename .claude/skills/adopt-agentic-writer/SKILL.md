---
name: adopt-agentic-writer
description: 教程内容创作 skill。加载此 skill 来填充 adopt-agentic 的概念节点内容（中英双语同步），遵循十人混血儿写作风格和 HTTP/SSE 技术解释模式。触发：写教程内容、填充节点、草稿审查。
---

# adopt-agentic 教程内容创作

为 adopt-agentic 教程站点填充概念节点内容的完整操作指南。

## 适用场景

- 填充骨架节点的正文内容（Phase 2）
- 撰写新节点的中英文初稿
- 审查和修改已有内容
- 任何涉及教程正文创作的任务

## 写作风格：十人混血儿

十位大师的基因融合。写出来的东西必须同时满足：

| 基因 | 表现 |
|------|------|
| Fowler | 概念挖得深，但不炫技 |
| Musk | 一刀切开废话，直奔本质 |
| Graham | 把复杂讲得像常识 |
| Julia Evans | 具体例子先行，抽象靠边 |
| Derek Sivers | 一句话一段，呼吸感 |
| Joel Spolsky | 技术硬核，但不端着 |
| 阮一峰 | 信息密度高，长文也能一口气读完 |
| 陈皓 | 技术观点狠，不妥协 |
| 张小龙 | 极简克制，不拖泥带水 |
| 李笑来 | 抽象概念落地到可操作 |

**逐句自检**：这句话如果删掉，读者会损失什么？没损失就删。

## 技术解释模式：HTTP 请求/响应

所有涉及 agent-LLM 通信的内容，必须用 HTTP 请求/响应模式展示。

### 格式模板

```
**── 第 N 轮 ──**

Agent 向 LLM API 发 POST 请求：

​```json
// → REQUEST（agent → LLM API）
{
  "system": "...",
  "messages": [...]
}
​```

LLM 通过 SSE 流式返回：

​```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "...",
  "tool_calls": [...]
}
​```
```

### 关键规则

- 分轮次展示：`── 第 1 轮 ──` / `── 第 2 轮 ──`
- 明确标注方向：`→ REQUEST（agent → LLM API）` / `← RESPONSE（LLM API → agent，SSE 流）`
- 工具执行标注为本地（不经过 API）
- 第 2 轮请求必须展示 messages 数组比第 1 轮长（上下文累积）

## 双语同步规则

**中英文必须同时填充。不接受英文滞后。**

- 中文：`docs/guide/<node>.md`
- 英文：`docs/en/guide/<node>.md`
- 中文为主体创作语言，英文同步翻译
- 技术术语保持英文（context, agent, LLM, API, SSE, token 等）

## Agent Agnostic 原则

- 所有概念使用**通用术语**，不绑任何特定 agent 产品
- 举例可以多元（各种工具都可以提），但不能让某个产品成为主角
- 不区分 persona、不区分市场
- **主内容产品名禁令**：`docs/guide/` 和 `docs/en/guide/` 中**禁止**出现 Cursor、Windsurf、GitHub Copilot 等具体产品名（含衍生名如 `.cursorrules`、`copilot-instructions.md`）

## 内容三重筛选

从"造 agent"的行业知识中筛选"用 agent tool 的人"需要的概念：

1. **翻译得过来吗？** — 能否从框架实现视角翻译成工具使用者视角？
2. **用户直接受益吗？** — 理解后能更好地使用工具吗？
3. **工具无关吗？** — 放到任何 agent tool 上都成立吗？

通不过三重筛选的内容，不进站点。

## 横切关注点（每个节点必须包含）

每个概念节点的末尾必须有：

```markdown
## 横切关注点

- **上下文流动**：这一步消耗/产生哪些 context？
- **风险提示**：失控点？
- **可审计性**：操作记录可追溯吗？
```

## 读者定位

- **用 agent tool 的人**，不是造 agent 的人
- 读者是开发者，使用各类 AI coding agent，想理解底层机制以用得更好
- **不教框架实现**（LangChain / LangGraph / CrewAI 等 out of scope）

## 禁止事项

| 禁止 | 理由 |
|------|------|
| 练习 / checklist / decision tree | 纯概念教程，不附可执行件 |
| 工具适配附录 / 对照页 | 保持 agent-agnostic |
| 引用 `materials/` 内部路径 | 站点页面不引用 materials |
| 修改 `draft-ideas.md` | 用户私有文件，禁止 agent 修改 |
| AI 写作痕迹 | 避免 puffery（pivotal, crucial）、空洞 -ing 短语、promotional 形容词 |

## 骨架参考

骨架唯一真相来源：`.sisyphus/plans/phase1-content-structure.md`

每个节点在骨架中有详细定义（子项、行业视角引用）。填充内容前必须先读骨架对应节点。

## 竞品素材可借鉴

| 借鉴点 | 融入位置 | 力度 |
|--------|---------|------|
| "上下文即资产"叙事 | 节点 1 或 9 | 正常融入 |
| "AI context is like milk"类比 | 节点 1 | 正常融入 |
| amplifier 概念 | 适当位置 | **极轻** |
| agent-friendly code | 节点 3 或 9 | 提一嘴 |
| llms.txt 知识注入 | 节点 9 | 提一嘴 |

## 完成标准

1. 中英文双语内容同步完成
2. 遵循 HTTP/SSE 请求响应模式（涉及 agent-LLM 通信的内容）
3. 包含横切关注点栏位
4. 通过三重筛选（翻译得过来？用户受益？工具无关？）
5. 逐句自检通过（删掉没损失就删）
6. `bun run docs:build` 构建通过
