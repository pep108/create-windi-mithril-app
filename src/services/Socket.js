import { convertBlobToArrayBuffer, randomString, removeEmptyKeys } from '../utils'
import pako from 'pako'

const debug = function () { }
// const debug = console.log.bind(window.console, '[ws]: ')

// Keep track of the specific browser session for targeted messaging.
const sessionId = randomString(5)
const channels = {}
let wsUrl
let socketClosed = 0
// var textDecoder = new TextDecoder('utf-8')
let status = 'CLOSED'

// This is an object of all the requestID's as the key with their callback functions
// so we can handle making many requests over the socket at a time
const requestCallbacks = {
  // key(requestID): function
}
// var transactionTimers = {
//   requestID: fn
// }

// Close the websocket connection cleanly
window.onbeforeunload = function () {
  if (channels[wsUrl] && status === 'OPEN') {
    channels[wsUrl].onclose = function () { } // disable onclose handler first
    channels[wsUrl].close()
  }
}

// function init (endpoint, channel) {
function initSocket () {
  debug('initSocket.....')

  if (window.WebSocket) {
    wsUrl = `wss://${import.meta.env.VITE_API_HOST}/ws`

    debug(`initializing the WebSocket at endpoint ${wsUrl}) + ' with sessionId: ${sessionId}`)
    debug('wsUrl: ', wsUrl)
    debug('ws sessionId: ', sessionId)

    openConnection()

    // NOTE this is how we send a message to the server over the websocket.
    // setTimeout(function () {
    //   debug('sending message to socket')
    //   var obj = {
    //     endpoint: 'location-update',
    //     data: 'lat, lng'
    //   }
    //   channels[0].send(JSON.stringify(obj))
    // }, 3000)
  } else {
    console.error('Browser does not support WebSockets.')
    // var item = document.createElement("div")
    // item.innerHTML = "<b>Your browser does not support WebSockets.</b>"
    // appendLog(item)
  }

  function openConnection () {
    debug('opening connection.....', wsUrl)

    status = 'OPENING'

    // When connecting to the socket, we send subprotocols in this order. We need the employee ID because
    // that is how we look up the signing string to validate the token.

    // const protocol = ['access_token', User.employeeId(), token, sessionId]
    const protocol = ['access_token', sessionId]

    // console.warn('opening socket with protocol: ', protocol)
    channels[wsUrl] = new WebSocket(wsUrl, protocol)

    // NOTE This is the basic socket but it will be removed for specific channels that
    // will be specific to the employee that logged in.
    channels[wsUrl].onclose = onClose
    channels[wsUrl].onmessage = onMessage
    channels[wsUrl].onopen = onOpen
  }

  /**
   * TODO This needs to have great documentation!!
   * When the server creates or updates a record, most of the time
   * (and in the future) all of the time, there will be a websocket broadcast
   * to all roles that the information matters to.
   *
   * @param {message} e
   */
  function onMessage (e) {
    const start = new Date().getTime()
    // debug('[ws] timestamp: ', start)
    debug('----------------------------------------------')
    debug('onMessage: ', e)
    debug('----------------------------------------------')
    // debug('data: ', e.data)
    // debug('ws channel: ', e.currentTarget.url)

    processDataFromServer(e.data)
      .then(function (data) {
        const now = new Date().getTime()
        // debug(`timestamp2: , ${now} | diff: ${now - start}ms`)
        debug(`processing time: ${now - start}ms`)
        propagateMessageData(data)
      }, function (err) {
        console.error('failed to read socket data ', err)
      })
  }

  function onOpen (e) {
    status = 'OPEN'
    socketClosed = 0

    debug('----------------------------------------------')
    debug('channel opened') //, e)
    debug('----------------------------------------------')

    // Web Socket is connected, send data using send()
    setTimeout(function () {
      channels[e.target.url].send('ping')
      channels[e.target.url].open = true

      window.dispatchEvent(new CustomEvent('socket:connected', { detail: null }))
    }, 300)
  }

  function onClose (e) {
    debug('----------------------------------------------')
    debug('WebSocket connection closed.', e)
    debug('channels[wsUrl]: ', channels)
    debug('this: ', this)
    debug('channels[wsUrl]: ', channels)
    debug('----------------------------------------------')

    status = 'CLOSED'

    // Remove the channel
    delete channels[wsUrl]

    // Mark the socket as closed, because if we fail to connect
    // after the socket has been closed, we'll redirect the user to the
    // login screen
    socketClosed++

    if (socketClosed < 2) {
      // Attempt to reopen the connection in 2 seconds
      setTimeout(function () {
        openConnection()
      }, 2000)
    } else {
      // Redirect the user back to the login screen
      // window.location.replace(window.location.origin)
    }
  }

  // var reconnect = function (e) { }
}

/**
 * This function handles parsing the data from the server into an object
 * and resolves with the object.
 * It can handle message from the websocket in string format or binary data
 * @param {Blob|string} data
 */
