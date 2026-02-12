import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Adopt Agentic',
  description: 'A practical guide to adopting agentic AI workflows',

  // GitHub Pages deploys to https://<user>.github.io/<repo>/
  // Update <user> to your GitHub username
  base: '/adopt-agentic/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/adopt-agentic/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Why Agentic?', link: '/guide/why-agentic' },
            { text: 'Prerequisites', link: '/guide/prerequisites' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Agentic Workflows', link: '/guide/agentic-workflows' },
            { text: 'Tool Use & Function Calling', link: '/guide/tool-use' },
            { text: 'Prompt Engineering', link: '/guide/prompt-engineering' },
          ],
        },
        {
          text: 'Hands-On',
          items: [
            { text: 'Your First Agent', link: '/guide/first-agent' },
            { text: 'Multi-Agent Systems', link: '/guide/multi-agent' },
            { text: 'Best Practices', link: '/guide/best-practices' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/anthropics/adopt-agentic' },
    ],

    footer: {
      message: 'Released under the MIT License.',
    },

    search: {
      provider: 'local',
    },
  },
})
