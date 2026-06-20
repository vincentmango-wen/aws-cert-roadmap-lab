import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | AWS資格ロードマップラボ",
  description:
    "AWS資格ロードマップラボへのお問い合わせ、記事の誤り報告、ポートフォリオに関する質問を送信できます。",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Contact</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          お問い合わせ
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          AWS資格ロードマップラボへの質問、記事内容の誤り報告、ポートフォリオに関する問い合わせはこちらから送信してください。
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        <p className="font-semibold">送信前の確認</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>返信が必要な場合は、受信できるメールアドレスを入力してください。</li>
          <li>個人情報や秘密情報は本文に書かないでください。</li>
          <li>AWS認証情報、APIキー、パスワードは送信しないでください。</li>
        </ul>
      </div>

      <ContactForm />
    </main>
  );
}