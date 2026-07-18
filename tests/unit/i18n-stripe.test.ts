/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLang } from "../../js/i18n.js";
import { applyStripeLinks, STRIPE_PAYMENT_LINK } from "../../js/stripe.js";

function mountHomeShell() {
  document.body.innerHTML = `
    <html></html>
    <button class="lang-btn is-active" data-lang="en" aria-pressed="true">EN</button>
    <button class="lang-btn" data-lang="ar" aria-pressed="false">AR</button>
    <button class="lang-btn" data-lang="ru" aria-pressed="false">RU</button>
    <p id="tagline" data-en="Hello EN" data-ar="مرحبا" data-ru="Привет">Hello EN</p>
    <p id="location" data-en="Amman" data-ar="عمّان" data-ru="Амман">Amman</p>
    <a id="products" data-en="Buy EN" data-ar="اشترِ" data-ru="Купить">Buy EN</a>
    <a id="buy-jar" href="#">jar</a>
    <a class="faq-cta" href="#">faq</a>
    <div data-lang-panel="en"></div>
    <div data-lang-panel="ar" hidden></div>
    <div data-lang-panel="ru" hidden></div>
  `;
  // jsdom uses document.documentElement from the default document
}

describe("setLang", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("switches to Arabic: rtl, copy, panels, aria", () => {
    mountHomeShell();
    vi.useFakeTimers();
    const ctx = {
      tagline: document.getElementById("tagline")!,
      locationEl: document.getElementById("location")!,
      productsEl: document.getElementById("products")!,
      buttons: document.querySelectorAll(".lang-btn"),
      panels: document.querySelectorAll("[data-lang-panel]"),
      copy: { en: "Hello EN", ar: "مرحبا", ru: "Привет" },
      locationCopy: { en: "Amman", ar: "عمّان", ru: "Амман" },
      productsCopy: { en: "Buy EN", ar: "اشترِ", ru: "Купить" },
      fadeMs: 0,
    };

    setLang("ar", ctx);
    vi.runAllTimers();

    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(ctx.tagline.textContent).toBe("مرحبا");
    expect(ctx.locationEl.textContent).toBe("عمّان");
    expect(ctx.productsEl.textContent).toBe("اشترِ");
    expect(
      document.querySelector('[data-lang-panel="ar"]')?.hidden
    ).toBe(false);
    expect(
      document.querySelector('[data-lang-panel="en"]')?.hidden
    ).toBe(true);
    const arBtn = document.querySelector('[data-lang="ar"]')!;
    expect(arBtn.classList.contains("is-active")).toBe(true);
    expect(arBtn.getAttribute("aria-pressed")).toBe("true");
    vi.useRealTimers();
  });

  it("switches to Russian: ltr", () => {
    mountHomeShell();
    vi.useFakeTimers();
    const ctx = {
      tagline: document.getElementById("tagline")!,
      locationEl: document.getElementById("location")!,
      productsEl: document.getElementById("products")!,
      buttons: document.querySelectorAll(".lang-btn"),
      panels: document.querySelectorAll("[data-lang-panel]"),
      copy: { en: "Hello EN", ar: "مرحبا", ru: "Привет" },
      locationCopy: { en: "Amman", ar: "عمّان", ru: "Амман" },
      productsCopy: { en: "Buy EN", ar: "اشترِ", ru: "Купить" },
      fadeMs: 0,
    };
    setLang("ru", ctx);
    vi.runAllTimers();
    expect(document.documentElement.lang).toBe("ru");
    expect(document.documentElement.dir).toBe("ltr");
    expect(ctx.tagline.textContent).toBe("Привет");
    vi.useRealTimers();
  });
});

describe("applyStripeLinks", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("sets buy CTAs to STRIPE_PAYMENT_LINK", () => {
    mountHomeShell();
    applyStripeLinks(document);
    expect(document.getElementById("buy-jar")?.getAttribute("href")).toBe(
      STRIPE_PAYMENT_LINK
    );
    expect(document.getElementById("products")?.getAttribute("href")).toBe(
      STRIPE_PAYMENT_LINK
    );
    expect(document.querySelector(".faq-cta")?.getAttribute("href")).toBe(
      STRIPE_PAYMENT_LINK
    );
  });
});
