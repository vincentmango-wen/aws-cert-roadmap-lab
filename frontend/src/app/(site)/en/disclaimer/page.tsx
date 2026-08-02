import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import type { PageMetadataInput } from "@/lib/seo";

type DisclaimerSection = {
  id: string;
  title: string;
  body: string[];
};

type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

const disclaimerEnSeo: PageMetadataInput = {
  title: "Disclaimer | AWS Cert Roadmap Lab",
  description:
    "Disclaimer for AWS Cert Roadmap Lab. Learn about the limitations of AWS certification content, practice questions, architecture examples, external links, and liability.",
  path: "/en/disclaimer",
  keywords: [
    "AWS Cert Roadmap Lab disclaimer",
    "AWS certification disclaimer",
    "AWS Cloud Practitioner learning",
    "AWS Solutions Architect Associate learning",
    "AWS practice questions disclaimer",
    "AWS portfolio disclaimer",
  ],
};

export const metadata: Metadata = createPageMetadata(disclaimerEnSeo);

const establishedDate = "June 1, 2026";

const disclaimerSections: DisclaimerSection[] = [
  {
    id: "accuracy",
    title: "1. Accuracy of information",
    body: [
      "AWS Cert Roadmap Lab aims to provide clear and useful learning content about AWS services, AWS certification topics, architecture diagrams, service comparisons, and practice questions.",
      "However, this site does not guarantee that all information is complete, accurate, current, or suitable for every situation.",
      "AWS service specifications, pricing, certification exam guides, exam scope, and recommended practices may change over time. Always verify important information with official AWS documentation and AWS Certification resources.",
    ],
  },
  {
    id: "aws-certification",
    title: "2. AWS certification information",
    body: [
      "This site is created to support learners preparing for AWS Cloud Practitioner, AWS Solutions Architect Associate, and related AWS learning topics.",
      "This site is not officially provided, approved, sponsored, or operated by Amazon Web Services, Inc. or its affiliates.",
      "For exam registration, exam fees, exam policies, official exam guides, and the latest certification requirements, refer to the official AWS Certification website.",
    ],
  },
  {
    id: "practice-questions",
    title: "3. Practice questions and exam content",
    body: [
      "Practice questions on this site are original learning materials designed to help users understand AWS concepts and exam-style reasoning.",
      "The practice questions are not real exam questions, exam dumps, leaked exam content, or official AWS exam materials.",
      "This site does not guarantee that the topics, wording, difficulty, or answer patterns will match the actual AWS certification exam.",
    ],
  },
  {
    id: "learning-results",
    title: "4. Learning results",
    body: [
      "Using this site does not guarantee passing an AWS certification exam, improving job performance, getting a job offer, or achieving any specific learning outcome.",
      "The explanations, roadmaps, and practice materials are provided for study support only.",
      "Users are responsible for their own study plans, exam decisions, and professional decisions.",
    ],
  },
  {
    id: "architecture-and-implementation",
    title: "5. AWS architecture and implementation examples",
    body: [
      "Architecture diagrams and implementation notes on this site are created for learning and portfolio purposes.",
      "Examples involving Amazon S3, Amazon CloudFront, AWS Lambda, Amazon API Gateway, Amazon DynamoDB, IAM, and other AWS services should not be copied directly into production environments without review.",
      "Before applying any architecture to a real project, confirm your own requirements for security, cost, availability, performance, operations, and compliance.",
      "AWS costs vary depending on region, usage, configuration, data transfer, storage, and request volume. Check the official AWS pricing pages and your own AWS billing tools before making cost-related decisions.",
    ],
  },
  {
    id: "external-links",
    title: "6. External links",
    body: [
      "This site may include links to official AWS pages, GitHub, note, documentation, articles, and other external websites.",
      "The operator of this site is not responsible for the content, accuracy, availability, security, privacy practices, or terms of external websites.",
      "When using external websites, review their own terms of service, privacy policies, and security notices.",
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of liability",
    body: [
      "The operator of this site is not responsible for any direct or indirect damages, losses, costs, exam registration mistakes, AWS configuration mistakes, billing issues, security incidents, or business decisions resulting from the use of this site.",
      "Users are responsible for confirming official information, reviewing AWS settings, monitoring costs, and making their own decisions.",
    ],
  },
  {
    id: "content-updates",
    title: "8. Content updates",
    body: [
      "Content on this site may be added, updated, corrected, or removed without prior notice.",
      "Some articles or pages may contain outdated information. Check the publication date, update date, and official AWS resources before using the information for important decisions.",
    ],
  },
];

const relatedLinks: RelatedLink[] = [
  {
    href: "/en",
    label: "Back to English home",
    description: "Return to the English top page and continue AWS certification learning.",
  },
  {
    href: "/contact",
    label: "Contact page",
    description: "Send corrections, feedback, or project inquiries from the contact page.",
  },
  {
    href: "/disclaimer",
    label: "Japanese disclaimer",
    description: "View the original Japanese disclaimer page.",
  },
];

export default function DisclaimerEnPage(): ReactElement {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <p className="text-sm font-semibold text-orange-600">Disclaimer</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Disclaimer
        </h1>

        <p className="mt-5 text-base leading-8 text-slate-700">
          Before using AWS Cert Roadmap Lab, please read the following disclaimer.
          This site is an independently operated learning and portfolio site for AWS
          certification study. It is not an official AWS website.
        </p>
      </section>

      <section className="mt-10 space-y-6">
        {disclaimerSections.map((section) => (
          <article
            key={section.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Check official AWS resources
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          For the latest information about AWS certification exams, AWS service
          specifications, pricing, security settings, and documentation, always check
          official AWS resources.
        </p>
      </section>

      <section className="mt-10 rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">Feedback and correction requests</h2>

        <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
          If you find outdated information, incorrect explanations, broken links, or
          unclear wording, please contact the site operator from the contact page.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md"
            >
              {link.label}
              <span className="mt-2 block text-sm font-normal leading-6 text-slate-600">
                {link.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-500">Established: {establishedDate}</p>
    </main>
  );
}