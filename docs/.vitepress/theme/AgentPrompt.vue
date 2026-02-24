<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { ZH_PROMPT_TEMPLATE, EN_PROMPT_TEMPLATE } from './prompt-templates'
import { knowledgeGraph, getRelatedNodes } from '../data/knowledge-graph'


const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/cuipengfei/adopt-agentic/master/docs'

function getRawUrl(nodeId: string, en: boolean): string {
  const path = en ? `en/guide/${nodeId}` : `guide/${nodeId}`
  return `${GITHUB_RAW_BASE}/${path}.md`
}
const route = useRoute()
const { lang } = useData()

const isGuide = computed(() => route.path.includes('/guide/'))
const isEn = computed(() => lang.value === 'en')

function resolveNodeId(path: string): string {
  const cleanPath = path.split('#')[0].split('?')[0].replace(/\.html$/, '')
  if (/\/guide\/?$/.test(cleanPath)) return 'index'
  const match = cleanPath.match(/\/guide\/([^/]+)/)
  return match?.[1] ?? 'index'
}

const nodeId = computed(() => resolveNodeId(route.path))
const relatedNodes = computed(() =>
  getRelatedNodes(nodeId.value, isEn.value ? 'en' : 'zh'),
)

const copied = ref(false)
const hasClipboard = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  hasClipboard.value = typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function'
})

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
    copiedTimer = null
  }
})

async function copyPageContent() {
  if (!hasClipboard.value) return

  const docEl = document.querySelector('.vp-doc')
  if (!docEl) return

  const clone = docEl.cloneNode(true) as HTMLElement

  clone.querySelectorAll('.header-anchor, .agent-prompt-bar, button.copy, .line-numbers-wrapper, style, .aa-svg-illustration, .mermaid').forEach(el => el.remove())

  const pageText = clone.innerText.trim()
  const prompt = isEn.value ? EN_PROMPT_TEMPLATE : ZH_PROMPT_TEMPLATE

  const separator = isEn.value
    ? '--- Tutorial Content Below ---'
    : '--- 以下是教程正文 ---'
  const instructionSep = isEn.value
    ? '--- Instructions for You ---'
    : '--- 以下是给你的指令 ---'

  // Build related chapters (most relevant to current page)
  const origin = window.location.origin
  const related = relatedNodes.value
  const relatedLabel = isEn.value ? 'Chapters Most Relevant to This Page:' : '与本页最相关的章节：'
  const relatedText = related.length
    ? `\n\n${relatedLabel}\n${related.map(n => `- ${n.title}\n  ${origin}${n.url}\n  Markdown source: ${getRawUrl(n.id, isEn.value)}`).join('\n')}`
    : ''

  // Build full chapter list (complete tutorial map)
  const allLabel = isEn.value ? 'All Chapters in This Tutorial:' : '本教程全部章节：'
  const allList = knowledgeGraph
    .map(n => {
      const title = isEn.value ? n.titleEn : n.titleZh
      const url = isEn.value ? n.urlEn : n.urlZh
      return `- ${title}\n  ${origin}${url}\n  Markdown source: ${getRawUrl(n.id, isEn.value)}`
    })
    .join('\n')
  const allText = `\n\n${allLabel}\n${allList}`

  const fullText = `${instructionSep}\n\n${prompt.trim()}\n\n${separator}\n\n${pageText}${relatedText}${allText}`

  await navigator.clipboard.writeText(fullText)

  copied.value = true
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }

  copiedTimer = setTimeout(() => {
    copied.value = false
    copiedTimer = null
  }, 2000)
}
</script>

<template>
  <div v-if="isGuide" class="agent-prompt-bar">
    <button
      class="agent-prompt-btn"
      :class="{ 'agent-prompt-btn--copied': copied }"
      :disabled="!hasClipboard"
      @click="copyPageContent"
    >
      <span class="agent-prompt-btn__icon">📋</span>
      <span class="agent-prompt-btn__text">
        {{ copied
          ? (isEn ? 'Copied ✓' : '已复制 ✓')
          : (isEn ? 'Copy this page → Paste into your AI → Get a private walkthrough' : '一键复制此页 → 粘贴给 AI → 获得私人导读')
        }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.agent-prompt-bar {
  margin: 0.5rem 0 1.5rem;
}

.agent-prompt-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem 1.2rem;
  border-radius: 14px;
  border: 2px solid var(--vp-c-brand-1);
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-bg)) 0%,
    color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-bg)) 100%
  );
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
}

.agent-prompt-btn:hover:enabled {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-bg)) 0%,
    color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-bg)) 100%
  );
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
}

.agent-prompt-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agent-prompt-btn--copied {
  border-color: #22c55e;
  background: color-mix(in srgb, #22c55e 12%, var(--vp-c-bg));
}

.agent-prompt-btn__icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.agent-prompt-btn__text {
  line-height: 1.4;
}

:global(.dark) .agent-prompt-btn {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-bg)) 0%,
    color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg)) 100%
  );
}

@media (max-width: 640px) {
  .agent-prompt-btn {
    font-size: 0.88rem;
    padding: 0.75rem 1rem;
  }
}
</style>
