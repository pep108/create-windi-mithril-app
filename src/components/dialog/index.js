import './styles.css'

import m from 'mithril'

const Dialog = (function () {
  const body = document.body
  let dialog = {}

  /**
   * Apply class .dialog--open to the .dialog to open the dialog
   * params {
   *  confirm: bool // pass true for a confirm dialog
   *  title: h2 header
   *  subtitle: subheader
   *  message: body of the dialog
   *  cancelText: text for the cancel button
   *  okText: text for the OK button
   * }
   */
  return {
    oninit: function () {
      const self = this

      self.promise = null
    },
    alert: function (title, msg) {
      const self = this

      return self.open({
        class: 'dialog--error',
        title,
        message: msg
      })
    },
    open: function (params) {
      const self = this

      if (!params) { return }

      body.classList.add('dialog-open')

      dialog = params

      return new Promise(function (resolve, reject) {
        Object.assign(self, {
          isOpen: true,
          dismiss: function (res) {
            self.isOpen = false

            res ? resolve(res) : reject()

            setTimeout(function () {
              body.classList.remove('dialog-open')
            }, 300)
          }
        })

        m.redraw()
      })

      // return self.promise
    },
    close: function () {
      const self = this
      if (self.isOpen) {
        self.dismiss(1)
      }
    },
    view: function () {
      const self = this
      dialog = dialog || {}
      dialog.data = dialog.data || {}

      return [
        m('div', { class: 'dialog ' + (dialog.class || '') + (self.isOpen ? ' dialog--open' : '') },
          m('div', { class: 'dialog__overlay' }),
          m('div', { class: 'dialog__content' },
            dialog.Component
              ? m(dialog.Component, Object.assign(dialog.data, { dismiss: self.dismiss }))
              : [
                  m('h2', m.trust(dialog.title)),
                  dialog.subtitle ? m('div', { class: 'subhead' }, dialog.subtitle) : null,
                  m('div', { class: 'message' }, m.trust(dialog.message)),
                  m('dialog-actions', { class: 'flex flex-row' },
                    dialog.confirm
                      ? [
                          m('button', { class: 'dialog--action cancel', onclick: function () { self.dismiss() } }, dialog.cancelText || 'Cancel')
                        ]
                      : null,
                    m('span', { class: 'flex' }),
                    m('button', { class: 'dialog--action ok', onclick: function () { self.dismiss(1) } }, dialog.okText || 'OK')
                  )
                ]
          )
        )
      ]
    }
  }
})()

export default Dialog
