# Contributing to DevQuest

Welcome, hero. This document is your **field guide** to shipping changes to DevQuest. It covers:

1. [Forking the repo](#1-fork-the-repo)
2. [Cloning your fork](#2-clone-your-fork)
3. [Picking a challenge](#3-pick-a-challenge)
4. [Branch naming](#4-branch-naming-rules)
5. [Writing the code](#5-write-the-code)
6. [Commit messages](#6-commit-messages)
7. [Opening an issue](#7-opening-an-issue)
8. [Opening a pull request](#8-opening-a-pull-request)
9. [Code review etiquette](#9-code-review-etiquette)
10. [Common questions](#10-common-questions)

---

## 1. Fork the repo

On the GitHub repo page, click **Fork** (top-right). This creates **your copy** under your GitHub account. You will work on your fork, then ask the original repo to pull your changes.

> 🧠 **Why?** You don't have permission to push directly to the main repo — and that's a feature. Forking + PRs is exactly how real open-source teams collaborate.

## 2. Clone your fork

```bash
# Replace YOUR-USERNAME
git clone https://github.com/YOUR-USERNAME/devquest.git
cd devquest

# Add the original repo as "upstream" so you can pull updates later
git remote add upstream https://github.com/ORIGINAL-OWNER/devquest.git
```

To grab the latest changes from the main repo later:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 3. Pick a challenge

Open [CHALLENGES.md](./CHALLENGES.md). Each challenge is tagged:

- 🟢 **Guided** — easiest. Working code exists; tweak it.
- 🟡 **Incomplete** — fill-in-the-blanks logic.
- 🔴 **Stretch** — build it from scratch.

**Pick exactly one**. One challenge per PR. Don't combine multiple unrelated changes.

### Claim your challenge

So nobody builds the same thing twice, **open an Issue first**:

- Title: `[CLAIM] <challenge title>` (e.g. `[CLAIM] A1. Improve the password strength scorer`)
- In the body, paste a one-paragraph plan: *what you intend to do*, *which files you'll touch*, *any questions*.

A maintainer will reply 👍 on the issue. Now it's yours. Don't disappear on it for two weeks — if you can't finish, comment on the issue and unclaim.

---

## 4. Branch naming rules

**Always work on a branch.** Never commit to `main` on your fork.

Format:

```
<type>/<short-kebab-description>
```

| Type | When to use |
|---|---|
| `feat`     | New feature (e.g. `feat/password-show-toggle`) |
| `fix`      | Bug fix (e.g. `fix/leaderboard-sort-broken`) |
| `style`    | Visual / CSS-only change (e.g. `style/dashboard-spacing`) |
| `refactor` | Reorganizing code without behavior change (e.g. `refactor/extract-modal-helper`) |
| `docs`     | Markdown / comment changes (e.g. `docs/clarify-readme-setup`) |
| `chore`    | Tooling, deps, config (e.g. `chore/add-prettier-config`) |
| `test`     | Adding / updating tests |

```bash
# Make sure main is up to date first
git checkout main
git pull upstream main

# Create your branch
git checkout -b feat/password-show-toggle
```

**Bad branch names** to avoid: `my-changes`, `update`, `fix1`, `aisha-branch`. They tell reviewers nothing.

---

## 5. Write the code

Some house rules so reviews go fast:

- **Don't reformat unrelated files.** If you're changing one function, don't reflow the whole file. PRs full of incidental whitespace changes are painful.
- **Match the existing style.** Look at neighboring code. Don't introduce semicolon styles, indentation, or naming conventions different from what's around you.
- **Keep PRs small.** Under ~300 lines changed is the sweet spot.
- **Comments explain why, not what.** Avoid `// increment counter` over `counter++`. Prefer comments that explain *why this needed to exist* — usually a constraint or gotcha.
- **Test it manually** in at least one browser before opening the PR. Reload the page, log in, log out, try the edge cases.

---

## 6. Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) — same as the branch prefixes.

```
<type>(<scope>): <imperative summary, no period>

<optional longer body explaining the why>
```

Examples:

```
feat(auth): add show-password toggle to login form

The login and register password inputs now have an eye icon that
toggles between type=password and type=text. Closes #14.
```

```
fix(leaderboard): correct sort order when streak is null

Some seeded users have streak=undefined which broke the comparator.
```

```
style(dashboard): tighten welcome card spacing on mobile
```

**Bad commits** to avoid:

- `update files`
- `wip`
- `final fix lol`
- `Aisha's changes part 2`

If you screwed up your last commit message, fix it before pushing:

```bash
git commit --amend -m "feat(auth): better message"
```

---

## 7. Opening an issue

Issues are for **bug reports**, **claiming a challenge**, or **proposing new ideas**.

### Bug report template

```markdown
**What happened?**
A short, factual description.

**Steps to reproduce**
1. ...
2. ...
3. ...

**Expected**
What you thought would happen.

**Actual**
What did happen.

**Browser / OS**
e.g. Chrome 124 on macOS 14

**Screenshot / video** (optional but love them)
```

### Feature proposal template

```markdown
**Problem**
Describe the user-visible problem you'd like to solve.

**Proposed solution**
A short sketch.

**Alternatives considered**
Why not X, Y, or Z?
```

### Claim template

```markdown
**Challenge ID:** A1 — Improve password strength scorer

**Plan:**
- Add a small banned-passwords list
- Penalize repeated chars
- Bump score weight on special chars

**Files I'll touch:**
- js/auth.js

**Any questions:**
None — going to start tonight.
```

---

## 8. Opening a pull request

When your branch is ready:

```bash
git push -u origin feat/password-show-toggle
```

Then on GitHub:

1. Go to your fork's page.
2. Click **Compare & pull request**.
3. Fill out the PR template (it's pre-loaded).
4. Submit.

### PR title

Same format as your commit message — short, imperative, conventional commit prefix.

> ✅ `feat(auth): add show-password toggle`
> ❌ `Updated some stuff`

### PR description template

```markdown
## What
One-paragraph summary of the change.

## Why
The user-visible reason. Reference the challenge or issue:
> Closes #14 — Challenge A2 (Show / hide password toggle).

## How
- Bullet list of the technical approach
- Mention any decisions you made
- Call out anything you're unsure about

## How to test
1. Open `index.html`
2. Click on the password field
3. Click the eye icon — text should toggle visible/hidden

## Screenshots
(Drag in before/after screenshots if it's a visual change.)

## Checklist
- [ ] My branch name follows the convention
- [ ] My commit messages follow Conventional Commits
- [ ] I've tested this manually
- [ ] I've only changed files relevant to my challenge
- [ ] No console.log or debugging output left behind
```

---

## 9. Code review etiquette

You will both **receive** and **give** reviews. Both are skills.

### When you're getting reviewed

- **Don't take it personally.** Comments are about the code, not you.
- **Reply to every comment** — even if it's `Done`, `Good catch`, or `I disagree because…`.
- **Push fixes as new commits**, don't force-push during review (it makes the comment thread confusing). Squash at merge time.
- **Ask questions.** If a reviewer's request is unclear, say so.

### When you're reviewing

- **Be kind.** Always.
- **Be specific.** "This is broken" is unhelpful. "On line 42, when `users` is empty, this throws" is useful.
- **Suggest, don't demand.** "What about extracting this into a helper?" beats "Extract this into a helper."
- **Praise good moves.** It's a learning environment — call out the clever bits.
- **Use code suggestions.** GitHub's `Suggest change` button is great — it lets the author accept your fix in one click.

---

## 10. Common questions

**Q: I forked it ages ago and now my fork is way behind.**
Sync with upstream:
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

**Q: My PR has a merge conflict.**
GitHub will tell you. Resolve locally:
```bash
git fetch upstream
git rebase upstream/main
# resolve conflicts in your editor, then:
git add .
git rebase --continue
git push --force-with-lease
```

**Q: I want to make multiple changes — do I need multiple branches?**
Yes. One branch per PR per challenge.

**Q: Can I add a new feature that's not in CHALLENGES.md?**
Yes — but **open an issue first** to discuss. We'll either add it to CHALLENGES.md or guide you on scope.

**Q: My PR is taking forever to get reviewed.**
Polite ping is fine after 3+ business days. Reviewers are humans.

**Q: I'm stuck.**
Comment on your claim issue. Ask in the community feed inside the running app. We help each other here — that's the whole point.

---

## Code of conduct

By contributing to DevQuest you agree to follow [RULES.md](./RULES.md) — be kind, ship small, review thoughtfully, and have fun.

> _Now go ship a quest._
