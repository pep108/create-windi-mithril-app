import './md-progress-linear.css'
import m from 'mithril'

const MdProgressLinear = {
  view: ({ attrs: { className = '', style = '' } }) => {
    return (
      <md-progress-linear
        className={className}
        style={style}
        // mdMode='indeterminate'
        role='progressbar'
      >
        <div className='_md-container _md-mode-indeterminate'>
          <div className='_md-dashed' />
          <div className='_md-bar _md-bar1' />
          <div className='_md-bar _md-bar2' />
        </div>
      </md-progress-linear>
    )
    // return [
    //   m('md-progress-linear', {
    //     class: className,
    //     style,
    //     // 'md-mode': 'indeterminate',
    //     role: 'progressbar'
    //   }, m('div', { class: '_md-container _md-mode-indeterminate' },
    //     m('div', { class: '_md-dashed' }),
    //     m('div', { class: '_md-bar _md-bar1' }),
    //     m('div', { class: '_md-bar _md-bar2' })
    //   ))
    // ]
  }
}

export default MdProgressLinear
