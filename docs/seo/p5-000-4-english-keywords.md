# P5-000-4 英語SEOキーワードリスト

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | P5-000-4 英語SEOキーワードリスト |
| 対象プロダクト | AWS Cert Roadmap Lab |
| 対象フェーズ | Phase 5：グローバルSEO・ローカライゼーション |
| 対象言語 | English |
| 対象URL Prefix | `/en` |
| 作成目的 | 英語圏向けに狙うロングテールSEOキーワードを整理し、英語ページ作成・metadata・内部リンク設計の基準にする |
| 関連タスク | P5-000, P5-000-1, P5-000-2, P5-000-3, P5-000-4 |
| 作成日 | 2026-06-10 |

---

## 2. このキーワードリストの目的

このドキュメントは、AWS Cert Roadmap Lab の英語ページを作る前に、狙う検索キーワードを明確にするためのSEO設計資料である。

Phase 5では、単なる日本語ページの翻訳ではなく、英語圏ユーザーが検索しやすい表現に合わせて、以下の検索意図を狙う。

1. AWS資格の学習順序を知りたい
2. AWSサービスの違いを理解したい
3. AWS用語を初学者向けに理解したい
4. AWS構成図で設計パターンを学びたい
5. AWSを使ったポートフォリオ実装例を探している

---

## 3. 基本方針

## 3.1 狙うキーワード方針

| 方針 | 内容 |
|---|---|
| ロングテール優先 | `AWS Cloud Practitioner` 単体のような広すぎるキーワードは狙わない |
| 初学者向けを明示 | `for beginners`, `explained`, `guide` を積極的に使う |
| 比較系を重視 | `vs`, `difference`, `comparison` を使い、比較ページへつなげる |
| 構成図系を重視 | `architecture`, `diagram`, `example` を使い、SAA向け構成図へつなげる |
| ポートフォリオ系を狙う | `portfolio project`, `free tier`, `serverless project` を使う |
| 試験ダンプ系は除外 | `exam dump`, `real questions`, `answers` は狙わない |

## 3.2 優先度定義

| 優先度 | 意味 | 対応方針 |
|---|---|---|
| A | 最初に英語化する価値が高い | `/en` 公開初期でmetadata・本文・内部リンクに反映する |
| B | 次に作る価値がある | 用語・比較・構成図の英語化後に対応する |
| C | 将来拡張で狙う | コンテンツ量が増えた後に記事化する |

## 3.3 検索意図分類

| 分類 | 意図 | 主な対応ページ |
|---|---|---|
| Roadmap | 学習順序を知りたい | `/en`, `/en/roadmap`, `/en/blog/...` |
| Terms | AWS用語を理解したい | `/en/terms`, `/en/terms/[termId]` |
| Comparison | サービスの違いを知りたい | `/en/comparisons/[comparisonSlug]` |
| Architecture | AWS構成図を学びたい | `/en/architectures/[architectureSlug]` |
| Portfolio | 実装例・ポートフォリオを作りたい | `/en/blog/...`, `/en/architectures/...` |
| Exam Prep | 試験範囲の理解を深めたい | `/en/questions`, `/en/blog/...` |

---

## 4. 英語SEOキーワード一覧

## 4.1 優先度A：最初に狙うキーワード

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 1 | aws certification roadmap for beginners | Roadmap | `/en/roadmap` | サイト全体の入口にしやすい |
| 2 | aws cloud practitioner study roadmap for beginners | Roadmap | `/en/roadmap` | CLF学習者の検索意図に合う |
| 3 | aws cloud practitioner key services explained | Terms | `/en/terms` | 用語集一覧へ誘導できる |
| 4 | aws cloud practitioner terminology guide | Terms | `/en/terms` | AWS用語集と相性が良い |
| 5 | aws shared responsibility model for beginners | Terms | `/en/terms/shared-responsibility-model` | CLFで重要なセキュリティ概念 |
| 6 | s3 vs ebs vs efs for beginners | Comparison | `/en/comparisons/s3-vs-ebs-vs-efs` | 既存比較記事の英語化対象 |
| 7 | rds vs dynamodb for beginners | Comparison | `/en/comparisons/rds-vs-dynamodb` | DB比較として検索意図が明確 |
| 8 | sqs vs sns vs eventbridge explained | Comparison | `/en/comparisons/sns-vs-sqs-vs-eventbridge` | 統合サービス比較として価値が高い |
| 9 | cloudwatch vs cloudtrail vs aws config | Comparison | `/en/comparisons/cloudwatch-vs-cloudtrail-vs-config` | 監視・監査系の混同対策 |
| 10 | iam user vs role vs policy explained | Comparison | `/en/comparisons/iam-user-vs-role-vs-policy` | IAM初学者の混同ポイントに合う |
| 11 | aws static website architecture s3 cloudfront | Architecture | `/en/architectures/static-site-s3-cloudfront` | 実装済み構成と一致する |
| 12 | s3 cloudfront oac architecture | Architecture | `/en/architectures/static-site-s3-cloudfront` | S3非公開配信の差別化に使える |
| 13 | api gateway lambda dynamodb architecture | Architecture | `/en/architectures/serverless-api-basic` | サーバーレスAPI構成に直結 |
| 14 | aws serverless api architecture for beginners | Architecture | `/en/architectures/serverless-api-basic` | 初学者向け構成図と相性が良い |
| 15 | aws portfolio project for beginners | Portfolio | `/en/blog/aws-free-tier-portfolio` | ポートフォリオ訴求と相性が良い |

