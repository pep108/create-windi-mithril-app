import m from 'mithril'
import LogoSVG from './LogoSVG'
import 'Assets/fonts/brandon-grotesque/style.css'

const Logo = () => {
  return {
    view: () => (
      <div className='flex flex-row relative'>
        <div class='logo'>
          <LogoSVG />
        </div>
        <div class='logo-text flex items-center justify-start font-extrabold h-11 max-w-full position-relative font-brandon-grotesque'>
          <a class='font-brandon-grotesque' href='/index.html'>AppName</a>
        </div>
      </div>
    )
  }
}

export default Logo
