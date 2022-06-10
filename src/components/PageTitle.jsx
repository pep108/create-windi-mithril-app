import m from 'mithril'

const PageTitle = {
  view: ({ attrs: { title, ...attrs } }) =>
    <h1
      className='text-center text-4xl mt-12 mb-4 <md:text-3xl <md:mt-6 <md:mb-0 <sm:text-xl'
      style={{ fontFamily: 'Proxima Nova Th', fontWeight: 800, fontStyle: 'normal' }}
      {...attrs}
    >{title}
    </h1>
}

export default PageTitle
