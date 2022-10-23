const pluralize = (text, value) => {
  if (!text) return ''

  const lastChar = text.slice(-1)
  const lastChars = text.slice(-2)

  if (lastChars === 'ss') {
    if (value > 1 || value < 1) {
      return text + 'es'
    }
    return text
  }

  // return the same text if the last character is already an 's'
  if (lastChar === 's') {
    // Keep the plural
    if (value > 1 || value < 1) {
      return text
    }

    return text.substr(0, text.length - 1)
  }

  return (value > 1 || value < 1) ? text + 's' : text
}

export default pluralize
