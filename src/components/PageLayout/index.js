import './styles.scss'
import m from 'mithril'
import Dialog from '../dialog'
import Notifications from '../notifications'
import Account from 'Services/Account'
import { HeaderMobile, HeaderMenu, TopBar } from '../Menu/HeaderMenu'
import SideMenu from '../Menu/SideMenu'

window.Notifications = Notifications

/**
 * A component that wraps another component with some common
 * page layout markup and styles.
 */
const PageLayout = () => {
  const claims = Account.claims()

  return {
    oncreate: () => {
      setTimeout(() => {
        document.body.classList.remove('loading')
      }, 1600)
    },
    view: ({ children }) => [
      m(Notifications),
      m('div', { class: 'min-h-screen dark:bg-stone-800 dark:text-stone-300' },
        m(HeaderMobile, { roles: claims?.roles || [] }),

        m('div', { class: 'wrapper' },
          m(SideMenu, { roles: claims?.roles || [] }),
          m(HeaderMenu),
          m(TopBar),
          m('div', { class: 'content' }, children),

          m(Dialog),
          m('div', { class: 'hc-overlay' })

          // m(MediaModal)
        )
      )
    ]
  }
}

export default PageLayout
