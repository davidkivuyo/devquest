/* ============================================
   dashboard.js — TIER: GUIDED + INCOMPLETE
   ============================================ */

function renderDashboard() {
  const me = Auth.requireUser();
  if (!me) return;

  UI.mountLayout({ active: "dashboard.html", title: "Dashboard" });
  const root = document.getElementById("content");

  const challenges = Store.list(STORE_KEYS.CHALLENGES);
  const completions = Store.list(STORE_KEYS.COMPLETIONS).filter(
    (c) => c.userId === me.id
  );
  const completedIds = new Set(completions.map((c) => c.challengeId));
  const open = challenges.filter((c) => !completedIds.has(c.id)).slice(0, 4);

  const xp = me.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const rank = UI.rankFromXp(xp);
  const activity = Store.activityFor(me.id);

  // Position among all users by XP
  const sorted = [...Store.list(STORE_KEYS.USERS)].sort(
    (a, b) => (b.xp || 0) - (a.xp || 0)
  );
  const myRank = sorted.findIndex((u) => u.id === me.id) + 1;

  root.innerHTML = `
    <!-- Welcome -->
    <div class="welcome">
      <div>
        <h2>Welcome back, ${me.name.split(" ")[0]} <span class="wave"><i class="fa-solid fa-hand-sparkles"></i></span></h2>
        <p>You're <strong style="color:var(--accent)">${100 - xpInLevel} XP</strong> away from Level ${level + 1}. Pick a quest below.</p>
        <div class="progress mt-2" style="max-width:340px"><span style="width:${xpInLevel}%"></span></div>
      </div>
      <div class="welcome-cta">
        <div class="level-badge">
          <i class="fa-solid fa-shield-halved" style="color:${rank.color}"></i>
          <span class="lv">Lv ${level}</span>
          <span class="muted" style="font-size:13px">${rank.name}</span>
        </div>
        <a href="challenges.html" class="btn btn-primary">
          <i class="fa-solid fa-bolt"></i> Start a quest
        </a>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stats-grid">
      <div class="stat-card xp">
        <div class="icon"><i class="fa-solid fa-bolt"></i></div>
        <div>
          <div class="num">${xp.toLocaleString()}</div>
          <div class="label">Total XP</div>
        </div>
      </div>
      <div class="stat-card done">
        <div class="icon"><i class="fa-solid fa-circle-check"></i></div>
        <div>
          <div class="num">${completions.length}</div>
          <div class="label">Quests done</div>
        </div>
      </div>
      <div class="stat-card streak">
        <div class="icon"><i class="fa-solid fa-fire"></i></div>
        <div>
          <div class="num">${me.streak || 0}</div>
          <div class="label">Day streak</div>
        </div>
      </div>
      <div class="stat-card rank">
        <div class="icon"><i class="fa-solid fa-ranking-star"></i></div>
        <div>
          <div class="num">#${myRank || "—"}</div>
          <div class="label">Global rank</div>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="dashboard-grid">
      <!-- LEFT — Quick start -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Pick up where you left off</div>
            <div class="card-sub">Quick-start quests, hand-picked.</div>
          </div>
          <a href="challenges.html" class="btn btn-ghost btn-sm">
            See all <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div class="quick-quests">
          ${
            open.length
              ? open
                  .map(
                    (c) => `
                <a class="quest-card" href="challenges.html#${c.id}">
                  <div class="row between">
                    <span class="tag ${c.difficulty}">${c.difficulty}</span>
                    <span class="topic">${c.topic}</span>
                  </div>
                  <h4>${c.title}</h4>
                  <div class="meta">
                    <i class="fa-solid fa-bolt text-gold"></i> ${c.xp} XP
                    <span class="muted">·</span>
                    <i class="fa-regular fa-clock"></i> ${
                      c.difficulty === "easy"
                        ? "5–10 min"
                        : c.difficulty === "medium"
                        ? "20–30 min"
                        : "45+ min"
                    }
                  </div>
                </a>`
                  )
                  .join("")
              : `<div class="muted">All caught up! Add new challenges in <code>data/seed.js</code>.</div>`
          }
        </div>

        <!-- Daily quote (TIER: STRETCH — fetch a real one) -->
        <div class="daily-quote" id="dailyQuote">
          <div class="icon"><i class="fa-solid fa-quote-left"></i></div>
          <div class="text" id="quoteText">"First, solve the problem. Then, write the code."</div>
          <div class="author" id="quoteAuthor">— John Johnson</div>
        </div>
      </div>

      <!-- RIGHT — Recent activity -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent activity</div>
          <a href="profile.html" class="muted" style="font-size:12px">history</a>
        </div>
        <div class="activity-feed">
          ${
            activity.actions.length
              ? activity.actions
                  .slice(0, 12)
                  .map(
                    (a) => `
                <div class="activity-item">
                  <div class="ico"><i class="fa-solid fa-bolt"></i></div>
                  <div>
                    <div class="text">${a.action}</div>
                    <div class="when">${UI.formatDate(a.at)}</div>
                  </div>
                </div>`
                  )
                  .join("")
              : `<div class="muted">No activity yet — start a quest!</div>`
          }
        </div>
      </div>
    </div>
  `;

  // TIER: STRETCH — replace the hardcoded quote with a real fetch.
  // Try https://api.quotable.io/random — wire it up here:
  //
  //   fetch('https://api.quotable.io/random')
  //     .then(r => r.json())
  //     .then(data => {
  //       document.getElementById('quoteText').textContent = `"${data.content}"`;
  //       document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
  //     });
  //
  // Remember error handling — what if the API is down?
}

document.addEventListener("DOMContentLoaded", renderDashboard);
