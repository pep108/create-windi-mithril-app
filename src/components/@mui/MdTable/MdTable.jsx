import m from 'mithril'
import { findIndex, merge, uniqBy } from 'lodash'

const debug = function () { }
// const debug = console.log.bind(window.console, '[MdTable]: ')

/**
 * add .md-row-select for select tables | note: the first column is expected to be a checkbox
 */
const MdTable = ({ attrs: { table } }) => {
  const onInserted = e => endpointOnInserted.call(table, e)
  const onUpdated = e => endpointOnUpdated.call(table, e)
  const onDeleted = e => endpointOnDeleted.call(table, e)

  return {
    oncreate: ({ attrs: { table } }) => {
      if (table.endpoint) {
        window.addEventListener(table.endpoint + ':inserted', onInserted)
        window.addEventListener(table.endpoint + ':updated', onUpdated)
        window.addEventListener(table.endpoint + ':deleted', onDeleted)
      }
    },
    onremove: ({ attrs: { table } }) => {
      if (table.endpoint) {
        window.removeEventListener(table.endpoint + ':inserted', onInserted)
        window.removeEventListener(table.endpoint + ':updated', onUpdated)
        window.removeEventListener(table.endpoint + ':deleted', onDeleted)
      }
    },
    view: ({ attrs: { table, className = '' }, children }) => (
      <table className={`md-table rounded-xl ${table.onRowClick ? 'md-row-clickable' : ''} ${className}`}>
        {children}
      </table>
    )
  }
}

function endpointOnInserted (e) {
  const table = this
  const data = table.transformData ? table.transformData(e.detail) : e.detail
  const uniqueField = table.uniqueField || 'id' // unique field defaults to 'id'
  debug('endpointOnInserted fired....', data)

  const compare = o => o[uniqueField] === data[uniqueField]

  if (table.items) {
    const itemsIndex = findIndex(table.items, compare)
    if (itemsIndex === -1) {
      table.items.push(data)
    } else {
      merge(table.items[itemsIndex], data)
    }
  }
  if (table._data) {
    const dataIndex = findIndex(table._data, compare)
    if (dataIndex === -1) {
      table._data.push(data)
    } else {
      merge(table._data[dataIndex], data)
    }
  }

  // Make sure we don't end up with duplicates
  if (table.items) {
    table.items = uniqBy(table.items, uniqueField)
  }
  if (table._data) {
    table._data = uniqBy(table._data, uniqueField)
  }

  table.applySortFilter()
}

function endpointOnUpdated (e) {
  const table = this
  const data = e.detail
  debug('endpointOnUpdated fired....', data)
  let found = false

  // Set the offer sent to update the view
  const updateValueInArray = function (arr) {
    if (!arr) { return }

    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i].id === data.id) {
        found = true
        arr[i] = data
        break
      }
    }

    if (!found) {
      arr.push(data)
    }
  }

  updateValueInArray(table.items)
  updateValueInArray(table._data)
  updateValueInArray(table._searchResults)

  table.applySortFilter()
}

function endpointOnDeleted (e) {
  const table = this
  const recordId = e.detail
  debug('onEndpointDeleted fired....', recordId)

  // Set the offer sent to update the view
  const updateValueInArray = function (arr) {
    if (!arr) { return }

    const index = findIndex(arr, { id: recordId })
    if (index > -1) {
      arr.splice(index, 1)
    }
  }

  updateValueInArray(table.items)
  updateValueInArray(table._data)
  updateValueInArray(table._searchResults)

  table.applySortFilter()
}

export default MdTable
