# P5-013 Multilingual OGP Policy Decision

## 1. Document Information

| Item | Description |
| ------ | ---------------------------------------------- |
| Task ID  | P5-013                                         |
| Task name   | Multilingual OGP Policy Decision                                     |
| Target phase | Phase 5 Global SEO and Localization                    |
| Target site  | AWS Cert Roadmap Lab                           |
| Target languages   | Japanese / English / Traditional Chinese                              |
| Main uses | Next.js metadata / Open Graph / Social sharing / Search traffic entry points |
| Purpose   | Decide the minimum OGP image set, usage rules, and criteria for adding images for English and Chinese pages    |

---

## 2. Assumptions

## 2.1 URL Policy

| Language | URL policy | Example |
| ------ | ---------- | -------------- |
| Japanese | Retain existing URLs | `/terms/s3`    |
| English | Add `/en` | `/en/terms/s3` |
| Traditional Chinese | Add `/zh` | `/zh/terms/s3` |

## 2.2 OGP Image Location

Place OGP images in the following location.

```text
frontend/public/images/assets/
```

Reference them through public URLs as follows.

```text
/images/assets/{fileName}
```

## 2.3 Image Format

| Item | Policy |
| --------- | --------------------------------------------- |
| Recommended size     | 1200 x 630 px                                 |
| Format | PNG                                           |
| Target file size | At most 300KB per image                                     |
| Background | A simple background conveying trustworthiness as an AWS learning site                      |
| Text | Natural short wording in each language                                     |
| Prohibited | Wording suggesting passing guarantees, actual exam questions, exam dumps, or leaked questions |

---

## 3. Basic Policy

## 3.1 Initial Implementation Policy

For the initial implementation, create only one shared OGP image each for English and Chinese.

The reasons are as follows.

1. Phase 5 primarily validates international traffic rather than creating large numbers of OGP images.
2. More images increase creation, translation, and replacement verification work.
3. Avoid increasing S3 storage and CloudFront data transfer.
4. Retain the existing Japanese OGP image and avoid affecting existing pages.
5. Proceed with P5-014 / P5-015 as small implementation units.

## 3.2 Images Created in the Initial Implementation

Create only the following 2 images in the initial implementation.

```text
frontend/public/images/assets/og-image-en.png
frontend/public/images/assets/og-image-zh.png
```

## 3.3 Handling Japanese Pages

Retain the existing OGP image for Japanese pages.

```text
frontend/public/images/assets/og-image.png
```

---

## 4. OGP Image Scope

## 4.1 Must: Initial Implementation Scope

| Language | Target URLs | Image | Scope |
| ------ | ------------- | -------------------------------- | -------- |
| Japanese | Existing pages under `/`  | `/images/assets/og-image.png`    | Retain the existing implementation  |
| English | All pages under `/en` | `/images/assets/og-image-en.png` | Shared by English pages  |
| Traditional Chinese | All pages under `/zh` | `/images/assets/og-image-zh.png` | Shared by Chinese pages |

## 4.2 Should: Consider Additions After Confirming Traffic

Do not create the following in the initial implementation.

| Page type | English image candidate | Chinese image candidate | Criteria for adding |
| ------ | ------------------------- | ------------------------- | ----------------------------------------- |
| Glossary | `og-terms-en.png`         | `og-terms-zh.png`         | At least 100 monthly impressions for `/en/terms` or `/zh/terms` |
| Service comparisons | `og-comparisons-en.png`   | `og-comparisons-zh.png`   | Comparison pages begin to be shared on social media or external sites               |
| Architecture diagrams | `og-architectures-en.png` | `og-architectures-zh.png` | Architecture diagram pages become a leading category for international traffic                  |
| Practice questions | `og-questions-en.png`     | `og-questions-zh.png`     | At least 100 monthly search impressions for question pages                      |
| Blog | `og-blog-en.png`          | `og-blog-zh.png`          | English or Chinese blog articles become leading sources of search traffic                  |

## 4.3 Later: Individual Page OGP

Do not create the following in early Phase 5.

| Target | Policy | Criteria for adding |
| ------------- | ---- | ------------------------------ |
| Individual OGP for each term detail page  | Do not create | Consider after Search Console identifies the top 10 traffic sources |
| Individual OGP for each comparison article  | Do not create | Consider only articles with confirmed social sharing or external backlinks     |
| Individual OGP for each blog article | Do not create | Limit consideration to the top 10 articles                  |
| Individual OGP for each architecture diagram   | Do not create | Consider if the architecture diagram category grows as a differentiator         |

