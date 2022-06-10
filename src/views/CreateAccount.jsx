import m from 'mithril'
import { Formi, prepareForm } from '/services/Formi'
import { isValidEmail } from '/services/form'
import { required, isString, minLength, equalsTo } from 'validatex'
import InputField from '/components/InputField'
import SubmitButton from '/components/SubmitButton'
import ButtonSpinner from '/components/ButtonSpinner'
import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'
import config from '/config'

const CreateAccount = {
  oninit: function () {
    const self = this

    self.formi = prepareForm({
      email: [isValidEmail],
      password: [required(true), minLength(8)],
      confirmPassword: [required(true), equalsTo('password')]
    }, {
      //
      // Initialize input values for testing
      //
      // email: 'jack@email.com',
      // password: 'TestPass123',
      // confirmPassword: 'TestPass123'
    })

    // Enable this line if you initialize with a confirmPassword
    // value to let the form validation run or clicking the submit
    // button won't work
    // setTimeout(m.redraw, 300)

    self.onSubmit = (data) => {
      console.log('onsumit clicked....', data)
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
      }, 1800)

      //
      // Example using fetch
      //
      /* fetch(`${config.API_ENDPOINT}/create_account`, {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: btoa(data.password)
        })
      })
      .then(resp => {
        console.log('resp: ', resp)
        return resp.json()
      })
      .then(data => {
        console.log('response data: ', data)
      })
      .catch(err => console.error('there was a problem: ', err))
      .finally(() => setLoading(false)) */

      //
      // Example using m.request
      //
      m.request({
        method: 'POST',
        url: `${config.API_ENDPOINT}/create_account`,
        body: {
          user: {
            email: data.email,
            password: data.password
          }
        }
      })
        .then(function (resp) {
          console.log('resp: ', resp)
        })
        .finally(() => setLoading(false))
    }

    function setLoading (val) {
      self.loading = val
      m.redraw()
    }
  },
  view: function () {
    const { formi, loading, onSubmit } = this

    return (
      <>
        <AppHeader />
        <div className='container mx-auto'>
          <PageTitle title='Create Your Account' />

          <div className='w-sm w-full max-w-sm mx-auto'>

            <div
              className='mt-6 p-8 max-w-lg shadow-md bg-white dark:bg-stone-900 dark:text-stone-300'
              style={{ borderTop: '4px solid #46b1c9' }}
            >

              <Formi
                className='mt-3'
                form={formi}
                onSubmit={onSubmit}
              >
                <div className='mb-2'>
                  <InputField
                    formi={formi}
                    label='Email'
                    name='email'
                    type='email'
                  />
                </div>
                <div className='mb-2'>
                  <InputField
                    formi={formi}
                    label='Password'
                    name='password'
                    type='password'
                    error={false}
                  />
                </div>
                <div className='mb-8'>
                  <InputField
                    formi={formi}
                    label='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    error={false}
                  />
                </div>
                <div className='w-80 flex mx-auto mb-4 <sm:w-full'>
                  <SubmitButton
                    loading={loading}
                    onclick={formi.onClickSubmit}
                    disabled={!formi.isValid() || loading}
                  >Continue
                  </SubmitButton>
                </div>
              </Formi>

            </div>
          </div>

        </div>
      </>
    )
  }
}

export default CreateAccount
