import m from 'mithril'
import config from '/config'

const Logo = {
  view: () => {
    return (
      <h1
        className='text-2xl <sm:text-xl dark:text-stone-300'
        style={{ fontFamily: 'Proxima Nova Th', fontWeight: 800, fontStyle: 'normal' }}
      >{config.appName}
      </h1>
    )
  }
}

export default Logo
