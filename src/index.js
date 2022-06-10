import m from 'mithril'
import 'virtual:windi.css'

// Base Stylesheets
import './styles/normalize.css'
import './styles/base.css'
import './assets/fonts/feather/style.css'
import './assets/fonts/proxima-nova/style.css'
import './styles/theme.css'

// Views
import Home from './views/Home'
import FormiExample from './views/FormiExample'
import Login from './views/Login/Login'
import { ForgotPassword } from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'
import CreateAccount from './views/CreateAccount'

(function () {
  const Routes = {
    '/': Home,
    '/formi': FormiExample,
    '/login': Login,
    '/forgot-password': ForgotPassword,
    '/reset-password': ResetPassword,
    '/sign-up': CreateAccount
  }

  const Router = {
    oncreate: function (vnode) {
      // Use a timeout to avoid m.redraw.sync() error
      setTimeout(() => {
        m.route(vnode.dom, '/', Routes)
      }, 10)
    },
    view: function () {
      return m('div', { class: 'content' })
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    m.mount(document.body, {
      view: () => {
        return m('div', {
          class: `min-h-screen dark:bg-stone-${m.route.get() === '/login' ? '900' : '800'} dark:text-stone-300`
        }, m(Router))
      }
    })
  })
}())
