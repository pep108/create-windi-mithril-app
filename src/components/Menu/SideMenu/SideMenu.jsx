import m from 'mithril'
import './sidemenu.scss'
import debounce from 'Utils/debounce'
// import IconLogo from 'Components/IconLogo'
import Logo from 'Components/Logo/index'
// import LogoSVGStatic from 'Components/Logo/LogoSVGStatic'
import CloseMenuToggle from './CloseMenuToggle'

import AccountIcon from 'Components/Icons/Account'
import DashboardIcon from 'Components/Icons/Dashboard'
import AddressBookIcon from 'Components/Icons/AddressBook'
import UserIcon from 'Components/Icons/User'
import SubscriptionIcon from 'Components/Icons/Subscription'
import ToggleIcon from 'Components/Icons/Toggle'

const MenuSection = ({ attrs: { title } }) => {
  return {
    view: () => (
      <li class='menu-section'>
        <h4 class='menu-text'>{title}</h4>
      </li>
    )
  }
}

// dispatch an event that will trigger the sidemenu to close
const handleItemClick = () =>
  window.dispatchEvent(new CustomEvent('sidemenu:item-click', { detail: 1 }))

const MenuChild = () => {
  // console.log('menuChild...', text)
  // let isActive = m.route.get() === route
  // console.log('route: ', m.route.get(), route, isActive, active)

  return {
    view: ({ attrs: { className = '', text, route, isActive } }) => (
      <m.route.Link
        selector='div'
        href={route}
        onclick={handleItemClick}
        className={`${className} submenu-item py-2 px-6 hover:bg-slate-700 cursor-pointer`}
      >
        <span className={`ml-2 text-sm text-gray-300 ${isActive ? 'font-extrabold' : ''}`}>{text}</span>
      </m.route.Link>
    )
  }
}

/**
 * @todo
 * this component can be extended to handle submenus with expansion & animation
 * @param {} param0
 * @returns
 */
const MenuItem = () => {
  let dom = null

  return {
    oncreate: (vnode) => { dom = vnode.dom },
    view: ({ attrs: { icon, text, route, isActive }, children }) => {
      return (
        <li className={'menu-item' + (isActive ? ' menu-item-active menu-item-open' : '') + (children.length ? ' menu-item-submenu' : '')}>
          <m.route.Link href={route} selector='a' className='menu-link' onclick={handleItemClick}>
            <span class='svg-icon menu-icon'>
              {icon && icon}
            </span>
            <span class='menu-text'>{text}</span>
            {children.length > 0 && <i class='menu-arrow icon-chevron-right' />}
          </m.route.Link>
          {children.length > 0 && (
            children
          )}
        </li>
      )
    }
  }
}

const SideMenu = ({ attrs: { roles } }) => {
  const body = document.querySelector('body')
  let hovering = false

  body.classList.add('aside-fixed')

  console.warn('roles: ', roles)

  /**
   * initialize sidemenu
   */
  let status = localStorage.getItem('SIDE_MENU') || 'OPEN'
  if (status === 'CLOSED') {
    body.classList.add('aside-minimize')
  }

  const handleToggleSideMenu = () => {
    body.classList.toggle('aside-minimize')

    // Save this setting
    status = (status === 'OPEN') ? 'CLOSED' : 'OPEN'
    localStorage.setItem('SIDE_MENU', status)
  }

  return {
    oncreate: ({ dom }) => {
      const menu = dom.querySelector('#aside_menu')

      const setStyle = () => {
        const { y } = menu.getBoundingClientRect()
        menu.style.height = `${window.innerHeight - y - 13}px`
        menu.style.overflowY = 'scroll'
      }
      setStyle()

      const debounced = debounce(setStyle, 200)

      const setAsideHover = () => {
        if (!hovering) {
          body.classList.add('aside-minimize-hover')
          hovering = true
        }
      }
      const unsetAsideHover = () => {
        if (hovering) {
          body.classList.remove('aside-minimize-hover')
          hovering = false
        }
      }

      window.addEventListener('resize', debounced, false)
      menu.addEventListener('mouseover', setAsideHover, false)
      menu.addEventListener('mouseout', unsetAsideHover, false)
    },
    // onremove: () => {
    //   document.body.classList.add('aside-fixed')
    // },
    view: ({ attrs: { height, weight } }) => {
      const currentRoute = m.route.get()
      const isHidden = !!(typeof currentRoute === 'undefined' || currentRoute.indexOf('/protips/') > -1 || currentRoute === '/create-protip')
      // console.log(`sidemenu.....*${currentRoute}*`, isHidden)

      if (isHidden) {
        document.body.classList.remove('aside-fixed')
      } else {
        document.body.classList.add('aside-fixed')
      }

      return (
        <div class='aside aside-left aside-fixed' style={isHidden ? 'display: none;' : ''}>
          <div class='brand flex-column-auto' id='kt_brand' style=''>
            <a class='brand-logo'>
              <Logo />
            </a>
            <CloseMenuToggle onClick={handleToggleSideMenu} />
          </div>
          <div class='aside-menu-wrapper flex-column-fluid'>
            <div id='aside_menu' class='aside-menu my-4 scroll'>
              <ul class='menu-nav'>
                <MenuItem
                  text='Dashboard'
                  route=''
                  isActive={currentRoute === ''}
                  icon={<DashboardIcon />}
                />

                {/* {roles.includes('orders') && */}
                <MenuItem
                  text='My Contacts'
                  route='/contacts'
                  isActive={currentRoute === '/contacts'}
                  icon={<AddressBookIcon />}
                />

                {roles.includes('reports') &&
                  <MenuItem
                    text='Reports'
                    route='/reports'
                    isActive={currentRoute === '/reports'}
                    icon={<DashboardIcon />}
                  />}

                {/* <MenuItem
                  text='Account'
                  route='/account'
                  isActive={currentRoute === '/account'}
                  icon={<AccountIcon />}
                /> */}
                {/* } */}
                {/* {roles.includes('protips') &&
                  <MenuItem
                    text='Pro Tips'
                    route='/protips'
                    isActive={['/protips', '/create-protip', '/categories', '/tags'].includes(currentRoute)}
                    icon={<AccountIcon />}
                  >
                    <MenuChild
                      text='All Pro Tips'
                      route='/protips'
                      isActive={currentRoute === '/protips'}
                      // className='mt-3 '
                    />
                    <MenuChild
                      text='Add New'
                      route='/create-protip'
                      isActive={currentRoute === '/create-protip'}
                    />
                    <MenuChild
                      text='Categories'
                      route='/categories'
                      isActive={currentRoute === '/categories'}
                    />
                    <MenuChild
                      text='Tags'
                      route='/tags'
                      isActive={currentRoute === '/tags'}
                    />
                  </MenuItem>} */}
                {/* <MenuItem
                  text='Subscriptions'
                  route='/subscriptions'
                  isActive={currentRoute === '/subscriptions'}
                  icon={<SubscriptionIcon />}
                />
                <MenuItem
                  text='Devices'
                  route='/devices'
                  isActive={currentRoute === '/devices'}
                  icon={<ToggleIcon />}
                />
                <MenuItem
                  text='Users'
                  route='/users'
                  icon={<UserIcon />}
                /> */}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default SideMenu
