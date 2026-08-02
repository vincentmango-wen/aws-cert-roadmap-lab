import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.about);

/*
 * ふみさん記入欄について
 *
 * 値が {{FUMI_INPUT: ...}} になっている項目は、運営者本人しか事実を書けない箇所です。
 * 推測や一般論で埋めず、必ずご本人が実際の内容に置き換えてください。
 * 置き換えが済むと `grep -rn "FUMI_INPUT" frontend/` の結果が 0 件になります。
 */

const profileItems = [
  {
    label: "運営者",
    // 屋号・実名を併記するかどうかは運営者の判断。ハンドルネームのみで公開する場合はこのままでよい。
    value: "ふみくん",
  },
  {
    label: "サイト名",
    value: "AWS資格ロードマップラボ",
  },
  {
    label: "保有AWS資格",
    // 例:「AWS Certified Cloud Practitioner（2026年3月取得）」のように、資格の正式名称と取得年月を書く。
    // 未取得の資格や学習中の資格を「保有」として書かないこと。学習中であれば「学習中」と明記する。
    value: "{{FUMI_INPUT: 保有AWS資格の正式名称と取得年月}}",
  },
  {
    label: "AWS実務経験",
    // 例:「SES で業務システムの運用を◯年。うち AWS は EC2 / S3 / IAM の運用を◯年」のように、
    // 年数・職種・業務で触れているAWSサービスの範囲を書く。実務経験がない場合は「実務経験なし・独学」と正直に書く。
    value: "{{FUMI_INPUT: 実務年数・職種・業務でのAWS利用範囲}}",
  },
  {
    label: "執筆・監修体制",
    // 例:「記事・模擬問題の作成と公開前レビューは運営者本人が行う。外部監修者はいない」など、
    // 誰が書き、誰が確認して公開しているかを書く。存在しない監修者・編集部を書かないこと。
    value: "{{FUMI_INPUT: 誰が執筆し、誰が公開前に確認しているか}}",
  },
  {
    label: "テーマ",
    value: "AWS資格学習・サーバーレス開発・ポートフォリオ制作",
  },
  {
    label: "対象読者",
    value: "AWS Cloud Practitioner / SAA を学習している初学者",
  },
  {
    label: "連絡方法",
    value: "問い合わせフォーム（/contact）",
  },
];

const sitePurposes = [
  "AWS Cloud Practitioner と SAA の学習内容を整理し、試験範囲を体系的に追えるようにする",
  "AWSサービスの違いを用語集・比較表・模擬問題で理解できるようにする",
  "AWS公式ドキュメントを一次情報として、初学者がつまずきやすい論点を整理して公開する",
  "S3、CloudFront、Lambda、API Gateway、DynamoDB などを使った実装の記録を、再現できる形で残す",
];

const editorialPrinciples = [
  {
    title: "非公式であることを明示する",
    description:
      "本サイトはAWS公式サイトではありません。AWS公式教材、公式問題、公式模擬試験と誤認される表現は使いません。",
  },
  {
    title: "本番の試験問題を扱わない",
    description:
      "本番の試験問題、流出した問題、受験者の記憶をもとに再現した問題は掲載しません。模擬問題はすべて学習目的で独自に作成しています。",
  },
  {
    title: "合格を保証しない",
    description:
      "特定のコンテンツを読めば合格できる、という書き方はしません。試験の結果を断定したり保証したりする表現も使いません。",
  },
  {
    title: "学習支援に目的を限定する",
    description:
      "用語の理解、設計の理解、練習、サービスの比較という学習上の目的に絞ってコンテンツを作成します。",
  },
  {
    title: "SEOより信頼性を優先する",
    description:
      "検索流入が見込めるキーワードであっても、不正な学習方法を連想させるもの、誤認を招くものは狙いません。",
  },
  {
    title: "AWSの正式名称を尊重する",
    description:
      "Amazon S3、Amazon CloudFront、AWS Lambda のように、AWSサービス名・試験名・資格名は正式名称を基準に表記します。",
  },
];

const reviewChecklist = [
  {
    item: "AWS公式との誤認がないか",
    criterion:
      "AWSが提供・承認・監修しているように読める表現が含まれていないことを確認する",
  },
  {
    item: "実試験の内容を示唆していないか",
    criterion:
      "本番試験の問題を掲載・再現していると読める表現が含まれていないことを確認する",
  },
  {
    item: "合格を保証する表現がないか",
    criterion: "試験結果を保証する表現、成果を断定する表現がないことを確認する",
  },
  {
    item: "非公式であることが読者に伝わるか",
    criterion:
      "模擬問題ページ・運営者情報・免責事項のいずれからも非公式の学習サイトだと分かることを確認する",
  },
  {
    item: "学習目的であることが分かるか",
    criterion:
      "練習・学習・理解といった目的が本文から読み取れることを確認する",
  },
  {
    item: "AWSの正式名称が正しいか",
    criterion:
      "サービス名・試験コード（CLF-C02、SAA-C03 など）の表記が公式表記と一致することを確認する",
  },
  {
    item: "出典が確認できるか",
    criterion:
      "仕様・料金・試験範囲の記述が、AWS公式ドキュメントまたはAWS認定試験ガイドで確認できることを確認する",
  },
];

