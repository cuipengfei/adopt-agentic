export type KnowledgeNode = {
  id: string;
  titleZh: string;
  titleEn: string;
  urlZh: string;
  urlEn: string;
  group: "foundation" | "carriers" | "advanced" | "appendix";
  related: string[];
};

export const knowledgeGraph: KnowledgeNode[] = [
  {
    id: "index",
    titleZh: "介绍",
    titleEn: "Introduction",
    urlZh: "/adopt-agentic/guide/",
    urlEn: "/adopt-agentic/en/guide/",
    group: "foundation",
    related: ["context", "actors", "knowledge-feeding", "orchestration"],
  },
  {
    id: "context",
    titleZh: "上下文 — 第一原则",
    titleEn: "Context — The First Principle",
    urlZh: "/adopt-agentic/guide/context",
    urlEn: "/adopt-agentic/en/guide/context",
    group: "foundation",
    related: [
      "index",
      "actors",
      "system-instructions",
      "knowledge-feeding",
      "hooks-and-plugins",
    ],
  },
  {
    id: "actors",
    titleZh: "Agent、用户与 LLM API",
    titleEn: "Agents, Users & LLM APIs",
    urlZh: "/adopt-agentic/guide/actors",
    urlEn: "/adopt-agentic/en/guide/actors",
    group: "foundation",
    related: ["index", "context", "commands", "orchestration", "human-in-the-loop"],
  },
  {
    id: "system-instructions",
    titleZh: "System Instructions",
    titleEn: "System Instructions",
    urlZh: "/adopt-agentic/guide/system-instructions",
    urlEn: "/adopt-agentic/en/guide/system-instructions",
    group: "carriers",
    related: [
      "context",
      "commands",
      "skills",
      "knowledge-feeding",
      "built-in-tools",
    ],
  },
  {
    id: "built-in-tools",
    titleZh: "内置工具",
    titleEn: "Built-in Tools",
    urlZh: "/adopt-agentic/guide/built-in-tools",
    urlEn: "/adopt-agentic/en/guide/built-in-tools",
    group: "carriers",
    related: ["system-instructions", "mcp", "cli-tools", "hooks-and-plugins", "eval"],
  },
  {
    id: "mcp",
    titleZh: "MCP — 外部能力扩展",
    titleEn: "MCP — External Capabilities",
    urlZh: "/adopt-agentic/guide/mcp",
    urlEn: "/adopt-agentic/en/guide/mcp",
    group: "carriers",
    related: ["built-in-tools", "hooks-and-plugins", "skills", "cli-tools", "orchestration"],
  },
  {
    id: "commands",
    titleZh: "Slash Commands",
    titleEn: "Slash Commands",
    urlZh: "/adopt-agentic/guide/commands",
    urlEn: "/adopt-agentic/en/guide/commands",
    group: "carriers",
    related: ["system-instructions", "skills", "cli-tools", "orchestration", "actors"],
  },
  {
    id: "skills",
    titleZh: "Skills — 领域知识模块",
    titleEn: "Skills — Domain Modules",
    urlZh: "/adopt-agentic/guide/skills",
    urlEn: "/adopt-agentic/en/guide/skills",
    group: "carriers",
    related: ["system-instructions", "commands", "knowledge-feeding", "mcp", "sub-agents"],
  },
  {
    id: "cli-tools",
    titleZh: "Agent-Native CLI Tools",
    titleEn: "Agent-Native CLI Tools",
    urlZh: "/adopt-agentic/guide/cli-tools",
    urlEn: "/adopt-agentic/en/guide/cli-tools",
    group: "carriers",
    related: ["built-in-tools", "commands", "mcp", "hooks-and-plugins", "eval"],
  },
  {
    id: "hooks-and-plugins",
    titleZh: "Hooks & Plugins",
    titleEn: "Hooks & Plugins",
    urlZh: "/adopt-agentic/guide/hooks-and-plugins",
    urlEn: "/adopt-agentic/en/guide/hooks-and-plugins",
    group: "carriers",
    related: ["built-in-tools", "mcp", "cli-tools", "eval", "orchestration"],
  },
  {
    id: "knowledge-feeding",
    titleZh: "知识喂养",
    titleEn: "Knowledge Feeding",
    urlZh: "/adopt-agentic/guide/knowledge-feeding",
    urlEn: "/adopt-agentic/en/guide/knowledge-feeding",
    group: "advanced",
    related: ["context", "system-instructions", "skills", "sub-agents", "in-practice"],
  },
  {
    id: "orchestration",
    titleZh: "编排模式",
    titleEn: "Orchestration Patterns",
    urlZh: "/adopt-agentic/guide/orchestration",
    urlEn: "/adopt-agentic/en/guide/orchestration",
    group: "advanced",
    related: ["actors", "commands", "hooks-and-plugins", "sub-agents", "peer-to-peer-agents"],
  },
  {
    id: "sub-agents",
    titleZh: "Sub Agent — 上下文隔离",
    titleEn: "Sub Agents — Context Isolation",
    urlZh: "/adopt-agentic/guide/sub-agents",
    urlEn: "/adopt-agentic/en/guide/sub-agents",
    group: "advanced",
    related: ["orchestration", "knowledge-feeding", "skills", "eval", "human-in-the-loop"],
  },
  {
    id: "eval",
    titleZh: "Eval / 验证 / 可观测性",
    titleEn: "Eval / Verification / Observability",
    urlZh: "/adopt-agentic/guide/eval",
    urlEn: "/adopt-agentic/en/guide/eval",
    group: "advanced",
    related: ["built-in-tools", "hooks-and-plugins", "sub-agents", "human-in-the-loop", "orchestration"],
  },
  {
    id: "human-in-the-loop",
    titleZh: "Human-in-the-Loop",
    titleEn: "Human-in-the-Loop",
    urlZh: "/adopt-agentic/guide/human-in-the-loop",
    urlEn: "/adopt-agentic/en/guide/human-in-the-loop",
    group: "advanced",
    related: ["actors", "eval", "sub-agents", "orchestration", "in-practice"],
  },
  {
    id: "peer-to-peer-agents",
    titleZh: "Peer-to-Peer Agents",
    titleEn: "Peer-to-Peer Agents",
    urlZh: "/adopt-agentic/guide/peer-to-peer-agents",
    urlEn: "/adopt-agentic/en/guide/peer-to-peer-agents",
    group: "advanced",
    related: ["orchestration", "sub-agents", "hooks-and-plugins", "human-in-the-loop", "actors"],
  },
  {
    id: "in-practice",
    titleZh: "In Practice",
    titleEn: "In Practice",
    urlZh: "/adopt-agentic/guide/in-practice",
    urlEn: "/adopt-agentic/en/guide/in-practice",
    group: "appendix",
    related: ["knowledge-feeding", "human-in-the-loop", "system-instructions", "built-in-tools", "glossary"],
  },
  {
    id: "glossary",
    titleZh: "术语表",
    titleEn: "Glossary",
    urlZh: "/adopt-agentic/guide/glossary",
    urlEn: "/adopt-agentic/en/guide/glossary",
    group: "appendix",
    related: ["index", "context", "actors", "system-instructions", "knowledge-feeding"],
  },
];

const nodeMap = new Map<string, KnowledgeNode>(
  knowledgeGraph.map((node) => [node.id, node]),
);

export function getRelatedNodes(nodeId: string, lang: "zh" | "en") {
  const node = nodeMap.get(nodeId);
  if (!node) return [] as { title: string; url: string }[];

  return node.related
    .map((id) => nodeMap.get(id))
    .filter((relatedNode): relatedNode is KnowledgeNode => Boolean(relatedNode))
    .map((relatedNode) => ({
      title: lang === "zh" ? relatedNode.titleZh : relatedNode.titleEn,
      url: lang === "zh" ? relatedNode.urlZh : relatedNode.urlEn,
    }));
}
