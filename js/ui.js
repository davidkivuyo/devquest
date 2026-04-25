/* ============================================
   ui.js — shared UI helpers.
   Toasts, modals, sidebar/topbar mounting,
   theme handling, avatar helpers.
   ============================================ */

const UI = {
  /* ---------- TOAST ---------- */
  toast(message, type = "info", timeout = 2800) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    const icon = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info",
    }[type] || "fa-circle-info";
    el.innerHTML = `<i class="fa-solid ${icon} text-${
      type === "info" ? "accent" : type
    }"></i><span>${message}</span>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      el.style.transition = "all .25s ease";
      setTimeout(() => el.remove(), 280);
    }, timeout);
  },

  /* ---------- MODAL ---------- */
  modal({ title, body, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
    return new Promise((resolve) => {
      const back = document.createElement("div");
      back.className = "modal-backdrop";
      back.innerHTML = `
        <div class="modal" role="dialog">
          <h3 class="modal-title">${title}</h3>
          <p class="modal-sub">${body}</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" data-act="cancel">${cancelText}</button>
            <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="ok">${confirmText}</button>
          </div>
        </div>`;
      document.body.appendChild(back);
      back.addEventListener("click", (e) => {
        if (e.target === back || e.target.dataset.act === "cancel") {
          back.remove();
          resolve(false);
        }
        if (e.target.dataset.act === "ok") {
          back.remove();
          resolve(true);
        }
      });
    });
  },

  /* ---------- AVATAR COLORS ---------- */
  avatarColors: [
    "#7c5cff", "#22d3ee", "#f472b6", "#22c55e", "#f59e0b",
    "#ef4444", "#38bdf8", "#a78bfa", "#fb7185", "#34d399",
  ],

  pickColorFor(name = "") {
    const i =
      name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
      this.avatarColors.length;
    return this.avatarColors[i];
  },

  initials(name = "?") {
    return name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  },

  avatarHTML(user, size = "") {
    const color = user.color || this.pickColorFor(user.name);
    return `<div class="avatar ${size}" style="background:linear-gradient(135deg, ${color}, ${color}aa)">${this.initials(
      user.name
    )}</div>`;
  },

  /* ---------- THEME ---------- */
  applyTheme() {
    const settings = Store.get(STORE_KEYS.SETTINGS, { theme: "dark" });
    document.documentElement.setAttribute("data-theme", settings.theme || "dark");
  },

  toggleTheme() {
    const settings = Store.get(STORE_KEYS.SETTINGS, { theme: "dark" });
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    Store.set(STORE_KEYS.SETTINGS, settings);
    this.applyTheme();
    return settings.theme;
  },

  /* ---------- LAYOUT MOUNT ---------- */
  navItems: [
    { href: "dashboard.html", icon: "fa-house", label: "Dashboard" },
    { href: "challenges.html", icon: "fa-code", label: "Challenges" },
    { href: "leaderboard.html", icon: "fa-ranking-star", label: "Leaderboard" },
    { href: "community.html", icon: "fa-users", label: "Community" },
    { href: "resources.html", icon: "fa-book-open", label: "Resources" },
    { href: "profile.html", icon: "fa-user", label: "Profile" },
    { href: "settings.html", icon: "fa-gear", label: "Settings" },
  ],

  mountLayout({ active, title, search = false }) {
    const user = Auth.requireUser();
    if (!user) return;

    const root = document.getElementById("app");
    if (!root) return;

    const xp = user.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const color = user.color || this.pickColorFor(user.name);

    const navHTML = this.navItems
      .map(
        (n) => `
        <a class="nav-link ${active === n.href ? "active" : ""}" href="${n.href}">
          <i class="fa-solid ${n.icon}"></i>
          <span>${n.label}</span>
        </a>`
      )
      .join("");

    root.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand-mark"><i class="fa-solid fa-dragon"></i></div>
          <div class="brand-name">Dev<span>Quest</span></div>
        </div>

        <div class="nav-section">Quest log</div>
        <nav class="nav">${navHTML}</nav>

        <div class="sidebar-footer">
          <div class="me-avatar" style="background:linear-gradient(135deg, ${color}, ${color}aa)">${this.initials(
      user.name
    )}</div>
          <div>
            <div class="me-name">${user.name}</div>
            <div class="me-rank">Lv ${level} · ${xp} XP</div>
          </div>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <button class="icon-btn" id="menuBtn" aria-label="Menu" style="display:none">
            <i class="fa-solid fa-bars"></i>
          </button>
          <h1>${title}</h1>
          ${
            search
              ? `<div class="topbar-search">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input id="globalSearch" placeholder="Search..." />
                </div>`
              : `<div class="spacer"></div>`
          }
          <div class="topbar-actions">
            <span class="xp-pill"><i class="fa-solid fa-bolt"></i> ${xp} XP</span>
            <button class="icon-btn" id="themeBtn" title="Toggle theme">
              <i class="fa-solid fa-moon"></i>
            </button>
            <button class="icon-btn" id="logoutBtn" title="Logout">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>
        <section class="content" id="content"></section>
      </main>
    `;

    document.getElementById("themeBtn").addEventListener("click", () => {
      const t = this.toggleTheme();
      this.toast(`Switched to ${t} theme`, "info", 1500);
    });
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      const ok = await this.modal({
        title: "Log out?",
        body: "You'll need to sign back in to continue your quest.",
        confirmText: "Log out",
      });
      if (ok) {
        Auth.logout();
      }
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    if (window.innerWidth <= 980 && menuBtn) {
      menuBtn.style.display = "grid";
      menuBtn.addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
      });
    }
  },

  /* ---------- DOM HELPERS ---------- */
  el(tag, className = "", html = "") {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html) e.innerHTML = html;
    return e;
  },

  formatDate(ts) {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return d.toLocaleDateString();
  },

  rankFromXp(xp) {
    if (xp >= 2000) return { name: "Grandmaster", color: "#fbbf24" };
    if (xp >= 1000) return { name: "Master", color: "#a78bfa" };
    if (xp >= 500) return { name: "Adept", color: "#22d3ee" };
    if (xp >= 200) return { name: "Apprentice", color: "#34d399" };
    return { name: "Novice", color: "#94a3b8" };
  },
};

window.UI = UI;