const updatePolicies = [
  {
    title: "一次情報はAWS公式ドキュメント",
    body: "サービス仕様、料金体系、試験範囲についての記述は、AWS公式ドキュメント、AWS公式料金ページ、AWS認定試験ガイドを一次情報として作成しています。他サイトの記述を一次情報として扱うことはしません。",
  },
  {
    title: "AWSの変更に追随する",
    body: "AWSはサービス仕様・料金・リージョン提供状況を継続的に変更します。料金や上限値のように変動する数値を扱う場合は、いつ時点・どのリージョンの情報かを本文に明記し、変更を把握した時点で記事を修正します。",
  },
  {
    title: "更新日を表示する",
    body: "ブログ記事には公開日と更新日を表示しています。内容を修正した場合は更新日を書き換えるため、記載内容がいつ時点のものかを読者が判断できます。表示が古い記事は、AWS公式情報を優先して確認してください。",
  },
  {
    title: "誤りを見つけた場合",
    body: "掲載内容に誤り・古くなった記述・分かりにくい説明を見つけた場合は、問い合わせフォームから該当ページのURLと内容を添えてご連絡ください。確認のうえ修正し、必要に応じて更新日を改めます。",
  },
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
      "公開済みコンテンツを継続的に見直し、AWSサービスの仕様変更や試験ガイドの改訂に追随する。",
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
          AWS資格ロードマップラボは、AWS認定資格の学習を暗記で終わらせず、
          用語・比較・模擬問題・構成図として理解できる形に整理して公開している、個人運営の学習サイトです。
          AWS Cloud Practitioner（CLF-C02）から AWS Solutions Architect Associate（SAA-C03）までを対象に、
          初学者がつまずきやすい論点を、AWS公式ドキュメントで確認できる範囲で解説しています。
        </p>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          本サイトはAWS公式サイトではなく、Amazon Web Services, Inc. またはその関連会社が
          提供・承認・監修しているものではありません。
          誰がどのような方針でコンテンツを作っているかを読者が判断できるように、
          運営者のプロフィール、コンテンツの制作方針、情報の更新方針をこのページに公開しています。
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">運営者プロフィール</h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          本サイトのコンテンツは、以下の運営者が個人で作成・公開しています。
          編集部や複数名の執筆チームは存在しません。
          保有資格と実務経験を開示しているのは、読者が「誰の説明を読んでいるのか」を
          判断したうえでコンテンツを利用できるようにするためです。
        </p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
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
        </dl>

        <p className="mt-6 leading-8 text-slate-700">
          資格・実務経験の範囲を超える領域については、断定を避け、
          AWS公式ドキュメントの該当箇所を参照できる形で記述します。
          運営者が実際に確認していない仕様や料金を、確認済みであるかのように書くことはしません。
        </p>
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
            試験範囲の知識だけでなく、設計意図、コスト管理、セキュリティ、運用監視まで
            自分の言葉で説明できる状態を目指しており、その過程で整理した内容を記事として公開しています。
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">コンテンツ制作方針</h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          本サイトでは、記事・模擬問題・用語集・比較表を作成するときの基準を
          コンテンツポリシーとして文書化し、それに従って公開しています。
          AWS認定資格は受験料と学習時間がかかるため、誤った情報や誇大な表現は読者の不利益に直結します。
          そのため、以下の方針を守れないコンテンツは公開しません。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {editorialPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-base font-bold text-slate-900">{principle.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-lg font-bold text-slate-900">サイト共通の免責</h3>

        <p className="mt-3 rounded-2xl border border-orange-100 bg-orange-50 p-5 leading-8 text-slate-800">
          本サイトはAWS公式サイトではありません。掲載している模擬問題・解説・学習記事は、
          AWS公式試験問題や流出した問題ではなく、学習目的で独自に作成した非公式コンテンツです。
          試験の合格を保証するものではありません。
        </p>

        <p className="mt-4 leading-8 text-slate-700">
          より詳しい免責の範囲は
          <Link href="/disclaimer" className="font-semibold text-blue-700 underline">
            免責事項
          </Link>
          に記載しています。
        </p>

        <h3 className="mt-10 text-lg font-bold text-slate-900">公開前のレビュー基準</h3>

        <p className="mt-3 max-w-3xl leading-8 text-slate-700">
          新しい記事、模擬問題、ページのタイトルや説明文を公開する前に、以下の項目を確認しています。
          いずれかを満たさない場合は、公開せずに修正します。
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-900">確認項目</th>
                <th className="px-4 py-3 font-semibold text-slate-900">判定基準</th>
              </tr>
            </thead>
            <tbody>
              {reviewChecklist.map((check) => (
                <tr key={check.item} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-3 font-semibold text-slate-800">{check.item}</td>
                  <td className="px-4 py-3 leading-7 text-slate-700">{check.criterion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">情報の更新方針</h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          AWSのサービス仕様と料金、そしてAWS認定試験の出題範囲は変更されます。
          本サイトでは、掲載内容がいつ時点の情報かを読者が判断できるようにし、
          変更を把握した時点で記事を修正する運用を取っています。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {updatePolicies.map((policy) => (
            <div
              key={policy.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-base font-bold text-slate-900">{policy.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{policy.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 leading-8 text-slate-700">
          受験申込、試験範囲、試験料金、最新の出題対象については、
          必ずAWS公式サイトおよびAWS認定試験ガイドで最終確認してください。
          誤りの報告は
          <Link href="/contact" className="font-semibold text-blue-700 underline">
            問い合わせフォーム
          </Link>
          から受け付けています。
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">使用技術</h2>

        <p className="mt-4 max-w-3xl leading-8 text-slate-700">
          本サイト自体もAWS上で構築・運用しており、その構成と設定内容は
          GitHubリポジトリで公開しています。記事で説明している構成を、
          実際に動いているサイトの実装として第三者が検証できる状態にしています。
        </p>

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
