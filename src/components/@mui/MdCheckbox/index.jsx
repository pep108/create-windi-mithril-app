import './md-checkbox.scss'
import m from 'mithril'

/**
 * @param {*string} label (optional)
 * @param {PowerForm.Field} field
 * @param {bool} propagateEvent - true allow events to pass
 */
const MdCheckbox = {
  view: function ({
    attrs: {
      className = '',
      style = '',
      field,
      label,
      active,
      indeterminate,
      propagateEvent,
      disabled,
      onclick,
      helper
    }
  }) {
    if (field) {
      active = field.getData()
    }

    return (
      <md-checkbox
        tabindex='-1'
        role='checkbox'
        className={`md-primary ${className} ${active ? 'md-checked' : ''} ${indeterminate ? 'md-indeterminate' : ''}`}
        style={style}
        disabled={disabled}
        onclick={(e) => {
          if (!propagateEvent) {
            e.stopPropagation()
            e.preventDefault()
          }

          if (!disabled) {
            const newVal = !active
            if (field) {
              field.setData(newVal)
            }
            if (typeof onclick === 'function') {
              onclick(newVal)
            }
          }
        }}
      >
        <div className='_md-container md-ink-ripple'>
          <div className='_md-icon' />
        </div>
        <div className='_md-label'>
          {label && <span>{label}</span>}
        </div>
        {/* {helper} */}
      </md-checkbox>
    )
  }
}

export default MdCheckbox
