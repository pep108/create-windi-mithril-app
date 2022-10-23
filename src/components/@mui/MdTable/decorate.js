import m from 'mithril'
import fuzzysort from 'fuzzysort'
import { cloneDeep, debounce, forEach, find, orderBy, isEmpty, isEqual, uniqBy } from 'lodash'

import { sortDates, randomString, isFunction } from './utils'

const debug = function () { }
// const debug = console.log.bind(window.console, '[datatable]: ')

function setCellStyle (cell, table) {
  table = table || {}
  let s = cell._sticky || ''

  if (cell.minWidth) {
    // debug('memoized results: ', hyve.memoize(getCellWidth(cell.minWidth, window.innerWidth, table.name)))
    s += ' min-width: ' + getCellWidth(cell.minWidth, window.innerWidth, table.name) + 'px;'
  }
  if (cell.maxWidth) {
    s += ' max-width: ' + getCellWidth(cell.maxWidth, window.innerWidth, table.name) + 'px;'
  }
  return s
}

/**
 * Parses the object and returns the min-width based upon
 * the screen size.
 * @param {int|obj} minWidth
 * @returns int
 */
function getCellWidth (width, screenWidth) {
  // debug('getCellWidth....', width, screenWidth)
  const t = typeof (width)
  if (t === 'number') {
    return width
  }

  if (t === 'object') {
    let returnVal

    forEach(width, (val, key) => {
      // Make sure we return something
      if (!returnVal) { returnVal = val }

      // Find the best fit
      if (key <= screenWidth) {
        returnVal = val
      }
    })

    return returnVal
  }
}

function getCellClasses (columnDef) {
  let css = ''
  if (columnDef.field === 'ACTIONS') {
    css += ' mat-table-sticky mat-row-actions' // mat-table-sticky-border-elem-right
  } else if (columnDef.sticky) {
    css += ' mat-table-sticky'
    if (columnDef.stickyBorder) {
      css += ' mat-table-sticky-border-elem-' + columnDef.sticky
    }
  }

  if (columnDef.date) {
    css += ' mat-cell-date'
  } else if (columnDef.time) {
    css += ' mat-cell-time'
  } else if (columnDef.phone) {
    css += ' mat-cell-phone'
  }
  return css
}

/**
 *
 * @returns {bool} TRUE if all table.items have _selected === TRUE
 */
function allItemsSelected () {
  const self = this
  const items = self.items

  if (!items) { return false }

  for (let i = 0, l = items.length; i < l; i++) {
    if (!items[i]._selected) {
      return false
    }
  }

  return true
}

/**
 *
 * @returns TRUE if just one item in the table.items is selected
 */
function hasSelectedItems () {
  const self = this
  const items = self.items

  if (!items) { return false }

  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i]._selected) {
      return true
    }
  }

  return false
}

function selectedRowCount () {
  const table = this
  const items = table.items || []
  let count = 0

  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i]._selected) {
      count++
    }
  }

  table._selectedRowCount = count

  return count
}

/**
 *
 * @returns []data
 */
function getSelected () {
  const self = this

  return self.items
    ? self.items.filter(function (o) { return o._selected })
    : []
}

function setSelected (val) {
  console.error('setSelected.....', this, val)
  const table = this

  if (!table.items) { return }

  // If the row has an onClick function, we will execute it instead of handling the
  // mutation here. This way the state of the component can update, like in the
  // Edit Tax Group Modal
  const applyClick = typeof table.onRowClick === 'function'

  table.items.forEach(function (o) {
    if (applyClick) {
      if (!o.hidden) {
        // Reverse the value because the onRowClick function will flip it again
        o._selected = !val
        table.onRowClick(o)
      }
    } else {
      if (val) {
        if (!o._hidden) {
          o._selected = val
        }
      } else {
        o._selected = val
      }
    }
  })

  table.api.selectedRowCount()

  table.handleEvent('selectUpdated', table)
}

function setFilter (key, val) {
  debug('[mat-datatable] setFilter....', key, val)
  const table = this

  table._filter[key] = find(table._filters[key], { name: val })

  table.currentPage = 1
  table._dataPage = 1

  table.onFiltersChanged()
}

function updateSearch (val) {
  debug('[datatable] update search....', val)
  const table = this

  table._search = val

  if (table._paginated) {
    // Set Loading
    if (val && val.trim() !== '') {
      table.api.setLoading(true)
    }

    table.api.execSearch(true)
  } else {
    table.currentPage = 1

    if (isFunction(table.onSearchHook)) {
      table.onSearchHook()
      return
    }

    // Since we aren't searching on the server, we'll filter the table
    // locally
    table.applySortFilter()
  }
}

function onSortUpdated () {
  debug('[datatable] onSortUpdatd....')
  const table = this

  /**
   * If the number of items in the table is < the # of rowsPerPage, the we will
   * can skip hitting the server to handle the ordering
   */
  if (table._visibleRowCount < table.rowsPerPage) {
    return
  }

  table.currentPage = 1
  table._fetchData(true, false)
}

