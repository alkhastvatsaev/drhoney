# Dr. Honey

A bilingual Arabic/English landing page for a natural honey business in Amman,
designed around local discovery and direct WhatsApp conversion.

[View the live site](https://drhoney.vercel.app)

## What it demonstrates

- Right-to-left and left-to-right content in one responsive interface
- Local-business, organization and product structured data
- Open Graph, Twitter Card, canonical and multilingual SEO metadata
- Installable web-app metadata and a complete favicon set
- A lightweight WhatsApp-first customer journey

## Architecture

The site is intentionally static. `index.html` contains the content, structured
data and presentation, while `base-path.js` keeps asset URLs compatible with
both Vercel and GitHub Pages. There is no application server or customer
database.

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Quality checks

```bash
npm ci
npm run ci          # html-validate + JSON + Vitest + Playwright smoke
npm test            # contracts + unit
npm run test:e2e    # Playwright (lang switch + buy link)
npm run lint:html
```

See `AGENTS.md` for when AI agents must update tests. CI (`pages.yml`) runs
`npm run ci` and blocks deploy on failure.

Optional live Stripe gate (after going live):

```bash
REQUIRE_LIVE_STRIPE=1 npm test
```

## Limitations

- Orders are completed outside the site through WhatsApp.
- Business details are maintained directly in the static document.
- The promotional video is committed to the repository and should move to an
  optimized media CDN if traffic grows.
