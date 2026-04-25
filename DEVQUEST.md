# DEVQUEST.md — The Vision

> A longer document about **why** DevQuest exists, **who** it's for, and **how** it teaches.
> If [README.md](./README.md) is the surface, this is the why.

---

## The problem we're solving

Beginner web development tutorials usually look like this:

> *"Today we'll build a calculator! Open VS Code, write `<button>`, then `<input>`..."*

Tutorials like this teach syntax, but they don't teach **what shipping software actually feels like**. They don't show:

- A real codebase with multiple files that depend on each other.
- A real design system, not just `style="color:red"`.
- A real navigation flow with multiple pages and shared state.
- A real review process where someone else reads your code.
- The discipline of changing one thing without breaking another.

Most students hit a wall at *"now what?"* — the gap between "I built a calculator" and "I can read and contribute to a real frontend repo" is huge.

DevQuest is the bridge.

---

## The DevQuest premise

You are dropped into a working product on day one. You don't build it from scratch — that's not how real software works. You **read it**, you **understand it**, and you **contribute to it**.

Some features are finished. Some are half-done. Some don't exist at all and live as descriptions in [CHALLENGES.md](./CHALLENGES.md). Your job is to:

1. **Pick a challenge** from CHALLENGES.md.
2. **Read the surrounding code** to understand context.
3. **Branch, build, and PR** like a real contributor.
4. **Get reviewed**, respond to feedback, ship.
5. **Repeat**.

By the time you've shipped 5–10 PRs, you've practiced more of the actual workflow of professional software development than any single tutorial can give you.

---

## The three-tier system, explained

Every feature in DevQuest is built with three difficulty levels of contribution baked in.

### 🟢 Guided tier

The code **works**. There's a comment in the file like:

```js
// TIER: GUIDED — this works. CHALLENGE: improve the scoring algorithm.
```

Your job: read it, understand what it does, and improve it. You're learning *to read code*, which is — counterintuitively — the most valuable thing you can practice. Senior developers read 10x more code than they write.

### 🟡 Incomplete tier

There's a skeleton — variable names, empty functions, comments saying what's needed. You write the missing logic.

```js
// TODO: filter posts by tag
function postsByTag(tag) {
  // your code here
}
```

You're learning *to extend code*. Adding to something that exists, without breaking what's around it, is real-world skill #1.

### 🔴 Stretch tier

Nothing exists. Just a description in CHALLENGES.md:

> **F4. Image uploads** — Add an image button to the composer. Store images as data URLs in the post object. Render them in the post.

You design, you build, you test, you ship. You're learning *to architect*. Where do new files go? What's the data shape? How do existing utilities help you?

---

## Why localStorage?

Because today, you don't know Node.js. You don't know SQL. You don't know auth. **And you don't need to know yet.**

DevQuest deliberately uses `localStorage` for everything — users, posts, completions, settings — so that the *frontend* stays the focus. You learn:

- How a UI maintains state across pages.
- How to model data (what fields a "user" has, what fields a "post" has).
- How to read and write that data through a clean abstraction (`Store.list`, `Store.push`).

When you later learn backend, you'll come back to **one file** — `js/storage.js` — and replace localStorage calls with `fetch()` calls. The rest of the app won't change. **That's the lesson**: a well-designed frontend treats storage as an interface, not a destination.

---

## The pedagogy: read → tweak → fill → build

This is the loop:

```
   ┌──────────┐
   │   READ   │  Open the file, understand the existing code.
   └─────┬────┘
         │
   ┌─────▼────┐
   │  TWEAK   │  🟢 Improve a working feature (Guided tier).
   └─────┬────┘
         │
   ┌─────▼────┐
   │   FILL   │  🟡 Implement a missing piece (Incomplete tier).
   └─────┬────┘
         │
   ┌─────▼────┐
   │  BUILD   │  🔴 Build something new from scratch (Stretch tier).
   └──────────┘
```

You don't have to go top-to-bottom. Mix and match. But everyone starts on the read step.

---

## Skills you will practice

Real, named skills you'll get better at by working on DevQuest:

| Skill | How DevQuest exercises it |
|---|---|
| Reading unfamiliar code | Every challenge starts with reading something you didn't write |
| Git fluency | Branching, committing, rebasing, opening PRs, resolving conflicts |
| Code review | Both giving and receiving — across many small PRs |
| HTML semantics | Real, multi-page, accessible markup |
| CSS architecture | A token-driven design system across 8 page-level CSS files |
| DOM manipulation | No frameworks — every interaction is hand-wired |
| State management | Without React's `useState`, you'll learn to think in mutations + re-renders |
| Modeling data | What goes in a User? A Post? A Challenge? |
| Refactoring | Making changes without breaking neighbors |
| Communicating about code | PR descriptions, issue claims, reviews |

By the time you graduate to the **🔴 X3 challenge** (replace localStorage with a real backend), you'll be ready, because you'll have built the muscles.

---

## What DevQuest is **not**

To set expectations:

- **Not a curriculum.** There's no week 1 / week 2. Pick what interests you.
- **Not framework-y.** No React, Vue, Tailwind, or build tools. Plain HTML/CSS/JS only. (When you graduate, you'll be all the more grateful for what they automate.)
- **Not a polished SaaS.** It's deliberately incomplete — that's the *whole point*.
- **Not a replacement for fundamentals.** Use it alongside MDN, JavaScript.info, and similar references in [pages/resources.html](./pages/resources.html).

---

## A note for educators

If you're using DevQuest in a class or a bootcamp:

- The codebase is intentionally readable. Encourage students to read other people's PRs as homework.
- Code review is the highest-leverage classroom activity. PR review days teach more than 3 lectures.
- Let students post in the community feed inside the running app — it's a closed safe environment for first attempts at written technical communication.
- Consider giving each cohort its own `cohort/<term>` branch to merge into.

---

## Roadmap (loose)

Possible future evolutions of DevQuest. None are committed. Open an Issue if you want to drive one.

- A small Node + Express backend reference implementation, so the X3 challenge has somewhere to land.
- A "starter pack" version with only 3 challenges instead of 30, for very-first-week students.
- A printable "challenge cards" PDF for in-classroom use.
- A small CLI to scaffold a new challenge (so contributing new challenges is a one-liner).

---

## Credits

DevQuest was built as a frontend learning sandbox. The challenges are inspired by classic coding-interview prompts, real beginner pain points, and pet peeves of the maintainers.

Inspired by:
- The **read-first** culture of open source.
- The **three-tier** structure used by some classroom labs.
- The "real product, fake backend" trick that beginner React tutorials sometimes use — applied properly across an entire codebase.

---

## Final word

> Software is collaborative. Software is iterative. Software is *read* far more than it is *written*.
>
> DevQuest is built so that, by the time you graduate from it, none of those facts are surprises anymore.

Now stop reading docs and go ship a PR. 🛡️
