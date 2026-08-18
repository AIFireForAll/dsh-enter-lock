# dsh-enter-lock

[中文](README.md) | English

A **DeepSeek Harness plugin** that adds an **Enter-send lock** to the web chat composer.

- Click the lock button next to the composer to toggle the lock.
- While locked, you can keep editing the text in the composer, but pressing Enter will not send it.
- Click the button again to unlock and restore Enter-send.

## Why this plugin exists

The DeepSeek Harness Web composer sends the current composer text as soon as Enter is pressed. That makes accidental sends easy when:

- Enter is pressed only to confirm an IME candidate;
- the user is editing a long prompt, code, or structured text and hits Enter by mistake;
- the text in the composer is still incomplete and is submitted before the user intended.

This plugin adds a "lock before send" guard between editing and submission.

## What it focuses on

- **Lock button**: registered in the official `conversation.input.right` slot, next to the model selector and send button; the locked state uses a prominent red fill.
- **Per-session state**: each conversation has its own lock flag.
- **No composer replacement**: it only intercepts the keyboard submit path and keeps the official input state machine, command menu, queue, and attachment behavior.
- **IME-friendly**: Enter during composition is never intercepted.

## What it prevents

While locked, the following keyboard sends are blocked:

- plain `Enter` send;
- `Ctrl+Enter` / `Cmd+Enter` send;
- other Enter combinations that reach the official composer submit path;
- accidental submission of unfinished composer text.

Normal behaviors remain available:

- `Shift+Enter` still inserts a newline;
- IME candidate confirmation still works;
- editing, copy, paste, and attachments are unaffected;
- clicking the official send button still sends; the lock only guards the keyboard.

## Keyboard shortcut (future work)

Keyboard shortcut support is currently listed as **future work**. For now, use the lock button beside the composer to lock and unlock. A shortcut will be enabled in a later release after compatibility is verified in Chrome / Edge.

## Requirements

- DeepSeek Harness `0.1.0-rc.6` or newer;
- the `web` profile;
- a modern Chromium-based browser (Chrome or Edge).

## Installation

### Install from this GitHub repository

```sh
dsh plugin --profile web add github:AIFireForAll/dsh-enter-lock
```

Or use the explicit Git URL:

```sh
dsh plugin --profile web add https://github.com/AIFireForAll/dsh-enter-lock.git
```

For reproducible installs, pin a commit:

```sh
dsh plugin --profile web add 'github:AIFireForAll/dsh-enter-lock#<commit-sha>'
```

### Install from a local directory

```sh
git clone https://github.com/AIFireForAll/dsh-enter-lock.git
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

3. Toggle the lock:

   - Click the lock button in the composer tool row.

4. While locked:

   - Plain `Enter` does not send.
   - `Ctrl+Enter` / `Cmd+Enter` does not send.
   - `Shift+Enter` still inserts a newline.
   - IME composition Enter still confirms the candidate.
   - Clicking the official send button still sends; the lock only guards keyboard input.

5. Lock state is per session and is kept in memory only. It is cleared on refresh or restart.

## Configuration

The plugin is zero-configuration. It requires no API key, no settings fields, and no `settings.yaml` entry. Lock state lives in browser memory only.

## Limitations

- Lock state is browser-memory only; it does not write `settings.yaml` and makes no network requests.
- The plugin uses the official `conversation.input.right` slot and does not replace the composer.

## Troubleshooting

### The lock button is not visible

1. Verify that the plugin is mounted:

   ```sh
   dsh --profile web --dump-config | grep dsh-enter-lock
   ```

2. Restart `dsh web` and force-refresh the page (`Ctrl+F5`).
3. Make sure you are using the `web` profile.

### The shortcut is unavailable

Keyboard shortcut support has not been enabled yet and is listed as future work. Use the lock button beside the composer instead. Lock state is per session: a newly opened session starts unlocked.

### A message was sent while locked

- `Shift+Enter` inserts a newline; it is not a send.
- Clicking the official send button is a deliberate mouse action and is not blocked.
- Check that the lock button shows the red filled locked state and review which Enter combination was pressed.

## Uninstall

```sh
dsh plugin --profile web remove dsh-enter-lock
```

## Development and build

No build step is required to install this repository: `lib/` contains committed prebuilt artifacts and the package has no `prepare` / `postinstall` scripts.

After changing the source, regenerate the artifacts with:

```sh
npm run build   # generate lib/index.js and lib/client.js
npm run check   # structural checks
```

## Project layout

```text
dsh-enter-lock/
├── package.json          # dsh.bundle + dsh.client plugin manifest
├── cordis.patch.yml      # profile bundle patch
├── src/
│   ├── index.js          # Host half (dependency-free no-op)
│   └── client.js         # Web half: button and Enter interception
├── lib/                  # prebuilt artifacts
├── scripts/
│   ├── build.mjs
│   └── check.mjs
├── README.md
├── README.en.md
└── LICENSE
```

## License

[MIT](./LICENSE)
