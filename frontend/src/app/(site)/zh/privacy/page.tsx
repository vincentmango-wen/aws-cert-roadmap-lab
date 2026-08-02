import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { createAbsoluteUrl, createLocaleAwareRobots, siteConfig } from "@/lib/seo";

type PolicySection = {
  id: string;
  title: string;
  body: ReactElement;
};

const siteName = "AWS Cert Roadmap Lab";
const localizedSiteName = "AWS資格路線圖實驗室";
const establishedDate = "2026年6月1日";
const lastUpdatedDate = "2026年6月14日";
const pagePath = "/zh/privacy";
const pageTitle = "隱私權政策";
const pageDescription =
  "說明 AWS Cert Roadmap Lab 對個人資料、Cookie、Google Analytics、Google AdSense 與聯絡表單資料的處理方針。";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "AWS Cert Roadmap Lab",
    "AWS資格",
    "隱私權政策",
    "Cookie",
    "Google Analytics",
    "Google AdSense",
  ],
  alternates: {
    canonical: createAbsoluteUrl(pagePath),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: createAbsoluteUrl(pagePath),
    siteName: siteConfig.name,
    images: [
      {
        url: createAbsoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: `${pageTitle} - ${siteConfig.shortName}`,
      },
    ],
    // 封印中は他ロケール版の存在を宣言しない（他の en/zh ページと揃える）。
    // 解封時は release-gate.ts の JSDoc「解封前提条件」に従って再投入すること。
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

const policySections: PolicySection[] = [
  {
    id: "basic-policy",
    title: "1. 基本方針",
    body: (
      <>
        <p>
          {siteName}
          （以下稱為「本網站」）是面向 AWS
          資格學習者的學習網站，提供 AWS
          服務詞彙、服務比較、模擬題、架構圖解說與學習文章等內容。
        </p>
        <p>
          本網站在取得使用者個人資料時，僅限於回覆聯絡內容、改善網站內容、維持網站營運與防止不正當使用等目的。
        </p>
        <p>
          本網站作為公開的 AWS
          學習與作品集網站，採取最小資料收集原則，不會在公開頁面或系統日誌中顯示電子郵件全文、聯絡內容全文、API
          金鑰或 AWS 認證資訊。
        </p>
      </>
    ),
  },
  {
    id: "collected-information",
    title: "2. 蒐集的資訊",
    body: (
      <>
        <p>本網站可能會蒐集以下資訊。</p>
        <ul>
          <li>使用者在聯絡表單中輸入的姓名</li>
          <li>使用者在聯絡表單中輸入的電子郵件地址</li>
          <li>使用者在聯絡表單中輸入的主旨與訊息內容</li>
          <li>送出聯絡表單時的來源頁面資訊</li>
          <li>送出聯絡表單時的瀏覽器資訊與 User-Agent 資訊</li>
          <li>
            Google Analytics
            可能取得的瀏覽頁面、參照來源、使用瀏覽器、裝置類型與網站使用情況
          </li>
          <li>透過 Cookie 取得的網站使用資訊</li>
          <li>Google AdSense 等廣告服務可能使用的 Cookie 資訊</li>
        </ul>
        <p>
          目前階段，本網站不提供登入功能、學習歷史保存功能或付款功能。因此，本網站不會取得使用者帳號資料、答題正確率、學習進度或付款資訊。
        </p>
      </>
    ),
  },
  {
    id: "purpose",
    title: "3. 使用目的",
    body: (
      <>
        <p>本網站會將取得的資訊用於以下目的。</p>
        <ul>
          <li>回覆聯絡、錯誤回報與工作相關諮詢</li>
          <li>確認聯絡內容與管理回覆紀錄</li>
          <li>改善網站內容、UI 與學習材料</li>
          <li>防止垃圾訊息、不正當使用與妨害網站營運的行為</li>
          <li>掌握網站使用情況並改善 SEO</li>
          <li>分析熱門內容、離開頁面與搜尋流入情況</li>
          <li>改善 Google AdSense 等廣告服務的品質</li>
          <li>評估未來的學習功能、通知功能與教材導線</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact-data",
    title: "4. 聯絡表單資料的處理",
    body: (
      <>
        <p>
          本網站的聯絡表單會取得姓名、電子郵件地址、主旨與訊息內容。這些資訊會用於回覆聯絡、處理錯誤回報與改善網站內容。
        </p>
        <p>
          聯絡表單資料可能會保存於 AWS
          上的資料儲存服務。取得的聯絡資料不會顯示在公開頁面上。
        </p>
        <p>
          為了減少垃圾訊息，本網站可能會在聯絡表單中加入 honeypot
          欄位與文字長度限制。
        </p>
        <p>
          系統日誌可能會記錄處理成功、驗證錯誤、伺服器錯誤等排查所需資訊。不過，本網站不會將電子郵件地址全文、聯絡訊息全文、API
          金鑰或認證資訊輸出到日誌。
        </p>
      </>
    ),
  },
  {
    id: "cookie",
    title: "5. Cookie 的使用",
    body: (
      <>
        <p>
          本網站可能會為了存取分析、廣告配信與改善使用體驗而使用
          Cookie。
        </p>
        <p>
          Cookie 是儲存在使用者瀏覽器中的小型資訊。透過
          Cookie，本網站可以掌握網站使用情況，並用於內容改善與廣告配信。
        </p>
        <p>
          本網站不會透過 Cookie 直接取得使用者姓名、電子郵件地址或聯絡訊息內容。
        </p>
        <p>
          若使用者不希望使用 Cookie，可以透過瀏覽器設定停用
          Cookie。不過，停用 Cookie
          後，部分存取分析或廣告顯示功能可能受到限制。
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "6. 關於 Google Analytics",
    body: (
      <>
        <p>
          本網站使用 Google Analytics
          來掌握網站使用情況並改善內容品質。
        </p>
        <p>
          Google Analytics 會使用
          Cookie，並可能蒐集使用者的存取資訊，例如瀏覽頁面、參照來源、使用瀏覽器、裝置資訊與停留時間。
        </p>
        <p>
          Google Analytics
          取得的資訊會用於網站改善與 SEO 改善，這些資訊不會直接識別個人。
        </p>
        <p>
          本網站不會將姓名、電子郵件地址、聯絡訊息本文等個人資料作為
          Google Analytics 的事件資訊送出。
        </p>
        <p>
          若使用者希望停用 Google Analytics
          的資料蒐集，可以使用瀏覽器設定或 Google 提供的停用工具。
        </p>
      </>
    ),
  },
  {
    id: "advertisement",
    title: "7. 關於 Google AdSense 等廣告服務",
    body: (
      <>
        <p>
          本網站可能會使用 Google AdSense
          等第三方廣告配信服務。
        </p>
        <p>
          Google
          等第三方廣告配信業者可能會使用 Cookie，根據使用者的興趣顯示廣告。
        </p>
        <p>
          廣告配信業者可能會根據使用者造訪本網站或其他網站的資訊來顯示廣告。
        </p>
        <p>
          若使用者不希望使用個人化廣告或 Cookie，可以透過瀏覽器設定或廣告配信業者提供的設定頁面停用。
        </p>
        <p>
          本網站不會進行廣告自我點擊、要求他人點擊廣告，或誘導不正當點擊的行為。
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "8. 第三方提供",
    body: (
      <>
        <p>
          除以下情況外，本網站不會在未取得本人同意的情況下，將取得的個人資料提供給第三方。
        </p>
        <ul>
          <li>依法律要求提供時</li>
          <li>為處理不正當使用、垃圾訊息或安全問題而有必要時</li>
          <li>為保護人的生命、身體或財產，且難以取得本人同意時</li>
          <li>在網站營運所需範圍內，委託業務合作方處理資料時</li>
        </ul>
        <p>
          不過，當本網站使用 Google Analytics、Google AdSense
          等外部服務時，Cookie
          或存取資訊可能會依各服務的機制傳送給該服務提供者。
        </p>
      </>
    ),
  },
  {
    id: "management",
    title: "9. 個人資料的管理",
    body: (
      <>
        <p>
          本網站會透過限制存取權限、限制日誌輸出內容、確認不再需要的資料等方式，降低個人資料外洩、遺失、竄改與不正當存取的風險。
        </p>
        <p>
          若本網站保存聯絡資料，該資料不會顯示於公開頁面，只會在網站營運所需範圍內確認。
        </p>
        <p>
          若聯絡資料保存於 AWS
          上，對保存位置的存取會限制在聯絡處理所需範圍內。
        </p>
        <p>
          系統日誌不會輸出電子郵件地址全文、聯絡訊息全文、API
          金鑰、JWT 或 AWS 認證資訊。
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "10. 資料保存期間",
    body: (
      <>
        <p>
          聯絡內容在處理完成後，可能會為了後續詢問、錯誤回報確認與網站改善而保存一段期間。
        </p>
        <p>
          保存期間原則上以 1
          年為目安進行檢視。不過，若因法律要求、不正當使用處理或持續中的聯絡處理而有必要，保存期間可能會延長。
        </p>
        <p>
          存取分析資訊與 Cookie
          相關資訊的保存期間，依 Google Analytics、Google AdSense
          與瀏覽器設定等外部服務的規則而定。
        </p>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "11. 查詢、更正與刪除請求",
    body: (
      <>
        <p>
          若使用者本人希望查詢、更正、刪除或停止使用本網站保有的個人資料，本網站會在確認本人身份後進行處理。
        </p>
        <p>
          若需要提出相關請求，請透過聯絡頁面與本網站聯繫。
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "12. 外部連結",
    body: (
      <>
        <p>
          本網站可能會放置 GitHub、note、AWS
          官方文件與其他外部網站的連結。
        </p>
        <p>
          外部網站對個人資料、Cookie、廣告配信與存取分析的處理方式，請確認各外部網站的隱私權政策。
        </p>
        <p>
          本網站不對外部網站中發生的損害或問題承擔責任。
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "13. 免責聲明",
    body: (
      <>
        <p>
          本網站提供有助於 AWS 資格學習與 AWS
          服務理解的資訊。不過，本網站不保證內容的正確性、完整性或最新性。
        </p>
        <p>
          AWS
          服務規格、價格與考試範圍可能會變更。實際學習、報名考試或使用
          AWS 服務時，請確認 AWS 官方資訊。
        </p>
        <p>詳細內容請確認免責聲明頁面。</p>
        <p>
          <Link
            href="/zh/disclaimer"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            前往免責聲明頁面
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "14. 隱私權政策的變更",
    body: (
      <>
        <p>
          本網站可能會因法律變更、使用服務新增或網站功能變更而修改本隱私權政策。
        </p>
        <p>
          若未來新增 Google Analytics、Google
          AdSense、登入功能、學習歷史功能或付款功能等，本頁面的內容會重新檢視。
        </p>
        <p>修改後的內容自刊載於本頁面時生效。</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "15. 聯絡方式",
    body: (
      <>
        <p>
          關於個人資料處理方式的問題，請透過以下聯絡頁面與本網站聯繫。
        </p>
        <p>
          <Link
            href="/zh/contact"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            前往聯絡頁面
          </Link>
        </p>
      </>
    ),
  },
];

export default function ZhPrivacyPage(): ReactElement {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          隱私權政策
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          本頁說明 {localizedSiteName}（{siteName}
          ）對個人資料、Cookie、Google Analytics、Google AdSense
          與聯絡表單資料的處理方針。
        </p>
        <div className="mt-6 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-800">制定日：</span>
            {establishedDate}
          </p>
          <p>
            <span className="font-semibold text-slate-800">最後更新日：</span>
            {lastUpdatedDate}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        <p className="font-semibold">關於本頁</p>
        <p className="mt-2">
          本網站使用 Google Analytics 進行存取分析。
          另外，本網站可能會使用 Google AdSense
          等廣告服務。聯絡表單中取得的資訊會用於回覆聯絡、處理錯誤回報與改善網站內容。
        </p>
      </div>

      <nav
        aria-label="隱私權政策目錄"
        className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <h2 className="text-lg font-bold text-slate-900">目錄</h2>
        <ol className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {policySections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="underline-offset-4 hover:text-blue-700 hover:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {policySections.map((section) => (
          <section
            id={section.id}
            key={section.id}
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-700 [&_li]:ml-5 [&_li]:list-disc">
              {section.body}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">相關頁面</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row">
          <Link
            href="/zh/about"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            關於本站
          </Link>
          <Link
            href="/zh/contact"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            聯絡
          </Link>
          <Link
            href="/zh/disclaimer"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            免責聲明
          </Link>
        </div>
      </div>
    </main>
  );
}