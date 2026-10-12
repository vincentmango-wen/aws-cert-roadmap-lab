# ローカライズ公開設計

- 作成日: 2026-10-12
- 状態: ふみさんの会話上の設計合意後、文書レビュー待ち
- 対象: `aws-cert-roadmap-lab` の `/en`・`/zh` 公開準備と本番反映
- 関連: #334 ACR-014、#305 P5-095、#323 ACR-013、#319 ACR-009

## 1. 目的

Google AdSense の再申請を保留し、英語・繁体字ページを完成させて本番で公開する。公開時は言語切り替えUIを有効にし、検索エンジンにも各言語版を公開する。

このリリースでは AdSense の再申請や、そのためのクロール猶予期間を待たない。ローカライズ品質、URL到達性、SEOメタデータ、CIの成功を公開条件とする。

## 2. 成功条件

1. `/en`・`/zh` の公開対象ルートが実在し、生成HTMLに `noindex` が出ない。
2. 公開対象ルート間の内部リンクに404がなく、各ロケールの sitemap に実在するURLだけが掲載される。
3. 言語別の対応関係が sitemap のhreflangに相互に記録される。未対応言語向けの `x-default` は日本語版を指す。
4. デスクトップとモバイルでLanguageSwitcherを操作でき、選択中の言語が視認・読み上げ可能である。
5. `npm run lint`、`npm run typecheck`、`npm test`、`npm run build` がすべて成功する。
6. 本番デプロイ後、sitemapの全公開URLがHTTP 200を返し、公開対象ページがindex可能である。

## 3. 現状と制約

2026-10-12に確認したGitHubのブランチ先端は、`master` が `28ee0b0`、`dev` が `bfd59e1`。`dev` は `master` より27コミット遅れており、`dev` にだけ存在するコミットはない。作業開始時のローカルブランチは `master` だった。

前の作業で行った設問詳細ページの共通化は未コミットで残っている。これは本設計書のコミットに含めず、内容を保ったまま別の変更として確認する。作業前から存在した未追跡 `.claude/` も変更しない。

現在の公開封印は `frontend/src/i18n/release-gate.ts` の `LOCALIZED_ROUTES_PUBLISHED` が `false` であることによる。これを `true` にすると、言語切り替え、ローカライズ sitemap、およびロケールに応じたrobots制御が有効になる。

### 3.1 ACR-014の前提条件の確認状況

| 条件 | 2026-10-12時点の確認 | 対応 |
|---|---|---|
| Footerの日本語残存 | #319はクローズ済み。現在のFooterは辞書とローカライズリンクを使用 | 現行の表示をリグレッション確認 |
| `/zh/privacy` の日本語由来語彙 | 「配信」「目安」などの表現が残っている | 繁体字として校正する |
| `/en/roadmap`・`/zh/roadmap` | ページがなく、ホーム等にリンクがある。#305はオープン | 両言語のページを用意し、#305を完了する |
| 6ページのrobots制御 | `createLocaleAwareRobots()` が使われている | 公開フラグを有効にした生成HTMLでindex設定を確認 |
| hreflang / `x-default` | sitemap生成に言語別alternateはあるが公開封印中。現在のsitemap生成に`x-default`はない | sitemapを単一のhreflang正本として整備する |
| ページmetadataのalternates | `enableLanguageAlternates` は46箇所の `createPageMetadata` 呼び出し中2箇所でのみ指定 | HTMLとsitemapの二重管理を避け、sitemapの完全性を検証する |
| Open Graph locale alternate | ページ間で設定に差がある | 各ページの`og:locale`を維持し、`alternateLocale`の追加はSNS表示要件で判断する。Google検索公開の必須条件にはしない |

## 4. 設計方針

### 4.1 AdSense再申請との分離

- #323 ACR-013にある再申請、クロール猶予14〜28日、申請時期判断は保留する。
- #323内で完了済みの本番到達性や静的HTML検証の記録は維持する。
- #334 ACR-014はローカライズ公開の準備状況、LanguageSwitcherのUXレビュー、公開Go条件を扱う。
- #334の現行スコープではフラグを実際に有効化する作業が除外されているため、ふみさんの合意した目標に合わせて受け入れ条件と #323 との役割分担を更新する。

### 4.2 hreflangの正本

Google Search Centralは、HTML・HTTPヘッダー・sitemapを言語別ページの通知方法として説明し、複数方法の併用に検索上の利点はないとしている。そのため本プロジェクトでは、既存のローカライズsitemapをhreflangの単一正本にする。

