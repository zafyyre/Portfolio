# Zaaf's World

Personal portfolio for **Zaafir Ali** — [zaafsworld.netlify.app](https://zaafsworld.netlify.app)

A static site in a monospace, spec-sheet style, built with Claude Code:
semantic HTML, CSS, and a small layer of vanilla JavaScript. Vite bundles,
Netlify hosts. three.js drives one ambient hero object and is the only
dependency.

## Stack

| Concern   | Choice                                                |
| --------- | ----------------------------------------------------- |
| Markup    | Static HTML — all content renders without JavaScript  |
| Styling   | Plain CSS with custom properties, dark + light themes  |
| Behaviour | Vanilla JS: theme toggle, mobile nav, nav highlighting |
| Build     | Vite                                                   |
| Hosting   | Netlify                                                |

No framework and no UI library. three.js is the sole dependency, loaded
through a dynamic import so the entry bundle stays ~2 kB gzipped.

## Structure

```
index.html            all page content
netlify.toml          build config + security headers
public/
  favicon.svg
  theme-init.js       render-blocking theme resolution (no FOUC)
src/
  styles.css          design tokens + all styling
  main.js             theme, nav, 3D loader
  hero3d.js           ambient hero object (lazy-loaded)
vite.config.js        raises the chunk-size warning for the three.js split
```

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

```bash
npm run build      # production build into dist/
npm run preview    # serve the built output locally
```

## Design notes

- **Content works without JavaScript.** Every section is static markup, and
  nothing is ever hidden pending a script. An earlier version faded sections in
  on scroll; when that reveal failed the whole page rendered blank, so the
  pattern was removed rather than patched.
- **Themes** follow `prefers-color-scheme` on first visit and persist to
  `localStorage` after that. A render-blocking script in `<head>` applies the
  choice before first paint.
- **Motion** is suppressed entirely under `prefers-reduced-motion: reduce`,
  which also skips the three.js download altogether.
- **The 3D object is optional by construction.** It loads only when motion is
  welcome, WebGL works, and the connection is not flagged save-data, and it
  pauses whenever it scrolls out of view or the tab is hidden.
- **Accessibility**: skip link, semantic landmarks, visible focus rings,
  labelled icon-only controls, and `aria-current` on the active nav item.
- **Security**: a strict CSP (`script-src 'self'`, no `unsafe-inline`) is
  enforced via `netlify.toml`, which is why the theme bootstrap lives in its
  own file rather than an inline `<script>`.

## Contact

- Email — [zaaf17@hotmail.com](mailto:zaaf17@hotmail.com)
- LinkedIn — [zaafirali11](https://www.linkedin.com/in/zaafirali11)
- GitHub — [zafyyre](https://github.com/zafyyre)
