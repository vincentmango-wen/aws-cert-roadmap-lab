# AWS Cert Roadmap Lab 多言語対応方針設計書

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | 多言語対応方針設計書 |
| 対象プロダクト | AWS Cert Roadmap Lab |
| 対象フェーズ | Phase 5：グローバルSEO・ローカライゼーション |
| 対象タスク | P5-001 多言語対応方針確定 |
| 作成目的 | 英語・中国語対応の対象言語、URL、翻訳範囲、将来拡張方針を定義する |
| 実装前提 | Next.js / TypeScript / Static Export / S3 + CloudFront |
| 作成日 | 2026-06-10 |

---

## 2. 本設計書の目的

本設計書は、AWS Cert Roadmap Lab を日本語だけの学習サイトから、英語・中国語にも対応したグローバルSEO向け学習サイトへ拡張するための方針を定義する。

Phase 5の目的は、単なる翻訳ではない。

目的は以下である。

1. 英語圏・中国語圏からの検索流入を検証する
2. AWS資格学習サイトとして海外SEOの土台を作る
3. 日本語・英語・中国語の3言語で主要コンテンツを提供する
4. S3 + CloudFront の静的配信構成を維持し、低コスト運用を継続する
5. 将来の学習アプリ化・有料化前に、海外流入の可能性を検証する

---

## 3. 対象言語

### 3.1 初期対応言語

| locale | 表示言語 | URL Prefix | HTML lang | OGP locale | 対応方針 |
|---|---|---|---|---|---|
| ja | 日本語 | なし | ja | ja_JP | 既存URLを維持する |
| en | 英語 | /en | en | en_US | 英語圏SEO向けに追加する |
| zh | 繁体字中国語 | /zh | zh-Hant | zh_TW | 台湾・繁体字中国語圏向けに追加する |

### 3.2 日本語URLの扱い

日本語ページは既存URLを維持する。

例：

| コンテンツ | 日本語URL |
|---|---|
| トップ | / |
| 用語集 | /terms |
| 用語詳細 | /terms/s3 |
| 比較一覧 | /comparisons |
| 比較詳細 | /comparisons/s3-vs-ebs-vs-efs |
| 構成図一覧 | /architectures |
| 構成図詳細 | /architectures/static-site-s3-cloudfront |
| ブログ一覧 | /blog |
| ブログ詳細 | /blog/aws-free-tier-portfolio |
| About | /about |
| Privacy | /privacy |
| Disclaimer | /disclaimer |
| Contact | /contact |

理由：

- 既存インデックスを維持するため
- Search Console上の既存評価を壊さないため
- 既存内部リンクを最小修正で維持するため
- 日本語ユーザーにとってURLが短いまま使えるため

### 3.3 英語URLの扱い

英語ページは `/en` 配下に配置する。

例：

| コンテンツ | 英語URL |
|---|---|
| トップ | /en |
| 用語集 | /en/terms |
| 用語詳細 | /en/terms/s3 |
| 比較一覧 | /en/comparisons |
| 比較詳細 | /en/comparisons/s3-vs-ebs-vs-efs |
| 構成図一覧 | /en/architectures |
| 構成図詳細 | /en/architectures/static-site-s3-cloudfront |
| ブログ一覧 | /en/blog |
| ブログ詳細 | /en/blog/aws-free-tier-portfolio |
| About | /en/about |
| Privacy | /en/privacy |
| Disclaimer | /en/disclaimer |
| Contact | /en/contact |

### 3.4 中国語URLの扱い

中国語ページは `/zh` 配下に配置する。

初期は繁体字寄りの表現で開始する。

例：

