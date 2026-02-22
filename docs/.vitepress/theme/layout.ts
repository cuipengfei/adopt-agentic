import { h, nextTick, onMounted, watch, type VNode } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// @ts-expect-error -- Vue SFC resolved by Vite at build time
import AgentPrompt from './AgentPrompt.vue'

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

    const refreshDeck = async (): Promise<void> => {
      await nextTick()

      const docRoot = document.querySelector<HTMLElement>('.VPDoc .vp-doc')
      if (!docRoot) return

      const visualRhythmEnabled = frontmatter.value?.visualRhythm !== false

      unwrapDeck(docRoot)

      if (visualRhythmEnabled) {
        buildDeck(docRoot)
      }
    }

    onMounted(() => {
      void refreshDeck()
    })

    watch(
      () => route.path,
      () => {
        void refreshDeck()
      },
    )

    watch(
      () => frontmatter.value?.visualRhythm,
      () => {
        void refreshDeck()
      },
    )

    return (): VNode => h(DefaultTheme.Layout, null, {
      'doc-before': () => h(AgentPrompt)
    })
  },
}
