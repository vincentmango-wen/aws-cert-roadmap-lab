import type { Metadata } from "next";
import termsData from "../../../../contents/terms/terms.json";
import { createPageMetadata, pageSeo } from "@/lib/seo";
import { TermsListClient, type TermSummary } from "./TermsListClient";

export const metadata: Metadata = createPageMetadata(pageSeo.terms);

type TermSource = Omit<TermSummary, "priority"> & {
  priority?: TermSummary["priority"];
};

function resolvePriority(term: TermSource): TermSummary["priority"] {
  if (term.priority) {
    return term.priority;
  }

  if (term.examScopes.includes("CLF-C02") && term.level === "beginner") {
    return "CLF重要";
  }

  if (term.examScopes.includes("SAA-C03")) {
    return "SAA重要";
  }

  return "学習対象";
}

const terms: TermSummary[] = (termsData as TermSource[]).map((term) => ({
  termId: term.termId,
  name: term.name,
  shortName: term.shortName,
  category: term.category,
  level: term.level,
  examScopes: term.examScopes,
  priority: resolvePriority(term),
  oneLine: term.oneLine,
}));

export default function TermsPage() {
  return <TermsListClient terms={terms} />;
}