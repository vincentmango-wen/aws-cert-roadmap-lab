#!/usr/bin/env bash
set -euo pipefail

REPO="vincentmango-wen/aws-cert-roadmap-lab"

gh auth status >/dev/null

gh label create "phase:5" --color "5319E7" --description "Phase 5: グローバルSEO・ローカライゼーション" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Must" --color "B60205" --description "必須" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Should" --color "D93F0B" --description "重要" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Could" --color "0E8A16" --description "余裕があれば対応" --repo "$REPO" 2>/dev/null || true
gh label create "size:S" --color "C2E0C6" --description "1〜2時間" --repo "$REPO" 2>/dev/null || true
gh label create "size:M" --color "FBCA04" --description "半日" --repo "$REPO" 2>/dev/null || true
gh label create "size:L" --color "F9D0C4" --description "1日" --repo "$REPO" 2>/dev/null || true
gh label create "size:XL" --color "D4C5F9" --description "2日以上" --repo "$REPO" 2>/dev/null || true

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
Phase 5 グローバルSEO・ローカライゼーション対応として、英語・中国語対応、海外SEO、国別流入検証を進める。

## 今回やること
- WBSに定義された完了条件を満たす
- 日本語URLは既存のまま維持する
- 英語は /en、中国語は /zh を前提にする
- Markdown / MDX / JSON 中心の静的コンテンツ管理を維持する

## 今回やらないこと
- Cognitoログイン
- 学習履歴保存
- 決済機能
- 翻訳API本番連携
- DynamoDBへのコンテンツ移行
- WAF導入

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

# Phase 5-E：AWS用語集多言語化
create_issue "P5-027" "Phase 5-E: AWS用語集多言語化" "AWS用語データ多言語構成へ分割" "Must" "L" "P5-004" "terms.ja.json terms.en.json terms.zh.json が存在する"
create_issue "P5-028" "Phase 5-E: AWS用語集多言語化" "用語一覧ページ多言語対応" "Must" "M" "P5-027" "/en/terms /zh/terms が表示される"
create_issue "P5-029" "Phase 5-E: AWS用語集多言語化" "用語詳細ページ多言語対応" "Must" "L" "P5-027" "/en/terms/s3 /zh/terms/s3 が表示される"
create_issue "P5-030" "Phase 5-E: AWS用語集多言語化" "主要AWS用語30件の英語翻訳" "Must" "XL" "P5-027" "30件以上の英語用語データがある"
create_issue "P5-031" "Phase 5-E: AWS用語集多言語化" "主要AWS用語30件の中国語翻訳" "Must" "XL" "P5-027" "30件以上の中国語用語データがある"
create_issue "P5-032" "Phase 5-E: AWS用語集多言語化" "AWS用語表記ルール作成" "Must" "M" "P5-030" "AWS正式名称、略称、中文表記、英語表記のルールがある"
create_issue "P5-033" "Phase 5-E: AWS用語集多言語化" "用語詳細の関連リンク多言語対応" "Should" "M" "P5-029" "関連比較・関連構成図へのリンクが同一言語内で遷移する"

# Phase 5-F：比較記事多言語化
create_issue "P5-034" "Phase 5-F: 比較記事多言語化" "サービス比較MDX多言語構成作成" "Should" "M" "P5-007" "contents/comparisons/en contents/comparisons/zh がある"
create_issue "P5-035" "Phase 5-F: 比較記事多言語化" "S3 / EBS / EFS 比較の英語化" "Should" "M" "P5-034" "/en/comparisons/s3-vs-ebs-vs-efs が表示される"
create_issue "P5-036" "Phase 5-F: 比較記事多言語化" "S3 / EBS / EFS 比較の中国語化" "Should" "M" "P5-034" "/zh/comparisons/s3-vs-ebs-vs-efs が表示される"
create_issue "P5-037" "Phase 5-F: 比較記事多言語化" "RDS / DynamoDB 比較の英語化" "Should" "M" "P5-034" "/en/comparisons/rds-vs-dynamodb が表示される"
create_issue "P5-038" "Phase 5-F: 比較記事多言語化" "RDS / DynamoDB 比較の中国語化" "Should" "M" "P5-034" "/zh/comparisons/rds-vs-dynamodb が表示される"
create_issue "P5-039" "Phase 5-F: 比較記事多言語化" "IAM User / Role / Policy 比較の英語化" "Should" "M" "P5-034" "英語ページが表示される"
create_issue "P5-040" "Phase 5-F: 比較記事多言語化" "IAM User / Role / Policy 比較の中国語化" "Should" "M" "P5-034" "中国語ページが表示される"
create_issue "P5-041" "Phase 5-F: 比較記事多言語化" "比較記事の内部リンク多言語対応" "Should" "M" "P5-035" "関連用語・関連問題リンクが同一言語内で遷移する"

