# P5-000 グローバル競合・SEO仮説整理

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| タスクID | P5-000 |
| タスク名 | グローバル競合・SEO仮説整理 |
| 対象フェーズ | Phase 5：グローバルSEO・ローカライゼーション |
| 対象プロダクト | AWS Cert Roadmap Lab |
| 対象言語 | 日本語 / 英語 / 繁体字中国語 |
| 作成目的 | 翻訳前に、狙う市場・検索意図・競合・キーワード・差別化方針を決める |
| 実装対象 | なし |
| 後続タスク | P5-000-1 以降、P5-001 以降 |

---

## 2. 結論

Phase 5では、英語圏のビッグキーワードを正面から狙わない。

狙うべき領域は以下である。

```text
AWS資格対策
× 初学者向け
× 用語集
× サービス比較
× 構成図
× 実装ポートフォリオ
× 日本語・英語・繁体字中国語
````

理由は、英語圏の「AWS practice exam」「AWS Cloud Practitioner practice test」領域は、AWS公式、Tutorials Dojo、Whizlabs、Digital Cloud Trainingなどの既存競合が強いためである。

本サイトは、問題演習単体ではなく、以下を差別化軸にする。

1. AWSサービス比較が見やすい
2. 構成図で理解できる
3. 資格知識と実装ポートフォリオがつながっている
4. 日本語・英語・繁体字中国語を同じ構造で読める
5. 初学者が「試験」と「実務設計」の両方を理解できる

---

## 3. 競合カテゴリ整理

## 3.1 英語圏の競合カテゴリ

| カテゴリ        | 代表例                                                | 強み          | 弱み                | 本サイトの狙い            |
| ----------- | -------------------------------------------------- | ----------- | ----------------- | ------------------ |
| AWS公式       | AWS Skill Builder / Official Practice Question Set | 信頼性が最強      | 初学者には体系化が難しいことがある | 公式情報を補助する用語・比較・図解  |
| 有料模擬試験      | Tutorials Dojo / Whizlabs / Digital Cloud Training | 問題数・模試形式が強い | 実装ポートフォリオ説明は弱い    | 模試ではなく理解補助に寄せる     |
| 個人ブログ       | Medium / DEV / 個人ブログ                               | 体験談が豊富      | 情報の粒度・正確性がばらつく    | 更新日・構成図・比較表で信頼性を補う |
| YouTube講座   | freeCodeCamp / ExamPro系                            | 視覚的に学びやすい   | 検索回遊・辞書性は弱い       | テキスト検索と内部リンクで補完    |
| GitHub学習ノート | Awesome系 / study guide repo                        | 無料で網羅的      | UI・SEO・初心者導線が弱い   | Webサイトとして読みやすくする   |
| exam dump系  | braindump / actual questions系                      | 検索流入は強い     | 倫理・規約・信頼性リスクが高い   | 明確に排除する            |

## 3.2 中国語・繁体字圏の競合カテゴリ

| カテゴリ         | 代表例                    | 強み        | 弱み                 | 本サイトの狙い              |
| ------------ | ---------------------- | --------- | ------------------ | -------------------- |
| AWS公式中国語ページ  | AWS公式認定ページ             | 信頼性が高い    | 学習導線が硬い            | 初学者向けに噛み砕く           |
| 中国語体験談ブログ    | Medium / 個人ブログ / CSDN系 | 受験体験が豊富   | 古い試験コードやdump誘導が混ざる | 最新試験・非dump方針を明示      |
| 中国語問題サイト     | 題庫サイト / examtopics系    | 問題検索流入が強い | 正確性・権利面にリスク        | 独自問題・理解重視で差別化        |
| 台湾向けIT教育サイト  | 研修・講座サイト               | 現地ユーザーに近い | 無料の体系コンテンツは少ない     | 繁体字の無料学習導線を作る        |
| 日本語学習サイトの翻訳版 | ほぼ少ない                  | 競合が弱い     | 品質の高い翻訳が少ない        | 日本語・英語・繁体字の三言語対応を差別化 |

---

## 4. SEO仮説

## 4.1 英語SEO仮説

英語圏では、以下のビッグキーワードは初期段階で狙わない。

* AWS Cloud Practitioner practice exam
* AWS Cloud Practitioner practice test
* AWS Certified Cloud Practitioner questions
* SAA-C03 practice exam
* AWS exam dumps

理由は、公式・大手講座・模試サイト・dump系サイトが強すぎるためである。

初期で狙うのは以下のロングテールである。

* beginner
* explained
* difference
* comparison
* architecture diagram
* when to use
* exam point
* portfolio
* serverless

## 4.2 中国語SEO仮説

中国語圏では、簡体字より繁体字から開始する。

理由は以下である。

1. 台湾・香港ユーザー向けの繁体字AWS資格コンテンツは英語圏より競合が少ない
2. ユーザー本人の言語背景と相性が良い
3. 中国語圏では題庫・考古題系の検索が強いため、あえて非dump・理解重視で差別化できる
4. 将来 `/zh-cn` を追加する余地を残せる

初期で狙うのは以下である。

* AWS 服務比較
* AWS 初學者
* AWS 架構圖
* AWS 認證準備
* AWS Cloud Practitioner 繁體中文
* AWS SAA 繁體中文

---

## 5. 狙うべき英語キーワード

| 優先度    | キーワード                                        | 対応候補ページ                                            |
| ------ | -------------------------------------------- | -------------------------------------------------- |
| High   | AWS services comparison for beginners        | /en/comparisons                                    |
| High   | S3 vs EBS vs EFS explained                   | /en/comparisons/s3-vs-ebs-vs-efs                   |
| High   | RDS vs DynamoDB for beginners                | /en/comparisons/rds-vs-dynamodb                    |
| High   | IAM user role policy difference              | /en/comparisons/iam-user-role-policy               |
| High   | CloudWatch vs CloudTrail vs AWS Config       | /en/comparisons/cloudwatch-vs-cloudtrail-vs-config |
| High   | AWS architecture diagrams for beginners      | /en/architectures                                  |
| High   | S3 CloudFront static website architecture    | /en/architectures/static-site-s3-cloudfront        |
| High   | API Gateway Lambda DynamoDB architecture     | /en/architectures/serverless-api-basic             |
| High   | AWS Cloud Practitioner roadmap for beginners | /en/roadmap                                        |
| High   | AWS free tier portfolio project              | /en/blog/aws-free-tier-portfolio                   |
| Medium | AWS certification roadmap for beginners      | /en/roadmap                                        |
| Medium | AWS serverless portfolio project             | /en/blog/aws-free-tier-portfolio                   |
| Medium | what is Amazon S3 for beginners              | /en/terms/s3                                       |
| Medium | what is AWS Lambda for beginners             | /en/terms/lambda                                   |
| Medium | what is Amazon CloudFront for beginners      | /en/terms/cloudfront                               |
| Medium | AWS cost optimization for beginners          | /en/blog/aws-free-tier-portfolio                   |
| Medium | AWS Budgets explained for beginners          | /en/terms/aws-budgets                              |
| Medium | AWS VPC beginner explanation                 | /en/terms/vpc                                      |
| Medium | AWS shared responsibility model beginner     | /en/blog/aws-cloud-practitioner-roadmap            |
| Medium | AWS exam study with architecture diagrams    | /en/architectures                                  |

---

## 6. 狙うべき繁体字中国語キーワード

| 優先度    | キーワード                               | 対応候補ページ                                            |
| ------ | ----------------------------------- | -------------------------------------------------- |
| High   | AWS 服務比較 初學者                        | /zh/comparisons                                    |
| High   | S3 EBS EFS 差異                       | /zh/comparisons/s3-vs-ebs-vs-efs                   |
| High   | RDS DynamoDB 差異                     | /zh/comparisons/rds-vs-dynamodb                    |
| High   | IAM 使用者 角色 政策 差異                    | /zh/comparisons/iam-user-role-policy               |
| High   | CloudWatch CloudTrail AWS Config 差異 | /zh/comparisons/cloudwatch-vs-cloudtrail-vs-config |
| High   | AWS 架構圖 初學者                         | /zh/architectures                                  |
| High   | S3 CloudFront 靜態網站架構                | /zh/architectures/static-site-s3-cloudfront        |
| High   | API Gateway Lambda DynamoDB 架構      | /zh/architectures/serverless-api-basic             |
| High   | AWS Cloud Practitioner 學習路線         | /zh/roadmap                                        |
| High   | AWS 免費方案 作品集                        | /zh/blog/aws-free-tier-portfolio                   |
| Medium | AWS 認證 準備 初學者                       | /zh/roadmap                                        |
| Medium | AWS SAA 架構圖                         | /zh/architectures                                  |
| Medium | Amazon S3 是什麼                       | /zh/terms/s3                                       |
| Medium | AWS Lambda 是什麼                      | /zh/terms/lambda                                   |
| Medium | Amazon CloudFront 是什麼               | /zh/terms/cloudfront                               |
| Medium | AWS 費用最佳化 初學者                       | /zh/blog/aws-free-tier-portfolio                   |
| Medium | AWS Budgets 是什麼                     | /zh/terms/aws-budgets                              |
| Medium | AWS VPC 初學者                         | /zh/terms/vpc                                      |
| Medium | AWS 責任共擔模型                          | /zh/blog/aws-cloud-practitioner-roadmap            |
| Medium | AWS 認證 架構圖 學習                       | /zh/architectures                                  |

---

## 7. 避けるキーワード

## 7.1 英語で避けるキーワード

以下は意図的に狙わない。

* AWS exam dump
* AWS Cloud Practitioner dump
* AWS actual exam questions
* AWS real exam questions
* AWS braindump
* AWS leaked questions
* AWS pass guarantee
* guaranteed pass AWS exam
* latest actual AWS exam questions
* free AWS dump PDF

## 7.2 中国語で避けるキーワード

以下は意図的に狙わない。

* AWS 題庫
* AWS 考古題
* AWS 真題
* AWS 考試真題
* AWS dump
* AWS 題庫下載
* AWS 必過
* AWS 保證通過
* AWS 最新真題
* AWS 考試答案

## 7.3 禁止表現

サイト内で以下の表現は禁止する。

* 本番試験問題
* 実際に出た問題
* 実試験と同じ問題
* これだけで必ず合格
* 合格保証
* 最新dump
* 本物の試験問題
* leaked questions
* actual exam questions
* real exam questions
* guaranteed pass
* 真題
* 考古題
* 題庫
* 保證通過

## 7.4 代替表現

| 禁止寄り表現  | 代替表現         |
| ------- | ------------ |
| 実試験問題   | 独自作成の練習問題    |
| 本番と同じ問題 | 試験範囲に沿った演習問題 |
| 合格保証    | 理解度確認に役立つ    |
| dump    | 非公式の独自問題     |
| 真題      | 練習題          |
| 考古題     | 模擬題          |
| 題庫      | 練習問題集        |

---

## 8. 差別化メッセージ

## 8.1 英語サイト説明文

AWS Cert Roadmap Lab is a beginner-friendly AWS certification learning site that explains AWS services through comparisons, architecture diagrams, practice questions, and real serverless portfolio implementation.

## 8.2 英語 meta description

Learn AWS Cloud Practitioner and SAA basics with beginner-friendly service comparisons, architecture diagrams, practice questions, and a real AWS serverless portfolio project.

## 8.3 英語 OGP 文言

AWS certification learning with diagrams, comparisons, and real serverless implementation.

## 8.4 繁体字中国語サイト説明文

AWS Cert Roadmap Lab 是一個面向初學者的 AWS 認證學習網站，透過服務比較、架構圖、練習題與實際 Serverless 作品集，幫助學習者理解 AWS Cloud Practitioner 與 SAA 的基礎。

## 8.5 繁体字中国語 meta description

透過 AWS 服務比較、架構圖、練習題與 Serverless 實作作品集，學習 AWS Cloud Practitioner 與 SAA 的基礎概念。

## 8.6 繁体字中国語 OGP 文言

用服務比較、架構圖與實作作品集學習 AWS 認證。

---

## 9. 最初に翻訳するページ優先順位

## 9.1 優先度 High：最初に翻訳するページ

| No | 日本語ページ                             | 英語URL                                       | 中国語URL                                      | 理由            |
| -- | ---------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------- |
| 1  | トップページ                             | /en                                         | /zh                                         | 言語別入口になる      |
| 2  | ロードマップ                             | /en/roadmap                                 | /zh/roadmap                                 | 資格学習導線の中心     |
| 3  | 用語集一覧                              | /en/terms                                   | /zh/terms                                   | SEO入口になる      |
| 4  | 比較一覧                               | /en/comparisons                             | /zh/comparisons                             | 差別化しやすい       |
| 5  | 構成図一覧                              | /en/architectures                           | /zh/architectures                           | 競合差別化の中心      |
| 6  | Blog一覧                             | /en/blog                                    | /zh/blog                                    | 記事流入の入口       |
| 7  | About                              | /en/about                                   | /zh/about                                   | 信頼性・AdSense対応 |
| 8  | Privacy                            | /en/privacy                                 | /zh/privacy                                 | 広告・計測対応       |
| 9  | Disclaimer                         | /en/disclaimer                              | /zh/disclaimer                              | 試験情報の免責       |
| 10 | S3用語                               | /en/terms/s3                                | /zh/terms/s3                                | 検索需要が大きい      |
| 11 | Lambda用語                           | /en/terms/lambda                            | /zh/terms/lambda                            | サーバーレス文脈に強い   |
| 12 | CloudFront用語                       | /en/terms/cloudfront                        | /zh/terms/cloudfront                        | 本サイト構成と一致     |
| 13 | IAM用語                              | /en/terms/iam                               | /zh/terms/iam                               | 試験頻出          |
| 14 | DynamoDB用語                         | /en/terms/dynamodb                          | /zh/terms/dynamodb                          | サーバーレス構成と一致   |
| 15 | API Gateway用語                      | /en/terms/api-gateway                       | /zh/terms/api-gateway                       | サーバーレス構成と一致   |
| 16 | S3/EBS/EFS比較                       | /en/comparisons/s3-vs-ebs-vs-efs            | /zh/comparisons/s3-vs-ebs-vs-efs            | 比較SEO向き       |
| 17 | RDS/DynamoDB比較                     | /en/comparisons/rds-vs-dynamodb             | /zh/comparisons/rds-vs-dynamodb             | 比較SEO向き       |
| 18 | IAM User/Role/Policy比較             | /en/comparisons/iam-user-role-policy        | /zh/comparisons/iam-user-role-policy        | 試験頻出          |
| 19 | S3 + CloudFront構成図                 | /en/architectures/static-site-s3-cloudfront | /zh/architectures/static-site-s3-cloudfront | 本サイトの実装構成と一致  |
| 20 | API Gateway + Lambda + DynamoDB構成図 | /en/architectures/serverless-api-basic      | /zh/architectures/serverless-api-basic      | ポートフォリオ性が強い   |

## 9.2 優先度 Medium：次に翻訳するページ

| No | 対象                                 | 理由          |
| -- | ---------------------------------- | ----------- |
| 21 | CloudWatch / CloudTrail / Config比較 | 試験頻出        |
| 22 | SQS / SNS / EventBridge比較          | 試験頻出        |
| 23 | EC2 / Lambda / ECS比較               | 初学者が混同しやすい  |
| 24 | AWS無料枠ポートフォリオ記事                    | 本サイトの独自性に合う |
| 25 | AWS Cloud Practitionerとは？記事        | 初学者入口になる    |
| 26 | S3 + CloudFront公開記事                | 実装導線になる     |
| 27 | VPC用語                              | SAA接続に必要    |
| 28 | Route 53用語                         | 独自ドメイン構成と接続 |
| 29 | CloudWatch用語                       | 運用監視と接続     |
| 30 | AWS Budgets用語                      | コスト最適化と接続   |

---

## 10. ページ種別ごとのSEO方針

| ページ種別  | SEO方針                             |
| ------ | --------------------------------- |
| トップページ | ブランド・学習サイト全体説明                    |
| ロードマップ | 初学者向け学習順序                         |
| 用語詳細   | 「what is」「是什麼」系キーワード              |
| 比較詳細   | 「difference」「差異」系キーワード            |
| 構成図詳細  | 「architecture diagram」「架構圖」系キーワード |
| ブログ    | 体験・実装・無料枠・学習方法                    |
| 模擬問題   | Phase 5後半。dump回避文言を必ず入れる          |

---

## 11. 成功指標

## 11.1 Search Console

| 指標          | 初期目標       |
| ----------- | ---------- |
| /en インデックス  | 主要20ページ以上  |
| /zh インデックス  | 主要20ページ以上  |
| 英語クエリ表示回数   | 30日で100回以上 |
| 中国語クエリ表示回数  | 30日で50回以上  |
| 比較ページの表示回数  | 増加傾向       |
| 構成図ページの表示回数 | 増加傾向       |

## 11.2 Google Analytics

| 指標           | 初期目標                 |
| ------------ | -------------------- |
| 海外ユーザー比率     | 現状より増加               |
| /en PV       | 計測できる状態              |
| /zh PV       | 計測できる状態              |
| 平均エンゲージメント時間 | 日本語ページとの差を見る         |
| 内部リンククリック    | 用語 → 比較 → 構成図への遷移を確認 |

---

## 12. 実装への引き継ぎ

P5-000完了後、次に進めるタスクは以下である。

1. P5-000-1 多言語コンテンツ優先順位決定
2. P5-000-2 差別化メッセージ作成
3. P5-000-3 禁止表現リスト作成
4. P5-001 多言語対応方針確定
5. P5-002 多言語URL設計

ただし、本ドキュメント内で P5-000-1 から P5-000-3 の材料は作成済みである。

---

## 13. 完了条件チェック

| 条件                  | 判定 |
| ------------------- | -- |
| 英語圏の競合カテゴリが整理されている  | OK |
| 中国語圏の競合カテゴリが整理されている | OK |
| 狙うキーワードが整理されている     | OK |
| 避けるキーワードが整理されている    | OK |
| 差別化方針が整理されている       | OK |
| 翻訳優先ページの仮説がある       | OK |
| 後続タスクへ引き継げる         | OK |

