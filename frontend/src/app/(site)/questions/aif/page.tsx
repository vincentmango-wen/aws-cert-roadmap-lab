import { AifQuestionsPage, aifListMetadata } from "../aif-page-data";

const locale = "ja" as const;

export const metadata = aifListMetadata(locale);

export default function AifPracticeQuestions() {
  return <AifQuestionsPage locale={locale} />;
}
