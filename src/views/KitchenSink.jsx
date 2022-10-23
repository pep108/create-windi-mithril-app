import m from 'mithril'

import { Formi, prepareForm } from '/services/Formi'
import { isValidEmail, requiredIf } from 'Utils/form'
import { required, isString, length, minLength } from 'validatex'

import Button from 'Components/Button'
import { StarRating } from 'Components/StarRating'
import ErrorContainer from 'Components/ErrorContainer'
import NotFound from 'Components/NotFound'
import MaintenancePage from 'Components/MaintenancePage'
import { Spinner } from 'Components/Spinner'

import MdIconButton from '@mui/MdIconButton'
import { MdSelect } from '@mui/MdSelect'
import MdIcon from '@mui/MdIcon'
import { clear, search, calendarClock } from '@mui/icons'
import MdProgress from '@mui/MdProgress'
import MdCheckbox from '@mui/MdCheckbox'

import {
  decorate,
  MdTable, MdToolbar, MdTableHead,
  MdTableBody, MdEmptyRow, MdTableRow, MdTableExpandedRow, MdTableCell,
  MdToolbarSearch, MdToolbarFilterContainer, MdToolbarFilter,
  MdTableProgress
} from 'Components/@mui/MdTable'

import { get } from 'Services/Api'
import { MdRadioGroup } from '@mui/MdRadio'

