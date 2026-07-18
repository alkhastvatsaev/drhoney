import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { existsRepo } from "../helpers/fs.js";

/** T8 companion: ensure every page we lint actually exists (html-validate runs via npm run lint:html). */
describe("T8 — HTML pages inventory for html-validate", () => {
  for (const page of EXPECTED.htmlPages) {
    it(`lists ${page}`, () => {
      expect(existsRepo(page)).toBe(true);
    });
  }

  it("excludes google verification stub from required SEO set", () => {
    expect(EXPECTED.htmlPages).not.toContain("google985da6a6498bd3a5.html");
  });
});
