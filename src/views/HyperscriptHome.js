import m from 'mithril'
import config from '/config'
import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'
import mithrilLogo from '/assets/logo/mithril.svg'
import viteLogo from '/assets/logo/vite.svg'
import windiLogo from '/assets/logo/windi.svg'

const FeatureBox = {
  view: ({ children }) =>
    m('div', { class: 'w-1/3 <sm:w-full <md:w-1/2 mb-4' },
      m('div', { class: 'h-full mt-4 p-4 m-2 shadow-md rounded bg-white dark:bg-stone-900 dark:text-stone-300' },
        children
      )
    )
}

const Title = {
  view: ({ attrs, children }) =>
    m('div', { class: 'font-bold mb-2' },
      attrs.href
        ? m('a', {
          class: 'flex align-center text-blue-400',
          href: attrs.href,
          target: '_blank',
          rel: 'noreferrer'
        }, children)
        : m('div', children)
    )
}

const Description = {
  view: ({ children }) =>
    m('div', { class: 'text-sm' }, children)
}

const HyperscriptHome = () => {
  return {
    view: () => {
      return [

        m(AppHeader),
        m('div', { class: 'container mx-auto pt-4 pb-8 flex items-center justify-center flex-col' },
          m(PageTitle, {
            class: 'text-3xl mb-6 <sm:text-2xl',
            title: config.appName
          }),

          m('div', { class: 'flex flex-row items-center' },
            m('img', { class: 'w-20 <sm:w-14', src: mithrilLogo }),
            m('div', { class: 'font-bold text-5xl px-4' }, '+'),
            m('img', { class: 'w-20 <sm:w-14', src: windiLogo }),
            m('div', { class: 'font-bold text-5xl px-4' }, '+'),
            m('img', { class: 'w-20 <sm:w-14', src: viteLogo })
          ),

          m('div', { class: 'inline-flex flex-row flex-wrap justify-around min-w-full mt-4' },
            m(FeatureBox,
              m(Title, { href: 'https://mithril.js.org/' }, 'Mithril'),
              m(Description, 'Lightweight and unopinionated. You control the DOM. Hyperscript of JSX, pick your flavor.')
            ),
            m(FeatureBox,
              m(Title, { href: 'https://windicss.org/' }, 'Windi CSS'),
              m(Description, 'Utility-first CSS framework for fast prototyping.')
            ),
            m(FeatureBox,
              m(Title, { href: 'https://vitejs.dev/' }, 'Vite'),
              m(Description, 'Next generation front end tooling.')
            ),
            m(FeatureBox,
              m(Title, { href: 'https://github.com/ludbek/powerform/' }, 'Powerform'),
              m(Description, 'Awesome form management and validation.')
            ),
            m(FeatureBox,
              m(Title, m.route.Link({ class: 'text-blue-400', href: '/formi' }, 'Formi')),
              m(Description, 'Powerform wrapper to help you build forms with ease.')
            ),
            m(FeatureBox,
              m(Title, { href: 'https://feathericons.com' },
                m('i', { class: 'icon icon-feather mr-2 text-xl' },
                  'Feather Icons')),
              m(Description, 'Simple and beautiful icons.')
            ),
            m(FeatureBox,
              m(Title, 'Deployment Ready'),
              m(Description, 'Deploy to AWS with ',
                m('a', {
                  class: 'text-blue-400',
                  href: 'https://gulpjs.com',
                  target: '_blank',
                  rel: 'noreferrer'
                },
                'gulp'), '.')
            )
          )
        )
      ]
    }
  }
}

export default HyperscriptHome
