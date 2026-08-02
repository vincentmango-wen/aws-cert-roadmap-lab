# P5-013 多言語OGP方針決定

## 1. 文書情報

| 項目     | 内容                                             |
| ------ | ---------------------------------------------- |
| タスクID  | P5-013                                         |
| タスク名   | 多言語OGP方針決定                                     |
| 対象フェーズ | Phase 5 グローバルSEO・ローカライゼーション                    |
| 対象サイト  | AWS Cert Roadmap Lab                           |
| 対象言語   | 日本語 / 英語 / 繁体字中国語                              |
| 主な利用箇所 | Next.js metadata / Open Graph / SNS共有 / 検索流入導線 |
| 作成目的   | 英語・中国語ページで使用するOGP画像の最小構成、使用ルール、追加判断基準を決めるため    |

---

## 2. 前提

## 2.1 URL方針

| 言語     | URL方針      | 例              |
| ------ | ---------- | -------------- |
| 日本語    | 既存URLを維持する | `/terms/s3`    |
| 英語     | `/en` を付ける | `/en/terms/s3` |
| 繁体字中国語 | `/zh` を付ける | `/zh/terms/s3` |

## 2.2 OGP画像の配置場所

OGP画像は以下に配置する。

```text
frontend/public/images/assets/
```

公開URLでは以下のように参照する。

```text
/images/assets/{fileName}
```

## 2.3 画像形式

| 項目        | 方針                                            |
| --------- | --------------------------------------------- |
| 推奨サイズ     | 1200 x 630 px                                 |
| 形式        | PNG                                           |
| 目標ファイルサイズ | 1枚300KB以下                                     |
| 背景        | AWS学習サイトとして信頼感が出るシンプルな背景                      |
| 文字        | 各言語の自然な短文                                     |
| 禁止        | 合格保証、本番問題、exam dump、leaked questions を連想させる表現 |

---

## 3. 基本方針

## 3.1 初期実装方針

多言語OGP画像は、初期実装では英語・中国語それぞれ1枚ずつの共通画像のみ作成する。

理由は以下である。

1. Phase 5の主目的は海外流入検証であり、OGP画像の大量作成ではない
2. 画像数を増やすと作成・翻訳・差し替え確認の作業量が増える
3. S3保存量とCloudFront転送量を増やさない
4. 既存の日本語OGP画像を維持し、既存ページへの影響を避ける
5. P5-014 / P5-015 を小さい実装単位に分けて進める

## 3.2 初期実装で作成する画像

初期実装で作成する画像は以下の2枚のみとする。

```text
frontend/public/images/assets/og-image-en.png
frontend/public/images/assets/og-image-zh.png
```

## 3.3 日本語ページの扱い

日本語ページは既存のOGP画像を維持する。

```text
frontend/public/images/assets/og-image.png
```

---

## 4. OGP画像スコープ

## 4.1 Must：初期実装対象

| 言語     | 対象URL         | 使用画像                             | 対象範囲     |
| ------ | ------------- | -------------------------------- | -------- |
| 日本語    | `/` 配下の既存ページ  | `/images/assets/og-image.png`    | 既存実装を維持  |
| 英語     | `/en` 配下の全ページ | `/images/assets/og-image-en.png` | 英語ページ共通  |
| 繁体字中国語 | `/zh` 配下の全ページ | `/images/assets/og-image-zh.png` | 中国語ページ共通 |

## 4.2 Should：流入確認後に追加検討

以下は初期実装では作成しない。

| ページ種別  | 英語画像候補                    | 中国語画像候補                   | 追加判断基準                                    |
| ------ | ------------------------- | ------------------------- | ----------------------------------------- |
| 用語集    | `og-terms-en.png`         | `og-terms-zh.png`         | `/en/terms` または `/zh/terms` の表示回数が月100回以上 |
| サービス比較 | `og-comparisons-en.png`   | `og-comparisons-zh.png`   | 比較ページがSNSまたは外部サイトで共有され始めた場合               |
| 構成図    | `og-architectures-en.png` | `og-architectures-zh.png` | 構成図ページが海外流入の上位カテゴリになった場合                  |
| 模擬問題   | `og-questions-en.png`     | `og-questions-zh.png`     | 問題ページの検索表示回数が月100回以上                      |
| ブログ    | `og-blog-en.png`          | `og-blog-zh.png`          | 英語・中国語ブログ記事が検索流入上位になった場合                  |

