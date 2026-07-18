import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { readRepo } from "../helpers/fs.js";

describe("T2 — Stripe checkout links", () => {
  it("js/stripe.js Payment Link is https buy.stripe.com", () => {
    const src = readRepo("js/stripe.js");
    const match = src.match(
      /export const STRIPE_PAYMENT_LINK\s*=\s*\n?\s*"(https:\/\/buy\.stripe\.com\/[^"]+)"/
    );
    expect(match, "STRIPE_PAYMENT_LINK export missing").toBeTruthy();
    const url = match![1];
    expect(url).toMatch(EXPECTED.stripePaymentLinkRe);
    expect(new URL(url).hostname).toBe(EXPECTED.stripeHost);
  });

  it("homepage loads /js/main.js as module", () => {
    const $ = load(readRepo("index.html"));
    const src = $('script[type="module"]').attr("src") ?? "";
    expect(src).toContain("/js/main.js");
  });

  it("buy-jar and products hrefs use buy.stripe.com (HTML fallback)", () => {
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
    const src = readRepo("js/stripe.js");
    expect(src).not.toContain("/test_");
  });
});
