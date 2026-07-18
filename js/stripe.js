/** Single checkout source of truth — update contract tests when this changes. */
export const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/test_8x29AVal10tg2002QB4Ja00";

export const STRIPE_PRICE_ID = "price_1TuPRcRwwbmtfQ0v7hSzdRN7";

/**
 * Wire all buy CTAs to the Payment Link.
 * @param {ParentNode} [root=document]
 */
export function applyStripeLinks(root = document) {
  const buyJar = root.querySelector("#buy-jar");
  const productsEl = root.querySelector("#products");
  if (buyJar) buyJar.setAttribute("href", STRIPE_PAYMENT_LINK);
  if (productsEl) productsEl.setAttribute("href", STRIPE_PAYMENT_LINK);
  root.querySelectorAll(".faq-cta").forEach((el) => {
    el.setAttribute("href", STRIPE_PAYMENT_LINK);
  });
}
