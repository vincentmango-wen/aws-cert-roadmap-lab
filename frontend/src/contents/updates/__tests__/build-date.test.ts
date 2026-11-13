import { afterEach, expect, it, vi } from "vitest";
import type { SpawnSyncOptions } from "node:child_process";
import { captureBuildDate, launchBuild } from "../../../../scripts/build-with-updates-date.mjs";

afterEach(() => vi.useRealTimers());

it("uses the Taipei calendar boundary", () => {
  expect(captureBuildDate(new Date("2026-11-11T15:59:59Z"))).toBe("2026-11-11");
  expect(captureBuildDate(new Date("2026-11-11T16:00:00Z"))).toBe("2026-11-12");
});

it("passes one captured date to Next and inherited worker environments", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-11T15:59:59Z"));
  const runner = vi.fn((_command: string, _args: string[], options: SpawnSyncOptions) => {
    vi.setSystemTime(new Date("2026-11-11T16:00:01Z"));
    const workers = Array.from({ length: 4 }, () => ({ ...options.env }));
    expect(workers.map((env) => env.UPDATES_BUILD_DATE)).toEqual(Array(4).fill("2026-11-11"));
    expect(options.env?.TEST_INHERITED).toBe("kept");
    expect(options.shell).toBe(false);
    return { status: 0, signal: null };
  });
  expect(launchBuild({ runner, env: { NODE_ENV: "production", TEST_INHERITED: "kept", UPDATES_BUILD_DATE: "1999-01-01" } })).toBe(0);
  expect(runner).toHaveBeenCalledOnce();
  expect(runner.mock.calls[0][0]).toBe(process.execPath);
  expect(runner.mock.calls[0][1][0].replaceAll("\\", "/")).toMatch(/node_modules\/next\/dist\/bin\/next$/);
  expect(runner.mock.calls[0][1][1]).toBe("build");
});

it("propagates failed builds and treats missing exit status as failure", () => {
  expect(launchBuild({ runner: () => ({ status: 7, signal: null }) })).toBe(7);
  expect(launchBuild({ runner: () => ({ status: null, signal: "SIGTERM" }) })).toBe(1);
  expect(() => launchBuild({ runner: () => ({ error: new Error("spawn failed") }) })).toThrow("spawn failed");
});
