import './md-radio.scss'

import m from 'mithril'

const MdRadioButton = {
  view: ({ attrs: { className = '', option, onclick, selected } }) => {
    return (
      <md-radio-button
        className={`${className} ${selected ? 'md-checked' : ''}`}
        value={option.value}
        disabled={!!option.disabled}
        role='radio'
        ariaLabel={option.text}
        onclick={(e) => {
          e.stopPropagation()
          if (!option.disabled) {
            onclick(option)
          }
        }}
      >
        <div className='_md-container'>
          <div className='_md-off' />
          <div className='_md-on' />
        </div>
        <div className='_md-label align-middle'>
          <span>{option.text || option.value}</span>
        </div>
      </md-radio-button>
    )
  }
}

/**
 * @param {array} options
 * [{
      id: 0,
      name: string
      value: string
      disabled: bool
    }...]
 */
const MdRadioGroup = {
  view: function ({
    attrs: {
      onchange,
      layout, // = 'row',
      containerCss = '',
      options,
      value,
      child,
      childValue
    }
  }) {
    return (
      <md-radio-group
        className={`md-primary height-34 layout-${layout} ${containerCss}`}
        role='radiogroup'
        tabindex='0'
      >
        {options?.map((option, i) => {
          const hasChild = (child && childValue === option.value)
          return (
            <MdRadioButton
              className={hasChild ? 'nomargin' : ''}
              option={option}
              selected={value === option.value}
              onclick={(val) => onchange(val)}
            />
          )
        })}
      </md-radio-group>
    )
  }
}

export { MdRadioGroup, MdRadioButton }