## 4.3 Later：個別ページOGP

以下はPhase 5初期では作成しない。

| 対象            | 方針   | 追加判断基準                         |
| ------------- | ---- | ------------------------------ |
| 用語詳細ごとの個別OGP  | 作らない | Search Consoleで流入上位10件が判明したら検討 |
| 比較記事ごとの個別OGP  | 作らない | SNS共有または外部被リンクが確認できた記事のみ検討     |
| ブログ記事ごとの個別OGP | 作らない | 上位記事10本に絞って検討                  |
| 構成図ごとの個別OGP   | 作らない | 構成図カテゴリが差別化要素として伸びたら検討         |

---

## 5. 使用ルール

## 5.1 英語ページ

`/en` 配下のページは、すべて以下の画像を使用する。

```text
/images/assets/og-image-en.png
```

対象例：

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

## 5.2 繁体字中国語ページ

`/zh` 配下のページは、すべて以下の画像を使用する。

```text
/images/assets/og-image-zh.png
```

対象例：

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

## 5.3 日本語ページ

日本語ページは既存の画像を使用する。

```text
/images/assets/og-image.png
```

対象例：

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

## 6. fallbackルール

metadata helperでは、以下の優先順位でOGP画像を決定する。

```text
1. customImage が指定されている場合は customImage を使用する
2. locale が en の場合は /images/assets/og-image-en.png を使用する
3. locale が zh の場合は /images/assets/og-image-zh.png を使用する
4. locale が ja の場合は /images/assets/og-image.png を使用する
5. locale 判定に失敗した場合は /images/assets/og-image.png を使用する
```

初期実装では、`pageType` ごとの画像切り替えは行わない。

---

## 7. 画像ファイル命名規則

## 7.1 初期実装

| ファイル名             | 用途               |
| ----------------- | ---------------- |
| `og-image.png`    | 日本語ページ共通。既存画像を維持 |
| `og-image-en.png` | 英語ページ共通          |
| `og-image-zh.png` | 繁体字中国語ページ共通      |

## 7.2 将来拡張時の命名規則

カテゴリ別OGPを追加する場合は、以下の形式を使う。

```text
og-{pageType}-{locale}.png
```

例：

```text
og-terms-en.png
og-terms-zh.png
og-comparisons-en.png
og-comparisons-zh.png
og-architectures-en.png
og-architectures-zh.png
```

## 7.3 locale

| locale | 内容     |
| ------ | ------ |
| en     | 英語     |
| zh     | 繁体字中国語 |

`ja` は既存画像 `og-image.png` を維持するため、初期の新規作成対象には含めない。

---

## 8. 画像内テキスト方針

## 8.1 共通ルール

| 項目       | 方針                                                                   |
| -------- | -------------------------------------------------------------------- |
| サイト名     | AWS Cert Roadmap Lab                                                 |
| AWSサービス名 | Amazon S3、AWS Lambda、Amazon CloudFront など正式名称または一般的な略称を維持            |
| 文字数      | 短くする                                                                 |
| 訴求       | 学習価値と実装理解を示す                                                         |
| 禁止表現     | exam dump / real exam questions / guaranteed pass / leaked questions |
| 視認性      | スマホのSNSプレビューでも読める文字サイズにする                                            |

## 8.2 英語OGP文言案

| 項目        | 文言                                                                     |
| --------- | ---------------------------------------------------------------------- |
| Main Copy | Learn AWS Certifications by Building                                   |
| Sub Copy  | Glossaries, comparisons, practice questions, and architecture diagrams |
| Site Name | AWS Cert Roadmap Lab                                                   |

## 8.3 繁体字中国語OGP文言案

| 項目        | 文言                   |
| --------- | -------------------- |
| Main Copy | 用實作理解 AWS 認證學習       |
| Sub Copy  | 詞彙、比較、練習題與架構圖        |
| Site Name | AWS Cert Roadmap Lab |

---

## 9. metadata実装への引き継ぎ方針

## 9.1 P5-014でやること

P5-014では、英語OGP画像を1枚だけ作成・設定する。

```text
frontend/public/images/assets/og-image-en.png
```

完了条件は以下。

* 英語OGP画像が作成されている
* `/en` 配下のページで `og:image` が `og-image-en.png` を指す
* `npm run build` が成功する

## 9.2 P5-015でやること

P5-015では、繁体字中国語OGP画像を1枚だけ作成・設定する。

```text
frontend/public/images/assets/og-image-zh.png
```