---

## 4.2 優先度B：Phase 5中盤で狙うキーワード

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 16 | aws cloud practitioner cloud concepts explained | Exam Prep | `/en/blog/aws-cloud-practitioner-roadmap` | CLFの基礎概念記事に使える |
| 17 | aws pricing and billing for cloud practitioner | Exam Prep | `/en/blog/aws-cloud-practitioner-roadmap` | 請求・料金領域の検索意図に合う |
| 18 | aws free tier portfolio project | Portfolio | `/en/blog/aws-free-tier-portfolio` | 低コスト個人開発と一致する |
| 19 | serverless aws portfolio project | Portfolio | `/en/blog/aws-free-tier-portfolio` | Lambda/API Gateway/DynamoDB構成と合う |
| 20 | deploy static website to s3 cloudfront github actions | Portfolio | `/en/blog/deploy-static-site-s3-cloudfront-github-actions` | CI/CD実装記事へ展開できる |
| 21 | github actions deploy to s3 cloudfront oidc | Portfolio | `/en/blog/github-actions-s3-cloudfront-oidc` | OIDC構成のポートフォリオ価値が高い |
| 22 | aws solutions architect associate architecture patterns | Architecture | `/en/architectures` | SAA構成図一覧へ誘導できる |
| 23 | aws saa high availability design examples | Architecture | `/en/architectures/high-availability-web-app` | 高可用性構成図へつなげる |
| 24 | aws saa cost optimization examples | Architecture | `/en/architectures` | SAAのコスト最適化観点に合う |
| 25 | three tier architecture on aws diagram | Architecture | `/en/architectures/three-tier-vpc` | 3層構成図ページに使える |
| 26 | high availability web application architecture aws | Architecture | `/en/architectures/high-availability-web-app` | SAA向け設計パターンとして価値が高い |
| 27 | eventbridge lambda batch architecture | Architecture | `/en/architectures/eventbridge-lambda-batch` | EventBridge構成図へつなげる |
| 28 | alb vs nlb vs cloudfront difference | Comparison | `/en/comparisons/alb-vs-nlb-vs-cloudfront` | 配信・LB系の比較記事に合う |
| 29 | multi az vs read replica explained | Comparison | `/en/comparisons/multi-az-vs-read-replica` | RDS/SAA学習と相性が良い |
| 30 | security group vs nacl explained | Comparison | `/en/comparisons/security-group-vs-nacl` | VPCセキュリティ比較として価値が高い |

---

## 4.3 優先度C：将来拡張で狙うキーワード

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 31 | what is amazon s3 for beginners | Terms | `/en/terms/s3` | 用語詳細ページに使える |
| 32 | what is aws lambda for beginners | Terms | `/en/terms/lambda` | Lambda用語詳細に使える |
| 33 | what is amazon dynamodb for beginners | Terms | `/en/terms/dynamodb` | DynamoDB用語詳細に使える |
| 34 | what is amazon cloudfront for beginners | Terms | `/en/terms/cloudfront` | CloudFront用語詳細に使える |
| 35 | what is amazon api gateway for beginners | Terms | `/en/terms/api-gateway` | API Gateway用語詳細に使える |
| 36 | what is aws iam role for beginners | Terms | `/en/terms/iam` | IAM用語詳細・比較記事に使える |
| 37 | aws vpc architecture for beginners | Architecture | `/en/architectures/three-tier-vpc` | VPC構成理解に使える |
| 38 | route 53 cloudfront acm example | Architecture | `/en/architectures/static-site-s3-cloudfront` | 独自ドメイン・HTTPS導線に使える |
| 39 | aws cloudfront origin access control explained | Terms | `/en/terms/cloudfront` | OACの実装経験を説明できる |
| 40 | aws budgets cost explorer for beginners | Terms | `/en/terms/aws-budgets` | コスト管理コンテンツに使える |

