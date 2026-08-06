# ACR-005 / ACR-006 / ACR-007 / ACR-009 並列実装フロー設計

## 背景

現在オープンな「コードで完結する」ACRチケット4件（#314 ACR-005 / #315 ACR-006 / #316 ACR-007 / #319 ACR-009）をまとめて完了させる。ふみさんからの依頼は「workflowで同時並列実装するとコンフリクトが起きるか、起きないように最も効率的なフローで4チケットを完了まで進めてほしい」というもの。実コード調査により、コンフリクトの有無・対処方針・実行環境上の制約が判明したため、それを設計として固定する。

## 対象チケットと実コード調査結果

| チケット | Issue | 対象ファイル | 備考 |
|---|---|---|---|
| ACR-005 | #314 | `.github/workflows/ci.yml` | CIに test ステップが無い。参照先の未マージブランチ `chore/aws-cert-vitest-and-invariant-tests` は現行 master と342ファイル差分の化石ブランチで再利用不可 → 破棄する |
| ACR-006 | #315 | `frontend/src/components/questions/QuestionListClient.tsx`（122行目付近） | 「問題を見る→」の折り返し崩れをレイアウトCSSのみで解消。Issue本文が警告する「locale未対応のハードコード日本語」は既に #317(ACR-008) で解消済み（`labels = getDictionary(locale).questions` 実装済み）と確認した。純粋なレイアウト修正のみで完結する |
| ACR-007 | #316 | 同上（ページャー新設） | ACR-006 と同一ファイル。Issue本文に「#315 → 本Issueの順に直列で進めること」と明記済み |
| ACR-009 | #319 | `frontend/src/components/layout/Footer.tsx` | 現在 props無しの Server Component。`Header.tsx` は `usePathname()` + `getLocaleFromPathname()` で locale を自己検出しており、`SiteLayout.tsx` はどのページからも locale を渡していない。Footer も同じ自己検出パターンに寄せれば他ファイルに波及しない |

## コンフリクト分析

- ACR-006 と ACR-007 は同一ファイル（`QuestionListClient.tsx`）を編集するため、真の並列実行は不可。**直列で処理する。**
- ACR-005（CI yml）・ACR-009（Footer.tsx）・「ACR-006→007」の3系統は編集対象ファイルが完全に独立しており、並列実行してもファイル競合は起きない。

## 実行環境の制約

本セッションの primary working directory `/Volumes/DevShare/projects/aws-cert-roadmap-lab` は SMB共有マウントであり、過去に `frontend/node_modules` の pnpm シンボリックリンク構造が原因で `npm test` / `build` が `EACCES` で失敗した実績がある（memory: `smb-build-workaround`）。複数エージェントが同一SMBワークツリーを同時に編集・ビルドすると、ファイル競合が無くても `git add` の競合やビルド出力（`.next`/`out/`）の競合が起きうる。

→ **ローカルディスク上に新規clone + 系統ごとに git worktree を作成し、各系統を隔離する。** SMB側（primary working directory）はコード編集には使わず、全チケットmerge後に `origin/master` へ fast-forward するだけに留める。

## 採用する設計（3トラック並列 + Track内直列）

```
Track 1 (独立): ACR-005
  CI yml に test ステップ追加 → push → 意図的に赤くして実機確認 → 直す
  → PR作成 → merge → #314 close

Track 2 (独立): ACR-009
  Footer.tsx を Header.tsx と同じ locale自己検出パターンに書き換え
  → PR作成 → merge → #319 close

Track 3 (内部直列): ACR-006 → ACR-007
  ACR-006: QuestionListClient.tsx のレイアウト修正（1〜2行）
    → PR作成 → merge → #315 close
  → 同一worktreeで master を rebase
  → ACR-007: ページャー本体を実装
    → PR作成 → merge → #316 close
```

3トラックは並列実行、Track 3 の内部は直列。全ブランチは `master` を起点とする（各Issue本文の「ベースブランチ: dev」は古い情報 — 調査の結果 `dev` は `master` に完全吸収済みで現在は `master` が最新かつ唯一の統合ブランチと確認済み）。

### ブランチ / PR 方針

- 1 Issue = 1 PR の既存慣習に従う（ACR-006とACR-007は同一ファイルだが、006が軽微でIssueも別番号のため分割する）
- ブランチ名: `fix/acr-005-ci-test-step` / `fix/acr-009-footer-i18n` / `fix/acr-006-question-card-stacked-layout` / `feat/acr-007-question-list-pagination`
- 各チケットについて、実装完了 → push → PR作成（Issue close） → squash merge → リモートブランチ削除、までを都度の確認なしに通しで実行する（既存の `/pr-merge` フローに準拠）

### 判断が必要な点への対応方針

- **ACR-006**: リンクが本文下に来た際の寄せ方は左寄せとする（カード全体が左揃いのため）
- **ACR-009**: サイト名「AWS資格ロードマップラボ」・タグラインはブランド名として原語のまま維持し、フッターのセクション見出しのみ多言語化する
- **ACR-005**: 未マージブランチ `chore/aws-cert-vitest-and-invariant-tests` は破棄する（再利用可能な差分なしと確認済み）

## 完了条件

各チケットの完了条件は GitHub Issue本文の受け入れ条件（#314 / #315 / #316 / #319）にそのまま従う。本設計ドキュメントはそれらを変更しない。全4チケットについて、Issue記載の受け入れ条件を満たし、PRがmergeされ、Issueがcloseされた時点で完了とする。

最終ステップとして、SMB側の primary working directory を `origin/master` へ fast-forward し、`working-clone-location` / `smb-build-workaround` メモリの陳腐化した記述（「SMB側がstale」「rebalance-question-answers.mjsが失われた」等、本セッション内で既に解消・反証済みの内容）を更新する。

## スコープ外

- ACR-009 Issue本文が提案する「`getDictionary` を使っていない他コンポーネントの機械的棚卸し」は本設計の対象外とする（別チケット候補として扱う）
- `infra/cloudfront/url-rewrite.js` 等、本セッション冒頭で発見したSMB側の未コミット孤立ファイル（#304関連）の扱いは本設計の対象外
