import Link from "next/link";

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  label: string;
};

type BlogPreview = {
  title: string;
  description: string;
  href: string;
  category: string;
};

type AwsService = {
  name: string;
  role: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "AWS用語集",
    description:
      "IAM、S3、EC2、Lambdaなど、Cloud Practitionerで最初に押さえるべきAWSサービスを整理します。",
    href: "/terms",
    label: "用語を見る",
  },
  {
    title: "サービス比較",
    description:
      "S3 / EBS / EFS、RDS / DynamoDBなど、試験で混同しやすいサービスの違いを比較します。",
    href: "/comparisons",
    label: "比較を見る",
  },
  {
    title: "模擬問題",
    description:
      "CLF-C02向けの問題を解きながら、正解理由と不正解選択肢の違いを確認します。",
    href: "/questions",
    label: "問題を解く",
  },
  {
    title: "AWS構成図",
    description:
      "S3 + CloudFront、API Gateway + Lambda + DynamoDBなど、実務に近い構成を図で理解します。",
    href: "/architectures",
    label: "構成を見る",
  },
];

const blogPreviews: BlogPreview[] = [
  {
    title: "AWS Cloud Practitionerの学習ロードマップ",
    description:
      "初学者がCloud Practitioner合格までに押さえるべき学習順序を整理します。",
    href: "/blog/aws-cloud-practitioner-roadmap",
    category: "CLF",
  },
  {
    title: "AWS無料枠でポートフォリオを作る考え方",
    description:
      "個人開発でコストを抑えながらAWS実装経験を示す方法を解説します。",
    href: "/blog/aws-free-tier-portfolio",
    category: "Portfolio",
  },
  {
    title: "S3とCloudFrontで静的サイトを公開する基本",
    description:
      "S3を直接公開せず、CloudFront経由で配信する構成の考え方を学びます。",
    href: "/blog/s3-cloudfront-static-site",
    category: "Serverless",
  },
];

const awsServices: AwsService[] = [
  {
    name: "Amazon S3",
    role: "静的ファイルを保存する",
  },
  {
    name: "Amazon CloudFront",
    role: "HTTPS配信とキャッシュを担当する",
  },
  {
    name: "AWS Lambda",
    role: "問い合わせ処理をサーバーレスで実行する",
  },
  {
    name: "Amazon DynamoDB",
    role: "問い合わせデータを保存する",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-medium text-sky-100">
              AWS Cloud Practitioner / SAA 学習サイト
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                AWS資格学習を、
                <span className="text-sky-300">用語・比較・問題・構成図</span>
                で理解する
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Cloud PractitionerからSolutions Architect Associateまで、
                初学者向けにAWSサービスの違い、試験ポイント、実務での使いどころを整理する学習サイトです。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questions"
                className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                模擬問題を解く
              </Link>

              <Link
                href="/terms"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                用語集を見る
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-sky-200">
              このサイトで学べること
            </p>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-2xl font-bold">30+</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  AWS主要サービスの用語整理
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">CLF-C02</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  Cloud Practitioner向け模擬問題
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">Serverless</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  S3 / CloudFront / Lambda / DynamoDB 構成
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
            Learning Contents
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            学習カテゴリ
          </h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            暗記だけで終わらせず、サービスの役割、似ているサービスとの違い、構成図での使われ方までつなげて学びます。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featureCards.map((card) => (
            <article
              key={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-5 inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
              >
                {card.label}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-sky-50 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
              For CLF-C02
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Cloud Practitionerから始める
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              AWSの基本概念、責任共有モデル、主要サービス、料金・サポートを中心に学びます。
              まずは用語集と模擬問題で、試験で問われる基礎を固めます。
            </p>
            <Link
              href="/roadmap"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              学習ロードマップを見る
            </Link>
          </article>

          <article className="rounded-3xl bg-slate-100 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
              For SAA-C03
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              SAAにつながる構成図で理解する
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              高可用性、耐障害性、セキュリティ、コスト最適化を構成図で学びます。
              サービス単体ではなく、組み合わせとして説明できる状態を目指します。
            </p>
            <Link
              href="/architectures"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              AWS構成図を見る
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
              Latest Articles
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              最新記事
            </h2>
            <p className="max-w-3xl leading-7 text-slate-600">
              AWS資格、サーバーレス構成、無料枠ポートフォリオに関する記事を追加していきます。
            </p>
          </div>

          <Link
            href="/blog"
            className="text-sm font-bold text-sky-700 hover:text-sky-900"
          >
            ブログ一覧へ →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {blogPreviews.map((post) => (
            <article
              key={post.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                {post.category}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-7 text-slate-950">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {post.description}
              </p>
              <Link
                href={post.href}
                className="mt-5 inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
              >
                記事を読む →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-300">
                Portfolio Architecture
              </p>
              <h2 className="text-3xl font-bold">
                サイト自体もAWSポートフォリオとして構築
              </h2>
              <p className="leading-7 text-slate-300">
                このサイトは、静的コンテンツをS3とCloudFrontで配信し、問い合わせフォームを
                API Gateway、Lambda、DynamoDBで処理する構成を目指します。
              </p>
              <Link
                href="/architectures"
                className="inline-flex rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                構成図を確認する
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {awsServices.map((service) => (
                <div
                  key={service.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="font-bold text-white">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {service.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}