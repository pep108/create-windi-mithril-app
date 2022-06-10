import m from 'mithril'
import ButtonSpinner from './ButtonSpinner'

const SubmitButton = {
  view: ({ attrs: { loading, onclick, disabled }, children }) => {
    return (
      <button
        className='relative text-base text-white font-bold tracking-wider rounded-xl bg-blue-400 color-white w-full p-3'
        onclick={onclick}
        disabled={disabled}
      >
        {children}
        <ButtonSpinner visible={loading} />
      </button>
    )
  }
}

export default SubmitButton
