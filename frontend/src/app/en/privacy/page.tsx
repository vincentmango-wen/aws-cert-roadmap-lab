import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { createAbsoluteUrl, siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

type PolicySection = {
  id: string;
  title: string;
  body: ReactNode;
};

const siteName = "AWS Cert Roadmap Lab";
const establishedDate = "June 1, 2026";
const lastUpdatedDate = "June 7, 2026";
const pagePath = "/en/privacy";
const pageTitle = "Privacy Policy";
const pageDescription =
  "Privacy Policy for AWS Cert Roadmap Lab, including how this site handles personal information, cookies, Google Analytics, Google AdSense, contact form data, and AWS operational logs.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "Privacy Policy",
    "AWS Cert Roadmap Lab",
    "Google Analytics",
    "Google AdSense",
    "cookies",
    "contact form",
  ],
  alternates: {
    canonical: createAbsoluteUrl(pagePath),
    languages: {
      ja: createAbsoluteUrl("/privacy"),
      en: createAbsoluteUrl(pagePath),
      "zh-Hant": createAbsoluteUrl("/zh/privacy"),
      "x-default": createAbsoluteUrl("/privacy"),
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: createAbsoluteUrl(pagePath),
    siteName: siteConfig.shortName,
    images: [
      {
        url: createAbsoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: `${pageTitle} - ${siteConfig.shortName}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [createAbsoluteUrl(siteConfig.defaultOgImage)],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const policySections: PolicySection[] = [
  {
    id: "basic-policy",
    title: "1. Basic Policy",
    body: (
      <>
        <p>
          {siteName} is a learning website for people studying AWS Cloud
          Practitioner, AWS Solutions Architect Associate, and related AWS
          services.
        </p>
        <p>
          This site provides AWS terms, service comparisons, practice questions,
          architecture explanations, and learning articles. When this site
          collects personal information, it uses that information only for
          contact handling, site improvement, service operation, and abuse
          prevention.
        </p>
        <p>
          This site is operated as a learning and portfolio project. The site
          keeps collected information to the minimum required scope and does not
          publish personal information or authentication information on public
          pages or operational logs.
        </p>
      </>
    ),
  },
  {
    id: "collected-information",
    title: "2. Information We May Collect",
    body: (
      <>
        <p>This site may collect the following information.</p>
        <ul>
          <li>Name entered in the contact form</li>
          <li>Email address entered in the contact form</li>
          <li>Subject and message entered in the contact form</li>
          <li>Source page information when a contact form is submitted</li>
          <li>Browser information and user agent information</li>
          <li>
            Access analytics information collected through Google Analytics,
            such as viewed pages, referrers, browsers, devices, and usage
            behavior
          </li>
          <li>Site usage information collected through cookies</li>
          <li>
            Cookie information used by advertising services such as Google
            AdSense
          </li>
        </ul>
        <p>
          At the current MVP stage, this site does not provide login, learning
          history storage, or payment features. Therefore, this site does not
          collect user registration data, answer accuracy, learning progress, or
          payment information.
        </p>
      </>
    ),
  },
  {
    id: "purpose-of-use",
    title: "3. Purpose of Use",
    body: (
      <>
        <p>Collected information is used for the following purposes.</p>
        <ul>
          <li>Responding to inquiries, correction reports, and work requests</li>
          <li>Managing contact history and inquiry status</li>
          <li>Improving site content, UI, and learning materials</li>
          <li>Preventing abuse, spam, and malicious behavior</li>
          <li>Understanding access patterns and improving SEO</li>
          <li>
            Analyzing popular content, exit pages, and search traffic trends
          </li>
          <li>
            Improving the quality of advertising services such as Google
            AdSense
          </li>
          <li>
            Considering future learning features, notification features, and
            educational material links
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contact-form",
    title: "4. Contact Form Data",
    body: (
      <>
        <p>
          The contact form collects name, email address, subject, and message.
          These items are used to reply to inquiries, handle correction reports,
          and improve this site.
        </p>
        <p>
          Contact form data may be stored in an AWS data store. The collected
          contact data is not displayed on public pages.
        </p>
        <p>
          The contact form may include anti-spam controls such as a honeypot
          field and character length limits.
        </p>
        <p>
          System logs may record the minimum information required to investigate
          successful submissions, validation errors, and server errors. Full
          email addresses, full inquiry messages, API keys, and authentication
          credentials are not intentionally written to logs.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Use of Cookies",
    body: (
      <>
        <p>
          This site may use cookies for access analytics, advertising delivery,
          and usability improvement.
        </p>
        <p>
          Cookies are small pieces of information stored in a browser. Cookies
          help this site understand usage patterns, improve content, and support
          advertising delivery.
        </p>
        <p>
          Cookies do not directly allow this site to obtain a visitor name,
          email address, or contact form message.
        </p>
        <p>
          Visitors can disable cookies through browser settings. Some analytics
          or advertising features may be limited when cookies are disabled.
        </p>
      </>
    ),
  },
  {
    id: "google-analytics",
    title: "6. Google Analytics",
    body: (
      <>
        <p>
          This site uses Google Analytics to understand traffic patterns and
          improve learning content.
        </p>
        <p>
          Google Analytics uses cookies and may collect access information such
          as viewed pages, referrers, browser type, device type, and time spent
          on pages.
        </p>
        <p>
          Information collected by Google Analytics is used for site improvement
          and SEO improvement. This information is not used by this site to
          directly identify individual visitors.
        </p>
        <p>
          This site does not send personal information such as names, email
          addresses, or contact form messages as Google Analytics event data.
        </p>
        <p>
          Visitors who want to disable Google Analytics data collection can use
          browser settings or an opt-out method provided by Google.
        </p>
      </>
    ),
  },
  {
    id: "advertising",
    title: "7. Advertising Services Such as Google AdSense",
    body: (
      <>
        <p>
          This site may use third-party advertising services such as Google
          AdSense.
        </p>
        <p>
          Third-party advertising providers, including Google, may use cookies
          to display advertisements based on visitor interests.
        </p>
        <p>
          Advertising providers may display ads based on access information from
          this site and other websites.
        </p>
        <p>
          Visitors who do not want personalized ads or cookie-based advertising
          can adjust browser settings or settings provided by advertising
          providers.
        </p>
        <p>
          This site does not encourage self-clicking, click requests, invalid
          clicks, or other behavior that violates advertising policies.
        </p>
      </>
    ),
  },
  {
    id: "aws-infrastructure",
    title: "8. AWS Infrastructure and Operational Logs",
    body: (
      <>
        <p>
          This site is designed to be hosted on AWS using a serverless and
          low-cost architecture. Static pages may be delivered through Amazon S3
          and Amazon CloudFront.
        </p>
        <p>
          Contact form submissions may be processed through Amazon API Gateway,
          AWS Lambda, and Amazon DynamoDB. Lambda execution results may be
          recorded in Amazon CloudWatch Logs for troubleshooting and operation.
        </p>
        <p>
          Operational logs are used to check whether the system is working, to
          investigate errors, and to prevent abuse. Full contact messages, full
          email addresses, AWS credentials, API keys, and JWT values are not
          intentionally written to logs.
        </p>
      </>
    ),
  },
  {
    id: "third-party-disclosure",
    title: "9. Disclosure to Third Parties",
    body: (
      <>
        <p>
          This site does not provide collected personal information to third
          parties without the person&apos;s consent, except in the following
          cases.
        </p>
        <ul>
          <li>When required by law</li>
          <li>
            When required to respond to abuse, spam, or security incidents
          </li>
          <li>
            When required to protect life, body, or property and obtaining prior
            consent is difficult
          </li>
          <li>
            When handling is delegated to a service provider within the scope
            required for site operation
          </li>
        </ul>
        <p>
          When this site uses external services such as Google Analytics or
          Google AdSense, cookies and access information may be transmitted
          according to each service mechanism.
        </p>
      </>
    ),
  },
  {
    id: "data-management",
    title: "10. Data Management",
    body: (
      <>
        <p>
          This site manages collected information by limiting access permissions,
          limiting log output, and reviewing unnecessary stored data.
        </p>
        <p>
          Contact form data, when stored, is not shown on public pages and is
          checked only within the scope required for site operation.
        </p>
        <p>
          When contact information is stored on AWS, access to the storage
          destination is limited to the scope required for inquiry handling and
          operation.
        </p>
        <p>
          System logs are not intended to store full email addresses, full
          inquiry messages, API keys, JWT values, AWS credentials, or similar
          sensitive information.
        </p>
      </>
    ),
  },
  {
    id: "retention-period",
    title: "11. Retention Period",
    body: (
      <>
        <p>
          Contact form data may be retained for a certain period after the
          inquiry is handled, in order to support follow-up inquiries, confirm
          correction reports, and improve the site.
        </p>
        <p>
          The standard review period for contact data is one year. However,
          information may be retained longer when required for legal response,
          abuse prevention, or ongoing inquiry handling.
        </p>
        <p>
          Analytics data and advertising-related data are handled according to
          the retention settings and policies of each external service.
        </p>
      </>
    ),
  },
  {
    id: "disclosure-correction-deletion",
    title: "12. Requests for Disclosure, Correction, or Deletion",
    body: (
      <>
        <p>
          When a person requests disclosure, correction, deletion, or suspension
          of use of personal information held by this site, this site will
          respond after confirming the identity of the requester.
        </p>
        <p>
          Please use the contact page to submit requests related to personal
          information handling.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "13. External Links",
    body: (
      <>
        <p>
          This site may include links to GitHub, note, AWS official
          documentation, and other external websites.
        </p>
        <p>
          Please check the privacy policy of each external website for how that
          website handles personal information, cookies, advertising, and access
          analytics.
        </p>
        <p>
          This site is not responsible for damages or problems that occur on
          external websites.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "14. Disclaimer",
    body: (
      <>
        <p>
          This site publishes information intended to help users study AWS
          certifications and understand AWS services. However, this site does
          not guarantee the accuracy, completeness, or freshness of published
          information.
        </p>
        <p>
          AWS service specifications, pricing, and certification exam scope may
          change. Please check official AWS information when studying, applying
          for an exam, or using AWS services.
        </p>
        <p>
          This site is an independent learning and portfolio project. It is not
          an official AWS website and is not affiliated with Amazon Web
          Services.
        </p>
      </>
    ),
  },
  {
    id: "policy-updates",
    title: "15. Updates to This Privacy Policy",
    body: (
      <>
        <p>
          This site may update this Privacy Policy when laws, external services,
          or site features change.
        </p>
        <p>
          When Google Analytics, Google AdSense, login features, learning
          history features, payment features, or other major features are added,
          this page will be reviewed.
        </p>
        <p>
          Updated content becomes effective when it is published on this page.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "16. Contact",
    body: (
      <>
        <p>
          For questions about the handling of personal information, please use
          the contact page.
        </p>
        <p>
          <Link
            href="/contact"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            Contact page
          </Link>
        </p>
      </>
    ),
  },
];

export default function EnglishPrivacyPage(): ReactElement {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          This page explains how {siteName} handles personal information,
          cookies, Google Analytics, Google AdSense, contact form data, and AWS
          operational logs.
        </p>
        <div className="mt-6 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-800">Established: </span>
            {establishedDate}
          </p>
          <p>
            <span className="font-semibold text-slate-800">
              Last updated:{" "}
            </span>
            {lastUpdatedDate}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        <p className="font-semibold">About this page</p>
        <p className="mt-2">
          This site uses Google Analytics for access analytics. This site may
          also use advertising services such as Google AdSense as part of
          monetization preparation. Information submitted through the contact
          form is used for inquiry handling, correction reports, and site
          improvement.
        </p>
      </div>

      <nav
        aria-label="Privacy Policy table of contents"
        className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <h2 className="text-lg font-bold text-slate-900">
          Table of contents
        </h2>
        <ol className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {policySections.map((section) => (
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
        {policySections.map((section) => (
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
        <h2 className="text-lg font-bold text-slate-900">Related pages</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row">
          <Link
            href="/en/about"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            Contact
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
          >
            Disclaimer
          </Link>
        </div>
      </div>
    </main>
  );
}