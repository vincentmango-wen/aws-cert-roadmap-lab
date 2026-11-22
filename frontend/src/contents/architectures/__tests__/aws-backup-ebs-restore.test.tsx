import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";

const slug = "aws-backup-cross-account-ebs-restore";
it.each(["ja", "en", "zh"] as const)("shows the labeled same-Region EBS recovery workflow in %s", (locale) => {
  const architecture = getArchitectureBySlug(locale, slug);
  expect(architecture).toMatchObject({ architectureId: "arc-012" });
  const html = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture: architecture! }));
  const region = html.match(/<div[^>]*role="region"[^>]*>[\s\S]*?<\/div>/)?.[0];
  expect(region).toContain('tabindex="0"');
  expect(region).toContain("overflow-x-auto");
  const asset = `/images/architectures/${slug}${locale === "ja" ? "" : `.${locale}`}.svg`;
  expect(region).toContain(`src="${asset}"`);
  const svg = readFileSync(join(process.cwd(), "public", asset), "utf8");
  for (const step of ["backup", "copy", "restore", "validate"]) {
    expect(svg).toContain(`data-step="${step}"`);
  }
  for (const boundary of ["source-kms", "destination-kms", "isolated-test"]) {
    expect(svg).toContain(`id="${boundary}"`);
  }
  expect(html).toContain("https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html");
  expect(html).toContain("https://docs.aws.amazon.com/aws-backup/latest/devguide/restoring-ebs.html");
});

it.each(["ja", "en", "zh"] as const)("links to the localized Backup service terms in %s without changing their labels", (locale) => {
  const architecture = getArchitectureBySlug(locale, slug)!;
  const html = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture }));
  const prefix = locale === "ja" ? "" : `/${locale}`;
  for (const [id, label] of [
    ["aws-backup", "AWS Backup"], ["ebs", "Amazon EBS"], ["ec2", "EC2"],
    ["organizations", "AWS Organizations"], ["kms", "AWS KMS"],
  ]) {
    expect(html).toMatch(new RegExp(`<a[^>]*href="${prefix}/terms/${id}"[^>]*>${label}</a>`));
  }
});
