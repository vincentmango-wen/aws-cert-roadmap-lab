import type { Metadata } from "next";
import Link from "next/link";
import { createAbsoluteUrl, createLocaleAwareRobots, siteConfig } from "@/lib/seo";

const pagePath = "/zh";

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

const pageTitle = "AWS證照路線圖實驗室";
const pageDescription =
  "面向AWS初學者的學習網站，透過術語、服務比較、模擬題與架構圖，整理AWS Cloud Practitioner與SAA的學習重點。";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "AWS",
    "AWS證照",
    "AWS Cloud Practitioner",
    "AWS SAA",
    "AWS學習",
    "AWS架構圖",
    "AWS服務比較",
  ],
  alternates: {
    canonical: createAbsoluteUrl(pagePath),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: createAbsoluteUrl("/zh"),
    siteName: siteConfig.shortName,
    images: [
      {
        url: createAbsoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [createAbsoluteUrl(siteConfig.defaultOgImage)],
  },
  robots: createLocaleAwareRobots(pagePath),
};

const featureCards: FeatureCard[] = [
  {
    title: "AWS術語集",
    description:
      "整理IAM、S3、EC2、Lambda等初學者在Cloud Practitioner階段最先需要掌握的AWS服務。",
    href: "/zh/terms",
    label: "查看術語",
  },
  {
    title: "服務比較",
    description:
      "比較S3 / EBS / EFS、RDS / DynamoDB等容易在考試中混淆的AWS服務差異。",
    href: "/zh/comparisons",
    label: "查看比較",
  },
  {
    title: "模擬題",
    description:
      "透過CLF-C02方向的練習題，理解正確答案的理由，以及錯誤選項為什麼不合適。",
    href: "/zh/questions",
    label: "開始練習",
  },
  {
    title: "AWS架構圖",
    description:
      "用圖解理解S3 + CloudFront、API Gateway + Lambda + DynamoDB等接近實務的雲端架構。",
    href: "/zh/architectures",
    label: "查看架構",
  },
];

const blogPreviews: BlogPreview[] = [
  {
    title: "AWS Cloud Practitioner學習路線圖",
    description:
      "整理初學者準備Cloud Practitioner時，應該先掌握的學習順序與重點。",
    href: "/zh/blog/aws-cloud-practitioner-roadmap",
    category: "CLF",
  },
  {
    title: "用AWS免費額度打造作品集的思路",
    description:
      "說明個人開發如何控制成本，同時展示AWS實作經驗與雲端設計思維。",
    href: "/zh/blog/aws-free-tier-portfolio",
    category: "Portfolio",
  },
  {
    title: "用S3與CloudFront發布靜態網站",
    description:
      "學習不直接公開S3，而是透過CloudFront與OAC安全發布靜態網站的基本架構。",
    href: "/zh/blog/s3-cloudfront-static-site",
    category: "Serverless",
  },
];

const awsServices: AwsService[] = [
  {
    name: "Amazon S3",
    role: "保存HTML、CSS、JavaScript與圖片等靜態檔案",
  },
  {
    name: "Amazon CloudFront",
    role: "負責HTTPS發布、快取與全球內容配送",
  },
  {
    name: "AWS Lambda",
    role: "以Serverless方式執行聯絡表單處理",
  },
  {
    name: "Amazon DynamoDB",
    role: "保存聯絡表單送出的資料",
  },
];

export default function ChineseHomePage(): React.JSX.Element {
  return (
    <div className="space-y-20">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-medium text-sky-100">
              AWS Cloud Practitioner / SAA 學習網站
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                用
                <span className="text-sky-300">術語・比較・模擬題・架構圖</span>
                理解AWS證照學習
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                從Cloud Practitioner到Solutions Architect Associate，
                這個網站面向AWS初學者，整理服務差異、考試重點與實務使用情境。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/zh/questions"
                className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                開始做模擬題
              </Link>

              <Link
                href="/zh/terms"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                查看AWS術語集
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-sky-200">
              你可以在這裡學到
            </p>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-2xl font-bold">30+</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  AWS主要服務的術語整理
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">CLF-C02</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  Cloud Practitioner方向的模擬題
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">Serverless</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  S3 / CloudFront / Lambda / DynamoDB 架構
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
          <h2 className="text-3xl font-bold text-slate-950">學習分類</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            不只背誦服務名稱，而是把服務角色、相似服務差異，以及架構圖中的使用方式連在一起學習。
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
              從Cloud Practitioner開始
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              先學習AWS基本概念、共同責任模型、主要服務、計費與支援。
              接著透過術語集與模擬題，鞏固考試常見的基礎知識。
            </p>
            <Link
              href="/zh/roadmap"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              查看學習路線圖
            </Link>
          </article>

          <article className="rounded-3xl bg-slate-100 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
              For SAA-C03
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              用架構圖連接SAA考點
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              透過架構圖學習高可用性、容錯性、安全性與成本最佳化。
              目標不是只記住單一服務，而是能說明服務如何組合成架構。
            </p>
            <Link
              href="/zh/architectures"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              查看AWS架構圖
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
            <h2 className="text-3xl font-bold text-slate-950">最新文章</h2>
            <p className="max-w-3xl leading-7 text-slate-600">
              這裡會持續追加AWS證照、Serverless架構、免費額度與作品集開發相關文章。
            </p>
          </div>

          <Link
            href="/zh/blog"
            className="text-sm font-bold text-sky-700 hover:text-sky-900"
          >
            查看文章列表 →
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
                閱讀文章 →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-300">
                Portfolio Architecture
              </p>
              <h2 className="text-3xl font-bold">
                這個網站本身也是AWS作品集
              </h2>
              <p className="leading-7 text-slate-300">
                本網站以S3與CloudFront發布靜態內容，並規劃用API Gateway、
                Lambda與DynamoDB處理聯絡表單。它不是單純的學習筆記，
                而是把AWS證照知識落實到實作架構中的作品。
              </p>
              <Link
                href="/zh/architectures"
                className="inline-flex rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                查看架構圖
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