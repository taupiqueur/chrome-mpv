# Manual

## Usage

`Ctrl+M` is the main keyboard shortcut.

Use it to open videos in webpages with mpv.

### Configure keyboard shortcuts

Navigate to `chrome://extensions/shortcuts` to configure keyboard shortcuts.

### Configure the media player program

You can also configure the media player program by importing and exporting settings
in the “Options” page—Right-click the mpv toolbar button and select “Options”.

Example configuration:

``` json
{
  "mpv": {
    "command": "mpv",
    "args": ["--"]
  }
}
```

``` json
{
  "mpv": {
    "command": "sh",
    "args": [
      "-c",
      "jq -nc '$ARGS.positional[] | { command: [\"loadfile\", .] }' --args -- \"$@\" | socat - UNIX-CONNECT:/tmp/mpv.sock || mpv --input-ipc-server=/tmp/mpv.sock --ytdl-raw-options=cookies-from-browser=chrome --player-operation-mode=pseudo-gui --force-window=immediate --ontop --on-all-workspaces --geometry=30%+50%+50% -- \"$@\"",
      "--"
    ]
  }
}
```

``` json
{
  "mpv": {
    "command": "sh",
    "args": [
      "-c",
      "jq -nc '$ARGS.positional[] | { command: [\"loadfile\", .] }' --args -- \"$@\" | socat - UNIX-CONNECT:/tmp/mpv.sock || mpv --input-ipc-server=/tmp/mpv.sock --ytdl-raw-options=cookies-from-browser=chrome --player-operation-mode=pseudo-gui --macos-app-activation-policy=accessory --ontop-level=desktop --ontop --on-all-workspaces --fs --no-native-fs --no-focus-on-open -- \"$@\"",
      "--"
    ]
  }
}
```

Make sure the commands are in your `PATH`.

On macOS, you can set the `PATH` environment variable for all services through [launchctl].

``` sh
sudo launchctl config user path "$PATH"
```

[launchctl]: https://ss64.com/osx/launchctl.html
