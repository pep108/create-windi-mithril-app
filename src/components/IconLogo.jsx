import m from 'mithril'
// import icon from 'Assets/icon/icon-152.png'
import logo from 'Assets/logo/logo-451x100.jpg'

const IconLogo = {
  view: ({ attrs: { size } }) => {
    return <img src={logo} style={{ height: `${size || 50}px` }} />
  }
}

export default IconLogo
