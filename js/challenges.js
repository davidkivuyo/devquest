/* ============================================
   challenges.js — TIER: GUIDED + INCOMPLETE
   List, filter, view a challenge, mark complete.
   ============================================ */

const ChallengeView = {
  state: {
    difficulty: "all",
    topic: "all",
    query: "",
  },

  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "challenges.html", title: "Challenges" });

    // Direct-to-detail via hash
    if (location.hash) {
      const id = location.hash.slice(1);
      const challenge = Store.list(STORE_KEYS.CHALLENGES).find((c) => c.id === id);
      if (challenge) return this.renderDetail(challenge, me);
    }

    this.renderList(me);
    window.addEventListener("hashchange", () => this.render());
  },

  renderList(me) {
    const root = document.getElementById("content");
    const challenges = Store.list(STORE_KEYS.CHALLENGES);
    const completions = Store.list(STORE_KEYS.COMPLETIONS).filter(
      (c) => c.userId === me.id
    );
    const completedIds = new Set(completions.map((c) => c.challengeId));

    const topics = ["all", ...new Set(challenges.map((c) => c.topic))];

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2>Choose your quest</h2>
          <p>${challenges.length} challenges · ${completedIds.size} completed</p>
        </div>
        <div class="row">
          <span class="tier-pill guided">Guided</span>
          <span class="tier-pill incomplete">Incomplete</span>
          <span class="tier-pill stretch">Stretch</span>
        </div>
      </div>

      <div class="challenges-toolbar">
        <div class="search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <!-- TIER: GUIDED — wired up. CHALLENGE: highlight matching text in cards -->
          <input id="searchInput" placeholder="Search challenges..." />
        </div>

        <div class="filter-group" id="diffFilter">
          <button class="filter-btn active" data-d="all">All</button>
          <button class="filter-btn easy" data-d="easy">Easy</button>
          <button class="filter-btn medium" data-d="medium">Medium</button>
          <button class="filter-btn hard" data-d="hard">Hard</button>
        </div>

        <div class="filter-group" id="topicFilter">
          ${topics
            .map(
              (t) =>
                `<button class="filter-btn ${
                  t === "all" ? "active" : ""
                }" data-t="${t}">${
                  t === "all" ? "All topics" : t
                }</button>`
            )
            .join("")}
        </div>
      </div>

      <div class="challenges-grid" id="challengeGrid"></div>
    `;

    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.state.query = e.target.value.toLowerCase();
      this.repaintGrid(me);
    });

    document.getElementById("diffFilter").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-d]");
      if (!btn) return;
      document
        .querySelectorAll("#diffFilter .filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      this.state.difficulty = btn.dataset.d;
      this.repaintGrid(me);
    });

    document.getElementById("topicFilter").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-t]");
      if (!btn) return;
      document
        .querySelectorAll("#topicFilter .filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      this.state.topic = btn.dataset.t;
      this.repaintGrid(me);
    });

    this.repaintGrid(me);
  },

  repaintGrid(me) {
    const grid = document.getElementById("challengeGrid");
    if (!grid) return;
    const challenges = Store.list(STORE_KEYS.CHALLENGES);
    const completedIds = new Set(
      Store.list(STORE_KEYS.COMPLETIONS)
        .filter((c) => c.userId === me.id)
        .map((c) => c.challengeId)
    );

    const filtered = challenges.filter((c) => {
      if (this.state.difficulty !== "all" && c.difficulty !== this.state.difficulty)
        return false;
      if (this.state.topic !== "all" && c.topic !== this.state.topic) return false;
      if (this.state.query) {
        const q = this.state.query;
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="muted" style="grid-column:1/-1; text-align:center; padding:40px">
          <i class="fa-solid fa-mug-hot" style="font-size:32px; color:var(--text-mute)"></i>
          <p>No challenges match your filters.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (c) => `
        <article class="challenge-card ${c.difficulty} ${
          completedIds.has(c.id) ? "completed" : ""
        }" data-id="${c.id}">
          <div class="topic-line">
            <span class="tag ${c.difficulty}">${c.difficulty}</span>
            <span class="muted">·</span>
            <span class="text-accent">${c.topic}</span>
          </div>
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <div class="foot">
            <span class="xp"><i class="fa-solid fa-bolt"></i> ${c.xp} XP</span>
            <span><i class="fa-solid fa-lightbulb"></i> ${c.hints.length} hints</span>
            <div class="spacer"></div>
            <span class="text-accent">Open <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </article>`
      )
      .join("");

    grid.querySelectorAll(".challenge-card").forEach((card) => {
      card.addEventListener("click", () => {
        location.hash = card.dataset.id;
      });
    });
  },

  renderDetail(challenge, me) {
    const root = document.getElementById("content");
    const completions = Store.list(STORE_KEYS.COMPLETIONS).filter(
      (c) => c.userId === me.id
    );
    const isDone = completions.some((c) => c.challengeId === challenge.id);
    const saved = completions.find((c) => c.challengeId === challenge.id);

    root.innerHTML = `
      <a class="back-link" id="backLink"><i class="fa-solid fa-arrow-left"></i> All challenges</a>

      <div class="page-head">
        <div>
          <div class="row" style="margin-bottom:6px">
            <span class="tag ${challenge.difficulty}">${challenge.difficulty}</span>
            <span class="text-accent">${challenge.topic}</span>
            <span class="muted">·</span>
            <span class="text-gold"><i class="fa-solid fa-bolt"></i> ${challenge.xp} XP</span>
          </div>
          <h2>${challenge.title}</h2>
        </div>
      </div>

      <div class="editor-shell">
        <div class="info-pane">
          <h3>Brief</h3>
          <p class="description">${challenge.description}</p>

          <h3 style="font-size:14px; margin-top:18px">Hints</h3>
          ${challenge.hints
            .map(
              (h, i) => `
            <div class="hint-card">
              <strong style="color:var(--accent)">Hint ${i + 1}.</strong> ${h}
            </div>`
            )
            .join("")}

          ${
            isDone
              ? `<div class="hint-card" style="border-left-color:var(--success); margin-top:18px">
                  <strong style="color:var(--success)">Completed</strong> — earned ${challenge.xp} XP. You can keep tweaking your code.
                </div>`
              : ""
          }
        </div>

        <div class="editor-pane">
          <div class="editor-toolbar">
            <span><i class="fa-solid fa-code"></i> editor.js</span>
            <span class="muted">Auto-saved locally</span>
          </div>
          <textarea class="code-area" id="codeArea" spellcheck="false">${
            (saved && saved.code) || challenge.starter || ""
          }</textarea>
          <div class="editor-actions">
            <button class="btn btn-ghost" id="resetBtn">
              <i class="fa-solid fa-rotate-left"></i> Reset
            </button>
            <button class="btn btn-primary" id="submitBtn">
              <i class="fa-solid fa-circle-check"></i>
              ${isDone ? "Save changes" : "Mark as complete"}
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("backLink").addEventListener("click", () => {
      location.hash = "";
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      document.getElementById("codeArea").value = challenge.starter || "";
    });

    // Auto-save while typing (debounced — TIER: STRETCH, write a real debouncer)
    let timer;
    document.getElementById("codeArea").addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const code = e.target.value;
        const existing = Store.list(STORE_KEYS.COMPLETIONS).find(
          (c) => c.userId === me.id && c.challengeId === challenge.id
        );
        if (existing) {
          Store.update(
            STORE_KEYS.COMPLETIONS,
            (c) => c.userId === me.id && c.challengeId === challenge.id,
            { code }
          );
        }
      }, 600);
    });

    document.getElementById("submitBtn").addEventListener("click", () => {
      const code = document.getElementById("codeArea").value;
      const existing = Store.list(STORE_KEYS.COMPLETIONS).find(
        (c) => c.userId === me.id && c.challengeId === challenge.id
      );

      if (existing) {
        Store.update(
          STORE_KEYS.COMPLETIONS,
          (c) => c.userId === me.id && c.challengeId === challenge.id,
          { code, updatedAt: Date.now() }
        );
        UI.toast("Code saved", "success");
      } else {
        Store.push(STORE_KEYS.COMPLETIONS, {
          id: Store.uid("comp"),
          userId: me.id,
          challengeId: challenge.id,
          code,
          completedAt: Date.now(),
        });

        // Award XP
        const newXp = (me.xp || 0) + challenge.xp;
        Auth.updateProfile({ xp: newXp });
        Store.logActivity(me.id, `Completed "${challenge.title}" (+${challenge.xp} XP)`);
        Awards.checkAndAward(me.id);

        UI.toast(`+${challenge.xp} XP — quest complete!`, "success");
        setTimeout(() => this.render(), 800);
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => ChallengeView.render());
