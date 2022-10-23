import m from 'mithril'
import LoginForm from './LoginForm'
import ForgotPasswordForm from '../ForgotPassword/ForgotPasswordForm'
import PageTitle from '/components/PageTitle'

const Home = () => {
  const forgotPassword = false
  const setForgotPassword = value => { self.forgotPassword = value }

  return {
    view: () => {
      return (
        <div className='container px-6 mx-auto max-w-screen-sm pt-10 flex items-center justify-center flex-col'>
          <div className='mt-6'>
            <PageTitle title={import.meta.env.VITE_APP_NAME} />
          </div>

          <div className='w-sm w-full max-w-sm'>
            {!forgotPassword &&
              <>
                <div
                  className='my-6 mx-2 px-6 py-6 flex-1 flex items-center justify-center flex-col relative shadow-md bg-white dark:bg-stone-900 dark:text-stone-300'
                  style={{ borderTop: '4px solid #46b1c9' }}
                >
                  <LoginForm />

                  {/* Forgot Password Link */}
                  <div className='text-center mt-8 text-blue-600 cursor-pointer'>
                    <m.route.Link href='/forgot-password'>Forgot your password?</m.route.Link>
                  </div>
                </div>
                {/* Sign Up */}
                <div className='text-center mt-12'>
                  Don't have an account? <m.route.Link href='/sign-up'>Sign up now</m.route.Link>
                </div>
              </>}
            {forgotPassword &&
              <div>
                <ForgotPasswordForm />
                <div
                  className='mt-8 text-center cursor-pointer'
                  onclick={() => setForgotPassword(false)}
                >&larr; Back
                </div>
              </div>}
          </div>
        </div>
      )
    }
  }
}

export default Home
