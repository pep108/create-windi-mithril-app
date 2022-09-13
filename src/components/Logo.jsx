import m from 'mithril'

const Logo = {
  view: () => {
    return (
      <h1
        className='text-2xl <sm:text-xl dark:text-stone-300'
        style={{ fontFamily: 'Proxima Nova Th', fontWeight: 800, fontStyle: 'normal' }}
      >{import.meta.env.VITE_APP_NAME}
      </h1>
    )
  }
}

export default Logo
