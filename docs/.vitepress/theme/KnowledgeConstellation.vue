<script setup lang="ts">
import { forceCenter, forceLink, forceManyBody, forceSimulation, forceX, forceY, type Simulation, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'
import { knowledgeGraph, type KnowledgeNode } from '../data/knowledge-graph'

type GroupName = KnowledgeNode['group']

interface GraphNode extends SimulationNodeDatum, KnowledgeNode {
  x: number
  y: number
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
}

const route = useRoute()
const wrapRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hoveredNode = ref<KnowledgeNode | null>(null)
const hoverX = ref(0)
const hoverY = ref(0)
const isMobile = ref(false)

const isEn = computed(() => route.path.startsWith('/en/'))

const nodeDefinitionsZh: Partial<Record<KnowledgeNode['id'], string>> = {
  context: '核心术语：上下文 / 上下文窗口。强调请求级完整重发与窗口容量约束。',
  'system-instructions': '核心术语：系统指令。定义高优先级行为规则和长期约束。',
  'built-in-tools': '核心术语：内置工具 / 工具调用。LLM 以结构化请求触发执行。',
  mcp: '核心术语：MCP。标准化接入外部能力并把结果回注上下文。',
  commands: '核心术语：Slash Commands。一次触发、一次注入的快捷模板。',
  skills: '核心术语：Skills。按需加载的领域模块。',
  orchestration: '核心术语：编排。顺序、并行、计划-执行与迭代循环。',
  'sub-agents': '核心术语：Sub Agent / 上下文隔离。子任务在隔离上下文中执行。',
  eval: '核心术语：验证金字塔。执行级、任务级、系统级分层验证。',
  glossary: '核心术语：术语表。提供双语定义与统一词汇基线。',
}

const nodeDefinitionsEn: Partial<Record<KnowledgeNode['id'], string>> = {
  context: 'Core terms: Context and Context Window. Full request replay under finite window constraints.',
  'system-instructions': 'Core term: System Instructions. High-priority behavioral constraints.',
  'built-in-tools': 'Core terms: Built-in Tools and Tool Calls. Structured tool execution loop.',
  mcp: 'Core term: MCP. Standardized external capability integration into context flow.',
  commands: 'Core term: Slash Commands. One-shot context injection via command templates.',
  skills: 'Core term: Skills. On-demand domain modules loaded at runtime.',
  orchestration: 'Core term: Orchestration. Sequential, parallel, plan-execute, and iterative loops.',
  'sub-agents': 'Core term: Sub Agents and Context Isolation for delegated sub-tasks.',
  eval: 'Core term: Verification Pyramid across execution, task logic, and system value.',
  glossary: 'Core term: Glossary. Bilingual baseline definitions for stable terminology.',
}

const groupLabel = computed<Record<GroupName, string>>(() => {
  if (isEn.value) {
    return {
      foundation: 'Foundation',
      carriers: 'Carriers',
      advanced: 'Advanced',
      appendix: 'Appendix',
    }
  }

  return {
    foundation: '基础概念',
    carriers: '上下文载体',
    advanced: '串联与进阶',
    appendix: '附录',
  }
})

const groupColors: Record<GroupName, string> = {
  foundation: '#2f9e44',
  carriers: '#1c7ed6',
  advanced: '#e67700',
  appendix: '#9c36b5',
}

const listNodes = computed(() => {
  return knowledgeGraph.map((node) => ({
    id: node.id,
    title: isEn.value ? node.titleEn : node.titleZh,
    url: isEn.value ? node.urlEn : node.urlZh,
    group: node.group,
  }))
})

let simulation: Simulation<GraphNode, GraphLink> | null = null
let graphNodes: GraphNode[] = []
let graphLinks: GraphLink[] = []
let dpr = 1

function titleOf(node: KnowledgeNode): string {
  return isEn.value ? node.titleEn : node.titleZh
}

function urlOf(node: KnowledgeNode): string {
  return isEn.value ? node.urlEn : node.urlZh
}

function definitionOf(node: KnowledgeNode): string {
  const bank = isEn.value ? nodeDefinitionsEn : nodeDefinitionsZh
  return bank[node.id] ?? (isEn.value ? 'Related chapter and glossary entry.' : '关联章节与术语定义请见下方术语表。')
}

function normalizeCanvasSize(): { width: number; height: number } {
  const wrap = wrapRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas) {
    return { width: 0, height: 0 }
  }

  const rect = wrap.getBoundingClientRect()
  const width = Math.max(320, Math.floor(rect.width))
  const height = 600

  dpr = window.devicePixelRatio || 1
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  return { width, height }
}

