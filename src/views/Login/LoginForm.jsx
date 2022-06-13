import m from 'mithril'
import config from '/config'
import { Formi, prepareForm } from '/services/Formi'
import { isValidEmail } from '/services/form'
import { required, isString, minLength, equalsTo } from 'validatex'
import InputField from '/components/InputField'
import SubmitButton from '/components/SubmitButton'

const Login = () => {
  const loading = false
  const attemptsRemaining = 4

  const setLoading = (val) => {
    self.loading = val
    m.redraw()
  }

  const formi = prepareForm({
    email: [isValidEmail],
    password: [required(true)]
  })

  const onSubmit = (data) => {
    console.log('form data: ', data)
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
    // m.request({
    //   method: 'POST',
    //   url: `${config.API_ENDPOINT}/create_account`,
    //   body: {
    //     user: {
    //       email: data.email,
    //       password: data.password
    //     }
    //   }
    // })
    //   .then(function (resp) {
    //     console.log('resp: ', resp)
    //   })
    //   .finally(() => setLoading(false))
  }

  return {
    view: () => {
      return (
        <div>
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
                placeholder='jake@example.com'
                type='email'
              />
            </div>
            <div className='mb-6'>
              <InputField
                formi={formi}
                label='Password'
                name='password'
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

            {/* Error container */}
            <div className='text-red-600 text-center hidden'>
              Invalid login/password combination.
            </div>
          </Formi>
        </div>
      )
    }
  }
}

export default Login
