import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "免責事項 | AWS資格ロードマップラボ",
  description:
    "AWS資格ロードマップラボの免責事項です。AWS資格情報、学習情報、外部リンク、情報の正確性、損害責任に関する方針を掲載しています。",
};

const disclaimerSections = [
  {
    title: "情報の正確性について",
    body: [
      "AWS資格ロードマップラボでは、掲載するAWSサービス情報、資格学習情報、構成図、比較記事、模擬問題の正確性を高めるよう努めています。",
      "ただし、掲載内容の正確性、完全性、最新性、有用性を保証するものではありません。",
      "AWSサービスの仕様、料金、試験範囲、出題傾向は変更される可能性があります。",
    ],
  },
  {
    title: "AWS認定試験情報について",
    body: [
      "本サイトの内容は、AWS Cloud Practitioner、AWS Solutions Architect Associate などの学習を支援する目的で作成しています。",
      "本サイトは、Amazon Web Services, Inc. またはその関連会社が公式に提供、承認、運営しているものではありません。",
      "受験申込、試験範囲、試験料金、試験ポリシー、最新の出題対象については、必ずAWS公式サイトおよびAWS認定試験ガイドを確認してください。",
    ],
  },
  {
    title: "学習成果について",
    body: [
      "本サイトのコンテンツを利用したことによる資格試験の合格、学習成果、業務成果、転職成果を保証するものではありません。",
      "模擬問題や解説は理解補助を目的としており、実際の試験問題や出題内容を保証するものではありません。",
      "学習計画や受験判断は、利用者本人の責任で行ってください。",
    ],
  },
  {
    title: "AWS構成・実装情報について",
    body: [
      "本サイトに掲載するAWS構成図、サーバーレス構成、IAM、S3、CloudFront、Lambda、DynamoDBなどの説明は、学習およびポートフォリオ目的の参考情報です。",
      "実務環境や本番環境へ適用する場合は、要件、セキュリティ、コスト、可用性、運用体制を確認したうえで設計してください。",
      "AWS利用料金はリージョン、利用量、設定内容により変動します。実際の料金はAWS公式料金ページおよびCost Explorerなどで確認してください。",
    ],
  },
  {
    title: "損害責任について",
    body: [
      "本サイトの情報を利用したこと、または利用できなかったことによって生じたいかなる損害についても、運営者は責任を負いません。",
      "AWS設定ミス、課金発生、試験申込ミス、学習判断、業務上の判断などについては、利用者本人の責任で確認・実行してください。",
    ],
  },
  {
    title: "外部リンクについて",
    body: [
      "本サイトには、AWS公式サイト、GitHub、note、その他外部サイトへのリンクを掲載する場合があります。",
      "外部リンク先の内容、正確性、安全性、個人情報の取り扱いについて、運営者は責任を負いません。",
      "外部サイトを利用する場合は、各サイトの利用規約、プライバシーポリシー、セキュリティ方針を確認してください。",
    ],
  },
  {
    title: "コンテンツ更新について",
    body: [
      "本サイトのコンテンツは、予告なく追加、修正、削除する場合があります。",
      "古い情報が含まれる可能性があるため、記事やページの更新日を確認し、重要な判断ではAWS公式情報を優先してください。",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-2xl bg-slate-50 px-6 py-8">
        <p className="mb-3 text-sm font-semibold text-orange-600">
          Disclaimer
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          免責事項
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          AWS資格ロードマップラボを利用する前に、以下の免責事項を確認してください。
          本サイトはAWS資格学習を支援する個人運営の学習サイトであり、AWS公式サイトではありません。
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
          AWS公式情報の確認
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          AWS認定試験の最新情報、AWSサービス仕様、料金、セキュリティ設定については、
          AWS公式ドキュメント、AWS認定公式ページ、AWS料金ページを必ず確認してください。
        </p>
      </section>

      <section className="mt-10 rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold">問い合わせ・誤り報告</h2>
        <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
          掲載内容に誤りや古い情報を見つけた場合は、お問い合わせページから連絡してください。
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold !text-slate-900 transition hover:bg-slate-100"
          >
            お問い合わせページへ
          </Link>
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        制定日：2026年6月1日
      </p>
    </main>
  );
}