完了条件は以下。

* 中国語OGP画像が作成されている
* `/zh` 配下のページで `og:image` が `og-image-zh.png` を指す
* `npm run build` が成功する

## 9.3 metadata helper側の期待仕様

metadata helperは、以下の入力からOGP画像を決める。

| 入力          | 例                  |
| ----------- | ------------------ |
| locale      | `ja` / `en` / `zh` |
| customImage | 個別画像がある場合のみ指定      |

初期実装では `pageType` をOGP画像切り替えに使わない。

---

## 10. OpenGraph locale

OpenGraph locale は以下を使う。

| locale | openGraph.locale |
| ------ | ---------------- |
| ja     | `ja_JP`          |
| en     | `en_US`          |
| zh     | `zh_TW`          |

---

## 11. 作らない画像

初期実装では以下を作らない。

| 作らないもの        | 理由                            |
| ------------- | ----------------------------- |
| 用語集カテゴリ別OGP   | 初期流入検証には共通画像で足りる              |
| 比較ページカテゴリ別OGP | 共有実績が出てから作る                   |
| 構成図カテゴリ別OGP   | 構成図カテゴリが伸びてから作る               |
| 模擬問題カテゴリ別OGP  | 初期は共通画像で足りる                   |
| ブログカテゴリ別OGP   | 上位記事が判明してから作る                 |
| 記事別OGP        | 作成・保守コストが高い                   |
| 用語別OGP        | 画像数が増えすぎる                     |
| `/zh-cn` 用OGP | Phase 5では `/zh` を繁体字寄りで開始するため |
| 日本語OGP全面刷新    | 既存ページへの影響を避けるため               |

---

## 12. 追加判断基準

カテゴリ別OGP画像は、以下の条件を満たした場合に追加を検討する。

| 条件                                      | 判断             |
| --------------------------------------- | -------------- |
| Search Consoleで英語または中国語ページの表示回数が月100回以上 | カテゴリ別OGPを検討    |
| SNSまたは外部サイトで特定カテゴリが共有され始めた              | 対象カテゴリのOGPを検討  |
| 構成図ページが海外流入の上位になった                      | 構成図OGPを優先      |
| 比較ページが海外流入の上位になった                       | 比較OGPを優先       |
| ブログ記事単位で外部リンクが増えた                       | 対象記事のみ個別OGPを検討 |

---

## 13. コスト・運用方針

## 13.1 コスト方針

| 項目           | 方針                |
| ------------ | ----------------- |
| 画像数          | 初期は英語1枚、中国語1枚     |
| 画像サイズ        | 1枚300KB以下         |
| 配置先          | S3に静的ファイルとして配置    |
| 配信           | CloudFront経由      |
| Invalidation | 画像差し替え時は対象パスを限定する |

## 13.2 運用方針

画像差し替え時は、以下の順で確認する。

1. ローカルで画像ファイルの存在を確認する
2. `npm run build` が成功する
3. `out/images/assets/` に画像が含まれる
4. 本番反映後、対象画像URLにアクセスできる
5. ブラウザのHTML出力で `og:image` を確認する
6. SNS Card Validator で表示を確認する

---

## 14. 動作確認

このタスクは方針ドキュメント作成のみのため、画像生成やmetadata修正は行わない。

確認コマンドは以下。

```bash
git status
git branch

npm --prefix frontend run typecheck
npm --prefix frontend run build

git diff
git status
```

期待結果は以下。

* `docs/seo/p5-013-multilingual-ogp-policy.md` が追加されている
* `npm --prefix frontend run typecheck` が成功する
* `npm --prefix frontend run build` が成功する
* 既存ページの表示やmetadata実装に変更がない

---

## 15. 完了判定

P5-013 は、以下を満たしたら完了とする。

* 英語OGP画像の初期作成対象が `og-image-en.png` の1枚に決まっている
* 中国語OGP画像の初期作成対象が `og-image-zh.png` の1枚に決まっている
* 日本語ページは既存の `og-image.png` を維持する方針になっている
* `/en` 配下の全ページで英語共通OGPを使う方針が決まっている
* `/zh` 配下の全ページで中国語共通OGPを使う方針が決まっている
* 初期実装で作らない画像が明確になっている
* カテゴリ別OGP画像の追加判断基準が明確になっている
* P5-014 / P5-015 で作るべき画像が明確になっている
* AWSコスト面を考慮し、画像数とファイルサイズの上限方針がある
