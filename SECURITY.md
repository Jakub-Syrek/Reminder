# Security Policy

## Supported versions

Security fixes are applied to the latest released minor of the `2.x` line. Older majors are not supported.

| Version | Supported |
| ------- | --------- |
| 2.x     | yes       |
| < 2.0   | no        |

## Reporting a vulnerability

Please report suspected vulnerabilities **privately** by email to:

**jakubvonsyrek@gmail.com**

Include:

- A clear description of the issue and its impact.
- Step-by-step reproduction instructions, ideally with a minimal proof of concept.
- The version of the extension, browser, and operating system you observed it on.
- Any suggested mitigations or patches.

### Response expectations

- Acknowledgement within 72 hours.
- A triage assessment within 7 calendar days.
- Coordinated disclosure: please give a reasonable window (typically up to 90 days) before publishing details, so a fix can be released first.

### Scope

In scope:

- The extension source code in this repository (popup UI, alert window, service worker, helpers).
- Build, test, and release tooling that ships with the repository.

Out of scope:

- Vulnerabilities in upstream Chrome / Chromium APIs themselves.
- Issues that require an already-compromised browser profile or operating system.
- Social-engineering scenarios that do not involve the extension's code.

Thank you for helping keep Reminder users safe.
