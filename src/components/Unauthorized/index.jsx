import m from 'mithril'

import MdIcon from '@mui/MdIcon'
import { shieldLock } from '@mui/icons'

const Unauthorized = {
  view: ({ attrs: { containerClass }, children }) => (
    <div
      className={`flex flex-col items-center justify-center p-2 ${containerClass || ''}`}
      direction='column'
      wrap='nowrap'
    >
      <MdIcon
        className='p-4 text-slate-400'
        icon={shieldLock}
        size={180}
      />
      {children}
    </div>
  )
}

export default Unauthorized
