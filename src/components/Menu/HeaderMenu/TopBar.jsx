import m from 'mithril'
import './styles.css'

import Account from '/services/Account'

const TopBar = () => {
  return {
    view: () => (
      <div className='topbar flex items-center !justify-between'>
        <div className='inline-flex items-center'>
          {/*
          <i className='icon-search' />
          <input
            type='search'
            // className='!outline-none !focus:outline-none mui-input w-full dark:bg-stone-700 py-0 px-2 ml-2'
            className='!outline-none !focus:outline-none mui-input w-full py-0 px-2 ml-2'
            style='border-width: 0 0 1px 0'
            // value={formi && name ? formi[name].getData() : ''}
            // oninput={formi ? formi.onInput : () => {}}
            // error={formi && formi[name].touched && Boolean(formi[name].error)}
            // {...attrs}
          />
          */}
        </div>
        <div className='font-bold text-sm uppercase cursor-pointer ml-8'>
          <a className='text-black' onclick={Account.logout}>Log Out</a>
        </div>
      </div>

    )
  }
}

export default TopBar
