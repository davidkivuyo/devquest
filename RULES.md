# DevQuest — House Rules

> A short, plain-English code of conduct. By contributing to DevQuest, you agree to follow these.

---

## Be kind

This is a learning space. Everyone here was a beginner six months ago, and almost everyone is still learning something new today. The bar is **respect** — full stop.

- **No mocking or condescension.** Nobody asks "obvious" questions; they ask questions they don't yet know the answer to.
- **No "just" or "simply".** If it were just simple, the person wouldn't be asking.
- **Assume good intent.** When something reads as rude, ask before reacting.

---

## Be honest

- **If you don't know, say so.** "I'm not sure, but I think…" is a perfectly good answer.
- **If you used AI, GPT, or copied code, say so.** Cite it. There's nothing wrong with research — there's a lot wrong with claiming someone else's work.
- **If your PR has issues you know about**, mention them in the description. Don't make reviewers find them.

---

## Ship small

- **One challenge per PR.** Don't bundle.
- **One concern per commit** when possible. Reviewers can read 5 small commits faster than 1 big one.
- **Resist the temptation to clean up unrelated code** in a PR. Open a separate `refactor/...` branch if you spot something.

---

## Review thoughtfully

If you're reviewing someone else's PR:

- Read the **whole** PR before commenting on individual lines.
- Comment on **substance** before **style**. A misnamed variable is a 30-second fix; a logic bug is a real problem — start there.
- Be **specific**. "This is wrong" is not a review. "On line 42, this assumes `posts` is non-empty — what if there are no posts yet?" is a review.
- **Approve when it's good enough**, not when it's perfect. Perfect is the enemy of shipped.

---

## Be a good open-source citizen

- **Branch names follow the convention** (see [CONTRIBUTING.md](./CONTRIBUTING.md)).
- **Commit messages follow Conventional Commits** (see [CONTRIBUTING.md](./CONTRIBUTING.md)).
- **Don't force-push** during an active review.
- **Don't merge your own PRs.** A maintainer reviews and merges.
- **Don't leave PRs open forever.** If you can't finish, close it cleanly and explain why.

---

## On asking for help

It's encouraged. To get help fast:

1. **Search first.** Existing issues, the README, the comments in the code.
2. **State the problem precisely.** "It's broken" is not a problem statement. "When I click `Submit`, the page reloads instead of saving" is.
3. **Show what you've tried.** Even one or two attempts. It saves the helper from suggesting things you already ruled out.
4. **Share code.** Paste it (or a link to your branch). Screenshots of code are painful to read.

---

## On giving help

- **Teach, don't do.** Pointing someone at the right MDN page is more useful than writing their code for them.
- **Be patient.** A back-and-forth is normal — that's where learning happens.
- **Celebrate other people's wins.** First merged PR? React with 🎉. Big refactor? Say so.

---

## What gets a PR closed without review

- ❌ No issue claim → unclaimed work, may collide with someone else's.
- ❌ Branch named `main`, `update`, `aisha-changes`, etc.
- ❌ Multiple unrelated changes in one PR.
- ❌ "Drive-by" formatting reflows of files you didn't otherwise touch.
- ❌ Commit messages like `wip`, `update`, `final fix`.
- ❌ No description / no test plan in the PR body.

These aren't snobbery — they're how we keep the project shippable as it grows.

---

## What gets you a maintainer ping

- ✅ Multiple shipped, well-reviewed PRs.
- ✅ Helpful, kind reviews on others' PRs.
- ✅ Good documentation contributions.
- ✅ Designing and writing up a new challenge for CHALLENGES.md.

Active contributors get added as maintainers. We need more reviewers more than we need more code.

---

## Reporting problems

If anyone in the community is making the project unsafe or unwelcoming for you, contact the maintainers directly through a private GitHub issue or email (listed on the org page). We'll handle it without surfacing your name.

---

## Tl;dr

> Be kind. Be honest. Ship small. Review thoughtfully. Have fun.

That's it. Now go build something cool.
