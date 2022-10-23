import { readCookie } from 'Utils/cookie'
import { DateTime } from 'luxon'

// make luxon accessible from the console
window.DateTime = DateTime

// const getUserAccountQuery = (userId) => `{
//   account(userId: "${userId}") {
//     id
//     userId
//     accountId
//     firstName
//     lastName
//     email
// }`

const Account = (() => {
  const _this = {
    // claims:
  }

  const getUserId = () => { return _this.claims.sub.split(':')[1] }

  const cookie = readCookie('SESSION')
  if (cookie) {
    _this.claims = JSON.parse(window.atob(cookie.split('.')[1]) || { roles: [] })
  } else {
    // window.location.replace(import.meta.env.VITE_LOGIN_URL)
    console.warn('session cookie missing... should redirect user to login page')
  }

  const removeCookie = (cookieName) => {
    document.cookie = `${cookieName}=;expires=-1;domain=${import.meta.env.VITE_COOKIE_DOMAIN};path=/`
  }

  return {
    claims: () => _this.claims,
    userId: () => getUserId(),
    getUser: () => { return _this.user },
    logout: () => {
      removeCookie('SESSION')
      removeCookie('SIGNATURE')
      window.location.replace(import.meta.env.VITE_LOGIN_URL)
    }
  }
})()

export default Account