| コンテンツ | 中国語URL |
|---|---|
| トップ | /zh |
| 用語集 | /zh/terms |
| 用語詳細 | /zh/terms/s3 |
| 比較一覧 | /zh/comparisons |
| 比較詳細 | /zh/comparisons/s3-vs-ebs-vs-efs |
| 構成図一覧 | /zh/architectures |
| 構成図詳細 | /zh/architectures/static-site-s3-cloudfront |
| ブログ一覧 | /zh/blog |
| ブログ詳細 | /zh/blog/aws-free-tier-portfolio |
| About | /zh/about |
| Privacy | /zh/privacy |
| Disclaimer | /zh/disclaimer |
| Contact | /zh/contact |

### 3.5 将来の中国語拡張

将来、簡体字中国語を追加する場合は `/zh-cn` を使う。

| locale | 表示言語 | URL Prefix | HTML lang | 用途 |
|---|---|---|---|---|
| zh | 繁体字中国語 | /zh | zh-Hant | 台湾・香港向け |
| zh-cn | 簡体字中国語 | /zh-cn | zh-Hans | 中国本土・簡体字圏向け |

初期段階では `/zh-cn` は実装しない。

理由：

- 初期翻訳コストを抑えるため
- 中国本土向けSEOは検索エンジン事情が異なるため
- まず台湾・繁体字中国語圏の反応を検証するため

---

## 4. 多言語対応の基本方針

### 4.1 方針一覧

| 方針 | 内容 |
|---|---|
| 日本語を基準言語にする | 既存の日本語コンテンツを原本とする |
| URL Prefix方式を採用する | 英語は /en、中国語は /zh とする |
| IP自動リダイレクトはしない | Googlebot、AdSense審査、ユーザー確認で挙動が読みにくくなるため |
| 同一コンテンツIDを維持する | s3、lambda、rds-vs-dynamodb などのslugは言語間で共通にする |
| 静的生成を維持する | S3 + CloudFrontで低コスト配信する |
| UI文言とコンテンツ本文を分ける | Header、Footer、CTAは辞書管理、記事本文はJSON / MDXで管理する |
| 翻訳APIの本番連携はしない | API費用、品質管理、誤訳リスクを避ける |
| AWS正式名称は翻訳しない | Amazon S3、AWS Lambdaなどは公式名称を維持する |

### 4.2 自動リダイレクト方針

IPアドレス、ブラウザ言語、国判定による自動リダイレクトは行わない。

許可する挙動：

- ユーザーが言語切替UIで明示的に移動する
- `/en` にアクセスしたユーザーには英語ページを表示する
- `/zh` にアクセスしたユーザーには中国語ページを表示する
- `/` にアクセスしたユーザーには日本語ページを表示する

禁止する挙動：

- 日本国外IPを強制的に `/en` へ飛ばす
- 中国語ブラウザを強制的に `/zh` へ飛ばす
- Googlebotにユーザーと違うURLを返す
- Cookie未設定ユーザーを勝手に別言語へ移動させる

理由：

- SEO評価を安定させるため
- ユーザーが表示言語を自分で選べるようにするため
- Search ConsoleでURL検証しやすくするため
- AdSense審査時の表示差分を避けるため

---

## 5. 翻訳対象範囲

### 5.1 Phase 5で翻訳する範囲

| 区分 | 対象 | 優先度 |
|---|---|---|
| 共通UI | Header、Footer、CTA、検索、フィルター | Must |
| 共通ページ | トップ、About、Privacy、Disclaimer | Must |
| 用語集 | 主要AWS用語30件 | Must |
| 比較記事 | 主要比較3本 | Should |
| 構成図記事 | 主要構成図3本 | Should |
| ブログ | 優先ブログ3本 | Should |
| Contact | 問い合わせ導線 | Should |
| 404 | 404表示 | Should |
| 模擬問題 | CLF問題30問 | Could |

### 5.2 最初に翻訳する共通ページ

| ページ | 英語URL | 中国語URL | 優先度 |
|---|---|---|---|
| トップ | /en | /zh | Must |
| About | /en/about | /zh/about | Must |
| Privacy | /en/privacy | /zh/privacy | Must |
| Disclaimer | /en/disclaimer | /zh/disclaimer | Must |
| Contact | /en/contact | /zh/contact | Should |
| 404 | /en/404 | /zh/404 | Should |

