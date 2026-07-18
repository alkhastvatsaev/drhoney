import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { readRepo } from "../helpers/fs.js";

describe("T3 — WhatsApp number invariant", () => {
  const pages = ["index.html", "thank-you.html", "merci.html"] as const;

  for (const page of pages) {
    it(`${page} links to ${EXPECTED.whatsappUrl}`, () => {
      const html = readRepo(page);
      expect(html).toContain(EXPECTED.whatsappPath);
      expect(html).toMatch(
        new RegExp(`https://wa\\.me/${EXPECTED.whatsappPath}`)
      );
    });
  }

  it("home phone CTA uses wa.me", () => {
    const $ = load(readRepo("index.html"));
    const href = $("a.phone").attr("href") ?? "";
    expect(href).toBe(EXPECTED.whatsappUrl);
  });
});