const featherIcons = ['icon-activity', 'icon-airplay', 'icon-alert-circle', 'icon-alert-octagon', 'icon-alert-triangle', 'icon-align-center', 'icon-align-justify', 'icon-align-left', 'icon-align-right', 'icon-anchor', 'icon-aperture', 'icon-archive', 'icon-arrow-down', 'icon-arrow-down-circle', 'icon-arrow-down-left', 'icon-arrow-down-right', 'icon-arrow-left', 'icon-arrow-left-circle', 'icon-arrow-right', 'icon-arrow-right-circle', 'icon-arrow-up', 'icon-arrow-up-circle', 'icon-arrow-up-left', 'icon-arrow-up-right', 'icon-at-sign', 'icon-award', 'icon-bar-chart', 'icon-bar-chart-2', 'icon-battery', 'icon-battery-charging', 'icon-bell', 'icon-bell-off', 'icon-bluetooth', 'icon-bold', 'icon-book', 'icon-book-open', 'icon-bookmark', 'icon-box', 'icon-briefcase', 'icon-calendar', 'icon-camera', 'icon-camera-off', 'icon-cast', 'icon-check', 'icon-check-circle', 'icon-check-square', 'icon-chevron-down', 'icon-chevron-left', 'icon-chevron-right', 'icon-chevron-up', 'icon-chevrons-down', 'icon-chevrons-left', 'icon-chevrons-right', 'icon-chevrons-up', 'icon-chrome', 'icon-circle', 'icon-clipboard', 'icon-clock', 'icon-cloud', 'icon-cloud-drizzle', 'icon-cloud-lightning', 'icon-cloud-off', 'icon-cloud-rain', 'icon-cloud-snow', 'icon-code', 'icon-codepen', 'icon-codesandbox', 'icon-coffee', 'icon-columns', 'icon-command', 'icon-compass', 'icon-copy', 'icon-corner-down-left', 'icon-corner-down-right', 'icon-corner-left-down', 'icon-corner-left-up', 'icon-corner-right-down', 'icon-corner-right-up', 'icon-corner-up-left', 'icon-corner-up-right', 'icon-cpu', 'icon-credit-card', 'icon-crop', 'icon-crosshair', 'icon-database', 'icon-delete', 'icon-disc', 'icon-dollar-sign', 'icon-download', 'icon-download-cloud', 'icon-droplet', 'icon-edit', 'icon-edit-2', 'icon-edit-3', 'icon-external-link', 'icon-eye', 'icon-eye-off', 'icon-facebook', 'icon-fast-forward', 'icon-feather', 'icon-figma', 'icon-file', 'icon-file-minus', 'icon-file-plus', 'icon-file-text', 'icon-film', 'icon-filter', 'icon-flag', 'icon-folder', 'icon-folder-minus', 'icon-folder-plus', 'icon-framer', 'icon-frown', 'icon-gift', 'icon-git-branch', 'icon-git-commit', 'icon-git-merge', 'icon-git-pull-request', 'icon-github', 'icon-gitlab', 'icon-globe', 'icon-grid', 'icon-hard-drive', 'icon-hash', 'icon-headphones', 'icon-heart', 'icon-help-circle', 'icon-hexagon', 'icon-home', 'icon-image', 'icon-inbox', 'icon-info', 'icon-instagram', 'icon-italic', 'icon-key', 'icon-layers', 'icon-layout', 'icon-life-buoy', 'icon-link', 'icon-link-2', 'icon-linkedin', 'icon-list', 'icon-loader', 'icon-lock', 'icon-log-in', 'icon-log-out', 'icon-mail', 'icon-map', 'icon-map-pin', 'icon-maximize', 'icon-maximize-2', 'icon-meh', 'icon-menu', 'icon-message-circle', 'icon-message-square', 'icon-mic', 'icon-mic-off', 'icon-minimize', 'icon-minimize-2', 'icon-minus', 'icon-minus-circle', 'icon-minus-square', 'icon-monitor', 'icon-moon', 'icon-more-horizontal', 'icon-more-vertical', 'icon-mouse-pointer', 'icon-move', 'icon-music', 'icon-navigation', 'icon-navigation-2', 'icon-octagon', 'icon-package', 'icon-paperclip', 'icon-pause', 'icon-pause-circle', 'icon-pen-tool', 'icon-percent', 'icon-phone', 'icon-phone-call', 'icon-phone-forwarded', 'icon-phone-incoming', 'icon-phone-missed', 'icon-phone-off', 'icon-phone-outgoing', 'icon-pie-chart', 'icon-play', 'icon-play-circle', 'icon-plus', 'icon-plus-circle', 'icon-plus-square', 'icon-pocket', 'icon-power', 'icon-printer', 'icon-radio', 'icon-refresh-ccw', 'icon-refresh-cw', 'icon-repeat', 'icon-rewind', 'icon-rotate-ccw', 'icon-rotate-cw', 'icon-rss', 'icon-save', 'icon-scissors', 'icon-search', 'icon-send', 'icon-server', 'icon-settings', 'icon-share', 'icon-share-2', 'icon-shield', 'icon-shield-off', 'icon-shopping-bag', 'icon-shopping-cart', 'icon-shuffle', 'icon-sidebar', 'icon-skip-back', 'icon-skip-forward', 'icon-slack', 'icon-slash', 'icon-sliders', 'icon-smartphone', 'icon-smile', 'icon-speaker', 'icon-square', 'icon-star', 'icon-stop-circle', 'icon-sun', 'icon-sunrise', 'icon-sunset', 'icon-tablet', 'icon-tag', 'icon-target', 'icon-terminal', 'icon-thermometer', 'icon-thumbs-down', 'icon-thumbs-up', 'icon-toggle-left', 'icon-toggle-right', 'icon-tool', 'icon-trash', 'icon-trash-2', 'icon-trello', 'icon-trending-down', 'icon-trending-up', 'icon-triangle', 'icon-truck', 'icon-tv', 'icon-twitch', 'icon-twitter', 'icon-type', 'icon-umbrella', 'icon-underline', 'icon-unlock', 'icon-upload', 'icon-upload-cloud', 'icon-user', 'icon-user-check', 'icon-user-minus', 'icon-user-plus', 'icon-user-x', 'icon-users', 'icon-video', 'icon-video-off', 'icon-voicemail', 'icon-volume', 'icon-volume-1', 'icon-volume-2', 'icon-volume-x', 'icon-watch', 'icon-wifi', 'icon-wifi-off', 'icon-wind', 'icon-x', 'icon-x-circle', 'icon-x-octagon', 'icon-x-square', 'icon-youtube', 'icon-zap', 'icon-zap-off', 'icon-zoom-in', 'icon-zoom-out']
const table = decorate({
  thead: [
    // { class: 'checkbox-column', title: 'Selected', field: 'selected' },
    {
      // class: '',
      title: 'Address',
      field: 'streetAddress',
      renderer: function (data, th) {
        return (
          <MdTableCell>
            <m.route.Link href={`/lead/${data.leadId}`}>
              {data.streetAddress}
            </m.route.Link>
          </MdTableCell>
        )
      }
    },
    {
      class: 'md-center',
      title: 'Reviewed',
      field: 'leadReviewId',
      renderer: function (data) {
        // {/* : <a
        //     href={`https://api.leadcheck.local/lead_followup/${data.leadReviewId}?r=0`}
        //     target='_blank' rel='noreferrer'
        //   >
        //   <i class='icon icon-x-circle text-red-600 text-md' />
        // </a>} */}
        return (
          <MdTableCell className='md-center'>
            {data.leadReviewId
              ? <i class='icon icon-check-circle text-green-600 text-md' />
              : <i class='icon icon-x-circle text-red-600 text-md' />}
          </MdTableCell>
        )
      }
    },
    {
      class: 'md-numeric',
      title: 'Date',
      field: 'createdDateDisplay'
    }
  ],
  selectedField: 'selected',
  tableClasses: 'md-row-select',
  onRowClick: (o) => { o._expanded = !o._expanded },
  config: {
    paginate: false,
    fuzzySearch: true
  },
  // hideHeader: true,
  sortedColumn: {
    field: 'createdDateDisplay',
    order: 'desc'
  },
  searchFields: ['streetAddress'],
  // actions: TableActions,
  _filters: {
    // The apiValue & apiOperator keys tell the server how to query the table
    reviewed: [
      { id: 1, field: 'all', name: 'all', default: true },
      { id: 2, field: 'reviewed', name: 'reviewed', apiKey: 'leadReviewId', apiValue: 1, compareFn: (d) => !!d.leadReviewId },
      { id: 3, field: 'reviewed', name: 'not reviewed', apiKey: 'leadReviewId', apiValue: 0, compareFn: (d) => !d.leadReviewId }
    ]
  }
  // messages: {
  //   empty: 'You don\'t have any customers in the system yet.',
  //   noMatch: 'There are no customers that match your search.'
  // }
})

