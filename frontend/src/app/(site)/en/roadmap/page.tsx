import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AWS Certification Study Roadmap",
  description:
    "A practical study path from AWS Cloud Practitioner to Solutions Architect Associate, with a glossary, comparisons, practice questions, architecture diagrams, and hands-on examples.",
  path: "/en/roadmap",
  keywords: [
    "AWS study roadmap",
    "Cloud Practitioner",
    "Solutions Architect Associate",
    "CLF-C02",
    "SAA-C03",
  ],
});

type RoadmapStep = {
  step: string;
  title: string;
  target: string;
  description: string;
  items: string[];
  href: string;
  hrefLabel: string;
};

type ExamComparison = {
  item: string;
  clf: string;
  saa: string;
};

type ImplementationMapping = {
  learningTopic: string;
  implementation: string;
  awsServices: string[];
};

const roadmapSteps: RoadmapStep[] = [
  {
    step: "Step 1",
    title: "Get a map of the AWS landscape",
    target: "Beginners",
    description:
      "Start by understanding what cloud services offer and how AWS groups its services. This gives you a framework for everything that follows.",
    items: [
      "Cloud fundamentals",
      "Regions and Availability Zones",
      "The shared responsibility model",
      "Major AWS service categories",
    ],
    href: "/en/blog",
    hrefLabel: "Browse AWS learning articles",
  },
  {
    step: "Step 2",
    title: "Build your Cloud Practitioner foundation",
    target: "CLF-C02",
    description:
      "CLF-C02 covers AWS concepts, security, core services, pricing, and support. Aim to explain the ideas in your own words rather than memorize labels.",
    items: [
      "Cloud Concepts",
      "Security and Compliance",
      "Cloud Technology and Services",
      "Billing, Pricing, and Support",
    ],
    href: "/en/questions/clf",
    hrefLabel: "Practice CLF questions",
  },
  {
    step: "Step 3",
    title: "Learn core AWS services in context",
    target: "CLF and SAA",
    description:
      "Build a working vocabulary for services such as IAM, S3, EC2, Lambda, VPC, RDS, and DynamoDB—the building blocks you will meet in both exams and real designs.",
    items: [
      "A concise explanation of each service",
      "Common use cases",
      "What the exams tend to test",
      "Cost and security considerations",
    ],
    href: "/en/terms",
    hrefLabel: "Explore the AWS glossary",
  },
  {
    step: "Step 4",
    title: "Compare services that solve similar problems",
    target: "CLF and SAA",
    description:
      "Exam questions often ask you to choose between services with overlapping roles. Compare their trade-offs before you move on to longer scenarios.",
    items: [
      "S3, EBS, and EFS",
      "RDS and DynamoDB",
      "SNS, SQS, and EventBridge",
      "CloudWatch, CloudTrail, and AWS Config",
    ],
    href: "/en/comparisons",
    hrefLabel: "Compare AWS services",
  },
  {
    step: "Step 5",
    title: "Check your understanding with practice questions",
    target: "CLF-C02",
    description:
      "Read the requirements, compare the choices, and review why each answer is right or wrong. Return to related terms when a concept is still unclear.",
    items: [
      "Identify the conditions in the question",
      "Compare the answer choices",
      "Explain why the correct answer fits",
      "Review related services and terms",
    ],
    href: "/en/questions",
    hrefLabel: "Open the practice question library",
  },
  {
    step: "Step 6",
    title: "Study SAA design through architecture diagrams",
    target: "SAA-C03",
    description:
      "For SAA-C03, service knowledge is only the start. Learn how availability, resilience, security, and cost shape a complete architecture.",
    items: [
      "Static sites with S3 and CloudFront",
      "API Gateway, Lambda, and DynamoDB",
      "Three-tier web applications",
      "Highly available web applications",
    ],
    href: "/en/architectures",
    hrefLabel: "Explore AWS architecture diagrams",
  },
  {
    step: "Step 7",
    title: "Explain AWS choices through an implementation",
    target: "Portfolio",
    description:
      "Connect exam concepts to a working project. Being able to explain why a service fits a requirement is useful well beyond the exam.",
    items: [
      "Store static files in S3",
      "Serve HTTPS traffic through CloudFront",
      "Handle form requests with Lambda",
      "Store submissions in DynamoDB",
    ],
    href: "/en/architectures",
    hrefLabel: "Review the project architecture",
  },
];