# Phase 5-G：構成図記事多言語化
create_issue "P5-042" "Phase 5-G: 構成図記事多言語化" "構成図MDX多言語構成作成" "Should" "M" "P5-007" "contents/architectures/en contents/architectures/zh がある"
create_issue "P5-043" "Phase 5-G: 構成図記事多言語化" "S3 + CloudFront 静的サイト構成の英語化" "Should" "M" "P5-042" "英語構成図記事が表示される"
create_issue "P5-044" "Phase 5-G: 構成図記事多言語化" "S3 + CloudFront 静的サイト構成の中国語化" "Should" "M" "P5-042" "中国語構成図記事が表示される"
create_issue "P5-045" "Phase 5-G: 構成図記事多言語化" "API Gateway + Lambda + DynamoDB 構成の英語化" "Should" "M" "P5-042" "英語構成図記事が表示される"
create_issue "P5-046" "Phase 5-G: 構成図記事多言語化" "API Gateway + Lambda + DynamoDB 構成の中国語化" "Should" "M" "P5-042" "中国語構成図記事が表示される"
create_issue "P5-047" "Phase 5-G: 構成図記事多言語化" "3層Webアプリ構成の英語化" "Could" "M" "P5-042" "英語構成図記事が表示される"
create_issue "P5-048" "Phase 5-G: 構成図記事多言語化" "3層Webアプリ構成の中国語化" "Could" "M" "P5-042" "中国語構成図記事が表示される"
create_issue "P5-049" "Phase 5-G: 構成図記事多言語化" "構成図SVGの言語別文言確認" "Should" "M" "P5-043" "SVG内の日本語が英語・中国語版で置換されている"

# Phase 5-H：ブログ多言語化
create_issue "P5-050" "Phase 5-H: ブログ多言語化" "ブログMDX多言語構成作成" "Should" "M" "P5-007" "contents/blog/en contents/blog/zh がある"
create_issue "P5-051" "Phase 5-H: ブログ多言語化" "AWS Cloud Practitionerとは？英語化" "Should" "M" "P5-050" "英語ブログ記事が表示される"
create_issue "P5-052" "Phase 5-H: ブログ多言語化" "AWS Cloud Practitionerとは？中国語化" "Should" "M" "P5-050" "中国語ブログ記事が表示される"
create_issue "P5-053" "Phase 5-H: ブログ多言語化" "AWS無料枠ポートフォリオ記事の英語化" "Should" "M" "P5-050" "英語ブログ記事が表示される"
create_issue "P5-054" "Phase 5-H: ブログ多言語化" "AWS無料枠ポートフォリオ記事の中国語化" "Should" "M" "P5-050" "中国語ブログ記事が表示される"
create_issue "P5-055" "Phase 5-H: ブログ多言語化" "S3 + CloudFront公開記事の英語化" "Should" "M" "P5-050" "英語ブログ記事が表示される"
create_issue "P5-056" "Phase 5-H: ブログ多言語化" "S3 + CloudFront公開記事の中国語化" "Should" "M" "P5-050" "中国語ブログ記事が表示される"

# Phase 5-I：CLF問題多言語化
create_issue "P5-057" "Phase 5-I: CLF問題多言語化" "CLF問題データ多言語構成作成" "Could" "M" "P5-027" "clf-c02.ja.json clf-c02.en.json clf-c02.zh.json がある"
create_issue "P5-058" "Phase 5-I: CLF問題多言語化" "CLF問題30問の英語化" "Could" "XL" "P5-057" "英語問題30問以上が表示される"
create_issue "P5-059" "Phase 5-I: CLF問題多言語化" "CLF問題30問の中国語化" "Could" "XL" "P5-057" "中国語問題30問以上が表示される"
create_issue "P5-060" "Phase 5-I: CLF問題多言語化" "問題UI多言語対応" "Could" "L" "P5-057" "回答、正解、不正解、解説、次の問題などのUIが多言語化されている"
create_issue "P5-061" "Phase 5-I: CLF問題多言語化" "exam dump 回避文言追加" "Must" "S" "P5-058" "問題ページに独自問題・非公式・試験ダンプではない旨が表示される"

# Phase 5-J：検証・本番反映
create_issue "P5-062" "Phase 5-J: 検証・本番反映" "翻訳品質チェックリスト作成" "Must" "M" "P5-030" "AWS用語の表記揺れ、禁止表現、公式用語確認ルールがある"
create_issue "P5-063" "Phase 5-J: 検証・本番反映" "多言語ページローカル動作確認" "Must" "M" "P5-029" "主要URLがローカルで表示される"
create_issue "P5-064" "Phase 5-J: 検証・本番反映" "静的build確認" "Must" "S" "P5-063" "npm run build が成功し、out/en out/zh が生成される"
create_issue "P5-065" "Phase 5-J: 検証・本番反映" "本番デプロイ確認" "Must" "M" "P5-064" "CloudFront経由で /en /zh が表示される"
create_issue "P5-066" "Phase 5-J: 検証・本番反映" "sitemap本番確認" "Must" "S" "P5-065" "sitemap.xml に多言語URLが含まれる"
create_issue "P5-067" "Phase 5-J: 検証・本番反映" "Search Console確認" "Must" "M" "P5-065" "sitemap送信、インデックス対象URL確認が完了"
create_issue "P5-068" "Phase 5-J: 検証・本番反映" "GA国別・言語別確認" "Must" "S" "P5-065" "国別・言語別の確認手順がREADMEに記載されている"
create_issue "P5-069" "Phase 5-J: 検証・本番反映" "README多言語対応追記" "Should" "M" "P5-065" "READMEにグローバルSEO・ローカライゼーション方針が記載されている"
create_issue "P5-070" "Phase 5-J: 検証・本番反映" "Phase 5完了レビュー" "Must" "M" "P5-067" "完了条件を満たし、Phase 6へ進める"

echo "DONE: Phase 5-E〜5-J issues created or skipped."
