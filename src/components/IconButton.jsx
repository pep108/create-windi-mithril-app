import m from 'mithril'

const IconButton = {
  view: ({ attrs: { onclick, ...attrs }, children }) =>
    <div
      className='flex items-center justify-center p-1'
      onclick={onclick}
      {...attrs}
    >
      {children}
    </div>
}

export default IconButton
