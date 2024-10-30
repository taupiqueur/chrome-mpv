// This module contains the code to interpret the “manual.html” buttons and links.

const MIDDLE_MOUSE_BUTTON = 1

const buttonElements = document.querySelectorAll('button')
const chromeLinkElements = document.querySelectorAll('a[href^="chrome:"]')

const port = chrome.runtime.connect({
  name: 'manual'
})

for (const buttonElement of buttonElements) {
  const actionName = buttonElement.dataset.action

  switch (actionName) {
    case 'copyToClipboard':
      buttonElement.addEventListener('click', () => {
        navigator.clipboard
          .writeText(buttonElement.value)
          .then(() => {
            buttonElement.textContent = buttonElement.dataset.copyFeedback
            setTimeout(() => {
              buttonElement.textContent = buttonElement.ariaLabel
            }, 1000)
          })
      })
      break

    default:
      console.error(
        'Unknown action: "%s"',
        actionName
      )
  }
}

for (const chromeLinkElement of chromeLinkElements) {
  chromeLinkElement.addEventListener('click', (pointerEvent) => {
    if (
      pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      !pointerEvent.shiftKey &&
      !pointerEvent.metaKey ||

      !pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      !pointerEvent.shiftKey &&
      pointerEvent.metaKey
    ) {
      openNewBackgroundTab(chromeLinkElement.href)
      pointerEvent.preventDefault()
      pointerEvent.stopImmediatePropagation()
    } else if (
      !pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      !pointerEvent.shiftKey &&
      !pointerEvent.metaKey ||

      pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      pointerEvent.shiftKey &&
      !pointerEvent.metaKey ||

      !pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      pointerEvent.shiftKey &&
      pointerEvent.metaKey
    ) {
      openNewForegroundTab(chromeLinkElement.href)
      pointerEvent.preventDefault()
      pointerEvent.stopImmediatePropagation()
    } else if (
      !pointerEvent.ctrlKey &&
      !pointerEvent.altKey &&
      pointerEvent.shiftKey &&
      !pointerEvent.metaKey
    ) {
      openNewWindow(chromeLinkElement.href)
      pointerEvent.preventDefault()
      pointerEvent.stopImmediatePropagation()
    }
  })

  chromeLinkElement.addEventListener('auxclick', (pointerEvent) => {
    switch (pointerEvent.button) {
      case MIDDLE_MOUSE_BUTTON:
        openNewBackgroundTab(chromeLinkElement.href)
        pointerEvent.preventDefault()
        pointerEvent.stopImmediatePropagation()
        break
    }
  })
}

/**
 * Opens a new tab in background.
 *
 * @param {string} url
 * @returns {void}
 */
function openNewBackgroundTab(url) {
  port.postMessage({
    type: 'openNewBackgroundTab',
    url
  })
}

/**
 * Opens and activates a new tab.
 *
 * @param {string} url
 * @returns {void}
 */
function openNewForegroundTab(url) {
  port.postMessage({
    type: 'openNewForegroundTab',
    url
  })
}

/**
 * Opens a new window.
 *
 * @param {string} url
 * @returns {void}
 */
function openNewWindow(url) {
  port.postMessage({
    type: 'openNewWindow',
    url
  })
}
