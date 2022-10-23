import m from 'mithril'

import { MdRowWrapper } from './MdTableRow'

const MdTableHead = {
  view: ({ attrs: { table } }) => (
    <thead className='md-head'>
      <MdRowWrapper>
        {table.thead.map(th =>
          <th key={th.title} className={`md-column ${th.class || ''}`}>
            {th.title}
          </th>)}
      </MdRowWrapper>
    </thead>
  )
}

export default MdTableHead
