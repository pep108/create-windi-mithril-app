import './button.css'
import m from 'mithril'

import Octicon from './Octicon'

const Button = {
  view: ({
    attrs: {
      className = '',
      variant = 'standard', // standard, outlined
      style = 'default', // default, primary, secondary
      octicon,
      disabled,
      spinner,
      active,
      text,
      onclick
    }
  }) => {
    return (
      <button
        className={`lc-button lc-${style} lc-${variant} ${className} ${spinner ? 'lc-button-spinner right' : ''} ${active ? 'active' : ''}`}
        onclick={onclick}
        disabled={disabled}
      >
        {octicon === 'left' && <Octicon direction={octicon} />}
        <span class='lc-button-text'>{text}</span>
        {octicon && octicon !== 'left' && <Octicon />}
      </button>

    )

    // <button type="submit"
    // class="gloss-c-btn gloss-c-btn--secondary gloss-c-btn__spinner right c-form__next !w-auto">
    // 	<span class="lc-button-text">Submit</span>
    // </button>
  }
}

export default Button
