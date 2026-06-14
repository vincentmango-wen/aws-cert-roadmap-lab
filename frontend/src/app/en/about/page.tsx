import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "../../../lib/seo";
import type { PageMetadataInput } from "../../../lib/seo";

const aboutEnSeo: PageMetadataInput = {
  title: "About | AWS Cert Roadmap Lab",
  description:
    "Learn about AWS Cert Roadmap Lab, a learning and portfolio site for AWS Cloud Practitioner and Solutions Architect Associate preparation.",
  path: "/en/about",
  keywords: [
    "AWS Cert Roadmap Lab",
    "AWS certification",
    "AWS Cloud Practitioner",
    "AWS Solutions Architect Associate",
    "AWS portfolio",
    "serverless portfolio",
  ],
};

export const metadata: Metadata = createPageMetadata(aboutEnSeo);

const profileItems = [
  {
    label: "Operator",
    value: "Fumikun",
  },
  {
    label: "Site name",
    value: "AWS Cert Roadmap Lab",
  },
  {
    label: "Main theme",
    value: "AWS certification learning, serverless development, and portfolio building",
  },
  {
    label: "Target readers",
    value: "Beginners preparing for AWS Cloud Practitioner or Solutions Architect Associate",
  },
];

const sitePurposes = [
  "Organize AWS Cloud Practitioner and SAA learning topics in a practical way.",
  "Help learners understand AWS services through glossary pages, comparisons, practice questions, and architecture diagrams.",
  "Show hands-on implementation experience using Amazon S3, CloudFront, Lambda, API Gateway, and DynamoDB.",
  "Grow the site into a learning media platform connected to SEO content, portfolio value, and future monetization.",
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
      "Amazon API Gateway",
      "AWS Lambda",
      "Amazon DynamoDB",
      "Amazon CloudWatch",
      "IAM",
      "AWS Budgets",
    ],
  },
  {
    category: "Development",
    items: ["GitHub", "GitHub Actions", "Static site generation", "Serverless architecture"],
  },
];

const roadmapItems = [
  {
    title: "Phase 1",
    description:
      "Build the basic static learning site with AWS glossary pages, comparison articles, practice questions, and architecture explanations.",
  },
  {
    title: "Phase 2",
    description:
      "Implement the contact form using API Gateway, Lambda, and DynamoDB, and connect the frontend to AWS backend services.",
  },
  {
    title: "Phase 3",
    description:
      "Set up CI/CD, automated deployment to S3, CloudFront delivery, and basic operational monitoring.",
  },
  {
    title: "Phase 4",
    description:
      "Improve SEO, add more learning content, prepare for AdSense, and introduce a custom domain.",
  },
  {
    title: "Phase 5",
    description:
      "Expand the site for global SEO by adding English and Chinese pages while keeping the existing Japanese URLs unchanged.",
  },
];

export default function AboutEnPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p className="text-sm font-semibold text-blue-700">About</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          About AWS Cert Roadmap Lab
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
          AWS Cert Roadmap Lab is a learning site designed to turn AWS certification study
          into structured output. Instead of memorizing terms in isolation, this site connects
          AWS concepts with glossary pages, service comparisons, practice questions,
          architecture diagrams, and real implementation experience.
        </p>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          The site is also developed as a portfolio project. It demonstrates how a static
          frontend, serverless APIs, managed databases, CI/CD, monitoring, cost control,
          and security design can be combined into a practical AWS-based web application.
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
          <h2 className="text-2xl font-bold text-slate-950">Purpose of this site</h2>

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
          <h2 className="text-2xl font-bold">Learning background</h2>

          <p className="mt-5 leading-8 text-slate-200">
            This site was created to document AWS Cloud Practitioner and Solutions Architect
            Associate learning while building a real web application on AWS. The goal is not
            only to understand exam topics, but also to explain design decisions, cost control,
            security, deployment, and operations.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">Technology stack</h2>

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
        <h2 className="text-2xl font-bold text-slate-950">Development roadmap</h2>

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
        <h2 className="text-2xl font-bold text-slate-950">Related links</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href="https://github.com/vincentmango-wen/aws-cert-roadmap-lab"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            View GitHub
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              Check the source code, README, architecture diagrams, and design notes.
            </span>
          </a>

          <a
            href="https://note.com/fumi_ai_202507"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            View note
            <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
              Read articles about AWS learning and generative AI usage.
            </span>
          </a>

          <Link
            href="/contact"
            className="rounded-2xl bg-blue-700 p-5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
          >
            Contact
            <span className="mt-2 block text-sm font-normal leading-6 text-blue-100">
              Send feedback, correction requests, or project inquiries.
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}