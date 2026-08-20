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
- **Keyboard shortcut**: `Ctrl+Shift+K` (Windows / Linux) / `Cmd+Shift+K` (macOS) toggles the lock while focus is inside the composer card.
- **At-file friendly**: while the `@` file/session candidate menu (at file) is open, Enter still confirms the highlighted file or session — the lock only intercepts Enter that would actually send and never interferes with candidate selection.

## Lock state styles

| State | Lock icon style | Meaning |
| --- | --- | --- |
| Unlocked (normal) | Gray outlined icon | Enter can send messages normally |
| Locked | **Red fill with a white lock icon** | Enter cannot send messages |

Hovering over the lock icon shows a state-specific tooltip:

- Unlocked: `Unlocked: Enter can send messages normally`
- Locked: `Locked: Enter cannot send messages`

## What it prevents

While locked, the following keyboard sends are blocked:

- plain `Enter` send;
- `Ctrl+Enter` / `Cmd+Enter` send;
- other Enter combinations that reach the official composer submit path;
- accidental submission of unfinished composer text.

Normal behaviors remain available:

- `Shift+Enter` still inserts a newline;
- IME candidate confirmation still works;
- while the `@` file/session (at file) or `/` command candidate menu is open, Enter confirms the candidate and is never intercepted;
- editing, copy, paste, and attachments are unaffected;
- clicking the official send button still sends; the lock only guards the keyboard.

## Keyboard shortcut

- **Windows / Linux**: `Ctrl+Shift+K`
- **macOS**: `Cmd+Shift+K`

The shortcut only fires while focus is inside a composer card: the handler resolves the session id from the focused element's card, so it stays inert when focus is in the chat area or the sidebar. It is ignored during IME composition and ignores key auto-repeat.

Combo selection, verified on device:

- `Ctrl+Alt` combos such as `Ctrl+Alt+L` are unreliable on Windows: the OS maps `Ctrl+Alt` to AltGr, and active IMEs (Microsoft Pinyin, WeChat IME, ...) consume the keydown before the page sees it — even in their English mode;
- `Ctrl+Space` is the system IME toggle and is never usable;
- `Ctrl+L` is the address bar shortcut in Chrome and Edge, and `Ctrl+Shift+L` is Edge's paste-and-search — both reserved by the browser;
- `Ctrl+Shift+K` reaches the page and toggles the lock with those IMEs active, so it is the shipped combo.

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
   - Shortcut: `Ctrl+Shift+K` (Windows / Linux) or `Cmd+Shift+K` (macOS), with focus inside the composer card.

4. While locked:

   - Plain `Enter` does not send.
   - `Ctrl+Enter` / `Cmd+Enter` does not send.
   - `Shift+Enter` still inserts a newline.
   - IME composition Enter still confirms the candidate.
   - While the `@` file/session (at file) or `/` command candidate menu is open, Enter confirms the candidate as usual.
   - Clicking the official send button still sends; the lock only guards keyboard input.

5. Lock state is per session and is kept in memory only. It is cleared on refresh or restart.

## Configuration

The plugin is zero-configuration. It requires no API key, no settings fields, and no `settings.yaml` entry. Lock state lives in browser memory only.

## Limitations

- Lock state is browser-memory only; it does not write `settings.yaml` and makes no network requests.
- The plugin uses the official `conversation.input.right` slot and does not replace the composer.
- The lock only blocks Enter that would actually send: when a candidate menu is open with a highlighted item, Enter belongs to the menu and is left alone.

## Troubleshooting

### The lock button is not visible

1. Verify that the plugin is mounted:

   ```sh
   dsh --profile web --dump-config | grep dsh-enter-lock
   ```

2. Restart `dsh web` and force-refresh the page (`Ctrl+F5`).
3. Make sure you are using the `web` profile.

### The shortcut does not fire

1. Focus must be inside the composer card (click the composer first): the handler resolves the session id from the focused element and stays inert elsewhere.
2. Use `Ctrl+Shift+K` (`Cmd+Shift+K` on macOS): the old `Ctrl+Alt+L` combo is consumed by Windows IMEs before the page sees it and is no longer used.
3. The shortcut is intentionally ignored during IME composition; finish candidate confirmation first.
4. Make sure the installed version is `0.4.0` or newer (the shortcut was disabled in `0.3.x`).

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
