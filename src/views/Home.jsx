import m from 'mithril'
import config from '/config'
import AppHeader from '/components/AppHeader'
import PageTitle from '/components/PageTitle'
import mithrilLogo from '/assets/logo/mithril.svg'
import viteLogo from '/assets/logo/vite.svg'
import windiLogo from '/assets/logo/windi.svg'

const FeatureBox = {
  view: ({ children }) =>
    <div className='w-1/3 <sm:w-full <md:w-1/2 mb-4'>
      <div className='h-full mt-4 p-4 m-2 shadow-md rounded bg-white dark:bg-stone-900 dark:text-stone-300'>
        {children}
      </div>
    </div>
}

const Title = {
  view: ({ attrs, children }) =>
    <div className='font-bold mb-2'>
      {attrs.href
        ? <a className='flex align-center text-blue-400' href={attrs.href} target='_blank' rel='noreferrer'>{children}</a>
        : <div>{children}</div>}
    </div>
}

const Description = {
  view: ({ children }) =>
    <div className='text-sm'>{children}</div>
}

const Home = () => ({
  view: function () {
    return (
      <>
        <AppHeader />
        <div className='container mx-auto pt-4 pb-8 flex items-center justify-center flex-col'>
          <PageTitle
            className='text-3xl mb-6 <sm:text-2xl'
            title={config.appName}
          />
          <div className='flex flex-row items-center'>
            <img className='w-20 <sm:w-14' src={mithrilLogo} />
            <div className='font-bold text-5xl px-4'>+</div>
            <img className='w-20 <sm:w-14' src={windiLogo} />
            <div className='font-bold text-5xl px-4'>+</div>
            <img className='w-20 <sm:w-14' src={viteLogo} />
          </div>

          <div className='inline-flex flex-row flex-wrap justify-around min-w-full mt-4'>
            <FeatureBox>
              <Title href='https://mithril.js.org/'>Mithril</Title>
              <Description>Lightweight and unopinionated. You control the DOM. Hyperscript of JSX, pick your flavor.</Description>
            </FeatureBox>
            <FeatureBox>
              <Title href='https://windicss.org/'>Windi CSS</Title>
              <Description>Utility-first CSS framework for fast prototyping.</Description>
            </FeatureBox>
            <FeatureBox>
              <Title href='https://vitejs.dev/'>Vite</Title>
              <Description>Next generation front end tooling.</Description>
            </FeatureBox>
            <FeatureBox>
              <Title href='https://github.com/ludbek/powerform'>Powerform</Title>
              <Description>Awesome form management and validation.</Description>
            </FeatureBox>
            <FeatureBox>
              <Title>
                <m.route.Link className='text-blue-400' href='/formi'>
                  Formi
                </m.route.Link>
              </Title>
              <Description>Powerform wrapper to help you build forms with ease.</Description>
            </FeatureBox>

            <FeatureBox>
              <Title href='https://feathericons.com/'>
                <i className='icon icon-feather mr-2 text-xl' /> Feather Icons
              </Title>
              <Description>
                Simple and beautiful icons.
              </Description>
            </FeatureBox>
            <FeatureBox>
              <Title>Deployment Ready</Title>
              <Description>Deploy to AWS with <a className='text-blue-400' href='https://gulpjs.com' target='_blank' rel='noreferrer'>gulp</a>.</Description>
            </FeatureBox>
          </div>
        </div>
      </>
    )
  }
})

export default Home
