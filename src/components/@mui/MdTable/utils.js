const isFunction = (o) => typeof o === 'function'

const randomString = (length, chars) => {
  length = length || 8

  let result = ''
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

const sortDates = (arr, field, order) => {
  console.warn('sorting dates: ', arr, order)
  arr = arr.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    if (order === 'desc') {
      return new Date(b[field]) - new Date(a[field])
    }

    // Ascending
    return new Date(a[field]) - new Date(b[field])
  })

  // var x = function (a, b) {
  // 	// Turn your strings into dates, and then subtract them
  // 	// to get a value that is either negative, positive, or zero.
  // 	// Ascending
  // 	return new Date(b.created_date) - new Date(a.created_date)
  // }

  // var y = function (a, b) {
  // 	// Turn your strings into dates, and then subtract them
  // 	// to get a value that is either negative, positive, or zero.
  // 	// Ascending
  // 	return new Date(a.created_date) - new Date(b.created_date)
  // }

  return arr
}

export {
  isFunction,
  randomString,
  sortDates
}