function resetCache () {
  const table = this

  Object.assign(table, {
    _filterHash: {},
    // Clearing the _previousSort will cause the table to overwrite the
    // existing data instead of merging it with what is there.
    _previousSort: null
  })
}

function initData (data, totalCount = 0) {
  const table = this
  data = data || []
  debug('initData....', table, data)

  Object.assign(table, {
    items: data,
    _data: data,
    _searchResults: null, // clear the search results
    loading: false,
    _totalCount: totalCount
  })
}

function appendData (data) {
  const table = this
  const meta = data.meta
  debug('appending data to table....', data)

  table._pagesLoaded.push(meta.page)
  const transformedData = typeof table.transformData === 'function' ? data.data.map(o => table.transformData(o)) : data.data

  if (!table.items) {
    table.api.initData(transformedData, meta.count)
  } else {
    Object.assign(table, {
      items: table.items.concat(transformedData),
      _data: table._data.concat(transformedData),
      _searchResults: null, // clear the search results
      loading: false,
      _totalCount: meta.count
    })
  }

  if (table.config.paginate) {
    table.items = table.api.limitRows()
  }
  table.api.applySort()
  table.api.setLoading(false)
  table.api.updateSearch(table._search)

  m.redraw()
  setTimeout(m.redraw, 120)
}

function setSearchResults (data) {
  const table = this
  data = data || []

  debug('[datatable] setSearchResults.....', data)

  Object.assign(table, {
    items: data,
    _searchResults: data,
    _totalCount: data.length
  })

  table.applySortFilter()
  table.api.setLoading(false)

  // m.redraw()
}

function setTableLoading (val, force) {
  debug('[datatable] set table loading: ', val)
  const table = this
  table.loading = val

  // const _update = function (key, val, css) {
  //   css = css || 'hc-hide'
  //   if (table[key]) {
  //     if (val) {
  //       table[key].classList.remove(css)
  //       return
  //     }
  //     table[key].classList.add(css)
  //   }
  // }
  // _update('_progress', val)	//, 'hc-hide')

  // // we want to add the classes if the table is loading and has itemms
  // if (table.items && val && force) {
  //   _update('_mask', false)	//, 'hc-hide')
  //   _update('_table', false, 'mat-table-loading')
  //   return
  // } else {
  //   _update('_mask', val)	//, 'hc-hide')
  // }

  // // This class should only be added when LOADING
  // _update('_table', !val, 'mat-table-loading')

  m.redraw()
}

/**
 * This function is the same as mui.sortByColumn except that it operates
 * within the scope of the table
 * @returns []obj
 */
function applySort () {
  const table = this
  const sortedColumn = table.sortedColumn

  const field = (sortedColumn.sortField || sortedColumn.field)
  // debug('field: ', field)

  // Apply the custom column sort function if one is defined
  if (isFunction(sortedColumn.sortFn)) {
    return sortedColumn.sortFn(table.items, field, sortedColumn.order)
  }

  table.items = orderBy(table.items, [field], [sortedColumn.order])

  return table.items
}

/**
 * This function is the same as mui.limitRows except that it operates
 * within the scope of the table
 * @returns []obj
 */
function limitRows () {
  const table = this
  const filtered = []

  const items = table.items
  const limit = table.rowsPerPage || 5
  const page = table.currentPage || 1

  const startIndex = (page === 1) ? 0 : ((page - 1) * limit)

  for (let i = startIndex; i < (limit * page); i++) {
    if (items[i]) {
      filtered.push(items[i])
    }
  }

  return filtered
}
/**
 * Sometimes, we use a field that is not in the database for the contents of the
 * column. In this case, we will also add a 'sortField' that will be given
 * preference when making the API request
 * @param {obj} sort
 */
function sortedColumnToParam (sort) {
  if (sort) {
    const field = sort.sortField || sort.field
    return [field, sort.order]
  }
  return null
}

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
function filterTable (items, props, matchFn) {
  // debug('filterTable: ', items, props)
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
        if (isFunction(matchFn) && matchFn(item, text)) {
          // debug('using custom matchFn....')
          itemMatches = true
          break
        }

        // Check if the property value matches
        // debug('checking props.....', prop, item[prop], text)
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

  debug('*** out: ', out)

  return out
}

/**
 * Sort the table by the passed in column
 * @param {array} items (already filtered)
 * @param {obj} sortedColumnf
 */
function sortByColumn (items, sortedColumn, columnDef) {
  // var items = table.items
  // var sortedColumn = table.sortedColumn

  debug('sortByColumn items.... UPDATE FOR PERF', sortedColumn, columnDef)
  // debug('[mdDatatable] sorting by column....', sortedColumn)

  const field = (sortedColumn.sortField || sortedColumn.field)
  // debug('field: ', field)

  // Apply the custom column sort function if one is defined
  if (isFunction(sortedColumn.sortFn)) {
    return sortedColumn.sortFn(items, field, sortedColumn.order)
  }

  const iteratees = [field]

  return orderBy(items, iteratees, sortedColumn.order)
}

