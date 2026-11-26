# Villa Paola — rental SEO and enquiry verification, 26 November 2026

## Implemented scope
- Main English route `/en/beachfront-villa-calabria`: title `Beachfront Villa Rental in Calabria | Villa Paola Caposuvero`, distinct natural H1, rental-focused description and whole-villa copy including three bedrooms, two bathrooms, six guests, direct beach access, private garden and covered veranda. No guaranteed booking or ranking promise.
- Existing English hero overlay now says “Request availability” rather than “Book now”; same image, placement, accessible action and `#disponibilita` destination.
- Contextual links join the rental page to actual beach-route/mobility information and May/October planning. Existing topical routes remain distinct; no new URLs or languages.
- Shared structured accommodation data now includes two bathrooms. Existing six-person occupancy and three bedrooms remain. No prices, offers or fabricated rating schema.
- Corrected existing IT/EN “private beach” service labels to direct beach access and “6+” capacity to six. Removed unsupported warm-weather/discount assurances from the existing September copy. Guest review quotations, including Heike's, are unchanged.
- Shared consent purpose controls native events and existing database contact-click writes. No analytics ID, ad tag, new analytics provider or backend added.

## Existing delivery and external integration: inspected, unchanged
1. `DisponibilitaSection` calls `useSubmitLead` with name, email, optional phone, arrival/departure, guest count and the original message.
2. `useSubmitLead` invokes the existing `notify-lead` function. Its checked-in implementation validates these fields, inserts the existing lead and sends an owner notification through **Resend**. It returns `id`, `created_at`, and `email_sent`.
3. The frontend now requires a valid saved-request acknowledgement before showing success. `email_sent: false` still means the lead was saved, not that an email arrived.
4. `centro-leads-export` is the existing authenticated server-to-server read interface for Centro Operativo. Its fixed export is `id, created_at, guest_name, email, phone, arrival_date, departure_date, guests_count, message`, with its existing cutoff and cursor. This function, its authentication, configuration, data and deployment are unchanged.
5. No direct Sender API call or CRM push appears in this checked-in form path. Sender configuration or an importer on the external host is outside this project's observable source. Its delivery, acceptance and mapping have **not** been verified.

### Exact attribution gap
`notify-lead`'s input schema and insert do not accept/persist attribution; its Zod object strips unknown fields. The export has no landing path, referrer host, UTM or language field. Therefore sending extra fields from the frontend would silently lose them, and acceptance by the external CRM cannot be claimed. No extra keys were added to the lead payload, no personal message was overwritten/appended, and no schema/migration/export/backend was changed.

Sanitized attribution is instead captured **after analytics consent**, only for non-personal enquiry events. Persistent per-lead CRM attribution requires an explicitly supported storage and export contract plus confirmation of the external importer's mapping; this remains unimplemented under the requested no-backend-change scope.

## Consent and measurement semantics
- One shared `analytics` purpose, stored through the standard consent module. Consent Mode defaults execute before application scripts and deny optional analytics worldwide. No Google Analytics measurement ID or Google tag is installed; Consent Mode communicates with the existing analytics.
- Non-modal bilingual public consent panel: equally sized/weighted acceptance and rejection, unselected analytics settings, always-on necessary row, provider named in settings, and permanent settings action below the public footer. It does not appear in partner/admin pages and changes no access guards.
- The optional checkbox beside the enquiry form changes the **same** analytics choice, including withdrawal after a successful enquiry. Form privacy acknowledgement remains separate and required; analytics acceptance is never required to enquire.
- Choice lifetime is 365 days for acceptance, 183 for rejection; expired acceptance is not treated as permission. Cross-tab changes and Global Privacy Control are handled. Hosting's necessary deployment cookie is not blocked.
- Native basic visit/performance/error counting still occurs without identifying visitors and without analytics cookies. Native consent-aware autocapture can queue interactions and release them after acceptance; newly added custom enquiry calls are not made or replayed before consent. No claim of blanket zero pre-consent visit recording or universal legal compliance is made.
- Four active custom names: `project.availability_cta_clicked`, `project.availability_form_started`, `project.generate_lead`, `project.whatsapp_clicked`. Calls remain directly in existing action handlers, using the existing injected runtime.
- `generate_lead` is represented as `project.generate_lead` in the existing native analytics, **not** a GA4 conversion. It fires only after an acknowledged saved request, once per request in the active form. Concurrent/repeated submission is guarded synchronously; failures, malformed responses and honeypot responses do not count as successful leads.
- The historical `project.availability_request_succeeded` schema remains registered for compatibility/history, but is no longer emitted alongside `project.generate_lead`. Five catalog entries therefore describe four currently emitted names. Do not add historical and new success counts together for overlapping periods.
- WhatsApp events indicate clicks only, not sent messages or bookings. The existing `click_events` pipeline is retained, now consent-gated; do not sum its WhatsApp rows with the native event count as though they were separate contacts.
- Event properties never include name, email, phone, guest dates/count, message, lead ID, raw URL, query strings or click IDs. They include page language (`it`/`en`) and optional sanitized attribution.
- Landing URL is read after consent from the document navigation entry (preserves the original landing across client-side routing), with a current-location fallback. Only known public paths are retained; unknown paths become `/`.
- Referrer is reduced to an approved host (Google, Facebook, Instagram, Bing or the existing site hosts); unknown hosts are omitted as an empty string. Source values: facebook/instagram/google/bing/newsletter. Medium: social/organic/referral/email/cpc/paid_social. Campaign: villa_paola/villa-paola/spring/autumn/summer. Unknown values, `utm_term`, `utm_content`, click IDs, fragments and personal parameters are discarded. Campaign attribution is incomplete by design for unapproved values.

