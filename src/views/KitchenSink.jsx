import m from 'mithril'
import { Formi, prepareForm } from '/services/Formi'
import { isValidEmail } from '/services/form'
import { required, isString, minLength, equalsTo } from 'validatex'
import InputField from '/components/InputField'
import SubmitButton from '/components/SubmitButton'
import ButtonSpinner from '/components/ButtonSpinner'
import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'

// Load All Fonts
// Fonts
import 'Assets/fonts/feather/style.css'
import 'Assets/fonts/brandon-grotesque/style.css'
import 'Assets/fonts/geomanist/style.css'
import 'Assets/fonts/keep-calm/style.css'
import 'Assets/fonts/montserrat/style.css'
import 'Assets/fonts/myriad-pro/style.css'
import 'Assets/fonts/proxima-nova/style.css'
import 'Assets/fonts/romana-bt/style.css'
import 'Assets/fonts/source-sans-pro/style.css'

const featherIcons = ['icon-activity', 'icon-airplay', 'icon-alert-circle', 'icon-alert-octagon', 'icon-alert-triangle', 'icon-align-center', 'icon-align-justify', 'icon-align-left', 'icon-align-right', 'icon-anchor', 'icon-aperture', 'icon-archive', 'icon-arrow-down', 'icon-arrow-down-circle', 'icon-arrow-down-left', 'icon-arrow-down-right', 'icon-arrow-left', 'icon-arrow-left-circle', 'icon-arrow-right', 'icon-arrow-right-circle', 'icon-arrow-up', 'icon-arrow-up-circle', 'icon-arrow-up-left', 'icon-arrow-up-right', 'icon-at-sign', 'icon-award', 'icon-bar-chart', 'icon-bar-chart-2', 'icon-battery', 'icon-battery-charging', 'icon-bell', 'icon-bell-off', 'icon-bluetooth', 'icon-bold', 'icon-book', 'icon-book-open', 'icon-bookmark', 'icon-box', 'icon-briefcase', 'icon-calendar', 'icon-camera', 'icon-camera-off', 'icon-cast', 'icon-check', 'icon-check-circle', 'icon-check-square', 'icon-chevron-down', 'icon-chevron-left', 'icon-chevron-right', 'icon-chevron-up', 'icon-chevrons-down', 'icon-chevrons-left', 'icon-chevrons-right', 'icon-chevrons-up', 'icon-chrome', 'icon-circle', 'icon-clipboard', 'icon-clock', 'icon-cloud', 'icon-cloud-drizzle', 'icon-cloud-lightning', 'icon-cloud-off', 'icon-cloud-rain', 'icon-cloud-snow', 'icon-code', 'icon-codepen', 'icon-codesandbox', 'icon-coffee', 'icon-columns', 'icon-command', 'icon-compass', 'icon-copy', 'icon-corner-down-left', 'icon-corner-down-right', 'icon-corner-left-down', 'icon-corner-left-up', 'icon-corner-right-down', 'icon-corner-right-up', 'icon-corner-up-left', 'icon-corner-up-right', 'icon-cpu', 'icon-credit-card', 'icon-crop', 'icon-crosshair', 'icon-database', 'icon-delete', 'icon-disc', 'icon-dollar-sign', 'icon-download', 'icon-download-cloud', 'icon-droplet', 'icon-edit', 'icon-edit-2', 'icon-edit-3', 'icon-external-link', 'icon-eye', 'icon-eye-off', 'icon-facebook', 'icon-fast-forward', 'icon-feather', 'icon-figma', 'icon-file', 'icon-file-minus', 'icon-file-plus', 'icon-file-text', 'icon-film', 'icon-filter', 'icon-flag', 'icon-folder', 'icon-folder-minus', 'icon-folder-plus', 'icon-framer', 'icon-frown', 'icon-gift', 'icon-git-branch', 'icon-git-commit', 'icon-git-merge', 'icon-git-pull-request', 'icon-github', 'icon-gitlab', 'icon-globe', 'icon-grid', 'icon-hard-drive', 'icon-hash', 'icon-headphones', 'icon-heart', 'icon-help-circle', 'icon-hexagon', 'icon-home', 'icon-image', 'icon-inbox', 'icon-info', 'icon-instagram', 'icon-italic', 'icon-key', 'icon-layers', 'icon-layout', 'icon-life-buoy', 'icon-link', 'icon-link-2', 'icon-linkedin', 'icon-list', 'icon-loader', 'icon-lock', 'icon-log-in', 'icon-log-out', 'icon-mail', 'icon-map', 'icon-map-pin', 'icon-maximize', 'icon-maximize-2', 'icon-meh', 'icon-menu', 'icon-message-circle', 'icon-message-square', 'icon-mic', 'icon-mic-off', 'icon-minimize', 'icon-minimize-2', 'icon-minus', 'icon-minus-circle', 'icon-minus-square', 'icon-monitor', 'icon-moon', 'icon-more-horizontal', 'icon-more-vertical', 'icon-mouse-pointer', 'icon-move', 'icon-music', 'icon-navigation', 'icon-navigation-2', 'icon-octagon', 'icon-package', 'icon-paperclip', 'icon-pause', 'icon-pause-circle', 'icon-pen-tool', 'icon-percent', 'icon-phone', 'icon-phone-call', 'icon-phone-forwarded', 'icon-phone-incoming', 'icon-phone-missed', 'icon-phone-off', 'icon-phone-outgoing', 'icon-pie-chart', 'icon-play', 'icon-play-circle', 'icon-plus', 'icon-plus-circle', 'icon-plus-square', 'icon-pocket', 'icon-power', 'icon-printer', 'icon-radio', 'icon-refresh-ccw', 'icon-refresh-cw', 'icon-repeat', 'icon-rewind', 'icon-rotate-ccw', 'icon-rotate-cw', 'icon-rss', 'icon-save', 'icon-scissors', 'icon-search', 'icon-send', 'icon-server', 'icon-settings', 'icon-share', 'icon-share-2', 'icon-shield', 'icon-shield-off', 'icon-shopping-bag', 'icon-shopping-cart', 'icon-shuffle', 'icon-sidebar', 'icon-skip-back', 'icon-skip-forward', 'icon-slack', 'icon-slash', 'icon-sliders', 'icon-smartphone', 'icon-smile', 'icon-speaker', 'icon-square', 'icon-star', 'icon-stop-circle', 'icon-sun', 'icon-sunrise', 'icon-sunset', 'icon-tablet', 'icon-tag', 'icon-target', 'icon-terminal', 'icon-thermometer', 'icon-thumbs-down', 'icon-thumbs-up', 'icon-toggle-left', 'icon-toggle-right', 'icon-tool', 'icon-trash', 'icon-trash-2', 'icon-trello', 'icon-trending-down', 'icon-trending-up', 'icon-triangle', 'icon-truck', 'icon-tv', 'icon-twitch', 'icon-twitter', 'icon-type', 'icon-umbrella', 'icon-underline', 'icon-unlock', 'icon-upload', 'icon-upload-cloud', 'icon-user', 'icon-user-check', 'icon-user-minus', 'icon-user-plus', 'icon-user-x', 'icon-users', 'icon-video', 'icon-video-off', 'icon-voicemail', 'icon-volume', 'icon-volume-1', 'icon-volume-2', 'icon-volume-x', 'icon-watch', 'icon-wifi', 'icon-wifi-off', 'icon-wind', 'icon-x', 'icon-x-circle', 'icon-x-octagon', 'icon-x-square', 'icon-youtube', 'icon-zap', 'icon-zap-off', 'icon-zoom-in', 'icon-zoom-out']