const SampleText = {
  view: ({ attrs: { fontClass } }) =>
    <p className={fontClass}>Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine.</p>
}

const ComponentsDemo = () => {
  let loading = false
  const error = null

  const mockTableData = [{ leadId: 'ff437310-9d62-11ec-b0ad-acde48001122', streetAddress: '1001 Broad St', leadReviewId: '**', createdDate: '2022-03-06 15:35:05', createdDateDisplay: 'March 6, 2022', _hidden: true, _index: 4 }, { leadId: '2310e2cc-9d5f-11ec-b0ad-acde48001122', streetAddress: '10 Main Street', createdDate: '2022-03-06 15:07:27', createdDateDisplay: 'March 6, 2022', _hidden: true, _index: 5 }, { leadId: '2306c3e6-9ab7-11ec-b0ad-acde48001122', streetAddress: '42 Test Ave', lead_review_id: 'f4152c98-9ab7-11ec-b0ad-acde48001122', createdDate: '2022-03-03 05:59:49', createdDateDisplay: 'March 3, 2022', _hidden: true, _index: 6 }, { leadId: 'f47d7902-9ab6-11ec-b0ad-acde48001122', streetAddress: '91 Test Ave', lead_review_id: '3af3a0f4-2d68-11ed-914d-02420d0a0003', createdDate: '2022-03-03 05:58:31', createdDateDisplay: 'March 3, 2022', _hidden: true, _index: 7 }, { leadId: 'd559661e-9ab4-11ec-b0ad-acde48001122', streetAddress: '744 Test Ave', createdDate: '2022-03-03 05:43:20', createdDateDisplay: 'March 3, 2022', _hidden: true, _index: 8 }]

  // table.items = mockTableData
  // table._data = mockTableData
  table.api.appendData({ data: mockTableData, meta: { count: mockTableData.length, page: 1 } })

  const formi = prepareForm({
    userId: [required(true)],
    select: [],
    radio: [],
    message: [],
    checkbox1: [],
    checkbox2: [],
    radioGroup: []
  }, {
    userId: 'xxxxxx-xxxxx-xxxxxxxxx-xxxxxx',
    radio: '$1K to $10K',
    message: '',
    select: 'Default Option' // { id: 1, name: 'Default Option', default: true }
  })

  const onSubmit = (formData) => {
    setLoading(true)

    console.log('formData: ', formData)

    setTimeout(() => {
      setLoading(false)
    }, 1800)
  }

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1800)
  }

  function setLoading (val) {
    loading = val
    m.redraw()
  }

  return {
    oncreate: () => {
      const radiobuttons = document.querySelectorAll('lc-radio-button')
      // radioGroups holds the radiobuttons related to a single input field
      const radioGroups = {}

      for (let i = 0, l = radiobuttons.length; i < l; i++) {
        const rb = radiobuttons[i]
        var dataFor = rb.getAttribute('for')
        radioGroups[dataFor] = radioGroups[dataFor] || []
        radioGroups[dataFor].push(rb)

        rb.addEventListener('click', function (e) {
          e.stopPropagation()

          // uncheck all other radio options
          radioGroups[dataFor].forEach(function (el) {
            el.classList.remove('lc-checked')
            el.previousElementSibling.removeAttribute('checked')
          })

          // check this option
          this.classList.add('lc-checked')
          this.previousElementSibling.setAttribute('checked', 'checked')
        })
      }
    },
    view: () => (
      <div>
        <div className='mb-6 px-4'>
          <div className='flex flex-row items-center my-2 <lg:pl-2 <sm:pr-4 <sm:my-1'>
            {/* <m.route.Link
              selector='i'
              class='icon icon-chevron-left text-black text-2xl mr-2 cursor-pointer'
              style='margin-top: -3px;'
              href={`/lead/${m.route.param('id')}`}
            /> */}
            <h3>Kitchen Sink</h3>
          </div>

          {loading && <MdProgress className='flex justify-center items-center mt-8' size={60} />}
          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h2 className='mt-0'>Typography</h2>

            <div className='grid inline-grid grid-cols-3 md:grid-cols-3 <md:grid-cols-1 auto-cols-auto gap-2'>
              <div className='px-2 mb-4'>
                <h3 className='my-0 font-proxima-nova text-red-500'>Proxima Nova</h3>
                <h1 className='my-0 font-proxima-nova'>h1 Headline</h1>
                <h2 className='my-0 font-proxima-nova'>h2 Headline</h2>
                <h3 className='my-0 font-proxima-nova'>h3 Headline</h3>
                <h4 className='my-0 font-proxima-nova'>h4 Headline</h4>
                <h5 className='my-0 font-proxima-nova'>h5 Headline</h5>
                <SampleText fontClass='font-proxima-nova' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-brandon-grotesque text-red-500'>Brandon Grotesque</h3>
                <h1 className='my-0 font-brandon-grotesque'>h1 Headline</h1>
                <h2 className='my-0 font-brandon-grotesque'>h2 Headline</h2>
                <h3 className='my-0 font-brandon-grotesque'>h3 Headline</h3>
                <h4 className='my-0 font-brandon-grotesque'>h4 Headline</h4>
                <h5 className='my-0 font-brandon-grotesque'>h5 Headline</h5>
                <SampleText fontClass='font-brandon-grotesque' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-keep-calm text-red-500'>Keep Calm</h3>
                <h1 className='my-0 font-keep-calm'>h1 Headline</h1>
                <h2 className='my-0 font-keep-calm'>h2 Headline</h2>
                <h3 className='my-0 font-keep-calm'>h3 Headline</h3>
                <h4 className='my-0 font-keep-calm'>h4 Headline</h4>
                <h5 className='my-0 font-keep-calm'>h5 Headline</h5>
                <SampleText fontClass='font-keep-calm' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-montserrat text-red-500'>Montserrat</h3>
                <h1 className='my-0 font-montserrat'>h1 Headline</h1>
                <h2 className='my-0 font-montserrat'>h2 Headline</h2>
                <h3 className='my-0 font-montserrat'>h3 Headline</h3>
                <h4 className='my-0 font-montserrat'>h4 Headline</h4>
                <h5 className='my-0 font-montserrat'>h5 Headline</h5>
                <SampleText fontClass='font-montserrat' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-myriad-pro text-red-500'>Myriad Pro</h3>
                <h1 className='my-0 font-myriad-pro'>h1 Headline</h1>
                <h2 className='my-0 font-myriad-pro'>h2 Headline</h2>
                <h3 className='my-0 font-myriad-pro'>h3 Headline</h3>
                <h4 className='my-0 font-myriad-pro'>h4 Headline</h4>
                <h5 className='my-0 font-myriad-pro'>h5 Headline</h5>
                <SampleText fontClass='font-myriad-pro' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-romana-bt text-red-500'>Romana BT</h3>
                <h1 className='my-0 font-romana-bt'>h1 Headline</h1>
                <h2 className='my-0 font-romana-bt'>h2 Headline</h2>
                <h3 className='my-0 font-romana-bt'>h3 Headline</h3>
                <h4 className='my-0 font-romana-bt'>h4 Headline</h4>
                <h5 className='my-0 font-romana-bt'>h5 Headline</h5>
                <SampleText fontClass='font-romana-bt' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-source-sans-pro text-red-500'>Source Sans Pro</h3>
                <h1 className='my-0 font-source-sans-pro'>h1 Headline</h1>
                <h2 className='my-0 font-source-sans-pro'>h2 Headline</h2>
                <h3 className='my-0 font-source-sans-pro'>h3 Headline</h3>
                <h4 className='my-0 font-source-sans-pro'>h4 Headline</h4>
                <h5 className='my-0 font-source-sans-pro'>h5 Headline</h5>
                <SampleText fontClass='font-source-sans-pro' />
              </div>

              <div className='px-2 mb-4'>
                <h3 className='my-0 font-geomanist text-red-500'>Geomanist</h3>
                <h1 className='my-0 font-geomanist'>h1 Headline</h1>
                <h2 className='my-0 font-geomanist'>h2 Headline</h2>
                <h3 className='my-0 font-geomanist'>h3 Headline</h3>
                <h4 className='my-0 font-geomanist'>h4 Headline</h4>
                <h5 className='my-0 font-geomanist'>h5 Headline</h5>
                <SampleText fontClass='font-geomanist' />
              </div>
            </div>
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>@mui</h3>
            <div className='inline-flex w-full'>

              <div className='flex basis-1/2'>

                <Formi
                  className='lc-form mt-4'
                  form={formi}
                  onSubmit={onSubmit}
                >
                  <div className='flex flex-col'>
                    <div className='flex flex-row mb-4'>
                      <MdCheckbox
                        name='checkbox1'
                        field={formi.checkbox1}
                        label='checkbox 1'
                      />
                      <MdCheckbox
                        name='checkbox1'
                        disabled
                        active
                        label='disabled'
                      />
                    </div>
                    <div className='flex flex-col mb-4'>
                      <MdRadioGroup
                        layout='column'
                        options={[
                          { id: 0, text: '0 to $1K', value: '0 to $1K' },
                          { id: 1, text: '$1K to $10K', value: '$1K to $10K' },
                          { id: 2, text: '$10K to $50K', value: '$10K to $50K' },
                          { id: 3, text: '$50K to $100K', value: '$50K to $100K' }
                        ]}
                        value={formi.radio.getData()}
                        onchange={(obj) => {
                          formi.radio.setData(obj.text)
                        }}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <md-input-container>
                        <label className='_md-container-ignore md-select-label'>my select</label>
                        <MdSelect
                          id='required-select-id'
                          name='filter'
                          ariaLabel='Select Filter'
                          value={formi.select.getData()}
                          options={[
                            { id: 1, value: 'Default Option', text: 'Default Option', default: true },
                            { id: 2, value: 'Option #1', text: 'Option #1' },
                            { id: 3, value: 'Option #2', text: 'Option #2' }
                          ]}
                          containerClass=''
                          style=''// This style goes on the md-select element
                          onchange={obj => {
                            formi.select.setData(obj.text)
                          }}
                        />
                      </md-input-container>
                    </div>
                    <div className='flex flex-col'>
                      <div class='mb-5'>
                        <label for='message' class='font-bold mb-5'>Message</label>
                        <div class='mb-2'>What would you tell other contractors about this lead?</div>
                        <textarea
                          id='message'
                          class='c-input-field' name='message' cols='40' rows='10' autocapitalize='none'
                          autocorrect='off'
                          oninput={(e) => {
                            formi.message.setData(e.target.value)
                          }}
                        />
                      </div>

                      <div className='flex justify-end'>
                        <Button
                          text='Submit'
                          style='primary'
                          active={loading}
                          onclick={handleClick}
                          disabled={formi.message.getData().trim() === ''}
                          spinner
                        />
                      </div>

                    </div>

                  </div>
                </Formi>

              </div>
              <div className='flex basis-1/2'>
                <pre className='text-xs'>{JSON.stringify(formi.getData(), null, 2)}</pre>
              </div>
            </div>

          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3 className='mb-4'>Buttons</h3>

            <h4>Primary Buttons</h4>
            <h6 className='mb-0'>Standard Variant</h6>
            <div className='flex flex-row flex-wrap w-full mb-2'>
              <div className='mt-4'>
                <Button
                  style='primary'
                  variant='standard'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='standard'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='standard'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='standard'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

            </div>
            <h6 className='mb-0'>Small</h6>
            <div className='flex flex-row flex-wrap w-full mb-2'>
              <div className='mt-4'>
                <Button
                  className='lc-button-sm'
                  style='primary'
                  variant='standard'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-sm'
                  style='primary'
                  variant='standard'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-sm'
                  style='primary'
                  variant='standard'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-sm'
                  style='primary'
                  variant='standard'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

            </div>
            <h6 className='mb-0'>Large</h6>
            <div className='flex flex-row flex-wrap w-full mb-8'>
              <div className='mt-4'>
                <Button
                  className='lc-button-lg'
                  style='primary'
                  variant='standard'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-lg'
                  style='primary'
                  variant='standard'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-lg'
                  style='primary'
                  variant='standard'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  className='lc-button-lg'
                  style='primary'
                  variant='standard'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

            </div>

            <h6 className='mb-0'>Outlined Variant</h6>
            <div className='flex flex-row flex-wrap w-full mb-8'>
              <div className='mt-4'>
                <Button
                  style='primary'
                  variant='outlined'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='outlined'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='outlined'
                  octicon='left'
                  onclick={handleClick}
                  text='Octicon Button'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='primary'
                  variant='outlined'
                  octicon
                  onclick={handleClick}
                  text='Octicon Button'
                />
              </div>

            </div>

            <h4>Secondary Buttons</h4>
            <h6 className='mb-0'>Standard Variant</h6>
            <div className='flex flex-row flex-wrap w-full mb-8'>
              <div className='mt-4'>
                <Button
                  style='secondary'
                  variant='standard'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='secondary'
                  variant='standard'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='secondary'
                  variant='standard'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='secondary'
                  variant='standard'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>
            </div>

            <h4>Default Buttons</h4>
            <h6 className='mb-0'>Standard Variant</h6>
            <div className='flex flex-row flex-wrap w-full mb-8'>
              <div className='mt-4'>
                <Button
                  style='default'
                  variant='standard'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='standard'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='standard'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='standard'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

            </div>

            <h6 className='mb-0'>Outlined Variant</h6>
            <div className='flex flex-row flex-wrap w-full mb-8'>
              <div className='mt-4'>
                <Button
                  style='default'
                  variant='outlined'
                  active={loading}
                  onclick={handleClick}
                  spinner
                  text='Spinner'
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='outlined'
                  text='Submit'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='outlined'
                  octicon='left'
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

              <div className='ml-4 mt-4'>
                <Button
                  style='default'
                  variant='outlined'
                  octicon
                  text='Octicon Button'
                  onclick={handleClick}
                />
              </div>

            </div>

          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Icons</h3>

            <h4>Feather Icons</h4>
            <div className='mb-4 flex flex-wrap flex-row'>
              {featherIcons.map((icon, i) =>
                <div className={i > 0 ? 'ml-2' : ''}>
                  <i class={`icon ${icon} text-slate-900 dark:text-slate-400 text-md`} />
                </div>)}
            </div>

            <h4>Icon Buttons</h4>
            <MdIconButton
              filled
              tooltip='hover text'
            >
              <MdIcon
                id='search-icon'
                icon={calendarClock}
                style='margin: 6px 10px;'
                // onclick={iconClick}
              />
            </MdIconButton>

            <MdIconButton className='ml-4'>
              <MdIcon
                id='search-icon'
                icon={calendarClock}
                tooltip='hover text'
                // className={attrs.value ? 'hover-pointer' : ''}
                style='margin: 6px 10px;'
                // onclick={iconClick}
              />
            </MdIconButton>

          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Star Rating</h3>
            <StarRating value={1} size={22} />
            <StarRating value={2} size={24} />
            <StarRating value={3} size={26} />
            <StarRating value={4} size={28} />
            <StarRating value={5} size={30} />
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6 flex flex-col'>
            <h3 className='mb-4'>Progress</h3>
            <div className='inline-flex flex-row items-center mb-8'>
              <MdProgress size={28} className='ml-4' />
              <MdProgress size={26} className='ml-4' />
              <MdProgress size={24} className='ml-4' />
              <MdProgress size={22} className='ml-4' />
              <MdProgress size={20} className='ml-4' />
              <MdProgress size={18} className='ml-4' />
            </div>
            <div className='inline-flex flex-row items-center'>
              <Spinner size={28} className='ml-4' />
              <Spinner size={26} className='ml-4' />
              <Spinner size={24} className='ml-4' />
              <Spinner size={22} className='ml-4' />
              <Spinner size={20} className='ml-4' />
              <Spinner size={18} className='ml-4' />
            </div>
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Datatable</h3>
            <MdToolbar>
              <MdToolbarSearch table={table} />
              <span className='flex' />
              <MdToolbarFilterContainer className='pr-4'>
                <MdToolbarFilter
                  style='width: 141px'
                  title='Reviewed'
                  table={table}
                  filter='reviewed'
                />
              </MdToolbarFilterContainer>
            </MdToolbar>
            {/* <MdTable className='md-row-select'> */}
            <MdTable table={table}>
              <MdTableHead table={table} />
              <MdTableProgress loaded={false} colSpan={table.thead.length} />
              <MdTableBody table={table}>
                {table.items?.map((r) =>
                  <>
                    <MdTableRow data={r} table={table} />
                    {r._expanded &&
                      <MdTableExpandedRow table={table}>
                        <pre>{JSON.stringify(r, null, 2)}</pre>
                      </MdTableExpandedRow>}
                  </>)}

                {error &&
                  <MdEmptyRow table={table}>
                    <ErrorContainer className='p-4' style='min-height: 200px;'>
                      <strong>Something went wrong.</strong>
                      <Button className='mt-8 lc-button-sm' text='Retry' />
                    </ErrorContainer>
                  </MdEmptyRow>}

                {/* {!error && (table.loading || !table.items?.length) && */}
                <MdEmptyRow table={table}>
                  <MdProgress className='flex justify-center' />
                  {/* {table.loading && table.items && <MdProgress className='flex justify-center' />}
                  {!table.loading && !table.items?.length && <div>No results to show.</div>} */}
                </MdEmptyRow>
                {/* } */}
              </MdTableBody>
            </MdTable>
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Error Container</h3>
            <ErrorContainer style='min-height: 200px'>
              <strong>Unable to load report.</strong>
              <Button className='mt-8 lc-button-sm' text='Retry' />
            </ErrorContainer>
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Not Found</h3>
            <NotFound />
          </div>

          <div className='dark:bg-stone-900 bg-white shadow-xl rounded-xl p-8 mb-6'>
            <h3>Maintenance Page</h3>
            <MaintenancePage />
          </div>

        </div>
      </div>
    )
  }
}

export default ComponentsDemo
