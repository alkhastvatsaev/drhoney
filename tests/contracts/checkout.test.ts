import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { readRepo } from "../helpers/fs.js";

describe("T2 — Stripe checkout links", () => {
  it("index.html Payment Link is https buy.stripe.com", () => {
    const html = readRepo("index.html");
    const match = html.match(
      /const STRIPE_PAYMENT_LINK\s*=\s*"(https:\/\/buy\.stripe\.com\/[^"]+)"/
    );
    expect(match, "STRIPE_PAYMENT_LINK constant missing").toBeTruthy();
    const url = match![1];
    expect(url).toMatch(EXPECTED.stripePaymentLinkRe);
    expect(new URL(url).hostname).toBe(EXPECTED.stripeHost);
  });

  it("buy-jar and products hrefs use buy.stripe.com", () => {
    const $ = load(readRepo("index.html"));
    for (const sel of ["#buy-jar", "#products", "a.faq-cta"]) {
      $(sel).each((_, el) => {
        const href = $(el).attr("href") ?? "";
        expect(href, sel).toMatch(/^https:\/\/buy\.stripe\.com\//);
      });
    }
  });

  it("fails live gate when REQUIRE_LIVE_STRIPE=1 and link is test_", () => {
    if (process.env.REQUIRE_LIVE_STRIPE !== "1") return;
    const html = readRepo("index.html");
    const match = html.match(
      /const STRIPE_PAYMENT_LINK\s*=\s*"(https:\/\/buy\.stripe\.com\/[^"]+)"/
    );
    expect(match![1]).not.toContain("/test_");
  });
});