### 5.3 最初に翻訳するAWS用語

以下30件を最初の翻訳対象とする。

```text
IAM
S3
EC2
Lambda
VPC
RDS
DynamoDB
CloudFront
Route 53
CloudWatch
CloudTrail
API Gateway
SQS
SNS
EventBridge
EBS
EFS
ELB
Auto Scaling
ACM
KMS
WAF
AWS Budgets
Cost Explorer
Organizations
AWS Config
Secrets Manager
Systems Manager
CloudFormation
Cognito
```

### 5.4 最初に翻訳する比較記事

| slug | 日本語テーマ | 優先度 |
|---|---|---|
| s3-vs-ebs-vs-efs | S3 / EBS / EFS の違い | Should |
| rds-vs-dynamodb | RDS / DynamoDB の違い | Should |
| iam-user-role-policy | IAM User / Role / Policy の違い | Should |

### 5.5 最初に翻訳する構成図記事

| slug | 日本語テーマ | 優先度 |
|---|---|---|
| static-site-s3-cloudfront | S3 + CloudFront 静的サイト構成 | Should |
| serverless-api-basic | API Gateway + Lambda + DynamoDB 構成 | Should |
| three-tier-vpc | 3層Webアプリ構成 | Should |

### 5.6 最初に翻訳するブログ記事

| slug | 日本語テーマ | 優先度 |
|---|---|---|
| aws-cloud-practitioner-roadmap | AWS Cloud Practitionerとは？ | Should |
| aws-free-tier-portfolio | AWS無料枠でポートフォリオを作る方法 | Should |
| s3-cloudfront-static-site | S3 + CloudFrontで静的サイトを公開する方法 | Should |

### 5.7 Phase 5後半に回す範囲

| 対象 | 理由 |
|---|---|
| CLF問題30問の英語化 | 翻訳量が多く、品質確認に時間がかかるため |
| CLF問題30問の中国語化 | 試験用語の誤訳が起きやすいため |
| SAA問題の多言語化 | まず用語・比較・構成図のSEO検証を優先するため |
| PDF教材 | 流入検証前に教材化しても需要を判断できないため |
| 有料導線 | 海外流入と滞在を確認してから設計するため |

---

## 6. 翻訳しない範囲

### 6.1 Phase 5では実装しない機能

| 対象 | 理由 |
|---|---|
| Cognitoログイン | ローカライゼーション検証には不要 |
| 学習履歴保存 | ユーザー登録が必要になり、実装範囲が重くなる |
| Stripe決済 | 流入検証前に課金導線を作っても判断材料が少ない |
| 有料会員機能 | まず無料コンテンツで流入を検証する |
| 翻訳API本番連携 | API費用、品質管理コスト、誤訳リスクが増える |
| IPベース自動リダイレクト | SEOとAdSense審査で挙動が読みにくくなる |
| DynamoDBへのコンテンツ移行 | 静的JSON / MDXの方がSEO、速度、コストで有利 |
| WAF導入 | 現段階では固定費・運用負荷が増える |

### 6.2 AWS公式名称の扱い

AWSサービス名は翻訳しない。

例：

| NG | OK |
|---|---|
| 亞馬遜簡單儲存服務 | Amazon S3 |
| AWS拉姆達 | AWS Lambda |
| 雲端前端 | Amazon CloudFront |
| 動態資料庫 | Amazon DynamoDB |

中国語ページでは、必要な場合のみ説明文で補足する。

例：

```text
Amazon S3 是 AWS 的物件儲存服務。
```

---

## 7. SEO方針

### 7.1 canonical方針

各ページは自分自身をcanonicalにする。

