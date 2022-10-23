/* Simple function to set cookie */
/**
 * @param name is the name of the cookie
 * @param value is the cookie value
 * @param expDays is the number of days you want the cookie to expire after
 */
function setCookie (name, value, expDays) {
  const exdate = new Date()
  exdate.setDate(exdate.getDate() + expDays)

  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + (!expDays ? '' : '; expires=' + exdate.toUTCString() + ';domain=' + window.location.host + ';path=/')
}
window.setCookie = setCookie

/* Simplest function to read cookie */
let cookies

function readCookie (name, c, C, i) {
  if (cookies) { return cookies[name] }

  c = document.cookie.split('; ')
  cookies = {}

  for (i = c.length - 1; i >= 0; i--) {
    C = c[i].split('=')
    cookies[C[0]] = C[1]
  }

  return cookies[name]
}
window.readCookie = readCookie // or expose it however you want

export {
  setCookie,
  readCookie
}
