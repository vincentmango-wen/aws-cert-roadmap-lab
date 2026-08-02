import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { createPageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.privacy);

type PolicySection = {
  id: string;
  title: string;
  body: ReactElement;
};

const siteName = "AWS資格ロードマップラボ";
const establishedDate = "2026年6月1日";
const lastUpdatedDate = "2026年6月7日";

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
          当サイトでは、利用者の個人情報を取得する場合、問い合わせ対応、サイト改善、サービス運営、不正利用防止の目的に限定して利用します。
        </p>
        <p>
          当サイトは、AWS資格学習コンテンツを公開するポートフォリオサイトとして、取得する情報を最小限にし、個人情報や認証情報を公開ページやログに出力しない運用方針とします。
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
          <li>問い合わせ送信時のブラウザ情報、ユーザーエージェント情報</li>
          <li>Google Analyticsにより取得される閲覧ページ、参照元、利用ブラウザ、端末情報などのアクセス解析情報</li>
          <li>Cookieを通じて取得されるサイト利用情報</li>
          <li>Google AdSenseなどの広告配信サービスで利用されるCookie情報</li>
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
          <li>人気コンテンツ、離脱ページ、検索流入状況の分析</li>
          <li>Google AdSenseなどの広告配信サービスの品質改善</li>
          <li>将来的な学習機能、通知機能、教材導線の検討</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact-data",
    title: "4. 問い合わせ情報の取り扱い",
    body: (
      <>
        <p>
          当サイトの問い合わせフォームでは、名前、メールアドレス、件名、本文を取得します。これらの情報は、問い合わせへの返信、誤り報告への対応、サイト改善のために利用します。
        </p>
        <p>
          問い合わせ情報は、AWS上のデータ保存先に保存される場合があります。取得した問い合わせ情報を、公開ページに表示することはありません。
        </p>
        <p>
          問い合わせフォームには、スパム投稿を抑制するためのhoneypot項目や文字数制限を設ける場合があります。
        </p>
        <p>
          システムログには、問い合わせ処理の成功、バリデーションエラー、サーバーエラーなど、調査に必要な情報を記録する場合があります。ただし、メールアドレス全文、問い合わせ本文全文、APIキー、認証情報はログに出力しない方針とします。
        </p>
      </>
    ),
  },
  {
    id: "cookie",
    title: "5. Cookieの利用",
    body: (
      <>
        <p>
          当サイトでは、アクセス解析、広告配信、利便性向上のためにCookieを利用する場合があります。
        </p>
        <p>
          Cookieとは、利用者のブラウザに保存される小さな情報です。Cookieを利用することで、サイトの利用状況を把握し、コンテンツ改善や広告配信に活用できます。
        </p>
        <p>
          Cookieによって、当サイトが利用者の名前、メールアドレス、問い合わせ本文などを直接取得することはありません。
        </p>
        <p>
          Cookieの利用を望まない場合、利用者はブラウザの設定によりCookieを無効化できます。ただし、Cookieを無効化した場合、アクセス解析や広告表示の一部が制限される場合があります。
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "6. Google Analyticsについて",
    body: (
      <>
        <p>
          当サイトでは、アクセス状況の把握とコンテンツ改善のため、Google Analyticsを使用しています。
        </p>
        <p>
          Google AnalyticsはCookieを使用し、利用者のアクセス情報を収集します。収集される情報には、閲覧ページ、参照元、利用ブラウザ、端末情報、滞在時間などが含まれる場合があります。
        </p>
        <p>
          Google Analyticsで収集される情報は、サイト改善やSEO改善のために利用します。これらの情報は、個人を直接特定するものではありません。
        </p>
        <p>
          当サイトでは、名前、メールアドレス、問い合わせ本文などの個人情報をGoogle Analyticsのイベント情報として送信しません。
        </p>
        <p>
          Google Analyticsによるデータ収集を無効化したい場合は、ブラウザ設定またはGoogleが提供するオプトアウト手段を利用してください。
        </p>
      </>
    ),
  },
  {
    id: "advertisement",
    title: "7. Google AdSenseなどの広告配信について",
    body: (
      <>
        <p>
          当サイトでは、Google AdSenseなどの第三者配信広告サービスを利用する場合があります。
        </p>
        <p>
          Googleなどの第三者配信事業者は、利用者の興味に応じた広告を表示するためにCookieを使用する場合があります。
        </p>
        <p>
          広告配信事業者は、利用者が当サイトや他のサイトへアクセスした情報に基づいて、広告を表示する場合があります。
        </p>
        <p>
          パーソナライズ広告やCookieの利用を望まない場合、利用者はブラウザ設定または広告配信事業者が提供する設定ページから無効化できます。
        </p>
        <p>
          当サイトでは、広告の自己クリック、クリック依頼、不正クリックを誘導する行為を行いません。
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "8. 第三者提供について",
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
        <p>
          ただし、Google AnalyticsやGoogle AdSenseなどの外部サービスを利用する場合、各サービスの仕組みに基づいてCookieやアクセス情報が送信される場合があります。
        </p>
      </>
    ),
  },
  {
    id: "management",
    title: "9. 個人情報の管理",
    body: (
      <>
        <p>
          当サイトでは、取得した個人情報の漏えい、紛失、改ざん、不正アクセスを防ぐため、アクセス権限の制限、ログ出力内容の制限、不要な情報の削除確認を行います。
        </p>
        <p>
          問い合わせ情報を保存する場合は、公開ページには表示せず、サイト運営上必要な範囲でのみ確認します。
        </p>
        <p>
          AWS上で問い合わせ情報を保存する場合、保存先へのアクセスは問い合わせ対応に必要な範囲に限定します。
        </p>
        <p>
          システムログには、メールアドレス全文、問い合わせ本文全文、APIキー、JWT、AWS認証情報などを出力しない方針とします。
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "10. 情報の保存期間",
    body: (
      <>
        <p>
          問い合わせ内容は、対応完了後も、再問い合わせ対応、誤り報告の確認、サイト改善のために一定期間保存する場合があります。
        </p>
        <p>
          保存期間は原則として1年を目安に見直します。ただし、法令対応、不正利用対応、継続中の問い合わせ対応に必要な場合は、この限りではありません。
        </p>
        <p>
          アクセス解析情報や広告配信に関する情報の保存期間は、Google Analytics、Google AdSenseなど各外部サービスの設定および規約に従います。
        </p>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "11. 開示・訂正・削除の請求",
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
    title: "12. 外部リンクについて",
    body: (
      <>
        <p>
          当サイトには、GitHub、note、AWS公式ドキュメント、その他外部サイトへのリンクを掲載する場合があります。
        </p>
        <p>
          外部サイトでの個人情報、Cookie、広告配信、アクセス解析の取り扱いについては、各外部サイトのプライバシーポリシーを確認してください。
        </p>
        <p>
          当サイトは、外部サイトで発生した損害やトラブルについて責任を負いません。
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "13. 免責事項",
    body: (
      <>
        <p>
          当サイトでは、AWS資格学習やAWSサービス理解に役立つ情報を掲載します。ただし、掲載情報の正確性、完全性、最新性を保証するものではありません。
        </p>
        <p>
          AWSサービスの仕様、料金、試験範囲は変更される場合があります。実際の学習、試験申込、AWS利用時は、AWS公式情報を確認してください。
        </p>
        <p>
          詳細は、以下の免責事項ページを確認してください。
        </p>
        <p>
          <Link
            href="/disclaimer"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            免責事項ページへ
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "14. プライバシーポリシーの変更",
    body: (
      <>
        <p>
          当サイトは、法令変更、利用サービスの追加、サイト機能の変更に合わせて、本プライバシーポリシーを変更する場合があります。
        </p>
        <p>
          Google Analytics、Google AdSense、ログイン機能、学習履歴機能、決済機能などを追加する場合、本ページの記載内容を見直します。
        </p>
        <p>
          変更後の内容は、当ページに掲載した時点で有効になります。
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "15. 問い合わせ先",
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
          における個人情報、Cookie、Google Analytics、Google AdSense、問い合わせ情報の取り扱いについて説明します。
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
          当サイトでは、アクセス解析のためにGoogle Analyticsを使用しています。
          また、Google AdSenseなどの広告配信サービスを利用する場合があります。
          問い合わせフォームで取得した情報は、問い合わせ対応、誤り報告への対応、サイト改善のために利用します。
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
          <Link
            href="/terms-of-service"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            利用規約
          </Link>
        </div>
      </div>
    </main>
  );
}