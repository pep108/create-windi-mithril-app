import isObject from './isObject'
import isArray from './isArray'

const toUnderscore = s =>
  s.replace(/([A-Z])/g, '_$1').toLowerCase()

const keysToUnderscore = o => {
  if (isObject(o)) {
    const n = {}

    Object.keys(o)
      .forEach(k => {
        n[toUnderscore(k)] = keysToUnderscore(o[k])
      })

    return n
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToUnderscore(i)
    })
  }

  return o
}

export default keysToUnderscore
