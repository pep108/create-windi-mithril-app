/**
 * This function removes all the undefined & null keys from an object
 * and returns a new object
 * @param {obj} obj
 * @param {obj} options {
 *   {bool} removeEmptyString
 * }
 */
const removeEmptyKeys = (obj, options) => {
  options = options || {}

  const newObj = {}
  if (typeof (obj) === 'object') {
    Object.keys(obj).forEach(function (key) {
      let val = obj[key]

      if (val && val.constructor === Array) {
        const cleanedArray = []
        // Iterate over the array and clean the objects in it
        val.forEach(function (o) {
          cleanedArray.push(removeEmptyKeys(o))
        })
        val = cleanedArray
      }

      if (typeof (val) === 'string') {
        if (options.removeEmptyString && val.trim() === '') {
          // skip this key
        } else {
          newObj[key] = val
        }
      } else if (val !== undefined && val !== null) {
        newObj[key] = val
      }
    })

    return newObj
  }

  // If this was not an object, then we'll return the value unchanged
  return obj
}

export default removeEmptyKeys
