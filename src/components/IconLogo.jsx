import m from 'mithril'
import logo from 'Assets/logo/rnn-owl.png'

const IconLogo = {
  view: ({ attrs: { size } }) => {
    return <img src={logo} style={{ height: `${size || 50}px` }} />
  }
}

export default IconLogo