---

## 5. 最初にmetadataへ反映する推奨キーワード

## 5.1 `/en`

| 項目 | 内容 |
|---|---|
| Primary keyword | aws certification roadmap for beginners |
| Secondary keywords | aws cloud practitioner study roadmap for beginners, aws cloud practitioner key services explained |
| Search intent | AWS資格学習の始め方を知りたい |
| 推奨title | AWS Certification Roadmap for Beginners |
| 推奨description | Learn AWS Cloud Practitioner and Solutions Architect basics with beginner-friendly terms, comparisons, practice questions, and architecture diagrams. |

## 5.2 `/en/terms`

| 項目 | 内容 |
|---|---|
| Primary keyword | aws cloud practitioner terminology guide |
| Secondary keywords | aws cloud practitioner key services explained, what is amazon s3 for beginners |
| Search intent | AWS主要サービスと用語を理解したい |
| 推奨title | AWS Cloud Practitioner Terminology Guide |
| 推奨description | A beginner-friendly glossary of AWS services, cloud concepts, exam points, and practical use cases for AWS certification learners. |

## 5.3 `/en/comparisons`

| 項目 | 内容 |
|---|---|
| Primary keyword | aws service comparison for beginners |
| Secondary keywords | s3 vs ebs vs efs for beginners, rds vs dynamodb for beginners |
| Search intent | AWSサービスの違いを比較したい |
| 推奨title | AWS Service Comparisons for Beginners |
| 推奨description | Compare commonly confused AWS services with simple tables, exam points, and practical use cases for Cloud Practitioner and SAA learners. |

## 5.4 `/en/architectures`

| 項目 | 内容 |
|---|---|
| Primary keyword | aws architecture diagrams for beginners |
| Secondary keywords | aws static website architecture s3 cloudfront, aws serverless api architecture for beginners |
| Search intent | AWS構成図で設計パターンを学びたい |
| 推奨title | AWS Architecture Diagrams for Beginners |
| 推奨description | Learn AWS architecture patterns with beginner-friendly diagrams covering static websites, serverless APIs, three-tier apps, and high availability designs. |

## 5.5 `/en/blog/aws-free-tier-portfolio`

| 項目 | 内容 |
|---|---|
| Primary keyword | aws free tier portfolio project |
| Secondary keywords | aws portfolio project for beginners, serverless aws portfolio project |
| Search intent | AWS無料枠でポートフォリオを作りたい |
| 推奨title | AWS Free Tier Portfolio Project for Beginners |
| 推奨description | Build a beginner-friendly AWS portfolio project using S3, CloudFront, Lambda, API Gateway, DynamoDB, and GitHub Actions. |

---

## 6. 狙わないキーワード

以下のキーワードは、流入があってもサイト品質・信頼性・AdSense審査・AWS認定ポリシー上のリスクが高いため狙わない。

| Keyword | 理由 |
|---|---|
| aws cloud practitioner exam dump | 試験ダンプ目的の検索意図であり、禁止表現方針に反する |
| clf-c02 real exam questions | 本番問題を求める意図が強い |
| aws certification real answers | 不正解答を求める意図が強い |
| pass aws cloud practitioner guaranteed | 合格保証表現は信頼性を損なう |
| aws saa-c03 dump pdf | 試験ダンプ・PDF違法配布の意図が強い |
| free aws exam answers | 不正解答目的の検索意図が強い |

---

## 7. コンテンツ作成優先順位

## 7.1 最初に英語化するページ

| 優先 | ページ | Target URL | 主キーワード |
|---:|---|---|---|
| 1 | 英語トップ | `/en` | aws certification roadmap for beginners |
| 2 | 英語ロードマップ | `/en/roadmap` | aws cloud practitioner study roadmap for beginners |
| 3 | 英語用語集 | `/en/terms` | aws cloud practitioner terminology guide |
| 4 | S3 / EBS / EFS比較 | `/en/comparisons/s3-vs-ebs-vs-efs` | s3 vs ebs vs efs for beginners |
| 5 | RDS / DynamoDB比較 | `/en/comparisons/rds-vs-dynamodb` | rds vs dynamodb for beginners |
| 6 | SNS / SQS / EventBridge比較 | `/en/comparisons/sns-vs-sqs-vs-eventbridge` | sqs vs sns vs eventbridge explained |
| 7 | 静的サイト構成 | `/en/architectures/static-site-s3-cloudfront` | aws static website architecture s3 cloudfront |
| 8 | サーバーレスAPI構成 | `/en/architectures/serverless-api-basic` | api gateway lambda dynamodb architecture |
| 9 | AWS無料枠ポートフォリオ記事 | `/en/blog/aws-free-tier-portfolio` | aws free tier portfolio project |
| 10 | S3 + CloudFront公開記事 | `/en/blog/deploy-static-site-s3-cloudfront-github-actions` | deploy static website to s3 cloudfront github actions |

