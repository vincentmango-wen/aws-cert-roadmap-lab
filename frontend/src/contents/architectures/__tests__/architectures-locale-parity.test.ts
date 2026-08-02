/**
 * architectures-locale-parity.test.ts
 *
 * 設計書 P5-042 §8-2 の invariant test (本実装モード).
 *
 * `contents/architectures/architectures.{ja,en,zh}.json` と各 locale 配下の MDX が、
 * 翻訳追加忘れ・slug ズレ・メタデータ不整合・MDX 消失・SVG 命名ミスなしに 3 言語完全
 * 並列で維持されていることを構造的に担保する。
 *
 * Phase 7 で 3 言語 10 件揃ったため、scaffold モードフラグは残置しつつも全 invariant
 * を実発火させる。Phase B 後のいかなる locale 追加 / slug 増加 / 翻訳改稿でも、
 * 1 言語だけ更新して残り 2 言語を放置する事故をこのテストが構造的にブロックする。
 *
 * 検証 invariant (en/zh が空でないときのみ発火):
 *  (1) ja/en/zh JSON の slug 集合が完全一致 (10 件)
 *  (2) 同 slug で architectureId が ja/en/zh 一致
 *  (3) 同 slug で services/category/level/examScopes/mermaid/published/
 *      publishedAt/updatedAt が ja/en/zh 一致 (tags は locale 別翻訳のため除外)
 *  (4) 全 slug について contents/architectures/{ja,en,zh}/<slug>.mdx が
 *      fs.existsSync = true
 *  (5) 全 slug について SVG が存在: ja は <slug>.svg / en は <slug>.en.svg /
 *      zh は <slug>.zh.svg (SVG 多言語化の命名ミス・翻訳忘れを構造検出)
 *  (6) 3 言語 JSON の diagramPath が共通 (ja 無印基準で一致) であり、かつ
 *      resolveDiagramPath(locale, meta) が (5) で存在確認したファイルパスと一致
 *  (7) MDX 先頭 H1 が JSON title と一致 or title.startsWith(h1Text)
 *      (loader removeLeadingH1 が strip できる形であること)
 *
 * scaffold モード (en/zh いずれかが空配列) は将来 locale 追加直後の中間状態
 * (翻訳追加前) を build 落ちさせない安全弁として残置. 通常運用では非発火.
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import architecturesEn from "../../../../contents/architectures/architectures.en.json";
import architecturesJa from "../../../../contents/architectures/architectures.ja.json";
import architecturesZh from "../../../../contents/architectures/architectures.zh.json";
import type { ArchitectureMeta } from "../../../types/architecture";
import { resolveDiagramPath } from "../../../app/(site)/architectures/architecture-detail-data";

const jaList = architecturesJa as ArchitectureMeta[];
const enList = architecturesEn as ArchitectureMeta[];
const zhList = architecturesZh as ArchitectureMeta[];

// frontend ディレクトリ基準で MDX / SVG の絶対パスを解決する。
const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");
const mdxPathFor = (locale: "ja" | "en" | "zh", slug: string): string =>
  path.join(FRONTEND_ROOT, "contents", "architectures", locale, `${slug}.mdx`);
const svgPathFor = (locale: "ja" | "en" | "zh", slug: string): string => {
  const suffix = locale === "ja" ? "" : `.${locale}`;
  return path.join(
    FRONTEND_ROOT,
    "public",
    "images",
    "architectures",
    `${slug}${suffix}.svg`,
  );
};

const toMap = (
  list: ArchitectureMeta[],
): Map<string, ArchitectureMeta> => new Map(list.map((a) => [a.slug, a]));

const jaMap = toMap(jaList);
const enMap = toMap(enList);
const zhMap = toMap(zhList);

const isScaffoldMode = enList.length === 0 || zhList.length === 0;

describe("architectures locale parity", () => {
  it("(scaffold) ja JSON contains the expected 10 published architectures", () => {
    expect(jaList.length).toBe(10);
  });

  it("(scaffold) every ja MDX file exists on disk", () => {
    for (const slug of jaMap.keys()) {
      const filePath = mdxPathFor("ja", slug);
      expect(
        fs.existsSync(filePath),
        `ja MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
      ).toBe(true);
    }
  });

  it.skipIf(isScaffoldMode)(
    "(1) ja/en/zh have the same slug set",
    () => {
      const jaSlugs = new Set(jaList.map((a) => a.slug));
      const enSlugs = new Set(enList.map((a) => a.slug));
      const zhSlugs = new Set(zhList.map((a) => a.slug));

      expect(enSlugs).toEqual(jaSlugs);
      expect(zhSlugs).toEqual(jaSlugs);
    },
  );

  it.skipIf(isScaffoldMode)(
    "(2) architectureId is identical across ja/en/zh per slug",
    () => {
      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug);
        const en = enMap.get(slug);
        const zh = zhMap.get(slug);
        expect(en, `en entry missing for slug=${slug}`).toBeDefined();
        expect(zh, `zh entry missing for slug=${slug}`).toBeDefined();
        expect(
          en!.architectureId,
          `architectureId mismatch (en) slug=${slug}`,
        ).toBe(ja!.architectureId);
        expect(
          zh!.architectureId,
          `architectureId mismatch (zh) slug=${slug}`,
        ).toBe(ja!.architectureId);
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(3) shared metadata fields are identical across ja/en/zh per slug",
    () => {
      // locale 非依存メタ. title/description/tags は翻訳対象のため対象外.
      const SHARED_FIELDS = [
        "services",
        "category",
        "level",
        "examScopes",
        "mermaid",
        "published",
        "publishedAt",
        "updatedAt",
      ] as const;

      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug)!;
        const en = enMap.get(slug)!;
        const zh = zhMap.get(slug)!;

        for (const field of SHARED_FIELDS) {
          expect(
            en[field],
            `field "${field}" mismatch between ja and en for slug=${slug}`,
          ).toEqual(ja[field]);
          expect(
            zh[field],
            `field "${field}" mismatch between ja and zh for slug=${slug}`,
          ).toEqual(ja[field]);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(4) every {ja,en,zh}/<slug>.mdx file exists on disk",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = mdxPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(5) every locale-specific SVG file exists on disk",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = svgPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `SVG missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(6) diagramPath is identical across ja/en/zh per slug, and resolveDiagramPath(locale, meta) resolves to the file existence checked in (5)",
    () => {
      // CR1-M2 是正: 旧版はテスト内で resolveDiagramPath ロジックを再実装していたが、
      // 二重実装の片肺バグが検出できないため、SSoT 関数を直接 import して検証する。
      // 不変条件: 実 resolveDiagramPath(locale, meta) の戻りパスが (5) の存在ファイルと一致.
      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug)!;
        const en = enMap.get(slug)!;
        const zh = zhMap.get(slug)!;

        // (6-a) 3 言語 JSON の diagramPath は ja 無印基準で一致.
        expect(en.diagramPath, `diagramPath mismatch (en) slug=${slug}`).toBe(
          ja.diagramPath,
        );
        expect(zh.diagramPath, `diagramPath mismatch (zh) slug=${slug}`).toBe(
          ja.diagramPath,
        );

        // (6-b) resolveDiagramPath(locale, meta) が (5) で存在確認したファイル
        // パスに一致する. /images/... の URL パス↔ファイルシステムパスの変換は
        // /images/<rest> -> public/images/<rest> の規則を再現する.
        for (const locale of ["ja", "en", "zh"] as const) {
          const meta =
            locale === "ja" ? ja : locale === "en" ? en : zh;
          const resolved = resolveDiagramPath(locale, meta);
          expect(resolved, `resolveDiagramPath undefined slug=${slug} locale=${locale}`).toBeDefined();

          const expectedFsPath = svgPathFor(locale, slug);
          // resolved は URL パス ("/images/architectures/foo.en.svg") なので
          // public/ プレフィックスを付与して FS パスへ変換し、(5) と同じ
          // path を指していることを確認する.
          const resolvedFsPath = path.join(
            FRONTEND_ROOT,
            "public",
            resolved!.replace(/^\//, ""),
          );
          expect(
            resolvedFsPath,
            `resolveDiagramPath path mismatch slug=${slug} locale=${locale}`,
          ).toBe(expectedFsPath);
          expect(
            fs.existsSync(resolvedFsPath),
            `resolveDiagramPath resolves to a missing file slug=${slug} locale=${locale} resolved=${resolved}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(7) MDX first H1 matches JSON title (or title.startsWith(h1Text))",
    () => {
      // loader removeLeadingH1 と同型の判定: 完全一致 or title.startsWith(h1Text)
      // を許容する (LONG title vs SHORT body H1 の短縮一致パターン).
      const stripFrontmatter = (rawFile: string): string => {
        const m = rawFile.match(
          /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
        );
        return m ? (m[2] ?? "").trim() : rawFile.trim();
      };

      const extractFirstH1 = (body: string): string | null => {
        const lines = body.split(/\r?\n/);
        for (const raw of lines) {
          const line = raw.trim();
          if (line.length === 0) continue;
          const h1 = line.match(/^#\s+(.+)$/);
          return h1 ? h1[1].trim() : null;
        }
        return null;
      };

      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const meta = (locale === "ja" ? jaMap : locale === "en" ? enMap : zhMap).get(
            slug,
          )!;
          const filePath = mdxPathFor(locale, slug);
          const raw = fs.readFileSync(filePath, "utf8");
          const body = stripFrontmatter(raw);
          const h1 = extractFirstH1(body);
          expect(
            h1,
            `MDX first H1 missing slug=${slug} locale=${locale}`,
          ).not.toBeNull();
          const ok = h1 === meta.title || meta.title.startsWith(h1!);
          expect(
            ok,
            `MDX H1 vs JSON title mismatch slug=${slug} locale=${locale} h1="${h1}" title="${meta.title}"`,
          ).toBe(true);
        }
      }
    },
  );

  // ── Step 6 追加 invariant ────────────────────────────────────────────────

  it("(8) en JSON contains exactly 10 architectures", () => {
    expect(enList.length).toBe(10);
  });

  it("(9) zh JSON contains exactly 10 architectures", () => {
    expect(zhList.length).toBe(10);
  });

  it.skipIf(isScaffoldMode)(
    "(10) every {ja,en,zh}/<slug>.mdx exists (explicit per-slug per-locale check)",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = mdxPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(11) every slug has all 3 locale SVG files: <slug>.svg / <slug>.en.svg / <slug>.zh.svg",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = svgPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `SVG missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(12) shared metadata fields (category/level/examScopes/services/publishedAt/mermaid) are identical across ja/en/zh per slug",
    () => {
      // tags は locale 別翻訳のため除外. 空でないことは invariant (13) で担保.
      const SHARED_FIELDS = [
        "category",
        "level",
        "examScopes",
        "services",
        "publishedAt",
        "mermaid",
      ] as const;

      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug)!;
        const en = enMap.get(slug)!;
        const zh = zhMap.get(slug)!;

        for (const field of SHARED_FIELDS) {
          expect(
            en[field],
            `field "${field}" mismatch between ja and en for slug=${slug}`,
          ).toEqual(ja[field]);
          expect(
            zh[field],
            `field "${field}" mismatch between ja and zh for slug=${slug}`,
          ).toEqual(ja[field]);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(13) title and description are non-empty strings for every slug in all 3 locales",
    () => {
      for (const slug of jaMap.keys()) {
        for (const [locale, map] of [
          ["ja", jaMap],
          ["en", enMap],
          ["zh", zhMap],
        ] as const) {
          const meta = map.get(slug)!;
          expect(
            meta.title,
            `title is empty for slug=${slug} locale=${locale}`,
          ).toBeTruthy();
          expect(
            meta.description,
            `description is empty for slug=${slug} locale=${locale}`,
          ).toBeTruthy();
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(14) tags array is non-empty for every slug in all 3 locales",
    () => {
      for (const slug of jaMap.keys()) {
        for (const [locale, map] of [
          ["ja", jaMap],
          ["en", enMap],
          ["zh", zhMap],
        ] as const) {
          const meta = map.get(slug)!;
          expect(
            meta.tags,
            `tags is missing for slug=${slug} locale=${locale}`,
          ).toBeDefined();
          expect(
            (meta.tags as string[]).length,
            `tags is empty array for slug=${slug} locale=${locale}`,
          ).toBeGreaterThan(0);
        }
      }
    },
  );
});