---

## 5. Usage Rules

## 5.1 English Pages

All pages under `/en` use the following image.

```text
/images/assets/og-image-en.png
```

Example target pages:

```text
/en
/en/terms
/en/terms/s3
/en/comparisons
/en/comparisons/s3-vs-ebs-vs-efs
/en/questions
/en/questions/clf
/en/questions/clf-001
/en/architectures
/en/architectures/static-site-s3-cloudfront
/en/blog
/en/blog/aws-cloud-practitioner-roadmap
/en/about
/en/privacy
/en/disclaimer
/en/contact
```

## 5.2 Traditional Chinese Pages

All pages under `/zh` use the following image.

```text
/images/assets/og-image-zh.png
```

Example target pages:

```text
/zh
/zh/terms
/zh/terms/s3
/zh/comparisons
/zh/comparisons/s3-vs-ebs-vs-efs
/zh/questions
/zh/questions/clf
/zh/questions/clf-001
/zh/architectures
/zh/architectures/static-site-s3-cloudfront
/zh/blog
/zh/blog/aws-cloud-practitioner-roadmap
/zh/about
/zh/privacy
/zh/disclaimer
/zh/contact
```

## 5.3 Japanese Pages

Japanese pages use the existing image.

```text
/images/assets/og-image.png
```

Example target pages:

```text
/
/terms
/terms/s3
/comparisons
/comparisons/s3-vs-ebs-vs-efs
/questions
/questions/clf
/questions/clf-001
/architectures
/architectures/static-site-s3-cloudfront
/blog
/blog/aws-cloud-practitioner-roadmap
/about
/privacy
/disclaimer
/contact
```

---

## 6. Fallback Rules

The metadata helper selects the OGP image in the following priority order.

```text
1. If customImage is specified, use customImage.
2. If locale is en, use /images/assets/og-image-en.png
3. If locale is zh, use /images/assets/og-image-zh.png
4. If locale is ja, use /images/assets/og-image.png
5. If locale detection fails, use /images/assets/og-image.png
```

Do not switch images by `pageType` in the initial implementation.

---

## 7. Image File Naming Rules

## 7.1 Initial Implementation

| File name | Purpose |
| ----------------- | ---------------- |
| `og-image.png`    | Shared by Japanese pages. Retain the existing image |
| `og-image-en.png` | Shared by English pages          |
| `og-image-zh.png` | Shared by Traditional Chinese pages      |

## 7.2 Naming Rules for Future Expansion

Use the following format when adding category-specific OGP images.

```text
og-{pageType}-{locale}.png
```

Examples:

```text
og-terms-en.png
og-terms-zh.png
og-comparisons-en.png
og-comparisons-zh.png
og-architectures-en.png
og-architectures-zh.png
```

## 7.3 locale

| locale | Description |
| ------ | ------ |
| en     | English |
| zh     | Traditional Chinese |

Because `ja` retains the existing `og-image.png`, it is not included in the initial new image scope.

---

## 8. In-Image Text Policy

## 8.1 Shared Rules

| Item | Policy |
| -------- | -------------------------------------------------------------------- |
| Site name     | AWS Cert Roadmap Lab                                                 |
| AWS service names | Retain official names or common abbreviations such as Amazon S3, AWS Lambda, and Amazon CloudFront            |
| Character count      | Keep short                                                                 |
| Message       | Show learning value and implementation understanding                                                         |
| Prohibited expressions     | exam dump / real exam questions / guaranteed pass / leaked questions |
| Readability      | Use text large enough to read in social previews on smartphones                                            |

## 8.2 Proposed English OGP Copy

| Item | Copy |
| --------- | ---------------------------------------------------------------------- |
| Main Copy | Learn AWS Certifications by Building                                   |
| Sub Copy  | Glossaries, comparisons, practice questions, and architecture diagrams |
| Site Name | AWS Cert Roadmap Lab                                                   |

## 8.3 Proposed Traditional Chinese OGP Copy (Original Specimens)

| Item | Copy |
| --------- | -------------------- |
| Main Copy | 用實作理解 AWS 認證學習       |
| Sub Copy  | 詞彙、比較、練習題與架構圖        |
| Site Name | AWS Cert Roadmap Lab |

---

## 9. Handoff Policy for Metadata Implementation

