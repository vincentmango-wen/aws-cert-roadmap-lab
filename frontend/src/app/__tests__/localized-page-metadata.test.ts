import { describe, expect, it } from "vitest";

import { metadata as englishContactMetadata } from "../(site)/en/contact/page";

describe("localized page Open Graph metadata", () => {
  it("uses English locale metadata on the English contact page", () => {
    expect(englishContactMetadata.openGraph).toMatchObject({ locale: "en_US" });
  });
});
