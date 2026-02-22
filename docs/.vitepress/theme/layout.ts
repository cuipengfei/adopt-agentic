/// <reference path="./vue-shim.d.ts" />

import { computed, h, nextTick, onBeforeUnmount, onMounted, watch, type VNode } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AgentPrompt from './AgentPrompt.vue'
import BootSequence from './BootSequence.vue'

function collectGroups(nodes: HTMLElement[]): HTMLElement[][] {
  const groups: HTMLElement[][] = []
  let current: HTMLElement[] = []

  const pushCurrent = (): void => {
    if (!current.length) return
    groups.push(current)
    current = []
  }

  for (const node of nodes) {
    if (node.tagName === 'H2' && current.length) {
      pushCurrent()
    }
    current.push(node)
  }

  pushCurrent()
  return groups
}

function unwrapDeck(docRoot: HTMLElement): void {
  const deck = docRoot.querySelector<HTMLElement>(':scope > .aa-slide-deck')
  if (!deck) return

  const slides = Array.from(deck.children) as HTMLElement[]
  for (const slide of slides) {
    // Restore H2 id from slide if it exists
    if (slide.id) {
        const h2 = slide.querySelector('h2')
        if (h2) {
            h2.id = slide.id
            slide.removeAttribute('id')
        }
    }

    while (slide.firstChild) {
      docRoot.insertBefore(slide.firstChild, deck)
    }
  }

  deck.remove()
  delete docRoot.dataset.aaSlideDeck
}

function buildDeck(docRoot: HTMLElement): void {
  if (docRoot.dataset.aaSlideDeck === 'ready') return

  const nodes = Array.from(docRoot.children).filter((child) => {
    return !(child instanceof HTMLElement && child.classList.contains('aa-slide-deck'))
  }) as HTMLElement[]

  if (!nodes.length) return

  const groups = collectGroups(nodes)
  if (!groups.length) return

  const deck = document.createElement('div')
  deck.className = 'aa-slide-deck'

  groups.forEach((group, index) => {
    const slide = document.createElement('section')
    slide.className = 'aa-slide'
    if (index === 0) {
      slide.classList.add('aa-slide--intro')
    }

    // P0 - Anchor/TOC Fix: Lift H2 id to the slide container for better scroll positioning
    // This ensures the card top aligns with the scroll position, not just the inner H2
    const h2 = group.find(node => node.tagName === 'H2')
    if (h2 && h2.id) {
      slide.id = h2.id
      slide.dataset.concept = h2.id
      h2.removeAttribute('id')
    }

    group.forEach((node) => {
      slide.appendChild(node)
    })

    deck.appendChild(slide)
  })

  docRoot.appendChild(deck)
  docRoot.dataset.aaSlideDeck = 'ready'
}

