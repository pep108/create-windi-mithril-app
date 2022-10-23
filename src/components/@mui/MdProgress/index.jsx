import './styles.css'
import m from 'mithril'

const Progress = ({ attrs: { size = 22, className = '' } }) => {
  return {
    view: () => (
      <div className={`md-progress-circularX ${className}`}>
        <svg
          class='spinner'
          width={`${size}px`}
          height={`${size}px`}
          viewBox='0 0 66 66'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle class='path' fill='none' stroke-width='6' stroke-linecap='round' cx='33' cy='33' r='30' />
        </svg>
      </div>
    )
  }
}

export default Progress
