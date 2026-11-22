import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AWS 證照學習路線圖",
  description:
    "從 AWS Cloud Practitioner 到 Solutions Architect Associate 的實用學習順序，搭配術語集、服務比較、模擬題、架構圖與實作案例。",
  path: "/zh/roadmap",
  keywords: [
    "AWS 學習路線圖",
    "Cloud Practitioner",
    "Solutions Architect Associate",
    "CLF-C02",
    "SAA-C03",
  ],
});

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
    step: "步驟 1",
    title: "先掌握 AWS 學習全貌",
    target: "初學者",
    description:
      "先了解雲端服務能做什麼，以及 AWS 如何分類各項服務。建立整體概念後，後續學習會更容易串起來。",
    items: [
      "雲端運算基本概念",
      "區域與可用區域",
      "共同責任模型",
      "主要 AWS 服務類別",
    ],
    href: "/zh/blog",
    hrefLabel: "閱讀 AWS 學習文章",
  },
  {
    step: "步驟 2",
    title: "打好 Cloud Practitioner 基礎",
    target: "CLF-C02",
    description:
      "CLF-C02 涵蓋 AWS 概念、安全性、核心服務、費用與支援。試著用自己的話說明觀念，不要只背服務名稱。",
    items: [
      "Cloud Concepts",
      "Security and Compliance",
      "Cloud Technology and Services",
      "Billing, Pricing, and Support",
    ],
    href: "/zh/questions/clf",
    hrefLabel: "練習 CLF 模擬題",
  },
  {
    step: "步驟 3",
    title: "在情境中認識 AWS 核心服務",
    target: "CLF 與 SAA",
    description:
      "熟悉 IAM、S3、EC2、Lambda、VPC、RDS、DynamoDB 等服務。這些都是兩種考試與實際架構中常見的基礎元件。",
    items: [
      "服務的一句話說明",
      "常見使用情境",
      "考試常見重點",
      "費用與安全性考量",
    ],
    href: "/zh/terms",
    hrefLabel: "瀏覽 AWS 術語集",
  },
  {
    step: "步驟 4",
    title: "比較用途相近的 AWS 服務",
    target: "CLF 與 SAA",
    description:
      "考題常要求從功能相近的服務中選擇合適方案。先比較使用情境與取捨，再練習較長的案例題。",
    items: [
      "S3、EBS 與 EFS",
      "RDS 與 DynamoDB",
      "SNS、SQS 與 EventBridge",
      "CloudWatch、CloudTrail 與 AWS Config",
    ],
    href: "/zh/comparisons",
    hrefLabel: "比較 AWS 服務",
  },
  {
    step: "步驟 5",
    title: "透過模擬題確認理解程度",
    target: "CLF-C02",
    description:
      "先讀清楚題目條件，再比較各個選項並確認正誤理由。如果觀念仍不清楚，就回到相關術語複習。",
    items: [
      "找出題目中的條件",
      "比較各個選項",
      "說明正確答案的理由",
      "複習相關服務與術語",
    ],
    href: "/zh/questions",
    hrefLabel: "前往模擬題列表",
  },
  {
    step: "步驟 6",
    title: "用架構圖學習 SAA 設計",
    target: "SAA-C03",
    description:
      "準備 SAA-C03 時，認識單一服務只是起點。要學會如何依據可用性、韌性、安全性與費用設計完整架構。",
    items: [
      "以 S3 與 CloudFront 架設靜態網站",
      "API Gateway、Lambda 與 DynamoDB",
      "三層式 Web 應用程式",
      "高可用性 Web 應用程式",
    ],
    href: "/zh/architectures",
    hrefLabel: "瀏覽 AWS 架構圖",
  },
  {
    step: "步驟 7",
    title: "透過實作說明 AWS 服務的選擇",
    target: "作品集",
    description:
      "把考試觀念連結到實際運作的專案。除了知道服務用途，也要能說明它為什麼符合需求。",
    items: [
      "將靜態檔案存放在 S3",
      "透過 CloudFront 提供 HTTPS",
      "使用 Lambda 處理表單請求",
      "將提交資料存入 DynamoDB",
    ],
    href: "/zh/architectures",
    hrefLabel: "查看專案架構",
  },
];

