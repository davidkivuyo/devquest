# DevQuest — Challenges

> **Read this like a quest log.** Pick one. Open a branch. Ship a PR.

Every challenge here is something missing or unfinished in the codebase. They are organized by **page**, and tagged by **tier**:

| Tier | Meaning |
|---|---|
| 🟢 **Guided** | Working code is there. Tweak, improve, or polish it. |
| 🟡 **Incomplete** | Some structure exists, the logic is missing — fill it in. |
| 🔴 **Stretch** | Nothing exists yet. Design it and build it from scratch. |

When you start a challenge, **claim it** by opening an Issue with the title `[CLAIM] <challenge title>` so we don't all build the same thing twice.

---

## Auth ([index.html](./index.html), [js/auth.js](./js/auth.js))

### 🟢 A1. Improve the password strength scorer
The scorer in `scorePassword()` is naive. Improve it to:
- Penalize repeated characters (`aaaaaa` should never be "strong").
- Penalize common passwords (a small list is fine: `password`, `123456`, `qwerty`...).
- Reward special characters more meaningfully.

**Files**: `js/auth.js`

### 🟡 A2. Show / hide password toggle
Each password field should have an eye icon that toggles between `type="password"` and `type="text"`.

**Files**: `index.html`, `css/auth.css`, `index.html` inline script

### 🔴 A3. Hashed passwords using SubtleCrypto
Replace the plaintext password storage in `Auth.register` and the comparison in `Auth.login` with SHA-256 hashing using `crypto.subtle.digest`. Make sure existing seeded users still work — you'll need to migrate them.

**Files**: `js/auth.js`, `data/seed.js`

### 🔴 A4. Forgot password flow
Build a "Forgot password?" link on the login form that opens a modal explaining a real flow would email a reset link. For now: let the user reset their password if they remember their email.

**Files**: `index.html`, `js/auth.js`, `css/auth.css`

---

## Dashboard ([pages/dashboard.html](./pages/dashboard.html), [js/dashboard.js](./js/dashboard.js))

### 🟢 D1. Personalize the welcome message
The greeting just says the user's first name. Vary it by time of day ("Good morning, Aisha"). Vary it by streak ("11-day streak — incredible!"). Vary it by completion count.

**Files**: `js/dashboard.js`

### 🟡 D2. Filter the recent activity feed
Add tabs above the activity feed: **All** / **Quests** / **Posts** / **Profile**. Filter the feed by which kind of action it was.