/**
 * Returns a hash of the filters + the server page so we can avoid
 * fetching data we have already loaded
 * @param {PaginatedDataTable} table
 */
function getFilterHash (table) {
  debug('getFilterHash... ')
  const str = JSON.stringify(table._filter) + table.currentPage + JSON.stringify(table.sortedColumn)
  return str.hashCode()
}

function onPagination () {
  const table = this

  console.warn('onPagination.....')
  // Clear any selected items
  const _clear = function (arr) {
    if (!arr) { return }
    arr.forEach((o) => { delete o._selected })
  }

  if (table._paginated) {
    _clear(table.items)
    _clear(table._data)
    _clear(table._searchResults)
    table.selected = []

    table._fetchData()
  } else {
    debug('[datatable] client-side pagination...')
    table.applySortFilter()
  }
}

function onFiltersChanged () {
  const table = this
  console.error('[datatable] onfilters changed....')

  // Reset the data when the filters change because we are going to load
  // a fresh table from the database.

  // Clear the selected items
  if (table.items) {
    table.items.forEach((o) => { o._selected = false })
  }

  if (table._paginated) {
    table.currentPage = 1
    table._data = []
    table._filterHash = {}

    table._fetchData(true)
  } else {
    // This is for tables that load all the data instead of work by pagination.
    // Namely, all the original tables and resources that won't have enough records
    // to warrant pagination
    table.applySortFilter()
  }
}

function resetItemVisibility (items) {
  if (!items) { return }

  items.forEach((o, i) => {
    o._hidden = false
    o._index = i
  })
}

