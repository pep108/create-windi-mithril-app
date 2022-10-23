import m from 'mithril'
import MdTableCell from './MdTableCell'

const MdRowWrapper = {
  view: ({ attrs: { className, style }, children }) =>
    // <td className={`md-row ${className || ''}`} style={style}>
    //   {children}
    // </td>
    m('tr', { class: `md-row ${className || ''}`, style }, children)
}

const MdTableRow = {
  onbeforeupdate: function (vnode, old) {
    if (vnode.dom && vnode.dom.classList.contains('md-hide')) {
      console.log('skipping update...')
      return false
    }

    // console.log('table onbeforeUpdate: ', vnode, old)
    return true
  },
  view: ({ attrs: { data, table } }) => {
    // const attrs = vnode.attrs
    // const table = attrs.table
    // const d = attrs.data
    const d = data
    // var index = attrs.index	// todo remove

    let rowCss = 'md-row '

    /**
     * To apply a special css class to any table row, just define a
     * rowCssFn on the table and return the class (eg. ' raw-material')
     */
    if (table.rowCssFn) {
      rowCss += table.rowCssFn(d)
    }

    // If we have an md-select table
    if (table.onRowClick) {
      rowCss += ' md-clickable '
      if ((table.selectedField && d[table.selectedField]) || (d.active && !table.selectedField)) {
        rowCss += ' md-selected '
      }
    }

    /**
     * Since paginated tables just show/hide rows, we keep an _index
     * on the visible rows and will need to use these to determine
     * odd or even
     */
    // if (table._paginated) {
    //   // Hide items that are not in the search results of a
    //   // paginated datatable. Since this only applies on paginated
    //   // tables, we only run it here
    //   if (d._hidden) {
    //     rowCss += ' md-hide '
    //   }
    //   // @ODD/EVEN REMOVE
    //   // else {
    //   // 	// If  row is hidden, then no need to bother with this style.
    //   // 	rowCss += (d._index % 2 === 0) ? ' md-row-even' : ' md-row-odd'
    //   // }
    // }
    // @ODD/EVEN REMOVE
    // else {
    // 	// Add the odd/even classes
    // 	rowCss += (index % 2 === 0) ? ' md-row-even' : ' md-row-odd'
    // }

    // NOTE this currently only supports single nested objects
    // It is used so that we can enter nested fields in the 'field'
    // key, i.e.: 'discount.active'
    // var getField = function (d, th) {
    //   if (th.field.indexOf('.') !== -1) {
    //     var field = th.field.split('.')
    //     return d[field[0]][field[1]]
    //   }
    //   return d[th.field]
    // }

    const rowOptions = {
      key: d.id,
      class: rowCss,
      onclick: table.onRowClick ? function (e) { table.onRowClick(d) } : null
    }
    if (d.disabled) {
      rowOptions.disabled = 'disabled'
    }

    // TODO REMOVE THIS LINE - the above rowOptions gives better control
    // when it comes to adding the disabled attribute
    // { class: rowCss, onclick: table.onRowClick ? function (e) { table.onRowClick(d); } : null }

    return m('tr', rowOptions,
      table.thead.map(function (th) {
        // console.log('table.head.map.....', th, index)

        // @depricated
        // Output any custom fields
        // if (th.fn) {
        //   // Error checking
        //   // If the function is not defined, return an empty cell
        //   if (typeof (table[th.fn]) !== 'function') {
        //     if (typeof (table.renderingFunctions[th.fn]) === 'function') {
        //       return table.renderingFunctions[th.fn](d, th)
        //     }
        //
        //     // No function found, return an empty table div
        //     return m('td', { class: 'md-cell', style: th.style })
        //   }
        //
        //   // Pass the object that is to be rendered in this row, and
        //   // the table header definition
        //   return table[th.fn](d, th)
        // }

        if (th.renderer) {
          // Error checking
          // If the function is not defined, return an empty cell
          /**
           * If we get a string for the renderer, we'll check against our default
           * renderers for a match
           */
          if (typeof th.renderer !== 'function') {
            if (typeof table.renderingFunctions[th.renderer] === 'function') {
              return table.renderingFunctions[th.renderer](d, th)
            }

            console.warn('renderer not found: ', th.renderer)

            // No function found, return an empty table div
            return m(MdTableCell, { style: th.style })
            // return <MdTableCell style={th.style} />
          }

          // Pass the object that is to be rendered in this row, and
          // the table header definition
          return th.renderer(d, th)
        }
        // @todo add checkbox support
        // By checking for the class in the way below, we allow sorting by the checkbox column
        // else if (th.class.indexOf('checkbox-column') > -1) {
        //   // console.log('d: ', d, table)
        //   const disabled = (d.disabled !== undefined || table.tableClasses.indexOf('md-row-select') > -1) ? d.disabled : true
        //   return m('td', { class: 'md-cell md-checkbox-cell', style: th.style },
        //     m(mMaterialDesign.mdCheckbox, {
        //       propagateEvent: true,
        //       active: d[th.field],
        //       disabled
        //     }))
        // }
        else if (th.title === 'Actions') {
          // console.log('TABLE ACTIONS......')
          // console.warn('table: ', table)
          if (table.actions && table.actions.view) {
            return m(table.actions, d)
            // return <table.actions {...d} />
          } else {
            return table.renderActions(d)
          }
        } else {
          // If the field value is nested inside another object,
          // like in the order, we need to get at the value & this
          // is how we do that.
          // NOTE decided that the data should be normalized for
          // search purposes, so this is commented out for now
          // var fieldValue;
          // if (th.field.indexOf('.') > -1) {
          //   var fields = th.field.split('.')
          //
          //   // Initialize the value
          //   fieldValue = d[fields[0]]
          //   var i = 1
          //   while (fields[i]) {
          //     fieldValue = fieldValue[fields[i]]
          //     i++
          //   }
          // }
          // return m('td', { class: 'md-cell ' + th.class }, fieldValue || d[th.field] || '' )

          let tdCSS = 'md-cell '
          // Add the placeholder class
          if (d[th.field] === undefined && th.placeholder) {
            // if (!getField(d, th) && th.placeholder) {
            tdCSS += 'md-placeholder '
          }

          return m('td', {
            key: th.id,
            id: th.id,
            class: tdCSS + th.class,
            style: th.style,
            onclick: th.onclick ? function (e) { th.onclick(e, d) } : null
          }, th.formatter
            ? th.formatter(d[th.field])
            : th.mdRenderer
              ? th.mdRenderer(d, th, table)
              : th.renderer
                ? th.renderer(d, th, table)
                : th.mdFormatter
                  ? m.trust(th.mdFormatter(d, th, table))
                  : d[th.field] === undefined ? (th.placeholder || '') : d[th.field])
          // d[th.field] || th.placeholder || '' )
          // getField(d, th) || th.placeholder || '' )
        }
      })
    )
  }
}

const MdTableExpandedRow = {
  view: ({ attrs: { className, style, table }, children }) =>
    m('tr', {
      class: `md-row ${className || ''}`,
      style
    }, m('td', { class: 'md-cell md-cell-expanded', colspan: table.thead.length }, children))
}

export {
  MdTableRow,
  MdTableExpandedRow,
  MdRowWrapper
}
