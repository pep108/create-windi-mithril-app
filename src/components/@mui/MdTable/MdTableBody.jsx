import m from 'mithril'
import { MdEmptyRow } from 'Components/@mui/MdTable'
import MdProgress from '@mui/MdProgress'

import Button from 'Components/Button'
import ErrorContainer from 'Components/ErrorContainer'

const MdTableBody = {
  view: ({ attrs: { table, className, style }, children }) =>
    <tbody className={`md-body ${className || ''}`} style={style}>
      {children}

      {table.error &&
        <MdEmptyRow table={table}>
          <ErrorContainer className='p-4' style='min-height: 200px'>
            <strong>Something went wrong.</strong>
            <Button className='mt-8 lc-button-sm' text='Retry' onclick={() => table.load(1)} />
          </ErrorContainer>
        </MdEmptyRow>}

      {!table.error && (table.loading || !table.items?.length) &&
        <MdEmptyRow table={table}>
          {table.loading && table.items && <MdProgress className='flex justify-center' />}
          {!table.loading && !table.items?.length && <div>No results to show.</div>}
        </MdEmptyRow>}

    </tbody>
}

export default MdTableBody
