import m from 'mithril'
import config from '/config'

import { Formi, prepareForm } from '/services/Formi'
import { isValidEmail } from '/services/form'
import { required, isString, minLength, equalsTo } from 'validatex'
import SubmitButton from '/components/SubmitButton'
import InputField from '/components/InputField'

const ForgotPassword = () => {
  const loading = false
  const showError = false

  const setLoading = (val) => {
    self.loading = val
    m.redraw()
  }

  const formi = prepareForm({
    email: [isValidEmail]
  })

  const onSubmit = (data) => {
    console.log('form data: ', data)
    setLoading(true)

    m.request({
      method: 'POST',
      url: `${config.API_ENDPOINT}/forgot_password`,
      body: data
    })
      .then(function (result) {
        console.log(result)
      })
      .catch(err => {
        console.error('there was a problem: ', err)
        self.showError = true
      })
      .finally(() => setLoading(false))
  }

  return {
    view: () => {
      return (
        <div>
          <h2 className='font-sans text-2xl font-medium text-center my-4'>
            Trouble accessing your account?
          </h2>

          <div>Enter the email address you use for {config.appName}.</div>

          <Formi
            className='mt-3'
            form={formi}
            onSubmit={onSubmit}
          >
            <div className='mb-6'>
              <InputField
                formi={formi}
                label='Email'
                name='email'
                type='email'
              />
            </div>
            <div className='w-80 flex mx-auto mb-4'>
              <SubmitButton
                loading={loading}
                onclick={formi.onClickSubmit}
                disabled={!formi.isValid() || loading}
              >Send me a reset link
              </SubmitButton>
            </div>

            {/* Error container */}
            <div className={['text-red-600 text-center ', !showError && 'hidden'].join('')}>
              Error processing request. Please try again.
            </div>
          </Formi>
        </div>
      )
    }
  }
}

export default ForgotPassword
