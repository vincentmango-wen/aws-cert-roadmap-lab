import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, siteConfig } from "@/lib/seo";
import type { PageMetadataInput } from "@/lib/seo";

const aboutZhSeo: PageMetadataInput = {
  title: "關於本站 | AWS證照路線圖實驗室",
  description:
    "了解AWS證照路線圖實驗室的製作背景、學習目的、技術架構，以及作為AWS Serverless作品集的定位。",
  path: "/zh/about",
  keywords: [
    "AWS證照",
    "AWS學習",
    "AWS Cloud Practitioner",
    "AWS Solutions Architect Associate",
    "AWS作品集",
    "Serverless作品集",
    "AWS架構圖",
  ],
  image: siteConfig.chineseOgImage,
  imageAlt: "關於AWS證照路線圖實驗室",
  locale: "zh",
  enableLanguageAlternates: true,
};

export const metadata: Metadata = createPageMetadata(aboutZhSeo);

const profileItems = [
  {
    label: "營運者",
    value: "ふみくん",
  },
  {
    label: "網站名稱",
    value: "AWS證照路線圖實驗室",
  },
  {
    label: "主要主題",
    value: "AWS證照學習、Serverless開發、作品集製作",
  },
  {
    label: "目標讀者",
    value: "正在準備AWS Cloud Practitioner或Solutions Architect Associate的初學者",
  },
];

const sitePurposes = [
  "整理AWS Cloud Practitioner與SAA的學習內容，讓知識不只停留在背誦。",
  "透過術語集、服務比較、模擬題與架構圖，幫助初學者理解AWS服務的角色與差異。",
  "展示使用Amazon S3、CloudFront、Lambda、API Gateway、DynamoDB等服務的實作經驗。",
  "將網站逐步發展成兼具學習輸出、SEO內容與作品集價值的AWS學習媒體。",
];

const techStacks = [
  {
    category: "Frontend",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown / MDX", "JSON"],
  },
  {
    category: "AWS",
    items: [
      "Amazon S3",
      "Amazon CloudFront",
      "Amazon API Gateway",
      "AWS Lambda",
      "Amazon DynamoDB",
      "Amazon CloudWatch",
      "IAM",
      "AWS Budgets",
    ],
  },
  {
    category: "Development",
    items: ["GitHub", "GitHub Actions", "靜態網站生成", "Serverless架構"],
  },
];

const roadmapItems = [
  {
    title: "Phase 1",
    description:
      "建立AWS術語集、服務比較、模擬題與架構圖解說，先完成可閱讀的靜態學習網站。",
  },
  {
    title: "Phase 2",
    description:
      "使用API Gateway、Lambda與DynamoDB實作聯絡表單，讓網站具備最小動態處理能力。",
  },
  {
    title: "Phase 3",
    description:
      "導入GitHub Actions、S3與CloudFront部署流程，整理基本的CI/CD與運用監控。",
  },
  {
    title: "Phase 4",
    description:
      "增加SEO文章、改善內容導線，準備AdSense、Search Console與自訂網域。",
  },
  {
    title: "Phase 5",
    description:
      "維持既有日文URL不變，新增英文與繁體中文頁面，驗證海外搜尋流量與多語SEO。",
  },
];

export default function AboutZhPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p className="text-sm font-semibold text-blue-700">About</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          關於AWS證照路線圖實驗室
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
          AWS證照路線圖實驗室是一個把AWS證照學習轉換成實作輸出的學習網站。
          這個網站不只是整理考試用語，而是把AWS服務的概念、服務比較、
          模擬題、架構圖，以及實際部署經驗連接起來。
        </p>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          本站同時也是一個AWS作品集專案。透過靜態前端、Serverless API、
          受管資料庫、CI/CD、監控、成本控制與安全設計，展示如何用低成本方式
          建立可以公開展示的AWS學習網站。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profileItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <dt className="text-sm font-semibold text-slate-500">{item.label}</dt>
              <dd className="mt-2 text-base font-semibold text-slate-900">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">本站目的</h2>

          <ul className="mt-5 space-y-4">
            {sitePurposes.map((purpose) => (
              <li key={purpose} className="flex gap-3 text-slate-700">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  ✓
                </span>
                <span className="leading-7">{purpose}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">學習背景</h2>

          <p className="mt-5 leading-8 text-slate-200">
            這個網站是為了把AWS Cloud Practitioner與Solutions Architect
            Associate的學習內容記錄下來，並實際部署成在AWS上運作的Web網站。
            目標不只是理解考試範圍，也要能說明設計意圖、成本管理、安全性、
            部署流程與運用監控。
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">使用技術</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {techStacks.map((stack) => (
            <div
              key={stack.category}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-slate-900">{stack.category}</h3>

              <ul className="mt-4 space-y-2">
                {stack.items.map((item) => (
                  <li key={item} className="text-sm leading-6 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">開發路線圖</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {roadmapItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-blue-700">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">相關連結</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href="https://github.com/vincentmango-wen/aws-cert-roadmap-lab"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            查看GitHub
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              可以確認原始碼、README、AWS架構圖與設計說明。
            </span>
          </a>

          <a
            href="https://note.com/fumi_ai_202507"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            查看note
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              發布AWS學習、生成AI活用與個人開發相關文章。
            </span>
          </a>

          <Link
            href="/contact"
            className="rounded-2xl bg-blue-700 p-5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
          >
            聯絡我們
            <span className="mt-2 block text-sm font-normal leading-6 text-blue-100">
              內容修正、意見回饋或專案諮詢可以從聯絡頁面送出。
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}