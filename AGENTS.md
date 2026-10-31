# Project conventions
- Public routes own their canonical URL and localized metadata through react-helmet-async; index.html retains sitewide social fallbacks but no static canonical, preventing duplicate route canonicals.
- Keep the existing static sitemap mechanism and exclude admin routes; update its entries whenever public indexable routes change.