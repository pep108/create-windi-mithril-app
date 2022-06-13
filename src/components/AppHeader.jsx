import m from 'mithril'
import config from '/config'
import Logo from './Logo'
import IconButton from './IconButton'

const AppHeader = () => {
  const html = document.getElementsByTagName('html')[0]

  return {
    view: () => {
      return (
        <div
          className='app-header w-full px-6 bg-white dark:bg-stone-900 dark:text-stone-300 flex items-center justify-between'
          style={{ height: '60px' }}
        >
          <div className='flex flex-row items-center'>
            <i className='icon icon-menu cursor-pointer pr-4' onclick={() => alert('open menu')} />
            <div className='<sm:hidden'>
              <m.route.Link href='/' selector='div' className='cursor-pointer'>
                <Logo />
              </m.route.Link>
            </div>
          </div>
          <div className='flex flex-row items-center'>
            <IconButton onclick={() => window.open(config.gitlabUrl, '_blank')}>
              <i className='icon icon-gitlab cursor-pointer pr-4' />
            </IconButton>
            <IconButton onclick={() => window.open(config.githubUrl, '_blank')}>
              <i className='icon icon-github cursor-pointer pr-4' />
            </IconButton>
            <IconButton onclick={() => html.classList.toggle('dark')}>
              <i className={`icon icon-${html.classList.contains('dark') ? 'sun' : 'moon'} cursor-pointer pr-4`} />
            </IconButton>

            <div className='font-bold text-sm uppercase cursor-pointer'>
              <m.route.Link href='/login'>Log In</m.route.Link>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default AppHeader
