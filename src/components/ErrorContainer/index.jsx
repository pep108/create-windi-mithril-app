import m from 'mithril'

import MdIcon from '@mui/MdIcon'
import { warning } from '@mui/icons'

const ErrorContainer = {
  view: ({ attrs: { className, style }, children }) => {
    return (
      <div className={`flex flex-col items-center justify-center ${className || ''}`} style={style || ''}>
        <MdIcon
          icon={warning}
          size={60}
          style='margin-bottom: 12px;'
          className='color-red'
        />
        {children}
      </div>
    )
  }
}

export default ErrorContainer
