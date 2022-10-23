import { powerform } from 'powerform'
import { required, isString, minLength, equalsTo } from 'validatex'

// A validator is a simple function.
// It takes a value and returns error if the vlaue is invalid.
export function isValidUsername (val) {
  return !/^[a-zA-Z0-9]+$/.test(val) && 'Username should be alphanumeric.'
}

export function isValidEmail (str) {
  return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str) && 'Please enter a valid email'
}

export function isDate (val) {
  return (
    !/^\d{2}\/\d{2}\/\d{4}$/.test(val) && 'Date must be in dd/dd/dddd format'
  )
}

export function requiredIf (condition) {
  console.log('running requiredIf function....', condition)
  return false
}

// A validator can be an object which has modify() method.
// It should be used to alter the user input value.
// Here we are gonna format the date into dd/mm/yyyy
export const dobValidator = {
  validator: [required(true), isString(), isDate],
  modify (curVal, preVal) {
    if (!curVal) return curVal
    if (curVal && preVal && curVal.length < preVal.length) return curVal
    const frags = curVal.split('/')
    // \d\d => \d\d/
    if (frags.length === 1 && curVal.length === 2) {
      return `${curVal}/`
    }
    // \d/ => 0\d/
    if (frags.length === 2 && curVal.length === 2) {
      return `0${curVal}`
    }
    // \d\d/\d\d => \d\d/\d\d/
    if (frags.length === 2 && curVal.length === 5) {
      return `${curVal}/`
    }
    // \d\d/\d/ => \d\d/0\d/
    if (frags.length === 3 && curVal.length === 5) {
      const mthIndex = frags.length - 2
      frags.splice(mthIndex, 1, `0${frags[mthIndex]}`)
      return frags.join('/')
    }
    if (curVal.length >= 10) return curVal.substring(0, 10)
    return curVal
  }
}

/**
 * Formi
 * A wrapper around powerform to simplify common
 * form tasks like updating a field value
 *
 * @param {object} config
 * @returns powerform
 */
const Formi = (config) => {
  const form = powerform(config)

  form.onInput = function (e) {
    form[this.name].setData(e.target.value)
    form.validate()
  }

  return form
}

export { Formi }
