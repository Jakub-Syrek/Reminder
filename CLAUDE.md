# Claude Code Development Directives

## Global Rules (All Projects)

### Language & Documentation
- ✅ **ENGLISH ONLY** - All code, comments, commits, documentation
- ✅ JSDoc comments for every public function (@param, @returns, @throws)
- ✅ Meaningful variable names (searchUsers not findU)
- ✅ Commit messages in English, detailed (not just "fix bug")

### Architecture & Code Quality
- ✅ **SOLID Principles** - Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- ✅ **Design Patterns** - Use Factory, Observer, MVC, Dependency Injection where appropriate
- ✅ **Single Responsibility** - One job per class/function (max 30 lines)
- ✅ **Dependency Injection** - Pass dependencies to constructors, not hardcode
- ✅ **Error Handling** - Try/catch, meaningful error messages, never silent failures

### Modern JavaScript
- ✅ **ES6+** - Use arrow functions, template literals, const/let (no var)
- ✅ **Async/Await** - Never use callbacks when async/await possible
- ✅ **Promises** - Use Promise patterns correctly
- ✅ **No Shortcuts** - Avoid hacky solutions, write clean code

### Git & Version Control
- ✅ **Author**: Jakub Syrek <jaqb.syrek@student.uj.edu.pl> ONLY
- ✅ **NEVER EVER** add Claude/AI to authors - PROHIBITED
- ✅ **Atomic Commits** - One feature = one commit
- ✅ **Descriptive Messages** - "Fix: Remove service worker loading bug" not "fix"
- ✅ **No Claude Attribution** - ZERO mentions in:
  - Commit messages
  - Code comments
  - Documentation
  - File headers
  - Anywhere in repo
- ✅ **Push Immediately** - After testing, push to GitHub
- ✅ **Check Before Push**: `git log --format="%an" | sort | uniq` must show ONLY Jakub Syrek

### Testing & Quality
- ✅ **Test Before Commit** - No console errors, functionality verified
- ✅ **Logging Everywhere** - Use console.log/error for debugging (info, warn, error levels)
- ✅ **Check Permissions** - Verify all features work
- ✅ **Edge Cases** - Handle null, empty, invalid inputs

### Logging Standards
- ✅ **Info**: `console.log('Action completed:', data)` - Normal flow
- ✅ **Warn**: `console.warn('Deprecated method used')` - Warnings
- ✅ **Error**: `console.error('Failed to load:', error)` - Failures
- ✅ **Context**: Always include context (what, why, where)
- ✅ **Avoid Spam**: Don't log every microsecond
- ✅ **Production Ready**: Leave logs in code (they help debugging)

### Security & Best Practices
- ✅ **CSP Compliance** - No inline scripts, use external files
- ✅ **Manifest V3** - Only permissions needed
- ✅ **No Dangerous APIs** - eval, innerHTML, etc. forbidden
- ✅ **Data Handling** - Validate user input, sanitize output
- ✅ **Error Messages** - User-friendly, don't expose technical details

### Project Organization
- ✅ **File Structure** - Organized, logical (src/ for classes, root for config)
- ✅ **Separation of Concerns** - UI separate from business logic
- ✅ **Naming Conventions**:
  - Classes: `PascalCase` (ReminderManager)
  - Functions: `camelCase` (handleReminder)
  - Constants: `UPPER_SNAKE_CASE` (DEFAULT_WIDTH)
  - Private: prefix `_` (_setupListener)

### Documentation (CRITICAL!)
- ✅ **Function Descriptions** - EVERY function must have JSDoc:
  ```javascript
  /**
   * Brief description of what function does
   * @param {type} name - Parameter description
   * @returns {type} What it returns
   * @throws {Error} What errors it throws
   */
  function doSomething(name) { }
  ```
- ✅ **README.md** - Update EVERY time architecture changes
- ✅ **Code Comments** - Complex logic gets inline comments
- ✅ **Class Documentation** - Purpose, usage examples, patterns used
- ✅ **API Documentation** - All public methods documented
- ✅ **Changelog** - Document major changes
- ✅ **Architecture Diagrams** - Update when structure changes

## Chrome Extension Specific

- ✅ **Manifest V3** - Modern, secure manifest version
- ✅ **Service Workers** - Inline all classes in background.js
- ✅ **Content Security Policy** - No inline event handlers
- ✅ **Permissions** - Request only what's needed
- ✅ **Popup Controller** - MVC pattern for popup.html

## When Proposing Changes

1. ✅ **Explain FIRST** - Before coding, explain what and why
2. ✅ **Design Pattern** - State which pattern(s) you'll use
3. ✅ **SOLID Check** - Verify change doesn't violate SOLID
4. ✅ **No Breaking Changes** - Keep existing API unless discussed
5. ✅ **Test Plan** - How to verify it works

## Red Flags - NEVER DO (PROHIBITED)

- ❌ Write Polish code/comments (ENGLISH ONLY!)
- ❌ Add Claude/AI to git author (ONLY Jakub Syrek)
- ❌ Skip function descriptions (JSDoc required)
- ❌ Leave documentation outdated (update with every change)
- ❌ Skip logging (add meaningful logs everywhere)
- ❌ Skip error handling or use silent failures
- ❌ Create 100+ line functions (break into smaller ones)
- ❌ Use callbacks when async/await works
- ❌ Hardcode values (use constants or params)
- ❌ Commit without testing
- ❌ Write unclear variable names (x, temp, etc.)
- ❌ Violate SOLID principles
- ❌ Mention Claude anywhere in repo
- ❌ Use inline scripts in extensions
- ❌ Mix concerns in one class
- ❌ Use var instead of const/let
- ❌ Leave console errors unfixed

## Quality Checklist Before Each Commit

- [ ] **CRITICAL**: Author is Jakub Syrek only (NEVER Claude)
- [ ] Code is in English (all comments, variables, strings)
- [ ] JSDoc added to EVERY public function
- [ ] Function descriptions are clear and detailed
- [ ] Logging added for important operations
- [ ] SOLID principles followed
- [ ] Design patterns used appropriately
- [ ] Error handling implemented with try/catch
- [ ] No console errors
- [ ] Tested functionality
- [ ] Commit message is descriptive
- [ ] Documentation updated (README, comments, docs)
- [ ] File structure is clean
- [ ] No breaking changes (or discussed first)
- [ ] No Claude/AI mentions anywhere

---

**TL;DR**: Professional code, English only, SOLID + patterns, comprehensive docs, clean commits, thorough testing.
