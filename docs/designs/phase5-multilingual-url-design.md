# Phase 5 Multilingual URL Design

## 1. Document Information

| Item | Description |
|---|---|
| Document name | Phase 5 Multilingual URL Design |
| Target product | AWS Cert Roadmap Lab / AWS Certification Roadmap Lab |
| Target phase | Phase 5 Global SEO and Localization |
| Target task | P5-002 Multilingual URL design |
| Purpose | Define URL rules for Japanese, English, and Chinese pages and establish assumptions for subsequent i18n, metadata, hreflang, and sitemap implementation |
| Created | 2026-06-11 |

---

## 2. Background

Phase 5 expands the existing Japanese AWS certification learning site into English and Chinese.

The objective is not simply translation, but validating search traffic from English- and Chinese-speaking audiences and establishing a global SEO foundation for an AWS certification learning site.

Because the existing site is already published at Japanese URLs, do not change those URLs.

---

## 3. Basic Policy

| Policy | Description |
|---|---|
| Retain existing Japanese URLs | Preserve existing indexing, internal links, and Search Console standing |
| English under `/en` | All English pages start with `/en` |
| Chinese under `/zh` | Initially use `/zh` for Chinese oriented toward Traditional Chinese |
| Share slugs by default | Share IDs such as `s3` and `rds-vs-dynamodb` across languages |
| No automatic redirects | Do not force redirects based on IP or browser language |
| Switch languages using the same content ID | Switch among `/terms/s3`, `/en/terms/s3`, and `/zh/terms/s3` |
| Retain static generation | Use static URLs that can be delivered with S3 + CloudFront |
| Consider future expansion | Design to allow `/zh-cn` and `/zh-tw` to be added later |

---

## 4. Locale Definition Policy

### 4.1 Initially Supported Locales

| locale | URL prefix | Display language | Purpose |
|---|---|---|---|
| `ja` | None | Japanese | Existing pages |
| `en` | `/en` | English | English-language SEO |
| `zh` | `/zh` | Primarily Traditional Chinese | Initial validation in Taiwan, Hong Kong, and Traditional Chinese-speaking audiences |

### 4.2 Candidates for Future Addition

| locale | URL prefix | Purpose |
|---|---|---|
| `zh-tw` | `/zh-tw` | If separating Traditional Chinese for Taiwan |
| `zh-cn` | `/zh-cn` | If separating Simplified Chinese for mainland China |
| `ko` | `/ko` | If supporting Korean |

### 4.3 Reasons for Initially Using `/zh`

Start validating traffic from Chinese-speaking audiences on a small scale.

Therefore, do not split into `/zh-tw` and `/zh-cn` from the beginning.

The reasons are as follows.

1. Reduce translation and terminology management effort.
2. First check Search Console for traffic from Chinese-speaking audiences.
3. Assess the response to Traditional Chinese content before creating a Simplified Chinese version.
4. Even if `/zh-cn` is added later, `/zh` can remain the representative Traditional Chinese URL.

---

## 5. Overall URL Rules

### 5.1 Basic Form

| Language | Home URL | Example URL |
|---|---|---|
| Japanese | `/` | `/terms/s3` |
| English | `/en` | `/en/terms/s3` |
| Chinese | `/zh` | `/zh/terms/s3` |

### 5.2 Trailing Slashes

Use URLs without trailing slashes as the standard form for links within the app.

```text
OK: /en/terms/s3
NG: /en/terms/s3/
```

However, Next.js static export output may use a directory structure such as the following.

```text
out/en/terms/s3/index.html
```

Standardize browser URLs without trailing slashes.

### 5.3 Letter Case

Use lowercase for all URLs.

```text
OK: /en/terms/api-gateway
NG: /en/terms/API-Gateway
NG: /en/terms/ApiGateway
```

### 5.4 Slug Characters

Allow only the following in slugs.

```text
a-z
0-9
-
```

Allowed examples:

```text
s3
api-gateway
s3-vs-ebs-vs-efs
static-site-s3-cloudfront
aws-free-tier-portfolio
```

Prohibited examples:

```text
S3
api_gateway
s3 vs ebs
s3-vs-ebs-vs-efs?
```

---

## 6. URL Design by Page Type

### 6.1 Home Page

| Language | URL |
|---|---|
| Japanese | `/` |
| English | `/en` |
| Chinese | `/zh` |

### 6.2 Learning Roadmap

| Language | URL |
|---|---|
| Japanese | `/roadmap` |
| English | `/en/roadmap` |
| Chinese | `/zh/roadmap` |

