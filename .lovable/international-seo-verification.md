# International public SEO — 20 November 2026

## Public language group
- Italian: https://villapaolacaposuvero.it/villa-sul-mare-calabria
- German: https://villapaolacaposuvero.it/de/ferienvilla-am-meer-kalabrien
- English: https://villapaolacaposuvero.it/en/beachfront-villa-calabria
- Reciprocal it/de/en alternates and x-default to Italian; all self-canonical.
- Homepage and six other existing commercial Italian URLs preserved. No redirects, external settings, database or partner synchronization changes.

## Implementation
- Shared copy and verified property facts: src/lib/publicVillaContent.ts.
- Shared presentation: src/components/PublicVillaArticle.tsx; request page: src/pages/InternationalVilla.tsx.
- Build-time HTML: src/lib/staticPublicDocument.tsx and scripts/staticPublicPlugin.ts, registered in vite.config.ts.
- Routing/language: src/App.tsx, src/i18n/i18n.ts, src/locales/de.json, src/contexts/LanguageContext.tsx, src/components/LanguageSwitcher.tsx, src/pages/Index.tsx, src/pages/SeoPages.tsx, src/components/SeoLandingPage.tsx.
- Existing request component: German labels and WhatsApp wording; success and WhatsApp click emit separate optional built-in anonymous analytics events. Existing click_events tracking was preserved, not migrated.
- Metadata/style: index.html, src/index.css (existing remote font import moved to head link), src/pages/AdminLogin.tsx, public/robots.txt, public/sitemap.xml.
- Tests: src/test/publicSeo.test.ts; event catalog: .lovable/events.json; ambient SDK type: src/vite-env.d.ts.

## Checks completed
- Harness reported build/typecheck OK.
- 29 tests passed: localized SEO rules, partner calendar, iCal, secret-header normalization, gallery.
- Executed the actual static plugin's closeBundle output generator against the project HTML template in temporary staging. All 10 indexable routes contain meaningful raw HTML, one H1, one title, one description and one self-canonical; all 3 counterparts have four reciprocal language entries including x-default.
- Six private route shells have raw noindex metadata. Actual access controls unchanged. Legal noindex routes excluded from sitemap.
- Sitemap has exactly 10 canonical production public URLs and no lastmod fabricated from build time.
- Playwright checked all three commercial routes and same-page request CTA, homepage language discovery, German mobile overflow and private login noindex. Screenshots inspected.
- Browser-isolated request-response stub tested success state/event; WhatsApp click and database insert intercepted. No guest request, email, operator, or database change created by tests. This is UI verification, not new real email delivery proof.
- Built-in analytics catalog has two validated non-PII events. Runtime remains optional and consent handling is delegated to existing injected analytics, with no new provider. SDK delivery and consent behavior were not tested on production.

## Limits / deployment
- Not published. Actual production HTTP responses, static nested-route serving (including slash behavior), Google indexing, and social crawler results must be rechecked after owner deployment; local static output is not proof of live production HTML.
- Local Vite preview is a SPA and does not serve generated build-time pages; production deployment must preserve the emitted nested index.html files. No Netlify redirects or runtime servers were added.
- Build output provides no-JavaScript enquiry links to the existing homepage request or WhatsApp; the actual same-page interactive form requires JavaScript as before. Static homepage is an informational fallback, not the full interactive gallery.
- Structured data uses LodgingBusiness and Accommodation for verified identity, address, bedrooms and occupancy, with no offers/prices/reviews/ratings. No eligibility for a Google vacation-rental rich result is claimed.
- German commercial page/form translated; legal links explicitly open the existing English legal pages, not an unreviewed German policy. Existing Italian public route contracts retained.
- Search Console remains disconnected due to workspace permissions; no connection setup, sitemap submission, or external setting changes made.
- Metric: availability requests per month; the catalogued success event measures requests accepted by the existing request service, not unique people, email delivery or bookings.