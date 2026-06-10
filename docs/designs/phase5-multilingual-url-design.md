# Phase 5 多言語URL設計書

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | Phase 5 多言語URL設計書 |
| 対象プロダクト | AWS Cert Roadmap Lab / AWS資格ロードマップラボ |
| 対象フェーズ | Phase 5 グローバルSEO・ローカライゼーション |
| 対象タスク | P5-002 多言語URL設計 |
| 目的 | 日本語・英語・中国語ページのURLルールを定義し、後続のi18n実装、metadata、hreflang、sitemap実装の前提を固定する |
| 作成日 | 2026-06-11 |

---

## 2. 背景

Phase 5では、既存の日本語AWS資格学習サイトを、英語・中国語にも展開する。

目的は単なる翻訳ではなく、英語圏・中国語圏からの検索流入を検証し、AWS資格学習サイトとしてグローバルSEOの土台を作ることである。

既存サイトは日本語URLで公開済みのため、日本語URLは変更しない。

---

## 3. 基本方針

| 方針 | 内容 |
|---|---|
| 日本語URLは既存維持 | 既存インデックス、内部リンク、Search Console評価を壊さない |
| 英語は `/en` 配下 | 英語ページはすべて `/en` から始める |
| 中国語は `/zh` 配下 | 初期は繁体字寄りの中国語として `/zh` を使う |
| slugは原則共通 | `s3`、`rds-vs-dynamodb` などのIDは言語間で共通にする |
| 自動リダイレクトしない | IPやブラウザ言語による強制リダイレクトは行わない |
| 言語切替は同一コンテンツIDで行う | `/terms/s3`、`/en/terms/s3`、`/zh/terms/s3` を相互に切り替える |
| 静的生成を維持 | S3 + CloudFrontで配信できる静的URLにする |
| 将来拡張を考慮 | 将来 `/zh-cn`、`/zh-tw` を追加できる設計にする |

---

## 4. locale定義方針

### 4.1 初期対応locale

| locale | URL prefix | 表示言語 | 用途 |
|---|---|---|---|
| `ja` | なし | 日本語 | 既存ページ |
| `en` | `/en` | English | 英語圏SEO |
| `zh` | `/zh` | 繁体字寄り中国語 | 台湾・香港・繁体字圏の初期検証 |

### 4.2 将来追加候補

| locale | URL prefix | 用途 |
|---|---|---|
| `zh-tw` | `/zh-tw` | 台湾向け繁体字に分離する場合 |
| `zh-cn` | `/zh-cn` | 中国大陸向け簡体字に分離する場合 |
| `ko` | `/ko` | 韓国語対応する場合 |

### 4.3 初期で `/zh` を使う理由

初期段階では、中国語圏の流入検証を小さく始める。

そのため、最初から `/zh-tw` と `/zh-cn` に分けない。

理由は以下である。

1. 翻訳・表記管理の工数を抑える
2. Search Consoleで中国語圏流入の有無を先に確認する
3. 簡体字版を作る前に、繁体字コンテンツの反応を見る
4. 後から `/zh-cn` を追加しても、`/zh` を繁体字代表URLとして維持できる

---

## 5. URL全体ルール

### 5.1 基本形

| 言語 | トップURL | URL例 |
|---|---|---|
| 日本語 | `/` | `/terms/s3` |
| 英語 | `/en` | `/en/terms/s3` |
| 中国語 | `/zh` | `/zh/terms/s3` |

### 5.2 末尾スラッシュ

アプリ内リンクでは末尾スラッシュなしを基本表記にする。

```text
OK: /en/terms/s3
NG: /en/terms/s3/
```

ただし、Next.js static exportの出力は以下のようなディレクトリ構造になる可能性がある。

```text
out/en/terms/s3/index.html
```

ブラウザ上のURL表記は末尾スラッシュなしに統一する。

### 5.3 大文字小文字

URLはすべて小文字にする。

```text
OK: /en/terms/api-gateway
NG: /en/terms/API-Gateway
NG: /en/terms/ApiGateway
```

### 5.4 slug文字種

slugは以下のみ許可する。

```text
a-z
0-9
-
```

許可例：

```text
s3
api-gateway
s3-vs-ebs-vs-efs
static-site-s3-cloudfront
aws-free-tier-portfolio
```

