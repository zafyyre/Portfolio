/**
 * Ambient hero object.
 *
 * A slowly drifting icosahedron wireframe inside a shell of points. It is
 * decorative only — nothing on the page depends on it, and it is never loaded
 * unless the browser can actually run it (see the guards in main.js).
 *
 * Deliberately restrained: no orbit controls, no scroll hijacking, no model
 * downloads. It is something to look at while reading, not something to play.
 *
 * Named imports keep the chunk tree-shakeable; `import * as THREE` would pull
 * in the whole library.
 */

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  IcosahedronGeometry,
  WireframeGeometry,
  LineSegments,
  LineBasicMaterial,
  Color,
} from "three";

const CORE_RADIUS = 1.55;
const SHELL_RADIUS = 2.5;

/** Reads a CSS custom property so the object follows the site's theme. */
function cssColor(name, fallback) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  try {
    return new Color(raw || fallback);
  } catch {
    return new Color(fallback);
  }
}

/**
 * Evenly distributed points on a sphere (Fibonacci lattice). Random placement
 * clumps visibly at this count; this stays even without looking gridded.
 */
function buildShell(count) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    // Slight radial jitter so the shell reads as a cloud, not a hard surface.
    const r = SHELL_RADIUS * (0.82 + Math.random() * 0.28);

    positions[i * 3] = Math.cos(theta) * ring * r;
    positions[i * 3 + 1] = y * r;
    positions[i * 3 + 2] = Math.sin(theta) * ring * r;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {{ destroy: () => void } | null} null when WebGL is unavailable.
 */
export function createHeroScene(canvas) {
  const parent = canvas.parentElement;
  if (!parent) return null;

  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    // Context creation can fail on blocklisted drivers even when the API exists.
    return null;
  }

  const isCompact = window.matchMedia("(max-width: 820px)").matches;
  const pointCount = isCompact ? 520 : 1100;

  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, 0.1, 100);
  // z=8.6 leaves headroom on a portrait stage: at 7.4 the shell's 5.0 diameter
  // nearly equals the 5.06 visible width, so breathing and parallax clipped.
  camera.position.set(0, 0, 8.6);

  const group = new Group();
  scene.add(group);

  // --- wireframe core -----------------------------------------------------
  // Detail 1 keeps the facet count low enough to read as a drawn diagram
  // rather than a shaded ball.
  const coreGeometry = new IcosahedronGeometry(CORE_RADIUS, 1);
  const wireGeometry = new WireframeGeometry(coreGeometry);
  const wireMaterial = new LineBasicMaterial({
    transparent: true,
    opacity: 0.42,
  });
  const core = new LineSegments(wireGeometry, wireMaterial);
  group.add(core);

  // --- particle shell -----------------------------------------------------
  // No additive blending: the glow it produced was the single most generic
  // thing on the page. Flat points at low opacity read as plotted vertices.
  const shellGeometry = buildShell(pointCount);
  const shellMaterial = new PointsMaterial({
    size: isCompact ? 0.026 : 0.02,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const shell = new Points(shellGeometry, shellMaterial);
  group.add(shell);

  function applyThemeColors() {
    const accent = cssColor("--accent", "#e0a44a");
    const dim = cssColor("--dim", "#8b8982");
    wireMaterial.color.copy(accent);
    // Vertices sit back in the neutral text colour so the amber reads as
    // structure rather than decoration.
    shellMaterial.color.copy(dim);
  }
  applyThemeColors();

  // --- sizing -------------------------------------------------------------
  function resize() {
    const { clientWidth: w, clientHeight: h } = parent;
    if (!w || !h) return;
    // Cap DPR: past 2x the extra pixels cost real battery for no visible gain.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);

  // --- pointer parallax ---------------------------------------------------
  // Damped toward a target so the motion glides instead of snapping.
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  function onPointerMove(event) {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  }
  // Only for mice: on touch this would lurch on every tap.
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  // --- render loop --------------------------------------------------------
  let frame = 0;
  let running = false;
  let lastTime = 0;

  function tick(now) {
    if (!running) return;
    frame = requestAnimationFrame(tick);

    const delta = Math.min((now - lastTime) / 1000, 0.05) || 0;
    lastTime = now;
    const t = now / 1000;

    pointerX += (targetX - pointerX) * Math.min(delta * 2.5, 1);
    pointerY += (targetY - pointerY) * Math.min(delta * 2.5, 1);

    // Slower than before and on one axis: a turntable, not a floating orb.
    group.rotation.y += delta * 0.07;
    group.rotation.x = Math.sin(t * 0.18) * 0.1 + pointerY * 0.12;
    group.position.x = pointerX * 0.22;

    // Slow breathing so the silhouette never sits perfectly still. The core
    // scales opposite the shell, so the gap between them opens and closes.
    const breathe = Math.sin(t * 0.45) * 0.025;
    shell.scale.setScalar(1 + breathe);
    core.scale.setScalar(1 - breathe);

    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  // Only animate while actually on screen and the tab is focused — this is
  // decoration, and it should never burn battery in a background tab.
  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !document.hidden) start();
      else stop();
    },
    { threshold: 0 }
  );
  visibility.observe(parent);

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (parent.getBoundingClientRect().bottom > 0) start();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  // Follow the site's light/dark toggle.
  const themeWatcher = new MutationObserver(applyThemeColors);
  themeWatcher.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Paint one frame synchronously so the canvas has real content the instant it
  // fades in. Without this the first frame waits on the observer plus a rAF,
  // which shows as a brief empty gap on slower machines.
  renderer.render(scene, camera);

  return {
    /** Renders a single frame on demand. Used to verify output off the loop. */
    renderOnce() {
      renderer.render(scene, camera);
    },
    destroy() {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      themeWatcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
      shellGeometry.dispose();
      shellMaterial.dispose();
      coreGeometry.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    },
  };
}
