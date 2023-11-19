// Opens specified URLs with the given media player program.
// Returns the command result.
export async function mpv(command, args, urls) {
  return chrome.runtime.sendNativeMessage('shell', {
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
