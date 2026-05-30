import type { Metadata } from "next";
import Link from "next/link";

type RoadmapStep = {
  step: string;
  title: string;
  target: string;
  description: string;
  items: string[];
  href: string;
  hrefLabel: string;
};

type ExamComparison = {
  item: string;
  clf: string;
  saa: string;
};

type ImplementationMapping = {
  learningTopic: string;
  implementation: string;
  awsServices: string[];
};

const roadmapSteps: RoadmapStep[] = [
  {
    step: "Step 1",
    title: "AWS学習の全体像をつかむ",
    target: "初学者",
    description:
      "まずはAWSが何を提供するクラウドサービスなのか、どの分野のサービスがあるのかを整理します。",
    items: [
      "クラウドの基本概念",
      "リージョンとアベイラビリティゾーン",
      "責任共有モデル",
      "主要サービスカテゴリ",
    ],
    href: "/blog",
    hrefLabel: "AWS学習記事を見る",
  },
  {
    step: "Step 2",
    title: "Cloud Practitionerの基礎を固める",
    target: "CLF-C02",
    description:
      "CLF-C02では、AWSの基本概念、セキュリティ、主要サービス、料金、サポートを広く浅く理解します。",
    items: [
      "Cloud Concepts",
      "Security and Compliance",
      "Cloud Technology and Services",
      "Billing, Pricing, and Support",
    ],
    href: "/questions/clf",
    hrefLabel: "CLF模擬問題へ進む",
  },
  {
    step: "Step 3",
    title: "主要AWSサービスを用語集で確認する",
    target: "CLF / SAA 共通",
    description:
      "IAM、S3、EC2、Lambda、VPC、RDS、DynamoDBなど、試験にも実装にも出るサービスを理解します。",
    items: [
      "サービスの一言説明",
      "主な用途",
      "試験で問われるポイント",
      "コスト・セキュリティの注意点",
    ],
    href: "/terms",
    hrefLabel: "AWS用語集を見る",
  },
  {
    step: "Step 4",
    title: "似ているサービスの違いを比較する",
    target: "CLF / SAA 共通",
    description:
      "AWS試験では似ているサービスの使い分けが問われます。比較表で違いを整理します。",
    items: [
      "S3 / EBS / EFS",
      "RDS / DynamoDB",
      "SNS / SQS / EventBridge",
      "CloudWatch / CloudTrail / AWS Config",
    ],
    href: "/comparisons",
    hrefLabel: "サービス比較を見る",
  },
  {
    step: "Step 5",
    title: "模擬問題で理解度を確認する",
    target: "CLF-C02",
    description:
      "問題を解き、正解理由と不正解選択肢の理由を確認します。暗記ではなく、選択肢の違いを説明できる状態を目指します。",
    items: [
      "問題文の条件を読む",
      "選択肢を比較する",
      "正解理由を確認する",
      "関連用語へ戻って復習する",
    ],
    href: "/questions",
    hrefLabel: "模擬問題トップへ進む",
  },
  {
    step: "Step 6",
    title: "SAA向けに構成図で理解する",
    target: "SAA-C03",
    description:
      "SAAではサービス単体の暗記では足りません。可用性、耐障害性、セキュリティ、コストを構成として理解します。",
    items: [
      "S3 + CloudFront 静的サイト構成",
      "API Gateway + Lambda + DynamoDB 構成",
      "3層Webアプリ構成",
      "高可用性Webアプリ構成",
    ],
    href: "/architectures",
    hrefLabel: "AWS構成図を見る",
  },
  {
    step: "Step 7",
    title: "学んだAWSを実装で説明できる形にする",
    target: "Portfolio",
    description:
      "資格で学んだサービスを、このサイトの実装に結びつけます。面接では、なぜそのAWSサービスを選んだのか説明できることが重要です。",
    items: [
      "S3に静的ファイルを配置する",
      "CloudFrontでHTTPS配信する",
      "Lambdaで問い合わせ処理を行う",
      "DynamoDBに問い合わせを保存する",
    ],
    href: "/architectures",
    hrefLabel: "ポートフォリオ構成を見る",
  },
];

const examComparisons: ExamComparison[] = [
  {
    item: "学習範囲",
    clf: "AWS全体の基本知識を広く学ぶ",
    saa: "設計パターン、可用性、耐障害性、コスト最適化を深く学ぶ",
  },
  {
    item: "問われ方",
    clf: "サービスの役割や料金、サポートの基本を問われる",
    saa: "要件に合うアーキテクチャを選ぶ判断力を問われる",
  },
  {
    item: "学習の軸",
    clf: "用語、責任共有モデル、主要サービス、料金",
    saa: "VPC、冗長化、スケーリング、DB選定、セキュリティ",
  },
  {
    item: "このサイトでの学び方",
    clf: "用語集、比較、CLF模擬問題を中心に学ぶ",
    saa: "構成図、設計ポイント、実装との対応を中心に学ぶ",
  },
];

