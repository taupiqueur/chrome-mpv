// This module provides the functionality to open videos
// with a media player program—such as mpv.

import '../@types/chrome_shell.js'

/**
 * Opens specified URLs with the given media player program.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {string[]} urls
 * @returns {Promise<void>}
 */
export async function mpv(command, args, urls) {
  await chrome.runtime.sendNativeMessage('shell', {
    command,
    args: args.concat(urls)
  })
}

export default {
  command: 'mpv',
  args: ['--'],
  open(urls) {
    return mpv(this.command, this.args, urls)
  }
}
