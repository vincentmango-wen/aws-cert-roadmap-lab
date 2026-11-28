import type { UpdateItem } from "./types";

export type DailyUpdateGroup = { date: string; items: UpdateItem[] };

/** Group the already validated inventory without changing its within-day order. */
export function groupUpdatesByDate(items: readonly UpdateItem[]): DailyUpdateGroup[] {
  const groups = new Map<string, UpdateItem[]>();
  for (const item of items) {
    const entries = groups.get(item.date) ?? [];
    entries.push(item);
    groups.set(item.date, entries);
  }
  return [...groups].sort(([a], [b]) => a < b ? 1 : a > b ? -1 : 0)
    .map(([date, entries]) => ({ date, items: entries }));
}
