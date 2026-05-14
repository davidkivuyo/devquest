/* ============================================
   storage.js — localStorage wrapper.
   This is the layer you'll later swap with
   real fetch() calls to a backend.

   TIER: GUIDED — read this carefully so you
   understand the data model before working
   on other tiers.
   ============================================ */

const KEYS = {
  USERS: "devquest:users",
  SESSION: "devquest:session",
  CHALLENGES: "devquest:challenges",
  COMPLETIONS: "devquest:completions",
  POSTS: "devquest:posts",
  RESOURCES: "devquest:resources",
  BOOKMARKS: "devquest:bookmarks",
  SETTINGS: "devquest:settings",
  ACTIVITY: "devquest:activity",
  SEEDED: "devquest:seeded",
};

const Store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("Store.get failed", key, e);
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  /* ---- collections ---- */
  list(key) {
    return this.get(key, []);
  },

  push(key, item) {
    const arr = this.list(key);
    arr.push(item);
    this.set(key, arr);
    return item;
  },

  update(key, predicate, patch) {
    const arr = this.list(key);
    const idx = arr.findIndex(predicate);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch };
    this.set(key, arr);
    return arr[idx];
  },

  remove_from(key, predicate) {
    const arr = this.list(key).filter((x) => !predicate(x));
    this.set(key, arr);
    return arr;
  },

  /* ---- session ---- */
  session() {
    return this.get(KEYS.SESSION, null);
  },

  setSession(user) {
    this.set(KEYS.SESSION, user);
  },

  clearSession() {
    this.remove(KEYS.SESSION);
  },

  /* ---- seed once ---- */
  ensureSeeded() {
    if (this.get(KEYS.SEEDED)) return;
    if (typeof SEED === "undefined") return;

    if (!this.list(KEYS.USERS).length) this.set(KEYS.USERS, SEED.users);
    if (!this.list(KEYS.CHALLENGES).length)
      this.set(KEYS.CHALLENGES, SEED.challenges);
    if (!this.list(KEYS.POSTS).length) this.set(KEYS.POSTS, SEED.posts);
    if (!this.list(KEYS.RESOURCES).length)
      this.set(KEYS.RESOURCES, SEED.resources);

    this.set(KEYS.SEEDED, true);
  },

  /* ---- helpers ---- */
  uid(prefix = "id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  },

  // Activity log per-user; stores YYYY-MM-DD strings counted per day.
  logActivity(userId, action) {
    const log = this.get(KEYS.ACTIVITY, {});
    if (!log[userId]) log[userId] = { actions: [], heatmap: {} };
    const today = new Date().toISOString().slice(0, 10);
    log[userId].actions.unshift({ action, at: Date.now() });
    log[userId].actions = log[userId].actions.slice(0, 50);
    log[userId].heatmap[today] = (log[userId].heatmap[today] || 0) + 1;
    this.set(KEYS.ACTIVITY, log);
  },

  activityFor(userId) {
    const log = this.get(KEYS.ACTIVITY, {});
    return log[userId] || { actions: [], heatmap: {} };
  },
};

window.Store = Store;
window.STORE_KEYS = KEYS;