| ページ | canonical |
|---|---|
| /terms/s3 | https://www.aws-cert-roadmap-lab.com/terms/s3 |
| /en/terms/s3 | https://www.aws-cert-roadmap-lab.com/en/terms/s3 |
| /zh/terms/s3 | https://www.aws-cert-roadmap-lab.com/zh/terms/s3 |

理由：

- 日本語、英語、中国語は別ページとして評価させるため
- 英語ページのcanonicalを日本語ページに向けると、英語ページが評価されにくくなるため

### 7.2 hreflang方針

同一コンテンツIDを持つページには、以下のhreflangを出力する。

例：S3用語詳細

```text
ja: /terms/s3
en: /en/terms/s3
zh-Hant: /zh/terms/s3
x-default: /terms/s3
```

出力例：

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 7.3 sitemap方針

`sitemap.xml` には日本語・英語・中国語URLを含める。

含める対象：

- 日本語URL
- 英語URL
- 中国語URL
- 用語詳細URL
- 比較詳細URL
- 構成図詳細URL
- ブログ詳細URL
- 共通ページURL

Phase 5完了時には、`out/en` と `out/zh` が生成され、sitemapに多言語URLが含まれる状態を目指す。

### 7.4 metadata方針

言語別に以下を出し分ける。

| 項目 | ja | en | zh |
|---|---|---|---|
| title | 日本語 | 英語 | 繁体字中国語 |
| description | 日本語 | 英語 | 繁体字中国語 |
| keywords | 日本語中心 | 英語SEOキーワード | 繁体字中国語SEOキーワード |
| openGraph.locale | ja_JP | en_US | zh_TW |
| html lang | ja | en | zh-Hant |

### 7.5 OGP方針

初期は既存OGP画像を共通利用する。

ただし、以下ページは将来言語別OGP画像を作る。

| ページ | OGP方針 |
|---|---|
| トップ | 言語別OGP画像を作る |
| 用語集一覧 | 言語別OGP画像を作る |
| 比較一覧 | 言語別OGP画像を作る |
| 構成図一覧 | 言語別OGP画像を作る |
| 優先ブログ記事 | 言語別OGP画像を作る |

---

## 8. コンテンツ管理方針

### 8.1 UI文言

UI文言は `src/i18n` 配下の辞書で管理する。

想定構成：

```text
frontend/src/i18n/
├── locales.ts
├── dictionaries/
│   ├── ja.ts
│   ├── en.ts
│   └── zh.ts
└── routes.ts
```

対象：

- Header
- Footer
- CTA
- 検索フォーム
- カテゴリフィルター
- パンくず
- ボタン
- エラーメッセージ
- 404文言

### 8.2 AWS用語データ

AWS用語はJSONを言語別に分ける。

想定構成：

```text
frontend/contents/terms/
├── terms.ja.json
├── terms.en.json
└── terms.zh.json
```

slugは言語間で共通にする。

例：

```text
s3
lambda
cloudfront
rds-vs-dynamodb
```

### 8.3 MDXコンテンツ

比較、構成図、ブログは言語別ディレクトリで管理する。

想定構成：

```text
frontend/contents/comparisons/
├── ja/
├── en/
└── zh/

frontend/contents/architectures/
├── ja/
├── en/
└── zh/

frontend/contents/blog/
├── ja/
├── en/
└── zh/
```

### 8.4 画像・SVG

画像とSVGは初期は共通利用する。

ただし、SVG内に日本語文言が入っている場合は、言語別SVGを作る。

想定構成：

```text
frontend/public/images/architectures/
├── ja/
├── en/
└── zh/
```

---

## 9. ルーティング方針

### 9.1 基本ルール

| 言語 | URL Prefix | 例 |
|---|---|---|
| ja | なし | /terms/s3 |
| en | /en | /en/terms/s3 |
| zh | /zh | /zh/terms/s3 |

### 9.2 slug方針

slugは英数字のまま共通化する。

例：

