import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/contact/ContactForm";
import { createAbsoluteUrl } from "@/lib/seo";

const pagePath = "/zh/contact";

export const metadata: Metadata = {
  title: "聯絡我們 | AWS資格路線圖實驗室",
  description:
    "如需回報AWS學習內容錯誤、詢問本站內容、或聯繫作品集相關合作，請使用此表單與AWS資格路線圖實驗室聯絡。",
  alternates: {
    canonical: createAbsoluteUrl(pagePath),
    languages: {
      ja: createAbsoluteUrl("/contact"),
      en: createAbsoluteUrl("/en/contact"),
      "zh-Hant": createAbsoluteUrl(pagePath),
      "x-default": createAbsoluteUrl("/contact"),
    },
  },
  openGraph: {
    title: "聯絡我們 | AWS資格路線圖實驗室",
    description:
      "如需回報AWS學習內容錯誤、詢問本站內容、或聯繫作品集相關合作，請使用此表單與AWS資格路線圖實驗室聯絡。",
    url: createAbsoluteUrl(pagePath),
    siteName: "AWS資格路線圖實驗室",
    images: [
      {
        url: createAbsoluteUrl("/images/assets/og-image.png"),
        width: 1200,
        height: 630,
        alt: "聯絡我們 - AWS資格路線圖實驗室",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "聯絡我們 | AWS資格路線圖實驗室",
    description:
      "如需回報AWS學習內容錯誤、詢問本站內容、或聯繫作品集相關合作，請使用此表單與AWS資格路線圖實驗室聯絡。",
    images: [createAbsoluteUrl("/images/assets/og-image.png")],
  },
};

const checklistItems = [
  "若需要回覆，請填寫可以收信的電子郵件地址。",
  "請不要在內容中填寫密碼、存取金鑰、API Key 或其他秘密資訊。",
  "若是回報文章錯誤，請附上頁面名稱、URL或相關AWS服務名稱。",
];

const contactUseCases = [
  {
    title: "內容錯誤回報",
    description:
      "如果AWS服務說明、考試觀點或架構圖中有不正確的地方，請告訴我。",
  },
  {
    title: "作品集相關聯絡",
    description:
      "如果你想了解此站的AWS架構、實作方式或專案背景，可以從這裡聯絡。",
  },
  {
    title: "合作與工作諮詢",
    description:
      "若有技術寫作、AWS學習內容、或Web開發相關合作，也可以使用此表單。",
  },
];

const relatedLinks = [
  {
    href: "/zh/about",
    title: "關於本站",
    description: "了解AWS資格路線圖實驗室的製作背景與定位。",
  },
  {
    href: "/zh/privacy",
    title: "隱私權政策",
    description: "確認個人資料、Cookie與分析工具的處理方式。",
  },
  {
    href: "/zh/disclaimer",
    title: "免責聲明",
    description: "確認本站學習內容與AWS考試資訊的使用注意事項。",
  },
];

export default function ZhContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Contact</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          聯絡我們
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          若你想回報AWS學習內容的錯誤、詢問此作品集的實作方式，
          或聯繫合作與工作相關事宜，請使用下方表單。
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        <h2 className="font-semibold">送出前請確認</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {checklistItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {contactUseCases.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <ContactForm locale="zh" />

      <section className="mt-10 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900">相關頁面</h2>
        <div className="mt-4 grid gap-4">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="text-sm font-semibold text-blue-700">
                {link.title}
              </span>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}