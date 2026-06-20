import Link from "next/link";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AWS Cert Roadmap Lab",
  description:
    "A beginner-friendly AWS certification learning site for Cloud Practitioner and Solutions Architect Associate topics, covering AWS terms, service comparisons, practice questions, and architecture diagrams.",
  path: "/en",
  image: "/images/assets/og-image-en.svg",
  imageAlt: "AWS Cert Roadmap Lab English top page",
  keywords: [
    "AWS certification",
    "AWS Cloud Practitioner",
    "AWS SAA",
    "AWS beginner guide",
    "AWS service comparison",
    "AWS architecture diagrams",
  ],
  enableLanguageAlternates: true,
  locale: "en",
});

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  label: string;
};

type BlogPreview = {
  title: string;
  description: string;
  href: string;
  category: string;
};

type AwsService = {
  name: string;
  role: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "AWS Terms",
    description:
      "Learn core AWS services such as IAM, S3, EC2, Lambda, and VPC with beginner-friendly explanations and exam-focused notes.",
    href: "/en/terms",
    label: "Explore terms",
  },
  {
    title: "Service Comparisons",
    description:
      "Compare commonly confused AWS services such as S3 / EBS / EFS and RDS / DynamoDB from both exam and practical design perspectives.",
    href: "/en/comparisons",
    label: "View comparisons",
  },
  {
    title: "Practice Questions",
    description:
      "Review CLF-C02 style questions and understand why each correct answer is right and why the other choices are wrong.",
    href: "/en/questions",
    label: "Start practice",
  },
  {
    title: "AWS Architecture Diagrams",
    description:
      "Understand practical AWS patterns such as S3 + CloudFront and API Gateway + Lambda + DynamoDB through architecture diagrams.",
    href: "/en/architectures",
    label: "View diagrams",
  },
];

const blogPreviews: BlogPreview[] = [
  {
    title: "AWS Cloud Practitioner Learning Roadmap",
    description:
      "A beginner-friendly learning path for preparing for AWS Cloud Practitioner while building practical AWS knowledge.",
    href: "/en/blog/aws-cloud-practitioner-roadmap",
    category: "CLF",
  },
  {
    title: "How to Build an AWS Portfolio with the Free Tier",
    description:
      "Learn how to keep AWS costs low while showing practical cloud implementation experience through a portfolio project.",
    href: "/en/blog/aws-free-tier-portfolio",
    category: "Portfolio",
  },
  {
    title: "Static Site Hosting with S3 and CloudFront",
    description:
      "Understand the basic architecture for serving a static website through CloudFront while keeping the S3 bucket private.",
    href: "/en/blog/s3-cloudfront-static-site",
    category: "Serverless",
  },
];

const awsServices: AwsService[] = [
  {
    name: "Amazon S3",
    role: "Stores static website files such as HTML, CSS, JavaScript, and images.",
  },
  {
    name: "Amazon CloudFront",
    role: "Delivers the site over HTTPS with edge caching and controlled access to S3.",
  },
  {
    name: "AWS Lambda",
    role: "Runs serverless backend logic for features such as the contact form.",
  },
  {
    name: "Amazon DynamoDB",
    role: "Stores contact form submissions without managing a traditional database server.",
  },
];

export default function EnglishHomePage() {
  return (
    <div className="space-y-20">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-medium text-sky-100">
              AWS Cloud Practitioner / SAA Learning Site
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Understand AWS certification topics through{" "}
                <span className="text-sky-300">
                  terms, comparisons, questions, and diagrams
                </span>
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                AWS Cert Roadmap Lab helps beginners learn the differences
                between AWS services, exam points, and practical design patterns
                from Cloud Practitioner to Solutions Architect Associate.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/en/questions"
                className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                Start practice questions
              </Link>

              <Link
                href="/en/terms"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore AWS terms
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-sky-200">
              What you can learn
            </p>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-2xl font-bold">30+</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  Core AWS service terms for beginners
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">CLF-C02</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  Practice questions for AWS Cloud Practitioner
                </dd>
              </div>

              <div>
                <dt className="text-2xl font-bold">Serverless</dt>
                <dd className="mt-1 text-sm text-slate-300">
                  S3 / CloudFront / Lambda / DynamoDB architecture patterns
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
            Learning Contents
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            Learn AWS by connecting concepts to architecture
          </h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            This site is designed to go beyond memorization. You will learn what
            each AWS service does, how similar services differ, and how they are
            used together in real-world architecture patterns.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featureCards.map((card) => (
            <article
              key={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-5 inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
              >
                {card.label}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-sky-50 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
              For CLF-C02
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Start with AWS Cloud Practitioner
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              Learn cloud concepts, the shared responsibility model, core AWS
              services, billing, pricing, and support. Start with terms and
              practice questions to build a strong foundation for the exam.
            </p>
            <Link
              href="/en/roadmap"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View learning roadmap
            </Link>
          </article>

          <article className="rounded-3xl bg-slate-100 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
              For SAA-C03
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Understand architecture patterns for SAA
            </h2>
            <p className="mt-4 leading-7 text-slate-700">
              Learn high availability, fault tolerance, security, and cost
              optimization through AWS architecture diagrams. The goal is to
              explain not only individual services, but also how they work
              together.
            </p>
            <Link
              href="/en/architectures"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              View architecture diagrams
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
              Latest Articles
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              AWS learning articles
            </h2>
            <p className="max-w-3xl leading-7 text-slate-600">
              Articles about AWS certification, serverless architecture, the AWS
              Free Tier, and portfolio development will be added step by step.
            </p>
          </div>

          <Link
            href="/en/blog"
            className="text-sm font-bold text-sky-700 hover:text-sky-900"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {blogPreviews.map((post) => (
            <article
              key={post.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                {post.category}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-7 text-slate-950">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {post.description}
              </p>
              <Link
                href={post.href}
                className="mt-5 inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-300">
                Portfolio Architecture
              </p>
              <h2 className="text-3xl font-bold">
                The site itself is built as an AWS portfolio project
              </h2>
              <p className="leading-7 text-slate-300">
                AWS Cert Roadmap Lab is designed to serve static learning
                content through Amazon S3 and CloudFront, while handling contact
                form submissions through API Gateway, Lambda, and DynamoDB.
              </p>
              <Link
                href="/en/architectures"
                className="inline-flex rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                Explore the architecture
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {awsServices.map((service) => (
                <div
                  key={service.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="font-bold text-white">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {service.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}