### 6.3 AWS Glossary Index

| Language | URL |
|---|---|
| Japanese | `/terms` |
| English | `/en/terms` |
| Chinese | `/zh/terms` |

### 6.4 AWS Term Detail

| Language | Example URL |
|---|---|
| Japanese | `/terms/s3` |
| English | `/en/terms/s3` |
| Chinese | `/zh/terms/s3` |

#### Slug Rules

Use `termId` as the slug for term detail pages.

```text
s3
iam
lambda
cloudfront
api-gateway
dynamodb
```

Do not translate slugs by language (the Chinese URL below is a prohibited example).

```text
OK: /en/terms/cloudfront
OK: /zh/terms/cloudfront
NG: /zh/terms/雲端前端
```

### 6.5 Practice Questions Home

| Language | URL |
|---|---|
| Japanese | `/questions` |
| English | `/en/questions` |
| Chinese | `/zh/questions` |

### 6.6 CLF Practice Question Index

| Language | URL |
|---|---|
| Japanese | `/questions/clf` |
| English | `/en/questions/clf` |
| Chinese | `/zh/questions/clf` |

### 6.7 Practice Question Detail

| Language | Example URL |
|---|---|
| Japanese | `/questions/clf-001` |
| English | `/en/questions/clf-001` |
| Chinese | `/zh/questions/clf-001` |

#### Slug Rules

Share question IDs across languages.

```text
clf-001
clf-002
saa-001
```

Do not change question IDs when translating question text.

### 6.8 Service Comparison Index

| Language | URL |
|---|---|
| Japanese | `/comparisons` |
| English | `/en/comparisons` |
| Chinese | `/zh/comparisons` |

### 6.9 Service Comparison Detail

| Language | Example URL |
|---|---|
| Japanese | `/comparisons/s3-vs-ebs-vs-efs` |
| English | `/en/comparisons/s3-vs-ebs-vs-efs` |
| Chinese | `/zh/comparisons/s3-vs-ebs-vs-efs` |

#### Slug Rules

Keep comparison article slugs English-based and share them across languages.

```text
s3-vs-ebs-vs-efs
rds-vs-dynamodb
sns-vs-sqs-vs-eventbridge
iam-user-vs-role-vs-policy
cloudwatch-vs-cloudtrail-vs-config
```

### 6.10 Architecture Diagram Index

| Language | URL |
|---|---|
| Japanese | `/architectures` |
| English | `/en/architectures` |
| Chinese | `/zh/architectures` |

### 6.11 Architecture Diagram Detail

| Language | Example URL |
|---|---|
| Japanese | `/architectures/static-site-s3-cloudfront` |
| English | `/en/architectures/static-site-s3-cloudfront` |
| Chinese | `/zh/architectures/static-site-s3-cloudfront` |

#### Slug Rules

Keep architecture diagram slugs English-based and share them across languages.

```text
static-site-s3-cloudfront
serverless-api-basic
three-tier-vpc
high-availability-web-app
eventbridge-lambda-batch
```

### 6.12 Blog Index

| Language | URL |
|---|---|
| Japanese | `/blog` |
| English | `/en/blog` |
| Chinese | `/zh/blog` |

### 6.13 Blog Detail

| Language | Example URL |
|---|---|
| Japanese | `/blog/aws-free-tier-portfolio` |
| English | `/en/blog/aws-free-tier-portfolio` |
| Chinese | `/zh/blog/aws-free-tier-portfolio` |

#### Slug Rules

Initially share blog slugs across languages as well.

The reasons are as follows.

1. The same content ID makes language switching easy.
2. Sitemap generation is simplified.
3. Internal links become easier to manage.
4. Japanese URLs are already designed primarily with English slugs.

Allow English-only slugs if articles specifically targeting English SEO are added in the future.

Example:

```text
/en/blog/aws-cloud-practitioner-study-guide
```

However, treat these as standalone articles without corresponding Japanese or Chinese pages.

### 6.14 Contact

| Language | URL |
|---|---|
| Japanese | `/contact` |
| English | `/en/contact` |
| Chinese | `/zh/contact` |

### 6.15 About the Operator

| Language | URL |
|---|---|
| Japanese | `/about` |
| English | `/en/about` |
| Chinese | `/zh/about` |

### 6.16 Privacy Policy

| Language | URL |
|---|---|
| Japanese | `/privacy` |
| English | `/en/privacy` |
| Chinese | `/zh/privacy` |

