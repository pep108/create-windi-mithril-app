import './styles.scss'

function showTooltip (e, text, el, delay) {
  let tt = null
  let ttContent = null
  delay = delay || 50

  // -------------------------------------------------------------------------
  // Event Listeners
  // -------------------------------------------------------------------------

  const onmouseout = (/* e */) => { remove(tt) }

  const onclick = (/* e */) => {
    el.removeEventListener('click', onclick)
    remove(tt)
  }

  const createTooltip = () => {
    const bounds = el.getBoundingClientRect()
    console.log('bounds: ', bounds)

    const eTop = bounds.top - 38 + window.pageYOffset // get the offset top of the element
    const eLeft = bounds.left + ((bounds.right - bounds.left) / 2)

    // -----------------------------------------------
    // Create the tooltip element
    // -----------------------------------------------
    tt = document.createElement('md-tooltip')
    tt.role = 'tooltip'
    tt.style = `left: ${eLeft}px; top: ${eTop}px;`
    tt.innerHTML = '<div class="_md-content" style="transform-origin: center bottom 0px;"><span>' + text + '</span></div>'

    document.body.appendChild(tt)

    // Update the style so the tooltip is centered (as long as it is fully on the page)
    const newLeft = eLeft - (tt.clientWidth / 2)
    if (newLeft > 0) {
      tt.style.left = `${newLeft}px`
    }

    // Register exit events
    el.addEventListener('mouseout', onmouseout)
    el.addEventListener('click', onclick)

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    setTimeout(function () {
      ttContent = tt.querySelector('._md-content')
      ttContent.classList.add('_md-show-add', '_md-show-add-active')

      setTimeout(function () {
        tt.classList.remove('_md-show-add', '_md-show-add-active')
      }, 50)
    }, delay)
  }

  createTooltip()
}

function remove (tt) {
  if (tt) {
    const ttContent = tt.querySelector('._md-content')
    ttContent.classList.remove('_md-show-add', '_md-show-add-active')
    ttContent.classList.add('_md-show-remove', '_md-show-remove-active')

    setTimeout(function () {
      // only remove the element that is on it's way out, not the one that is
      // trying to be created
      tt.remove()
    }, 50)
  }
}

export {
  showTooltip
}
