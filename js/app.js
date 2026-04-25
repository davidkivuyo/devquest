/* ============================================
   app.js — small page-loader / route helpers.

   Each page (dashboard.html, challenges.html...)
   currently mounts its own renderer. This file
   exists for one purpose: to give you a place
   to grow into a tiny SPA later.

   TIER: STRETCH — turn this app into a real SPA:
   1. Make index.html the only HTML file shipped.
   2. Use the History API (history.pushState) to
      navigate between pages without reload.
   3. Render the current page by inspecting
      location.pathname (e.g. '/challenges').
   4. Intercept anchor clicks on .nav-link and
      handle them with pushState instead.

   Skeleton you can fill in:
*/

const App = {
  routes: {
    "/dashboard": () =>
      typeof renderDashboard === "function" ? renderDashboard() : null,
    "/challenges": () =>
      typeof ChallengeView !== "undefined" ? ChallengeView.render() : null,
    "/leaderboard": () =>
      typeof LB !== "undefined" ? LB.render() : null,
    "/profile": () =>
      typeof Profile !== "undefined" ? Profile.render() : null,
    "/community": () => (typeof Feed !== "undefined" ? Feed.render() : null),
    "/resources": () =>
      typeof Resources !== "undefined" ? Resources.render() : null,
    "/settings": () =>
      typeof Settings !== "undefined" ? Settings.render() : null,
  },

  navigate(path) {
    history.pushState({}, "", path);
    this.handle();
  },

  handle() {
    // TODO (STRETCH): match window.location.pathname
    // against this.routes and call the matching fn.
  },
};

window.App = App;
