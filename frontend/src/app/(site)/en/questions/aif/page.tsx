import { AifQuestionsPage, aifListMetadata } from "../../../questions/aif-page-data";

const locale = "en" as const;

export const metadata = aifListMetadata(locale);

export default function AifPracticeQuestions() {
  return <AifQuestionsPage locale={locale} />;
}
