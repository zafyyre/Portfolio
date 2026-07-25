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

const revealables = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function revealAll() {
  revealables.forEach((el) => el.classList.add("is-visible"));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealables.forEach((el, index) => {
    // Stagger siblings slightly so groups cascade instead of snapping in.
    el.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    observer.observe(el);
  });

  // Anything already on screen is revealed from the first painted frame rather
  // than waiting on an observer callback. Without this, a delayed or dropped
  // delivery leaves the opening screen blank — the one failure here that a
  // visitor would read as a broken site. Below-fold elements still wait for
  // the observer, so the scroll effect is unchanged.
  // Two rAFs: the first frame paints the hidden state, the second flips it, so
  // the transition still runs instead of snapping.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // innerHeight can read 0 in embedded/headless contexts; fall back rather
      // than compare against a bogus zero and reveal nothing.
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 0;
      if (!viewportHeight) return;

      revealables.forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.top < viewportHeight && box.bottom > 0) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      });
    });
  });
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