const examComparisons: ExamComparison[] = [
  {
    item: "學習範圍",
    clf: "廣泛認識 AWS 與雲端運算基礎",
    saa: "深入學習設計模式、韌性、可用性與成本",
  },
  {
    item: "題目形式",
    clf: "詢問服務用途、費用與支援服務的基本知識",
    saa: "依照需求選擇合適的架構設計",
  },
  {
    item: "準備重點",
    clf: "核心術語、共同責任、服務與費用",
    saa: "VPC、備援、擴展、資料庫選擇與安全性",
  },
  {
    item: "本站的學習方式",
    clf: "從術語集、服務比較與 CLF 模擬題開始",
    saa: "著重架構圖、設計判斷與實作案例",
  },
];

const implementationMappings: ImplementationMapping[] = [
  {
    learningTopic: "儲存",
    implementation: "將網站的靜態檔案放在物件儲存服務中。",
    awsServices: ["S3"],
  },
  {
    learningTopic: "全球傳遞",
    implementation: "透過 HTTPS 傳送內容，並在更靠近訪客的位置快取。",
    awsServices: ["CloudFront", "OAC"],
  },
  {
    learningTopic: "無伺服器處理",
    implementation: "處理聯絡表單，不必自行管理伺服器。",
    awsServices: ["Lambda", "API Gateway"],
  },
  {
    learningTopic: "NoSQL 資料庫",
    implementation: "將聯絡表單提交內容存入受管理的鍵值資料庫。",
    awsServices: ["DynamoDB"],
  },
  {
    learningTopic: "監控與費用管理",
    implementation: "查看日誌並設定帳單提醒，及早發現營運問題。",
    awsServices: ["CloudWatch", "AWS Budgets"],
  },
];

export default function ChineseRoadmapPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-bold text-sky-100">
            AWS 學習路線圖
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              從 Cloud Practitioner 到 Solutions Architect Associate 的學習順序
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              按照實用的順序，從 AWS 基礎開始，逐步學習服務比較、模擬題、架構圖與實作。目標是不只認得考試術語，也能在作品專案中說明所學觀念。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/zh/questions/clf"
              className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              練習 CLF-C02 模擬題
            </Link>
            <Link
              href="/zh/architectures"
              className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              瀏覽 AWS 架構
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">學習步驟</p>
          <h2 className="text-3xl font-bold text-slate-950">循序漸進的準備方式</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            先透過 CLF-C02 掌握 AWS 全貌，再用 SAA-C03 練習架構判斷。最後把學到的內容連結到以 AWS 建置的專案。
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
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
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
                <Link href={step.href} className="inline-flex text-sm font-bold text-sky-700 hover:text-sky-900">
                  {step.hrefLabel}
                  <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">CLF vs SAA</p>
          <h2 className="text-3xl font-bold text-slate-950">Cloud Practitioner 與 SAA 的差異</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            CLF 著重 AWS 基礎概念；SAA 則要求依據條件選擇並說明合適的架構。
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
              <div className="bg-slate-50 px-5 py-4 font-bold text-slate-800">{comparison.item}</div>
              <div className="px-5 py-4 leading-6 text-slate-600">{comparison.clf}</div>
              <div className="px-5 py-4 leading-6 text-slate-600">{comparison.saa}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">從學習到實作</p>
          <h2 className="text-3xl font-bold text-slate-950">將 AWS 學習連結到實際專案</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            把準備考試時學到的服務，對照本站實際使用的服務。好的作品集說明不只介紹服務，也會解釋它如何符合需求。
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {implementationMappings.map((mapping) => (
            <article key={mapping.learningTopic} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">{mapping.learningTopic}</h3>
              <p className="mt-3 leading-7 text-slate-600">{mapping.implementation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mapping.awsServices.map((service) => (
                  <span key={service} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
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
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">下一步</p>
              <h2 className="text-3xl font-bold text-slate-950">從 CLF 術語與模擬題開始</h2>
              <p className="leading-7 text-slate-700">
                如果剛接觸 AWS，先了解核心服務用途並練習 CLF 題目，再進入 SAA 架構圖會比較容易。遇到不熟悉的服務，可先查術語集，再用題目確認理解。
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/zh/terms" className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800">
                瀏覽 AWS 術語集
              </Link>
              <Link href="/zh/questions/clf" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50">
                練習 CLF 模擬題
              </Link>
              <Link href="/zh/architectures" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50">
                查看 SAA 架構圖
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
