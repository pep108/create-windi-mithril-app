import m from 'mithril'

const MdTableCell = {
  view: ({ attrs: { className, style }, children }) => (
    <td className={`md-cell ${className || ''}`} style={style}>
      {children}
    </td>
  )
}

export default MdTableCell
