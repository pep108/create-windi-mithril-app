import m from 'mithril'
import './styles.css'
import Account from '/services/Account'

const StandardMenu = {
  view: () =>
    <div className='header header-fixed header-menu-wrapper w-full px-6 bg-white flex items-center justify-between'>
      <div className='inline-flex items-center'>
        {/* Menu Toggle */}
        {/* <i className='icon-menu flex items-center justify-center text-black text-lg mr-2' /> */}
        {/* <Logo height={28} weight='light' />
        <Logo height={28} /> */}
        {/* <Logo height={28} weight='bold' /> */}
        {/* <IconLogo /> */}
      </div>
      {/* <div className='font-bold text-sm uppercase cursor-pointer'>
        <a className='text-black' onclick={Account.logout}>Log Out</a>
      </div> */}
    </div>
}

const HeaderMenu = {
  view: () => (
    <StandardMenu />
  )
}

export default HeaderMenu
