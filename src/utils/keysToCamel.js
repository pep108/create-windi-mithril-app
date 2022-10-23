import isObject from './isObject'
import isArray from './isArray'

const toCamel = s =>
  s.replace(/([-_][a-z])/ig, ($1) =>
    $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )

export const keysToCamel = o => {
  if (isObject(o)) {
    const n = {}

    Object.keys(o)
      .forEach(k => {
        n[toCamel(k)] = keysToCamel(o[k])
      })

    return n
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i)
    })
  }

  return o
}

export default keysToCamel