function fetchData (force, ignoreFilters) {
  const table = this
  console.error('fetchData called....', force, ignoreFilters)

  const broadcastDataLoadedEvent = function () {
    // table.loading = false
    table.api.setLoading(false)

    setTimeout(function () {
      if (typeof (table.handleEvent) === 'function') {
        table.api.selectedRowCount()

        table.handleEvent('dataLoaded', table)
      }
    }, 80)
  }

  /**
   * Keep a search history so we can avoid hitting
   * the server for queries we already made
   */
  let loadFromCache = false
  const query = table._search

  // We need to set the state's self._search or we will end up in a continuous loop
  // where we keep fetching the same data from the server
  if (query) {
    debug('self._search: "' + self._search + '"')
    debug('query', query)
    debug('previousSearch', table._previousSearch)

    /**
     * Don't hit the server twice for the same info.
     * This happens when the debounce function executes at the end
     * of the 250ms delay because TRUE is not passed in for the immediate
     * parameter
     */
    if (self._search === table._previousSearch) {
      console.warn('trying to hit server with the same search....')
      // return
    }

    /**
     * Don't hit the server until there are at least 3 chars
     */
    if (query.length < 2) {
      console.warn('[datatable] skipping search due to short query')

      if (table.loading) {
        table.api.setLoading(false)
      }
      return
    }

    // save the previous search
    table._previousSearch = query

    if (table.serverSideFiltering) {
      // save the has of the search + filters for when we are doing
      // filtering on the server
      const str = query + JSON.stringify(table._filter)
      const queryHash = str.hashCode()
      table._previousSearchHash = queryHash

      if (table._searchHistory.indexOf(queryHash) > -1) {
        loadFromCache = true
      } else {
        table._searchHistory.push(queryHash)
      }

      debug('serverSideFiltering queryHash: ', queryHash)
    } else {
      /**
       * If we already made this query, then we want to load the
       * data from the local cache
       */
      if (table._searchHistory.indexOf(query) > -1) {
        // loadFromCache = true
      } else {
        table._searchHistory.push(query)
      }
    }
  } else {
    // NOTE: We want to get the data from cache so we have
    // the full sever response with total count
    // There is no query, so we need to restore the previous
    // search results
    // if (table._searchResults) {
    // 	table.items = table._data
    // 	table.items.forEach(function (item) {
    // 		item._hidden = false
    // 	})
    // 	table._previousSearch = undefined
    // 	table.applySortFilter()
    // 	// m.redraw()
    // 	return
    // }
    if (table._previousSearch) {
      debug('clearing previous search and loading data from cache')
      // load the data from cache since we just cleared the search query
      table._previousSearch = undefined
      const fh = getFilterHash(table)
      debug('filterHash: ', fh)
      if (table._filterHash[fh]) {
        loadFromCache = true
        console.warn('loading results from cache...')
      }
    } else {
      /**
       * If the filter hash exists, then we know we already loaded this data
       * and we should get it from cache.
       */
      const count = table._filterHash[getFilterHash(table)]
      console.warn('[datatable] count: ', count, getFilterHash(table))

      /**
       * If the sort changed, then we need to hit the server for the data
       * if the # of items in this result set is more than the # of items displayed
       */
      const sortChanged = (!isEqual(sortedColumnToParam(table.sortedColumn), table._previousSort))
      // let tableHasUnloadedItems = true
      // if (table._data) {
      //   tableHasUnloadedItems = table._totalCount > table._data.length
      // }

      if (!force && ((count !== undefined && !sortChanged) || (sortChanged))) { // } && !tableHasUnloadedItems))) {
        debug('filterHash already exists.....',
          table._filter,
          JSON.stringify(table._filter).hashCode(),
          getFilterHash(table),
          count)

        table._totalCount = count
        // debug('totalCount set (2): ', table._totalCount)
        loadFromCache = true
      }
    }
  }

  if (!table.loadData) {
    console.error('table missing loadData function')
    return
  }
  console.warn('[datatable] loadData called...')

  /**
   * @HACK
   * we us the _dataPage to determine what page to get from the server,
   * but that is now the same as currentPage
   */
  table._dataPage = table.currentPage

  /**
   * If the data was loaded from cache, then every record
   * that we have locally stored will be returned. We need
   * to apply the filters so that just those records that should
   * be displayed are displayed.
   */
  if (loadFromCache) {
    let hashCode
    // console.warn('** filtering cached data.....')
    if (table._search) {
      hashCode = table._search.hashCode()
    } else {
      hashCode = getFilterHash(table)
    }
    debug('applying filter to cached data...', table._totalCount, hashCode, table._filterHash[hashCode])

    // Clear the search results
    table._searchResults = null

    let cacheData
    if (table._cache) {
      cacheData = table._cache[hashCode]
    }

    if (cacheData) {
      Object.assign(table, {
        _data: cacheData.data,
        items: cacheData.data,
        _totalCount: cacheData._totalCount
        // fromCache: true,	// REMOVE
      })
    } else {
      // @HACK - it would be best to update all the tables to use a single method of storing
      // data but it was in use as it was being developed and this is how it is.
      // the _cache may be the best was as it is the newest form and can be controlled as to
      // how large it is allowed to grow.
      let listData = []
      if (table._data && !table.data) {
        listData = table._data
      } else {
        listData = table.data || []
        table._data = listData
      }
      table.items = listData

      // TODO REMOVE BLOCK
      // table._data = table.data || []
      // table.items = table.data || []

      // Since this is the old table type, we need to get the count from the
      // _filterHash
      table._totalCount = table._filterHash[hashCode]
    }

    // Reset the item visiblitiy
    table.items.forEach((item) => { item._hidden = false })

    // Apply filtering / sorting after we receive the data
    table.applySortFilter()

    // Reanalyze the size of the scroll container so we can resize the
    // loading mask
    broadcastDataLoadedEvent()

    m.redraw()

    return
  }

  // Make sure we hit the server if we aren't loading the data from cache.
  if (!loadFromCache) {
    force = true
  }

  table.loadData.call(this, table, force, ignoreFilters).then(function (res) {
    debug('mdTable loadData res: ', cloneDeep(res))
    let hashCode

    // Let the view know that these results are from the cache so we can be sure
    // to apply client-side filtering
    table.fromCache = res.fromCache

    // Set a flag for filtered searches
    if (!isEmpty((table._search || '').trim())) {
      // table._searchResults = true
      table._searchResults = res.data
    } else {
      // table._searchResults = false
      table._searchResults = null
    }

    /* if (res.totalCount !== null && res.totalCount !== undefined) {	// hyve.isDefined(res.totalCount)
      let resultIsForToday = false
      /**
       * Keep track if this result is from today & if so, we will skip saving the hahs and cache
       * because we want to load it fresh every time.
       *
      const rangeStart = table._filter ? table._filter.start_date : null
      if (rangeStart && moment().startOf('day').isSame(moment(rangeStart).startOf('day'))) {
        resultIsForToday = true
      }

      table.totalCount = res.totalCount
      // debug('totalCount set (4): ', table.totalCount)
      /**
       * Store an object with the hashCode of the filter string
       * so if we are loading cached data, we can preserve the proper filteredCount
       * for the pagination
       *
      hashCode = table._search ? table._search.hashCode() : getFilterHash(table)	// JSON.stringify(table._filter).hashCode()

      /**
       * Skip saving the filter hash for results of the current day to force
       * reloading the data everytime
       *
      if (!resultIsForToday) {
        table._filterHash[hashCode] = table.totalCount
      }

      if (table._cacheByParams) {
        // /**
        //  * This is used on the OrderHistoryList table only where we don't
        //  * want to generate a large list of orders in memory
        //  *

        if (!resultIsForToday) {
          if (isEmpty((table._search || '').trim())) {
            hashCode = getFilterHash(table)
            debug('[datatable] cache set on hashCode: ', hashCode)
            // Don't overwrite cached data
            if (!table._cache[hashCode]) {
              table._cache[hashCode] = res
            }
          }
        } else {
          debug('the response is from today. skipping cache.')
        }
      }
    } */

    res.params = res.params || {}

    const page = res.page
    if (page) {
      table._dataPage = page
      debug('dataPage....', page, table.currentPage)
    }

    /**
     * @DUPLICATE CODE - this should be consolidated with code block above
     * If the data was loaded from cache, then every record
     * that we have locally stored will be returned. We need
     * to apply the filters so that just those records that should
     * be displayed are displayed.
     */
    if (loadFromCache) {
      console.warn('[datatable] ** filtering cached data.....', res)
      console.warn('[datatable] ** table cache.....', table._cache)
      if (table._search) {
        hashCode = table._search.hashCode()
      } else {
        hashCode = getFilterHash(table)
      }
      console.warn('[datatable] ** hashCode.....', hashCode)
      debug('applying filter to cached data...', table._totalCount, hashCode, table._filterHash[hashCode])

      let cacheData
      if (table._cache) {
        cacheData = table._cache[hashCode]
      }

      if (cacheData) {
        Object.assign(table, {
          _data: cacheData.data,
          items: cacheData.data,
          _totalCount: cacheData._totalCount
        })
      } else {
        table._data = res.data || []
        table.items = res.data || []

        // Since this is the old table type, we need to get the count from the
        // _filterHash
        table._totalCount = table._filterHash[hashCode]
      }

      // Reset the item visiblitiy
      table.items.forEach((item) => { item._hidden = false })

      table._totalCount = table._filterHash[hashCode]
      // debug('_totalCount set: ', table._totalCount)
      // setTableData(res.data)
    } else if (table._searchResults) {
      table.items = table._searchResults
    } else if (res.params.query) {
      /**
       * If this table was filtered with a search query, then we want to display all of the results
       * that were returned from the servre, so we do that here.
       */
      table.items = res.data
      table._data = res.data
    } else {
      debug('setting _data (loadData res)')

      // By just using the full data result, we get some jank becuase cached
      // results will be rendered BEFORE filtering is applied since the data
      // from the server is cached locally
      // table.items = res.data		// review use of this
      // table._data = res.data
      const data = table._data || []

      debug('concatenating data...')

      /**
       * If the sorted column just changed, then we don't want
       * to concat the results because we won't be showing the information
       * that the user just requested.
       */
      const currentSort = res.params.sort

      debug('table._previousSort: ', table._previousSort)
      debug('currentSort: ', currentSort)

      if (!isEqual(table._previousSort, currentSort)) {
        debug('sort changed!!!')

        table._previousSort = currentSort
        table._data = res.data
      } else {
        if (table._cacheByParams) {
          /**
           * This is used on the OrderHistoryList table only where we don't
           * want to generate a large list of orders in memory
           */
          table._data = res.data

          // if (isEmpty((table._search || '').trim())) {
          // 	hashCode = getFilterHash(table)
          // 	debug('[datatable] cache set on hashCode: ', hashCode)
          // 	table._cache[hashCode] = res
          // }
        } else {
          table._data = data.concat(res.data)
        }
      }

      // Remove duplicates
      if (table.uniqueField) {
        table._data = uniqBy(table._data, table.uniqueField)
      }

      table.items = table._data

      // reset visibility
      table.resetItemVisibility(table.items)

      setTimeout(function () {
        debug('emitting FixedTableHead:recalculate event...2')
        window.dispatchEvent(new CustomEvent('FixedTableHead:recalculate'))
      }, 120)

      debug('table: ', table)
    }

    debug('# of items returned: ', res.data.length)
    // debug('# of filtered items: ', table._data.length)

    table._params = cloneDeep(res.params)

    // Apply filtering / sorting after we receive the data
    if (loadFromCache) {
      table.applySortFilter()
    } else {
      table.items = res.data
    }

    table._visibleRowCount = table.items.length

    // TESTING
    // table.items = table._data

    broadcastDataLoadedEvent()

    m.redraw()
  }, function (err) {
    console.error('failed to load data...', err)
    m.redraw()
  })
}

