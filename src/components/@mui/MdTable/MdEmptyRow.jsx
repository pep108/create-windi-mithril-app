import m from 'mithril'

import randomString from 'Utils/randomString'

const MdEmptyRow = () => {
  const key = randomString(8)

  return {
    // oncreate: ({ dom }) => {
    //   dom.style.minWidth = dom.scrollWidth + 'px'
    // },
    view: function ({ attrs, children }) {
      // const table = attrs.table
      // let msg = attrs.message
      // if (!msg && table) {
      //   const messages = table.messages || {}
      //   // msg = mui.filtersApplied(table._filter) ? messages.noMatch : messages.empty
      //   msg = 'No results'
      // }
      // msg = msg || 'No results to show.'

      return (
        <tr
          key={key}
          role='row'
          className='md-row'
          // style={`width: ${attrs.width}`}
        >
          <td
            role='gridcell'
            className='md-cell md-center'
            colSpan={attrs.table.thead.length}
          >{children}
            {/* {children?.length
              ? children
              : attrs.message || 'No results to show.'} */}
          </td>
        </tr>
      )
    }
  }
}

export default MdEmptyRow
