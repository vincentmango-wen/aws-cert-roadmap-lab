# i18n Directory Design

## 1. Purpose

This directory contains the localization foundation for AWS Cert Roadmap Lab.

The goal is to support the following locales:

| Locale | Language | URL Prefix | Notes |
| --- | --- | --- | --- |
| ja | Japanese | none | Existing Japanese pages remain as-is |
| en | English | /en | English pages for global SEO |
| zh | Traditional Chinese first | /zh | Traditional Chinese-oriented content, expandable to /zh-cn in the future |

This directory is designed for Phase 5: Global SEO and Localization.

It does not implement authentication, payment, learning history, Cognito, or DynamoDB-based content management.

---

## 2. Design Principles

## 2.1 Keep Japanese URLs unchanged

Existing Japanese URLs must remain unchanged.

Examples:

```text
/
/terms
/terms/s3
/comparisons/s3-vs-ebs-vs-efs
/architectures/static-site-s3-cloudfront
/blog/aws-cloud-practitioner-roadmap
```

English and Chinese pages use locale prefixes.

Examples:

```text
/en
/en/terms
/en/terms/s3
/en/comparisons/s3-vs-ebs-vs-efs
/en/architectures/static-site-s3-cloudfront
/en/blog/aws-cloud-practitioner-roadmap

/zh
/zh/terms
/zh/terms/s3
/zh/comparisons/s3-vs-ebs-vs-efs
/zh/architectures/static-site-s3-cloudfront
/zh/blog/aws-cloud-practitioner-roadmap
```

---

## 2.2 Keep content static

The project continues to prioritize static content for SEO, performance, and low AWS cost.

The following content remains file-based:

| Content | Storage |
| --- | --- |
| Terms | JSON |
| Questions | JSON |
| Comparisons | MDX |
| Architectures | MDX and SVG |
| Blog posts | MDX |
| Static pages | TSX or MDX |

DynamoDB is not used for multilingual content in Phase 5.

---

## 2.3 Separate UI text from content text

UI labels and content translations must be managed separately.

| Type | Example | Location |
| --- | --- | --- |
| UI text | Header labels, Footer labels, buttons, filters | src/i18n/dictionaries |
| Content text | Terms, blog posts, comparison articles | contents or src/contents |
| SEO text | title, description, OGP, hreflang | src/i18n/seo |

---

## 2.4 Use type-safe locale handling

Locale values must not be handled as arbitrary strings.

The implementation must define locale constants and types in one place.

Expected locale type:

```ts
export type Locale = "ja" | "en" | "zh";
```

---

## 2.5 Avoid automatic IP-based redirects

The site must not redirect users based on IP address or browser language in Phase 5.

Reasons:

- Googlebot behavior becomes harder to verify.
- AdSense review behavior becomes harder to predict.
- Users may want to compare language versions manually.
- Static export remains simpler.

Language switching should be explicit through links or a language switcher UI.

---

## 3. Planned Directory Structure

The final `src/i18n` structure should be:

```text
src/i18n/
├── README.md
├── locales.ts
├── routes.ts
├── dictionaries/
│   ├── ja.ts
│   ├── en.ts
│   ├── zh.ts
│   └── index.ts
├── seo/
│   ├── locales.ts
│   ├── metadata.ts
│   ├── hreflang.ts
│   └── sitemap.ts
└── navigation/
    ├── labels.ts
    └── paths.ts
```

---

## 4. File Responsibilities

## 4.1 `locales.ts`

Defines supported locales and locale-related helper functions.

Planned responsibilities:

- Define `Locale`
- Define `SUPPORTED_LOCALES`
- Define `DEFAULT_LOCALE`
- Define locale labels
- Check whether a value is a supported locale
- Convert locale to URL prefix

Expected future exports:

```ts
export type Locale = "ja" | "en" | "zh";

export const DEFAULT_LOCALE = "ja";

export const SUPPORTED_LOCALES = ["ja", "en", "zh"] as const;
```

---

## 4.2 `routes.ts`

Defines localized URL rules.

Planned responsibilities:

- Build locale-aware paths
- Keep Japanese URLs without `/ja`
- Add `/en` and `/zh` prefixes
- Normalize paths
- Remove or replace locale prefixes

Examples:

```text
createLocalizedPath("ja", "/terms") -> "/terms"
createLocalizedPath("en", "/terms") -> "/en/terms"
createLocalizedPath("zh", "/terms") -> "/zh/terms"
```

---

## 4.3 `dictionaries/`

Stores UI text by locale.

Target UI areas:

- Header
- Footer
- CTA
- Search
- Filters
- Breadcrumbs
- Form labels
- Common buttons
- Error messages

This directory should not store long-form blog or article translations.

---

## 4.4 `dictionaries/ja.ts`

Stores Japanese UI text.

Examples:

- Home
- Terms
- Comparisons
- Questions
- Architectures
- Blog
- Roadmap
- Contact

