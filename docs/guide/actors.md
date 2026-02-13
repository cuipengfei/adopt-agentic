# Agent、用户与 LLM API

> **上下文视角**：三个角色共同构造、消耗和更新上下文，先划清边界才谈得上可控协作。

## 三个角色

Agent 不是 AI。Agent 是胶水代码。

| 角色  | 只做什么              |
| ----- | --------------------- |
| 你    | 发指令（intent）      |
| Agent | 编排上下文 + 执行工具 |
| LLM   | 推理（reason）        |

没了。LLM 从来没碰过你的文件——它只是推理该做什么。Agent 不会自己思考——它只是忠实执行 LLM 的决策。

你以为是 AI 搞砸了你的代码？多半是 Agent 把错误的上下文喂了进去，LLM 基于垃圾做了忠实推理。

## 协作循环

看一轮交互。

**── 第 1 轮 ──**

Agent 发请求给 LLM：

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是代码助手...",
  "messages": [{ "role": "user", "content": "提取 login 函数" }]
}
```

LLM 返回：

```json
// ← RESPONSE（LLM API → agent，SSE 流）
{
  "role": "assistant",
  "content": "我先读一下...",
  "tool_calls": [{ "name": "read_file", "arguments": { "path": "auth.js" } }]
}
```

LLM 没改代码——它**请求调用工具**，Agent 在本地执行。

**── 第 2 轮 ──**

Agent 追加 tool 结果，再次发送：

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是代码助手...",
  "messages": [
    { "role": "user", "content": "提取 login 函数" },
    {
      "role": "assistant",
      "content": "我先读一下...",
      "tool_calls": [
        { "name": "read_file", "arguments": { "path": "auth.js" } }
      ]
    },
    { "role": "tool", "content": "function login() { ... }" }
  ]
}
```

LLM 返回方案，Agent 执行文件操作。

注意第 2 轮请求：Agent **把全部历史重发了一遍**——用户消息、LLM 的上次回复、工具结果，一条不少。LLM 没有记忆，每次从头读。你往消息列表里加的每一条垃圾，它每一轮都得重新吃一遍。

LLM 一次可能返回多个 tool_calls。提取完函数后，它可能同时请求写新文件和改旧文件：

```json
{
  "name": "write_file",
  "arguments": {
    "path": "src/login.js",
    "content": "function login() { ... }"
  }
}

{
  "name": "edit_file",
  "arguments": {
    "path": "src/auth.js",
    "old": "function authenticate() { ... }",
    "new": "import { login } from './login.js';\n\nfunction authenticate() { ... }"
  }
}
```

Agent 逐个执行，结果逐个追加回 `messages`——下一轮 LLM 就能看到全部执行结果。

## API 协议

三种主流格式：

- **Messages API**（Anthropic）
- **Chat Completions**（OpenAI）
- **Responses API**（OpenAI）

都是 HTTP，核心一样：发上下文，收推理结果。Agent 帮你屏蔽差异。

## 为什么是 agentic 而非 chat

Chat：对 — 话 — 来 — 回。

Agentic：**接收 → 推理 → 行动 → 观察 → 再推理**。

核心区别：**工具**。Chat 只是换文字。Agentic 是 LLM 调用工具、改文件、跑命令——基于结果继续推理。

这才是 agent。

## 怎么给 agent 下任务

模糊 vs 精确：

> ❌ `"优化一下这个模块"`
> agent 改了 5 个文件，3 个不该动。

> ✅ `"把 login 提取到 src/login.js，保持 auth.js 的 export 签名不变"`
> 一刀切，干净。

不确定 agent 理解对了？让它复述你的意图，确认一致再动手。

大任务拆小块——跑完一个验证一个，远比跑完 20 步再回滚便宜。不确定方向？先让 agent 做最小可运行版本，验证了再展开。

不同产品，机制各异。但你发意图、Agent 编排上下文、LLM 推理——**三角关系不变**。

## 读每一节时，留意这三件事

- **上下文流动**：意图进 system + messages → LLM 推理 → tool_calls → Agent 执行 → 结果追加回 messages → 循环。这一节展示了完整的一圈。
- **风险**：意图模糊，LLM 就猜；权限过大，Agent 就乱动；LLM 幻觉，参数就错——三个角色的边界模糊，出问题是必然的。
- **可审计性**：每轮 HTTP 请求体可以导出重放。工具调用日志可以追溯。出了事，从请求体回溯。
