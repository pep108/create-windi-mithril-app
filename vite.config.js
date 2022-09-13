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

const projectRootDir = resolve(__dirname)
const range = (size, startAt = 1) => Array.from(Array(size).keys()).map(i => i + startAt)

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
        },
        {
          find: 'Assets',
          replacement: resolve(projectRootDir, './src/assets')
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/scss/variables.scss";'
      }
    }
  },
  server: {
    port: 3030
  },
  preview: {
    port: 3000
  }
}
