import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest configuration: apply tsconfig aliases (@/* -> ./src/*) to Vitest. CR1-M2, 2026-06-21: importing
 * resolveDiagramPath from architecture-detail-data.ts brings transitive alias imports such as
 * @/i18n/locales. Vitest does not inherit tsconfig paths by default, so declare alias resolution here.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
