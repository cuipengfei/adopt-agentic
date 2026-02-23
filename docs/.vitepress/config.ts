import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    base: "/adopt-agentic/",
    head: [
      [
        "link",
        { rel: "icon", type: "image/svg+xml", href: "/adopt-agentic/logo.svg" },
      ],
    ],

    title: "Adopt Agentic",
    description: "采用 Agentic AI 工作流的实用教程",

    locales: {
      root: {
        label: "中文",
        lang: "zh-CN",
        description: "采用 Agentic AI 工作流的实用教程",
        themeConfig: {
          nav: [
            { text: "首页", link: "/" },
            { text: "教程", link: "/guide/" },
          ],
          sidebar: {
            "/guide/": [
              { text: "介绍", link: "/guide/" },
              { text: "上下文 — 第一原则", link: "/guide/context" },
              { text: "Agent、用户与 LLM API", link: "/guide/actors" },
              {
                text: "System Instructions",
                link: "/guide/system-instructions",
              },
              { text: "内置工具", link: "/guide/built-in-tools" },
              { text: "MCP — 外部能力扩展", link: "/guide/mcp" },
              { text: "Slash Commands", link: "/guide/commands" },
              { text: "Skills — 领域知识模块", link: "/guide/skills" },
              { text: "Agent-Native CLI Tools", link: "/guide/cli-tools" },
              { text: "Hooks & Plugins", link: "/guide/hooks-and-plugins" },
              { text: "知识喂养", link: "/guide/knowledge-feeding" },
              { text: "编排模式", link: "/guide/orchestration" },
              { text: "Sub Agent — 上下文隔离", link: "/guide/sub-agents" },
              { text: "Human-in-the-Loop", link: "/guide/human-in-the-loop" },
              {
                text: "Peer-to-Peer Agents",
                link: "/guide/peer-to-peer-agents",
              },
              { text: "In Practice", link: "/guide/in-practice" },
              { text: "知识星图 & 术语表", link: "/guide/glossary" },
            ],
          },
        },
      },
      en: {
        label: "English",
        lang: "en",
        link: "/en/",
        description: "A practical guide to adopting agentic AI workflows",
        themeConfig: {
          nav: [
            { text: "Home", link: "/en/" },
            { text: "Guide", link: "/en/guide/" },
          ],
          sidebar: {
            "/en/guide/": [
              { text: "Introduction", link: "/en/guide/" },
              {
                text: "Context — The First Principle",
                link: "/en/guide/context",
              },
              { text: "Agents, Users & LLM APIs", link: "/en/guide/actors" },
              {
                text: "System Instructions",
                link: "/en/guide/system-instructions",
              },
              { text: "Built-in Tools", link: "/en/guide/built-in-tools" },
              { text: "MCP — External Capabilities", link: "/en/guide/mcp" },
              { text: "Slash Commands", link: "/en/guide/commands" },
              { text: "Skills — Domain Modules", link: "/en/guide/skills" },
              { text: "Agent-Native CLI Tools", link: "/en/guide/cli-tools" },
              { text: "Hooks & Plugins", link: "/en/guide/hooks-and-plugins" },
              {
                text: "Knowledge Feeding",
                link: "/en/guide/knowledge-feeding",
              },
              {
                text: "Orchestration Patterns",
                link: "/en/guide/orchestration",
              },
              {
                text: "Sub Agents — Context Isolation",
                link: "/en/guide/sub-agents",
              },
              {
                text: "Human-in-the-Loop",
                link: "/en/guide/human-in-the-loop",
              },
              {
                text: "Peer-to-Peer Agents",
                link: "/en/guide/peer-to-peer-agents",
              },
              { text: "In Practice", link: "/en/guide/in-practice" },
              { text: "Knowledge Constellation & Glossary", link: "/en/guide/glossary" },
            ],
          },
        },
      },
    },

    themeConfig: {
      logo: "/logo.svg",
      // socialLinks removed (old link was invalid)

      search: {
        provider: "local",
      },

      footer: {},
    },
  }),
);
