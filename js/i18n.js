/**
 * EN / AR / RU UI language switcher.
 * @param {string} lang
 * @param {{
 *   documentElement?: HTMLElement,
 *   tagline: HTMLElement,
 *   locationEl: HTMLElement,
 *   productsEl: HTMLElement,
 *   buttons: NodeListOf<Element>|Element[],
 *   copy: Record<string, string>,
 *   locationCopy: Record<string, string>,
 *   productsCopy: Record<string, string>,
 *   panels?: NodeListOf<Element>|Element[],
 *   fadeMs?: number,
 *   setTimeoutFn?: typeof setTimeout,
 * }} ctx
 */
export function setLang(lang, ctx) {
  const docEl = ctx.documentElement ?? document.documentElement;
  const isAr = lang === "ar";
  docEl.lang = lang;
  docEl.dir = isAr ? "rtl" : "ltr";

  const fadeMs = ctx.fadeMs ?? 180;
  const setTimeoutFn = ctx.setTimeoutFn ?? window.setTimeout.bind(window);

  ctx.tagline.classList.add("is-fading");
  ctx.locationEl.classList.add("is-fading");
  ctx.productsEl.classList.add("is-fading");

  setTimeoutFn(() => {
    ctx.tagline.textContent = ctx.copy[lang] ?? "";
    ctx.locationEl.textContent = ctx.locationCopy[lang] ?? "";
    ctx.productsEl.textContent = ctx.productsCopy[lang] ?? "";
    ctx.tagline.classList.remove("is-fading");
    ctx.locationEl.classList.remove("is-fading");
    ctx.productsEl.classList.remove("is-fading");
  }, fadeMs);

  const panels = ctx.panels ?? document.querySelectorAll("[data-lang-panel]");
  panels.forEach((panel) => {
    const match = panel.getAttribute("data-lang-panel") === lang;
    panel.hidden = !match;
  });

  ctx.buttons.forEach((btn) => {
    const active = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

/**
 * @param {ParentNode} [root=document]
 */
export function readI18nCopy(root = document) {
  const tagline = root.querySelector("#tagline");
  const locationEl = root.querySelector("#location");
  const productsEl = root.querySelector("#products");
  if (!tagline || !locationEl || !productsEl) {
    throw new Error("Missing #tagline, #location, or #products");
  }
  return {
    tagline,
    locationEl,
    productsEl,
    buttons: root.querySelectorAll(".lang-btn"),
    panels: root.querySelectorAll("[data-lang-panel]"),
    copy: {
      en: tagline.getAttribute("data-en") ?? "",
      ar: tagline.getAttribute("data-ar") ?? "",
      ru: tagline.getAttribute("data-ru") ?? "",
    },
    locationCopy: {
      en: locationEl.getAttribute("data-en") ?? "",
      ar: locationEl.getAttribute("data-ar") ?? "",
      ru: locationEl.getAttribute("data-ru") ?? "",
    },
    productsCopy: {
      en: productsEl.getAttribute("data-en") ?? "",
      ar: productsEl.getAttribute("data-ar") ?? "",
      ru: productsEl.getAttribute("data-ru") ?? "",
    },
  };
}

/**
 * @param {ParentNode} [root=document]
 * @param {{ fadeMs?: number, setTimeoutFn?: typeof setTimeout }} [opts]
 */
export function initI18n(root = document, opts = {}) {
  const ctx = { ...readI18nCopy(root), ...opts };
  ctx.buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setLang(btn.getAttribute("data-lang") ?? "en", ctx);
    });
  });
  return ctx;
}
