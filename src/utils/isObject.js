import isArray from './isArray'

const isObject = o => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
}

export default isObject
