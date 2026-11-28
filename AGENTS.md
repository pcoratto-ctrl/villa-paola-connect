# Project conventions
- English topic pages share the public article and static renderer through a topic catalog; only genuinely equivalent localized pages receive hreflang, preventing unrelated pages from being paired.
- English opening-photo availability links use a shared SSR-safe component so React and static public HTML keep the same accessible request action.
- Public routes own their canonical URL and localized metadata through react-helmet-async; index.html retains sitewide social fallbacks but no static canonical, preventing duplicate route canonicals.
- Public SEO HTML is emitted at build time by the Vite static-public plugin using shared localized content; private shells get noindex and no backend data is rendered, preserving the client-side access controls.
- The static-public renderer inherits the resolved app root and import aliases so shared design-system dependencies resolve identically during prerendering.
- Stable commercial language URLs own their language independently of stored preferences; translated counterparts share reciprocal hreflang, while legacy Italian routes retain their URLs.
- Keep localized airport directions in the shared commercial article using the existing property address and official airport source; avoid duplicated city landing pages or hardcoded flight schedules that become stale.
- Keep the existing static sitemap mechanism and exclude admin routes; update its entries whenever public indexable routes change.- Restyle media lives in public/images/villa-paola-restyle and is referenced by path; videos load only on tap via VideoOnDemand to keep mobile fast.

- Partner calendar data comes only from the external Centro operativo via backend functions (partner-*) that whitelist fields; never store rates/availability locally or expose upstream credentials to the browser.
- Keep gallery selection, categories and intrinsic image dimensions in a shared catalog; the homepage preview and interior links open the same accessible gallery without extending the homepage.
- Enquiry measurement uses one analytics-purpose consent module with early worldwide Consent Mode defaults, GPC and sanitized in-memory attribution; call native events at existing handlers, never replay pre-consent custom actions or add attribution to an unsupported lead/export schema.
- Require a valid saved-lead acknowledgement before displaying success or measuring conversion, and synchronously guard duplicate submissions; a resolved transport or email status alone does not prove a saved request.
- Lovable hosting has no path-level HTTP 301/308 config; consolidate legacy URLs like `/it/home` via crawlable static HTML with canonical `/` and instant meta refresh plus React `<Navigate to="/" replace />`, never `robots.txt` Disallow or `noindex`.
- Arrival diagrams share an SSR-safe IT/EN SVG component with explicit illustrative labels and no routing API; schematic curves must never be presented as verified roads, and reduced motion disables playback. Render both fixed-origin maps with independent playback state and unique SVG descriptions in one shared section.
