export const QUESTIONS_PER_PAGE = 10;

export function getTotalPages(itemCount: number, pageSize: number): number {
  if (itemCount <= 0) {
    return 1;
  }

  return Math.ceil(itemCount / pageSize);
}

export function clampPage(page: number, totalPages: number): number {
  if (page < 1) {
    return 1;
  }

  if (page > totalPages) {
    return totalPages;
  }

  return page;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const totalPages = getTotalPages(items.length, pageSize);
  const clampedPage = clampPage(page, totalPages);
  const start = (clampedPage - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

export function getVisibleRange(
  itemCount: number,
  page: number,
  pageSize: number,
): { start: number; end: number } {
  if (itemCount <= 0) {
    return { start: 0, end: 0 };
  }

  const totalPages = getTotalPages(itemCount, pageSize);
  const clampedPage = clampPage(page, totalPages);
  const start = (clampedPage - 1) * pageSize + 1;
  const end = Math.min(clampedPage * pageSize, itemCount);

  return { start, end };
}
