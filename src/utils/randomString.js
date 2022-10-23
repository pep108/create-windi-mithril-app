const randomString = (length, chars) => {
  length = length || 8

  let result = ''
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export default randomString
