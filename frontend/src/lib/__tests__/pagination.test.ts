import { describe, expect, it } from "vitest";
import {
  clampPage,
  getTotalPages,
  getVisibleRange,
  paginate,
  QUESTIONS_PER_PAGE,
} from "../pagination";

describe("QUESTIONS_PER_PAGE", () => {
  it("is 10", () => {
    expect(QUESTIONS_PER_PAGE).toBe(10);
  });
});

describe("getTotalPages", () => {
  it("computes exact multiples", () => {
    expect(getTotalPages(50, 10)).toBe(5);
  });

  it("rounds up remainders", () => {
    expect(getTotalPages(23, 10)).toBe(3);
  });

  it("returns 1 for zero items (so page 1 is always valid)", () => {
    expect(getTotalPages(0, 10)).toBe(1);
  });
});

describe("clampPage", () => {
  it("clamps below range up to 1", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(-3, 5)).toBe(1);
  });

  it("clamps above range down to totalPages", () => {
    expect(clampPage(99, 5)).toBe(5);
  });

  it("passes through valid pages unchanged", () => {
    expect(clampPage(3, 5)).toBe(3);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1);

  it("returns the first page (10 items)", () => {
    expect(paginate(items, 1, 10)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("returns the last, partial page (3 items)", () => {
    expect(paginate(items, 3, 10)).toEqual([21, 22, 23]);
  });

  it("returns an empty array for a 0-item input", () => {
    expect(paginate([], 1, 10)).toEqual([]);
  });

  it("clamps an out-of-range page instead of returning empty", () => {
    expect(paginate(items, 99, 10)).toEqual([21, 22, 23]);
  });
});

describe("getVisibleRange", () => {
  it("computes the first page's range", () => {
    expect(getVisibleRange(23, 1, 10)).toEqual({ start: 1, end: 10 });
  });

  it("computes the last, partial page's range", () => {
    expect(getVisibleRange(23, 3, 10)).toEqual({ start: 21, end: 23 });
  });

  it("returns a zero range for 0 items", () => {
    expect(getVisibleRange(0, 1, 10)).toEqual({ start: 0, end: 0 });
  });

  it("computes an exact-multiple last page's range", () => {
    expect(getVisibleRange(50, 5, 10)).toEqual({ start: 41, end: 50 });
  });
});
