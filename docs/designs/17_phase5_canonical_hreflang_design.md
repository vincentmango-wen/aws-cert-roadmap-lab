# Phase 5 canonical / hreflang Design

## 1. Document Information

| Item | Description |
|---|---|
| Document name | Phase 5 canonical / hreflang Design |
| Target product | AWS Certification Roadmap Lab |
| Target task | P5-009 |
| Target phase | Phase 5 Global SEO and Localization |
| Purpose | Define specifications for correctly emitting canonical and hreflang for Japanese, English, and Chinese pages |
| Target technologies | Next.js App Router / Metadata API / Static Export |
| Created | 2026-06-12 |

---

## 2. Background

In Phase 5, retain Japanese pages at their existing URLs and add English pages under `/en` and Chinese pages under `/zh`.

Adding multilingual pages creates multiple URLs for pages on the same topic.

Example:

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

Search engines must be informed that these are alternative language versions, rather than duplicate pages.

Therefore, each page emits the following.

- canonical
- hreflang
- x-default

---

## 3. Supported Languages

| Internal locale | URL prefix | HTML lang | hreflang | Display language | Notes |
|---|---|---|---|---|---|
| ja | None | ja | ja | Japanese | Retain existing URLs |
| en | /en | en | en | English | For English-speaking audiences |
| zh | /zh | zh | zh-Hant | Primarily Traditional Chinese | `/zh-cn` can be added in the future |

### 3.1 Handling Chinese

Use `/zh` as the URL, as specified in the existing WBS.

However, because the initial content is primarily Traditional Chinese, use `zh-Hant` as the default hreflang.

If Simplified Chinese is added in the future, separate the variants as follows.

| Purpose | URL | hreflang |
|---|---|---|
| Traditional Chinese | /zh | zh-Hant |
| Simplified Chinese | /zh-cn | zh-Hans |

---

## 4. URL Design

### 4.1 Basic Rules

| Page type | Japanese | English | Chinese |
|---|---|---|---|
| Home | / | /en | /zh |
| Glossary index | /terms | /en/terms | /zh/terms |
| Term detail | /terms/s3 | /en/terms/s3 | /zh/terms/s3 |
| Comparison index | /comparisons | /en/comparisons | /zh/comparisons |
| Comparison detail | /comparisons/s3-vs-ebs-vs-efs | /en/comparisons/s3-vs-ebs-vs-efs | /zh/comparisons/s3-vs-ebs-vs-efs |
| Architecture diagram index | /architectures | /en/architectures | /zh/architectures |
| Architecture diagram detail | /architectures/static-site-s3-cloudfront | /en/architectures/static-site-s3-cloudfront | /zh/architectures/static-site-s3-cloudfront |
| Blog index | /blog | /en/blog | /zh/blog |
| Blog detail | /blog/aws-cloud-practitioner-roadmap | /en/blog/aws-cloud-practitioner-roadmap | /zh/blog/aws-cloud-practitioner-roadmap |
| Roadmap | /roadmap | /en/roadmap | /zh/roadmap |
| About | /about | /en/about | /zh/about |
| Privacy | /privacy | /en/privacy | /zh/privacy |
| Disclaimer | /disclaimer | /en/disclaimer | /zh/disclaimer |
| Contact | /contact | /en/contact | /zh/contact |

### 4.2 URL Trailing Slash Policy

Do not append a trailing slash to canonical URLs.

The only exception is the home page `/`.

| Input | canonical |
|---|---|
| /terms/ | /terms |
| /en/terms/ | /en/terms |
| /zh/terms/ | /zh/terms |
| / | / |

---

## 5. canonical Design

### 5.1 Basic Policy

The canonical points to the currently displayed language page itself.

Do not consolidate other language pages into Japanese through canonical links.

Reasons:

- English pages should rank in English searches.
- Chinese pages should rank in Chinese searches.
- Different language pages should be treated as alternatives rather than duplicates.

### 5.2 canonical Examples

#### Japanese Page

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

#### English Page

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
```

#### Chinese Page

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
```

---

## 6. hreflang Design

### 6.1 Basic Policy

For pages sharing the same content ID, emit the URLs for all languages in hreflang.

Example:

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 6.2 Pages That Emit hreflang

| Page | Emit hreflang |
|---|---|
| Home page | Yes |
| Glossary index | Yes |
| Term detail | Yes |
| Comparison index | Yes |
| Comparison detail | Yes |
| Architecture diagram index | Yes |
| Architecture diagram detail | Yes |
| Blog index | Yes |
| Blog detail | Yes |
| Roadmap | Yes |
| About | Yes |
| Privacy | Yes |
| Disclaimer | Yes |
| Contact | Yes |
| 404 | No |
| robots.txt | No |
| sitemap.xml | No |

### 6.3 Handling Pages Not Yet Translated

If a translated page has not yet been created, do not emit hreflang for that language.

Example:

If only Japanese and English exist and Chinese has not yet been created:

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

Do not emit a nonexistent `/zh/...` URL in hreflang.

Reasons:

- Search Console reports alternate-page errors.
- Users are directed to 404 pages.
- SEO quality deteriorates.

---

## 7. x-default Design

### 7.1 Basic Policy

