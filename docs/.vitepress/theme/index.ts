/// <reference types="vitepress/client" />
/// <reference path="./vue-shim.d.ts" />

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './layout'
import BootSequence from './BootSequence.vue'
import KnowledgeConstellation from './KnowledgeConstellation.vue'
import ContextBuilder from './ContextBuilder.vue'
import SvgIllustration from './SvgIllustration.vue'
import 'harmonyos-sans-sc-webfont-splitted'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('BootSequence', BootSequence)
    app.component('KnowledgeConstellation', KnowledgeConstellation)
    app.component('ContextBuilder', ContextBuilder)
    app.component('SvgIllustration', SvgIllustration)
  },
}

export default theme
