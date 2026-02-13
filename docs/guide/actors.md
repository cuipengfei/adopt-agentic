# Agent、用户与 LLM API

> **上下文视角**：三个角色共同构造、消耗和更新上下文，先划清边界才谈得上可控协作。

## 三个角色

| 角色 | 只做什么 |
|------|---------|
| 你 | 发指令（intent） |
| Agent | 编排上下文 + 执行工具 |
| LLM | 推理（reason） |

没了。Agent 不会自己思考，它只是**执行 LLM 的决策**。LLM 不会自己动手，它只是**推理该做什么**。

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
    { "role": "assistant", "content": "我先读一下...", "tool_calls": [{ "name": "read_file", "arguments": { "path": "auth.js" } }] },
    { "role": "tool", "content": "function login() { ... }" }
  ]
}
```

LLM 返回方案。Agent 执行文件操作。

三方各司其职：LLM 推理，Agent 执行，你给意图。

一次完成的交互应该包含完整的 tool_calls：

## 文件操作示例

看一个完整的实际例子：

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

## 怎么下任务

### 说清楚要什么

"优化一下" → "把 login 提取到单独文件，保持兼容"。

让 agent 复述，确认再动手。

### 拆小块

大任务拆成可验证的块。跑完一个检查一个，比跑完 20 个再回滚便宜。

### 最小实验

先让 agent 做最小可运行版本，验证方向对了再完善。

## 术语通用化

- Agent：Claude Code、Cursor、Windsurf、Copilot Chat 都是
- LLM API：Claude、OpenAI、Gemini 都行
- 工具：文件读写、代码搜索、命令执行、浏览器控制

不同产品机制不同，**三角关系不变**。

## 横切关注点

- **上下文流动**：意图 → system + messages → 推理 → tool_calls → 执行 → 结果进 messages → 循环。
- **风险**：意图模糊 → 推理偏；权限过大 → 乱操作；LLM 幻觉 → 参数错。
- **可审计性**：每轮请求体可导出重放，工具调用日志可追溯。
