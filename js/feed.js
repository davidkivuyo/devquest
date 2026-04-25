/* ============================================
   feed.js — TIER: GUIDED + INCOMPLETE
   Community page logic.
   ============================================ */

const Feed = {
  render() {
    const me = Auth.requireUser();
    if (!me) return;
    UI.mountLayout({ active: "community.html", title: "Community" });

    const root = document.getElementById("content");
    const users = Store.list(STORE_KEYS.USERS);
    const userById = (id) => users.find((u) => u.id === id);

    root.innerHTML = `
      <div class="page-head">
        <div>
          <h2>Community feed</h2>
          <p>Share progress, ask for help, cheer each other on.</p>
        </div>
      </div>

      <div class="feed-shell">
        <div>
          <!-- COMPOSER -->
          <div class="composer">
            <div class="row-top">
              ${UI.avatarHTML(me)}
              <textarea id="composeText" placeholder="What did you build today, ${
                me.name.split(" ")[0]
              }?"></textarea>
            </div>
            <div class="row-bot">
              <div class="composer-tip">
                Pro tip: prefix tags with <code>#</code> — they'll auto-extract.
                <!-- TIER: STRETCH — make @mentions work -->
              </div>
              <button class="btn btn-primary" id="postBtn">
                <i class="fa-solid fa-paper-plane"></i> Post
              </button>
            </div>
          </div>

          <div class="feed-list" id="feedList"></div>
        </div>

        <aside class="feed-side">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Who's online</div>
              <div class="card-sub">Active today</div>
            </div>
            ${users
              .filter((u) => u.lastActive === new Date().toISOString().slice(0, 10))
              .slice(0, 6)
              .map(
                (u) => `
              <div class="who-card">
                ${UI.avatarHTML(u, "sm")}
                <div class="info">
                  <div class="name">${u.name}${
                  u.id === me.id ? '  <span class="text-accent">(you)</span>' : ""
                }</div>
                  <div class="sub">${UI.rankFromXp(u.xp || 0).name}</div>
                </div>
                <span class="streak-pill" style="font-size:11px; color:var(--text-mute)">
                  <i class="fa-solid fa-fire" style="color:#f87171"></i> ${u.streak || 0}d
                </span>
              </div>`
              )
              .join("")}
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Trending tags</div>
            </div>
            <div class="post-tags" id="trendingTags"></div>
          </div>
        </aside>
      </div>
    `;

    this.paintFeed(me, userById);
    this.paintTrending();

    document.getElementById("postBtn").addEventListener("click", () => {
      const ta = document.getElementById("composeText");
      const text = ta.value.trim();
      if (!text) return;
      const tags = (text.match(/#[a-zA-Z0-9_]+/g) || []).map((t) => t.toLowerCase());
      const post = {
        id: Store.uid("p"),
        authorId: me.id,
        content: text,
        tags,
        likes: [],
        replies: [],
        at: Date.now(),
      };
      const all = Store.list(STORE_KEYS.POSTS);
      all.unshift(post);
      Store.set(STORE_KEYS.POSTS, all);
      Store.logActivity(me.id, "Posted in community");
      ta.value = "";
      this.paintFeed(me, userById);
      this.paintTrending();
      UI.toast("Posted!", "success");
    });
  },

  paintFeed(me, userById) {
    const list = document.getElementById("feedList");
    if (!list) return;
    const posts = Store.list(STORE_KEYS.POSTS).sort((a, b) => b.at - a.at);

    if (!posts.length) {
      list.innerHTML = `<div class="muted center" style="padding:40px">No posts yet — be the first.</div>`;
      return;
    }

    list.innerHTML = posts
      .map((p) => {
        const author = userById(p.authorId) || { name: "Unknown", color: "#666" };
        const liked = p.likes.includes(me.id);
        return `
        <article class="post" data-id="${p.id}">
          <header class="post-head">
            ${UI.avatarHTML(author, "sm")}
            <div>
              <div class="name">${author.name}</div>
              <div class="when">${UI.formatDate(p.at)} · ${UI.rankFromXp(author.xp || 0).name}</div>
            </div>
          </header>

          <p class="post-content">${this.formatPost(p.content)}</p>

          ${
            p.tags && p.tags.length
              ? `<div class="post-tags">${p.tags
                  .map((t) => `<span class="post-tag">${t}</span>`)
                  .join("")}</div>`
              : ""
          }

          <div class="post-actions">
            <button class="post-action ${liked ? "liked" : ""}" data-act="like">
              <i class="fa-${liked ? "solid" : "regular"} fa-heart"></i>
              ${p.likes.length}
            </button>
            <button class="post-action" data-act="reply">
              <i class="fa-regular fa-comment"></i> ${p.replies.length}
            </button>
            ${
              p.authorId === me.id
                ? `<button class="post-action" data-act="delete" title="Delete post">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>`
                : ""
            }
          </div>

          ${this.repliesHTML(p, userById)}

          <div class="reply-form" data-form>
            <input placeholder="Write a reply..." />
            <button class="btn btn-ghost btn-sm">Send</button>
          </div>
        </article>`;
      })
      .join("");

    list.querySelectorAll(".post").forEach((el) => {
      const id = el.dataset.id;
      el.querySelector('[data-act="like"]')?.addEventListener("click", () => {
        const post = Store.list(STORE_KEYS.POSTS).find((x) => x.id === id);
        if (!post) return;
        const idx = post.likes.indexOf(me.id);
        if (idx >= 0) post.likes.splice(idx, 1);
        else post.likes.push(me.id);
        Store.update(STORE_KEYS.POSTS, (p) => p.id === id, { likes: post.likes });
        this.paintFeed(me, userById);
      });

      el.querySelector('[data-act="delete"]')?.addEventListener("click", async () => {
        const ok = await UI.modal({
          title: "Delete post?",
          body: "This cannot be undone.",
          confirmText: "Delete",
          danger: true,
        });
        if (!ok) return;
        Store.remove_from(STORE_KEYS.POSTS, (p) => p.id === id);
        UI.toast("Post deleted", "info");
        this.paintFeed(me, userById);
        this.paintTrending();
      });

      const form = el.querySelector("[data-form]");
      el.querySelector('[data-act="reply"]')?.addEventListener("click", () => {
        form.style.display = form.style.display === "flex" ? "none" : "flex";
        form.querySelector("input")?.focus();
      });
      form.querySelector("button").addEventListener("click", () => {
        const inp = form.querySelector("input");
        const text = inp.value.trim();
        if (!text) return;
        const post = Store.list(STORE_KEYS.POSTS).find((x) => x.id === id);
        post.replies.push({
          id: Store.uid("r"),
          authorId: me.id,
          content: text,
          at: Date.now(),
        });
        Store.update(STORE_KEYS.POSTS, (p) => p.id === id, {
          replies: post.replies,
        });
        inp.value = "";
        this.paintFeed(me, userById);
      });
    });
  },

  repliesHTML(post, userById) {
    if (!post.replies.length) return "";
    return `<div class="replies">
      ${post.replies
        .map((r) => {
          const a = userById(r.authorId) || { name: "Unknown" };
          return `
          <div class="reply">
            ${UI.avatarHTML(a, "sm")}
            <div class="reply-content">
              <span class="name">${a.name}</span>
              <span class="when">${UI.formatDate(r.at)}</span>
              <div>${r.content}</div>
            </div>
          </div>`;
        })
        .join("")}
    </div>`;
  },

  formatPost(text) {
    // turn URLs and #tags into nice markup
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/(#[a-zA-Z0-9_]+)/g, '<span style="color:var(--accent); font-weight:600">$1</span>')
      .replace(/\n/g, "<br>");
  },

  paintTrending() {
    const wrap = document.getElementById("trendingTags");
    if (!wrap) return;
    const counts = {};
    Store.list(STORE_KEYS.POSTS).forEach((p) =>
      (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1))
    );
    const ranked = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    wrap.innerHTML = ranked.length
      ? ranked
          .map(
            ([t, n]) =>
              `<span class="post-tag">${t} <span class="muted">${n}</span></span>`
          )
          .join("")
      : `<span class="muted">No tags yet.</span>`;
  },
};

document.addEventListener("DOMContentLoaded", () => Feed.render());
