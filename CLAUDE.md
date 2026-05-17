# Project Development Directives

This document captures the engineering standards for the Reminder Chrome extension.
It is project-scoped, language-neutral, and intended for any contributor (human or
automated assistant) working in this repository.

## Language & Documentation

- English only — code, comments, commit messages, and documentation.
- Every public function carries a JSDoc block with `@description`, `@param`, and `@returns` (and `@throws` where relevant).
- Variable names describe intent (`upcomingReminders`, not `arr`).

## Architecture & Code Quality

- SOLID principles: single responsibility per class/function, dependency injection in constructors.
- Favoured patterns: Factory (`AlertWindowFactory`), Observer (`AlarmService`), MVC-style separation in the popup controller.
- Functions stay short — target ≤ 30 lines. Split when they grow.
- Errors are surfaced explicitly via `try`/`catch` and meaningful messages — no silent failures.

## Modern JavaScript

- ES6+ syntax: arrow functions, template literals, destructuring.
- `const` by default, `let` when reassignment is needed, never `var`.
- Asynchronous code uses `async`/`await`; callbacks only when wrapping Chrome APIs that still expose them.

## Git & Version Control

- Author: `Jakub Syrek <jakubvonsyrek@gmail.com>` only. No co-authors, no automated-assistant attribution anywhere in commits, code, or documentation.
- Atomic commits: one logical change per commit.
- Conventional Commits prefixes: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`, `perf:`. Breaking changes use a `BREAKING CHANGE:` footer.
- Push to the default branch after the local test suite passes.
- Quick author audit: `git log --format="%an <%ae>" | sort -u` must list only `Jakub Syrek <jakubvonsyrek@gmail.com>`.

## Testing & Quality

- The test runner is Vitest with the `jsdom` environment.
- Tests live under `tests/` and exercise pure helpers in `src/lib/` plus DOM-touching code via jsdom.
- Chrome extension APIs (`chrome.alarms`, `chrome.storage`, `chrome.notifications`) are mocked with `vi.fn()` per test.
- `npm test` must pass before any commit lands.

## Logging Standards

- `console.log` for normal-flow milestones with context.
- `console.warn` for recoverable anomalies.
- `console.error` for failures, always including the offending error object.
- Avoid log spam in hot paths.

## Security & Browser Constraints

- Manifest V3 only. Request the minimum set of permissions.
- No inline scripts and no `eval` — CSP-compliant code only.
- Validate user input (reminder text, timestamps) before touching storage or alarms.

## Project Organisation

- `src/` holds the runtime JavaScript classes; `src/lib/` holds pure, dependency-free helpers.
- UI markup stays in the root (`popup.html`, `alert.html`) and shares `styles.css`.
- Tests mirror the source folder layout under `tests/`.

## Naming Conventions

- Classes: `PascalCase` (`ReminderManager`).
- Functions and variables: `camelCase` (`scheduleReminder`).
- Constants: `UPPER_SNAKE_CASE` (`MIN_ALARM_DELAY_MINUTES`).
- Private helpers in classes prefixed with `_` (`_setupListener`).

## Quality Checklist (per commit)

- [ ] Author identity is `Jakub Syrek <jakubvonsyrek@gmail.com>`.
- [ ] No automated-assistant attribution anywhere.
- [ ] All new code is English-only.
- [ ] Public functions have JSDoc.
- [ ] Logging is present for non-trivial flows.
- [ ] SOLID and patterns respected.
- [ ] `npm test` passes locally.
- [ ] README / CHANGELOG / docs updated where behaviour changed.
- [ ] Commit message follows Conventional Commits.
