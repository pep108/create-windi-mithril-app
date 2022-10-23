import './styles.scss'
import m from 'mithril'

/**
 * A component that will show the maintenance banner.
 */
const MaintenancePage = () => {
  return {
    view: () => {
      return (
        <div className='maintenance'>
          <article>
            <h1>We'll be back soon!</h1>
            <div>
              <p>
                {m.trust('Sorry for the inconvenience but we\'re performing some maintenance at the moment. If you need to you can always <a href="mailto:dev@example.com">contact us</a>, otherwise we\'ll be back online shortly!')}
              </p>
              <p>
                - The Team
              </p>
            </div>
          </article>
        </div>
      )
    }
  }
}
export default MaintenancePage
