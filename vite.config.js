import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // The three.js chunk is ~525 kB raw / ~132 kB gzipped and trips the default
    // 500 kB warning. That is expected and intentional: it is split out behind a
    // dynamic import in src/main.js and only fetched when the visitor allows
    // motion, has WebGL, and is not on a save-data connection. The entry bundle
    // stays a couple of kB. Raising the limit keeps real regressions visible
    // instead of hiding them under a warning that is always present.
    chunkSizeWarningLimit: 600,
  },
});
