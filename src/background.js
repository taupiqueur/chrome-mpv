// This module contains the background service worker to run commands via messages,
// using keyboard shortcuts or menu commands.
//
// Service workers: https://developer.chrome.com/docs/extensions/develop/concepts/service-workers
// Messaging: https://developer.chrome.com/docs/extensions/develop/concepts/messaging

import mpv from './mpv.js'
import optionsWorker from './options/service_worker.js'

const { TAB_GROUP_ID_NONE } = chrome.tabGroups

// Retrieve the default config.
const gettingDefaults = fetch('config.json')
  .then((response) => response.json())

/**
 * Adds items to the browser’s context menu.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/contextMenus
 *
 * @returns {void}
 */
function createMenuItems() {
  chrome.contextMenus.create({
    id: 'open_mpv',
    title: 'Open with mpv',
    contexts: ['page', 'link', 'video', 'audio', 'image', 'selection']
  })

  chrome.contextMenus.create({
    id: 'open_documentation',
    title: 'Documentation',
    contexts: ['action']
  })

  chrome.contextMenus.create({
    id: 'open_support_chat',
    title: 'Support Chat',
    contexts: ['action']
  })

  chrome.contextMenus.create({
    id: 'open_sponsorship_page',
    title: 'Sponsor this project',
    contexts: ['action']
  })
}

/**
 * Handles the initial setup when the extension is first installed or updated to a new version.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled
 *
 * @param {object} details
 * @returns {void}
 */
function onInstalled(details) {
  switch (details.reason) {
    case 'install':
      onInstall()
      break

    case 'update':
      onUpdate(details.previousVersion)
      break
  }
  createMenuItems()
}

/**
 * Handles the initial setup when the extension is first installed.
 *
 * @returns {Promise<void>}
 */
async function onInstall() {
  const defaults = await gettingDefaults
  await chrome.storage.sync.set(defaults)
}

/**
 * Handles the setup when the extension is updated to a new version.
 *
 * @param {string} previousVersion
 * @returns {Promise<void>}
 */
async function onUpdate(previousVersion) {
  const defaults = await gettingDefaults
  const localStorage = await chrome.storage.sync.get()
  await chrome.storage.sync.set({
    ...defaults,
    ...localStorage
  })
}

/**
 * Handles option changes.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/storage#event-onChanged
 *
 * @param {object} changes
 * @param {string} areaName
 * @returns {void}
 */
function onOptionsChange(changes, areaName) {
  switch (areaName) {
    case 'local':
    case 'sync':
      Object.assign(mpv, changes.mpv.newValue)
      break
  }
}

/**
 * Handles the browser action on click.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/action#event-onClicked
 *
 * @param {chrome.tabs.Tab} tab
 * @returns {void}
 */
function onAction(tab) {
  mpv.open([tab.url])
}

/**
 * Handles the context menu on click.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/contextMenus#event-onClicked
 *
 * @param {chrome.contextMenus.OnClickData} info
 * @param {chrome.tabs.Tab} tab
 * @returns {void}
 */
function onMenuItemClicked(info, tab) {
  switch (info.menuItemId) {
    case 'open_mpv':
      mpv.open([info.linkUrl ?? info.srcUrl ?? info.selectionText ?? info.pageUrl ?? tab.url])
      break

    case 'open_documentation':
      openNewTabRight(tab, 'src/manual/manual.html')
      break

    case 'open_support_chat':
      openNewTabRight(tab, 'https://web.libera.chat/gamja/#taupiqueur')
      break

    case 'open_sponsorship_page':
      openNewTabRight(tab, 'https://github.com/sponsors/taupiqueur')
      break
  }
}

/**
 * Opens and activates a new tab to the right.
 *
 * @param {chrome.tabs.Tab} openerTab
 * @param {string} url
 * @returns {Promise<void>}
 */
async function openNewTabRight(openerTab, url) {
  const createdTab = await chrome.tabs.create({
    active: true,
    url,
    index: openerTab.index + 1,
    openerTabId: openerTab.id,
    windowId: openerTab.windowId
  })

  if (openerTab.groupId !== TAB_GROUP_ID_NONE) {
    await chrome.tabs.group({
      groupId: openerTab.groupId,
      tabIds: [
        createdTab.id
      ]
    })
  }
}

/**
 * Handles long-lived connections.
 * Uses the channel name to distinguish different types of connections.
 *
 * https://developer.chrome.com/docs/extensions/develop/concepts/messaging#connect
 *
 * @param {chrome.runtime.Port} port
 * @returns {void}
 */
function onConnect(port) {
  switch (port.name) {
    case 'options':
      optionsWorker.onConnect(port)
      break

    default:
      port.postMessage({
        type: 'error',
        message: `Unknown type of connection: ${port.name}`
      })
  }
}

// Configure mpv.
chrome.storage.sync.get((options) => Object.assign(mpv, options.mpv))

// Set up listeners.
// https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events
chrome.runtime.onInstalled.addListener(onInstalled)
chrome.storage.onChanged.addListener(onOptionsChange)
chrome.action.onClicked.addListener(onAction)
chrome.contextMenus.onClicked.addListener(onMenuItemClicked)
chrome.runtime.onConnect.addListener(onConnect)
