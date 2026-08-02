import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import { createPageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.contact);

const acceptedInquiries: string[] = [
  "記事、用語集、比較記事、構成図の記載内容に誤りがある場合の指摘",
  "模擬問題の設問文・選択肢・解説に関する誤りの報告",
  "掲載しているAWSサービスの仕様や料金が古くなっている場合の指摘",
  "掲載内容の引用・転載の可否についての確認",
  "取材、執筆依頼、コンテンツに関する連絡",
  "サイトの表示不具合、リンク切れ、アクセシビリティ上の問題の報告",
];

const declinedInquiries: string[] = [
  "個別の学習計画づくりや、学習相談への詳細な回答",
  "AWSアカウントの障害、課金、サポートケースなど、AWS公式サポートが扱うべき技術的な質問",
  "実際に出題された試験内容の照会や、その内容の提供依頼（当サイトは学習目的で独自に作成した非公式の問題のみを扱います）",
  "AWS認定試験の申込、再受験、バウチャー、試験当日の運用に関する問い合わせ（AWS認定の公式窓口に確認してください）",
  "特定の企業や製品を宣伝することを目的とした記事掲載の依頼",
  "本サイトと関係のない営業目的の一斉送信",
];

const responseNotes: string[] = [
  "当サイトは個人が運営しており、平日日中に返信できるとは限りません。返信の目安は受信から7日程度です。",
  "内容の確認に時間がかかる場合や、AWS公式ドキュメントを再確認する必要がある場合は、返信までさらに日数がかかります。",
  "受け付けられない問い合わせに該当する場合、営業目的と判断した場合、返信先のメールアドレスが誤っている場合は、返信しないことがあります。すべての問い合わせに返信することを保証するものではありません。",
  "誤りの報告をいただいた場合、返信より先に該当ページを修正することがあります。修正は記事の更新日（updatedAt）に反映します。",
];

export default function ContactPage(): ReactElement {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Contact</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          お問い合わせ
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          AWS資格ロードマップラボへの質問、記事内容の誤り報告、引用・転載の確認、取材や執筆の依頼はこちらから送信してください。
          当サイトは個人が運営する学習サイトです。どの問い合わせを受け付けているか、どのくらいで返信するか、送信いただいた情報をどう扱うかを、あらかじめ以下に記載しています。
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">受け付ける問い合わせ</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          当サイトの掲載内容そのものに関する連絡を歓迎します。特に、誤りや古くなった情報の指摘は、サイトの品質を保つうえで最も助かる連絡です。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
          {acceptedInquiries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          誤りを報告する場合は、該当ページのURLと、どの記述が誤っているかを本文に記載してください。可能であれば、根拠となるAWS公式ドキュメントのURLも添えていただけると確認が早くなります。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          受け付けられない問い合わせ
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          次の問い合わせには対応できません。該当する場合は、AWS公式サポートまたはAWS認定の公式窓口に確認してください。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
          {declinedInquiries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          当サイトの掲載方針については
          <Link
            href="/about"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            運営者情報
          </Link>
          の「コンテンツ制作方針」に、責任の範囲については
          <Link
            href="/disclaimer"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            免責事項
          </Link>
          に記載しています。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">返信の目安</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
          {responseNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          送信いただいた情報の取り扱い
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          問い合わせフォームでは、名前、メールアドレス、件名、本文を取得します。これらの情報は、問い合わせへの返信、誤り報告への対応、サイト改善のみに利用し、公開ページに掲載することはありません。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          取得した情報を、本人の同意なく第三者に提供することはありません。システムログには処理の成否など調査に必要な情報のみを記録し、メールアドレス全文や本文全文は出力しない方針です。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          詳細は
          <Link
            href="/privacy"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            プライバシーポリシー
          </Link>
          の「問い合わせ情報の取り扱い」および「情報の保存期間」を確認してください。
        </p>
      </section>

      {/*
        FUMI_INPUT: 代替連絡手段の掲載方針。issue #321「4. /contact 充実」の選択肢 A / B / C から選んでください。

        A: メールアドレスを本文に直書きする
           → 最も明快だが、スパム収集ボットに拾われる。以後アドレスを変更しづらい。非推奨。
        B: フォームのみを維持し、送信できない場合の代替として X (@fumikun_gengen) の DM を案内する
           → 追加のアドレス露出がなく、既存アカウントで完結する。再申請までに間に合わせるならこれ。
        C: 問い合わせ専用エイリアス（例: contact@aws-cert-roadmap-lab.com）を作って掲載する
           → スパムが来ても本アドレスに影響しない。ドメインのメール受信設定（SES 受信 or 転送）が必要。推奨。

        スパム対策の補足:
        - テキストの直書きは、HTML を巡回する収集ボットに機械的に拾われる。out/ は静的 HTML なので確実に読まれる。
        - 画像化（アドレスを PNG にする）は収集を減らせるが、スクリーンリーダーで読めずアクセシビリティを損なう。
          代替テキストにアドレスを書くと結局収集されるため、対策としては中途半端。
        - mailto: リンクの JS 難読化は静的書き出し (output: "export") と相性が悪く、JS 無効環境で連絡手段が消える。
        - 最も安全なのは C（使い捨て可能な専用エイリアス）か B（フォーム + 既存 SNS）。

        下の <p> の文字列を、選んだ選択肢の文面に差し替えてください。
        例 (B): 「フォームから送信できない場合は、X（@fumikun_gengen）のDMからも連絡を受け付けています。」
        例 (C): 「フォームから送信できない場合は、contact@aws-cert-roadmap-lab.com 宛にメールしてください。」
      */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          フォームが送信できない場合
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          ブラウザの設定や通信環境により、フォームの送信が失敗することがあります。その場合の代替の連絡手段は次のとおりです：
          {"{{FUMI_INPUT: 連絡先の掲載方針 A/B/C と、掲載する場合の実アドレスまたはSNSアカウント}}"}
        </p>
      </section>

      <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        <p className="font-semibold">送信前の確認</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>返信が必要な場合は、受信できるメールアドレスを入力してください。</li>
          <li>個人情報や秘密情報は本文に書かないでください。</li>
          <li>AWS認証情報、APIキー、パスワードは送信しないでください。</li>
          <li>誤りの報告は、該当ページのURLを本文に記載してください。</li>
        </ul>
      </div>

      <ContactForm />
    </main>
  );
}
