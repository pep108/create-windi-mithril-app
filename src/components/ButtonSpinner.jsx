import m from 'mithril'
import { Spinner } from './Spinner'

const ButtonSpinner = {
  view: ({ attrs: { visible } }) =>
    <div
      className={!visible && 'hidden'}
      style={{ position: 'absolute', right: '17px', top: '15px' }}
    >
      <Spinner class='white' />
    </div>
}

export default ButtonSpinner
