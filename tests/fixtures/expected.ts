/** Single source of truth for contract tests — update here when business facts change. */
export const EXPECTED = {
  host: "https://drhoney.xyz",
  whatsappPath: "962777226349",
  whatsappUrl: "https://wa.me/962777226349",
  priceJod: "30.00",
  priceCurrency: "JOD",
  stripeHost: "buy.stripe.com",
  /** When process.env.REQUIRE_LIVE_STRIPE=1, fail if link still contains /test_ */
  stripePaymentLinkRe: /^https:\/\/buy\.stripe\.com\/(?:test_)?[A-Za-z0-9]+/,
  productImage: "dr-honey-900g-v3.png",
  ogImage: "og-dr-honey-900g.png",
  favicon48: "favicon-48.png",
  video: "video.mp4",
  poster: "poster.jpg",
  coreHreflang: ["en", "ru", "ar", "x-default"] as const,
  htmlPages: [
    "index.html",
    "thank-you.html",
    "merci.html",
    "ru/index.html",
    "ar/index.html",
    "guides/buy-honey-amman.html",
    "guides/kupit-naturalnyj-med-amman.html",
    "guides/asal-tabii-amman.html",
  ] as const,
} as const;
