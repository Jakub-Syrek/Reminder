# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-05-17

### Added

- Initial documented release of the Manifest V3 reminder extension.
- Toolbar popup (`popup.html` + `src/popup.js`) to add, list, and delete reminders.
- Default-value seeding in the popup form: text defaults to `Alert!`, time defaults to "now + 2 minutes".
- Reminder persistence through `chrome.storage.sync` (`src/ReminderManager.js`).
- Chrome alarms scheduling via an observer-pattern wrapper (`src/AlarmService.js`).
- Custom alert popup window (`alert.html` + `alert.js`) created by a factory (`src/AlertWindowFactory.js`).
- Automatic deletion of reminders after they fire.
- Pure helpers extracted to `src/lib/reminderUtils.js`, covered by a Vitest test suite.
- MIT `LICENSE`, `SECURITY.md`, `ABOUT.md`, and a refreshed `README.md`.
- GitHub Actions workflows for tests on every push/PR and for automated semantic-version releases on push to `master`.
- Issue and pull request templates.