const implementationMappings: ImplementationMapping[] = [
  {
    learningTopic: "ストレージ",
    implementation: "静的ファイルをS3に配置する",
    awsServices: ["S3"],
  },
  {
    learningTopic: "グローバル配信",
    implementation: "CloudFrontでHTTPS配信とキャッシュを行う",
    awsServices: ["CloudFront", "OAC"],
  },
  {
    learningTopic: "サーバーレス処理",
    implementation: "問い合わせフォームの処理をLambdaで実行する",
    awsServices: ["Lambda", "API Gateway"],
  },
  {
    learningTopic: "NoSQLデータベース",
    implementation: "問い合わせデータをDynamoDBに保存する",
    awsServices: ["DynamoDB"],
  },
  {
    learningTopic: "監視とコスト管理",
    implementation: "ログ確認と課金アラートで運用リスクを下げる",
    awsServices: ["CloudWatch", "AWS Budgets"],
  },
];

export const metadata: Metadata = {
  title: "AWS学習ロードマップ | AWS資格ロードマップラボ",
  description:
    "AWS Cloud PractitionerからSolutions Architect Associateまで、AWS初学者が学ぶ順番と実装で理解するポイントを整理したロードマップです。",
};

export default function RoadmapPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-bold text-sky-100">
            AWS Learning Roadmap
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Cloud PractitionerからSAAまでの学習順序
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              AWS初学者が、用語理解、サービス比較、模擬問題、構成図、実装経験へ進むための学習ロードマップです。
              資格学習を暗記で終わらせず、AWS上で動くポートフォリオとして説明できる状態を目指します。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/questions/clf"
              className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              CLF模擬問題を解く
            </Link>
            <Link
              href="/architectures"
              className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              AWS構成図を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
            Roadmap Steps
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            学習ステップ
          </h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            まずCLF-C02でAWSの全体像をつかみ、その後SAA-C03で構成設計を学びます。
            最後に、このサイト自体のAWS構成と結びつけてポートフォリオ化します。
          </p>
        </div>

        <div className="space-y-5">
          {roadmapSteps.map((step) => (
            <article
              key={step.step}
              className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="text-sm font-bold text-sky-700">{step.step}</p>
                <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {step.target}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>

                <ul className="grid gap-2 sm:grid-cols-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={step.href}
                  className="inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
                >
                  {step.hrefLabel}
                  <span aria-hidden="true" className="ml-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
            CLF vs SAA
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            Cloud PractitionerとSAAの違い
          </h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            CLFはAWS全体の基礎理解、SAAは要件に合わせてAWS構成を選ぶ設計力が中心です。
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 border-b border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 md:grid-cols-[180px_1fr_1fr]">
            <div className="px-5 py-4">比較項目</div>
            <div className="px-5 py-4">CLF-C02</div>
            <div className="px-5 py-4">SAA-C03</div>
          </div>

          {examComparisons.map((comparison) => (
            <div
              key={comparison.item}
              className="grid grid-cols-1 border-b border-slate-100 text-sm last:border-b-0 md:grid-cols-[180px_1fr_1fr]"
            >
              <div className="bg-slate-50 px-5 py-4 font-bold text-slate-800">
                {comparison.item}
              </div>
              <div className="px-5 py-4 leading-6 text-slate-600">
                {comparison.clf}
              </div>
              <div className="px-5 py-4 leading-6 text-slate-600">
                {comparison.saa}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
            Learning to Implementation
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            AWS学習とこのサイトの実装対応
          </h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            資格で学ぶAWSサービスを、このサイトの実装に対応させます。
            面接では「どのサービスを、なぜ使ったか」を説明できる状態を目指します。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {implementationMappings.map((mapping) => (
            <article
              key={mapping.learningTopic}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {mapping.learningTopic}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {mapping.implementation}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mapping.awsServices.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-sky-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
                Next Action
              </p>
              <h2 className="text-3xl font-bold text-slate-950">
                まずはCLFの用語と問題から始める
              </h2>
              <p className="leading-7 text-slate-700">
                初学者は、最初からSAA構成図に進むより、AWS主要サービスの役割とCLF模擬問題から始める方が理解しやすいです。
                用語集でサービスの役割を確認し、模擬問題で定着を確認します。
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/terms"
                className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                AWS用語集を見る
              </Link>
              <Link
                href="/questions/clf"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                CLF模擬問題へ進む
              </Link>
              <Link
                href="/architectures"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                SAA構成図を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}