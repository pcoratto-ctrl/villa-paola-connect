# Villa Paola Caposuvero — SEO Keyword-to-Page Mapping & Audit Log

## Search Console Status (2026-11-24)
- Domain property verified in Google Search Console.
- `public/sitemap.xml` (11 public URLs) accepted.
- Indexing requested for the 3 English URLs; main live URL test passed; actual indexing pending.

## Keyword-to-Existing-Page Mapping (No Doorway Pages)

| Existing URL | Language | Primary Intent / Target Themes | Canonical & hreflang |
| --- | --- | --- | --- |
| `/` | IT (supports `?lang=en` hydrated view) | Brand & main overview (`Villa Paola Caposuvero`, Gizzeria beachfront villa) | Self canonical `https://villapaolacaposuvero.it/` |
| `/villa-sul-mare-calabria` | IT | Main Italian commercial page (`villa sul mare Calabria`, direct beach access, 15 min SUF) | Self canonical; reciprocal hreflang `it`/`en`/`x-default` with `/en/beachfront-villa-calabria` |
| `/en/beachfront-villa-calabria` | EN | Main English commercial page (`beachfront villa Calabria`, whole villa exclusive use, 3 bedrooms / 2 bathrooms / up to 6, 15 min Lamezia Terme Airport SUF) | Self canonical; reciprocal hreflang `it`/`en`/`x-default` with `/villa-sul-mare-calabria` |
| `/en/villa-direct-beach-access-calabria` | EN | Direct beach access intent (`villa with direct beach access Calabria`, garden-to-shore route, clarifies direct access vs private beach, mobility enquiry) | Self canonical; no hreflang (distinct topic page) |
| `/en/calabria-spring-autumn-holidays` | EN | Shoulder-season intent (`spring and autumn villa holidays Calabria`, May/October flexible coast & inland stays, no guaranteed weather/swimming) | Self canonical; no hreflang (distinct topic page) |
| `/villa-accesso-diretto-spiaggia-calabria` | IT | Legacy Italian direct beach access page | Self canonical; `it` |
| `/casa-vacanze-gizzeria` | IT | Legacy Italian Gizzeria holiday home page | Self canonical; `it` |
| `/villa-vicino-aeroporto-lamezia` | IT | Legacy Italian Lamezia Airport proximity page | Self canonical; `it` |
| `/villa-per-famiglie-calabria` | IT | Legacy Italian family villa page | Self canonical; `it` |
| `/villa-pet-friendly-calabria` | IT | Legacy Italian pet-friendly villa page | Self canonical; `it` |
| `/vacanze-settembre-calabria` | IT | Legacy Italian September holidays page | Self canonical; `it` |

## Key Facts Preserved
- Whole villa for exclusive use: 3 bedrooms, 2 bathrooms, up to 6 guests (~120 m²).
- Direct beach access from the private garden without crossing a road (not a private beach).
- Approximately 15 minutes by car from Lamezia Terme Airport (SUF), traffic permitting.
- Minimum stay: 7 nights unless explicitly agreed with the owner.
- Conversion model: direct enquiry for availability & personalised quote (not instant booking); no invented prices, ratings, or amenities.
- Address: SS18, Contrada Caposuvero 6, Gizzeria Lido, Calabria, Italy.

## Verification Summary (2026-11-24)
- Vitest regression suite: 7 test files, 45 tests passed (`publicSeo.test.ts` covers English/Italian footer discovery links, static homepage English discovery, distinct visible English FAQs, quote CTA clarity, no-JS `#disponibilita` fallback, canonical/hreflang rules, and absence of `FAQPage`/`AggregateRating` schema; `staticRenderer.test.ts` passed).
- Harness build & typecheck: `build OK` in `/tmp/observability/build-errors.log`.
- Playwright mobile (390×844) & desktop (1280×900) verification on `/`, `/?lang=en`, `/en/beachfront-villa-calabria`, `/en/villa-direct-beach-access-calabria`, and `/en/calabria-spring-autumn-holidays`: zero horizontal overflow, zero page errors, `#disponibilita` anchors scroll to the existing enquiry section (no real form submission or email triggered), English home footer links only to the 3 English routes, and all 3 English pages render their distinct visible FAQ headings and items.