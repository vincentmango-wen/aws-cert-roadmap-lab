import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, pageSeo } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.about);

const profileItems = [
  {
    label: "運営者",
    value: "ふみくん",
  },
  {
    label: "サイト名",
    value: "AWS資格ロードマップラボ",
  },
  {
    label: "テーマ",
    value: "AWS資格学習・サーバーレス開発・ポートフォリオ制作",
  },
  {
    label: "対象読者",
    value: "AWS Cloud Practitioner / SAA を学習している初学者",
  },
];

const sitePurposes = [
  "AWS Cloud Practitioner と SAA の学習内容を整理する",
  "AWSサービスの違いを用語集・比較表・模擬問題で理解できるようにする",
  "S3、CloudFront、Lambda、API Gateway、DynamoDB などを使った実装経験をポートフォリオとして示す",
  "将来的にSEO記事、教材販売、広告収益化につながる学習メディアに育てる",
];

const techStacks = [
  {
    category: "Frontend",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown / MDX", "JSON"],
  },
  {
    category: "AWS",
    items: [
      "Amazon S3",
      "Amazon CloudFront",
      "API Gateway",
      "AWS Lambda",
      "Amazon DynamoDB",
      "Amazon CloudWatch",
      "IAM",
      "AWS Budgets",
    ],
  },
  {
    category: "Development",
    items: ["GitHub", "GitHub Actions", "静的サイト生成", "サーバーレス構成"],
  },
];

const roadmapItems = [
  {
    title: "Phase 1",
    description: "AWS用語集、比較記事、模擬問題、構成図解説を静的サイトとして作成する。",
  },
  {
    title: "Phase 2",
    description:
      "問い合わせフォームを API Gateway + Lambda + DynamoDB で実装し、AWS上で公開する。",
  },
  {
    title: "Phase 3",
    description:
      "GitHub Actions、S3、CloudFront を使った自動デプロイと運用監視を整える。",
  },
  {
    title: "Phase 4",
    description:
      "記事数を増やし、SEO、AdSense、独自ドメイン導入を検討する。",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p className="text-sm font-semibold text-blue-700">About</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          運営者情報
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
          AWS資格ロードマップラボは、AWS資格学習をただの暗記で終わらせず、
          用語・比較・模擬問題・構成図・実装経験に変換するための学習サイトです。
          Cloud Practitioner から Solutions Architect Associate までの学習内容を整理しながら、
          AWSサーバーレス構成で公開できるポートフォリオとして開発しています。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profileItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <dt className="text-sm font-semibold text-slate-500">{item.label}</dt>
              <dd className="mt-2 text-base font-semibold text-slate-900">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">このサイトの目的</h2>

          <ul className="mt-5 space-y-4">
            {sitePurposes.map((purpose) => (
              <li key={purpose} className="flex gap-3 text-slate-700">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  ✓
                </span>
                <span className="leading-7">{purpose}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">学習背景</h2>

          <p className="mt-5 leading-8 text-slate-200">
            このサイトは、AWS Cloud Practitioner と SAA の学習内容をアウトプットし、
            実際にAWS上で動くWebサイトとして形にするために作成しています。
            資格試験の知識だけでなく、設計意図、コスト管理、セキュリティ、運用監視まで
            説明できる状態を目指しています。
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">使用技術</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {techStacks.map((stack) => (
            <div
              key={stack.category}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-slate-900">{stack.category}</h3>

              <ul className="mt-4 space-y-2">
                {stack.items.map((item) => (
                  <li key={item} className="text-sm leading-6 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">開発ロードマップ</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {roadmapItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-blue-700">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">関連リンク</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href="https://github.com/vincentmango-wen/aws-cert-roadmap-lab"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            GitHubを見る
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              ソースコード、README、構成図、設計意図を確認できます。
            </span>
          </a>

          <a
            href="https://note.com/fumi_ai_202507"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            noteを見る
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              AWS学習や生成AI活用に関する記事を発信しています。
            </span>
          </a>

          <Link
            href="/contact"
            className="rounded-2xl bg-blue-700 p-5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
          >
            問い合わせる
            <span className="mt-2 block text-sm font-normal leading-6 text-blue-100">
              誤り報告、感想、仕事相談はこちらから送信できます。
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}