function applySortFilter () {
  const table = this
  debug('[datatable] applySortFilter....', this)
  debug('applySortFilter....', this)

  /**
   * The first thing we will do is assign a flag designating this record
   * as visible. If it is not in the search results, we will mark it as hidden.
   * The idea here is to keep the DOM elements that are genereated and just show/hide
   * on search for faster responsiveness because perf testing shows
   * recalculate style and layout as the most costly with a larger list.
   */
  // @FILTER
  let forceFilter = false
  const filter = table._filter || {}
  for (const key in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, key)) {
      const f = filter[key]
      if (typeof (f) !== 'object') {
        continue
      }

      if (f.name && f.name.toLowerCase() !== 'all') {
        forceFilter = true
        break
      }
    }
  }

  if (!table._paginated) {
    if (table._searchResults) {
      table.items = table.customFilterFn(table.items, table._search, true)
    } else {
      table.items = table.customFilterFn(table._data, table._search, true)
    }
  } else if (!isEmpty((table._search || '').trim()) || forceFilter) {
    // If there is a search query, we'll just run it through the filter function
    table.items = table.customFilterFn(table.items, table._search, true)

    // // Since there are search results, we need to set the page to 1
    // self.currentPage = 1
  }

  // Now we can apply sorting that we know that columns are visible
  table.items = sortByColumn(table.items, table.sortedColumn)

  table.updateRowVisibility()
}

