# Project conventions
- Public routes own their canonical URL and localized metadata through react-helmet-async; index.html retains sitewide social fallbacks but no static canonical, preventing duplicate route canonicals.
- Keep the existing static sitemap mechanism and exclude admin routes; update its entries whenever public indexable routes change.- Restyle media lives in public/images/villa-paola-restyle and is referenced by path; videos load only on tap via VideoOnDemand to keep mobile fast.

- Partner calendar data comes only from the external Centro operativo via backend functions (partner-*) that whitelist fields; never store rates/availability locally or expose upstream credentials to the browser.
