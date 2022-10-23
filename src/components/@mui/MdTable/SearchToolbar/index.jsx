import './search-toolbar.css'
import m from 'mithril'

import MdIcon from '@mui/MdIcon'
import { clear, search } from '@mui/icons'

import { isFunction } from '../utils'

const debug = function () { }
// const debug = console.log.bind(window.console, '[search-toolbar]: ')

const ICON = {
  clear,
  search
}

// var KEYARROW_UP = 38
// var KEYARROW_DOWN = 40
// var ENTER = 13
// var KEYLEFT = 37
// var KEYRIGHT = 39

/**
 * Search Toolbar
 * @param {string} value
 * @param {function} cb (callback)
 */
const SearchToolbar = ({ attrs }) => {
  let inputEl = null
  let icon = attrs.value ? 'clear' : 'search'
  let query = ''

  return {
    oncreate: ({ attrs: { autofocus, typeAhead, onenter, table }, dom }) => {
      inputEl = dom.querySelector('input')

      if (autofocus) {
        inputEl.focus()
      }

      if (typeAhead) {
        inputEl.addEventListener('focus', function (e) {
          e.stopPropagation()

          table.typeAhead.open()
        })
      }

      if (typeof onenter === 'function') {
        inputEl.addEventListener('keypress', function (e) {
          if (e.which === 13) {	// ENTER
            onenter()
          }
        })
      }
    },
    view: (vnode) => {
      const state = vnode.state
      const attrs = vnode.attrs
      const width = attrs.width || 50

      const handleInput = e => {
        const val = e.target.value
        icon = (val && val !== '') ? 'clear' : 'search'
        query = val

        attrs.cb(val)
      }

      const iconClick = function (e) {
        console.error('click on icon....', state.icon)
        if (e) {
          e.stopPropagation()
          e.preventDefault()
        }

        // @todo add this in later
        // if (icon === 'search') {
        //   if (typeof openPopover !== 'undefined') {
        //     openPopover(e)
        //   }
        //
        //   return
        // }

        if (icon === 'clear') {
          icon = 'search'
          query = ''
          inputEl.value = ''
          attrs.cb('')

          // Focus the input
          inputEl.focus()
        }
      }

      // Make sure we can reset the query from an outside controller
      // NOTE: This code is causing problems right now
      if (query !== attrs.value) {
        debug('query changed....', query, attrs.value)

        if (attrs.value === undefined) {
          if (icon === 'clear') {
            iconClick()
          }

          // Since the input was just cleared, we want to reset the table
          // and to do that we need to trigger the onenter function
          if (isFunction(attrs.onenter)) {
            attrs.onenter()
          }
        }

        query = attrs.value
      }

      // console.log('attrs: ', attrs)
      return (
        <div
          // key='toolbar-search'
          className={`toolbar-search flex-${width}`}
          style={attrs.containerCSS || ''}
        >
          <MdIcon
            id='search-icon'
            icon={ICON[icon]}
            className={attrs.value ? 'hover-pointer' : ''}
            style='margin: 6px 10px;'
            onclick={iconClick}
          />
          <input
            // key='search-input'
            type='text'
            name='search'
            className='md-input search'
            placeholder={attrs.placeholder || 'search'}
            ariaInvalid='false'
            value={attrs.value}
            oninput={handleInput}
            autocomplete='off'
            tabindex='1'
          />
          {attrs.appendInput
            ? <attrs.appendInput />
            : <div className='flex' />}
        </div>
      )

      // @keep for implementation of the popover
      // return [
      //   m('div', {
      //     class: 'flex-' + width + ' toolbar-search',
      //     style: attrs.containerCSS || ''
      //   }, m(mui.icon, {
      //     id: 'search-icon',
      //     icon: state.icon,
      //     css: !attrs.value ? ' hover-pointer' : '',
      //     style: 'margin: 6px 10px;',
      //     onclick: iconClick
      //   }), (attrs.searchOptions && state.icon === 'search')
      //     ? m(PopoverButton.Component, {
      //       title: '',
      //       attach: 'left',
      //       selector: '#search-icon',
      //       // left: 11,
      //       aCss: 'private-button__link',
      //       options: attrs.searchOptions,	// .map(function (o) { return { text: o.text} }),
      //       cb: function (val) {
      //         console.log('option clicked....', val)
      //         if (typeof (attrs.searchOptionCB) === 'function') {
      //           attrs.searchOptionCB(val)

      //           state.inputElem.focus()
      //         } else {
      //           console.warn('attrs.searchOptionCB is not a function')
      //         }
      //       },
      //       oncreateCB: function (fn) {
      //         state.openPopover = fn
      //       }
      //     })
      //     : null,
      //   m('input', {
      //     key: 'search-input',
      //     type: 'text',
      //     name: 'search',
      //     class: 'search',
      //     placeholder: attrs.placeholder || 'search',
      //     'aria-invalid': false,
      //     value: attrs.value,
      //     oninput: m.withAttr('value', handleInput),
      //     autocomplete: 'off',
      //     tabindex: 1
      //   }),
      //   attrs.appendInput
      //     ? attrs.appendInput
      //     : m('div', { class: 'flex' })
      //   )
      // ]
    }
  }
}

export default SearchToolbar
