import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { existsRepo, readRepo, urlToFile } from "../helpers/fs.js";

describe("T5 — hreflang ↔ real pages", () => {
  it("homepage core hreflang en/ru/ar/x-default resolve to files", () => {
    const $ = load(readRepo("index.html"));
    const map = new Map<string, string>();
    $('link[rel="alternate"][hreflang]').each((_, el) => {
      const lang = $(el).attr("hreflang");
      const href = $(el).attr("href");
      if (lang && href) map.set(lang, href);
    });

    for (const lang of EXPECTED.coreHreflang) {
      expect(map.has(lang), `missing hreflang=${lang}`).toBe(true);
      const file = urlToFile(map.get(lang)!);
      expect(existsRepo(file), `${lang} → ${file}`).toBe(true);
    }
  });

  it("ru and ar landings declare reciprocal hreflang", () => {
    for (const page of ["ru/index.html", "ar/index.html"] as const) {
      const $ = load(readRepo(page));
      const langs = $('link[rel="alternate"][hreflang]')
        .map((_, el) => $(el).attr("hreflang"))
        .get();
      expect(langs).toEqual(expect.arrayContaining(["en", "ru", "ar", "x-default"]));
    }
  });
});
