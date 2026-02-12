# 草稿构想

## 1. 阶段一 — 主体内容结构与骨架

### 1.1 第一原则：上下文（Context）

上下文是采用 agentic 编程最需要理解的核心概念。后续所有内容都是上下文的衍生：

- Tools / Function Calls
- MCPs
- Slash Commands
- Skills
- System Instructions
- Sub Agent 模式及其初始 Prompt
- 等等

这些机制的本质都是在塑造上下文。一切归结为：**在正确的位置、正确的时机，将正确的内容放入上下文。**

### 1.2 Agent、用户、LLM API — 各自的角色与协作方式

配合具体示例：

- Messages API（v1）
- Chat Completions API
- Responses API
- 以及其他

### 1.3 内置工具（Built-in Tools）

Agent 硬编码提供的能力，供 LLM 调用以获取所需信息，最终服务于用户。

### 1.4 MCP

额外的能力扩展，不硬编码在 Agent 内部，但用途相同。

### 1.5 Slash Commands

预定义的 Prompt，可内嵌 Bash 命令等技巧，由 Agent 执行后将结果提供给 LLM。

### 1.6 System Instructions

Agent 的内置 Prompt，向 LLM 说明内置工具及其他信息。

### 1.7 Sub Agent

从主 Agent 派生的全新上下文，让主 Agent 保持专注，减缓主 Agent 上下文污染的发生。

### 1.8 TBD

> **术语原则**：以上所有内容均为概念层面，使用的术语应通用且不绑定特定 Agent。不要只用 Claude Code 或 OpenCode 的专有术语，应使用通用表述。

<!-- todo: we should take key ideas and insights from industry leaders such as steve yegge, gene kim, karpathy, martin fowler, etc, you think who else we should cover, maybe like creators of cline and roo and authors of claude code, open code, oh my open code, etc. we should draw ideas from them, take their key insights and see how we can enhance our skeleton -->

## 2. 阶段二 — 内容填充

暂不在范围内。

## 3. 样式

暂不在范围内。

## 4. 图表与可视化

暂不在范围内。

## 5. 交互功能

暂不在范围内。
