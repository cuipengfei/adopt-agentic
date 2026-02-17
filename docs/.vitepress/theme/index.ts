import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './layout'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
}

export default theme
