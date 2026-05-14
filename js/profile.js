/* ============================================
   profile.js — TIER: GUIDED + INCOMPLETE
   ============================================ */

const Profile = {
  editing: false,

  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "profile.html", title: "Profile" });

    const root = document.getElementById("content");
    const completions = Store.list(STORE_KEYS.COMPLETIONS).filter(
      (c) => c.userId === me.id
    );
    const xp = me.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const xpInLevel = xp % 100;
    const rank = UI.rankFromXp(xp);
    const color = me.color || UI.pickColorFor(me.name);
    const activity = Store.activityFor(me.id);

    const allBadgeIds = Awards.rules.map((r) => r.id);
    const earned = new Set(me.badges || []);

    root.innerHTML = `
      <div class="profile-hero">
        <div class="avatar lg" id="avatarPreview"
             style="background:linear-gradient(135deg, ${color}, ${color}aa)">
          ${UI.initials(me.name)}
        </div>
        <div class="profile-meta">
          <div class="row" style="gap:10px; align-items:center; margin-bottom:4px">
            <h2 id="displayName">${me.name}</h2>
            <span class="tag" style="color:${rank.color}; border-color:${rank.color}55; background:${rank.color}1a">
              <i class="fa-solid fa-shield-halved"></i> ${rank.name}
            </span>
          </div>
          <p class="bio" id="bioText">${me.bio || "No bio yet."}</p>
          <div class="joined">
            <i class="fa-regular fa-calendar"></i>
            Joined ${new Date(me.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </div>
          <div class="socials-row mt-2">
            ${this.socialsHTML(me.socials || {})}
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary" id="editBtn">
            <i class="fa-solid fa-pen"></i> Edit profile
          </button>
          <button class="btn btn-ghost" id="shareBtn" title="Copy profile link">
            <i class="fa-solid fa-link"></i> Share
          </button>
        </div>
      </div>

      <div class="profile-grid mb-3">
        <!-- LEVEL -->
        <div class="level-pane">
          <div class="lv-num">${level}</div>
          <div class="lv-label">${rank.name} · ${xp.toLocaleString()} XP total</div>
          <div class="next-target">
            <span>Progress to Lv ${level + 1}</span>
            <span>${xpInLevel}/100 XP</span>
          </div>
          <div class="progress"><span style="width:${xpInLevel}%"></span></div>

          <div class="row" style="gap:18px; margin-top:18px">
            <div>
              <div class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.6px">Quests</div>
              <div style="font-size:22px; font-weight:800">${completions.length}</div>
            </div>
            <div>
              <div class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.6px">Streak</div>
              <div style="font-size:22px; font-weight:800; color:#f87171">${me.streak || 0}d</div>
            </div>
            <div>
              <div class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.6px">Badges</div>
              <div style="font-size:22px; font-weight:800; color:var(--gold)">${earned.size}</div>
            </div>
          </div>
        </div>

        <!-- BADGES -->
        <div class="card" style="padding:22px">
          <div class="card-header">
            <div class="card-title">Badges</div>
            <div class="card-sub">${earned.size} / ${allBadgeIds.length}</div>
          </div>
          <div class="badges-grid">
            ${allBadgeIds
              .map((id) => {
                const meta = Awards.meta(id);
                const has = earned.has(id);
                return `
                <div class="badge ${has ? "" : "locked"}" title="${meta.name}">
                  <div class="icon"><i class="fa-solid ${meta.icon}"></i></div>
                  <div class="name">${meta.name}</div>
                </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>

      <!-- HEATMAP -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Activity (last year)</div>
            <div class="card-sub">${
              Object.values(activity.heatmap).reduce((a, b) => a + b, 0)
            } actions in the last 365 days</div>
          </div>
        </div>
        ${this.heatmapHTML(activity.heatmap)}
        <div class="heatmap-legend">
          Less
          <span class="cell"></span>
          <span class="cell l1"></span>
          <span class="cell l2"></span>
          <span class="cell l3"></span>
          <span class="cell l4"></span>
          More
        </div>
      </div>
    `;

    document.getElementById("editBtn").addEventListener("click", () =>
      this.openEditModal(me)
    );
    document.getElementById("shareBtn").addEventListener("click", () => {
      // TIER: STRETCH — make this a real shareable URL with route
      const url = `${location.origin}${location.pathname}?u=${encodeURIComponent(
        me.email
      )}`;
      navigator.clipboard
        .writeText(url)
        .then(() => UI.toast("Profile link copied!", "success"))
        .catch(() => UI.toast("Couldn't copy — your browser blocked it.", "error"));
    });
  },

  socialsHTML(socials) {
    const map = {
      github: { icon: "fa-brands fa-github", base: "https://github.com/" },
      twitter: { icon: "fa-brands fa-x-twitter", base: "https://x.com/" },
      website: { icon: "fa-solid fa-globe", base: "" },
    };
    const keys = Object.keys(socials).filter((k) => socials[k]);
    if (!keys.length)
      return `<span class="muted" style="font-size:12px">No social links yet — add some via Edit profile.</span>`;
    return keys
      .map((k) => {
        const meta = map[k] || { icon: "fa-solid fa-link", base: "" };
        const handle = socials[k];
        const href = meta.base ? meta.base + handle.replace(/^@/, "") : handle;
        return `<a class="social-link" href="${href}" target="_blank" rel="noopener">
          <i class="${meta.icon}"></i> ${handle}
        </a>`;
      })
      .join("");
  },

  heatmapHTML(map) {
    // 53 weeks x 7 days
    const days = 365;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cells = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const v = map[key] || 0;
      let lvl = 0;
      if (v >= 5) lvl = 4;
      else if (v >= 3) lvl = 3;
      else if (v >= 2) lvl = 2;
      else if (v >= 1) lvl = 1;
      cells.push({ key, v, lvl });
    }
    return `<div class="heatmap">${cells
      .map(
        (c) =>
          `<div class="cell ${
            c.lvl ? "l" + c.lvl : ""
          }" title="${c.key} · ${c.v} actions"></div>`
      )
      .join("")}</div>`;
  },

  openEditModal(me) {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `
      <div class="modal" style="width:min(560px, 92vw)">
        <h3 class="modal-title">Edit profile</h3>
        <p class="modal-sub">Make it yours.</p>

        <div class="field">
          <label>Display name</label>
          <input class="input" id="editName" value="${me.name.replace(/"/g, "&quot;")}" />
        </div>

        <div class="field">
          <label>Bio</label>
          <textarea class="textarea" id="editBio" placeholder="Tell people what you're into.">${me.bio || ""}</textarea>
        </div>

        <div class="field">
          <label>Avatar color</label>
          <div class="color-picker" id="colorPicker">
            ${UI.avatarColors
              .map(
                (c) =>
                  `<div class="color-swatch ${
                    c === me.color ? "selected" : ""
                  }" data-color="${c}" style="background:${c}"></div>`
              )
              .join("")}
          </div>
        </div>

        <div class="field">
          <label>GitHub username</label>
          <input class="input" id="editGithub" value="${(me.socials?.github) || ""}" placeholder="yourhandle" />
        </div>
        <div class="field">
          <label>Twitter / X handle</label>
          <input class="input" id="editTwitter" value="${(me.socials?.twitter) || ""}" placeholder="yourhandle" />
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">Cancel</button>
          <button class="btn btn-primary" data-act="save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(back);

    let pickedColor = me.color;
    back.querySelector("#colorPicker").addEventListener("click", (e) => {
      const sw = e.target.closest(".color-swatch");
      if (!sw) return;
      back.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("selected"));
      sw.classList.add("selected");
      pickedColor = sw.dataset.color;
    });

    back.addEventListener("click", (e) => {
      if (e.target === back || e.target.dataset.act === "cancel") {
        back.remove();
      }
      if (e.target.dataset.act === "save") {
        const name = back.querySelector("#editName").value.trim();
        const bio = back.querySelector("#editBio").value.trim();
        const github = back.querySelector("#editGithub").value.trim();
        const twitter = back.querySelector("#editTwitter").value.trim();
        if (!name) {
          UI.toast("Name can't be empty", "error");
          return;
        }
        Auth.updateProfile({
          name,
          bio,
          color: pickedColor,
          socials: { github, twitter },
        });
        Store.logActivity(me.id, "Updated profile");
        back.remove();
        UI.toast("Profile saved", "success");
        this.render();
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => Profile.render());