## 9.1 Work in P5-014

In P5-014, create and configure only one English OGP image.

```text
frontend/public/images/assets/og-image-en.png
```

The completion criteria are as follows.

* The English OGP image is created.
* `og:image` points to `og-image-en.png` on pages under `/en`.
* `npm run build` succeeds.

## 9.2 Work in P5-015

In P5-015, create and configure only one Traditional Chinese OGP image.

```text
frontend/public/images/assets/og-image-zh.png
```

The completion criteria are as follows.

* The Chinese OGP image is created.
* `og:image` points to `og-image-zh.png` on pages under `/zh`.
* `npm run build` succeeds.

## 9.3 Expected Metadata Helper Specification

The metadata helper selects the OGP image from the following inputs.

| Input | Example |
| ----------- | ------------------ |
| locale      | `ja` / `en` / `zh` |
| customImage | Specify only when an individual image exists      |

Do not use `pageType` to switch OGP images in the initial implementation.

---

## 10. OpenGraph locale

Use the following OpenGraph locales.

| locale | openGraph.locale |
| ------ | ---------------- |
| ja     | `ja_JP`          |
| en     | `en_US`          |
| zh     | `zh_TW`          |

---

## 11. Images Not to Create

Do not create the following in the initial implementation.

| Image not created | Reason |
| ------------- | ----------------------------- |
| Glossary category OGP   | Shared images suffice for initial traffic validation              |
| Comparison page category OGP | Create after sharing activity is established                   |
| Architecture diagram category OGP   | Create after the architecture diagram category grows               |
| Practice question category OGP  | Shared images suffice initially                   |
| Blog category OGP   | Create after leading articles are identified                 |
| Per-article OGP        | High creation and maintenance costs                   |
| Per-term OGP        | Would create too many images                     |
| OGP for `/zh-cn` | Phase 5 starts `/zh` with a Traditional Chinese orientation |
| Complete Japanese OGP redesign    | Avoid affecting existing pages               |

---

## 12. Criteria for Additions

Consider adding category-specific OGP images when the following conditions are met.

| Condition | Decision |
| --------------------------------------- | -------------- |
| English or Chinese pages receive at least 100 monthly impressions in Search Console | Consider category-specific OGP    |
| A specific category begins to be shared on social media or external sites              | Consider OGP for that category  |
| Architecture diagram pages become leading sources of international traffic                      | Prioritize architecture diagram OGP      |
| Comparison pages become leading sources of international traffic                       | Prioritize comparison OGP       |
| External links to individual blog articles increase                       | Consider individual OGP only for those articles |

---

## 13. Cost and Operations Policy

## 13.1 Cost Policy

| Item | Policy |
| ------------ | ----------------- |
| Image count          | Initially one English and one Chinese image     |
| Image size        | At most 300KB per image         |
| Storage location          | Store as static files in S3    |
| Delivery | Through CloudFront      |
| Invalidation | Limit target paths when replacing images |

## 13.2 Operations Policy

When replacing an image, check the following in order.

1. Confirm the image file exists locally.
2. `npm run build` succeeds.
3. The image is included in `out/images/assets/`.
4. After production deployment, the target image URL is accessible.
5. Check `og:image` in the browser's HTML output.
6. Check the display with an SNS Card Validator.

---

## 14. Verification

This task creates only a policy document, so it does not generate images or modify metadata.

Verification commands are as follows.

```bash
git status
git branch

npm --prefix frontend run typecheck
npm --prefix frontend run build

git diff
git status
```

Expected results are as follows.

* `docs/seo/p5-013-multilingual-ogp-policy.md` is added.
* `npm --prefix frontend run typecheck` succeeds.
* `npm --prefix frontend run build` succeeds.
* Existing page rendering and metadata implementation are unchanged.

---

## 15. Completion Assessment

P5-013 is complete when the following requirements are met.

* The initial English OGP image scope is limited to `og-image-en.png`.
* The initial Chinese OGP image scope is limited to `og-image-zh.png`.
* The policy retains the existing `og-image.png` for Japanese pages.
* The policy specifies shared English OGP for all pages under `/en`.
* The policy specifies shared Chinese OGP for all pages under `/zh`.
* Images not created in the initial implementation are explicit.
* Criteria for adding category-specific OGP images are explicit.
* Images to create in P5-014 / P5-015 are explicit.
* A policy limits image count and file size with AWS costs in mind.
