import m from 'mithril'
import './styles.css'
import IconButton from 'Components/IconButton'
// import Account from 'Services/Account'

const StandardMenu = () => {
  const html = document.getElementsByTagName('html')[0]

  return {
    view: () =>
      <div className='header header-fixed header-menu-wrapper w-full px-6 bg-white dark:bg-stone-900 flex items-center justify-between'>
        <div className='inline-flex items-center'>
          {/* Menu Toggle */}
          {/* <i className='icon-menu flex items-center justify-center text-black text-lg mr-2' /> */}
          {/* <Logo height={28} weight='light' />
        <Logo height={28} /> */}
          {/* <Logo height={28} weight='bold' /> */}
          {/* <IconLogo /> */}
        </div>
        <div>
          <div className='flex flex-row items-center'>
            <IconButton onclick={() => window.open(import.meta.env.VITE_GITLAB_URL, '_blank')}>
              <i className='icon icon-gitlab cursor-pointer pr-4' />
            </IconButton>
            <IconButton onclick={() => window.open(import.meta.env.VITE_GITHUB_URL, '_blank')}>
              <i className='icon icon-github cursor-pointer pr-4' />
            </IconButton>
            <IconButton onclick={() => html.classList.toggle('dark')}>
              <i className={`icon icon-${html.classList.contains('dark') ? 'sun' : 'moon'} cursor-pointer pr-4`} />
            </IconButton>

            <div className='text-sm uppercase cursor-pointer'>
              <m.route.Link href='/login' className='font-bold'>Log In</m.route.Link>
            </div>
          </div>
        </div>
        {/* <div className='font-bold text-sm uppercase cursor-pointer'>
        <a className='text-black' onclick={Account.logout}>Log Out</a>
      </div> */}
      </div>
  }
}

const HeaderMenu = {
  view: () => (
    <StandardMenu />
  )
}

export default HeaderMenu
