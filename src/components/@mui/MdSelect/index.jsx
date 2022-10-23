import './md-select.css'

import m from 'mithril'

// const debug = function () { }
const debug = console.log.bind(window.console, '[md-select]: ')

// const SCROLL_MASK = '<div class="md-scroll-mask" style="z-index: 14000; position: fixed;"><div class="md-scroll-mask-bar"></div></div>'
const SCROLL_MASK = document.createElement('div')
SCROLL_MASK.classList.add('md-scroll-mask')
SCROLL_MASK.style.zIndex = 14000
SCROLL_MASK.style.position = 'fixed'
SCROLL_MASK.innerHTML = '<div class="md-scroll-mask-bar"></div>'

const MdSelectOptions = {
  oncreate: function ({ dom }) {
    const el = dom

    el.classList.add('md-hide')
    const selectID = el.parentElement.id.replace('-options', '')
    const selectElement = document.querySelector(`md-select#${selectID}`)
    const selectBounds = selectElement.getBoundingClientRect()

    setTimeout(function () {
      el.style.top = selectBounds.top + 'px'
      el.style.left = (selectBounds.left - el.clientWidth) + 'px'
      el.classList.remove('md-hide')
    }, 80)
  },
  view: function ({ attrs: { value, options, className, onclick, open } }) {
    const self = this

    const callback = function () {
      debug('callback....')
      self.open = !self.open
    }

    return (
      <div className={`_md-select-menu-container md-fixed ${className} ${open ? '_md-active _md-clickable' : '_md-leave'}`}>
        <md-select-menu style='transform-origin: 34px 32px 0px;'>
          <md-content>
            <div />
            {options?.map(o => {
              let text = o
              let selected = (value === text)
              if (typeof o === 'object') {
                text = o.text
                selected = (value.text === text)
              }

              return (
                <md-option
                  key='text'
                  role='option'
                  selected={selected}
                  onclick={(e) => { onclick(e, o, callback) }}
                >
                  <div className='_md-text'>{text}</div>
                </md-option>
              )
            })}
          </md-content>
        </md-select-menu>
      </div>
    )
    // return [
    //   m('div', {
    //     class: '_md-select-menu-container md-fixed ' + css
    //   }, m('md-select-menu', { style: 'transform-origin: 34px 32px 0px;' },
    //     m('md-content',
    //       m('div'),
    //       attrs.options
    //         ? [
    //             attrs.options.map(function (o) {
    //               let text = o
    //               let selected = (attrs.value === text)
    //               if (typeof (o) === 'object') {
    //                 text = o.text
    //                 selected = (attrs.value.text === text)
    //               }

    //               return [
    //                 m('md-option', {
    //                   key: text,
    //                   role: 'option',
    //                   selected,
    //                   onclick: (e) => { attrs.onclick(e, o, callback) }
    //                 }, m('div', { class: '_md-text' }, text))
    //               ]
    //             })
    //           ]
    //         : null
    //     )
    //   )
    //   )
    // ]
  }
}

/**
 * @param {string} value
 * @param {[]string} options
 */
const MdSelect = ({ attrs }) => {
  const body = document.body
  let _open = false
  let el = null
  const containerId = `${attrs.id}-options`

  const getDOMElement = () => document.querySelector(`#${containerId}`)

  function initScrollMaskEvents () {
    document.querySelector('.md-scroll-mask').addEventListener('click', (e) => {
      _open = false
      m.redraw()
      removeScrollMask()
      cleanupSelect()
    })
  }

  function selectOption (e, option, cb) {
    debug('select option.....', option, attrs)
    attrs.onchange(option, e)
    _open = false
    m.redraw()
    removeScrollMask()
    cleanupSelect()
  }

  function removeScrollMask () {
    document.querySelector('.md-scroll-mask').remove()
  }

  function cleanupSelect () {
    // cleanup the select container
    const container = getDOMElement()
    m.mount(container, null) // make sure we don't end up with a memory leak
    container.remove()
    body.classList.remove('md-lockscroll')
  }

  function _adjustPosition (menuContainer) {
    debug('[md-select] adjusting position...')
    // const menuContainer = el.querySelector('._md-select-menu-container')
    const triggerBounds = el.getBoundingClientRect()

    console.log('menuContainer: ', menuContainer)

    const offsetTop = menuContainer.offsetTop
    const height = menuContainer.offsetHeight
    const windowHeight = window.innerHeight
    if (offsetTop + height > windowHeight) {
      // Adjust the top style of the element so the entire select is in the view
      const diff = windowHeight - (offsetTop + height) - ((windowHeight - triggerBounds.bottom) / 2)
      menuContainer.style.top = (offsetTop + diff) + 'px'
      // menuContainer.style.display = 'block'
    }
  }

  const open = (e, attrs) => {
    if (e) { e.stopPropagation() }

    _open = true
    body.classList.add('md-lockscroll')

    if (!document.querySelector(`#${containerId}`)) {
      // body.appendChild(`${SCROLL_MASK}<div id="${containerId}"></div>`)
      body.appendChild(SCROLL_MASK)
      const containerEl = document.createElement('div')
      containerEl.id = containerId
      body.appendChild(containerEl)

      // m.mount(document.querySelector(`#${containerId}`), {
      m.mount(containerEl, {
        oncreate: ({ dom }) => {
          _adjustPosition(dom)
        },
        view: () => <MdSelectOptions {...attrs} onclick={selectOption} open={_open} />

        // @todo remove
        // {
        //   return m(mdSelectOptions, {
        //     class: attrs.className,
        //     selected: attrs.value,
        //     options: attrs.options,
        //     click: selectOption,
        //     open: self._open
        //   })
        // }
      })
      initScrollMaskEvents()
    } else {
      const mask = document.querySelector('.md-scroll-mask')
      // const el = getDOMElement()

      el.insertBefore(mask, el.children[0])

      initScrollMaskEvents()
    }
    // setTimeout(function () {
    //   _adjustPosition()
    // }, 80)
  }

  return {
    oncreate: function ({ attrs, dom }) {
      el = dom

      setTimeout(function () {
        if (attrs._open) {
          self.open(null, attrs)
        }
      }, 80)

      if (typeof (attrs.oncreateCB) === 'function') {
        attrs.oncreateCB(self)
      }
    },
    view: function ({ attrs }) {
      // const self = this
      // const attrs = vnode.attrs

      Object.assign(attrs, {
        tabindex: 0,
        class: attrs.containerClass,
        role: 'listbox',
        onclick: (e) => { open(e, attrs) }
      })

      const text = (typeof (attrs.value) === 'object') ? (attrs.value.altText || attrs.value.text) : attrs.value

      return (
        <md-select {...attrs}>
          <md-select-value className='_md-select-value'>
            <span>
              <div className='_md-text'>{text}</div>
            </span>
            <span className='_md-select-icon' />
          </md-select-value>
        </md-select>
      )
      // m('md-select', attrs,
      //   m('md-select-value', { class: '_md-select-value' },
      //     m('span',
      //       m('div', { class: '_md-text' }, text)
      //     ),
      //     m('span', { class: '_md-select-icon' })
      //   )
      // )
      // ]
    }
  }
}

export { MdSelect }
