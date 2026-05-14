/* ============================================
   resources.js — TIER: GUIDED + INCOMPLETE
   ============================================ */

const Resources = {
  state: { topic: "all", query: "", showOnlyBookmarked: false },

  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "resources.html", title: "Resources" });

    const root = document.getElementById("content");
    const items = Store.list(STORE_KEYS.RESOURCES);
    const topics = ["all", ...new Set(items.map((i) => i.topic))];

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2>Resource library</h2>
          <p>Hand-picked links to keep you learning. Bookmark the good ones.</p>
        </div>
        <button class="btn btn-primary" id="addResBtn">
          <i class="fa-solid fa-plus"></i> Submit a resource
        </button>
      </div>

      <div class="res-toolbar">
        <div class="search-wrap" style="flex:1; min-width:220px">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input id="resSearch" placeholder="Search the library..." />
        </div>
        <div class="topic-chips" id="topicChips">
          ${topics
            .map(
              (t) =>
                `<button class="topic-chip ${
                  t === "all" ? "active" : ""
                }" data-t="${t}">${t === "all" ? "All" : t}</button>`
            )
            .join("")}
        </div>
        <button class="btn btn-ghost" id="bookmarkedToggle">
          <i class="fa-regular fa-bookmark"></i> Bookmarked
        </button>
      </div>

      <div class="res-grid" id="resGrid"></div>
    `;

    this.paint(me);

    document.getElementById("resSearch").addEventListener("input", (e) => {
      this.state.query = e.target.value.toLowerCase();
      this.paint(me);
    });

    document.getElementById("topicChips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-t]");
      if (!btn) return;
      document
        .querySelectorAll("#topicChips .topic-chip")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      this.state.topic = btn.dataset.t;
      this.paint(me);
    });

    document.getElementById("bookmarkedToggle").addEventListener("click", (e) => {
      this.state.showOnlyBookmarked = !this.state.showOnlyBookmarked;
      e.currentTarget.classList.toggle("btn-primary", this.state.showOnlyBookmarked);
      e.currentTarget.classList.toggle("btn-ghost", !this.state.showOnlyBookmarked);
      e.currentTarget.querySelector("i").className = this.state.showOnlyBookmarked
        ? "fa-solid fa-bookmark"
        : "fa-regular fa-bookmark";
      this.paint(me);
    });

    document.getElementById("addResBtn").addEventListener("click", () =>
      this.openSubmitModal(me)
    );
  },

  paint(me) {
    const grid = document.getElementById("resGrid");
    if (!grid) return;
    let items = Store.list(STORE_KEYS.RESOURCES);
    const bookmarks = new Set(
      Store.get(STORE_KEYS.BOOKMARKS, {})[me.id] || []
    );

    if (this.state.topic !== "all")
      items = items.filter((i) => i.topic === this.state.topic);
    if (this.state.query) {
      const q = this.state.query;
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.topic.toLowerCase().includes(q)
      );
    }
    if (this.state.showOnlyBookmarked) {
      items = items.filter((i) => bookmarks.has(i.id));
    }

    if (!items.length) {
      grid.innerHTML = `<div class="muted center" style="grid-column:1/-1; padding:40px">No resources match.</div>`;
      return;
    }

    grid.innerHTML = items
      .map(
        (i) => `
        <div class="res-card">
          <span class="res-topic"><i class="fa-solid fa-folder-tree"></i> ${i.topic}</span>
          <h3>${i.title}</h3>
          <p>${i.description}</p>
          <div class="res-foot">
            <a class="res-link" href="${i.url}" target="_blank" rel="noopener">
              Visit <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button class="bookmark-btn ${bookmarks.has(i.id) ? "on" : ""}" data-id="${i.id}" title="Bookmark">
              <i class="fa-${bookmarks.has(i.id) ? "solid" : "regular"} fa-bookmark"></i>
            </button>
          </div>
        </div>`
      )
      .join("");

    grid.querySelectorAll(".bookmark-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        const all = Store.get(STORE_KEYS.BOOKMARKS, {});
        const list = new Set(all[me.id] || []);
        if (list.has(id)) list.delete(id);
        else list.add(id);
        all[me.id] = [...list];
        Store.set(STORE_KEYS.BOOKMARKS, all);
        this.paint(me);
      });
    });
  },

  openSubmitModal(me) {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `
      <div class="modal">
        <h3 class="modal-title">Submit a resource</h3>
        <p class="modal-sub">
          Share something that helped you. It'll show up for everyone right away.
          <br><strong>TIER: STRETCH</strong> — wire this submission up to a moderation queue.
        </p>
        <div class="field">
          <label>Title</label>
          <input class="input" id="resTitle" placeholder="e.g. MDN — Promises Guide" />
        </div>
        <div class="field">
          <label>URL</label>
          <input class="input" id="resUrl" placeholder="https://..." />
        </div>
        <div class="field">
          <label>Topic</label>
          <input class="input" id="resTopic" placeholder="e.g. JavaScript" />
        </div>
        <div class="field">
          <label>One-line description</label>
          <textarea class="textarea" id="resDesc" placeholder="Why should others read this?"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">Cancel</button>
          <button class="btn btn-primary" data-act="ok">Submit</button>
        </div>
      </div>
    `;
    document.body.appendChild(back);
    back.addEventListener("click", (e) => {
      if (e.target === back || e.target.dataset.act === "cancel") {
        back.remove();
      }
      if (e.target.dataset.act === "ok") {
        const title = back.querySelector("#resTitle").value.trim();
        const url = back.querySelector("#resUrl").value.trim();
        const topic = back.querySelector("#resTopic").value.trim() || "Other";
        const description = back.querySelector("#resDesc").value.trim();
        if (!title || !url) {
          UI.toast("Title and URL are required", "error");
          return;
        }
        Store.push(STORE_KEYS.RESOURCES, {
          id: Store.uid("res"),
          title,
          url,
          topic,
          description,
          addedBy: me.id,
        });
        Store.logActivity(me.id, `Shared a resource: ${title}`);
        UI.toast("Resource added — thanks!", "success");
        back.remove();
        this.render();
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => Resources.render());
