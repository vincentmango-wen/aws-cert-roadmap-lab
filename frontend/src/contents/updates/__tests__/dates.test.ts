import { afterEach, describe, expect, it, vi } from "vitest";
import { getUpdatesBuildDate, isCalendarDate } from "../dates";

afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); vi.resetModules(); });

describe("calendar dates", () => {
  it.each(["2024-02-29", "2026-11-12", "2000-02-29"])("accepts %s", (value) => {
    expect(isCalendarDate(value)).toBe(true);
  });
  it.each(["2026-02-29", "2026-02-30", "1900-02-29", "2026-13-01", "2026-00-01", "2026-01-00", "2026-1-01", "2026-11-12T00:00:00Z", "", "0000-01-01"])("rejects %s", (value) => {
    expect(isCalendarDate(value)).toBe(false);
  });
  it("requires a valid captured date in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPDATES_BUILD_DATE", undefined);
    expect(() => getUpdatesBuildDate()).toThrow(/UPDATES_BUILD_DATE/);
    vi.stubEnv("UPDATES_BUILD_DATE", "2026-02-30");
    expect(() => getUpdatesBuildDate()).toThrow(/UPDATES_BUILD_DATE/);
    vi.stubEnv("UPDATES_BUILD_DATE", "2026-11-12");
    expect(getUpdatesBuildDate()).toBe("2026-11-12");
  });
  it("captures the local development date once across Taipei midnight", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPDATES_BUILD_DATE", undefined);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-11T15:59:59Z"));
    const dates = await import("../dates");
    expect(dates.getUpdatesBuildDate()).toBe("2026-11-11");
    vi.setSystemTime(new Date("2026-11-11T16:00:01Z"));
    expect(dates.getUpdatesBuildDate()).toBe("2026-11-11");
  });
});
