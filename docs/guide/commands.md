# 命令（Slash Commands）

> **上下文视角**：命令是用户侧的上下文注入快捷方式——将预定义 prompt 模板一键送入上下文。

上一节讲了 MCP 如何让 Agent 获得外部能力。能力有了，怎么高效触发？

输入 `/review`，Agent 不聊 review 的哲学，直接执行一套预定义的 review 动作。输入 `/commit`，它不问你要不要 commit，直接读 diff、生成消息、提交。

这就是 Slash Command：**一个以 `/` 开头的快捷方式，背后是一段预先写好的 prompt 模板**。你触发它，Agent 展开模板，塞进发给 LLM 的请求里。LLM 根本不知道你按了什么——它看到的只是一段结构化的指令。

![Slash Commands: user triggers a shortcut, Agent expands the prompt template and injects it into the LLM request — one-shot context injection](/illustrations/commands.svg)

## 命令展开的过程

当你执行 `/review` 时，Agent 读取关联的模板：

```
1. 对比当前分支与主干分支，找出所有被修改的文件。
2. 对每个变更文件，检查代码风格违规、潜在 bug 和可改进之处。
3. 生成简短报告，用项目符号列表总结每个文件的关键问题和建议。
```

Agent 将这段文本——连同它找到的文件变更——一起塞进请求：

```json
// → REQUEST（agent → LLM API）
{
  "system": "你是一个资深代码评审员...",
  "messages": [
    {
      "role": "user",
      "content": "请遵循以下步骤进行代码评审：\n1. 对比当前分支与主干分支...\n2. 检查代码风格违规...\n\n变更文件 `index.js` 内容如下：\n// ... 文件内容 ..."
    }
  ]
}
```

LLM 并不知道你输入了 `/review`。它看到的只是一个非常具体的、结构化的指令。对它来说，这和用户手动输入一大段文字没有区别。

## 可内嵌内容

命令不只是纯文本。一个设计良好的命令可以打包多种元素：

- **纯文本 Prompt**：指令和问题。
- **执行 Shell 命令**：`/commit` 可能先执行 `git status` 和 `git diff --staged`，把结果注入上下文。
- **读取文件**：`/test [文件名]` 读取测试文件和被测文件，然后要求 LLM 做思维实验。
- **组合动作**：`/publish` 依次执行 lint、test、build、bump version。

## 与系统指令的区别

| 特性       | 系统指令 (System Instructions)               | 命令 (Slash Commands)                    |
| :--------- | :------------------------------------------- | :--------------------------------------- |
| **存在感** | **默认存在**，每轮请求自动包含               | **按需触发**，用户手动 `/` 触发时注入    |
| **作用域** | 全局，影响 Agent 的每一次响应                | 注入一次，留在当前对话中                 |
| **角色**   | Agent 的行为准则                             | 一次具体的任务清单                       |
| **示例**   | "你是一个 Python 专家，代码要符合 PEP8 规范" | `/test`                                  |

系统指令定义 Agent "默认怎么做"，命令定义"这次做什么"。两者冲突时——比如系统指令要求"谨慎操作"，而 `/force-push` 要求"强制覆盖"——LLM 收到矛盾信号，行为变得不可预测。

## 本节小结

- **上下文流动**：用户输入 `/command` → Agent 展开为 prompt → 注入 `messages` → LLM 消费并响应。命令注入的内容留在当前对话中，不跨会话持久化。
- **风险**：命令可能与系统指令冲突。另外，包含危险操作的命令（如 `/deploy`、`/force-push`）应该有确认机制——不是所有快捷方式都应该"一键到底"。
- **可审计性**：Agent 日志应记录哪个命令触发了后续动作。出了问题，能追溯到源头的命令定义是排查关键。

下一节看 Skills——命令注入一次留在对话里，Skills 则在每一轮请求中自动包含。
