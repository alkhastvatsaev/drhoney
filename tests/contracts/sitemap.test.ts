import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { existsRepo, readRepo, urlToFile } from "../helpers/fs.js";

describe("T6 — sitemap URLs ⊆ repo pages", () => {
  it("every <loc> maps to an on-disk HTML file", () => {
    const xml = readRepo("sitemap.xml");
    const $ = load(xml, { xml: true });
    const locs = $("loc")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    expect(locs.length).toBeGreaterThan(0);

    for (const loc of locs) {
      expect(loc.startsWith(EXPECTED.host)).toBe(true);
      const file = urlToFile(loc);
      expect(existsRepo(file), `${loc} → ${file}`).toBe(true);
    }
  });

  it("sitemap image loc asset exists", () => {
    const xml = readRepo("sitemap.xml");
    expect(xml).toContain(`${EXPECTED.host}/${EXPECTED.ogImage}`);
    expect(existsRepo(EXPECTED.ogImage)).toBe(true);
  });
});
