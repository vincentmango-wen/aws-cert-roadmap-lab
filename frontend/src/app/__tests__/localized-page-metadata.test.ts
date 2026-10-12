import { describe, expect, it } from "vitest";
import { createAbsoluteUrl, siteConfig } from "@/lib/seo";

import { metadata as englishContactMetadata } from "../(site)/en/contact/page";
import { metadata as traditionalChineseRoadmapMetadata } from "../(site)/zh/roadmap/page";

describe("localized page Open Graph metadata", () => {
  it("uses English locale metadata on the English contact page", () => {
    expect(englishContactMetadata.openGraph).toMatchObject({ locale: "en_US" });
  });

  it("uses the Traditional Chinese OG image on the Chinese roadmap page", () => {
    const expectedImage = createAbsoluteUrl(siteConfig.chineseOgImage);

    expect(traditionalChineseRoadmapMetadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: expectedImage }),
    ]);
    expect(traditionalChineseRoadmapMetadata.twitter?.images).toEqual([expectedImage]);
  });
});