export default {
  name: 'AdoptAgenticSlideLayout',
  setup() {
    const route = useRoute()
    const { frontmatter } = useData()
    const isHomeRoute = computed(() => frontmatter.value?.layout === 'home')
    let slideObserver: IntersectionObserver | null = null
    let mermaidInjectTimer: number | null = null

    const cleanupMermaidDialogs = (): void => {
      if (typeof document === 'undefined') return

      const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog.aa-mermaid-dialog')
      dialogs.forEach((dialog) => {
        if (dialog.open) {
          dialog.close()
        }
        dialog.remove()
      })
    }

    const cleanupMermaidExpand = (): void => {
      if (typeof window !== 'undefined' && mermaidInjectTimer !== null) {
        window.clearTimeout(mermaidInjectTimer)
        mermaidInjectTimer = null
      }

      if (typeof document === 'undefined') return

      const buttons = document.querySelectorAll<HTMLElement>('.aa-mermaid-expand')
      buttons.forEach((button) => button.remove())

      cleanupMermaidDialogs()
    }

    const injectMermaidExpand = (): void => {
      if (typeof document === 'undefined') return

      const mermaidBlocks = document.querySelectorAll<HTMLElement>('.VPDoc .vp-doc .mermaid')

      mermaidBlocks.forEach((block) => {
        if (block.querySelector<HTMLElement>(':scope > .aa-mermaid-expand')) return

        block.style.position = 'relative'

        const btn = document.createElement('button')
        btn.className = 'aa-mermaid-expand'
        btn.type = 'button'
        btn.title = 'Expand'
        btn.setAttribute('aria-label', 'Expand mermaid diagram')
        btn.textContent = '⤢'

        btn.addEventListener('click', () => {
          const svg = block.querySelector<SVGElement>('svg')
          if (!svg) return

          cleanupMermaidDialogs()

          const dialog = document.createElement('dialog')
          dialog.className = 'aa-mermaid-dialog'

          const body = document.createElement('div')
          body.className = 'aa-mermaid-dialog__body'
          body.innerHTML = svg.outerHTML

          dialog.appendChild(body)
          document.body.appendChild(dialog)

          dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
              dialog.close()
            }
          })

          dialog.addEventListener(
            'close',
            () => {
              dialog.remove()
            },
            { once: true },
          )

          dialog.showModal()
        })

        block.appendChild(btn)
      })
    }

    const scheduleMermaidExpand = (): void => {
      if (typeof window === 'undefined') return

      if (mermaidInjectTimer !== null) {
        window.clearTimeout(mermaidInjectTimer)
      }

      mermaidInjectTimer = window.setTimeout(() => {
        injectMermaidExpand()
        // Second pass at 2s for late-rendering mermaid diagrams
        mermaidInjectTimer = window.setTimeout(() => {
          injectMermaidExpand()
          mermaidInjectTimer = null
        }, 1500)
      }, 500)
    }

    const inferConceptFromSlide = (slide: HTMLElement): string => {
      if (slide.dataset.concept) return slide.dataset.concept

      const id = slide.id
      if (!id) return ''

      if (id.includes('请求') || id.includes('request') || id.includes('what-is-context')) return 'request-line'
      if (id.includes('污染') || id.includes('pollution')) return 'isolate'
      if (id.includes('管好') || id.includes('managing-context')) return 'select'
      if (id.includes('state') || id.includes('memory')) return 'window'

      return id
    }

    const dispatchSlideHighlight = (concept: string): void => {
      if (typeof window === 'undefined') return

      window.dispatchEvent(
        new CustomEvent('aa-slide-highlight', {
          detail: { concept },
        }),
      )
    }

    const bindSlideHighlightObserver = (docRoot: HTMLElement): void => {
      if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return

      slideObserver?.disconnect()
      slideObserver = null

      const slides = Array.from(docRoot.querySelectorAll<HTMLElement>(':scope > .aa-slide-deck > .aa-slide'))
      if (!slides.length) {
        dispatchSlideHighlight('')
        return
      }

      slideObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

          const top = visible[0]
          if (!top || !(top.target instanceof HTMLElement)) {
            dispatchSlideHighlight('')
            return
          }

          dispatchSlideHighlight(inferConceptFromSlide(top.target))
        },
        {
          root: null,
          threshold: [0.2, 0.45, 0.7],
        },
      )

      slides.forEach((slide) => slideObserver?.observe(slide))
    }

    const refreshDeck = async (): Promise<void> => {
      await nextTick()

      const docRoot = document.querySelector<HTMLElement>('.VPDoc .vp-doc')
      if (!docRoot) return

      const visualRhythmEnabled = frontmatter.value?.visualRhythm !== false

      unwrapDeck(docRoot)

      if (visualRhythmEnabled) {
        buildDeck(docRoot)
        bindSlideHighlightObserver(docRoot)
      } else {
        docRoot.dataset.aaSlideDeck = 'ready'
        dispatchSlideHighlight('')
      }

      scheduleMermaidExpand()
    }

    onMounted(() => {
      void refreshDeck()
    })

    watch(
      () => route.path,
      () => {
        cleanupMermaidExpand()
        void refreshDeck()
      },
    )

    watch(
      () => frontmatter.value?.visualRhythm,
      () => {
        cleanupMermaidExpand()
        void refreshDeck()
      },
    )

    onBeforeUnmount(() => {
      cleanupMermaidExpand()
      slideObserver?.disconnect()
      slideObserver = null
      dispatchSlideHighlight('')
    })

    return (): VNode => h(DefaultTheme.Layout, null, {
      'layout-top': () => (isHomeRoute.value ? h(BootSequence) : null),
      'doc-before': () => h(AgentPrompt)
    })
  },
}
