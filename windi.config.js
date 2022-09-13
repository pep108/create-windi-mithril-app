import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

const range = (size, startAt = 1) => Array.from(Array(size).keys()).map(i => i + startAt)

export default {
  darkMode: 'class', // or 'media'
  theme: {
    ringWidth: 0,
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      colors: {
        stone: {
          50: '#f6f7eB',
          800: '#2c2a26'
        },
        blue: Object.assign({}, colors.sky, { 400: '#46b1c9' }),
        pink: colors.fuchsia,
        red: {
          500: '#e94f37'
        }
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      }
    }
  },
  // Ensure dynamic concatenations don't get shaken out
  safelist: [
    'hidden',
    range(3).map(i => `p-${i}`), // p-1 to p-3
    range(10).map(i => `mt-${i}`) // mt-1 to mt-10
  ],
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)'
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)'
        }
      }
      addUtilities(newUtilities)
    }),
    plugin(({ addComponents }) => {
      // Application-themed components
      const links = {
        a: {
          color: '#e94f37',
          textDecoration: 'none'
        }
      }
      addComponents(links)

      const inputs = {
        '.m-input[type="text"], .m-input[type="email"], .m-input[type="url"], .m-input[type="password"], .m-input[type="number"], .m-input[type="date"], .m-input[type="datetime-local"], .m-input[type="month"], .m-input[type="search"], .m-input[type="tel"], .m-input[type="time"], .m-input[type="week"], [multiple], textarea, select': {
          padding: '.75rem',
          borderRadius: '.5rem',
          border: '1px solid',
          borderColor: colors.gray[400]
        },
        '.m-input[type="text"]:focus, .m-input[type="email"]:focus, .m-input[type="url"]:focus, .m-input[type="password"]:focus, .m-input[type="number"]:focus, .m-input[type="date"]:focus, .m-input[type="datetime-local"]:focus, .m-input[type="month"]:focus, .m-input[type="search"]:focus, .m-input[type="tel"]:focus, .m-input[type="time"]:focus, .m-input[type="week"]:focus, [multiple]:focus, textarea:focus, select:focus': {
          boxShadow: `0 0 3px 2px ${colors.emerald[600]}`,
          borderColor: colors.emerald[600]
        },
        '.m-input[error]:not(:focus)': {
          borderColor: colors.red[600]
        }
      }
      addComponents(inputs)
    }),
    require('windicss/plugin/filters'),
    require('windicss/plugin/forms'),
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/typography')({
      modifiers: ['DEFAULT', 'sm', 'lg', 'red']
    })
  ]
}
