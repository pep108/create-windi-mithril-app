import m from 'mithril'
import { Form } from 'powerform'

const InputField = {
  oninit: ({ attrs }) => {
    if (!attrs.name) {
      console.warn('input is missing name attribute.', attrs)
    }
    if (attrs.formi && !(attrs.formi instanceof Form)) {
      console.warn('formi is not an instance of powerform')
    }
  },
  view: ({ attrs: { formi, ...attrs } }) => {
    const { name, label } = attrs

    return (
      <>
        {label &&
          <div className='py-1 px-3 font-medium'>{label}</div>}
        <input
          type='text'
          className='outline-none focus:outline-none m-input w-full dark:bg-stone-700'
          value={formi && name ? formi[name].getData() : ''}
          oninput={formi ? formi.onInput : () => {}}
          error={formi && formi[name].touched && Boolean(formi[name].error)}
          {...attrs}
        />
      </>
    )
  }
}

export default InputField