### 6.17 Disclaimer

| Language | URL |
|---|---|
| Japanese | `/disclaimer` |
| English | `/en/disclaimer` |
| Chinese | `/zh/disclaimer` |

### 6.18 GitHub Navigation Page

| Language | URL |
|---|---|
| Japanese | `/github` |
| English | `/en/github` |
| Chinese | `/zh/github` |

The GitHub navigation page is optional.

---

## 7. URLs Outside Multilingual Scope

### 7.1 URLs Not Initially Made Multilingual

Do not create the following in early Phase 5.

| URL | Reason |
|---|---|
| `/login` | In scope for conversion to a learning app in Phase 6 or later |
| `/signup` | In scope for conversion to a learning app in Phase 6 or later |
| `/mypage` | Requires authentication |
| `/mypage/progress` | Requires authentication |
| `/mypage/review` | Requires authentication |
| `/pricing` | Unnecessary before monetization |
| `/materials` | Unnecessary before selling learning materials |

### 7.2 404 Page

Localize the 404 page.

However, do not create a fixed URL route; use Next.js `not-found.tsx` or a 404 display under each locale.

Planned display (localized user-facing text):

| Language | Display |
|---|---|
| Japanese | ページが見つかりません |
| English | Page not found |
| Chinese | 找不到頁面 |

---

## 8. Language Switching URL Rules

### 8.1 When the Same Content Exists

Keep the current page's slug and change only the language prefix.

Example:

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

### 8.2 When a Translated Page Does Not Exist

If a translated page does not yet exist, navigate to the index page in the selected language.

Example:

```text
Current: /blog/aws-free-tier-portfolio
No English article: /en/blog
No Chinese article: /zh/blog
```

### 8.3 Switching Home Pages

| Current | Japanese | English | Chinese |
|---|---|---|---|
| `/` | `/` | `/en` | `/zh` |
| `/en` | `/` | `/en` | `/zh` |
| `/zh` | `/` | `/en` | `/zh` |

### 8.4 Do Not Carry Query Parameters Across Language Switches

Because search and filter wording differs by language, do not carry query parameters over in the initial implementation.

Example:

```text
/terms?category=Storage
→ /en/terms
```

---

## 9. canonical Design Policy

### 9.1 Basic Policy

Each language page uses itself as its canonical.

| Page | canonical |
|---|---|
| `/terms/s3` | `https://www.aws-cert-roadmap-lab.com/terms/s3` |
| `/en/terms/s3` | `https://www.aws-cert-roadmap-lab.com/en/terms/s3` |
| `/zh/terms/s3` | `https://www.aws-cert-roadmap-lab.com/zh/terms/s3` |

### 9.2 Rationale

Although the Japanese, English, and Chinese versions are translations, search engines treat them as separate pages in different languages.

Therefore, do not point an English page's canonical to a Japanese page.

---

## 10. hreflang Design Policy

### 10.1 Supported Languages

| locale | hreflang |
|---|---|
| `ja` | `ja` |
| `en` | `en` |
| `zh` | `zh-Hant` |
| default | `x-default` |

### 10.2 Output Example

Target content:

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

