import m from 'mithril'
import 'virtual:windi.css'

// Fonts
import './assets/fonts/feather/style.css'
import './assets/fonts/proxima-nova/style.css'

/* Include global app styles here, so that it will over ride component's css styles */
import './app.scss'

// Views
import Home from './views/Home'
import HyperscriptHome from './views/HyperscriptHome'
import FormiExample from './views/FormiExample'
import Login from './views/Login/Login'
import { ForgotPassword } from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'
import CreateAccount from './views/CreateAccount'
import KitchenSink from './views/KitchenSink'

// import SideMenu from './components/Menu/SideMenu'

(function () {
  const Routes = {
    '/': Home,
    '/home': HyperscriptHome,
    '/formi': FormiExample,
    '/login': Login,
    '/forgot-password': ForgotPassword,
    '/reset-password': ResetPassword,
    '/sign-up': CreateAccount,
    '/kitchen-sink': KitchenSink
  }

  const Router = {
    oncreate: (vnode) => {
      // Use a timeout to avoid m.redraw.sync() error
      setTimeout(() => {
        m.route(vnode.dom, '/', Routes)
      }, 10)
    },
    view: () => {
      return m('div', { class: 'wrapper' })
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    m.mount(document.body, {
      view: () => {
        return m('div', {
          class: `min-h-screen dark:bg-stone-${m.route.get() === '/login' ? '900' : '800'} dark:text-stone-300`
        },
        m('div',
          // m(SideMenu, { roles: [] }),
          m(Router)
        ))
      }
    })
  })
}())