- sitemapに掲載する各ロケール版は、自分自身と対応する他ロケール版を列挙する。
- `/terms-of-service` など日本語だけのページは `availableLocales: ["ja"]` に限定する。
- 対応するURLがない言語版をsitemapやalternateに生成しない。
- `x-default` は日本語版を指すようsitemap生成と検証を合わせる。
- `alternates.languages` のHTML出力を全ページに重複して追加することは公開条件にしない。#334の該当チェック項目は、選定したsitemap方式の完全性検証に置き換える。

参照: [Google Search Central — Localized Versions of your Pages](https://developers.google.com/search/docs/specialty/international/localized-versions)

### 4.3 ルートと言語切り替え

- #305の `/en/roadmap`・`/zh/roadmap` を実装し、トップページ・ナビゲーション等の既存リンク先を満たす。
- `LanguageSwitcher` のデスクトップ表示、モバイルドロワー内表示、現在言語の識別、フォーカス操作、読み上げ名をブラウザで確認する。
- UIレビュー中の公開フラグ切り替えはローカルだけで行い、準備完了までは本番封印を維持する。

## 5. 作業順序

1. 未コミットの設問詳細リファクタリングを保全し、設計書と混ぜずにレビュー対象として切り分ける。
2. `dev` が `master` より27コミット遅れ、固有コミットがないことを再確認したうえで、リポジトリ運用に沿って最新`master`を作業起点へ取り込む。
3. #334の受け入れ条件を更新し、6項目の完了状態、LanguageSwitcherのUX所見、AdSense再申請ゲートとの分離を記録する。
4. `/en/roadmap`・`/zh/roadmap` を実装し、#305とリンク先不在を解消する。
5. `/zh/privacy`を校正し、公開対象の全ロケールでルート・リンク・ページ本文の対応状況を監査する。
6. sitemapをhreflangの単一正本として整え、実在URLのみ、自己参照を含む相互alternate、`x-default`を検証する。robots制御も公開フラグ有効時の生成HTMLで確認する。
7. ローカルで公開フラグを有効にした状態で4つの品質ゲートを通し、LanguageSwitcherと代表ページをブラウザ確認する。
8. `dev` から `master` へのPRで変更をまとめ、本番反映前にふみさんの承認を得る。`master`への反映が本番デプロイを起動する。
9. デプロイ後に公開対象URLのHTTP 200、sitemap、hreflang、robots、言語切り替えを確認し、Search Consoleの状態を記録する。AdSense再申請は行わない。

## 6. 対象範囲

### 対象

- `LOCALIZED_ROUTES_PUBLISHED`の公開ゲート
- `/en`・`/zh`ルートの翻訳・到達性・内部リンク
- #305のLocalized Roadmapルート不足
- #334の封印解除条件とLanguageSwitcher UXレビュー
- ローカライズsitemap、hreflang、`x-default`、robots制御
- CIと本番反映後の公開確認

### 対象外

- AdSense再申請、申請日決定、14〜28日のクロール猶予
- 認証や課金など、新しいプロダクト機能
- hreflangのHTMLとsitemapの重複実装
- 今回のローカライズ公開に直接関係しないサイト全体のリファクタリング

## 7. リスクと対応

| リスク | 対応 |
|---|---|
| 古い`dev`を起点にすると`master`の27コミット分を失う | 開始時にブランチ先端を再確認し、最新`master`からの作業にそろえる |
| sitemapに存在しないロケールURLを掲載する | sitemap内の全公開URLを生成物と照合し、HTTP 200を検証する |
| フラグ有効化後も一部ページに`noindex`が残る | `createLocaleAwareRobots()`対象ページを含む代表URLの生成HTMLを確認する |
| AdSense再申請条件がローカライズ公開を不必要に遅らせる | #323の再申請判断と、ローカライズの公開判定を別々に記録する |
| 前ターンの未コミット変更を失う、または設計書コミットへ混ぜる | 既存差分を保全し、今回のコミットには本設計書だけを含める |

## 8. 未決事項

- #334および#323の本文・状態をどのように更新するかは、実装計画作成時に変更案を提示する。現時点ではGitHubを更新しない。
- `openGraph.alternateLocale`はSNS表示上の必要性を実装計画で判断する。検索公開ゲートには含めない。
- 本番公開対象の言語別URL一覧は、build生成物とsitemapから実装時に確定する。
