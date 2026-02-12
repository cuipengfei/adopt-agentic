# 行业洞见素材库（重构版索引）

> 你说得对：按字母分卷不够“逻辑化”。
> 现在改为按**内容职能**组织：全球基础 → 全球工程化 → 中国市场 → 综合提炼 → 完整归档。

---

## 目录结构（逻辑分层）

| 层级 | 文件 | 作用 |
| --- | --- | --- |
| 全球基础层 | [`global/foundations-core-voices.md`](./global/foundations-core-voices.md) | 思想起点与产品方向（Yegge/Karpathy/Fowler/Anthropic/OpenAI 等） |
| 全球工程层 | [`global/tooling-frameworks-research-governance.md`](./global/tooling-frameworks-research-governance.md) | 工具作者、框架方法、评测与治理（G-L 主体） |
| 中国市场层 | [`china/market-platforms-and-practitioners.md`](./china/market-platforms-and-practitioners.md) | 企业落地约束、平台官方证据、人物向样本 |
| 综合索引层 | [`synthesis/consensus-node-map.md`](./synthesis/consensus-node-map.md) | 跨源共识 + 节点映射 + 中国素材映射 |
| 完整归档层 | [`archive-full.md`](./archive-full.md) | 原始 1311 行全文，供逐段核对与追溯 |

---

## 推荐使用路径

1. **先定节点**：打开综合索引层（`synthesis/...`）找到目标教程节点。  
2. **再取证据**：按节点跳转到全球或中国分卷提取洞见与来源。  
3. **最后核对**：若需逐字核验，到 `archive-full.md` 对照原文。

---

## 引用建议

```markdown
> 观点：……
> 来源：见 materials/industry-insights/china/market-platforms-and-practitioners.md（对应人物/平台条目）
```

---

## 更新记录

| 日期 | 变更 |
| --- | --- |
| 2026-02-12 | 从超长单文件拆分到 materials；建立逻辑分层结构（global/china/synthesis/archive） |
| 2026-02-12 | 补齐中国人物向样本与平台官方一手证据 |

---

## 备注

- 旧命名（`sources-a-to-f` / `sources-g-to-l`）已下线。
- 若后续继续扩展，优先按“功能层”加卷，而不是按字母加卷。