禁止例：

```text
S3
api_gateway
s3 vs ebs
s3-vs-ebs-vs-efs?
```

---

## 6. ページ種別別URL設計

### 6.1 トップページ

| 言語 | URL |
|---|---|
| 日本語 | `/` |
| 英語 | `/en` |
| 中国語 | `/zh` |

### 6.2 学習ロードマップ

| 言語 | URL |
|---|---|
| 日本語 | `/roadmap` |
| 英語 | `/en/roadmap` |
| 中国語 | `/zh/roadmap` |

### 6.3 AWS用語集一覧

| 言語 | URL |
|---|---|
| 日本語 | `/terms` |
| 英語 | `/en/terms` |
| 中国語 | `/zh/terms` |

### 6.4 AWS用語詳細

| 言語 | URL例 |
|---|---|
| 日本語 | `/terms/s3` |
| 英語 | `/en/terms/s3` |
| 中国語 | `/zh/terms/s3` |

#### slugルール

用語詳細のslugは `termId` を使う。

```text
s3
iam
lambda
cloudfront
api-gateway
dynamodb
```

言語ごとにslugを翻訳しない。

```text
OK: /en/terms/cloudfront
OK: /zh/terms/cloudfront
NG: /zh/terms/雲端前端
```

### 6.5 模擬問題トップ

| 言語 | URL |
|---|---|
| 日本語 | `/questions` |
| 英語 | `/en/questions` |
| 中国語 | `/zh/questions` |

### 6.6 CLF模擬問題一覧

| 言語 | URL |
|---|---|
| 日本語 | `/questions/clf` |
| 英語 | `/en/questions/clf` |
| 中国語 | `/zh/questions/clf` |

### 6.7 模擬問題詳細

| 言語 | URL例 |
|---|---|
| 日本語 | `/questions/clf-001` |
| 英語 | `/en/questions/clf-001` |
| 中国語 | `/zh/questions/clf-001` |

#### slugルール

問題IDは言語間で共通にする。

```text
clf-001
clf-002
saa-001
```

問題文は翻訳しても、問題IDは変更しない。

### 6.8 サービス比較一覧

| 言語 | URL |
|---|---|
| 日本語 | `/comparisons` |
| 英語 | `/en/comparisons` |
| 中国語 | `/zh/comparisons` |

### 6.9 サービス比較詳細

| 言語 | URL例 |
|---|---|
| 日本語 | `/comparisons/s3-vs-ebs-vs-efs` |
| 英語 | `/en/comparisons/s3-vs-ebs-vs-efs` |
| 中国語 | `/zh/comparisons/s3-vs-ebs-vs-efs` |

#### slugルール

比較記事slugは英語ベースのまま共通利用する。

```text
s3-vs-ebs-vs-efs
rds-vs-dynamodb
sns-vs-sqs-vs-eventbridge
iam-user-vs-role-vs-policy
cloudwatch-vs-cloudtrail-vs-config
```

### 6.10 構成図一覧

| 言語 | URL |
|---|---|
| 日本語 | `/architectures` |
| 英語 | `/en/architectures` |
| 中国語 | `/zh/architectures` |

### 6.11 構成図詳細

| 言語 | URL例 |
|---|---|
| 日本語 | `/architectures/static-site-s3-cloudfront` |
| 英語 | `/en/architectures/static-site-s3-cloudfront` |
| 中国語 | `/zh/architectures/static-site-s3-cloudfront` |

#### slugルール

構成図slugは英語ベースのまま共通利用する。

```text
static-site-s3-cloudfront
serverless-api-basic
three-tier-vpc
high-availability-web-app
eventbridge-lambda-batch
```

### 6.12 ブログ一覧

| 言語 | URL |
|---|---|
| 日本語 | `/blog` |
| 英語 | `/en/blog` |
| 中国語 | `/zh/blog` |

### 6.13 ブログ詳細

| 言語 | URL例 |
|---|---|
| 日本語 | `/blog/aws-free-tier-portfolio` |
| 英語 | `/en/blog/aws-free-tier-portfolio` |
| 中国語 | `/zh/blog/aws-free-tier-portfolio` |

#### slugルール

初期はブログslugも言語間で共通にする。

理由は以下である。

