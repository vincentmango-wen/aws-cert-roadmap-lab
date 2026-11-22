import type { Metadata } from "next";
import { UpdatesPage } from "@/components/updates/UpdatesPage";
import { getUpdatesInventory } from "@/contents/updates";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo";
const locale = "zh";
const copy = getDictionary(locale).updates;
export const metadata: Metadata = createPageMetadata({ title: copy.title, description: copy.introduction, path: "/zh/updates", locale, enableLanguageAlternates: true });
export default function UpdatesRoute() {
  return <UpdatesPage items={getUpdatesInventory().itemsByLocale[locale]} locale={locale} />;
}