## Actual verification
- Full Vitest suite: **10 files, 69 passing tests**. Includes native consent default/update behaviour, rejection/acceptance/withdrawal, saved-grant expiry, cross-tab refusal, GPC, non-personal attribution, repeated-submit guard, server failure/malformed acknowledgements, saved lead with email unconfirmed, pending-request withdrawal, separate WhatsApp events, static metadata and partner regressions.
- Platform automatic build validation: latest observed `/tmp/observability/build-errors.log` entry reports `build OK`. Build/typecheck were not manually invoked; the platform performs those checks.
- Static renderer regression loads through Vite SSR with application aliases. Route metadata tests compare emitted titles/descriptions to the shared catalog, one self-canonical per route, genuine reciprocal main IT/EN alternates only, structured bathrooms/bedrooms/occupancy and absence of fabricated ratings/offers.
- Existing `public/sitemap.xml`: 11 public production-origin routes, all represented in the static route catalog; no Polish/German routes. Existing `robots.txt` permits public crawling, references that sitemap, excludes private routes and has no wildcard `Disallow: /`. No sitemap/robots rewrite was needed.
- Chromium: `/`, `/?lang=en` and all three English routes at desktop 1280×1800 and mobile 390×844, **10 route/viewport checks**, zero horizontal overflow and zero page errors. Existing availability anchors reach the form; main homepage still shows Heike exactly once in IT/EN. Screenshots of title, form, consent panel and acknowledged state were inspected.
- Browser form test intercepted **both** notification requests before they reached the backend: synthetic failure retained the form and emitted no lead; retry with a mocked server acknowledgement showed “Thank you”, one form-start and one lead event. Withdrawal stopped subsequent CTA measurement; defaults and consent updates were observed in `dataLayer`.
- No live lead, real email, account, migration, domain setting or deployment/publication was created or changed. Real server/email/CRM delivery was intentionally not tested. Local runtime stub observations and schema validation do **not** establish live analytics receipt; real visitor receipt remains to be checked after separate publication.
- Search Console's domain verification, accepted 11-URL sitemap and three requested EN indexing actions are owner-reported existing status; no new Search Console operation or ranking/indexing claim was made.

## Changed source files
- SEO/content: `src/lib/publicVillaContent.ts`, `src/components/PublicVillaArticle.tsx`, `src/components/EnglishHeroBookingLink.tsx`, `src/locales/it.json`, `src/locales/en.json`.
- Consent: `index.html`, `src/lib/consent.ts`, `src/lib/enquiryConsent.ts`, `src/components/ConsentChoices.tsx`, `src/App.tsx`.
- Enquiry: `src/components/DisponibilitaSection.tsx`, `src/hooks/useLeads.ts`, `src/lib/leadAcknowledgement.ts`, `src/lib/trackClick.ts`.
- Existing CTA/contact handlers: `HeroSection.tsx`, `MareSection.tsx`, `MobileCta.tsx`, `Navbar.tsx`, `CtaSection.tsx`, `ContattiSection.tsx`, `SeoLandingPage.tsx`, `Footer.tsx` in `src/components/`.
- Catalog/tests/docs: `.lovable/events.json`, `src/test/enquiryMeasurement.test.tsx`, `src/test/consentSignals.test.tsx`, `src/test/rentalMetadata.test.ts`, `AGENTS.md`, `roadmap.md`, `docs/seo-keyword-mapping.md`, this document.

## Remaining gaps
1. Persistent attribution in leads and the Sender/ Centro Operativo importer is unsupported/unverified for the exact reasons above.
2. Live event receipt, actual email arrival and external CRM read-back were not tested (no live leads/emails authorized).
3. Google indexing/ranking remains external and pending; source changes require separate publication.