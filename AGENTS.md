# Agent guidelines — Dr. Honey

Static marketing site (`drhoney.xyz`). Prefer small diffs. No backend.

## Testing (required)

Run before finishing a change:

```bash
npm run ci
```

### When you MUST update or add tests

| Change touches… | Update |
|-----------------|--------|
| Stripe Payment Link / price | `js/stripe.js` + `tests/contracts/checkout.test.ts` + `EXPECTED` |
| Language switcher behavior | `js/i18n.js` + `tests/unit/i18n-stripe.test.ts` (+ e2e if UX changes) |
| WhatsApp / phone | `tests/contracts/whatsapp.test.ts` + `EXPECTED.whatsappPath` |
| `og:image`, canonical, favicon, robots | `tests/contracts/seo.test.ts` |
| hreflang / `/ru` / `/ar` | `tests/contracts/hreflang.test.ts` |
| `sitemap.xml` URLs or image | `tests/contracts/sitemap.test.ts` |
| JSON-LD Product/Offer | `tests/contracts/jsonld.test.ts` |
| Product / OG image filenames | `tests/fixtures/expected.ts` + `assets.test.ts` |
| New HTML page | Add to `EXPECTED.htmlPages` + `npm run lint:html` list in `package.json` |

### Conventions

- Put business constants only in `tests/fixtures/expected.ts` — no duplicated magic strings in tests.
- Prefer **contract tests** (file/HTML asserts) over brittle full-page snapshots.
- Do **not** unit-test inline `<script>` via HTML string scraping for behavior — extract to `js/` first, then unit-test.
- Keep Playwright (if added later) ≤ 8 smoke specs.

### Definition of done

A PR that changes checkout, contact, SEO head, or sitemap is incomplete until `npm test` and `npm run lint:html` pass.
