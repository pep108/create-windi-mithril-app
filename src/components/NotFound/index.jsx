import m from 'mithril'
import missingResults from './missing-results.svg'

const NotFound = {
  view: ({ attrs: { containerClass }, children }) => (
    <div
      className={`flex flex-col items-center max-w-lg m-auto justify-center p-2 ${containerClass || ''}`}
      direction='column'
      wrap='nowrap'
    >
      <img
        src={missingResults}
        alt='Nothing Found'
        width={190}
        style='padding: 20px;'
      />
      {children}
    </div>
  )
}

export default NotFound
