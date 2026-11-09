export type ArticleIdentity = { id: string; slug: string };
export function assertArticleInventory(
  historical: ArticleIdentity[], approved: ArticleIdentity[],
  locales: Record<"ja" | "en" | "zh", ArticleIdentity[]>,
): void {
  const index = (entries: ArticleIdentity[]) => {
    const ids = new Map<string, string>();
    const slugs = new Set<string>();
    for (const { id, slug } of entries) {
      if (!id?.trim() || !slug?.trim() || ids.has(id) || slugs.has(slug)) throw Error("Missing or duplicate article identity");
      ids.set(id, slug); slugs.add(slug);
    }
    return ids;
  };
  const allowed = index([...historical, ...approved]);
  let reference: string | undefined;
  for (const locale of ["ja", "en", "zh"] as const) {
    const current = index(locales[locale]);
    for (const { id, slug } of historical) if (current.get(id) !== slug) throw Error(`Historical article missing or reassigned: ${id}`);
    for (const [id, slug] of current) if (allowed.get(id) !== slug) throw Error(`Unapproved article: ${id}`);
    const identity = JSON.stringify([...current].sort(([a], [b]) => a.localeCompare(b)));
    if (reference !== undefined && reference !== identity) throw Error(`Missing translation: ${locale}`);
    reference = identity;
  }
}
