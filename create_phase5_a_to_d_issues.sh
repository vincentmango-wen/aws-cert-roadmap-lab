#!/usr/bin/env bash
set -euo pipefail

REPO="vincentmango-wen/aws-cert-roadmap-lab"

gh auth status >/dev/null

gh label create "phase:5" --color "5319E7" --description "Phase 5: グローバルSEO・ローカライゼーション" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Must" --color "B60205" --description "必須" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Should" --color "D93F0B" --description "重要" --repo "$REPO" 2>/dev/null || true
gh label create "size:S" --color "C2E0C6" --description "1〜2時間" --repo "$REPO" 2>/dev/null || true
gh label create "size:M" --color "FBCA04" --description "半日" --repo "$REPO" 2>/dev/null || true
gh label create "size:L" --color "F9D0C4" --description "1日" --repo "$REPO" 2>/dev/null || true

create_issue() {
  local id="$1"
  local phase="$2"
  local title="$3"
  local priority="$4"
  local size="$5"
  local dependency="$6"
  local done="$7"

  if gh issue list --repo "$REPO" --state all --search "$id in:title" --json number --jq '.[0].number // empty' | grep -q .; then
    echo "SKIP: $id already exists"
    return 0
  fi

  body="$(mktemp)"
  cat > "$body" <<BODY
## Phase
$phase

## タスクID
$id

## タスク名
$title

## 優先度
$priority

## 見積
$size

## 依存
$dependency

## 完了条件
- $done

## 目的
Phase 5 グローバルSEO・ローカライゼーション対応として、英語・中国語対応、海外SEO、競合差別化、国別流入検証を進める。

## 今回やること
- WBSに定義された完了条件を満たす
- 既存の日本語URLを維持する
- 英語は /en、中国語は /zh を前提にする
- 静的配信構成を維持する

## 今回やらないこと
- Cognitoログイン
- 学習履歴保存
- 決済機能
- 翻訳API本番連携
- DynamoDBへのコンテンツ移行

## 動作確認
- npm run typecheck
- npm run build
- 対象URLの表示確認

## 完了判定
- 完了条件を満たしている
- 日本語既存ページを壊していない
- /en または /zh の対象ページが確認できる
- build が成功する
BODY

  gh issue create \
    --repo "$REPO" \
    --title "[$id] $title" \
    --body-file "$body" \
    --label "enhancement" \
    --label "phase:5" \
    --label "priority:$priority" \
    --label "size:$size"

  rm -f "$body"
}

create_issue "P5-000" "Phase 5-A: 競合分析・戦略整理" "グローバル競合・SEO仮説整理" "Must" "M" "Phase 4" "英語圏・中国語圏の競合カテゴリ、狙うキーワード、避けるキーワードが整理されている"
create_issue "P5-000-1" "Phase 5-A: 競合分析・戦略整理" "多言語コンテンツ優先順位決定" "Must" "S" "P5-000" "最初に翻訳するページ20〜30本が決まっている"
create_issue "P5-000-2" "Phase 5-A: 競合分析・戦略整理" "差別化メッセージ作成" "Must" "S" "P5-000" "英語・中国語のサイト説明文、meta description、OGP文言が決まっている"
create_issue "P5-000-3" "Phase 5-A: 競合分析・戦略整理" "禁止表現リスト作成" "Must" "S" "P5-000" "exam dump、本番問題、合格保証などの禁止表現がREADMEまたはdocsに記載されている"
create_issue "P5-000-4" "Phase 5-A: 競合分析・戦略整理" "英語SEOキーワードリスト作成" "Should" "S" "P5-000" "英語の狙うロングテールキーワードが20個以上ある"
create_issue "P5-000-5" "Phase 5-A: 競合分析・戦略整理" "中国語SEOキーワードリスト作成" "Should" "S" "P5-000" "繁体字中国語の狙うキーワードが20個以上ある"

