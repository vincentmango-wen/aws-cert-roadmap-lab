import type { Metadata } from "next";
import Link from "next/link";

import { createLocaleAwareRobots } from "@/lib/seo";

const pagePath = "/zh/disclaimer";

export const metadata: Metadata = {
  title: "免責聲明 | AWS Cert Roadmap Lab",
  description:
    "AWS Cert Roadmap Lab 的繁體中文免責聲明。說明 AWS 資格學習資訊、模擬題、架構圖、外部連結、資訊正確性與責任限制等方針。",
  alternates: {
    canonical: pagePath,
  },
  robots: createLocaleAwareRobots(pagePath),
  openGraph: {
    title: "免責聲明 | AWS Cert Roadmap Lab",
    description:
      "AWS Cert Roadmap Lab 的繁體中文免責聲明。請在使用 AWS 資格學習內容前確認本頁說明。",
    url: "/zh/disclaimer",
    siteName: "AWS Cert Roadmap Lab",
    locale: "zh_TW",
    type: "website",
  },
};

const disclaimerSections = [
  {
    title: "關於資訊的正確性",
    body: [
      "AWS Cert Roadmap Lab 會盡力提高本站所刊載的 AWS 服務資訊、資格學習資訊、架構圖、比較文章與模擬題的正確性。",
      "但是，本站不保證所有內容的正確性、完整性、即時性或實用性。",
      "AWS 服務規格、費用、認證考試範圍與出題傾向可能會變更。重要判斷請以 AWS 官方資訊為準。",
    ],
  },
  {
    title: "關於 AWS 認證考試資訊",
    body: [
      "本站內容是為了輔助 AWS Cloud Practitioner、AWS Solutions Architect Associate 等 AWS 認證學習而製作。",
      "本站並非由 Amazon Web Services, Inc. 或其關係企業正式提供、認可或營運的網站。",
      "考試報名、考試範圍、考試費用、考試政策與最新出題範圍，請務必確認 AWS 官方網站與 AWS 認證考試指南。",
    ],
  },
  {
    title: "關於學習成果",
    body: [
      "本站不保證使用本站內容後一定能通過認證考試，也不保證學習成果、工作成果、轉職成果或其他成果。",
      "模擬題與解說的目的在於輔助理解，並不代表實際考試題目或實際出題內容。",
      "學習計畫、考試報名與受驗判斷，請由使用者自行負責。",
    ],
  },
  {
    title: "關於 AWS 架構與實作資訊",
    body: [
      "本站刊載的 AWS 架構圖、Serverless 架構、IAM、Amazon S3、Amazon CloudFront、AWS Lambda、Amazon DynamoDB 等說明，皆為學習與作品集展示目的之參考資訊。",
      "若要套用到實務環境或正式環境，請先確認需求、資安、成本、可用性與運維體制，再進行設計與實作。",
      "AWS 使用費會依區域、使用量與設定內容而變動。實際費用請確認 AWS 官方價格頁面、AWS Billing、Cost Explorer 等官方工具。",
    ],
  },
  {
    title: "關於損害責任",
    body: [
      "使用或無法使用本站資訊而造成的任何損害，本站營運者不承擔責任。",
      "AWS 設定錯誤、費用產生、考試報名錯誤、學習判斷、業務判斷等事項，請由使用者自行確認並負責。",
    ],
  },
  {
    title: "關於外部連結",
    body: [
      "本站可能包含 AWS 官方網站、GitHub、note 以及其他外部網站的連結。",
      "外部連結網站的內容、正確性、安全性與個人資料處理方式，本站營運者不承擔責任。",
      "使用外部網站時，請確認各網站的使用條款、隱私權政策與資安方針。",
    ],
  },
  {
    title: "關於內容更新",
    body: [
      "本站內容可能在未事先通知的情況下新增、修改或刪除。",
      "部分文章或頁面可能包含過期資訊。進行重要判斷時，請確認頁面更新日，並優先參考 AWS 官方資訊。",
    ],
  },
];

export default function ChineseDisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-2xl bg-slate-50 px-6 py-8">
        <p className="mb-3 text-sm font-semibold text-orange-600">
          Disclaimer
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          免責聲明
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          使用 AWS Cert Roadmap Lab 前，請先確認以下免責聲明。
          本站是為了輔助 AWS 資格學習而製作的個人營運學習網站，並非 AWS 官方網站。
        </p>
      </section>

      <section className="space-y-8">
        {disclaimerSections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          請確認 AWS 官方資訊
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          AWS 認證考試的最新資訊、AWS 服務規格、價格與資安設定，請務必確認
          AWS 官方文件、AWS 認證官方頁面與 AWS 官方價格頁面。
        </p>
      </section>

      <section className="mt-10 rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold">聯絡與錯誤回報</h2>
        <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
          如果發現本站內容有錯誤或過期資訊，請透過聯絡頁面告知。
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold !text-slate-900 transition hover:bg-slate-100"
          >
            前往聯絡頁面
          </Link>
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        制定日：2026年6月1日
      </p>
    </main>
  );
}