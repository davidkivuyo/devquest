# Issue Templates

Copy-paste these into a new GitHub issue depending on what you're filing.
A maintainer can also drop these into `.github/ISSUE_TEMPLATE/` so they auto-load.

---

## 🟢 Claim a challenge

> Use this when you want to start work on something from [CHALLENGES.md](../CHALLENGES.md).
> Title: `[CLAIM] <challenge id> — <short title>` (e.g. `[CLAIM] A1 — Improve password strength scorer`)

```markdown
## Challenge
**ID:** A1
**Title:** Improve password strength scorer
**Tier:** 🟢 Guided

## My plan
- Add a small banned-passwords list (`password`, `123456`, ...)
- Penalize repeated characters
- Make special-character bonus more meaningful

## Files I'll touch
- js/auth.js

## ETA
Aiming to open the PR within 3 days.

## Questions
None right now — will ask if I get stuck.
```

A maintainer reacts 👍 → it's yours. Don't disappear: if life happens, comment and unclaim.

---

## 🐛 Bug report

> Use this when something isn't working as expected.
> Title: short, factual — `Leaderboard sort breaks when streak is 0`

```markdown
## What happened?
A short, factual description of the bug.

## Steps to reproduce
1. Go to [page]
2. Click [thing]
3. Notice [unexpected]

## Expected behavior
What you thought would happen.

## Actual behavior
What did happen — paste any console errors here in a code block.

## Environment
- Browser: e.g. Chrome 124
- OS: e.g. Windows 11
- Did you reset localStorage recently? yes / no

## Screenshots / video
(Optional but encouraged for visual bugs.)

## Anything you've already tried
e.g. cleared localStorage, tried in incognito, looked at the network tab.
```

---

## 💡 Feature proposal

> Use this when you want to suggest a new challenge or a new feature *not* in CHALLENGES.md yet.
> Title: `Proposal: <one-line summary>`

```markdown
## Problem
Describe the problem from a user's perspective. Don't jump to a solution.

## Proposed solution
A short sketch of what you'd build.

## Why this fits DevQuest
Explain why this is a good *learning* opportunity, not just a feature.
- What does a student practice while building this?
- Which tier (🟢 / 🟡 / 🔴) does it best fit?

## Alternatives considered
Why not X? Why not Y?

## Are you volunteering to build it?
Yes / No / Maybe with help
```

A maintainer will discuss, refine, and (if accepted) add it to CHALLENGES.md.

---

## 📚 Docs / readme issue

> Use this for anything wrong, missing, or confusing in the markdown docs.
> Title: `docs: <what's wrong>`

```markdown
## Where
File and section: e.g. `CONTRIBUTING.md` → "Branch naming rules"

## What's confusing / wrong
A short description.

## What I'd expect instead
A suggestion. Even a rough one is fine.
```

---

## ❓ Question

> If your question fits inside the running app's community feed, post it there.
> Use a GitHub issue **only** for questions about the project itself or its workflow.

```markdown
## Question
Your question.

## What I've already tried / read
Show that you've looked. Linking the file or doc you read first is a great signal.

## Why this matters
Help us understand what you're trying to accomplish.
```

---

## Tips for any issue

- **Search first.** Maybe someone already filed it.
- **One issue per problem.** Don't bundle bug reports with feature requests.
- **Title carefully.** Reviewers triage by title. "Bug" is not a title.
- **Be patient.** Maintainers are humans. A polite ping after 3+ business days is fine.

> _Good issues get good help. Vague issues get nothing._
