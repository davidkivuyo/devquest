/* ============================================
   settings.js — TIER: GUIDED
   ============================================ */

const Settings = {
  defaults: {
    theme: "dark",
    notifyChallenges: true,
    notifyMentions: true,
    notifyDigest: false,
    soundFx: false,
  },

  load() {
    return { ...this.defaults, ...Store.get(STORE_KEYS.SETTINGS, {}) };
  },

  save(patch) {
    const merged = { ...this.load(), ...patch };
    Store.set(STORE_KEYS.SETTINGS, merged);
    UI.applyTheme();
    return merged;
  },

  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "settings.html", title: "Settings" });

    const root = document.getElementById("content");
    const s = this.load();

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2>Settings</h2>
          <p>Tune the experience to your liking.</p>
        </div>
      </div>

      <div class="settings-shell">
        <nav class="settings-nav">
          <button class="settings-nav-link active" data-target="appearance">
            <i class="fa-solid fa-palette"></i> Appearance
          </button>
          <button class="settings-nav-link" data-target="notifications">
            <i class="fa-solid fa-bell"></i> Notifications
          </button>
          <button class="settings-nav-link" data-target="account">
            <i class="fa-solid fa-user-gear"></i> Account
          </button>
          <button class="settings-nav-link" data-target="danger">
            <i class="fa-solid fa-triangle-exclamation"></i> Danger zone
          </button>
        </nav>

        <div>
          <!-- APPEARANCE -->
          <section class="settings-card" id="appearance">
            <h3>Appearance</h3>
            <p class="sub">How DevQuest looks on your device.</p>

            <div class="theme-options">
              <div class="theme-option dark ${s.theme === "dark" ? "active" : ""}" data-theme="dark">
                <div class="preview"></div>
                <div class="name"><i class="fa-solid fa-moon"></i> Dark</div>
                <div class="desc">Default. Easy on the eyes at night.</div>
              </div>
              <div class="theme-option light ${s.theme === "light" ? "active" : ""}" data-theme="light">
                <div class="preview"></div>
                <div class="name"><i class="fa-solid fa-sun"></i> Light</div>
                <div class="desc">Bright and clean for daytime.</div>
              </div>
            </div>
          </section>

          <!-- NOTIFICATIONS -->
          <section class="settings-card" id="notifications">
            <h3>Notifications</h3>
            <p class="sub">Toggles only — these are visual right now since there's no backend.</p>

            ${this.toggleRow("notifyChallenges", "New challenges", "Tell me when fresh quests appear.", s)}
            ${this.toggleRow("notifyMentions", "Mentions & replies", "Ping me when someone @s me or replies.", s)}
            ${this.toggleRow("notifyDigest", "Weekly digest", "Friday email-style summary of your progress.", s)}
            ${this.toggleRow("soundFx", "Sound FX", "Tiny sound when you complete a quest.", s)}
          </section>

          <!-- ACCOUNT -->
          <section class="settings-card" id="account">
            <h3>Account</h3>
            <p class="sub">Manage your identity on DevQuest.</p>

            <div class="field">
              <label>Display name</label>
              <input class="input" id="acctName" value="${me.name.replace(/"/g, "&quot;")}" />
            </div>
            <div class="field">
              <label>Email</label>
              <input class="input" value="${me.email}" disabled />
            </div>
            <button class="btn btn-primary" id="saveAccountBtn">
              <i class="fa-solid fa-floppy-disk"></i> Save changes
            </button>
          </section>

          <!-- DANGER ZONE -->
          <section class="settings-card danger-zone" id="danger">
            <h3>Danger zone</h3>
            <p class="sub">Permanent actions. No undo.</p>

            <div class="row between" style="padding:14px 0; border-bottom:1px solid var(--line-soft)">
              <div>
                <div class="label" style="font-weight:600">Reset progress</div>
                <div class="desc muted" style="font-size:12.5px">Wipe completed quests and XP. Keeps your account.</div>
              </div>
              <button class="btn btn-ghost" id="resetBtn">Reset</button>
            </div>

            <div class="row between" style="padding:14px 0">
              <div>
                <div class="label" style="font-weight:600">Delete account</div>
                <div class="desc muted" style="font-size:12.5px">Permanently remove your account from this device.</div>
              </div>
              <button class="btn btn-danger" id="deleteBtn">Delete account</button>
            </div>
          </section>
        </div>
      </div>
    `;

    // Settings nav scroll-to
    document.querySelectorAll(".settings-nav-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".settings-nav-link")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const t = document.getElementById(btn.dataset.target);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Theme switch
    document.querySelectorAll(".theme-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        document
          .querySelectorAll(".theme-option")
          .forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
        this.save({ theme: opt.dataset.theme });
        UI.toast(`Switched to ${opt.dataset.theme} theme`, "info", 1500);
      });
    });

    // Toggles
    document.querySelectorAll("[data-toggle]").forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.dataset.toggle;
        const cur = this.load();
        const next = !cur[key];
        this.save({ [key]: next });
        el.classList.toggle("on", next);
      });
    });

    // Save account
    document.getElementById("saveAccountBtn").addEventListener("click", () => {
      const name = document.getElementById("acctName").value.trim();
      if (!name) return UI.toast("Name can't be empty", "error");
      Auth.updateProfile({ name });
      UI.toast("Account updated", "success");
    });

    // Reset progress
    document.getElementById("resetBtn").addEventListener("click", async () => {
      const ok = await UI.modal({
        title: "Reset all progress?",
        body: "Your quests, XP, badges and streak will be cleared. Your account stays.",
        confirmText: "Reset",
        danger: true,
      });
      if (!ok) return;
      Store.remove_from(
        STORE_KEYS.COMPLETIONS,
        (c) => c.userId === me.id
      );
      Auth.updateProfile({ xp: 0, badges: [], streak: 0 });
      UI.toast("Progress reset.", "info");
      this.render();
    });

    // Delete account
    document.getElementById("deleteBtn").addEventListener("click", async () => {
      const ok = await UI.modal({
        title: "Delete account?",
        body: "This removes your user record, completions and posts from this device. Cannot be undone.",
        confirmText: "Delete",
        danger: true,
      });
      if (!ok) return;
      Store.remove_from(STORE_KEYS.USERS, (u) => u.id === me.id);
      Store.remove_from(STORE_KEYS.COMPLETIONS, (c) => c.userId === me.id);
      Store.remove_from(STORE_KEYS.POSTS, (p) => p.authorId === me.id);
      Auth.logout();
    });
  },

  toggleRow(key, label, desc, s) {
    return `
      <div class="row-toggle">
        <div>
          <div class="label">${label}</div>
          <div class="desc">${desc}</div>
        </div>
        <button class="switch ${s[key] ? "on" : ""}" data-toggle="${key}" aria-label="${label}"></button>
      </div>`;
  },
};

document.addEventListener("DOMContentLoaded", () => Settings.render());