**Files**: `js/dashboard.js`, `js/storage.js` (you'll need to tag activity entries with a kind)

### 🔴 D3. Daily quote — real fetch
The dashboard has a hardcoded quote. Replace it with a `fetch()` call to a public quotes API (e.g. `https://api.quotable.io/random`). Handle:
- Loading state (skeleton / shimmer).
- Error state (fall back to a hardcoded quote).
- Caching (don't refetch on every page load — store today's quote and reuse it).

**Files**: `js/dashboard.js`

### 🔴 D4. "Recommended next quest" widget
Look at which topics the user has completed and recommend a quest in their weakest topic. Show it as a featured card on the dashboard.

**Files**: `js/dashboard.js`, `css/dashboard.css`

---

## Challenges ([pages/challenges.html](./pages/challenges.html), [js/challenges.js](./js/challenges.js))

### 🟢 C1. Highlight matched text in search
The search bar already filters cards. Make the matched text inside the card title and description visually highlighted (`<mark>` works fine).

**Files**: `js/challenges.js`

### 🟡 C2. Run the user's code
Right now, "Mark as complete" just trusts the user. Add a **Run** button that uses `eval()` (or a `Function()` constructor) to execute the user's code against a tiny test case for that challenge. Display pass / fail.

> **Caution**: `eval` is fine for a sandbox demo — never for real user input from a server.

**Files**: `js/challenges.js`, `data/seed.js` (add a `tests` field per challenge)

### 🟡 C3. Sort challenges
Add a sort dropdown: **By difficulty**, **By XP (high→low)**, **By topic A→Z**, **Newest** (you'll need a `createdAt` on each).

**Files**: `js/challenges.js`, `data/seed.js`

### 🔴 C4. Syntax highlighting in the code editor
The textarea is plain. Replace it (or layer over it) with syntax-highlighted code. You can either:
- Build a tiny tokenizer for JS keywords (purist mode).
- Use a library like Prism via CDN for the rendered preview while keeping the textarea for input.

**Files**: `js/challenges.js`, `css/challenges.css`

### 🔴 C5. Submit a new challenge
Build an "Add challenge" form (probably modal) that lets logged-in users submit their own challenges. Validate everything. Save to localStorage like the rest.

**Files**: `js/challenges.js`, `css/challenges.css`

---

## Leaderboard ([pages/leaderboard.html](./pages/leaderboard.html), [js/leaderboard.js](./js/leaderboard.js))

### 🟢 L1. Highlight rank changes
Compare current ranks with what they were yesterday (you'll need to snapshot once per day in localStorage). Show a tiny up-arrow / down-arrow next to each row.

**Files**: `js/leaderboard.js`, `js/storage.js`

### 🟡 L2. Search players
Add a search box above the table that filters players by name in real time.

**Files**: `js/leaderboard.js`

### 🔴 L3. Per-topic leaderboards
Add tabs: **Overall**, **JavaScript**, **CSS**, **Algorithms**, etc. Recompute rankings only counting completions in the selected topic.

**Files**: `js/leaderboard.js`, `css/leaderboard.css`

### 🔴 L4. Friends-only leaderboard
Add a "follow" feature on the profile page (Stretch on Profile too — see P4). Then add a "Friends" tab on the leaderboard showing only people you follow + you.

**Files**: `js/leaderboard.js`, `js/profile.js`

---

## Profile ([pages/profile.html](./pages/profile.html), [js/profile.js](./js/profile.js))

### 🟢 P1. Add a website / portfolio social link
The edit-profile modal supports GitHub and Twitter. Add a third row for "Personal website".

**Files**: `js/profile.js`

### 🟡 P2. Heatmap tooltips on hover
Each cell in the heatmap shows a `title` attribute. Replace this with a real hover tooltip that doesn't depend on the browser's slow default tooltip.

**Files**: `js/profile.js`, `css/profile.css`

### 🔴 P3. Shareable profile URL
A user's profile is currently always "the logged-in user". Add a `?u=<email>` query parameter that loads any user's profile (read-only). Update the **Share** button to copy that URL.

**Files**: `js/profile.js`

### 🔴 P4. Follow / followers
Let users follow each other. Show counts on the profile hero. Surface a "Following" tab on the community feed that filters posts by people you follow.

**Files**: `js/profile.js`, `js/feed.js`, `js/storage.js`

---

## Community ([pages/community.html](./pages/community.html), [js/feed.js](./js/feed.js))

### 🟢 F1. Format multi-paragraph posts
Posts respect `\n` as a line break. Make double `\n` produce paragraph breaks for nicer reading.

**Files**: `js/feed.js`

### 🟡 F2. @mentions
When someone types `@aisha` in a post, turn it into a link to that user's profile. Tab-completion of names is a nice extra.

**Files**: `js/feed.js`

### 🟡 F3. Sort the feed
Add tabs: **Latest**, **Top this week**, **Most replies**.

**Files**: `js/feed.js`

### 🔴 F4. Image uploads (data URLs)
Add an image button to the composer that lets the user attach an image. Store it as a data URL in the post object (yes, this is wasteful — it's a localStorage demo). Render it in the post.

**Files**: `js/feed.js`, `css/community.css`

### 🔴 F5. Real-time-ish feed
Open the community page in two browser tabs. Posts in one tab should appear in the other within a few seconds. Hint: `window.addEventListener('storage', ...)`.

**Files**: `js/feed.js`

---

## Resources ([pages/resources.html](./pages/resources.html), [js/resources.js](./js/resources.js))

### 🟢 R1. Show submitter
For user-submitted resources, show "Added by **Aisha**" on the card. System resources can stay unattributed.

**Files**: `js/resources.js`, `css/resources.css`

### 🟡 R2. Vote on resources
Let users upvote / downvote a resource. Sort by score by default.

**Files**: `js/resources.js`

### 🔴 R3. Moderation queue
Right now, anyone can submit anything and it shows up immediately. Build a hidden moderation page (only the first registered user is "admin") where new submissions sit pending until approved.

**Files**: `js/resources.js`, new `pages/moderation.html`

### 🔴 R4. Tagged resources
Move beyond a single `topic` field — let resources have multiple tags. Add tag-based filtering with multiple selected tags at once.

**Files**: `js/resources.js`, `data/seed.js`

---

## Settings ([pages/settings.html](./pages/settings.html), [js/settings.js](./js/settings.js))

### 🟢 S1. Persist settings nav scroll-spy
Highlight the active section in the left nav based on scroll position, not just on click.

**Files**: `js/settings.js`, `css/settings.css`

### 🟡 S2. Export my data
Add a button "Export data (JSON)" that downloads the user's posts, completions and profile as a `.json` file.

**Files**: `js/settings.js`

### 🔴 S3. Keyboard shortcuts
Add a **Shortcuts** section that lets the user view (and even rebind) shortcuts: `gd` go to dashboard, `gc` go to challenges, `?` show all shortcuts, etc. Wire them up so they actually work site-wide.

**Files**: `js/settings.js`, `js/ui.js`

### 🔴 S4. Two-factor (visual only)
Add a 2FA section that walks the user through a fake QR setup flow. It's purely visual since there's no backend, but the UX should feel real.

**Files**: `js/settings.js`, `css/settings.css`

---

## Cross-cutting (apply across the whole app)

### 🟡 X1. Mobile menu
The sidebar already collapses on mobile, but the hamburger only appears below 980px. Make it always available, and make a working backdrop that closes it when tapped.

**Files**: `js/ui.js`, `css/main.css`

### 🔴 X2. Make DevQuest a true SPA
Right now, every page is a separate HTML file. Refactor so `index.html` is the only HTML, and pages are rendered into a single `<main>` based on `location.pathname`. Update `js/app.js` (it has a skeleton).

**Files**: `js/app.js`, all `pages/*.html` (ideally deleted), `index.html`

### 🔴 X3. Replace localStorage with a real backend
This is the **graduation challenge**. When you've learned Node + Express + SQLite (or PostgreSQL):
1. Build the API (`POST /users`, `GET /challenges`, etc.).
2. Replace every `Store.list(...)` call in the JS with a `fetch(...)`.
3. Move auth to JWT cookies.

The codebase is structured so you should only need to change `js/storage.js`, `js/auth.js`, and a couple of read sites. Everything else stays.

**Files**: `js/storage.js`, `js/auth.js`, plus a new backend folder

---

## Picking your first challenge

Don't sweat it. **A1** (auth password strength) is a great starter — small, useful, and you'll touch the auth flow which helps you understand the rest.

When you finish, mark your PR `closes #<issue number>` and we'll merge.

> _Good luck out there, traveler._
