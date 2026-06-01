import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { createPageMetadata, pageSeo } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.privacy);

type PolicySection = {
  id: string;
  title: string;
  body: ReactElement;
};

const siteName = "AWS資格ロードマップラボ";
const establishedDate = "2026年6月1日";
const lastUpdatedDate = "2026年6月1日";

const policySections: PolicySection[] = [
  {
    id: "about",
    title: "1. 基本方針",
    body: (
      <>
        <p>
          {siteName}
          （以下「当サイト」といいます）は、AWS資格学習者向けに、AWS用語集、サービス比較、模擬問題、構成図解説、ブログ記事などを提供する学習サイトです。
        </p>
        <p>
          当サイトでは、利用者の個人情報を必要な範囲でのみ取得し、問い合わせ対応、サイト改善、サービス運営の目的に限定して利用します。
        </p>
      </>
    ),
  },
  {
    id: "collected-information",
    title: "2. 取得する情報",
    body: (
      <>
        <p>当サイトでは、以下の情報を取得する場合があります。</p>
        <ul>
          <li>問い合わせフォームに入力された名前</li>
          <li>問い合わせフォームに入力されたメールアドレス</li>
          <li>問い合わせフォームに入力された件名および本文</li>
          <li>問い合わせ送信時の送信元ページ情報</li>
          <li>アクセス解析に利用されるCookie、端末情報、ブラウザ情報、閲覧ページ、参照元URL</li>
        </ul>
        <p>
          現時点のMVPでは、ログイン機能、学習履歴保存機能、決済機能は実装していません。そのため、ユーザー登録情報、正答率、学習進捗、決済情報は取得しません。
        </p>
      </>
    ),
  },
  {
    id: "purpose",
    title: "3. 利用目的",
    body: (
      <>
        <p>取得した情報は、以下の目的で利用します。</p>
        <ul>
          <li>問い合わせ、誤り報告、仕事相談への返信</li>
          <li>問い合わせ内容の確認および対応履歴の管理</li>
          <li>サイト内容、UI、学習コンテンツの改善</li>
          <li>不正利用、スパム、迷惑行為の防止</li>
          <li>アクセス状況の把握およびSEO改善</li>
          <li>将来的な広告配信、学習機能改善、通知機能の検討</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookie",
    title: "4. Cookieの利用",
    body: (
      <>
        <p>
          当サイトでは、アクセス解析、広告配信、利便性向上のためにCookieを利用する場合があります。
        </p>
        <p>
          Cookieとは、利用者のブラウザに保存される小さな情報です。Cookieによって、利用者個人を直接特定する情報を取得することはありません。
        </p>
        <p>
          Cookieの利用を望まない場合、利用者はブラウザの設定によりCookieを無効化できます。ただし、一部の機能が利用できなくなる場合があります。
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "5. アクセス解析ツールについて",
    body: (
      <>
        <p>
          当サイトでは、将来的にGoogle Analyticsなどのアクセス解析ツールを利用する場合があります。
        </p>
        <p>
          アクセス解析ツールは、Cookieを利用してトラフィックデータを収集する場合があります。収集されるデータは匿名で処理され、個人を直接特定するものではありません。
        </p>
        <p>
          問い合わせ本文、メールアドレス、氏名など、個人を特定できる情報をアクセス解析イベントには含めません。
        </p>
      </>
    ),
  },
  {
    id: "advertisement",
    title: "6. 広告配信について",
    body: (
      <>
        <p>
          当サイトでは、将来的にGoogle AdSenseなどの第三者配信広告サービスを利用する場合があります。
        </p>
        <p>
          広告配信事業者は、利用者の興味に応じた広告を表示するためにCookieを使用する場合があります。
        </p>
        <p>
          広告配信に関するCookieの利用を望まない場合、利用者はブラウザ設定または広告配信事業者が提供する設定ページから無効化できます。
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "7. 第三者提供について",
    body: (
      <>
        <p>
          当サイトは、取得した個人情報を、以下の場合を除き、本人の同意なく第三者へ提供しません。
        </p>
        <ul>
          <li>法令に基づく場合</li>
          <li>不正利用、迷惑行為、セキュリティ上の問題に対応するために必要な場合</li>
          <li>人の生命、身体、財産の保護のために必要であり、本人の同意取得が困難な場合</li>
          <li>サイト運営に必要な範囲で、業務委託先に取り扱いを委託する場合</li>
        </ul>
      </>
    ),
  },
  {
    id: "management",
    title: "8. 個人情報の管理",
    body: (
      <>
        <p>
          当サイトでは、取得した個人情報の漏えい、紛失、改ざん、不正アクセスを防ぐため、管理方法を継続的に見直します。
        </p>
        <p>
          問い合わせ情報を保存する場合は、公開ページには表示せず、サイト運営上必要な範囲でのみ確認します。
        </p>
        <p>
          また、システムログには、メールアドレス全文、問い合わせ本文全文、APIキー、認証情報などを出力しない方針とします。
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "9. 情報の保存期間",
    body: (
      <>
        <p>
          問い合わせ内容は、対応完了後も、再問い合わせ対応、誤り報告の確認、サイト改善のために一定期間保存する場合があります。
        </p>
        <p>
          保存期間は原則として1年を目安に見直します。ただし、法令対応、不正利用対応、継続中の問い合わせ対応に必要な場合は、この限りではありません。
        </p>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "10. 開示・訂正・削除の請求",
    body: (
      <>
        <p>
          利用者本人から、当サイトが保有する個人情報の開示、訂正、削除、利用停止の希望があった場合、本人確認のうえで対応します。
        </p>
        <p>
          希望される場合は、問い合わせページから連絡してください。
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "11. 外部リンクについて",
    body: (
      <>
        <p>
          当サイトには、GitHub、note、AWS公式ドキュメント、その他外部サイトへのリンクを掲載する場合があります。
        </p>
        <p>
          外部サイトでの個人情報の取り扱いについては、各外部サイトのプライバシーポリシーを確認してください。当サイトは、外部サイトで発生した損害やトラブルについて責任を負いません。
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "12. プライバシーポリシーの変更",
    body: (
      <>
        <p>
          当サイトは、法令変更、利用サービスの追加、サイト機能の変更に合わせて、本プライバシーポリシーを変更する場合があります。
        </p>
        <p>
          変更後の内容は、当ページに掲載した時点で有効になります。
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. 問い合わせ先",
    body: (
      <>
        <p>
          個人情報の取り扱いに関する問い合わせは、以下の問い合わせページから連絡してください。
        </p>
        <p>
          <Link
            href="/contact"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            問い合わせページへ
          </Link>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage(): ReactElement {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          プライバシーポリシー
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          {siteName}
          における個人情報、Cookie、アクセス解析、広告配信、問い合わせ情報の取り扱いについて説明します。
        </p>
        <div className="mt-6 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-800">制定日：</span>
            {establishedDate}
          </p>
          <p>
            <span className="font-semibold text-slate-800">最終更新日：</span>
            {lastUpdatedDate}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        <p className="font-semibold">このページについて</p>
        <p className="mt-2">
          現時点では、MVPとして問い合わせフォームと静的コンテンツを中心に運営します。Google
          Analytics、Google AdSense、ログイン機能、学習履歴機能は、導入時に本ページの記載を見直します。
        </p>
      </div>

      <nav
        aria-label="プライバシーポリシー目次"
        className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <h2 className="text-lg font-bold text-slate-900">目次</h2>
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
        <h2 className="text-lg font-bold text-slate-900">関連ページ</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row">
          <Link
            href="/about"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            運営者情報
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            問い合わせ
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            免責事項
          </Link>
        </div>
      </div>
    </main>
  );
}