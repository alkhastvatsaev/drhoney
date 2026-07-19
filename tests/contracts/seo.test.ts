import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { existsRepo, readRepo } from "../helpers/fs.js";

describe("T4 — SEO head contract (homepage)", () => {
  const $ = load(readRepo("index.html"));

  it("has non-empty title", () => {
    const title = $("title").first().text().trim();
    expect(title.length).toBeGreaterThan(10);
  });

  it("targets English query natural honey Amman", () => {
    const title = $("title").first().text();
    const desc = $('meta[name="description"]').attr("content") ?? "";
    expect(title.toLowerCase()).toContain("natural honey");
    expect(title.toLowerCase()).toContain("amman");
    expect(desc.toLowerCase()).toMatch(/natural honey/);
    expect(desc.toLowerCase()).toContain("amman");
  });

  it("has canonical to host root", () => {
    const href = $('link[rel="canonical"]').attr("href");
    expect(href).toBe(`${EXPECTED.host}/`);
  });

  it("has og:image pointing at existing asset", () => {
    const og = $('meta[property="og:image"]').attr("content") ?? "";
    expect(og).toBe(`${EXPECTED.host}/${EXPECTED.ogImage}`);
    expect(existsRepo(EXPECTED.ogImage)).toBe(true);
  });

  it("has twitter:image", () => {
    const tw = $('meta[name="twitter:image"]').attr("content") ?? "";
    expect(tw).toContain(EXPECTED.ogImage);
  });

  it("allows indexing", () => {
    const robots = $('meta[name="robots"]').attr("content") ?? "";
    expect(robots.toLowerCase()).toContain("index");
  });

  it("favicon 48x48 is declared for Google", () => {
    const icon = $('link[rel="icon"][sizes="48x48"]').attr("href") ?? "";
    expect(icon).toContain("favicon-48.png");
  });
});
