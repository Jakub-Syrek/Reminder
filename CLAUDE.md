# Claude Code Guidelines for Reminder Extension

## Code Style

- **Language**: English only (comments, documentation, variable names)
- **Version**: ES6+ JavaScript with async/await
- **Comments**: JSDoc for every public function
- **Lines**: Keep functions under 30 lines (Single Responsibility)

## Naming Conventions

- **Classes**: PascalCase (ReminderManager, AlertWindowFactory)
- **Functions**: camelCase (handleReminderTriggered, createAlarm)
- **Constants**: UPPER_SNAKE_CASE (DEFAULT_WIDTH, DEFAULT_HEIGHT)
- **Private**: Prefix with underscore (_setupAlarmListener)

## Architecture

- **Pattern**: Use established design patterns (Factory, Observer, MVC)
- **SOLID**: Follow all 5 SOLID principles
- **Dependency Injection**: Pass dependencies to constructors
- **Error Handling**: Use try/catch with meaningful error messages
- **Async**: Always use async/await, avoid callbacks

## Documentation

- JSDoc for all public methods with @param and @returns
- README.md kept up to date
- Comments for complex logic
- Commit messages descriptive and detailed

## Security & Manifest V3

- No inline scripts (use external files)
- CSP compliant
- No dangerous eval/innerHTML
- Proper permission scoping
- Use chrome.runtime.getURL() for assets

## Testing & Commits

- Test code before committing
- Atomic commits (one feature per commit)
- Descriptive commit messages
- No Claude attribution (author: Jakub Syrek)
- Git user: Jakub Syrek <jaqb.syrek@student.uj.edu.pl>

## Project Structure

```
src/
├── background.js          (Service Worker with all classes)
├── popup.js              (PopupController)
├── ReminderManager.js    (Business logic - for popup)
├── AlarmService.js       (Alarm management - for popup)
└── AlertWindowFactory.js (Factory pattern)

Root:
├── manifest.json
├── popup.html
├── alert.html
├── alert.js
├── styles.css
├── README.md
└── CLAUDE.md
```

## Git Config

```bash
git config user.name "Jakub Syrek"
git config user.email "jaqb.syrek@student.uj.edu.pl"
```

## What NOT to Do

- ❌ Don't write Polish comments or documentation
- ❌ Don't use old ES5 syntax
- ❌ Don't skip error handling
- ❌ Don't create monolithic functions
- ❌ Don't violate SOLID principles
- ❌ Don't commit without testing
- ❌ Don't use setTimeout instead of proper promises
- ❌ Don't mix concerns in one class
