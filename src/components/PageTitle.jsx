import m from 'mithril'

const PageTitle = {
  view: ({ attrs: { title, align = 'center', ...attrs } }) =>
    <h1
      className={`text-${align} text-4xl mt-4 mb-4 <md:text-3xl <md:mt-6 <md:mb-0 <sm:text-xl`}
      {...attrs}
    >{title}
    </h1>
}

export default PageTitle