function onSearchUpdated (query) {
  debug('onSearch fired....*' + query + '*')
  const table = this
  table._search = query

  /**
   * If the search was just cleared, then we will reset the list
   */
  const trimmedQuery = (query || '').trim()
  if (isEmpty(trimmedQuery)) {
    table.api.setLoading(true)

    /**
     * If we had previously loaded search results, the data
     * in the table is restricted and we lost the other data
     * that we loaded. The solution is to load the data fresh
     * from the server.
     */
    if (table._searchResults) {
      // We just clear the search field and now need to refresh the table.
      table._search = trimmedQuery

      table._fetchData(true, false)
      return
    } else {
      table._visibleRowCount = table._data.length
      table.resetItemVisibility(table._data)

      table.items = table._data
    }
  } else if (table.searchFields) {
    debug('prev search: ', table._previousSearch)

    if (table._search.indexOf(table._previousSearch) > -1) {
      debug('searching inside results... ')
      // We can continue filtering down the results because the previous
      // search includes the current query
      // table.items = filterTable(table.items, query)
      table.items = table.customFilterFn(table.items, query)
    } else {
      // Apply the custom filter function on the existing data
      table.items = table.customFilterFn(table._data, query)
      // table.items = filterTable(table.items, query)
      // table.items = filterTable(table._data, query)
    }

    // Since there are search results, we need to set the page to 1
    table.updateRowVisibility(table.items)
    table.currentPage = 1
  }

  table._previousSearch = query

  m.redraw()
}

function scrollToTop () {
  debug('scrollToTop fired......')
  const table = this

  if (table._scrollContainer) {
    table._scrollContainer.scrollTop = 0
  }
}

function customFilterFn (items = [], query, force) {
  const table = this

  // /**
  //  * Form the metrc packages table, we don't want to filter locally at all, so we
  //  * have this override
  //  */
  // if (table.suppressCustomFilter) {
  //   return items
  // }

  let out = []
  const trimmedQuery = (query || table._search || '').trim()
  const filters = table._filter

  debug('customFilterFn fired....') //, table, items)

  // if (table && typeof (table.customFilterFn) === 'function') {
  //   items = table.customFilterFn(items, table._filter)
  // }

  /**
   *
   * @param {obj} obj
   * @returns TRUE if we should keep the item and FALSE if not
   */
  const applyFilters = function (obj) {
    // console.error('[filter] analyzing item..', obj)
    if (filters && typeof (filters) === 'object') {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const filter = filters[key]

          // @HACK - never get typeerror
          if (!filter) {
            console.error('filter data structure error...', key)
            continue
          }

          if (filter.name.toLowerCase() === 'all') {
            // debug('this filter is for all items....', key)
            continue
          }

          // if the field is null or undefined, we will compare to false
          // because we may not send a false field from the server
          let fieldVal
          let val

          /**
           * adding a compareFn to the option will override all other
           * comparisons
           */
          if (isFunction(filter.compareFn) && filter.compareFn(obj)) {
            continue
          } else if (typeof (filter.apiKey) !== 'undefined') {
            const apiKeyVal = obj[filter.apiKey]
            fieldVal = apiKeyVal !== undefined ? apiKeyVal : (obj[filter.field] || false)
            // obj[filter.apiKey] || false

            debug('[filter] fieldVal: ', fieldVal, filter)

            /**
             * @ANOMALY
             * See the Messages and Customer tables for this usage. For an 'active'
             * field, we need to compare the value to TRUE or FALSE, and NOT 1 or 0
             * which is what the apiValue is set as
             */
            if (typeof (filter.filterCompareValue) !== 'undefined') {
              val = filter.filterCompareValue
            } else {
              val = !!filter.apiValue
            }
          } else {
            fieldVal = obj[filter.field] || false
            val = filter.value
          }

          // @KEEP - this is used in the employee list with the role_id and any place
          // where the apiValue is an array, like TaskList
          if (val && val.constructor === Array) {
            console.error('array filter....')
            fieldVal = obj[filter.field]
            if (val.indexOf(fieldVal) === -1) {
              // No match
              return false
            }

            // Match, go to the next filter
            continue
            // return val.indexOf(fieldVal) > -1
          }

          if (fieldVal === val) {
            // We will not reject the item on account of a match
            continue
          }

          // The item oes not meet the filter, reject it
          // debug('[filter] rejecting item: ', filter, obj)
          return false
        }
      }
    }

    return true
  }

  if (table && (table.fromCache || force)) {
    console.error('[filter] filtering ' + items.length + ' items.')

    /**
     * @HOOK to filter non-paginated table items.
     * This is used for the inventory locations where we only want
     * to show locations at the current establishment
     */
    if (isFunction(table._prefilterFn)) {
      items = table._prefilterFn(items)
    }

    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i]
      const keep = applyFilters(item)
      if (keep) {
        out.push(item)
      }
    }
  }

  debug('[filter] output length: ' + out.length)

  // If there's no search query, there's no reason to run through fuzzysort
  if (trimmedQuery === '') {
    out = sortByColumn(out, table.sortedColumn)

    // Set all items to visible
    table.resetItemVisibility(out)

    return out
  }
  // console.error('filteredList: ', angular.copy(inventoryTable))

  /**
   * In a paginated datatable like this one, we do the filtering on the server and thus have no need
   * for client-side filtering. More than anything, it just complicates things.
   */
  // if (table._search && table._params && table._search !== table._params.query) {
  const start = new Date().getTime()

  const resultMap = {}
  const uniqueField = table.uniqueField

  // This is the default search
  if (table._searchResults) {
    // Make sure we show all search results that came from the server
    forEach(items, (o) => { resultMap[o[uniqueField]] = true })

    table._searchResults = sortByColumn(table._searchResults, table.sortedColumn)
  } else if (!table._fuzzySearch) {
    const props = {}
    table.searchFields.forEach((f) => { props[f] = table._search })
    const filtered = filterTable(items, props)
    // debug('prefiltered results: ', items)
    forEach(filtered, (o) => { resultMap[o[uniqueField]] = true })
    items = filtered
  } else {
    const results = fuzzysort.go(trimmedQuery, items, {
      keys: table.searchFields,

      // performance enhancements
      allowTypo: true,		// if you don't care about allowing typos
      limit: 500, 				// don't return more results than you need!
      threshold: -10000 	// don't return bad results
      // Create a custom combined score to sort by. -100 to the desc score makes it a worse match
      // scoreFn: function (a) { Math.max(a[0]?a[0].score:-1000, a[1]?a[1].score-100:-1000) }
    })
    forEach(results, (o) => {
      // debug('**', o)

      /**
       * Highlight the search term
       */
      // if (o[0]) {
      // 	o.obj['highlight_'+table.searchFields[0]] = fuzzysort.highlight(o[0], '<span class="search--highlight">', '</span>')
      // }

      /**
       * This highlights ALL search fields, but at a performance cost
       * NOTE: Due to the number of items and the necessity to modify the style
       * in the DOM, there is additional paint and layout calculation by using this.
       */
      // forEach(table.searchFields, (f, i) => {
      // 	if (o[i]) {
      // 		o.obj['highlight_'+f] = fuzzysort.highlight(o[i], '<span class="search--highlight">', '</span>')
      // 	}
      // })

      resultMap[o.obj[uniqueField]] = true
    })
    // debug('fuzzysort results: ', results)
  }

  // Hide items that are not in the search results
  let visibleRowIndex = 0
  out = items.map(function (o) {
    if (!resultMap[o[uniqueField]]) {
      o._hidden = true
    } else {
      o._hidden = false
      o._index = visibleRowIndex
      visibleRowIndex++
    }

    return o
  })
  table._visibleRowCount = visibleRowIndex + 1

  // if (tabl.) {
  // 	table.items = sortByColumn(table.items, table.sortedColumn, columnDef)
  // }

  // debug('filtered items: ', items)
  console.warn('this needs to be optomized to sort only on changes')
  debug('* time to sort: ', new Date().getTime() - start, 'ms')

  return out
}

