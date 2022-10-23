import m from 'mithril'

import { showTooltip } from '../MdTooltip'

/**
 * @param {array} icon
 */
const MdIcon = () => {
  return {
    oncreate: function ({ attrs, dom }) {
      const onmouseover = e => showTooltip(e, attrs.tooltip, dom)

      if (attrs.tooltip) {
        dom.addEventListener('mouseover', onmouseover)
      }
    },
    view: ({ attrs }) => {
      const { icon, size = '24', ...rest } = attrs

      if (!icon) {
        console.error('icon is missing')
      }

      return (
        <i
          {...rest}
          className={`material-icons ${attrs.className || ''} ${attrs.onclick ? 'clickable' : ''}`}
          style={`height: ${size}px; width: ${size}px;`}
        >
          <svg viewBox='0 0 24 24'>
            {icon && icon.map((path, i) =>
              <path key={i} d={path} />)}
          </svg>
        </i>
      )
    }
  }
}

export default MdIcon