const SampleText = {
  view: ({ attrs: { fontClass } }) =>
    <p className={fontClass}>Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine.</p>
}

const KitchenSink = () => {
  let loading = false
  const setLoading = (val) => {
    loading = val
    m.redraw()
  }

  const formi = prepareForm({
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

  const onSubmit = (data) => {
    console.log('onsumit clicked....', data)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 1800)

    //
    // Example using fetch
    //
    /* fetch(`${import.meta.env.VITE_API_ENDPOINT}/create_account`, {
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
      url: `${import.meta.env.VITE_API_ENDPOINT}/create_account`,
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
      .catch(err => {
        console.error('request failed: ', err)
      })
      .finally(() => setLoading(false))
  }

  return {
    view: () => {
      return (
        <>
          <AppHeader />
          <div className='containerX mx-auto px-6'>
            <PageTitle align='left' title='Kitchen Sink' />

            <div className='w-sm w-full max-w-lg mx-auto min-w-full'>

              <div className='h-full mt-4 p-4 m-0 shadow-md rounded bg-white dark:bg-stone-900 dark:text-stone-300'>
                <h2 className='mt-0'>Typography</h2>

                <div className='grid inline-grid grid-cols-3 md:grid-cols-3 <md:grid-cols-1 auto-cols-auto gap-2'>
                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-proxima-nova text-red-500'>Proxima Nova</h3>
                    <h3 className='my-0 font-proxima-nova text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-proxima-nova'>h1 Headline</h1>
                    <h2 className='my-0 font-proxima-nova'>h2 Headline</h2>
                    <h3 className='my-0 font-proxima-nova'>h3 Headline</h3>
                    <h4 className='my-0 font-proxima-nova'>h4 Headline</h4>
                    <h5 className='my-0 font-proxima-nova'>h5 Headline</h5>
                    <SampleText fontClass='font-proxima-nova' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-brandon-grotesque text-red-500'>Brandon Grotesque</h3>
                    <h3 className='my-0 font-brandon-grotesque text-red-500 text-4xl'>Grower's Almanac</h3>
                    <h1 className='my-0 font-brandon-grotesque'>h1 Headline</h1>
                    <h2 className='my-0 font-brandon-grotesque'>h2 Headline</h2>
                    <h3 className='my-0 font-brandon-grotesque'>h3 Headline</h3>
                    <h4 className='my-0 font-brandon-grotesque'>h4 Headline</h4>
                    <h5 className='my-0 font-brandon-grotesque'>h5 Headline</h5>
                    <SampleText fontClass='font-brandon-grotesque' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-keep-calm text-red-500'>Keep Calm</h3>
                    <h3 className='my-0 font-keep-calm text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-keep-calm'>h1 Headline</h1>
                    <h2 className='my-0 font-keep-calm'>h2 Headline</h2>
                    <h3 className='my-0 font-keep-calm'>h3 Headline</h3>
                    <h4 className='my-0 font-keep-calm'>h4 Headline</h4>
                    <h5 className='my-0 font-keep-calm'>h5 Headline</h5>
                    <SampleText fontClass='font-keep-calm' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-montserrat text-red-500'>Montserrat</h3>
                    <h3 className='my-0 font-montserrat text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-montserrat'>h1 Headline</h1>
                    <h2 className='my-0 font-montserrat'>h2 Headline</h2>
                    <h3 className='my-0 font-montserrat'>h3 Headline</h3>
                    <h4 className='my-0 font-montserrat'>h4 Headline</h4>
                    <h5 className='my-0 font-montserrat'>h5 Headline</h5>
                    <SampleText fontClass='font-montserrat' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-myriad-pro text-red-500'>Myriad Pro</h3>
                    <h3 className='my-0 font-myriad-pro text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-myriad-pro'>h1 Headline</h1>
                    <h2 className='my-0 font-myriad-pro'>h2 Headline</h2>
                    <h3 className='my-0 font-myriad-pro'>h3 Headline</h3>
                    <h4 className='my-0 font-myriad-pro'>h4 Headline</h4>
                    <h5 className='my-0 font-myriad-pro'>h5 Headline</h5>
                    <SampleText fontClass='font-myriad-pro' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-romana-bt text-red-500'>Romana BT</h3>
                    <h3 className='my-0 font-romana-bt text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-romana-bt'>h1 Headline</h1>
                    <h2 className='my-0 font-romana-bt'>h2 Headline</h2>
                    <h3 className='my-0 font-romana-bt'>h3 Headline</h3>
                    <h4 className='my-0 font-romana-bt'>h4 Headline</h4>
                    <h5 className='my-0 font-romana-bt'>h5 Headline</h5>
                    <SampleText fontClass='font-romana-bt' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-source-sans-pro text-red-500'>Source Sans Pro</h3>
                    <h3 className='my-0 font-source-sans-pro text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-source-sans-pro'>h1 Headline</h1>
                    <h2 className='my-0 font-source-sans-pro'>h2 Headline</h2>
                    <h3 className='my-0 font-source-sans-pro'>h3 Headline</h3>
                    <h4 className='my-0 font-source-sans-pro'>h4 Headline</h4>
                    <h5 className='my-0 font-source-sans-pro'>h5 Headline</h5>
                    <SampleText fontClass='font-source-sans-pro' />
                  </div>

                  <div className='px-2 mb-4'>
                    <h3 className='my-0 font-geomanist text-red-500'>Geomanist</h3>
                    <h3 className='my-0 font-geomanist text-red-500'>Grower's Almanac</h3>
                    <h1 className='my-0 font-geomanist'>h1 Headline</h1>
                    <h2 className='my-0 font-geomanist'>h2 Headline</h2>
                    <h3 className='my-0 font-geomanist'>h3 Headline</h3>
                    <h4 className='my-0 font-geomanist'>h4 Headline</h4>
                    <h5 className='my-0 font-geomanist'>h5 Headline</h5>
                    <SampleText fontClass='font-geomanist' />
                  </div>
                </div>

              </div>
              <div className='h-full mt-4 p-4 m-2 shadow-md rounded bg-white dark:bg-stone-900 dark:text-stone-300'>
                <h3>Buttons</h3>

                <div className='max-w-96 mb-4'>
                  <SubmitButton
                    loading={loading}
                    onclick={formi.onClickSubmit}
                    disabled={!formi.isValid() || loading}
                  >Full Width Button
                  </SubmitButton>

                </div>

                <SubmitButton
                  loading={loading}
                  onclick={formi.onClickSubmit}
                  disabled={!formi.isValid() || loading}
                >Full Width Button
                </SubmitButton>

              </div>

              {/* <div className='bg-white shadow-xl rounded-xl p-8 mb-6'> */}
              <div className='h-full mt-4 p-4 m-2 shadow-md rounded bg-white dark:bg-stone-900 dark:text-stone-300'>
                <h3>Icons</h3>

                <h4>Feather Icons</h4>
                <div className='mb-4 flex flex-wrap flex-row'>
                  {featherIcons.map((icon, i) =>
                    <div className={i > 0 ? 'ml-2' : ''}>
                      <i class={`icon ${icon} text-stone-900 dark:text-stone-300 text-md`} />
                    </div>)}
                </div>

                {/* <h4>Icon Buttons</h4>
                <MdIconButton
                  filled
                  tooltip='hover text'
                >
                  <MdIcon
                    id='search-icon'
                    icon={calendarClock}
                    style='margin: 6px 10px;'
                  />
                </MdIconButton>

                <MdIconButton className='ml-4'>
                  <MdIcon
                    id='search-icon'
                    icon={calendarClock}
                    tooltip='hover text'
                    style='margin: 6px 10px;'
                  />
                </MdIconButton> */}

              </div>

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
}

export default KitchenSink
