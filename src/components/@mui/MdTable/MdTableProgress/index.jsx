import './md-table-progress.css'
import m from 'mithril'

import MdProgressLinear from '@mui/MdProgressLinear'

const MdTableProgress = {
  view: ({ attrs: { loaded, colSpan } }) =>
    <tr className={loaded ? 'md-hide' : 'md-table-loading'}>
      <th colspan={colSpan}>
        <MdProgressLinear />
      </th>
    </tr>
}

export default MdTableProgress
