# Zaaf's World

Personal portfolio for **Zaafir Ali** — [zaafsworld.netlify.app](https://zaafsworld.netlify.app)

A dependency-free static site: semantic HTML, hand-written CSS, and a small
progressive-enhancement layer of vanilla JavaScript. Vite handles bundling,
Netlify handles hosting.

## Stack

| Concern   | Choice                                                |
| --------- | ----------------------------------------------------- |
| Markup    | Static HTML — all content renders without JavaScript  |
| Styling   | Plain CSS with custom properties, dark + light themes  |
| Behaviour | Vanilla JS: theme toggle, mobile nav, scroll reveal    |
| Build     | Vite                                                   |
| Hosting   | Netlify                                                |

No framework, no UI library, no runtime dependencies.

## Structure

```
index.html            all page content
netlify.toml          build config + security headers
public/
  favicon.svg
  theme-init.js       render-blocking theme resolution (no FOUC)
src/
  styles.css          design tokens + all styling
  main.js             progressive enhancement
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

- **Content works without JavaScript.** Every section is static markup. JS only
  adds the theme toggle, mobile menu, scroll reveal and nav highlighting.
- **Themes** follow `prefers-color-scheme` on first visit and persist to
  `localStorage` after that. A render-blocking script in `<head>` applies the
  choice before first paint.
- **Motion** is suppressed entirely under `prefers-reduced-motion: reduce`.
- **Accessibility**: skip link, semantic landmarks, visible focus rings,
  labelled icon-only controls, and `aria-current` on the active nav item.
- **Security**: a strict CSP (`script-src 'self'`, no `unsafe-inline`) is
  enforced via `netlify.toml`, which is why the theme bootstrap lives in its
  own file rather than an inline `<script>`.

## Contact

- Email — [zaaf17@hotmail.com](mailto:zaaf17@hotmail.com)
- LinkedIn — [zaafirali11](https://www.linkedin.com/in/zaafirali11)
- GitHub — [zafyyre](https://github.com/zafyyre)
