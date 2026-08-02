import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/contact/ContactForm";
import { createLocaleAwareRobots } from "@/lib/seo";

const pagePath = "/en/contact";

export const metadata: Metadata = {
  title: "Contact | AWS Cert Roadmap Lab",
  description:
    "Contact AWS Cert Roadmap Lab to report content issues, ask questions about the AWS learning site, or discuss portfolio and work inquiries.",
  alternates: {
    canonical: pagePath,
  },
  robots: createLocaleAwareRobots(pagePath),
};

export default function EnglishContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Contact</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Contact AWS Cert Roadmap Lab
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Use this form to ask questions about the site, report incorrect AWS
          learning content, or contact the developer about this portfolio.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        <p className="font-semibold">Before sending your message</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Enter an email address where you can receive a reply if you need
            one.
          </li>
          <li>
            Do not include personal secrets or confidential information in the
            message body.
          </li>
          <li>
            Do not send AWS credentials, API keys, passwords, tokens, or private
            keys.
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        <p className="font-semibold text-slate-900">Japanese page</p>
        <p className="mt-1">
          If you prefer Japanese, use the{" "}
          <Link
            href="/contact"
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            Japanese contact page
          </Link>
          .
        </p>
      </div>

      <ContactForm locale="en" />
    </main>
  );
}