---

## 4.5 `dictionaries/en.ts`

Stores English UI text.

Examples:

- Home
- Terms
- Comparisons
- Practice Questions
- Architectures
- Blog
- Roadmap
- Contact

---

## 4.6 `dictionaries/zh.ts`

Stores Traditional Chinese-oriented UI text.

Examples:

- 首頁
- AWS術語集
- 服務比較
- 模擬題
- 架構圖
- 部落格
- 學習路線圖
- 聯絡我們

---

## 4.7 `dictionaries/index.ts`

Exports dictionary access helpers.

Planned responsibilities:

- Return dictionary by locale
- Fall back to Japanese if an unsupported locale is passed internally
- Preserve type consistency across locale dictionaries

---

## 4.8 `seo/locales.ts`

Maps locale values to SEO-specific locale values.

Examples:

| Locale | HTML lang | OpenGraph locale | hreflang |
| --- | --- | --- | --- |
| ja | ja | ja_JP | ja |
| en | en | en_US | en |
| zh | zh-Hant | zh_TW | zh-Hant |

---

## 4.9 `seo/metadata.ts`

Creates localized metadata.

Planned responsibilities:

- Generate localized title
- Generate localized description
- Generate localized canonical URL
- Generate localized OpenGraph metadata
- Keep existing Japanese metadata behavior compatible

This file is implemented later in P5-010.

---

## 4.10 `seo/hreflang.ts`

Creates hreflang alternate links.

Planned responsibilities:

- Generate `ja`, `en`, `zh-Hant`, and `x-default`
- Map same content ID across languages
- Keep canonical URL language-specific

This file is implemented later in P5-009 and P5-012.

---

## 4.11 `seo/sitemap.ts`

Generates locale-aware sitemap entries.

Planned responsibilities:

- Add Japanese URLs
- Add English URLs
- Add Chinese URLs
- Add alternate language references if supported by the sitemap implementation

This file is implemented later in P5-011.

---

## 4.12 `navigation/labels.ts`

Defines localized navigation label keys.

This file exists to prevent Header and Footer from hardcoding UI labels.

Planned areas:

- Header navigation
- Footer sections
- Footer links
- Mobile navigation labels
- Skip link label

---

## 4.13 `navigation/paths.ts`

Defines navigation paths by content type.

This file exists to keep navigation URL generation independent from the dictionary.

Examples:

```text
home -> /
terms -> /terms
comparisons -> /comparisons
questions -> /questions
architectures -> /architectures
blog -> /blog
roadmap -> /roadmap
contact -> /contact
```

The locale prefix is applied by route helpers, not by hardcoded strings in UI components.

---

## 5. Implementation Order

The implementation order after this design is:

1. P5-004: Implement locale definitions
2. P5-005: Create UI dictionary files
3. P5-006: Implement language switcher UI
4. P5-007: Create multilingual routing foundation
5. P5-008: Set HTML lang by locale
6. P5-009: Design canonical and hreflang
7. P5-010: Create multilingual metadata helper
8. P5-011: Generate multilingual sitemap

---

## 6. Naming Rules

## 6.1 Locale names

Use only the following locale names in Phase 5:

```text
ja
en
zh
```

Do not use the following names yet:

```text
ja-JP
en-US
zh-TW
zh-CN
```

Reason:

- URL prefixes should stay short.
- Future regional expansion remains possible.
- SEO-specific values can be mapped separately.

---

## 6.2 Dictionary keys

Dictionary keys must use lower camel case.

Good:

```text
siteName
mainNavigation
languageSwitcher
searchPlaceholder
```

Bad:

```text
site_name
MAIN_NAVIGATION
header-nav
```

---

## 6.3 Route keys

Route keys must be stable semantic identifiers.

Good:

```text
home
terms
termDetail
comparisons
comparisonDetail
questions
questionDetail
architectures
architectureDetail
blog
blogDetail
roadmap
contact
about
privacy
disclaimer
```

Bad:

```text
page1
linkA
urlText
```

---

## 7. Scope Boundaries

## 7.1 In scope

- Directory design
- File responsibilities
- Naming rules
- Implementation order
- Separation between UI translations, content translations, and SEO helpers

## 7.2 Out of scope

- TypeScript locale implementation
- Dictionary implementation
- Language switcher implementation
- Multilingual routes
- Content translation
- sitemap generation
- canonical generation
- hreflang generation
- AWS resource changes

---

## 8. Acceptance Criteria

P5-003 is complete when:

- `frontend/src/i18n/README.md` exists.
- The planned `src/i18n` directory structure is documented.
- Each planned file has a clear responsibility.
- The implementation order from P5-004 onward is documented.
- The design keeps Japanese URLs unchanged.
- The design uses `/en` for English and `/zh` for Chinese.
- The design avoids DynamoDB-based multilingual content management.
- The design avoids IP-based automatic redirects.
