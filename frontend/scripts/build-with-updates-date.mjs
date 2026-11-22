import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/** @param {Date} now @returns {string} */
export function captureBuildDate(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((entry) => entry.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/**
 * @typedef {(command: string, args: string[], options: import('node:child_process').SpawnSyncOptions) => {status?: number | null, signal?: string | null, error?: Error}} Runner
 * @param {{now?: Date, env?: NodeJS.ProcessEnv, runner?: Runner}} options
 * @returns {number}
 */
export function launchBuild({ now = new Date(), env = process.env, runner = spawnSync } = {}) {
  const date = captureBuildDate(now);
  const result = runner(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
    env: { ...env, UPDATES_BUILD_DATE: date }, shell: false, stdio: "inherit",
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = launchBuild();
}
