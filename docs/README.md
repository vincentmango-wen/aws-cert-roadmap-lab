# Design Documents

このディレクトリは、AWS Cert Roadmap Lab の設計書を管理する場所です。

実装時は、ここに格納した設計書を根拠として作業します。

---

## 目的

`docs/designs/` の目的は以下です。

- 要件、画面、API、データ、AWS構成、運用方針を一元管理する
- 実装時に参照すべき設計書を明確にする
- ポートフォリオとして設計プロセスを説明できる状態にする
- 将来の修正時に、設計と実装のズレを確認できるようにする

---

## 格納予定の設計書

| ファイル名 | 内容 | 優先度 |
|---|---|---|
| `01_project_proposal.md` | 企画書 | High |
| `02_requirements_definition.md` | 要件定義書 | High |
| `03_screen_transition_design.md` | 画面一覧・画面遷移設計書 | High |
| `04_aws_architecture_design.md` | AWS構成図設計書 | High |
| `05_data_design.md` | データ設計書 | High |
| `06_api_design.md` | API設計書 | High |
| `07_security_design.md` | セキュリティ設計書 | High |
| `08_cost_management_design.md` | コスト管理設計書 | High |
| `09_infrastructure_build_guide.md` | インフラ構築手順書 | High |
| `10_lambda_design.md` | Lambda実装設計書 | High |
| `11_cicd_design.md` | CI/CD設計書 | Medium |
| `12_operation_design.md` | 運用監視設計書 | Medium |
| `13_development_tasks.md` | 開発タスク一覧 | High |
| `14_readme_draft.md` | README草案 | Medium |

---

## 命名ルール

設計書ファイルは、参照順が分かるように番号付きのスネークケースで管理します。

形式：

```text
<number>_<document_name>.md
```