x-default points to the Japanese URL.

Reasons:

- The existing primary content is Japanese.
- The policy is to retain existing Japanese URLs.
- IP-based automatic redirects will not be introduced.
- `/` will not be used as a language selection page.

### 7.2 x-default Example

```html
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 7.3 Conditions for Future Changes

When the following conditions are met, x-default may be changed to a dedicated language selection page.

- Create a language selection page such as `/language` or `/intl`.
- All main pages are available in Japanese, English, and Chinese.
- Multilingual indexing is stable in Search Console.

---

## 8. Next.js Metadata Implementation Policy

### 8.1 Function Planned for P5-010

Create the following helper in P5-010.

```ts
createLocalizedPageMetadata(input)
```

This helper returns the following.

```ts
{
  alternates: {
    canonical: "https://www.aws-cert-roadmap-lab.com/en/terms/s3",
    languages: {
      ja: "https://www.aws-cert-roadmap-lab.com/terms/s3",
      en: "https://www.aws-cert-roadmap-lab.com/en/terms/s3",
      "zh-Hant": "https://www.aws-cert-roadmap-lab.com/zh/terms/s3",
      "x-default": "https://www.aws-cert-roadmap-lab.com/terms/s3"
    }
  }
}
```

### 8.2 Proposed Input Fields

```ts
type Locale = "ja" | "en" | "zh";

type LocalizedMetadataInput = {
  locale: Locale;
  path: `/${string}` | "/";
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  availableLocales?: Locale[];
};
```

### 8.3 Approach to availableLocales

Pass only the languages in which the page actually exists to `availableLocales`.

Example:

```ts
availableLocales: ["ja", "en", "zh"]
```

For a page not yet translated, use the following.

```ts
availableLocales: ["ja", "en"]
```

---

## 9. URL Generation Rules

### 9.1 URL Generation by Locale

| locale | Input path | Output path |
|---|---|---|
| ja | /terms/s3 | /terms/s3 |
| en | /terms/s3 | /en/terms/s3 |
| zh | /terms/s3 | /zh/terms/s3 |

### 9.2 Home Page Exception

| locale | Input path | Output path |
|---|---|---|
| ja | / | / |
| en | / | /en |
| zh | / | /zh |

### 9.3 Preventing Duplicate Prefixes

Do not duplicate prefixes, even when receiving the following inputs.

| locale | Input path | Output path |
|---|---|---|
| en | /en/terms/s3 | /en/terms/s3 |
| zh | /zh/terms/s3 | /zh/terms/s3 |
| ja | /en/terms/s3 | /terms/s3 |
| ja | /zh/terms/s3 | /terms/s3 |

---

## 10. OGP Locale Policy

### 10.1 Locale Mapping

| locale | Open Graph locale |
|---|---|
| ja | ja_JP |
| en | en_US |
| zh | zh_TW |

### 10.2 alternateLocale

Emit the other languages as `alternateLocale` in OGP.

Example:

```ts
openGraph: {
  locale: "en_US",
  alternateLocale: ["ja_JP", "zh_TW"]
}
```

---

## 11. Sitemap Integration Policy

In P5-011, include multilingual URLs in the sitemap as well.

Meet at least the following requirements.

- Include Japanese URLs.
- Include English URLs.
- Include Chinese URLs.
- Use the same URL format as canonical.
- Do not include nonexistent translated pages.
- Emit `lastModified` when available.

---

## 12. Out of Implementation Scope

Do not implement the following in P5-009.

- Coding the metadata helper
- Modifying sitemap generation code
- Creating OGP images
- Adding translated content
- Modifying the language switcher UI
- IP-based automatic redirects
- Redirects using a CloudFront Function

---

## 13. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-P5-009-001 | URL rules for Japanese, English, and Chinese are defined |
| AC-P5-009-002 | The policy specifies that canonical points to the URL of the currently displayed language |
| AC-P5-009-003 | The policy specifies that hreflang emits only translated pages that exist |
| AC-P5-009-004 | The policy specifies that x-default points to the Japanese URL |
| AC-P5-009-005 | Handling of the home pages `/`, `/en`, and `/zh` is defined |
| AC-P5-009-006 | Input fields supporting the P5-010 metadata helper implementation policy are defined |
| AC-P5-009-007 | URL rules supporting the P5-011 multilingual sitemap policy are defined |

---

## 14. Handoff to Subsequent Tasks

| Task | Handoff details |
|---|---|
| P5-010 | Implement `createLocalizedPageMetadata` |
| P5-011 | Include Japanese, English, and Chinese URLs in the sitemap |
| P5-012 | Include `x-default` in the metadata helper |
| P5-013 | Decide the OGP policy for each locale |
| P5-016 onward | Pass locale and availableLocales when generating metadata for each page |

---

## 15. Implementation Notes

- Do not specify nonexistent URLs in canonical.
- Do not specify nonexistent translated pages in hreflang.
- Do not consolidate English pages into Japanese pages through canonical links.
- Do not consolidate Chinese pages into Japanese pages through canonical links.
- Do not create duplicate prefixes such as `/en/en/...` or `/zh/zh/...`.
- Do not perform IP-based automatic redirects.
- Do not add too many pages at once before checking Search Console.
