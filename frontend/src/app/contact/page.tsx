import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | AWS資格ロードマップラボ",
  description:
    "AWS資格ロードマップラボへのお問い合わせ、誤り報告、仕事相談、フィードバックを受け付けるページです。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-3 text-sm font-semibold text-blue-700">
          Contact
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          お問い合わせ
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          AWS資格ロードマップラボへのお問い合わせ、記事の誤り報告、
          仕事相談、サイト改善のフィードバックはこちらから送信できます。
        </p>

        <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-7 text-blue-950">
          <p className="font-semibold">送信前に確認してください</p>
          <p className="mt-1">
            試験日程・出題範囲などの最新情報は、必ずAWS公式情報も確認してください。
            このフォームでは、サイト内容への質問や修正依頼を受け付けます。
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ContactForm />

        <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-950">
            返信について
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            <p>
              内容を確認したうえで、返信が必要なものに対応します。
              学習内容の誤り報告は、該当ページURLや対象サービス名も書いてください。
            </p>

            <div>
              <p className="font-semibold text-slate-900">受け付ける内容</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>AWS記事・用語解説の誤り報告</li>
                <li>模擬問題の内容確認</li>
                <li>ポートフォリオに関する問い合わせ</li>
                <li>仕事相談・フィードバック</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-900">注意</p>
              <p className="mt-2">
                個人情報、AWS認証情報、アクセスキー、パスワードは本文に入力しないでください。
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}