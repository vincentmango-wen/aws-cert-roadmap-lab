import path from "node:path";
import { fileURLToPath } from "node:url";

const frontend = fileURLToPath(new URL("../", import.meta.url));
let server;
try {
  const args = process.argv.slice(2);
  const flags = new Map();
  for (let i = 0; i < args.length; i += 2) {
    if (!["--base", "--candidate", "--repo", "--today"].includes(args[i]) || !args[i + 1] || flags.has(args[i])) throw new Error("Expected unique --base, --candidate, optional --repo and --today values");
    flags.set(args[i], args[i + 1]);
  }
  const base = flags.get("--base"), candidate = flags.get("--candidate");
  if (!base || !candidate) throw new Error("Explicit --base and --candidate are required");
  if (base === candidate) throw new Error("Base and candidate must be distinct Git commits");
  const { createServer } = await import("vite");
  server = await createServer({ root: frontend, configFile: false, appType: "custom", clearScreen: false,
    server: { middlewareMode: true, watch: null, preTransformRequests: false },
    optimizeDeps: { noDiscovery: true, entries: [] },
    resolve: { alias: { "@": path.join(frontend, "src") } } });
  const { checkGitPublications } = await server.ssrLoadModule("/src/contents/updates/publication-git.ts");
  const { getUpdatesBuildDate } = await server.ssrLoadModule("/src/contents/updates/dates.ts");
  const result = checkGitPublications(path.resolve(flags.get("--repo") ?? path.join(frontend, "..")), base, candidate, flags.get("--today") ?? getUpdatesBuildDate());
  await server.close();
  server = undefined;
  console.log("Coverage verified for committed snapshots only:");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`Publication check FAILED: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await server?.close();
}