1. 同一コンテンツIDで言語切替しやすい
2. sitemap生成が単純になる
3. 内部リンク管理が楽になる
4. 日本語URLも既に英語slug中心で設計されている

将来、英語SEO専用記事を追加する場合は、英語専用slugを許可する。

例：

```text
/en/blog/aws-cloud-practitioner-study-guide
```

ただし、その場合は日本語・中国語に対応ページがない単独記事として扱う。

### 6.14 問い合わせ

| 言語 | URL |
|---|---|
| 日本語 | `/contact` |
| 英語 | `/en/contact` |
| 中国語 | `/zh/contact` |

### 6.15 運営者情報

| 言語 | URL |
|---|---|
| 日本語 | `/about` |
| 英語 | `/en/about` |
| 中国語 | `/zh/about` |

### 6.16 プライバシーポリシー

| 言語 | URL |
|---|---|
| 日本語 | `/privacy` |
| 英語 | `/en/privacy` |
| 中国語 | `/zh/privacy` |

### 6.17 免責事項

| 言語 | URL |
|---|---|
| 日本語 | `/disclaimer` |
| 英語 | `/en/disclaimer` |
| 中国語 | `/zh/disclaimer` |

### 6.18 GitHub誘導ページ

| 言語 | URL |
|---|---|
| 日本語 | `/github` |
| 英語 | `/en/github` |
| 中国語 | `/zh/github` |

GitHub誘導ページは任意ページである。

---

## 7. 多言語化対象外URL

### 7.1 初期では多言語化しないURL

以下はPhase 5初期では作らない。

| URL | 理由 |
|---|---|
| `/login` | Phase 6以降の学習アプリ化対象 |
| `/signup` | Phase 6以降の学習アプリ化対象 |
| `/mypage` | 認証が必要 |
| `/mypage/progress` | 認証が必要 |
| `/mypage/review` | 認証が必要 |
| `/pricing` | 有料化前のため不要 |
| `/materials` | 教材販売前のため不要 |

### 7.2 404ページ

404ページは多言語化する。

ただしURLは固定ルートを作らず、Next.jsの `not-found.tsx` または各locale配下の404表示で対応する。

想定表示：

| 言語 | 表示 |
|---|---|
| 日本語 | ページが見つかりません |
| 英語 | Page not found |
| 中国語 | 找不到頁面 |

---

## 8. 言語切替URLルール

### 8.1 同一コンテンツが存在する場合

現在ページと同じslugで言語prefixだけを切り替える。

例：

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

### 8.2 翻訳ページが存在しない場合

翻訳ページがまだ存在しない場合は、該当言語の一覧ページへ遷移する。

例：

```text
現在: /blog/aws-free-tier-portfolio
英語版記事なし: /en/blog
中国語版記事なし: /zh/blog
```

### 8.3 トップページの切替

| 現在 | 日本語 | 英語 | 中国語 |
|---|---|---|---|
| `/` | `/` | `/en` | `/zh` |
| `/en` | `/` | `/en` | `/zh` |
| `/zh` | `/` | `/en` | `/zh` |

### 8.4 言語切替でクエリパラメータは引き継がない

検索・フィルター条件は言語ごとに文言が異なるため、初期実装ではクエリパラメータを引き継がない。

例：

```text
/terms?category=Storage
→ /en/terms
```

---

## 9. canonical設計方針

### 9.1 基本方針

各言語ページは、それぞれ自分自身をcanonicalにする。

| ページ | canonical |
|---|---|
| `/terms/s3` | `https://www.aws-cert-roadmap-lab.com/terms/s3` |
| `/en/terms/s3` | `https://www.aws-cert-roadmap-lab.com/en/terms/s3` |
| `/zh/terms/s3` | `https://www.aws-cert-roadmap-lab.com/zh/terms/s3` |

### 9.2 理由

日本語・英語・中国語は翻訳関係にあるが、検索エンジン上は別言語の別ページとして扱う。

そのため、英語ページのcanonicalを日本語ページに向けない。

---

## 10. hreflang設計方針

### 10.1 対応言語

| locale | hreflang |
|---|---|
| `ja` | `ja` |
| `en` | `en` |
| `zh` | `zh-Hant` |
| default | `x-default` |

### 10.2 出力例

対象コンテンツ：

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

