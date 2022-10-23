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
import PageLayout from 'Components/PageLayout'

// import SideMenu from './components/Menu/SideMenu'

(function () {
  const DefaultRoute = '/'
  const Routes = {
    '/': { view: () => m(PageLayout, m(Home)) },
    '/home': HyperscriptHome,
    '/formi': { view: () => m(PageLayout, m(FormiExample)) },
    '/login': { view: () => m(PageLayout, m(Login)) },
    '/forgot-password': { view: () => m(PageLayout, m(ForgotPassword)) },
    '/reset-password': { view: () => m(PageLayout, m(ResetPassword)) },
    '/sign-up': { view: () => m(PageLayout, m(CreateAccount)) },
    '/components': { view: () => m(PageLayout, m(KitchenSink)) }

  }

  m.route(document.body.querySelector('#root'), DefaultRoute, Routes)
}())
