import m from 'mithril'
import { VERSION } from '../config'
import keysToUnderscore from 'Utils/keysToUnderscore'
import keysToCamel from 'Utils/keysToCamel'

const debug = function () { }
// const debug = console.log.bind(window.console, '[api]: ')

const defaultHeaders = {
  Application: 'leadcheck',
  Version: VERSION
}

const apiBase = 'v1/'

// An extraction function to standardize the response from m.request
function extract (xhr) {
  if (!xhr.status) {
    return {
      status: 0,
      statusText: 'Server unreachable',
      message: 'Server could not be reached.'
    }
  }

  if (xhr.status === 200) {
    if (xhr.responseType === 'blob') {
      const contentDisposition = xhr.getResponseHeader('Content-Disposition')
      const contentType = xhr.getResponseHeader('Content-Type')

      let filename = extractFilenameFromContentDisposition(contentDisposition)
      debug('filename: ', filename)
      if (!filename) {
        // fallback
        filename = 'download.' + contentType.split('/')[1]
      }

      // Create a link element, hide it, direct
      // it towards the blob, and then 'click' it programatically
      const a = document.createElement('a')
      a.style = 'display: none'
      document.body.appendChild(a)

      // Create a DOMString representing the blob
      // and point the link element towards it
      // const url = window.URL.createObjectURL(blob)
      const url = window.URL.createObjectURL(xhr.response)
      a.href = url
      a.download = filename

      // programatically click the link to trigger the download
      a.click()

      // release the reference to the file by revoking the Object URL
      window.URL.revokeObjectURL(url)

      return {
        status: xhr.status,
        statusText: xhr.statusText
      }
    }
  }

  let data = {}
  try {
    data = xhr.response ? JSON.parse(xhr.response) : {}
  } catch (e) {
    console.error('failed to parse response data: ', e)
  }

  return Object.assign({
    status: xhr.status,
    statusText: xhr.statusText
  }, data)
}

function extractFilenameFromContentDisposition (str) {
  const s = str.match(/filename=\".+\"/)
  if (s.length) {
    return s[0].split('=')[1].replace(/\"/g, '')
  }
}

const getServerPath = () => `${import.meta.env.VITE_API_URL}/`

const getBaseUrl = () => getServerPath() + apiBase

function request (options) {
  options.headers = options.headers || {}
  const params = {
    method: options.method,
    data: options.data,
    headers: Object.assign(defaultHeaders, options.headers),
    config: options.config,
    // send cookies with the request
    withCredentials: true,
    // example config function to get the progress and return it for a file upload
    // config: function (xhr) {
    //  xhr.upload.addEventListener('progress', function (e) {
    //    console.warn('progress event: ', e)
    //    var progress = e.loaded / e.total
    //    console.log('progress: ', progress)
    //    q.notify(progress)
    //    m.redraw() // tell Mithril that data changed and a re-render is needed
    //  })
    // }
    extract
  }

  // Add any post data
  if (options.data) {
    params.headers['Content-Type'] = 'application/json'
    params.body = keysToUnderscore(options.data)
  }

  if (options.options) {
    Object.assign(params, options.options)
  }

  params.url = getBaseUrl() + options.url

  // Append any search params to the url
  if (options.params) {
    params.url += '?' + toQueryString(options.params)
  }

  return new Promise((resolve, reject) => {
    m.request(params).then(res => {
      debug('request res: ', res)

      if (res.status === 200) {
        // resolve(res)
        resolve(keysToCamel(res))
        return
      }

      reject(res)
    })
  })
}

function get (options) {
  return request(Object.assign({ method: 'GET' }, options))
}

function post (options) {
  const params = Object.assign({ method: 'POST' }, options)

  debug('request params: ', params)

  return request(params)
}

function remove (options) {
  const params = Object.assign({ method: 'DELETE' }, options)
  debug('request params: ', params)

  return request(params)
}

function toQueryString (obj) {
  const parts = []
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]))
    }
  }
  return parts.join('&')
}

export {
  getServerPath,
  getBaseUrl,
  request,
  extract,
  get,
  post,
  remove
}
