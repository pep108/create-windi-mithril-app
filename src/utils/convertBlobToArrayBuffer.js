/**
 * Convert a Blob type to an ArrayBuffer using the FileReader API
 *
 * @param {Blob} blob
 * @returns Promise
 */
const convertBlobToArrayBuffer = (blob) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()

    // This fires after the blob has been read/loaded.
    reader.addEventListener('loadend', function (e) {
      const str = e.srcElement.result
      resolve(str)
    })

    // Listen for errors and reject the promise
    reader.addEventListener('error', function (err) {
      reject(err)
    })

    // Start reading the blob as text.
    reader.readAsArrayBuffer(blob)
  })
}

export default convertBlobToArrayBuffer
