import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * vitest config — tsconfig paths (`@/*` → `./src/*`) を vitest にも適用する。
 *
 * 経緯 (CR1-M2 / 2026-06-21):
 *  parity test が architecture-detail-data.ts の resolveDiagramPath を import
 *  する際、当該ファイル経由で `@/i18n/locales` 等のエイリアス import が連鎖する。
 *  vitest にはデフォルトで tsconfig paths が伝わらないため、エイリアス解決を
 *  この config で明示する。
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
