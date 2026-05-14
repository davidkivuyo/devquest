/* ============================================
   awards.js — badge definitions + checker.
   Used by challenges.js (to grant) and
   profile.js (to display).

   TIER: GUIDED — read it.
   CHALLENGE (Incomplete): add a 'night-owl'
   badge that requires completing a challenge
   between 22:00 and 04:00 local time.
   ============================================ */

const Awards = {
  rules: [
    {
      id: "first-blood",
      name: "First Blood",
      icon: "fa-droplet",
      check: (u, comps) => comps.length >= 1,
    },
    {
      id: "five-streak",
      name: "5-day streak",
      icon: "fa-fire",
      check: (u) => (u.streak || 0) >= 5,
    },
    {
      id: "ten-streak",
      name: "10-day streak",
      icon: "fa-fire-flame-curved",
      check: (u) => (u.streak || 0) >= 10,
    },
    {
      id: "twenty-streak",
      name: "20-day streak",
      icon: "fa-meteor",
      check: (u) => (u.streak || 0) >= 20,
    },
    {
      id: "thirty-streak",
      name: "30-day legend",
      icon: "fa-crown",
      check: (u) => (u.streak || 0) >= 30,
    },
    {
      id: "css-wizard",
      name: "CSS Wizard",
      icon: "fa-paintbrush",
      check: (u, comps, all) =>
        comps.filter((c) => {
          const ch = all.find((x) => x.id === c.challengeId);
          return ch && ch.topic === "CSS";
        }).length >= 2,
    },
    {
      id: "js-master",
      name: "JS Master",
      icon: "fa-jedi",
      check: (u, comps, all) =>
        comps.filter((c) => {
          const ch = all.find((x) => x.id === c.challengeId);
          return ch && ch.topic === "JavaScript";
        }).length >= 3,
    },
  ],

  checkAndAward(userId) {
    const user = Store.list(STORE_KEYS.USERS).find((u) => u.id === userId);
    if (!user) return;
    const comps = Store.list(STORE_KEYS.COMPLETIONS).filter(
      (c) => c.userId === userId
    );
    const all = Store.list(STORE_KEYS.CHALLENGES);
    const have = new Set(user.badges || []);
    let changed = false;
    this.rules.forEach((r) => {
      if (!have.has(r.id) && r.check(user, comps, all)) {
        have.add(r.id);
        changed = true;
        if (typeof UI !== "undefined") {
          UI.toast(`Badge earned: ${r.name}`, "success", 3500);
        }
      }
    });
    if (changed) Auth.updateProfile({ badges: [...have] });
  },

  meta(id) {
    return this.rules.find((r) => r.id === id) || { name: id, icon: "fa-medal" };
  },
};

window.Awards = Awards;
