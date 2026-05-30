const learningCards = [
  {
    title: "AWS用語集",
    description: "S3、EC2、IAM、Lambdaなどの主要サービスを初学者向けに整理します。",
    href: "/terms",
  },
  {
    title: "模擬問題",
    description: "Cloud Practitioner向けの4択問題で理解度を確認します。",
    href: "/questions",
  },
  {
    title: "サービス比較",
    description: "S3 / EBS / EFS、RDS / DynamoDBなど混同しやすいサービスを比較します。",
    href: "/comparisons",
  },
  {
    title: "AWS構成図",
    description: "S3 + CloudFront、API Gateway + Lambda + DynamoDBなどの構成を図解します。",
    href: "/architectures",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            AWS Cert Roadmap Lab
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AWS資格学習を、用語・比較・問題・構成図で理解する
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Cloud PractitionerからSolutions Architect Associateまで、
            AWS初学者が試験対策と実務イメージをつなげて学べるポートフォリオ学習サイトです。
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/questions"
              className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              模擬問題を解く
            </a>
            <a
              href="/terms"
              className="rounded-full border border-slate-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-300"
            >
              用語集を見る
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learningCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-sky-300 hover:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {card.description}
              </p>
            </a>
          ))}
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">このサイトで学べること</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li>・AWS Cloud Practitionerの主要サービス</li>
            <li>・SAAにつながる基本構成パターン</li>
            <li>・試験で混同しやすいサービス比較</li>
            <li>・S3 + CloudFrontによる静的サイト公開</li>
            <li>・API Gateway + Lambda + DynamoDBのサーバーレスAPI</li>
            <li>・IAM、CloudWatch、AWS Budgetsを含む運用設計</li>
          </ul>
        </section>
      </section>
    </main>
  );
}