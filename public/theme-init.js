/**
 * Runs render-blocking in <head>, before first paint.
 *
 * Two jobs:
 *  1. Resolve the theme so the page never flashes the wrong palette.
 *  2. Add `js`, which gates the scroll-reveal styles — without it, a blocked
 *     or failed script would leave sections stuck at opacity 0.
 *
 * Kept as a separate file (not inline) so the Content-Security-Policy in
 * netlify.toml can use script-src 'self' with no 'unsafe-inline'.
 */
(function () {
  var el = document.documentElement;
  el.classList.add("js");

  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      el.dataset.theme = stored;
      return;
    }
    el.dataset.theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch (e) {
    el.dataset.theme = "dark";
  }
})();
