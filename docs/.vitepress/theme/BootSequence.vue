<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'
import { knowledgeGraph } from '../data/knowledge-graph'

const route = useRoute()

const visible = ref(false)
const fading = ref(false)
const typedText = ref('')

let rafId: number | null = null
let fadeTimer: ReturnType<typeof setTimeout> | null = null
let nextCharDelay = 30
let lastFrameTime = 0
let source = ''
let sourceIndex = 0

const locale = computed<'zh' | 'en'>(() => {
  return route.path.startsWith('/en/') ? 'en' : 'zh'
})

const skipHint = computed(() => {
  return locale.value === 'en' ? '[ESC to skip]' : '[按 ESC 跳过]'
})

function randomDelay(): number {
  return Math.floor(Math.random() * 141) + 10
}

function cleanupAnimation(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  if (fadeTimer) {
    clearTimeout(fadeTimer)
    fadeTimer = null
  }

  lastFrameTime = 0
}

function finishWithFade(): void {
  cleanupAnimation()
  fading.value = true

  fadeTimer = setTimeout(() => {
    visible.value = false
    fading.value = false
    fadeTimer = null
  }, 300)
}

function tick(now: number): void {
  if (!visible.value || fading.value) return

  if (!lastFrameTime) {
    lastFrameTime = now
  }

  if (now - lastFrameTime >= nextCharDelay) {
    typedText.value += source[sourceIndex] ?? ''
    sourceIndex += 1
    lastFrameTime = now
    nextCharDelay = randomDelay()

    if (sourceIndex >= source.length) {
      finishWithFade()
      return
    }
  }

  rafId = requestAnimationFrame(tick)
}

function onEscape(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return
  if (!visible.value) return

  typedText.value = source
  finishWithFade()
}

function buildBootText(): string {
  const isEn = locale.value === 'en'
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  const language = typeof navigator !== 'undefined' ? navigator.language : 'unknown'
  const resolution = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown'
  const graphNodes = knowledgeGraph.length
  const uaShort = ua.length > 90 ? `${ua.slice(0, 90)}…` : ua

  const lines = isEn
    ? [
        'ADOPT-AGENTIC INITIALIZING…',
        `LANGUAGE: ${language}`,
        `DISPLAY: ${resolution}`,
        `USER AGENT: ${uaShort}`,
        `SCANNING KNOWLEDGE GRAPH… ${graphNodes} NODES`,
        'BOOT COMPLETE.',
      ]
    : [
        'ADOPT-AGENTIC 正在初始化…',
        `语言: ${language}`,
        `分辨率: ${resolution}`,
        `User-Agent: ${uaShort}`,
        `扫描知识图谱… ${graphNodes} 个节点`,
        '启动完成。',
      ]

  return lines.join('\n')
}

onMounted(() => {
  if (typeof window === 'undefined') return

  source = buildBootText()
  sourceIndex = 0
  typedText.value = ''
  visible.value = true
  fading.value = false
  nextCharDelay = randomDelay()

  window.addEventListener('keydown', onEscape)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onEscape)
  }
  cleanupAnimation()
})
</script>

<template>
  <transition name="aa-boot-fade">
    <div v-if="visible" class="aa-boot-sequence" :class="{ 'aa-boot-sequence--fading': fading }" @click="finishWithFade">
      <pre class="aa-boot-sequence__log">{{ typedText }}</pre>
      <div class="aa-boot-sequence__hint">{{ skipHint }}</div>
    </div>
  </transition>
</template>

<style scoped>
.aa-boot-sequence {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0a0a0a;
  color: color-mix(in srgb, var(--vp-c-brand-1) 70%, white 30%);
  font-family: var(--vp-font-family-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.aa-boot-sequence__log {
  margin: 0;
  width: min(920px, 100%);
  min-height: 11lh;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
  font-size: 0.95rem;
  opacity: 0.96;
}

.aa-boot-sequence__hint {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  font-size: 0.78rem;
  color: color-mix(in srgb, var(--vp-c-brand-1) 55%, white 45%);
  animation: aa-boot-hint-breathe 2.4s ease-in-out infinite;
}

.aa-boot-sequence--fading {
  opacity: 0;
}

.aa-boot-fade-enter-active,
.aa-boot-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.aa-boot-fade-enter-from,
.aa-boot-fade-leave-to {
  opacity: 0;
}

@keyframes aa-boot-hint-breathe {
  0%,
  100% {
    opacity: 0.52;
  }
  50% {
    opacity: 0.88;
  }
}

@media (max-width: 640px) {
  .aa-boot-sequence {
    padding: 1rem;
  }

  .aa-boot-sequence__log {
    font-size: 0.82rem;
    min-height: 10lh;
  }

  .aa-boot-sequence__hint {
    right: 1rem;
    bottom: 1rem;
  }
}
</style>
