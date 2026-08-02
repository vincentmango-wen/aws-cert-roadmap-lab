# Phase 5 canonical / hreflang 設計書

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | Phase 5 canonical / hreflang 設計書 |
| 対象プロダクト | AWS資格ロードマップラボ |
| 対象タスク | P5-009 |
| 対象フェーズ | Phase 5 グローバルSEO・ローカライゼーション |
| 目的 | 日本語・英語・中国語ページに対して、canonical と hreflang を正しく出す仕様を定義する |
| 対象技術 | Next.js App Router / Metadata API / Static Export |
| 作成日 | 2026-06-12 |

---

## 2. 背景

Phase 5 では、日本語ページを既存URLのまま維持し、英語ページを `/en`、中国語ページを `/zh` 配下に追加する。

多言語ページを追加すると、同じテーマのページが複数URLで存在する。

例：

```text
/terms/s3
/en/terms/s3
/zh/terms/s3
```

検索エンジンに対して、これらが重複ページではなく「言語違いの代替ページ」であることを伝える必要がある。

そのため、各ページで以下を出力する。

- canonical
- hreflang
- x-default

---

## 3. 対象言語

| 内部locale | URL prefix | HTML lang | hreflang | 表示言語 | 備考 |
|---|---|---|---|---|---|
| ja | なし | ja | ja | 日本語 | 既存URLを維持 |
| en | /en | en | en | English | 英語圏向け |
| zh | /zh | zh | zh-Hant | 繁體中文寄り | 将来 `/zh-cn` を追加可能 |

### 3.1 中国語の扱い

URLは既存WBSどおり `/zh` とする。

ただし、コンテンツは繁体字寄りで開始するため、hreflang は `zh-Hant` を基本とする。

将来、簡体字中国語を追加する場合は以下に分ける。

| 用途 | URL | hreflang |
|---|---|---|
| 繁体字中国語 | /zh | zh-Hant |
| 簡体字中国語 | /zh-cn | zh-Hans |

---

## 4. URL設計

### 4.1 基本ルール

| ページ種別 | 日本語 | 英語 | 中国語 |
|---|---|---|---|
| トップ | / | /en | /zh |
| 用語集一覧 | /terms | /en/terms | /zh/terms |
| 用語詳細 | /terms/s3 | /en/terms/s3 | /zh/terms/s3 |
| 比較一覧 | /comparisons | /en/comparisons | /zh/comparisons |
| 比較詳細 | /comparisons/s3-vs-ebs-vs-efs | /en/comparisons/s3-vs-ebs-vs-efs | /zh/comparisons/s3-vs-ebs-vs-efs |
| 構成図一覧 | /architectures | /en/architectures | /zh/architectures |
| 構成図詳細 | /architectures/static-site-s3-cloudfront | /en/architectures/static-site-s3-cloudfront | /zh/architectures/static-site-s3-cloudfront |
| ブログ一覧 | /blog | /en/blog | /zh/blog |
| ブログ詳細 | /blog/aws-cloud-practitioner-roadmap | /en/blog/aws-cloud-practitioner-roadmap | /zh/blog/aws-cloud-practitioner-roadmap |
| ロードマップ | /roadmap | /en/roadmap | /zh/roadmap |
| About | /about | /en/about | /zh/about |
| Privacy | /privacy | /en/privacy | /zh/privacy |
| Disclaimer | /disclaimer | /en/disclaimer | /zh/disclaimer |
| Contact | /contact | /en/contact | /zh/contact |

### 4.2 URL末尾スラッシュ方針

canonical URLでは末尾スラッシュを付けない。

例外はトップページ `/` のみ。

| 入力 | canonical |
|---|---|
| /terms/ | /terms |
| /en/terms/ | /en/terms |
| /zh/terms/ | /zh/terms |
| / | / |

---

## 5. canonical 設計

### 5.1 基本方針

canonical は、現在表示している言語ページ自身を指す。

言語違いページを日本語へ canonical 集約しない。

理由：

- 英語ページは英語検索で評価させたい
- 中国語ページは中国語検索で評価させたい
- 言語違いページは重複ではなく代替ページとして扱うべきだから

### 5.2 canonical 例

#### 日本語ページ

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

#### 英語ページ

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
```

#### 中国語ページ

```html
<link rel="canonical" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
```

---

## 6. hreflang 設計

### 6.1 基本方針

同一コンテンツIDを持つページでは、全言語URLを hreflang に出す。

例：

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 6.2 hreflang 出力対象

| ページ | hreflang対象 |
|---|---|
| トップページ | 対象 |
| 用語集一覧 | 対象 |
| 用語詳細 | 対象 |
| 比較一覧 | 対象 |
| 比較詳細 | 対象 |
| 構成図一覧 | 対象 |
| 構成図詳細 | 対象 |
| ブログ一覧 | 対象 |
| ブログ詳細 | 対象 |
| ロードマップ | 対象 |
| About | 対象 |
| Privacy | 対象 |
| Disclaimer | 対象 |
| Contact | 対象 |
| 404 | 対象外 |
| robots.txt | 対象外 |
| sitemap.xml | 対象外 |

### 6.3 翻訳未作成ページの扱い

翻訳ページが未作成の場合、その言語の hreflang は出力しない。

例：

日本語と英語だけ存在し、中国語が未作成の場合：

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

存在しない `/zh/...` を hreflang に出してはいけない。

理由：

- Search Consoleで代替ページエラーが出る
- ユーザーが404へ誘導される
- SEO品質が落ちる

---

## 7. x-default 設計

### 7.1 基本方針

x-default は日本語URLを指す。

理由：

- 既存の主コンテンツが日本語である
- 日本語URLを既存維持する方針である
- IPベース自動リダイレクトは導入しない
- `/` を言語選択ページにしない

### 7.2 x-default 例

```html
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 7.3 将来変更条件

