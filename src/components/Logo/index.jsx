import './styles.scss'
import m from 'mithril'
import IconLogo from '../IconLogo'

import 'Assets/fonts/brandon-grotesque/style.css'

const Logo = () => {
  return {
    view: () => (
      <div className='flex flex-row relative'>
        <div class='logo'>
          <IconLogo size={40} />
        </div>
        <div class='logo-text flex items-center justify-start font-extrabold h-11 max-w-full position-relative font-brandon-grotesque'>
          <a class='font-brandon-grotesque' href='/index.html'>WindiMithril</a>
        </div>
      </div>
    )
  }
}

export default Logo