/**
 * In determining the visibility of a row, we need to check
 * the _hidden flag as well as the table page and rowsPerPage
 * to determine the starting offset. This is mainily because we don't
 * ever want to shrink the value of items so we don't have to incur DOM
 * creation/destruction
 */
function updateRowVisibility (items) {
  const table = this

  items = items || table.items

  let startingIndex = table.rowsPerPage * (table.currentPage - 1)
  let endingIndex = startingIndex + table.rowsPerPage

  // Show all relevant items when the table is not paginated
  if (table.hidePagination) {
    startingIndex = 0
    endingIndex = items.length
  }
  debug('[datatable] updating row visibility: ', startingIndex, endingIndex)
  debug('[datatable] # of items: ', items.length)

  // Update the item indexes to keep nice odd/even row highlighting
  let visibleRows = 0
  let visibleRowIndex = 0
  // debug('self.items: ', self.items)
  items.forEach((o, i) => {
    if (!o._hidden) {
      // o._index = visibleRowIndex	// @odd/even class remove
      visibleRowIndex++
      if (i > 50) {
        // debug('checkpoint..')
      }

      // This row is beyond the pagination limit of what to show
      if (visibleRowIndex >= startingIndex && visibleRowIndex <= endingIndex) {
        // o._index = visibleRows	// @odd/even class remove
        o._hidden = false
        visibleRows++
      } else {
        o._hidden = true
      }
    }
  })
  table._visibleRowCount = visibleRows
  debug('table._visibleRowCount: ', table._visibleRowCount)

  m.redraw()
  setTimeout(m.redraw, 180)
}

/**
 * This function initializes the MdTable config with the additional
 * api functions, etc. to make it more powerful
 */
