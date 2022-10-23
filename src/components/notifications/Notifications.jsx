import './styles.css'
import './animations.css'
import m from 'mithril'

const successIcon = `
  <span role="img" aria-label="check-circle" class="anticon anticon-check-circle">
      <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="check-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
      >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
      </svg>
  </span>`

/**
 * @usage
 * 
 * Add m(Notifications), to the DOM in the root mounted component.
 * 
 * @open notification
 * 
 * Notifications.success(`An email has been sent to ${passwordResetEmail} with instructions to reset your password`)
 */
const Notifications = (() => {
  const _this = {}
  const messages = []
  let messageStack = []

  /**
   * @note
   * Much of this configuration has not been hooked up in the logic yet.
   */
  const defaults = {
    animation: 'move-up', // 'move-up', 'move-down', 'move-left', 'move-right'
    className: 'success',
    additionalClasses: null,
    dismissOnTimeout: true,
    timeout: 2400,
    dismissButton: false,
    dismissButtonHtml: '&times;',
    dismissOnClick: true,
    onDismiss: null,
    compileContent: false,
    combineDuplications: false,
    horizontalPosition: 'right', // right, center, left
    verticalPosition: 'top', // top, bottom,
    maxNumber: 2,
    newestOnTop: false // true
  }

  function Message (msg) {
    let id = Math.floor(Math.random() * 1000)
    while (messages.indexOf(id) > -1) {
      id = Math.floor(Math.random() * 1000)
    }

    this.id = id
    this.count = 0
    this.animation = defaults.animation
    this.className = defaults.className
    this.additionalClasses = defaults.additionalClasses
    this.dismissOnTimeout = defaults.dismissOnTimeout
    this.timeout = defaults.timeout
    this.dismissButton = defaults.dismissButton
    this.dismissButtonHtml = defaults.dismissButtonHtml
    this.dismissOnClick = defaults.dismissOnClick
    this.onDismiss = defaults.onDismiss
    this.compileContent = defaults.compileContent

    Object.assign(this, msg)
  }

  _this.configure = function (config) {
    Object.assign(defaults, config)
  }

  const ToastMessage = () => {
    let contentDiv = null

    return {
      oncreate: ({ attrs, dom }) => {
        const { message } = attrs
        contentDiv = dom.querySelector('.ant-message-notice-content')

        // enter animation
        setTimeout(() => {
          contentDiv.classList.add(`ant-${message.animation}-enter-active`)
          setTimeout(() => {
            contentDiv.classList.remove(`ant-${message.animation}-enter`, `ant-${message.animation}-enter-active`)
          }, 300)
        }, 50)

        setTimeout(() => dismiss(attrs.key), message.timeout)
      },
      onbeforeremove: ({ attrs: { message } }) => {
        // exit animation
        contentDiv.classList.add(`ant-${message.animation}-leave`)
        setTimeout(() => {
          contentDiv.classList.add(`ant-${message.animation}-leave-active`)
        }, 50)

        return new Promise(resolve => setTimeout(resolve, 350))
      },
      view: ({ attrs: { id, message } }) => (
        <div className='ant-message-notice' onclick={() => dismiss(id)}>
          <div className={`ant-message-notice-content ant-${message.animation}-enter`}>
            <div className={['ant-message-custom-content', message.additionalClasses].join(' ')}>
              {message.className === 'success' && m.trust(successIcon)}
              <span>{m.trust(message.content)}</span>
            </div>
          </div>
        </div>
      )
    }
  }

  const create = msg => {
    msg = (typeof msg === 'object') ? msg : { content: msg }

    if (defaults.combineDuplications) {
      for (let i = messageStack.length - 1; i >= 0; i--) {
        const _msg = messages[i]
        const _className = msg.className || 'success'

        if (_msg.content === msg.content && _msg.className === _className) {
          messages[i].count++
          return
        }
      }
    }

    if (defaults.maxNumber > 0 && messageStack.length >= defaults.maxNumber) {
      dismiss(messageStack[0])
    }

    const newMsg = new Message(msg)
    messages[defaults.newestOnTop ? 'unshift' : 'push'](newMsg)
    messageStack.push(newMsg.id)

    m.redraw()

    return newMsg.id
  }

  const _createWithClassName = (className, msg, delay) => {
    msg = (typeof msg === 'object') ? msg : { content: msg }

    msg.additionalClasses = className
    msg.timeout = delay

    return create(msg)
  }

  return {
    settings: defaults,
    messages,
    dismiss,
    info: function (msg, delay) {
      return _createWithClassName.call(this, 'ant-message-info', msg, delay || 4000)
    },
    success: function (msg, delay) {
      return _createWithClassName.call(this, 'ant-message-success', msg, delay || 4000)
    },
    warn: function (msg, delay) {
      return _createWithClassName.call(this, 'ant-message-warning', msg, delay || 4000)
    },
    error: function (msg, delay) {
      return _createWithClassName.call(this, 'ant-message-error', msg, delay || 8000)
    },
    view: () => (
      <div className='ant-message'>
        <div>
          {messages.map(message =>
            <ToastMessage key={message.id} message={message} />)}
        </div>
      </div>
    )
  }

  function dismiss (id) {
    if (id) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].id === id) {
          messages.splice(i, 1)
          messageStack.splice(messageStack.indexOf(id), 1)
          m.redraw()
          return
        }
      }
    } else {
      while (messages.length > 0) {
        messages.pop()
        m.redraw()
      }
      messageStack = []
    }
  }
})()

export default Notifications