出力する対応関係：

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/" />
```

### 10.3 x-default方針

初期は `x-default` を日本語トップページ `/` にする。

理由は以下である。

1. 既存サイトの主言語が日本語である
2. 日本語URLが既存の基準URLである
3. IPベース自動リダイレクトを使わないため、トップからユーザーが言語を選べる

将来的に言語選択専用ページを作る場合は、`x-default` をそのページに変更する。

---

## 11. sitemap設計方針

### 11.1 sitemapに含めるURL

Phase 5では、以下をsitemapに含める。

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

### 11.2 sitemapに含めないURL

```text
/login
/signup
/mypage
/mypage/progress
/mypage/review
/pricing
/materials
```

### 11.3 sitemap生成時の注意

翻訳データが未作成のURLはsitemapに含めない。

例：

```text
/en/blog/aws-free-tier-portfolio
```

この英語記事が未作成なら、sitemapに出さない。

---

## 12. 内部リンク設計方針

### 12.1 同一言語内リンクを優先

英語ページ内の内部リンクは英語URLへ遷移する。

```text
OK: /en/terms/s3 → /en/comparisons/s3-vs-ebs-vs-efs
NG: /en/terms/s3 → /comparisons/s3-vs-ebs-vs-efs
```

中国語ページ内の内部リンクは中国語URLへ遷移する。

```text
OK: /zh/terms/s3 → /zh/comparisons/s3-vs-ebs-vs-efs
NG: /zh/terms/s3 → /comparisons/s3-vs-ebs-vs-efs
```

### 12.2 翻訳ページがない場合

翻訳ページがない場合は、同一言語の一覧ページへ戻す。

例：

```text
/en/terms/s3 → /en/comparisons
/zh/terms/s3 → /zh/comparisons
```

---

## 13. 実装時のルーティング候補

### 13.1 推奨ルーティング構成

Next.js App Routerでは、以下のようにlocale別セグメントを作る。

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

### 13.2 将来の代替案

将来的に実装量が増えた場合は、以下の動的localeルートへ移行する。

```text
frontend/src/app/[locale]/
```

ただし、日本語URLにprefixを付けない要件があるため、初期実装では明示的に `/en` `/zh` を持つ構成の方が理解しやすい。

---

## 14. Search Console設計方針

### 14.1 URLプレフィックス確認対象

Search Consoleでは、以下を確認対象にする。

```text
https://www.aws-cert-roadmap-lab.com/
https://www.aws-cert-roadmap-lab.com/en/
https://www.aws-cert-roadmap-lab.com/zh/
```

ドメインプロパティで管理している場合でも、URL検査では `/en` `/zh` のインデックス状況を個別確認する。

### 14.2 確認観点

| 項目 | 確認内容 |
|---|---|
| インデックス | `/en` `/zh` がインデックス対象になっているか |
| sitemap | sitemapに多言語URLが含まれているか |
| 重複 | canonicalが誤って日本語URLに向いていないか |
| hreflang | 言語別ページの対応関係が正しいか |
| noindex | 多言語ページに誤ってnoindexが付いていないか |

---

## 15. 受け入れ条件

P5-002の完了条件は以下とする。

- 日本語URLを既存維持する方針が明記されている
- 英語URLは `/en` 配下と定義されている
- 中国語URLは `/zh` 配下と定義されている
- 主要ページの日本語・英語・中国語URL対応表がある
- 詳細ページのslug共通化ルールが定義されている
- 多言語化しないURLが明記されている
- 言語切替URLルールが定義されている
- canonical方針が定義されている
- hreflang方針が定義されている
- sitemap対象URL方針が定義されている
- 後続タスクP5-003、P5-004、P5-007、P5-009、P5-011に渡せる状態である

---

## 16. 後続タスクへの引き渡し

| 後続タスク | 引き渡す内容 |
|---|---|
| P5-003 i18nディレクトリ設計 | locale、URL prefix、slug共通化ルール |
| P5-004 locale定義実装 | `ja` `en` `zh` のlocale仕様 |
| P5-006 言語切替UI実装 | 同一slugでの言語切替ルール |
| P5-007 多言語ルーティング基盤作成 | `/en` `/zh` 配下のページ構成 |
| P5-009 canonical / hreflang 設計 | canonical、hreflang、x-default方針 |
| P5-011 多言語sitemap生成対応 | sitemap対象URLと除外URL |
