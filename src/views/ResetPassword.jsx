import m from 'mithril'
import { Formi, prepareForm } from '/services/Formi'
import { required, isString, minLength, equalsTo } from 'validatex'

import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'
import InputField from '/components/InputField'
import SubmitButton from '/components/SubmitButton'

const ResetPassword = {
  oninit: function () {
    const self = this

    const query = m.parseQueryString(window.location.href.split('?')[1])
    console.log('query: ', query)
    if (!query.t) {
      self.invalidLink = true
    }

    self.formi = prepareForm({
      token: [required(true)],
      password: [required(true), minLength(8)],
      confirmPassword: [required(true), equalsTo('password')]
    }, { token: query.t })

    self.onSubmit = (data) => {
      console.log('form data: ', data)

      setLoading(true)

      setTimeout(() => {
        setLoading(false)
      }, 1800)

      // m.request({
      //   method: 'POST',
      //   url: `${process.env.API_ENDPOINT}/reset_password`,
      //   params: { id: 1 },
      //   body: { name: 'test' }
      // })
      //   .then(function (result) {
      //     console.log(result)
      //   })
      //   .finally(() => setLoading(false))
    }

    function setLoading (val) {
      self.loading = val
      m.redraw()
    }
  },
  view: function () {
    const { formi, invalidLink, loading, onSubmit } = this

    return (
      <>
        <AppHeader />
        <div className='container mx-auto'>
          <PageTitle title='Reset Your Password' />

          <div className='w-sm w-full max-w-sm mx-auto'>
            <div
              className='mt-6 p-8 max-w-lg shadow-md bg-white dark:bg-stone-900 dark:text-stone-300'
              style={{ borderTop: '4px solid #46b1c9' }}
            >

              {invalidLink &&
                <div className='text-center'>
                  <h2 className='text-4xl font-bold mb-4'>Oops :/</h2>
                  <div>
                    Something went wrong. <br />
                    Try opening this page from the link you received in your email. If the issue persists, request another email by filling out the <m.route.Link href='/forgot-password' className='cursor-pointer'>Forgot Password</m.route.Link> form.
                  </div>
                </div>}

              {!invalidLink &&
                <Formi
                  className='mt-3'
                  form={formi}
                  onSubmit={onSubmit}
                >
                  <input type='hidden' name='token' className='m-input w-full' />
                  <div className='mb-2'>
                    <InputField
                      formi={formi}
                      label='New Password'
                      name='password'
                      type='password'
                      error={false}
                    />
                  </div>
                  <div className='mb-6'>
                    <InputField
                      formi={formi}
                      label='Confirm Password'
                      name='confirmPassword'
                      type='password'
                      error={false}
                    />
                  </div>
                  <div className='w-80 flex mx-auto mb-4'>
                    <SubmitButton
                      loading={loading}
                      onclick={formi.onClickSubmit}
                      disabled={!formi.isValid() || loading}
                    >Submit
                    </SubmitButton>
                  </div>
                </Formi>}

            </div>
          </div>

        </div>
      </>
    )
  }
}

export default ResetPassword
