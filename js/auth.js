/* ============================================
   auth.js — login / register / session.

   TIER: GUIDED
   This file is fully working. Read it through
   so you understand how the rest of the app
   identifies "the current user".

   CHALLENGE: passwords are stored in plaintext
   inside localStorage. That's fine for a demo,
   but try implementing a proper hash (e.g.
   crypto.subtle.digest('SHA-256', ...)) and
   comparing hashes instead.
   ============================================ */

const Auth = {
  /* Returns the current logged-in user, or null. */
  current() {
    return Store.session();
  },

  /* Use on protected pages. Redirects to login if not signed in. */
  requireUser() {
    const u = this.current();
    if (!u) {
      // Allow the auth page itself to call this safely
      if (!location.pathname.endsWith("index.html") && location.pathname !== "/") {
        window.location.href = "../index.html";
      }
      return null;
    }
    // Refresh: pull latest user record from store in case profile changed
    const fresh = Store.list(STORE_KEYS.USERS).find((x) => x.id === u.id);
    if (fresh) {
      Store.setSession(fresh);
      return fresh;
    }
    return u;
  },

  register({ name, email, password }) {
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();

    if (!name || name.length < 2) throw new Error("Name must be at least 2 characters.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      throw new Error("Please enter a valid email address.");
    if (!password || password.length < 6)
      throw new Error("Password must be at least 6 characters.");

    const users = Store.list(STORE_KEYS.USERS);
    if (users.some((u) => u.email === email))
      throw new Error("An account with that email already exists.");

    const user = {
      id: Store.uid("u"),
      name,
      email,
      password, // CHALLENGE: hash this
      bio: "",
      color: UI.pickColorFor(name),
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString().slice(0, 10),
      badges: [],
      socials: {},
      createdAt: Date.now(),
    };

    Store.push(STORE_KEYS.USERS, user);
    Store.setSession(user);
    Store.logActivity(user.id, "Joined DevQuest");
    return user;
  },

  login({ email, password }) {
    email = (email || "").trim().toLowerCase();
    const users = Store.list(STORE_KEYS.USERS);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password.");

    // streak handling
    const today = new Date().toISOString().slice(0, 10);
    const last = user.lastActive;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    if (last !== today) {
      user.streak = last === yesterday ? (user.streak || 0) + 1 : 1;
      user.lastActive = today;
      Store.update(STORE_KEYS.USERS, (u) => u.id === user.id, {
        streak: user.streak,
        lastActive: today,
      });
    }

    Store.setSession(user);
    Store.logActivity(user.id, "Signed in");
    return user;
  },

  logout() {
    Store.clearSession();
    window.location.href = location.pathname.endsWith("index.html")
      ? "index.html"
      : "../index.html";
  },

  updateProfile(patch) {
    const me = this.current();
    if (!me) return null;
    const updated = Store.update(STORE_KEYS.USERS, (u) => u.id === me.id, patch);
    if (updated) Store.setSession(updated);
    return updated;
  },

  /* TIER: STRETCH — implement password hashing and replace
     the plaintext storage above. Hint:
       const buf = new TextEncoder().encode(password);
       const hashBuf = await crypto.subtle.digest('SHA-256', buf);
       return Array.from(new Uint8Array(hashBuf))
         .map(b => b.toString(16).padStart(2,'0')).join('');
  */
};

/* ---------- PASSWORD STRENGTH (used on register) ----------
   TIER: GUIDED — works out of the box.
   CHALLENGE: improve this scorer:
     - penalize repeated chars / common passwords
     - reward special characters more meaningfully
*/
function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

window.Auth = Auth;
window.scorePassword = scorePassword;