function buildLinks(): GraphLink[] {
  const edgeSet = new Set<string>()
  const links: GraphLink[] = []

  for (const node of knowledgeGraph) {
    for (const relatedId of node.related) {
      const key = [node.id, relatedId].sort().join('::')
      if (edgeSet.has(key)) continue
      edgeSet.add(key)
      links.push({ source: node.id, target: relatedId })
    }
  }

  return links
}

function resolveNodeId(target: string | GraphNode): string {
  return typeof target === 'string' ? target : target.id
}

function draw(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width / dpr
  const height = canvas.height / dpr
  ctx.clearRect(0, 0, width, height)

  const activeId = hoveredNode.value?.id ?? null
  const activeNeighborhood = new Set<string>()
  if (activeId) {
    activeNeighborhood.add(activeId)
    const node = knowledgeGraph.find((item) => item.id === activeId)
    node?.related.forEach((id) => activeNeighborhood.add(id))
  }

  ctx.lineWidth = 1
  for (const link of graphLinks) {
    const sourceId = resolveNodeId(link.source)
    const targetId = resolveNodeId(link.target)
    const source = graphNodes.find((item) => item.id === sourceId)
    const target = graphNodes.find((item) => item.id === targetId)
    if (!source || !target) continue

    const highlighted =
      activeNeighborhood.size > 0 &&
      activeNeighborhood.has(source.id) &&
      activeNeighborhood.has(target.id)

    ctx.globalAlpha = activeNeighborhood.size === 0 ? 0.45 : highlighted ? 0.95 : 0.2
    ctx.strokeStyle = '#8a8f98'
    const midX = (source.x + target.x) / 2
    const midY = (source.y + target.y) / 2
    const edgeDx = target.x - source.x
    const edgeDy = target.y - source.y
    const dist = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy) || 1
    const curveOffset = Math.min(dist * 0.15, 25)
    const ctrlX = midX - (edgeDy * curveOffset) / dist
    const ctrlY = midY + (edgeDx * curveOffset) / dist

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.quadraticCurveTo(ctrlX, ctrlY, target.x, target.y)
    ctx.stroke()
  }

  for (const node of graphNodes) {
    const highlighted = activeNeighborhood.size === 0 || activeNeighborhood.has(node.id)
    ctx.globalAlpha = highlighted ? 1 : 0.4

    ctx.fillStyle = groupColors[node.group]
    ctx.beginPath()
    ctx.arc(node.x, node.y, 7.6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e9ecef'
    ctx.font = '12px var(--vp-font-family-base)'
    ctx.textBaseline = 'middle'
    ctx.fillText(titleOf(node), node.x + 11, node.y)
  }

  // Group labels
  const groupCenters = new Map<GroupName, { sumX: number; minY: number; count: number }>()
  for (const node of graphNodes) {
    const entry = groupCenters.get(node.group)
    if (entry) {
      entry.sumX += node.x
      entry.minY = Math.min(entry.minY, node.y)
      entry.count += 1
    } else {
      groupCenters.set(node.group, { sumX: node.x, minY: node.y, count: 1 })
    }
  }
  ctx.font = '11px var(--vp-font-family-base)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  for (const [group, center] of groupCenters) {
    const cx = center.sumX / center.count
    ctx.fillStyle = groupColors[group]
    ctx.globalAlpha = 0.55
    ctx.fillText(groupLabel.value[group], cx, center.minY - 14)
  }
  ctx.textAlign = 'start'

  ctx.globalAlpha = 1
}

function detectHoveredNode(pointerX: number, pointerY: number): KnowledgeNode | null {
  const threshold = 12
  for (const node of graphNodes) {
    const dx = node.x - pointerX
    const dy = node.y - pointerY
    if (dx * dx + dy * dy <= threshold * threshold) {
      return node
    }
  }

  return null
}

function onPointerMove(event: MouseEvent): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const target = detectHoveredNode(x, y)

  hoveredNode.value = target
  hoverX.value = x
  hoverY.value = y
  draw()
}

function onPointerLeave(): void {
  hoveredNode.value = null
  draw()
}

function onCanvasClick(): void {
  if (!hoveredNode.value) return
  window.location.href = urlOf(hoveredNode.value)
}

