import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import JaUpdates, { metadata as jaMetadata } from "@/app/(site)/updates/page";
import EnUpdates, { metadata as enMetadata } from "@/app/(site)/en/updates/page";
import ZhUpdates, { metadata as zhMetadata } from "@/app/(site)/zh/updates/page";
import JaHome from "@/app/(site)/page";
import EnHome from "@/app/(site)/en/page";
import ZhHome from "@/app/(site)/zh/page";
import sitemap from "@/app/sitemap";
import { getDictionary } from "@/i18n/dictionaries";
import { createLocalizedPath } from "@/i18n/locales";
import { getUpdatesInventory } from "../index";

afterEach(() => { vi.unstubAllEnvs(); vi.doUnmock("@/i18n/release-gate"); vi.resetModules(); });
const ids = (html: string) => [...html.matchAll(/data-update-id="([^"]+)"/g)].map((match) => match[1]);
it.each([
  ["ja", JaUpdates, JaHome, jaMetadata, "/updates"],
  ["en", EnUpdates, EnHome, enMetadata, "/en/updates"],
  ["zh", ZhUpdates, ZhHome, zhMetadata, "/zh/updates"],
] as const)("renders the full inventory and metadata for %s", (locale, Page, Home, metadata, route) => {
  vi.stubEnv("UPDATES_BUILD_DATE", "2026-11-12");
  const inventory = getUpdatesInventory();
  const items = inventory.itemsByLocale[locale];
  const html = renderToStaticMarkup(createElement(Page));
  expect(ids(html)).toEqual(items.map((item) => item.id));
  expect([...html.matchAll(/data-date-kind="effective"[^>]*>[\s\S]*?<time dateTime="([^"]+)"/g)].map((match) => match[1])).toEqual(items.map((item) => item.date));
  expect([...html.matchAll(/data-date-kind="published"[^>]*>[\s\S]*?<time dateTime="([^"]+)"/g)].map((match) => match[1])).toEqual(items.filter((item) => item.eventKind === "update" && item.publishedAt).map((item) => item.publishedAt));
  expect(html).toContain(getDictionary(locale).updates.title);
  expect(ids(renderToStaticMarkup(createElement(Home)))).toEqual(items.slice(0, 3).map((item) => item.id));
  expect(metadata.title).toBe(getDictionary(locale).updates.title);
  expect(metadata.description).toBe(getDictionary(locale).updates.introduction);
  expect(metadata.alternates?.canonical).toMatch(new RegExp(`${route}$`));
  expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(["en", "ja", "x-default", "zh-Hant"]);
  for (const target of ["ja", "en", "zh"] as const) expect(createLocalizedPath(target, route)).toBe(target === "ja" ? "/updates" : `/${target}/updates`);
});
it("includes exactly three updates sitemap entries without fabricated modification dates", () => {
  const entries = sitemap().filter((item) => new URL(item.url).pathname.endsWith("/updates"));
  expect(entries.map((item) => new URL(item.url).pathname).sort()).toEqual(["/en/updates", "/updates", "/zh/updates"]);
  for (const entry of entries) expect(entry.lastModified).toBeUndefined();
});
it("honors sealed locale sitemap and robots behavior", async () => {
  vi.doMock("@/i18n/release-gate", () => ({ LOCALIZED_ROUTES_PUBLISHED: false, publishedLocales: ["ja"], isPublishedLocale: (locale: string) => locale === "ja", isSealedPathname: (pathname: string) => /^\/(en|zh)(\/|$)/.test(pathname) }));
  vi.resetModules();
  const sealedSitemap = (await import("@/app/sitemap")).default;
  expect(sealedSitemap().filter((item) => new URL(item.url).pathname.endsWith("/updates")).map((item) => new URL(item.url).pathname)).toEqual(["/updates"]);
  const sealed = await import("@/app/(site)/en/updates/page");
  expect(sealed.metadata.robots).toMatchObject({ index: false, follow: false });
});