| コンテンツ | ja | en | zh |
|---|---|---|---|
| S3用語 | /terms/s3 | /en/terms/s3 | /zh/terms/s3 |
| Lambda用語 | /terms/lambda | /en/terms/lambda | /zh/terms/lambda |
| S3/EBS/EFS比較 | /comparisons/s3-vs-ebs-vs-efs | /en/comparisons/s3-vs-ebs-vs-efs | /zh/comparisons/s3-vs-ebs-vs-efs |

理由：

- 言語切替が実装しやすい
- sitemap生成が単純になる
- Search ConsoleでURL対応を確認しやすい
- AWS公式サービス名と相性が良い

---

## 10. 品質管理方針

### 10.1 翻訳品質

翻訳時は以下を守る。

1. AWSサービス正式名称は翻訳しない
2. AWS認定試験名は公式英語名を維持する
3. exam dump、本番問題、合格保証を連想させる表現を使わない
4. 中国語は初期は繁体字で統一する
5. 日本語原文と意味が変わる意訳をしない
6. 技術用語は表記ルール表に従う

### 10.2 禁止表現

以下の表現は使わない。

| 表現 | 理由 |
|---|---|
| exam dump | 試験規約違反を連想させる |
| real exam questions | 本番問題流用を連想させる |
| guaranteed pass | 合格保証はできない |
| official AWS exam questions | AWS公式問題と誤認される |
| leaked questions | 不正入手を連想させる |
| 100% pass | 合格保証に該当する |

### 10.3 免責文

問題・記事・構成図ページには、以下の方針を維持する。

```text
This site is an independent learning project and is not affiliated with Amazon Web Services.
```

中国語では以下を基準にする。

```text
本站是獨立學習專案，與 Amazon Web Services 無關。
```

---

## 11. 将来拡張方針

### 11.1 Phase 6で検討するもの

| 対象 | 方針 |
|---|---|
| Cognito | 学習履歴・マイページ導入時に検討する |
| 学習履歴 | 多言語流入を確認してから設計する |
| 有料教材 | 海外流入・滞在・クリックを確認してから設計する |
| PDF教材 | 英語・中国語の需要が見えてから作成する |
| `/zh-cn` | 簡体字需要が見えてから追加する |
| SES通知 | ユーザー登録後に検討する |
| WAF | Botや攻撃が増えた場合に導入を検討する |

### 11.2 判断基準

以下の条件を満たしたら、Phase 6へ進む。

| 項目 | 判断基準 |
|---|---|
| Search Console | `/en` `/zh` のURLがインデックス対象になる |
| GA | 英語圏・中国語圏からの流入が確認できる |
| 滞在 | 用語・比較・構成図ページで閲覧が発生している |
| 問い合わせ | 海外ユーザーからの問い合わせまたはクリックがある |
| コンテンツ品質 | 翻訳の表記揺れが管理できている |

---

## 12. 完了条件

P5-001は以下を満たしたら完了とする。

| 条件 | 判定 |
|---|---|
| 対象言語が定義されている | 必須 |
| URL Prefix方針が定義されている | 必須 |
| 日本語URL維持方針が定義されている | 必須 |
| 英語URL方針が定義されている | 必須 |
| 中国語URL方針が定義されている | 必須 |
| 翻訳対象範囲が定義されている | 必須 |
| 翻訳しない範囲が定義されている | 必須 |
| SEO方針が定義されている | 必須 |
| コンテンツ管理方針が定義されている | 必須 |
| 将来拡張方針が定義されている | 必須 |

---

## 13. 次タスクへの接続

P5-001完了後は、以下の順で進める。

1. P5-002 多言語URL設計
2. P5-003 i18nディレクトリ設計
3. P5-004 locale定義実装
4. P5-005 UI辞書ファイル作成
5. P5-006 言語切替UI実装
6. P5-007 多言語ルーティング基盤作成

P5-002では、本設計書のURL方針をもとに、Next.js App Router上の具体的なディレクトリ構成を決める。
