import m from 'mithril'
import { powerform, Form } from 'powerform'

/**
 * Formi
 * A wrapper around powerform to simplify common
 * form tasks like updating a field value
 *
 * @param {object} schema
 * @param {object} config
 * @returns powerform
 */
export const prepareForm = (schema, config = {}) => {
  const form = powerform(schema, { data: config })

  form.onInput = function (e) {
    form[this.name].setData(e.target.value)
    form.validate()
  }

  return form
}

export const Formi = ({ attrs: { form, onSubmit } }) => {
  form.onClickSubmit = () => {
    if (!form.isValid()) {
      return
    }

    onSubmit(form.getData())
  }

  return {
    oncreate: ({ attrs: { form }, dom }) => {
      // Find each of the form fields by name and add
      // a blur listener
      form.fieldNames.forEach(field => {
        const el = dom.querySelector(`[name="${field}"]`)
        if (el) {
          el.onblur = (e) => {
            form[field].touched = true
          }
        } else {
          console.warn(`element not found: [name="${field}"]`)
        }
      })
    },
    view: ({ attrs: { className }, children }) => {
      return <div className={className}>{children}</div>
    }
  }
}
