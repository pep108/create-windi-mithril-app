/**
 * Function used to filter the table with the search box
 * @param {array} items
 * @param {obj} props
 *    props: {
 *      name: search,  // search is the value of the search field
 *      category: search
 *    }
 * @param {fn} matchFn (optional) - custom search/matching function
 *    We can pass in a custom matching function if we need to search in a non-standard pattern
 *    such as is used to search a nested array in the Mangage Inventory View
 */
const filterTable = (items, props, matchFn) => {
  // console.log('filterTable: ', items, props)
  let out = []

  // if (Object.prototype.toString.call(items) === '[object Array]') {
  if (items.constructor === Array) {
    items.forEach(function (item) {
      let itemMatches = false

      const keys = Object.keys(props)
      for (let i = 0; i < keys.length; i++) {
        const prop = keys[i]
        const text = props[prop].toLowerCase()

        // Run the custom matching function if it exists
        // console.log('checking custom match....')
        if (typeof matchFn === 'function' && matchFn(item, text)) {
          itemMatches = true
          break
        }

        // Check if the property value matches
        // console.log('checking props.....', prop, item[prop], text)
        if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
          itemMatches = true
          break
        }
      }

      if (itemMatches) {
        out.push(item)
      }
    })
  } else {
    // Let the output be the input untouched
    out = items
  }

  // console.log('*** out: ', out)

  return out
}

export default filterTable
