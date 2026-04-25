# Pull Request Template

> Copy this into the body of every PR you open. A maintainer can also drop it into `.github/pull_request_template.md` to auto-load.

---

```markdown
## What
One-paragraph summary of what this PR does. No fluff.

## Why
The user-visible reason. Reference your claim issue:
> Closes #<issue-number> — Challenge <ID> (<title>).

## How
- Bullet list of the technical approach
- Any decisions you made and why
- Anything you're unsure about — call it out

## How to test
1. Open `index.html`
2. Sign in (or use the demo account: aisha@devquest.dev / demo1234)
3. Navigate to [page]
4. Click [thing] — it should [behavior]

## Screenshots / GIFs
(Drag in before/after if it's a visual change. A short screen-recording wins reviews.)

## Tier
- [ ] 🟢 Guided
- [ ] 🟡 Incomplete
- [ ] 🔴 Stretch

## Checklist
- [ ] Branch name follows the convention (`feat/...`, `fix/...`, etc.)
- [ ] Commit messages follow Conventional Commits
- [ ] One challenge per PR — no unrelated changes bundled in
- [ ] I've manually tested in at least one browser
- [ ] No `console.log`, `debugger`, or commented-out code left behind
- [ ] I've updated relevant comments in the code (especially `// TIER:` markers if I finished one)
- [ ] If I added a new challenge: I've also added it to `CHALLENGES.md`
```

---

## What a great PR description looks like

A real example, fully filled out:

```markdown
## What
Adds a show/hide toggle to both password fields on the auth page (login + register).

## Why
> Closes #14 — Challenge A2 (Show / hide password toggle).

## How
- Wrapped each `<input type="password">` in the existing `.input-group` so the existing icon-positioning rules just work.
- Added an eye `<button>` inside the group, absolutely positioned.
- Toggle handler swaps `type` between `password` and `text`, plus icon between `fa-eye` and `fa-eye-slash`.
- I considered making this a reusable component but kept it inline since there are only two fields. Easy to extract later.

## How to test
1. Open `index.html`
2. In the login form, type something into the password field
3. Click the eye icon — text should reveal
4. Click again — should hide
5. Try the same on the register form
6. Tab through the form — focus order should still feel natural

## Screenshots
[before.png] [after.png]

## Tier
- [x] 🟢 Guided

## Checklist
- [x] Branch name: `feat/password-show-toggle`
- [x] Commit: `feat(auth): add show/hide toggle to password fields`
- [x] One challenge per PR
- [x] Tested in Chrome 124 + Firefox 125
- [x] No debug output left behind
- [x] Updated the `// TIER: GUIDED` comment in `auth.js` since this small thing is now done
```

---

## What a maintainer will check, in order

1. **Does the branch name follow the convention?** If not, it's an instant "please rename".
2. **Is there exactly one challenge in this PR?** Multi-purpose PRs get split.
3. **Does the description tell me what + why + how to test?** No description → close-on-sight.
4. **Does the code do what it says?** Read the diff.
5. **Does it break any existing flow?** Click around.
6. **Style nits.** Last, not first.

If 1-3 are fine, you're 80% of the way to a merged PR.

> _Good PRs feel inevitable. Bad PRs feel like work._
