# DevQuest

> **Level up your code, one quest at a time.**
> A real-feeling, multi-page learning platform built with plain HTML, CSS, and JavaScript — for students to fork, hack on, and ship pull requests against.

---

## What is DevQuest?

DevQuest looks and feels like a real product. It is **not** a toy.

When you open it, you log in. You see a dashboard with your XP, your streak, and your global rank. You pick a quest, write some code, mark it complete, and earn XP. You climb a leaderboard. You post in the community feed. You bookmark resources. You earn badges.

Under the hood: it's just `localStorage`. No backend. No frameworks. No build step.

**That's the whole point.** Every feature you see is something you'll later understand how to wire up to a real API, a real database, a real auth system. Today you're working on the front. Tomorrow you swap one file (`storage.js`) and suddenly the whole thing is talking to a server.

---

## Why this exists

Most beginner projects are calculators, todo lists, weather apps. They're fine — but they don't feel like products. They don't have a feed, a profile page, settings, dark mode, a leaderboard. They don't make you think about state, navigation, or how a real frontend is organized.

DevQuest gives you a real product to extend. The skeleton is built. **You** add the missing muscles.

---

## How it works — the three-tier system

Every page in DevQuest has features at three difficulty tiers:

| Tier | What's in the code | Your job |
|---|---|---|
| **🟢 Guided** | Working feature with `// CHALLENGE:` comments suggesting tweaks | Read it, understand it, tweak it |
| **🟡 Incomplete** | Skeleton + `// TODO:` markers, logic missing | Fill in the blanks |
| **🔴 Stretch** | Described only in [CHALLENGES.md](./CHALLENGES.md) — no code | Build it from scratch |

Open any JS file and you'll see comments like:

```js
// TIER: GUIDED — this works. Try improving the scoring algorithm.
// TIER: INCOMPLETE — fill this in.
// TIER: STRETCH — described in CHALLENGES.md.
```

That's your map.

---

## What's in the box

DevQuest ships with **8 working pages**:

1. **Auth** ([index.html](./index.html)) — login, register, password strength meter
2. **Dashboard** ([pages/dashboard.html](./pages/dashboard.html)) — welcome, stats, quick-quests, activity feed, daily quote slot
3. **Challenges** ([pages/challenges.html](./pages/challenges.html)) — filterable list, in-page code editor, XP rewards
4. **Leaderboard** ([pages/leaderboard.html](./pages/leaderboard.html)) — top-3 podium, ranked table, sortable
5. **Profile** ([pages/profile.html](./pages/profile.html)) — editable profile, color picker, badges, activity heatmap
6. **Community** ([pages/community.html](./pages/community.html)) — feed, post composer, likes, replies, trending tags
7. **Resources** ([pages/resources.html](./pages/resources.html)) — curated links, topic filter, bookmarks, submit-your-own
8. **Settings** ([pages/settings.html](./pages/settings.html)) — theme toggle, notifications, danger zone

Plus a complete dark-mode design system you can copy and reuse.

---

## Getting started in 60 seconds

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/devquest.git
cd devquest

# 2. There is no build step. Just open it.
#    Use any local server — for example:
npx serve .
#    or:
python -m http.server 8000

# 3. Visit http://localhost:8000 (or whatever port your tool uses)
```

> **Heads up**: opening `index.html` directly with a `file://` URL works for most things, but cross-page navigation and the daily quote (a stretch task) will behave better via a local HTTP server.

### Demo accounts (already seeded)

| Email | Password |
|---|---|
| `aisha@devquest.dev` | `demo1234` |
| `kelvin@devquest.dev` | `demo1234` |
| `rahim@devquest.dev` | `demo1234` |

Or just create your own from the **Sign up** tab.

---

## Project structure

```
devquest/
├── index.html              # Auth page (login + register)
├── README.md               # You are here
├── CHALLENGES.md           # All TODO tasks with difficulty
├── CONTRIBUTING.md         # How to fork, branch, PR
├── RULES.md                # Collaboration rules
├── DEVQUEST.md             # Vision + design philosophy
│
├── css/                    # One file per page + main design system
│   ├── main.css            # Tokens, layout, shared components
│   ├── auth.css            # ↳ used by index.html
│   ├── dashboard.css       # ↳ used by pages/dashboard.html
│   ├── challenges.css
│   ├── leaderboard.css
│   ├── profile.css
│   ├── community.css
│   ├── resources.css
│   └── settings.css
│
├── js/
│   ├── app.js              # Tiny placeholder for an SPA refactor (Stretch)
│   ├── auth.js             # Login / register / session
│   ├── storage.js          # localStorage wrapper — swap me later
│   ├── awards.js           # Badge rules + checker
│   ├── challenges.js       # List, filter, editor, completion
│   ├── leaderboard.js
│   ├── profile.js
│   ├── feed.js             # Community
│   ├── resources.js
│   ├── settings.js
│   ├── dashboard.js
│   └── ui.js               # Toast, modal, sidebar/topbar mounting
│
├── pages/                  # All other pages
│   ├── dashboard.html
│   ├── challenges.html
│   ├── leaderboard.html
│   ├── profile.html
│   ├── community.html
│   ├── resources.html
│   └── settings.html
│
└── data/
    └── seed.js             # Fake users, posts, challenges, resources
```

---

## How to contribute (the short version)

1. **Fork** the repo (top-right "Fork" button on GitHub).
2. **Clone** your fork.
3. **Branch**: `git checkout -b feat/password-strength-meter`
4. **Work** on a single CHALLENGE from [CHALLENGES.md](./CHALLENGES.md).
5. **Commit** with a clear message: `feat(auth): improve password strength scorer`
6. **Push** to your fork: `git push -u origin feat/password-strength-meter`
7. **Open a PR** against this repo — fill out the template.

The full guide is in [CONTRIBUTING.md](./CONTRIBUTING.md). The collaboration rules everyone agrees to are in [RULES.md](./RULES.md).

---

## What you'll learn by working on DevQuest

- Reading and understanding a real codebase you didn't write
- Working with `localStorage` for state
- DOM manipulation without React or Vue
- CSS variables and a real design system
- Form validation, accessibility, semantic HTML
- Git: branches, commits, pull requests
- Code review — both giving and receiving
- The discipline of shipping small, focused changes

When you're ready to learn Node and Express, you'll come back to `js/storage.js`, swap localStorage calls for `fetch()` calls, and the rest of the app won't change. That's the goal.

---

## License

MIT. Fork it, remix it, teach with it.

---

> _"First, solve the problem. Then, write the code."_ — John Johnson
