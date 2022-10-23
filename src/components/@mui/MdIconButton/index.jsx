import './md-icon-button.css'
import m from 'mithril'

import { showTooltip } from '../MdTooltip'

const MdIconButton = {
  oncreate: function ({ attrs, dom }) {
    const onmouseover = e => showTooltip(e, attrs.tooltip, dom)

    if (attrs.tooltip) {
      dom.addEventListener('mouseover', onmouseover)
    }
  },
  view: ({ attrs, children }) => {
    return (
      <button
        className={`md-icon-button md-button md-ink-ripple ${attrs.className || ''} ${attrs.filled ? 'button-solid-bg' : ''}`}
        style={attrs.style || ''}
        type='button'
        onclick={attrs.onclick}
        ariaLable={attrs.label}
      >
        {children}
        <div className='md-ripple-container' />
      </button>
    )
  }
}

export default MdIconButton
