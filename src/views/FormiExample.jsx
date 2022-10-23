import m from 'mithril'
import 'prismjs/themes/prism.css'
import '/styles/prism-dracula.css'
import Prism from 'prismjs'

import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'

const code = `
import { Formi, prepareForm } from '/services/Formi'
import InputField from '/components/InputField'
import SubmitButton from '/components/SubmitButton'

const MyComponent = ({ attrs }) => {
  // Prepare the form
  const formi = prepareForm({
    email: [isValidEmail],
    password: [required(true)],
    ...
  })

  // Call this function when a valid form is submitted
  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2))

    // Send data to the server
    // ...
  }
  return {
    view: ({ attrs }) => {
      return (
        {/* wrap form inputs with the <Formi> component */}
        <Formi
          form={formi}
          onSubmit={onSubmit}
        >
          <div className='mb-2'>
            <InputField
              formi={formi}
              type='email'
              label='Email'
              name='email'
            />
          </div>
          <div className='mb-4'>
            {/* Use the <InputField> component to eliminate boilerplate */}
            <InputField
              formi={formi}
              type='password'
              label='Password'
              name='password'
              error={false}
            />
          </div>
          <div className='w-80 flex mx-auto mb-4'>
            {/* Use the <SubmitButton> component to eliminate boilerplate */}
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
      )
    }
  }
}
`
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript')

const FormiExample = () => {
  return {
    view: () => {
      return (
        <>
          {/* <AppHeader /> */}
          <div className='container mx-auto pt-4 pb-8 flex items-center justify-center flex-col'>
            <PageTitle
              className='text-3xl mb-6'
              title='Formi + Powerform'
            />
            <div className='min-w-full mt-4 p-4 pt-0 rounded bg-stone-200 dark:bg-stone-900'>
              <pre className='language-javascript' style='margin-top: 0'>
                {m.trust(html)}
              </pre>
            </div>
          </div>
        </>
      )
    }
  }
}

export default FormiExample
