import m from 'mithril'

const MdSortIcon = {
  view: function ({ attrs: { order } }) {
    return (
      <md-icon className={`md-sort-icon md-${order}`}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='100%'
          height='100%'
          viewBox='0 0 24 24'
          preserveAspectRatio='xMidYMid meet'
          focusable='false'
        >
          <path d='M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z' />
        </svg>
      </md-icon>
    )

    // return [
    //   m('md-icon', { class: 'md-sort-icon md-' + sortOrder },
    //     m('svg[xmlns="http://www.w3.org/2000/svg"][width="100%"][height="100%"][viewBox="0 0 24 24"]
    //     [preserveAspectRatio="xMidYMid meet"][focusable="false"]',
    //       m('path', { d: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z' })))
    // ]
  }
}

export default MdSortIcon
