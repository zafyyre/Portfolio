/**
 * Zaaf's World — progressive enhancement.
 *
 * Every section renders as static HTML. Nothing here is required to read the
 * page; this file only adds theme switching, the mobile menu, scroll reveal
 * and nav highlighting on top of markup that already works without it.
 */

const root = document.documentElement;

/* ---------------------------------------------------------------
   Theme
   --------------------------------------------------------------- */

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }
}

// The inline script in <head> already resolved the initial theme; sync the
// button label to whatever it picked.
applyTheme(root.dataset.theme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The theme
    // still applies for this page view; it just will not persist.
  }
});

/* ---------------------------------------------------------------
   Mobile navigation
   --------------------------------------------------------------- */

const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");

function setNav(open) {
  if (!nav || !navToggle) return;
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle?.addEventListener("click", () => {
  setNav(!nav?.classList.contains("is-open"));
});

// Tapping a link should navigate and dismiss the menu.
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNav(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    setNav(false);
    navToggle?.focus();
  }
});

// Leaving the mobile breakpoint with the menu open would otherwise strand the
// open state on the desktop layout.
const desktopQuery = window.matchMedia("(min-width: 821px)");
desktopQuery.addEventListener("change", (event) => {
  if (event.matches) setNav(false);
});

/* ---------------------------------------------------------------
   Sticky header shadow
   --------------------------------------------------------------- */

const header = document.getElementById("site-header");

if (header) {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

/* ---------------------------------------------------------------
   Scroll reveal
   --------------------------------------------------------------- */

/*
 * Content starts hidden and JS reveals it, which buys the entrance animation
 * at the cost of one severe failure mode: if the reveal never runs, the page
 * is blank. That has now happened in production once, so the reveal does not
 * depend on any single mechanism.
 *
 * Primary: IntersectionObserver.
 * Backups, in order of independence: a rAF pass, passive scroll/resize, a
 * timer, and visibilitychange. Timers keep firing when rAF and observer
 * callbacks do not, so at least one path always lands.
 *
 * Every path funnels through revealInView(), which only reveals what is
 * actually on screen — so the backups guarantee visibility without flattening
 * the scroll animation for content further down.
 */

const revealables = Array.from(document.querySelectorAll(".reveal"));
const pending = new Set(revealables);
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let revealObserver = null;

function markRevealed(el) {
  el.classList.add("is-visible");
  pending.delete(el);
  revealObserver?.unobserve(el);
}

function revealAll() {
  Array.from(pending).forEach(markRevealed);
}

function revealInView() {
  if (!pending.size) return;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;
  // A zero reading means the page has no usable layout yet; a later pass runs.
  if (!viewportHeight) return;

  Array.from(pending).forEach((el) => {
    const box = el.getBoundingClientRect();
    if (box.top < viewportHeight * 0.94 && box.bottom > 0) markRevealed(el);
  });
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) markRevealed(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealables.forEach((el, index) => {
    // Stagger siblings slightly so groups cascade instead of snapping in.
    el.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    revealObserver.observe(el);
  });

  // Two rAFs: the first frame paints the hidden state, the second flips it,
  // so the entrance transitions instead of snapping.
  requestAnimationFrame(() => requestAnimationFrame(revealInView));

  // Scrolling is the backup that covers content below the fold if observer
  // callbacks never arrive. Coalesced to one check per frame.
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      revealInView();
      if (!pending.size) detachBackups();
    });
  };

  // Independent of both rAF and the observer — this is the path that still
  // works when the others are throttled or broken.
  const timer = setInterval(() => {
    revealInView();
    if (!pending.size) detachBackups();
  }, 700);

  function detachBackups() {
    clearInterval(timer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    document.removeEventListener("visibilitychange", onScroll);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onScroll);
}

/* ---------------------------------------------------------------
   Active section in nav
   --------------------------------------------------------------- */

const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const visible = new Set();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // With several sections on screen, highlight the topmost one.
      const current = sections.find((section) => visible.has(section.id));

      navLinks.forEach((link) => {
        const isActive =
          Boolean(current) && link.getAttribute("href") === `#${current.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------------------------------------------------------------
   Card depth tilt
   --------------------------------------------------------------- */

// Pure CSS transforms — no library, no cost when unused.
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const MAX_TILT = 5; // degrees; past ~6 it starts to feel gimmicky

  document.querySelectorAll(".project, .skill-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const box = card.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-py * MAX_TILT).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(px * MAX_TILT).toFixed(2)}deg`);
      },
      { passive: true }
    );

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

/* ---------------------------------------------------------------
   Hero 3D object (lazy, heavily guarded)
   --------------------------------------------------------------- */

function canRunWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (probe.getContext("webgl2") || probe.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const heroCanvas = document.getElementById("hero-canvas");

// Three.js is a large dependency, so it is fetched only when it will actually
// be used: motion is welcome, the GPU can render it, and the visitor is not on
// a metered/save-data connection. Otherwise the CSS backdrop stands on its own.
if (
  heroCanvas &&
  !prefersReducedMotion &&
  !navigator.connection?.saveData &&
  canRunWebGL()
) {
  const load = () => {
    import("./hero3d.js")
      .then(({ createHeroScene }) => {
        const scene = createHeroScene(heroCanvas);
        if (scene) heroCanvas.classList.add("is-live");
      })
      .catch(() => {
        // Chunk failed to load — the static hero is already on screen.
      });
  };

  // Defer past first paint so the 3D never competes with content rendering.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 2500 });
  } else {
    window.addEventListener("load", () => setTimeout(load, 400), {
      once: true,
    });
  }
}

/* ---------------------------------------------------------------
   Footer year
   --------------------------------------------------------------- */

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
