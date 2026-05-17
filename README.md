# Reminder

A Chrome Manifest V3 extension that schedules reminders and surfaces them as elegant desktop alert windows.

![CI](https://github.com/Jakub-Syrek/Reminder/actions/workflows/tests.yml/badge.svg)
![Release](https://img.shields.io/github/v/release/Jakub-Syrek/Reminder)
![Chrome MV3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/github/license/Jakub-Syrek/Reminder)
![Last commit](https://img.shields.io/github/last-commit/Jakub-Syrek/Reminder)

## Overview

Reminder is a lightweight browser extension that lets you queue up text reminders tied to a specific date and time. When the moment arrives the extension opens a focused, animated popup window with your reminder text, and auto-dismisses after thirty seconds. It uses `chrome.storage.sync` so reminders follow you across signed-in browsers, and `chrome.alarms` for reliable triggering even when the popup is closed.

The codebase is intentionally small and modular: a service worker (`src/background.js`) wires together a `ReminderManager` (storage), an `AlarmService` (Chrome alarms / observer pattern) and an `AlertWindowFactory` (popup creation). Pure helpers live in `src/lib/` and are unit-tested in isolation.

## Features

- Create reminders with a text body and a `datetime-local` target time.
- Cross-device sync via Chrome's `storage.sync` API.
- Native Chrome alarms drive the trigger, so reminders fire even after the popup closes.
- Custom popup alert window (no native OS notification noise) with auto-close.
- Automatic cleanup of fired reminders.
- List view with one-click deletion of pending reminders.

## Installation

### Load unpacked (development)

1. Clone or download this repository.
2. Open `chrome://extensions/` (or `brave://extensions/`).
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the project root.
5. The Reminder icon appears in your toolbar.

### Bundled CRX

A pre-packaged `Reminder.crx` lives at the repository root. In Chromium-based browsers you can drag-and-drop it onto `chrome://extensions/` to install, though Chrome itself has been progressively restricting external CRX installs — loading unpacked is the recommended path.

## Permissions

The extension requests only what it needs:

| Permission       | Why it is needed                                                        |
| ---------------- | ----------------------------------------------------------------------- |
| `storage`        | Persist reminders across sessions and devices (`chrome.storage.sync`).  |
| `alarms`         | Schedule background triggers via `chrome.alarms.create`.                |
| `notifications`  | Reserved for future native-notification fallback paths.                 |

No host permissions are requested — the extension never reads or modifies web pages.

## Development setup

Requirements: Node.js 20+ and npm.

```bash
npm install
npm test            # one-shot test run
npm run test:watch  # re-run on file changes
```

The extension itself has no build step — Chrome loads the source files directly.

### Project layout

```
.
├── manifest.json            # MV3 manifest
├── popup.html / popup.js    # toolbar popup UI (src/popup.js)
├── alert.html / alert.js    # custom alert window
├── styles.css               # popup styles
├── src/
│   ├── background.js        # service worker entry point
│   ├── ReminderManager.js   # storage CRUD
│   ├── AlarmService.js      # chrome.alarms wrapper (observer)
│   ├── AlertWindowFactory.js# popup window factory
│   └── lib/
│       └── reminderUtils.js # pure helpers (unit-tested)
├── tests/                   # Vitest suite
└── .github/workflows/       # CI + release automation
```

## Testing

Tests use [Vitest](https://vitest.dev/) with the `jsdom` environment so DOM-dependent helpers can be exercised without a browser. Chrome extension APIs (`chrome.alarms`, `chrome.storage`, `chrome.notifications`) are mocked with `vi.fn()` at the call site.

```bash
npm test
```

Coverage reports live under `coverage/` after running `npm run test:coverage`.

## Versioning

This project follows [Semantic Versioning](https://semver.org/). The version field is kept in sync between `manifest.json` and `package.json`, and is bumped automatically on every push to `master` by `.github/workflows/version.yml`:

- `BREAKING CHANGE:` footers → **major** bump.
- `feat:` commits → **minor** bump.
- `fix:` / `docs:` / `test:` / `refactor:` / `perf:` / `chore:` / `ci:` commits → **patch** bump.

The workflow commits `chore(release): vX.Y.Z`, tags `vX.Y.Z`, and creates a GitHub Release with auto-generated notes.

### Conventional commits

All commits use the Conventional Commits style: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`, `perf:`.

## License

Released under the [MIT License](LICENSE).