function processDataFromServer (data) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data)
          debug('resolving with parsed data...', parsed)
          resolve(parsed)
        } catch (e) {
          console.error('failed to parse string', e)
          reject(e)
        }
      }

      /**
       * If we are sending a file down by the socket, then we
       * will have a file key and a filename key on the reponse
       */
      if (data.file && data.filename) {
        resolve(data)
      }

      /**
       * The data coming from the server might be a Blob
       * if we use the melody.BroadcastBinaryFilter function
       * instaed of melody.BroadcastFilter. This is actually
       * preferred because it will need to send less data over
       * the network than sending JSON data as a string
       */
      if (data instanceof Blob) {
        convertBlobToArrayBuffer(data).then(function (buff) {
          let decompressed, parsed

          /**
           * The data from the server will be compressed
           * with the golang zLib libary, so we need to decompress
           * the data before we try to parse it
           */
          try {
            const startInflate = new Date().getTime()
            decompressed = pako.inflate(buff, { to: 'string' })
            debug('decompressed string length: ', decompressed.length)
            debug('time to inflate: ', (new Date().getTime() - startInflate), 'ms')

            parsed = JSON.parse(decompressed)
          } catch (err) {
            console.error('failed to inflate data: ', err)
            reject(err)
            throw new Error('Failed to inflate data.')
          }

          resolve(parsed)
        }, function (err) {
          console.error('error reading blob: ', err)
          reject(err)
          throw new Error('Failed to read Blob.')
        })
      }
    } catch (e) {
      console.error('failed to parse JSON ', e)
      reject(e)
    }
  })
}

/**
 * This function takes the data from the server after it has been processed
 * and handles action and endpoint data types
 * @param {obj} data
 */
function propagateMessageData (data) {
  /**
   * This is a resonse to a specific call and should be passed
   * along to the respective requestCallback
   */
  if (data.uid) {
    let responseSent = false
    const cb = requestCallbacks[data.uid]
    debug('*requestCallbacks: ', requestCallbacks)

    /**
     * @param {string} type ('success' | 'fail')
     * @param {obj} res response object
     */
    const sendToCaller = function (type, res) {
      // Make sure we don't send multiple responses
      if (responseSent) { return }

      res = res || data

      if (cb && typeof (cb[type]) === 'function') {
        responseSent = true
        cb[type](res)

        /**
         * Only clear the request when we receive "done" in the response
         * so it is safe for the server to pass multiple messages back to
         * the same view
         */
        if (data.done) {
          clearRequestCallback(data.uid)
        }
      } else {
        debug('could not find callback function')
      }
    }

    // debug('[socket] this is the resonse to our request....', data, JSON.stringify(Object.keys(data)))

    if (data.error) {
      debug('checkpoint #1')

      sendToCaller('fail')
      clearRequestCallback(data.uid)
      return
    }

    // make sure we pass the data along to the callback
    sendToCaller('success')
  }

  if (data.action) {
    debug('processing the action....', data.action)
    const action = data.action
    const payload = data.data
    console.log('[ws] data: ', data)

    switch (data.action) {
      case 'app:update':
        console.warn('appUpdate received... new paths', payload)
        break
      case 'logout':
        break
    }

    // Broadcast the action to any event listener where udates are needed
    debug('dispatching event: ', action, payload)
    window.dispatchEvent(new CustomEvent(action, { detail: payload }))
  }
}

/* @NOTE: We don't currently have a timeout on websocket
    requests to the server, but if we want to implement them,
    this follows the pattern developed on the Register Application
function clearTransactionTimer (requestId) {
  var timer = transactionTimers[requestId]
  if (timer) {
    clearTimeout(timer)
    delete transactionTimers[requestId]
  }
} */

function clearRequestCallback (requestId) {
  if (requestCallbacks[requestId]) {
    delete requestCallbacks[requestId]
  }
}

/**
  * @returns {Promise} promise that resolves with the websocket channel
  */
function getConnection () {
  console.log('getting websocket connection......')

  return new Promise(function (resolve, reject) {
    const channelIsOpen = function () {
      return wsUrl && channels[wsUrl] && channels[wsUrl].open
    }

    if (channelIsOpen()) {
      resolve(channels[wsUrl])
    } else {
      if (status === 'CLOSED') {
        initSocket()
      }

      const checkSocket = function () {
        if (channelIsOpen()) {
          resolve(channels[wsUrl])
          window.clearInterval(checkFn)
        }
      }

      const checkFn = window.setInterval(checkSocket, 200)
    }
  })
}

/**
 * Handles an api request over the websocket and routing websocket messages
 * to the proper location
 *
 * This is particularly useful if we are building a product that has traceability reporting
 * requirements and we need to wait for the METRC or other integrator API to work before
 * we can provide a meaningful response, which may take longer than the http connection timeout
 * @param {string} endpoint
 * @param {obj} data
 * @param {fn} cb - callback function
 */
function apiRequestV2 (endpoint, data, success, fail) {
  const requestID = randomString(5)

  getConnection().then(function (conn) {
    /**
     * Register the callbacks (success / failure) for this requestID
     * This way they can be called from the single connection.onmessage
     * function and we don't need to be swapping that function ever.
     */
    requestCallbacks[requestID] = {
      success,
      fail
    }

    const wsObj = {
      uid: requestID,
      type: 'api_request',
      resource: endpoint,
      payload: removeEmptyKeys(data)
    }

    debug('data sent over websocket: ', wsObj)
    conn.send(JSON.stringify(wsObj))
  }, function (err) {
    console.error('[apiV2] failed to get connection: ', err)
    fail(err)
  })
}

export {
  initSocket,
  getConnection,
  apiRequestV2
}
