/* ============================================
   leaderboard.js — TIER: GUIDED + INCOMPLETE
   ============================================ */

const LB = {
  state: { sortBy: "xp" },

  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "leaderboard.html", title: "Leaderboard" });

    const root = document.getElementById("content");
    const users = Store.list(STORE_KEYS.USERS);
    const completions = Store.list(STORE_KEYS.COMPLETIONS);

    const completionsByUser = (id) =>
      completions.filter((c) => c.userId === id).length;

    let ranked = users.map((u) => ({
      ...u,
      _done: completionsByUser(u.id),
    }));

    // Sort by current sortBy
    ranked.sort((a, b) => {
      if (this.state.sortBy === "xp") return (b.xp || 0) - (a.xp || 0);
      if (this.state.sortBy === "streak")
        return (b.streak || 0) - (a.streak || 0);
      if (this.state.sortBy === "done") return b._done - a._done;
      return 0;
    });

    const top3 = ranked.slice(0, 3);
    const rest = ranked.slice(3);

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2>Leaderboard</h2>
          <p>Where do you rank in the realm?</p>
        </div>
      </div>

      <!-- Top 3 podium -->
      <div class="podium">
        ${this.podiumCard(top3[1], "second", 2)}
        ${this.podiumCard(top3[0], "first", 1)}
        ${this.podiumCard(top3[2], "third", 3)}
      </div>

      <div class="lb-toolbar">
        <div class="muted">${ranked.length} players competing</div>
        <!-- TIER: GUIDED — sort buttons. CHALLENGE: add sort by date joined -->
        <div class="filter-group" id="lbSort">
          <button class="filter-btn ${this.state.sortBy === "xp" ? "active" : ""}" data-sort="xp">By XP</button>
          <button class="filter-btn ${this.state.sortBy === "done" ? "active" : ""}" data-sort="done">By quests</button>
          <button class="filter-btn ${this.state.sortBy === "streak" ? "active" : ""}" data-sort="streak">By streak</button>
        </div>
      </div>

      <div class="lb-table">
        <div class="lb-row head">
          <div>Rank</div>
          <div>Player</div>
          <div class="col-done">Quests</div>
          <div class="col-streak">Streak</div>
          <div>XP</div>
        </div>
        ${rest
          .map((u, i) => {
            const rankIdx = i + 4;
            const color = u.color || UI.pickColorFor(u.name);
            const isMe = u.id === me.id;
            return `
            <div class="lb-row ${isMe ? "me" : ""}">
              <div class="rank">#${rankIdx}</div>
              <div class="player">
                <div class="avatar sm" style="background:linear-gradient(135deg, ${color}, ${color}aa)">
                  ${UI.initials(u.name)}
                </div>
                <div>
                  <div class="name">${u.name}${isMe ? ' <span class="text-accent">(you)</span>' : ""}</div>
                  <div class="sub">${UI.rankFromXp(u.xp || 0).name}</div>
                </div>
              </div>
              <div class="col-done">${u._done}</div>
              <div class="col-streak">
                <span class="streak-pill">
                  <i class="fa-solid fa-fire"></i> ${u.streak || 0}d
                </span>
              </div>
              <div class="xp">${(u.xp || 0).toLocaleString()}</div>
            </div>`;
          })
          .join("")}
      </div>

      ${
        ranked.findIndex((u) => u.id === me.id) > 9
          ? `<div class="muted center mt-3">Keep grinding — every quest moves you up.</div>`
          : ""
      }
    `;

    document.getElementById("lbSort").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sort]");
      if (!btn) return;
      this.state.sortBy = btn.dataset.sort;
      this.render();
    });
  },

  podiumCard(user, klass, rank) {
    if (!user)
      return `<div class="podium-card ${klass}"><div class="muted">—</div></div>`;
    const color = user.color || UI.pickColorFor(user.name);
    const icon =
      rank === 1 ? "fa-crown" : rank === 2 ? "fa-medal" : "fa-award";
    return `
      <div class="podium-card ${klass}">
        <div class="rank-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="avatar lg" style="background:linear-gradient(135deg, ${color}, ${color}aa); margin-bottom:12px">
          ${UI.initials(user.name)}
        </div>
        <div class="name">${user.name}</div>
        <div class="meta">${UI.rankFromXp(user.xp || 0).name} · ${user.streak || 0}d streak</div>
        <div class="xp">${(user.xp || 0).toLocaleString()} <small>XP</small></div>
      </div>
    `;
  },
};

document.addEventListener("DOMContentLoaded", () => LB.render());