create_issue "P5-001" "Phase 5-B: 多言語基盤" "多言語対応方針確定" "Must" "S" "P5-000" "対象言語、URL、翻訳範囲、将来拡張方針が決まっている"
create_issue "P5-002" "Phase 5-B: 多言語基盤" "多言語URL設計" "Must" "S" "P5-001" "/en /zh のURLルールが定義されている"
create_issue "P5-003" "Phase 5-B: 多言語基盤" "i18nディレクトリ設計" "Must" "S" "P5-002" "src/i18n 配下の構成が決まっている"
create_issue "P5-004" "Phase 5-B: 多言語基盤" "locale定義実装" "Must" "S" "P5-003" "ja en zh を型安全に扱える"
create_issue "P5-005" "Phase 5-B: 多言語基盤" "UI辞書ファイル作成" "Must" "M" "P5-004" "Header、Footer、CTA、検索、フィルター文言を言語別に取得できる"
create_issue "P5-006" "Phase 5-B: 多言語基盤" "言語切替UI実装" "Must" "M" "P5-005" "日本語・英語・中国語を同一コンテンツIDで切り替えられる"
create_issue "P5-007" "Phase 5-B: 多言語基盤" "多言語ルーティング基盤作成" "Must" "L" "P5-004" "/en/... /zh/... の静的ページが生成される"
create_issue "P5-008" "Phase 5-B: 多言語基盤" "html lang 設定" "Must" "S" "P5-007" "ja en zh の lang 属性が出力される"

create_issue "P5-009" "Phase 5-C: 多言語SEO基盤" "canonical / hreflang 設計" "Must" "M" "P5-007" "各言語ページにcanonicalとhreflangを出す仕様が決まっている"
create_issue "P5-010" "Phase 5-C: 多言語SEO基盤" "多言語metadata helper作成" "Must" "M" "P5-009" "title、description、OGPを言語別に生成できる"
create_issue "P5-011" "Phase 5-C: 多言語SEO基盤" "多言語sitemap生成対応" "Must" "M" "P5-009" "sitemapに日本語・英語・中国語URLが含まれる"
create_issue "P5-012" "Phase 5-C: 多言語SEO基盤" "x-default 設定" "Should" "S" "P5-009" "hreflangに x-default が出力される"
create_issue "P5-013" "Phase 5-C: 多言語SEO基盤" "多言語OGP方針決定" "Should" "S" "P5-010" "言語別OGP画像を作るページ範囲が決まっている"
create_issue "P5-014" "Phase 5-C: 多言語SEO基盤" "英語OGP画像作成・設定" "Should" "M" "P5-013" "英語ページで英語OGPが出る"
create_issue "P5-015" "Phase 5-C: 多言語SEO基盤" "中国語OGP画像作成・設定" "Should" "M" "P5-013" "中国語ページで中国語OGPが出る"

create_issue "P5-016" "Phase 5-D: 共通ページ多言語化" "トップページ英語化" "Must" "M" "P5-005" "/en のトップページが表示される"
create_issue "P5-017" "Phase 5-D: 共通ページ多言語化" "トップページ中国語化" "Must" "M" "P5-005" "/zh のトップページが表示される"
create_issue "P5-018" "Phase 5-D: 共通ページ多言語化" "About英語化" "Must" "S" "P5-007" "/en/about が表示される"
create_issue "P5-019" "Phase 5-D: 共通ページ多言語化" "About中国語化" "Must" "S" "P5-007" "/zh/about が表示される"
create_issue "P5-020" "Phase 5-D: 共通ページ多言語化" "Privacy英語化" "Must" "S" "P5-007" "/en/privacy が表示される"
create_issue "P5-021" "Phase 5-D: 共通ページ多言語化" "Privacy中国語化" "Must" "S" "P5-007" "/zh/privacy が表示される"
create_issue "P5-022" "Phase 5-D: 共通ページ多言語化" "Disclaimer英語化" "Must" "S" "P5-007" "/en/disclaimer が表示される"
create_issue "P5-023" "Phase 5-D: 共通ページ多言語化" "Disclaimer中国語化" "Must" "S" "P5-007" "/zh/disclaimer が表示される"
create_issue "P5-024" "Phase 5-D: 共通ページ多言語化" "Contact英語化" "Should" "M" "P5-007" "/en/contact が表示され、問い合わせ導線が分かる"
create_issue "P5-025" "Phase 5-D: 共通ページ多言語化" "Contact中国語化" "Should" "M" "P5-007" "/zh/contact が表示され、問い合わせ導線が分かる"
create_issue "P5-026" "Phase 5-D: 共通ページ多言語化" "404ページ多言語対応" "Should" "M" "P5-007" "英語・中国語の404表示が確認できる"

echo "DONE: Phase 5-A〜5-D issues created or skipped."