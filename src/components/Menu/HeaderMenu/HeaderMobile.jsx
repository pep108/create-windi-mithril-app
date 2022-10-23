import m from 'mithril'
import IconLogo from 'Components/IconLogo'
import UserIcon from '../../Icons/User'

const HeaderMobile = () => {
  const body = document.body
  let menuDIV = null
  let overlay = null
  let topbarOpen = false
  let sideMenuOpen = false

  const toggleTopbar = () => {
    topbarOpen = !topbarOpen

    if (topbarOpen) {
      body.classList.add('topbar-mobile-on')
    } else {
      body.classList.remove('topbar-mobile-on')
    }
  }

  const createOverlay = () => {
    overlay = document.createElement('div')
    overlay.classList.add('aside-overlay')
    overlay.addEventListener('click', () => { handleToggleSideMenu() })

    menuDIV.parentNode.insertBefore(overlay, menuDIV.nextSibling)
  }

  const handleToggleSideMenu = () => {
    sideMenuOpen = !sideMenuOpen

    if (sideMenuOpen) {
      menuDIV.classList.add('aside-on')
      createOverlay()
    } else {
      menuDIV.classList.remove('aside-on')
      overlay.remove()
    }
  }

  window.addEventListener('sidemenu:item-click', () => {
    if (sideMenuOpen) {
      handleToggleSideMenu()
    }
  })

  const StandardMenu = () => ({
    view: () => {
      return (
        <>
          {/* <!--begin::Logo--> */}
          <m.route.Link selector='a' href='/'>
            <IconLogo size={32} />
          </m.route.Link>
          {/* <!--end::Logo--> */}
          {/* <!--begin::Toolbar--> */}
          <div class='flex items-center justify-end'>
            {/* <!--begin::Aside Mobile Toggle--> */}
            <button
              class='p-0 burger-icon burger-icon-left'
              onclick={handleToggleSideMenu}
            >
              <span />
            </button>
            {/* <!--end::Aside Mobile Toggle--> */}

            {/* <!--begin::Header Menu Mobile Toggle--> */}
            {/* <button class='p-0 burger-icon !ml-2'>
            <span />
          </button> */}
            {/* <!--end::Header Menu Mobile Toggle--> */}

            {/* <!--begin::Topbar Mobile Toggle--> */}
            {/* @todo - add this back */}
            {/* <button class='btn-hover-text-primary p-0 ml-2' onclick={toggleTopbar}>
              <span class='svg-icon svg-icon-xl'>
                <UserIcon />
              </span>
            </button> */}
            {/* <!--end::Topbar Mobile Toggle--> */}
          </div>
          {/* <!--end::Toolbar--> */}
        </>
      )
    }
  })

  return {
    oncreate: ({ dom }) => {
      menuDIV = document.querySelector('.aside')
    },
    view: ({ attrs: { height, weight } }) => {
      return (
        <div class='header-mobile flex items-center header-mobile-fixed dark:bg-stone-900'>
          <StandardMenu />
        </div>
      )
    }
  }
}

export default HeaderMobile