Mappings to emit:

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/" />
```

### 10.3 x-default Policy

Initially point `x-default` to the Japanese home page `/`.

The reasons are as follows.

1. Japanese is the existing site's primary language.
2. The Japanese URL is the existing reference URL.
3. Because IP-based automatic redirects are not used, users can select a language from the home page.

If a dedicated language selection page is created in the future, change `x-default` to that page.

---

## 11. Sitemap Design Policy

### 11.1 URLs Included in the Sitemap

Include the following in the sitemap in Phase 5.

```text
/
/en
/zh
/terms
/en/terms
/zh/terms
/terms/[termId]
/en/terms/[termId]
/zh/terms/[termId]
/comparisons
/en/comparisons
/zh/comparisons
/comparisons/[comparisonSlug]
/en/comparisons/[comparisonSlug]
/zh/comparisons/[comparisonSlug]
/architectures
/en/architectures
/zh/architectures
/architectures/[architectureSlug]
/en/architectures/[architectureSlug]
/zh/architectures/[architectureSlug]
/blog
/en/blog
/zh/blog
/blog/[postSlug]
/en/blog/[postSlug]
/zh/blog/[postSlug]
/roadmap
/en/roadmap
/zh/roadmap
/about
/en/about
/zh/about
/privacy
/en/privacy
/zh/privacy
/disclaimer
/en/disclaimer
/zh/disclaimer
```

### 11.2 URLs Excluded from the Sitemap

```text
/login
/signup
/mypage
/mypage/progress
/mypage/review
/pricing
/materials
```

### 11.3 Sitemap Generation Notes

Do not include URLs whose translation data has not yet been created in the sitemap.

Example:

```text
/en/blog/aws-free-tier-portfolio
```

If this English article has not yet been created, do not emit it in the sitemap.

---

## 12. Internal Link Design Policy

### 12.1 Prioritize Links Within the Same Language

Internal links on English pages navigate to English URLs.

```text
OK: /en/terms/s3 → /en/comparisons/s3-vs-ebs-vs-efs
NG: /en/terms/s3 → /comparisons/s3-vs-ebs-vs-efs
```

Internal links on Chinese pages navigate to Chinese URLs.

```text
OK: /zh/terms/s3 → /zh/comparisons/s3-vs-ebs-vs-efs
NG: /zh/terms/s3 → /comparisons/s3-vs-ebs-vs-efs
```

### 12.2 When No Translated Page Exists

If no translated page exists, return to the index page in the same language.

Example:

```text
/en/terms/s3 → /en/comparisons
/zh/terms/s3 → /zh/comparisons
```

---

## 13. Routing Options for Implementation

### 13.1 Recommended Routing Structure

Create locale-specific segments in Next.js App Router as follows.

```text
frontend/src/app/
├── page.tsx
├── terms/
├── comparisons/
├── questions/
├── architectures/
├── blog/
├── roadmap/
├── contact/
├── about/
├── privacy/
├── disclaimer/
├── en/
│   ├── page.tsx
│   ├── terms/
│   ├── comparisons/
│   ├── questions/
│   ├── architectures/
│   ├── blog/
│   ├── roadmap/
│   ├── contact/
│   ├── about/
│   ├── privacy/
│   └── disclaimer/
└── zh/
    ├── page.tsx
    ├── terms/
    ├── comparisons/
    ├── questions/
    ├── architectures/
    ├── blog/
    ├── roadmap/
    ├── contact/
    ├── about/
    ├── privacy/
    └── disclaimer/
```

### 13.2 Future Alternative

If implementation volume grows in the future, migrate to the following dynamic locale route.

```text
frontend/src/app/[locale]/
```

However, because Japanese URLs must not have a prefix, an explicit `/en` and `/zh` structure is easier to understand for the initial implementation.

---

## 14. Search Console Design Policy

### 14.1 URL Prefixes to Check

Check the following in Search Console.

```text
https://www.aws-cert-roadmap-lab.com/
https://www.aws-cert-roadmap-lab.com/en/
https://www.aws-cert-roadmap-lab.com/zh/
```

Even when using a domain property, separately check the indexing status of `/en` and `/zh` through URL inspection.

### 14.2 Verification Points

| Item | Check |
|---|---|
| Indexing | Are `/en` and `/zh` eligible for indexing? |
| sitemap | Does the sitemap include multilingual URLs? |
| Duplicates | Does canonical incorrectly point to a Japanese URL? |
| hreflang | Are mappings between language pages correct? |
| noindex | Has noindex been mistakenly added to multilingual pages? |

---

## 15. Acceptance Criteria

The completion criteria for P5-002 are as follows.

- The policy to retain existing Japanese URLs is explicit.
- English URLs are defined under `/en`.
- Chinese URLs are defined under `/zh`.
- A mapping table exists for Japanese, English, and Chinese URLs of major pages.
- Rules for shared detail-page slugs are defined.
- URLs not made multilingual are explicit.
- Language switching URL rules are defined.
- The canonical policy is defined.
- The hreflang policy is defined.
- The policy for URLs included in the sitemap is defined.
- The design is ready for handoff to subsequent tasks P5-003, P5-004, P5-007, P5-009, and P5-011.

---

## 16. Handoff to Subsequent Tasks

| Subsequent task | Handoff details |
|---|---|
| P5-003 i18n directory design | Locale, URL prefix, and shared slug rules |
| P5-004 Locale definition implementation | Locale specifications for `ja`, `en`, and `zh` |
| P5-006 Language switcher UI implementation | Rules for switching languages with the same slug |
| P5-007 Multilingual routing foundation creation | Page structure under `/en` and `/zh` |
| P5-009 canonical / hreflang design | canonical, hreflang, and x-default policies |
| P5-011 Multilingual sitemap generation support | URLs included in and excluded from the sitemap |
