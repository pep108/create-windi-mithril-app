import m from 'mithril'
// import randomString from 'Utils/randomString'
import SearchToolbar from './SearchToolbar'
import MdIcon from '../MdIcon'
import { closeCircleOutline } from '@mui/icons'
import { MdSelect } from '../MdSelect'
import { randomString } from './utils'

const MdToolbar = {
  view: ({ children }) => (
    <md-toolbar
      className='md-table-toolbar layout-row layout-xs-column'
      ariaHidden='false'
    >{children}
    </md-toolbar>
  )
}

const MdToolbarButtonContainer = {
  view: ({ children }) =>
    <div className='toolbar-button-container'>{children}</div>
}

const MdToolbarFilterContainer = {
  view: ({ attrs: { className }, children }) =>
    <div className={`toolbar-filter-container ${className}`}>{children}</div>
}

/**
 * This component renders a small close button that will
 * reset a table filter to ALL
 */
const MdFilterAppend = {
  view: ({ attrs: { filter, style, onclick, hidden } }) => {
    // const attrs = vnode.attrs
    filter = filter || {}

    // console.warn('filterAppend: ', attrs)

    return (
      <div
        className={`filter-append ${filter.name === 'all' || hidden ? 'md-hide' : ''}`}
        style={style || ''}
      >
        <MdIcon
          icon={closeCircleOutline}
          size={18}
          onclick={onclick}
        />
      </div>
    )

    // return [
    //   m('div', {
    //     class: 'filter-append' + ((filter.name === 'all' || attrs.hidden) ? ' hc-hide' : ''),
    //     style: attrs.style || ''
    //   }, m('a', { onclick: attrs.onclick },
    //     m(MdIcon, {
    //       icon: 'close_circle_outline',
    //       size: 18
    //     })
    //   ))
    // ]
  }
}

const MdToolbarButton = {
  view: ({ attrs: { style, title, disabled, onclick, icon } }) =>
    <div className='toolbar-button flex-center layout-column' style={style || ''}>
      <label className='md-select-label' style='margin: 0 0 4px 0'>{title}</label>
      <button
        className={`md-button md-icon-button button-solid-bg nomargin ${disabled ? 'disabled' : ''}`}
        onclick={onclick}
      >
        {icon || <i className='material-icons' ariaLabel={title}>add</i>}
      </button>
    </div>
}

const MdToolbarSearch = {
  view: function ({ attrs }) {
    const table = attrs.table
    return (
      <div className='md-toolbar-tools flex-50 flex-sm-100 flex-xs-100'>
        <SearchToolbar
          {...attrs}
          // appendInput={attrs.appendInput}
          // searchOptions={attrs.searchOptions}
          // searchOptionCB={attrs.searchOptionCB}
          // placeholder={attrs.placeholder}
          width={100}
          containerCSS='display: inherit; padding: 14px 0;'
          value={table._search}
          table={table}
          cb={table.api.updateSearch}
          onenter={() => table.api.execSearch(true)}
        />
      </div>
    )

    // @todo remove block
    // return m('div', { class: 'md-toolbar-tools flex-50 flex-sm-100 flex-xs-100' },
    //   m(SearchToolbar.Component, {
    //     appendInput: attrs.appendInput,
    //     searchOptions: attrs.searchOptions,
    //     searchOptionCB: attrs.searchOptionCB,
    //     containerCSS: 'display: inherit; padding: 14px 0;',
    //     placeholder: attrs.placeholder,
    //     width: 100,
    //     value: table._search,
    //     table,
    //     // sesarchOptions: attrs.sesarchOptions,
    //     // searchOptionCB: attrs.searchOptionCB,
    //     cb: function (val) {
    //       table.api.updateSearch(val)
    //     },
    //     onenter: function () {
    //       table.api.execSearch(true)
    //     }
    //   })
    // )
  }
}

const MdToolbarFilter = () => {
  const id = randomString(5)

  return {
    view: ({ attrs: { table, filter, style, title, disabled } }) => {
      // const table = attrs.table
      // const filter = attrs.filter
      const filterObj = table._filter[filter]

      if (!filterObj) {
        console.warn('missing filter on table: ', filter)
      }

      return (
        <div className='md-table-filter' style={style || ''}>
          <label className='md-select-label'>{title}</label>
          <div className='md-filter-container'>
            <MdSelect
              id={id}
              name='filter'
              ariaLabel={`${title} Filter`}
              value={filterObj.name}
              options={table._filterOptions[filter]}
              containerClass=''
              style=''// This style goes on the md-select element
            // required
              onchange={(val) => {
                console.error('update the status filter...', val)

                if (disabled) { return }

                table.api.setFilter(filter, val)
              }}
            />
            <MdFilterAppend
              filter={filterObj}
              onclick={(e) => {
                e.stopPropagation()

                if (disabled) { return }

                table.api.setFilter(filter, 'all')
              }}
            />
          </div>
        </div>
      )

      // return [
      //   m('div', { class: 'md-table-filter', style: attrs.style || '' },
      //     m('label', { class: 'md-select-label' }, attrs.title),
      //     m(mui.mdSelect, {
      //       id: this.id,
      //       name: 'filter',
      //       'aria-label': attrs.title + ' Filter',
      //       value: table._filter[filter].name,
      //       options: table._filterOptions[filter],
      //       containerClass: '',
      //       style: '', // This style goes on the md-select element
      //       required: '',
      //       // NOTE: not functional
      //       onchange: function (val) {
      //         console.error('update the status filter...', val)
      //
      //         if (attrs.disabled) { return }
      //
      //         table.api.setFilter(filter, val)
      //       }
      //     }),
      //     m(mui.mdFilterAppend, {
      //       filter: table._filter[filter],
      //       onclick: function (e) {
      //         e.stopPropagation()
      //
      //         if (attrs.disabled) { return }
      //
      //         table.api.setFilter(filter, 'all')
      //       }
      //     })
      //   )
      // ]
    }
  }
}

export {
  MdToolbar,
  MdToolbarButtonContainer,
  MdToolbarFilterContainer,
  MdToolbarButton,
  MdToolbarSearch,
  MdToolbarFilter,
  MdFilterAppend
}
