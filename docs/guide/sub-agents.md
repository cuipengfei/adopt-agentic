# 子代理 — 上下文隔离

> **上下文视角**：Sub Agent 通过创建一份隔离的、全新的上下文来解决特定问题，避免主上下文被污染。

## 问题：当上下文变得太“脏”

还记得[第一原则](./context.md)里提到的“上下文污染”吗？

一个 agent 对话持续越久，`messages` 数组就越长。里面堆满了早期的探索、被否决的方案、不相关的工具输出……这些都是噪声。

当你想让 agent 在这个“脏”上下文中执行一个复杂、精确的子任务时，比如“基于最新的 API schema 写一段单元测试”，失败风险很高。LLM 的注意力会被无关信息稀释，可能参考到一段早已过时的代码，或者遵循一个已被废弃的约定。

你需要一个干净的房间。

## 解法：派生一个 Sub Agent

Sub Agent 就是一个临时的、干净的房间。

主 Agent (Parent Agent) 可以派生一个或多个子代理 (Sub Agent)。每个 Sub Agent 都有自己**完全独立**的上下文。它看不到主 Agent 的历史消息，只接收主 Agent 在创建它时给的一份初始指令。

它就像一个被叫来开短会的专家。你把背景材料（初始指令）给他，他进会议室独立研究，最后出来给你一份会议纪要（结果摘要）。他不需要知道你上午跟别人聊了什么。

## 工作方式

主 Agent 委派一个任务给 Sub Agent 的过程，可以看作一次函数调用：

```typescript
// 主 Agent 的工作流
function mainWorkflow() {
  // ... 主 Agent 已经和用户进行了多轮对话，上下文很长 ...

  const taskDescription = `
    你是一个 QA 工程师。
    这是 API schema 文件：
    ${await readFile('src/api/v2/schema.json')}

    你需要为 'createUser' endpoint 编写一个集成测试。
    - 测试必须使用 Vitest 框架。
    - 覆盖成功创建（201 Created）和无效输入（400 Bad Request）两种情况。
    - 将测试文件写入 'tests/integration/createUser.test.ts'。
  `;

  // 1. 创建 Sub Agent，给予清晰、独立的任务描述
  const subAgentResult = createSubAgent(taskDescription);

  // 3. Sub Agent 完成后，将结果摘要注入主 Agent 上下文
  const summary = `
    子任务完成：已创建 'createUser' 的集成测试。
    文件位置：'tests/integration/createUser.test.ts'
    测试覆盖了成功和失败场景。
  `;
  appendToContext(summary);

  // ... 主 Agent 基于子任务的结果，继续下一步 ...
}
```

**── 在 Sub Agent 内部 ──**

Sub Agent 的上下文是**从零开始**的。它的 `messages` 数组里只有主 Agent 给它的那段 `taskDescription`。

1.  **请求**: Sub Agent 的第一个请求，`messages` 数组干净且聚焦。
    ```json
    // → REQUEST (Sub Agent → LLM API)
    {
      "system": "你是一个代码助手。",
      "messages": [
        { "role": "user", "content": "你是一个 QA 工程师..." }
      ]
    }
    ```

2.  **执行**: Sub Agent 内部可能会进行多轮工具调用（读规范、写文件、运行测试），但这一切都发生在其**隔离的上下文**中。主 Agent 对此过程不可见，也不受其干扰。

3.  **返回**: Sub Agent 完成任务后，将其工作成果的**摘要**返回给主 Agent。注意，返回的是摘要，不是它内部几十上百条的完整消息历史。

这个过程就像 `git stash`：把当前复杂的上下文暂存，切换到一个干净的分支执行一个原子任务，完成后再带着产出切回来。

## 回扣第一原则

Sub Agent 的表现，完全取决于主 Agent 给它的初始指令有多好。

这又回到了[第一原则](./context.md)：**上下文的质量决定输出的质量**。给 Sub Agent 的指令必须是：
- **独立的**：不依赖主上下文中的任何隐藏信息。
- **完备的**：包含执行任务所需的所有背景材料（如代码片段、文件路径、明确目标）。
- **聚焦的**：只包含跟这个子任务相关的信息，不添加噪声。

糟糕的初始指令只会派生出一个同样困惑的 Sub Agent。

## 横切关注点

- **上下文流动**：消耗主 Agent 上下文中的部分信息（用于构建初始指令）；产生一份压缩后的摘要，回注到主 Agent 的上下文中。
- **风险提示**：隔离是一把双刃剑。如果初始指令遗漏了关键约束（比如项目编码规范），Sub Agent 就会在“无知”的情况下完成任务，产出不合规的代码。过度拆分也会导致高昂的协调成本。
- **可审计性**：Sub Agent 的完整会话记录应该独立保存，可供追溯。当主 Agent 拿到的摘要有问题时，可以下钻到 Sub Agent 的完整上下文中去排查根因。