function startSimulation(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  graphNodes = knowledgeGraph.map((node) => ({
    ...node,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }))

  graphLinks = buildLinks()
  const { width, height } = normalizeCanvasSize()

  // Group target positions
  const groupTargetX: Record<GroupName, number> = {
    foundation: width * 0.15,
    carriers: width * 0.42,
    advanced: width * 0.70,
    appendix: width * 0.92,
  }
  const groupTargetY: Record<GroupName, number> = {
    foundation: height * 0.45,
    carriers: height * 0.50,
    advanced: height * 0.50,
    appendix: height * 0.45,
  }

  simulation?.stop()
  simulation = forceSimulation<GraphNode>(graphNodes)
    .force('charge', forceManyBody<GraphNode>().strength(-380))
    .force('center', forceCenter(width / 2, height / 2))
    .force(
      'link',
      forceLink<GraphNode, GraphLink>(graphLinks)
        .id((node) => node.id)
        .distance(120)
        .strength(0.25),
    )
    .force('groupX', forceX<GraphNode>().x((d) => groupTargetX[(d as GraphNode).group]).strength(0.12))
    .force('groupY', forceY<GraphNode>().y((d) => groupTargetY[(d as GraphNode).group]).strength(0.08))
    .alpha(1)
    .alphaDecay(0.04)
    .on('tick', draw)

  canvas.addEventListener('mousemove', onPointerMove)
  canvas.addEventListener('mouseleave', onPointerLeave)
  canvas.addEventListener('click', onCanvasClick)
}

function onResize(): void {
  if (!simulation || isMobile.value) return
  const { width, height } = normalizeCanvasSize()
  simulation.force('center', forceCenter(width / 2, height / 2))
  const groupTargetX: Record<GroupName, number> = {
    foundation: width * 0.15,
    carriers: width * 0.42,
    advanced: width * 0.70,
    appendix: width * 0.92,
  }
  const groupTargetY: Record<GroupName, number> = {
    foundation: height * 0.45,
    carriers: height * 0.50,
    advanced: height * 0.50,
    appendix: height * 0.45,
  }
  simulation.force('groupX', forceX<GraphNode>().x((d) => groupTargetX[(d as GraphNode).group]).strength(0.12))
  simulation.force('groupY', forceY<GraphNode>().y((d) => groupTargetY[(d as GraphNode).group]).strength(0.08))
  simulation.alpha(0.4).restart()
}

onMounted(() => {
  if (typeof window === 'undefined') return

  isMobile.value = window.matchMedia('(max-width: 640px)').matches
  if (isMobile.value) return

  startSimulation()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  simulation?.stop()
  simulation = null

  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('mousemove', onPointerMove)
    canvas.removeEventListener('mouseleave', onPointerLeave)
    canvas.removeEventListener('click', onCanvasClick)
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize)
  }
})
</script>

<template>
  <section class="aa-constellation" ref="wrapRef">
    <header class="aa-constellation__head">
      <h3>{{ isEn ? 'Knowledge Constellation' : '知识星图' }}</h3>
      <p>
        {{
          isEn
            ? 'Hover a node to inspect local connections. Click to jump to that chapter.'
            : '悬停节点可查看邻接关系，点击可跳转到对应章节。'
        }}
      </p>
    </header>

    <div v-if="!isMobile" class="aa-constellation__canvas-wrap">
      <canvas ref="canvasRef" class="aa-constellation__canvas" />
      <aside
        v-if="hoveredNode"
        class="aa-constellation__tooltip"
        :style="{ left: `${hoverX + 14}px`, top: `${hoverY + 14}px` }"
      >
        <strong>{{ titleOf(hoveredNode) }}</strong>
        <div class="aa-constellation__tooltip-meta">{{ groupLabel[hoveredNode.group] }}</div>
        <p class="aa-constellation__tooltip-desc">{{ definitionOf(hoveredNode) }}</p>
      </aside>
    </div>

    <div v-else class="aa-constellation__mobile-list">
      <a
        v-for="node in listNodes"
        :key="node.id"
        :href="node.url"
        class="aa-constellation__mobile-card"
      >
        <span class="aa-constellation__dot" :style="{ backgroundColor: groupColors[node.group] }" />
        <div>
          <strong>{{ node.title }}</strong>
          <div class="aa-constellation__mobile-meta">{{ groupLabel[node.group] }}</div>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.aa-constellation {
  margin: 1rem 0 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 0.9rem;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent 12%);
}

.aa-constellation__head h3 {
  margin: 0;
}

.aa-constellation__head p {
  margin: 0.35rem 0 0.8rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.aa-constellation__canvas-wrap {
  position: relative;
}

.aa-constellation__canvas {
  width: 100%;
  display: block;
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent 12%);
}

.aa-constellation__tooltip {
  position: absolute;
  pointer-events: none;
  max-width: 260px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0.5rem 0.65rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
}

.aa-constellation__tooltip-meta {
  margin-top: 0.2rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.aa-constellation__tooltip-desc {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.aa-constellation__mobile-list {
  display: grid;
  gap: 0.55rem;
}

.aa-constellation__mobile-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0.62rem 0.7rem;
  display: flex;
  gap: 0.55rem;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.aa-constellation__mobile-card:hover {
  border-color: var(--vp-c-brand-1);
}

.aa-constellation__dot {
  width: 0.62rem;
  height: 0.62rem;
  border-radius: 999px;
}

.aa-constellation__mobile-meta {
  margin-top: 0.16rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
</style>