const decorate = (table) => {
  debug('decorating table....', table)

  table.config = table.config || {}

  const registerEventHandler = function (evtName, fn) {
    if (table.events[evtName]) {
      const identifier = randomString(5)
      table.events[evtName][identifier] = fn

      return identifier
    } else {
      console.warn('[mat-datatable] tried to regisetr unknown event handler...', evtName)
    }
  }

  const handleEvent = function (evtName, data) {
    console.warn('[mat-datatable] event....', evtName, data)

    const registeredHandlers = table.events[evtName]
    if (!registeredHandlers) {
      console.warn('[mat-datatable] unknown event...', evtName)
      return
    }

    // Allow to overrride the row click handler
    if (evtName === 'rowClick') {
      if (isFunction(table.onRowClick)) {
        table.onRowClick(data, table)
      } else {
        data._selected = !data._selected
      }

      table.api.selectedRowCount()
    } else if (evtName === 'sortUpdated') {
      if (isFunction(table.onSortUpdated)) {
        table.onSortUpdated()
      }
    }
    // else if (evtName === 'headerCheckboxClick') {
    // 	table.api.selectedRowCount()
    // }

    // fire the handlers
    forEach(registeredHandlers, (fn) => fn(data, table))
  }

  forEach(table.thead, (columnDef) => {
    columnDef.class = columnDef.class || ''

    if (columnDef.date) {
      columnDef.sortFn = sortDates
    }

    if (columnDef.matFormatter === 'statusLabel') {
      columnDef.class += ' mat-status-label'
    }

    if (columnDef.class.indexOf('md-sort') > -1 || columnDef.enableSort) {
      columnDef.sortable = true
      columnDef.headerClass = ' mat-sort-header-container'
    }
    if (columnDef.field === 'ACTIONS') {
      columnDef._sticky = 'right: 0;'
    }

    // @NOTE: we default to just toggling _select on the item if no
    // function is defined
    // if (columnDef.checkbox) {
    // 	// Make sure there is an onRowClick function defined
    // 	if (!hyve.isFunction(table.onRowClick)) {
    // 		console.warn('[datatabl] missing onRowClick handler function')
    // 	}
    // }
  })

  // Default the uniqueField to 'id' if not set
  table.uniqueField = table.uniqueField || 'id'

  if (!table._filter) {
    table._filter = {}
    table._filterOptions = {}

    forEach(table._filters, (val, key) => {
      // Default to the first option if no default is set
      table._filter[key] = find(val, { default: true }) || val[0]
      table._filterOptions[key] = val.map(function (o) { return o.name })
    })

    if (!table._filters) {
      console.warn('[datatable] table is missing filters')
    }
  }

  if (!table.api) {
    Object.assign(table, {
      _pagesLoaded: [],
      // Components can hook in an register event handlers on the following events
      handleEvent,
      registerEventHandler,
      events: {
        rowClick: {},
        selectUpdated: {},
        searchUpdated: {},
        headerCheckboxClick: {},
        sortUpdated: {},
        dataLoaded: {},
        pageSizeChange: {}
      },

      applySortFilter,
      onSearchUpdated,
      // customFilterFn: customFilterFn,
      onFiltersChanged,
      onPagination,
      scrollToTop,
      // endpointOnCreated: endpointOnCreated,
      // endpointOnUpdated: endpointOnUpdated,
      // endpointOnDeleted: endpointOnDeleted,
      updateRowVisibility,
      resetItemVisibility,
      api: {
        // applySort
        // allItemsSelected
        // hasSelectedItems
        // selectedRowCount
        // getSelected
        // setSelected
        // setFilter
        // updateSearch
        // execSearch
      }
    })

    if (table.loadData) {
      table.onSortUpdated = onSortUpdated
    }

    // Allow for overriding the customerFilterFn
    if (!table.customFilterFn) {
      table.customFilterFn = customFilterFn
    }

    // This will cause the api function to execute in the scope of the table
    // so we will be able to access table AS "this"
    const registerApiFunction = function (key, fn) {
      // es6 code that doesn't work with the ng compiler
      // table.api[key] = function (...args) { return fn.apply(table, args) }

      table.api[key] = function () {
        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key]
        }

        return fn.apply(table, args)
      }
    }

    registerApiFunction('applySort', applySort)
    registerApiFunction('limitRows', limitRows)
    registerApiFunction('allItemsSelected', allItemsSelected)
    registerApiFunction('hasSelectedItems', hasSelectedItems)
    registerApiFunction('selectedRowCount', selectedRowCount)
    registerApiFunction('getSelected', getSelected)
    registerApiFunction('setSelected', setSelected)
    registerApiFunction('setFilter', setFilter)
    registerApiFunction('updateSearch', updateSearch)
    registerApiFunction('execSearch', debounce(function () {
      console.warn('ignoring filters....')
      const table = this

      if (!table._paginated) {
        return
      }

      // Set the page to 1 so we load the proper results
      table.currentPage = 1
      table._fetchData(true, false)
    }, 500))
    registerApiFunction('resetCache', resetCache)
    registerApiFunction('initData', initData)
    registerApiFunction('appendData', appendData)
    registerApiFunction('setSearchResults', setSearchResults)
    registerApiFunction('setLoading', setTableLoading)
  }

  if (!table.items) {
    table.api.setLoading(true)
  }

  return table
}

export default decorate