以下の条件を満たした場合、x-default を専用の言語選択ページに変更してよい。

- `/language` または `/intl` のような言語選択ページを作成する
- 日本語・英語・中国語の主要ページがすべて揃っている
- Search Console上で多言語インデックスが安定している

---

## 8. Next.js Metadata 実装方針

### 8.1 P5-010で作成する想定関数

P5-010では、以下の helper を作る。

```ts
createLocalizedPageMetadata(input)
```

この helper は以下を返す。

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

### 8.2 入力項目案

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

### 8.3 availableLocales の考え方

`availableLocales` は、そのページが実際に存在する言語だけを渡す。

例：

```ts
availableLocales: ["ja", "en", "zh"]
```

翻訳未作成ページでは以下にする。

```ts
availableLocales: ["ja", "en"]
```

---

## 9. URL生成ルール

### 9.1 locale別URL生成

| locale | 入力path | 出力path |
|---|---|---|
| ja | /terms/s3 | /terms/s3 |
| en | /terms/s3 | /en/terms/s3 |
| zh | /terms/s3 | /zh/terms/s3 |

### 9.2 トップページ例外

| locale | 入力path | 出力path |
|---|---|---|
| ja | / | / |
| en | / | /en |
| zh | / | /zh |

### 9.3 二重prefix防止

以下の入力を受け取った場合も、二重prefixにしない。

| locale | 入力path | 出力path |
|---|---|---|
| en | /en/terms/s3 | /en/terms/s3 |
| zh | /zh/terms/s3 | /zh/terms/s3 |
| ja | /en/terms/s3 | /terms/s3 |
| ja | /zh/terms/s3 | /terms/s3 |

---

## 10. OGP locale 方針

### 10.1 locale変換

| locale | Open Graph locale |
|---|---|
| ja | ja_JP |
| en | en_US |
| zh | zh_TW |

### 10.2 alternateLocale

OGPには他言語を `alternateLocale` として出す。

例：

```ts
openGraph: {
  locale: "en_US",
  alternateLocale: ["ja_JP", "zh_TW"]
}
```

---

## 11. sitemap連携方針

P5-011では、sitemapにも多言語URLを含める。

最低限、以下を満たす。

- 日本語URLが含まれる
- 英語URLが含まれる
- 中国語URLが含まれる
- canonicalと同じURL形式にする
- 存在しない翻訳ページは含めない
- `lastModified` を出せる場合は出す

---

## 12. 実装対象外

P5-009では以下を実装しない。

- metadata helper のコード実装
- sitemap生成コードの修正
- OGP画像作成
- 翻訳コンテンツ追加
- 言語切替UIの修正
- IPベース自動リダイレクト
- CloudFront Function によるリダイレクト

---

## 13. 受け入れ条件

| ID | 条件 |
|---|---|
| AC-P5-009-001 | 日本語・英語・中国語のURLルールが定義されている |
| AC-P5-009-002 | canonical は現在表示中の言語URLを指す方針になっている |
| AC-P5-009-003 | hreflang は実在する翻訳ページだけを出す方針になっている |
| AC-P5-009-004 | x-default は日本語URLを指す方針になっている |
| AC-P5-009-005 | トップページ `/` `/en` `/zh` の扱いが定義されている |
| AC-P5-009-006 | P5-010 の metadata helper 実装方針につながる入力項目が定義されている |
| AC-P5-009-007 | P5-011 の多言語sitemap方針につながるURLルールが定義されている |

---

## 14. 後続タスクへの引き継ぎ

| タスク | 引き継ぎ内容 |
|---|---|
| P5-010 | `createLocalizedPageMetadata` を実装する |
| P5-011 | sitemapに日本語・英語・中国語URLを含める |
| P5-012 | `x-default` を metadata helper に含める |
| P5-013 | locale別OGP方針を決める |
| P5-016以降 | 各ページのmetadata生成時にlocaleとavailableLocalesを渡す |

---

## 15. 実装時の注意点

- canonical に存在しないURLを指定しない
- hreflang に存在しない翻訳ページを指定しない
- 英語ページを日本語ページへ canonical 集約しない
- 中国語ページを日本語ページへ canonical 集約しない
- `/en/en/...` や `/zh/zh/...` のような二重prefixを作らない
- IPベースの自動リダイレクトは行わない
- Search Console確認前に大量ページを一気に増やしすぎない
