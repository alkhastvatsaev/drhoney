import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { readRepo } from "../helpers/fs.js";

describe("T7 — JSON-LD parses", () => {
  it("homepage ld+json is valid JSON with Product offer 30 JOD", () => {
    const $ = load(readRepo("index.html"));
    const blocks = $('script[type="application/ld+json"]')
      .map((_, el) => $(el).html() ?? "")
      .get()
      .filter((t) => t.trim().length > 0);

    expect(blocks.length).toBeGreaterThan(0);

    let foundOffer = false;
    for (const raw of blocks) {
      let data: unknown;
      expect(() => {
        data = JSON.parse(raw);
      }).not.toThrow();

      const nodes = collectNodes(data);
      for (const node of nodes) {
        if (
          node &&
          typeof node === "object" &&
          (node as { "@type"?: string })["@type"] === "Offer"
        ) {
          const offer = node as { price?: string; priceCurrency?: string };
          expect(offer.priceCurrency).toBe(EXPECTED.priceCurrency);
          expect(offer.price).toBe(EXPECTED.priceJod);
          foundOffer = true;
        }
      }
    }

    expect(foundOffer, "no Offer with 30.00 JOD in JSON-LD").toBe(true);
  });
});

function collectNodes(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data.flatMap(collectNodes);
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const self = [obj];
    if (Array.isArray(obj["@graph"])) {
      return self.concat(obj["@graph"].flatMap(collectNodes));
    }
    return self.concat(
      Object.values(obj).flatMap((v) =>
        typeof v === "object" && v !== null ? collectNodes(v) : []
      )
    );
  }
  return [];
}
