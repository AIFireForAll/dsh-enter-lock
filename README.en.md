# dsh-enter-lock

A DeepSeek Harness Web plugin that adds an **Enter-send lock** to the chat composer.

- Click the lock button next to the composer, or press **`Ctrl+Alt+L`** (macOS: **`⌘+Option+L`**), to toggle the lock.
- While locked, you can keep editing the draft, but pressing Enter will not send it. This prevents accidental sends when confirming IME candidates or editing long prompts.
- Click the button or press the shortcut again to unlock and restore Enter-send.

## Installation

### Install from this GitHub repository

```sh
dsh plugin --profile web add github:zy200212/dsh-enter-lock
```

Or use the explicit Git URL:

```sh
dsh plugin --profile web add https://github.com/zy200212/dsh-enter-lock.git
```

For reproducible installs, pin a commit:

```sh
dsh plugin --profile web add 'github:zy200212/dsh-enter-lock#<commit-sha>'
```

### Install from a local directory

```sh
git clone https://github.com/zy200212/dsh-enter-lock.git
dsh plugin --profile web add ./dsh-enter-lock
```

### Verify

```sh
dsh --profile web --dump-config | grep dsh-enter-lock
```

Then restart `dsh web` and refresh the page.

## Usage

1. Start DeepSeek Harness Web:

   ```sh
   dsh web
   ```

2. Find the lock button in the composer tool row, near the model selector and the send button.

3. Toggle the lock either way:

   - **Mouse**: click the lock button.
   - **Keyboard**: focus the composer area and press `Ctrl+Alt+L` (`⌘+Option+L` on macOS).

4. While locked:

   - Plain `Enter` does not send.
   - `Ctrl+Enter` / `Cmd+Enter` does not send.
   - `Shift+Enter` still inserts a newline.
   - IME composition Enter still confirms the candidate.
   - Clicking the official send button still sends; the lock only guards keyboard input.

5. Lock state is per session and is kept in memory only. It is cleared on refresh or restart.

## Why Ctrl+Alt+L?

| Shortcut | Chrome | Edge | Decision |
| --- | --- | --- | --- |
| `Ctrl+L` | Focus address bar | Focus address bar | Reserved by both browsers |
| `Ctrl+Shift+L` | Unused by default | Paste and search / Paste and go | Reserved by Edge |
| **`Ctrl+Alt+L`** | Unused in official list | Unused in official list | **Used by this plugin** |

References:

- [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179)
- [Keyboard shortcuts in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/keyboard-shortcuts-in-microsoft-edge-50d3edab-30d9-c7e4-21ce-37fe2713cfad)

## Uninstall

```sh
dsh plugin --profile web remove dsh-enter-lock
```

## Development

```sh
npm run build   # generate lib/index.js and lib/client.js
npm run check   # structural checks
```

## License

[MIT](./LICENSE)
