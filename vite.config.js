import { resolve } from 'path'
import alias from '@rollup/plugin-alias'
import WindiCSS from 'vite-plugin-windicss'
import { createHtmlPlugin } from 'vite-plugin-html'
/**
 * @param match
 * Regular expression in string or Regexp type,
 *  or a match predicate  (this: vite transform context, code: string, id: file name string) => void
 * @returns transformed code
 */
import plainText from 'vite-plugin-plain-text'

export default {
  root: 'src',
  build: {
    outDir: '../dist'
  },
  esbuild: {
    jsxFactory: 'm',
    jsxFragment: 'm.Fragment'
  },
  plugins: [
    createHtmlPlugin({
      minify: true
    }),
    WindiCSS({
      root: '.',
      scan: {
        include: ['src/**/*.{html,js}']
      }
    }),
    alias({
      entries: [
        {
          find: 'mithril',
          replacement: resolve(__dirname, 'node_modules/mithril/index.js')
        }
      ]
    })
  ],
  server: {
    port: 3030
  },
  preview: {
    port: 3000
  }
}