const examComparisons: ExamComparison[] = [
  {
    item: "Learning scope",
    clf: "A broad introduction to AWS and cloud fundamentals",
    saa: "Deeper study of design patterns, resilience, availability, and cost",
  },
  {
    item: "Question style",
    clf: "Questions about service roles, pricing, and support basics",
    saa: "Choosing an architecture that meets a set of requirements",
  },
  {
    item: "Study focus",
    clf: "Core terms, shared responsibility, services, and pricing",
    saa: "VPCs, redundancy, scaling, database selection, and security",
  },
  {
    item: "How to use this site",
    clf: "Start with the glossary, comparisons, and CLF practice set",
    saa: "Focus on diagrams, design decisions, and implementation examples",
  },
];

const implementationMappings: ImplementationMapping[] = [
  {
    learningTopic: "Storage",
    implementation: "Keep the site's static files in object storage.",
    awsServices: ["S3"],
  },
  {
    learningTopic: "Global delivery",
    implementation: "Deliver content over HTTPS and cache it closer to visitors.",
    awsServices: ["CloudFront", "OAC"],
  },
  {
    learningTopic: "Serverless processing",
    implementation: "Process contact form submissions without managing servers.",
    awsServices: ["Lambda", "API Gateway"],
  },
  {
    learningTopic: "NoSQL database",
    implementation: "Store contact form submissions in a managed key-value database.",
    awsServices: ["DynamoDB"],
  },
  {
    learningTopic: "Monitoring and cost control",
    implementation: "Review logs and set billing alerts to catch operational issues early.",
    awsServices: ["CloudWatch", "AWS Budgets"],
  },
];

export default function EnglishRoadmapPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-bold text-sky-100">
            AWS Learning Roadmap
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              A study path from Cloud Practitioner to Solutions Architect Associate
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Follow a practical path from AWS fundamentals through service comparisons, practice questions, architecture diagrams, and hands-on work. The goal is to explain what you learned in a portfolio project, not just recognize exam terms.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/en/questions/clf"
              className="rounded-full bg-sky-400 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              Practice CLF-C02 questions
            </Link>
            <Link
              href="/en/architectures"
              className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore AWS architectures
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">Roadmap steps</p>
          <h2 className="text-3xl font-bold text-slate-950">A practical learning sequence</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            Start with CLF-C02 to understand AWS as a whole, then move to SAA-C03 to practice architecture decisions. Finish by connecting those ideas to a project built on AWS.
          </p>
        </div>
        <div className="space-y-5">
          {roadmapSteps.map((step) => (
            <article
              key={step.step}
              className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="text-sm font-bold text-sky-700">{step.step}</p>
                <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {step.target}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={step.href} className="inline-flex text-sm font-bold text-sky-700 hover:text-sky-900">
                  {step.hrefLabel}
                  <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">CLF vs SAA</p>
          <h2 className="text-3xl font-bold text-slate-950">How Cloud Practitioner and SAA differ</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            CLF focuses on core AWS concepts. SAA asks you to select and explain a design that meets specific requirements.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 border-b border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 md:grid-cols-[180px_1fr_1fr]">
            <div className="px-5 py-4">Comparison</div>
            <div className="px-5 py-4">CLF-C02</div>
            <div className="px-5 py-4">SAA-C03</div>
          </div>
          {examComparisons.map((comparison) => (
            <div
              key={comparison.item}
              className="grid grid-cols-1 border-b border-slate-100 text-sm last:border-b-0 md:grid-cols-[180px_1fr_1fr]"
            >
              <div className="bg-slate-50 px-5 py-4 font-bold text-slate-800">{comparison.item}</div>
              <div className="px-5 py-4 leading-6 text-slate-600">{comparison.clf}</div>
              <div className="px-5 py-4 leading-6 text-slate-600">{comparison.saa}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-700">Learning to implementation</p>
          <h2 className="text-3xl font-bold text-slate-950">Connect AWS study to a working project</h2>
          <p className="max-w-3xl leading-7 text-slate-600">
            Map the services you study to the choices in this site implementation. A useful portfolio story explains what each service does and why it fits the requirement.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {implementationMappings.map((mapping) => (
            <article key={mapping.learningTopic} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">{mapping.learningTopic}</h3>
              <p className="mt-3 leading-7 text-slate-600">{mapping.implementation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mapping.awsServices.map((service) => (
                  <span key={service} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                    {service}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-sky-50 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">Next action</p>
              <h2 className="text-3xl font-bold text-slate-950">Start with CLF terms and questions</h2>
              <p className="leading-7 text-slate-700">
                If you are new to AWS, begin with core service roles and CLF practice questions before tackling SAA diagrams. Use the glossary to clarify a service, then check your understanding with a question.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/en/terms" className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800">
                Browse the AWS glossary
              </Link>
              <Link href="/en/questions/clf" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50">
                Practice CLF questions
              </Link>
              <Link href="/en/architectures" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50">
                View SAA architecture diagrams
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
