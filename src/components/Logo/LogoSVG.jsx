import './styles.scss'
import m from 'mithril'

const LogoSVG = () => ({
  view: () => (
    <>
      <svg
        id='40d74f06-7bcb-4fa8-83d7-fe4849e923a7'
        data-name='Layer 2'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          zIndex: -1,
          height: '40px'
        }}
      >
        <defs>
          <g id='circlegroup'>
            <path id='check' fill='327ab7' class='check-shape' d='M52.82,141.33l27-27L104.4,148.4s74-93.06,164.45-137.57c0,0-111.83,86.66-168.93,194.83C99.92,205.66,72.19,162.9,52.82,141.33Z' transform='translate(-3 -10.83)' />
          </g>
        </defs>
      </svg>
      {/* <svg id='Logo' class='Animate-Path' width='100%' height='100%' viewBox='0 0 612 792' xml:space='preserve'> */}
      <svg id='Logo' class='Animate-Path' width='100%' height='100%' viewBox='0 0 212 212' xml:space='preserve'>
        <use id='Draw-Check' class='Animate-Draw' xlink:href='#check' />
      </svg>
    </>
  )
})

export default LogoSVG
