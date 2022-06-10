import m from 'mithril'

import ForgotPasswordForm from './ForgotPasswordForm'
import AppHeader from '/components/AppHeader'

const ForgotPassword = {
  view: function () {
    return (
      <div>
        <AppHeader />
        <div
          className='container px-6 mx-auto max-w-screen-sm pt-10 flex items-center justify-center flex-col'
          style={{ maxWidth: '400px' }}
        >
          <div className='w-sm w-full max-w-sm'>
            <div
              className='my-6 mx-2 px-6 py-6 flex-1 flex items-center justify-center flex-col relative shadow-md bg-white dark:bg-stone-900 dark:text-stone-300'
              style={{ borderTop: '4px solid #46b1c9' }}
            >
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ForgotPassword