## 7.2 内部リンク方針

| 起点 | 遷移先 | 目的 |
|---|---|---|
| `/en` | `/en/roadmap` | 学習順序へ誘導する |
| `/en/roadmap` | `/en/terms` | 用語理解へ誘導する |
| `/en/terms/s3` | `/en/comparisons/s3-vs-ebs-vs-efs` | 比較理解へ誘導する |
| `/en/comparisons/s3-vs-ebs-vs-efs` | `/en/architectures/static-site-s3-cloudfront` | 実装構成へ誘導する |
| `/en/architectures/static-site-s3-cloudfront` | `/en/blog/aws-free-tier-portfolio` | ポートフォリオ記事へ誘導する |
| `/en/blog/aws-free-tier-portfolio` | `/en/contact` | 問い合わせ・ポートフォリオ確認へ誘導する |

---

## 8. metadata作成ルール

## 8.1 titleルール

| ルール | 内容 |
|---|---|
| 文字数 | 45〜65文字を目安にする |
| Primary keyword | できるだけ前半に置く |
| サイト名 | 必要なページのみ末尾に `| AWS Cert Roadmap Lab` を付ける |
| 誇張表現 | `guaranteed`, `real exam`, `dump` は使わない |

## 8.2 descriptionルール

| ルール | 内容 |
|---|---|
| 文字数 | 120〜160文字を目安にする |
| 検索意図 | 「何が学べるか」を明確にする |
| 対象者 | `beginners`, `AWS certification learners` を使う |
| 禁止表現 | 合格保証、本番問題、公式問題のように誤認される表現は使わない |

## 8.3 H1ルール

| ページ種別 | H1例 |
|---|---|
| トップ | AWS Certification Roadmap for Beginners |
| 用語集 | AWS Cloud Practitioner Terminology Guide |
| 比較 | S3 vs EBS vs EFS: What Is the Difference? |
| 構成図 | AWS Static Website Architecture with S3 and CloudFront |
| ブログ | How to Build an AWS Free Tier Portfolio Project |

---

## 9. 検証方法

## 9.1 ローカル検証

- Markdownの表が崩れていないこと
- キーワードが20個以上あること
- 禁止キーワードが「狙うキーワード一覧」に入っていないこと
- Target URLが `/en` 配下になっていること

## 9.2 実装後検証

- `/en` 配下のページが生成されていること
- 各ページのtitle / descriptionにPrimary keywordが含まれていること
- sitemapに英語URLが含まれていること
- hreflangで日本語・英語・中国語ページが相互参照されていること
- Search Consoleで英語URLがインデックス対象になっていること
- GAで国別・言語別流入が確認できること

---

## 10. 完了条件

P5-000-4は、以下を満たしたら完了とする。

| 条件 | 判定 |
|---|---|
| 英語のロングテールキーワードが20個以上ある | 必須 |
| 各キーワードに検索意図がある | 必須 |
| 各キーワードに対応予定URLがある | 必須 |
| 優先度A/B/Cが付いている | 必須 |
| 禁止キーワードが明示されている | 必須 |
| 後続タスクで使うmetadata方針がある | 必須 |
| `/en` 配下のコンテンツ優先順位が決まっている | 必須 |

---

## 11. 次タスクへの接続

| 次タスク | 接続内容 |
|---|---|
| P5-000-5 | 中国語SEOキーワードでも同じ構成を使う |
| P5-001 | 多言語対応方針で英語SEO方針を反映する |
| P5-009 | canonical / hreflang 設計で `/en` URLを使う |
| P5-010 | 多言語metadata helperで本リストのtitle / descriptionを使う |
| P5-011 | 多言語sitemapでTarget URLを登録する |
| P5-016 | 英語トップページにPrimary keywordを反映する |
| P5-030 | 英語用語データ翻訳時にTerms系キーワードを反映する |
| P5-035 | 比較記事英語化時にComparison系キーワードを反映する |
| P5-043 | 構成図記事英語化時にArchitecture系キーワードを反映する |