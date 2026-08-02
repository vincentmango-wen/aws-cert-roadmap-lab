import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { createPageMetadata, pageSeo } from "@/lib/seo";

/*
 * 【重要 / ふみさんへ】
 * このページの条文はAIが一般的な利用規約の構成に沿って起草した文面であり、法的助言ではありません。
 * 公開前に必ずふみさん自身の目で内容を確認し、必要に応じて専門家の確認を受けてください。
 * 特に「事業者の表記」「準拠法」「管轄裁判所」は運営実態と本人の判断でしか決められないため、
 * 記入待ちのプレースホルダのまま残してあります（第1条・第7条）。
 * master マージ前に `grep -rn "FUMI_INPUT" frontend/ docs/` が 0 件になるまで埋めてください。
 */

export const metadata: Metadata = createPageMetadata(pageSeo.termsOfService);

type TermsSection = {
  id: string;
  title: string;
  body: ReactElement;
};

const siteName = "AWS資格ロードマップラボ";
const establishedDate = "2026年8月2日";
const lastUpdatedDate = "2026年8月2日";

const termsSections: TermsSection[] = [
  {
    id: "scope",
    title: "1. 適用範囲",
    body: (
      <>
        <p>
          本利用規約（以下「本規約」といいます）は、{siteName}
          （以下「当サイト」といいます）が提供するすべてのページ、コンテンツ、機能の利用条件を定めるものです。
        </p>
        <p>
          当サイトを閲覧または利用した時点で、利用者は本規約に同意したものとみなします。本規約に同意できない場合は、当サイトの利用を中止してください。
        </p>
        <p>
          個人情報の取り扱いについては
          <Link
            href="/privacy"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            プライバシーポリシー
          </Link>
          が、掲載情報の正確性および責任範囲については
          <Link
            href="/disclaimer"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            免責事項
          </Link>
          が、それぞれ本規約と併せて適用されます。内容が矛盾する場合は、当該事項について定めた個別のページの記載を優先します。
        </p>
        {/*
          FUMI_INPUT: 事業者の表記。
          「個人運営」のままにするか、氏名・屋号・所在地・連絡先のどこまでを開示するかを決めてください。
          特定商取引法上の表示義務は物品販売や有料サービスを行う場合に発生します。
          現状の当サイトは無償の情報提供のみのため必須ではありませんが、AdSense 審査では
          「誰が運営しているか分かる」ことが加点要素になります。
          例:「当サイトの運営者は個人であり、ハンドルネーム『ふみくん』として運営しています。」
        */}
        <p>
          当サイトの運営者の表記は次のとおりです：
          {"{{FUMI_INPUT: 事業者表記（個人運営である旨 / 氏名または屋号 / 開示範囲）}}"}
        </p>
      </>
    ),
  },
  {
    id: "content-usage",
    title: "2. 本サイトのコンテンツの利用条件",
    body: (
      <>
        <p>
          当サイトのコンテンツは、AWS認定資格の学習を支援する目的で作成しています。利用者は、私的な学習、社内勉強会での参照、個人の学習ノートへの引用など、非営利かつ限定的な範囲であれば自由に利用できます。
        </p>
        <p>
          コンテンツを引用する場合は、次の条件をすべて満たしてください。
        </p>
        <ul>
          <li>引用箇所と自身の文章が明確に区別されていること</li>
          <li>引用元として当サイトの名称と該当ページのURLを明示すること</li>
          <li>引用が従、自身の文章が主となる分量であること</li>
          <li>引用にあたって内容を改変しないこと</li>
        </ul>
        <p>
          記事全文の転載、模擬問題および解説のまとまった複製、コンテンツを再構成した教材の配布については、事前に
          <Link
            href="/contact"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            お問い合わせ
          </Link>
          から許諾を得てください。
        </p>
        <p>
          有償の教材、研修資料、講座コンテンツなど、対価を伴う用途への利用（商用利用）についても、事前の許諾を必要とします。許諾の有無および条件は個別に判断します。
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "3. 禁止事項",
    body: (
      <>
        <p>
          当サイトの利用にあたり、次の行為を禁止します。
        </p>
        <ul>
          <li>
            自動化されたプログラムによる大量アクセス、スクレイピング、クローリングにより、当サイトの運営に支障を与える行為
          </li>
          <li>
            コンテンツを改変したうえで、当サイトの内容であるかのように公開・配布する行為
          </li>
          <li>
            当サイトがAmazon Web Services, Inc.またはその関連会社の公式サイトである、あるいは公式に承認・提携しているかのように紹介または表示する行為
          </li>
          <li>
            当サイトのコンテンツを、AWS認定試験の受験規約に違反する目的で利用する行為
          </li>
          <li>
            問い合わせフォームを通じて、営業目的の一斉送信、迷惑メール、虚偽の情報を送信する行為
          </li>
          <li>
            当サイトのサーバー、配信基盤、フォーム処理に対する不正アクセス、脆弱性の探索、負荷試験を無断で行う行為
          </li>
          <li>
            第三者の著作権、商標権、プライバシーその他の権利を侵害する行為
          </li>
          <li>法令または公序良俗に反する行為</li>
        </ul>
        <p>
          禁止事項に該当すると判断した場合、運営者は事前の通知なくアクセスの制限その他必要な措置を取ることがあります。
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "4. 免責",
    body: (
      <>
        <p>
          当サイトは、掲載内容の正確性、完全性、最新性を保証しません。AWSのサービス仕様、料金、試験範囲は変更される可能性があるため、重要な判断を行う際はAWS公式ドキュメントおよびAWS認定の公式ページを必ず確認してください。
        </p>
        <p>
          当サイトの模擬問題および解説は、学習目的で独自に作成した非公式のコンテンツです。実際の試験で出題された内容を再現したものではなく、AWS認定試験の合格を保証するものでもありません。
        </p>
        <p>
          当サイトのコンテンツを利用したこと、または利用できなかったことにより生じた損害について、運営者は責任を負いません。AWSの設定に伴う料金の発生、試験の申込や受験に関する判断、業務上の判断は、利用者本人の責任で行ってください。
        </p>
        <p>
          免責の詳細な範囲は
          <Link
            href="/disclaimer"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            免責事項
          </Link>
          に定めています。本条と免責事項ページの内容は、併せて適用されます。
        </p>
      </>
    ),
  },
  {
    id: "external",
    title: "5. 外部リンク・外部サービスの取り扱い",
    body: (
      <>
        <p>
          当サイトには、AWS公式ドキュメント、GitHub、note、Xなど外部サイトへのリンクを掲載しています。リンク先の内容、正確性、安全性について、運営者は責任を負いません。外部サイトの利用は、各サイトの利用規約およびプライバシーポリシーに従ってください。
        </p>
        <p>
          当サイトは、アクセス解析および広告配信のために外部サービスを利用する場合があります。これらのサービスにおけるデータの取り扱いは
          <Link
            href="/privacy"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            プライバシーポリシー
          </Link>
          に記載しています。
        </p>
        <p>
          当サイトへのリンクは、原則として自由に設定できます。ただし、当サイトが第三者の商品やサービスを推奨しているかのように誤認させる形でのリンク設定はご遠慮ください。
        </p>
      </>
    ),
  },
  {
    id: "copyright",
    title: "6. 著作権および商標",
    body: (
      <>
        <p>
          当サイトに掲載している文章、図表、構成図、模擬問題、解説の著作権は、運営者または正当な権利者に帰属します。第2条に定める範囲を超える利用は、著作権法上認められた場合を除き禁止します。
        </p>
        <p>
          Amazon Web Services、AWS、およびそれらに関連するサービス名、ロゴは、Amazon.com, Inc.またはその関連会社の商標または登録商標です。当サイトはこれらの商標を、AWS認定資格の学習内容を説明する目的で参照しているにすぎません。
        </p>
        <p>
          当サイトはAmazon Web Services, Inc.およびその関連会社とは無関係であり、AWSが提供、承認、運営、後援するものではありません。当サイトはAWS認定資格の学習を支援する独立した個人運営のサイトです。
        </p>
        <p>
          掲載内容に著作権上の問題がある場合は、
          <Link
            href="/contact"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            お問い合わせ
          </Link>
          から連絡してください。事実を確認したうえで、速やかに対応します。
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "7. 準拠法および管轄裁判所",
    body: (
      <>
        {/*
          FUMI_INPUT: 準拠法と管轄裁判所。
          ここは法務判断が必要なため、AIは値を埋めません。
          一般的な国内個人サイトでは「準拠法: 日本法」「管轄: 運営者の住所地を管轄する地方裁判所を
          第一審の専属的合意管轄裁判所とする」という書き方が多く用いられます。
          ただし住所地を書くと居住地域が推測できるため、開示範囲は本人の判断で決めてください。
          例:「本規約の準拠法は日本法とします。」「東京地方裁判所を第一審の専属的合意管轄裁判所とします。」
        */}
        <p>
          本規約の解釈および適用にあたっての準拠法は次のとおりです：
          {"{{FUMI_INPUT: 準拠法（例: 本規約は日本法に準拠し、日本法に従って解釈されます）}}"}
        </p>
        <p>
          当サイトの利用に関して運営者と利用者との間に紛争が生じた場合の管轄裁判所は次のとおりです：
          {"{{FUMI_INPUT: 管轄裁判所（例: ○○地方裁判所を第一審の専属的合意管轄裁判所とする）}}"}
        </p>
        <p>
          紛争が生じた場合は、まず
          <Link
            href="/contact"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            お問い合わせ
          </Link>
          を通じた協議による解決を図るものとします。
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "8. 規約の変更",
    body: (
      <>
        <p>
          運営者は、法令の改正、サイト構成の変更、運営方針の見直しなどに応じて、本規約を予告なく変更することがあります。
        </p>
        <p>
          変更後の本規約は、当ページに掲載した時点から効力を生じます。重要な変更を行った場合は、本ページの最終改定日を更新します。
        </p>
        <p>
          当サイトを継続して利用した場合、変更後の本規約に同意したものとみなします。定期的に本ページを確認してください。
        </p>
      </>
    ),
  },
  {
    id: "dates",
    title: "9. 制定日・最終改定日",
    body: (
      <>
        <p>制定日：{establishedDate}</p>
        <p>最終改定日：{lastUpdatedDate}</p>
        <p>
          過去の改定内容についての問い合わせは、
          <Link
            href="/contact"
            className="mx-1 font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            お問い合わせ
          </Link>
          から受け付けます。
        </p>
      </>
    ),
  },
];

export default function TermsOfServicePage(): ReactElement {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">
          Terms of Service
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          利用規約
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          {siteName}
          のコンテンツを利用するための条件、禁止事項、免責の範囲、著作権および商標の取り扱いについて定めます。
        </p>
        <div className="mt-6 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-800">制定日：</span>
            {establishedDate}
          </p>
          <p>
            <span className="font-semibold text-slate-800">最終改定日：</span>
            {lastUpdatedDate}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        <p className="font-semibold">このページについて</p>
        <p className="mt-2">
          当サイトはAWS認定資格の学習を支援する個人運営の学習サイトであり、Amazon Web
          Services, Inc.の公式サイトではありません。掲載しているコンテンツは学習目的で独自に作成した非公式の情報であり、AWS認定試験の合格を保証するものではありません。
        </p>
      </div>

      <nav
        aria-label="利用規約目次"
        className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <h2 className="text-lg font-bold text-slate-900">目次</h2>
        <ol className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {termsSections.map((section) => (
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
        {termsSections.map((section) => (
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
            href="/privacy"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            免責事項
          </Link>
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
            お問い合わせ
          </Link>
        </div>
      </div>
    </main>
  );
}
