import './styles.scss'

import m from 'mithril'

import { star } from '@mui/icons'
import MdIcon from '../@mui/MdIcon'

const STARS = [0, 1, 2, 3, 4]

const StarRating = () => {
  return {
    view: ({ attrs: { value = 0, size = 22 } }) => (
      <div className='layout-row star-rating'>
        {STARS.map((s, i) => (
          <MdIcon
            key={i}
            icon={star}
            size={size}
            className={(value - i <= 0) ? 'text-muted' : 'text-yellow'}
          />
        ))}
      </div>
    )
  }
}

const EditableStarRating = ({ attrs }) => {
  const _this = {
    value: attrs.value || 0
  }

  const initStars = (rating) => {
    _this.stars.forEach((el, i) => {
      if (i < rating) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  }
  return {
    oncreate: ({ attrs: { onchange }, dom }) => {
      _this.stars = [...dom.querySelectorAll('i.icon--star')]

      // Listen for clicks
      _this.stars.forEach((el, i) => {
        el.addEventListener('click', () => {
          const newVal = i + 1
          _this.value = newVal

          onchange(newVal)
          initStars(newVal)
        })

        el.addEventListener('mouseover', () => { initStars(i) })
        el.addEventListener('mouseout', () => { initStars(_this.value) })
      })

      initStars(_this.value)
    },
    view: ({ attrs: { value, size = 22 } }) => {
      if (value !== _this.value) {
        _this.value = value
        initStars(value)
      }

      return (
        <div className='layout-row star-rating'>
          {STARS.map((s, i) => (
            <MdIcon
              key={i}
              icon={star}
              size={size}
            // className={`icon--star ${(value - i <= 0) ? 'text-muted' : 'text-yellow'}`}
              className='icon--star'
            />
          ))}
        </div>
      )
    }
  }
}

export { StarRating, EditableStarRating }
