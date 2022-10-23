import './styles.css'
import m from 'mithril'

/**
 * SVG Spinner Component
 */
const Spinner = {
  view: ({ attrs }) => {
    const css = 'spinner spinner-ios ' + attrs.class || ''
    const lineStr = 'line[y1="17"][y2="29"][transform="translate(32,32) '
    const anim = 'animate[attributeName="stroke-opacity"][dur="750ms"]'
    const repeat = '[repeatCount="indefinite"]'
    const style = attrs.style || ''

    return [
      m('div', { class: css, icon: 'spinner' },
        m('svg', { viewBox: '0 0 64 64', style },
          m('g', { 'stroke-width': '4', 'stroke-linecap': 'round' },
            m(lineStr + 'rotate(180)"]',
              m(anim + '[values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1"]' + repeat)),
            m(lineStr + 'rotate(210)"]',
              m(anim + '[values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0"]' + repeat)),
            m(lineStr + 'rotate(240)"]',
              m(anim + '[values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1"]' + repeat)),
            m(lineStr + 'rotate(270)"]',
              m(anim + '[values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15"]' + repeat)),
            m(lineStr + 'rotate(300)"]',
              m(anim + '[values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25"]' + repeat)),
            m(lineStr + 'rotate(330)"]',
              m(anim + '[values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35"]' + repeat)),
            m(lineStr + 'rotate(0)"]',
              m(anim + '[values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45"]' + repeat)),
            m(lineStr + 'rotate(30)"]',
              m(anim + '[values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55"]' + repeat)),
            m(lineStr + 'rotate(60)"]',
              m(anim + '[values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65"]' + repeat)),
            m(lineStr + 'rotate(90)"]',
              m(anim + '[values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7"]' + repeat)),
            m(lineStr + 'rotate(120)"]',
              m(anim + '[values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85"]' + repeat)),
            m(lineStr + 'rotate(150)"]',
              m(anim + '[values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1"]' + repeat))
          )
        )
      )
    ]
  }
}

export { Spinner }
