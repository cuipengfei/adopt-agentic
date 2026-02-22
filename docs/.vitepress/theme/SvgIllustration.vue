<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'

type ObserverCallback = (isIntersecting: boolean) => void

const observedElements = new Map<Element, ObserverCallback>()
let sharedObserver: IntersectionObserver | null = null

function ensureObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const callback = observedElements.get(entry.target)
          callback?.(entry.isIntersecting)
        }
      },
      {
        root: null,
        threshold: 0.2,
      },
    )
  }

  return sharedObserver
}

const props = withDefaults(defineProps<{
  name: string
  interactive?: boolean
}>(), {
  interactive: false,
})

const hostRef = ref<HTMLElement | null>(null)
const inView = ref(false)
let observerCallback: ObserverCallback | null = null

const dialogRef = ref<HTMLDialogElement | null>(null)
const route = useRoute()
const isEn = computed(() => route.path.startsWith('/en/'))

function openExpand(): void {
  dialogRef.value?.showModal()
}

function closeExpand(): void {
  dialogRef.value?.close()
}

function onDialogClick(event: MouseEvent): void {
  if (event.target === dialogRef.value) {
    closeExpand()
  }
}

function restartSvgAnimations(): void {
  const host = hostRef.value
  if (!host) return

  const animations = host.querySelectorAll('animate, animateTransform')
  animations.forEach((node) => {
    if (node instanceof SVGAnimationElement && typeof node.beginElement === 'function') {
      node.beginElement()
    }
  })
}

function clearConceptHighlight(): void {
  const host = hostRef.value
  if (!host) return

  const active = host.querySelectorAll<HTMLElement>('[data-concept].aa-svg-concept--active, [data-concept].aa-svg-concept--hover')
  active.forEach((el) => {
    el.classList.remove('aa-svg-concept--active', 'aa-svg-concept--hover')
  })
}

function applyConceptHighlight(concept: string): void {
  const host = hostRef.value
  if (!host) return

  clearConceptHighlight()
  const targets = host.querySelectorAll<HTMLElement>(`[data-concept="${concept}"]`)
  targets.forEach((el) => el.classList.add('aa-svg-concept--active'))
}

function onConceptEvent(event: Event): void {
  const detail = (event as CustomEvent<{ concept?: string }>).detail
  const concept = detail?.concept?.trim()
  if (!concept) {
    clearConceptHighlight()
    return
  }

  applyConceptHighlight(concept)
}

function bindConceptHoverHandlers(): void {
  const host = hostRef.value
  if (!host) return

  const items = host.querySelectorAll<HTMLElement>('[data-concept]')
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('aa-svg-concept--hover')
    })
    item.addEventListener('mouseleave', () => {
      item.classList.remove('aa-svg-concept--hover')
    })
  })
}

const svgModules = import.meta.glob('../../public/illustrations/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const normalizedName = computed(() => {
  return props.name.endsWith('.svg') ? props.name : `${props.name}.svg`
})

const scopeId = computed(() => {
  return `aa-svg-scope-${normalizedName.value.replace(/[^a-zA-Z0-9_-]/g, '-')}`
})

const sourceSvg = computed(() => {
  const key = Object.keys(svgModules).find((file) => file.endsWith(`/${normalizedName.value}`))
  if (!key) return ''
  return svgModules[key]
})

function scopeSvgStyles(rawSvg: string, id: string): string {
  if (!rawSvg) return ''

  const withScopeAttr = rawSvg.replace('<svg', `<svg data-aa-svg-scope="${id}"`)

  return withScopeAttr.replace(/<style([\s\S]*?)>([\s\S]*?)<\/style>/g, (_full, attrs, cssText: string) => {
    const scopedCss = cssText.replace(/(^|})\s*([^@{}][^{}]*)\{/g, (_m, boundary: string, selectors: string) => {
      const scopedSelectors = selectors
        .split(',')
        .map((selector) => selector.trim())
        .filter(Boolean)
        .map((selector) => `svg[data-aa-svg-scope="${id}"] ${selector}`)
        .join(', ')

      if (!scopedSelectors) return `${boundary} ${selectors}{`
      return `${boundary} ${scopedSelectors} {`
    })

    return `<style${attrs}>${scopedCss}</style>`
  })
}

const svgHtml = computed(() => {
  if (!sourceSvg.value) {
    return `<svg data-aa-svg-missing="${normalizedName.value}" viewBox="0 0 800 120" role="img" aria-label="missing illustration"><text x="16" y="72" fill="currentColor" font-size="20">Missing SVG: ${normalizedName.value}</text></svg>`
  }

  return scopeSvgStyles(sourceSvg.value, scopeId.value)
})

onMounted(async () => {
  await nextTick()
  if (!hostRef.value) return

  bindConceptHoverHandlers()

  if (typeof window !== 'undefined') {
    window.addEventListener('aa-slide-highlight', onConceptEvent)
  }

  const observer = ensureObserver()
  if (!observer) return

  observerCallback = (isIntersecting) => {
    inView.value = isIntersecting
    if (isIntersecting) {
      restartSvgAnimations()
    }
  }

  observedElements.set(hostRef.value, observerCallback)
  observer.observe(hostRef.value)
})

onBeforeUnmount(() => {
  if (hostRef.value && sharedObserver) {
    sharedObserver.unobserve(hostRef.value)
    observedElements.delete(hostRef.value)
  }

  if (observerCallback && hostRef.value) {
    observedElements.delete(hostRef.value)
    observerCallback = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('aa-slide-highlight', onConceptEvent)
  }

  if (sharedObserver && observedElements.size === 0) {
    sharedObserver.disconnect()
    sharedObserver = null
  }
})
</script>

<template>
  <figure
    ref="hostRef"
    class="aa-svg-illustration"
    :class="{
      'aa-svg-illustration--interactive': interactive,
      'aa-svg-illustration--in-view': inView,
    }"
    :data-in-view="inView ? 'true' : 'false'"
  >
    <div class="aa-svg-illustration__inner" v-html="svgHtml" />

    <button
      class="aa-svg-illustration__expand"
      :title="isEn ? 'Expand' : '放大'"
      @click="openExpand"
      type="button"
    >
      ⤢
    </button>

    <dialog
      ref="dialogRef"
      class="aa-svg-illustration__dialog"
      @click="onDialogClick"
    >
      <div class="aa-svg-illustration__dialog-body" v-html="svgHtml" />
    </dialog>
  </figure>
</template>

<style scoped>
.aa-svg-illustration {
  margin: 1.25rem 0;
  position: relative;
}

.aa-svg-illustration__expand {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 85%, transparent 15%);
  color: var(--vp-c-text-3);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

.aa-svg-illustration__expand:hover {
  opacity: 1;
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.aa-svg-illustration__dialog {
  border: none;
  border-radius: 14px;
  padding: 0;
  width: min(90vw, 1200px);
  max-height: 90vh;
  background: transparent;
}

.aa-svg-illustration__dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.aa-svg-illustration__dialog-body {
  background: var(--vp-c-bg);
  border-radius: 14px;
  padding: 1.5rem;
  overflow: auto;
  max-height: 90vh;
}

.aa-svg-illustration__dialog-body :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.aa-svg-illustration :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.aa-svg-illustration--interactive {
  cursor: default;
}

.aa-svg-illustration :deep([data-concept].aa-svg-concept--active),
.aa-svg-illustration :deep([data-concept].aa-svg-concept--hover) {
  filter: brightness(1.08);
  opacity: 1;
}
</style>
