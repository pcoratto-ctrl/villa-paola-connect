# Come raggiungerci / Getting here

## Scope and placement
- The existing English homepage is `/?lang=en`, not a separate `/en` route or the main commercial article. Both home languages and all three English articles use one `#getting-here` diagram each; no duplicate anchor or new route is introduced.
- One shared IT/EN SVG component in the existing position area on the homepage and legacy Italian landing pages; within the existing arrival section of the Italian commercial article and three English articles.
- Same diagram/content is included in build-time public HTML on the homepage and commercial articles. No new pages, sitemap entries, marketing copy, backend changes or publication.
- Select airport or railway station, then play/pause/resume/replay a six-second car journey. Playback is user-initiated, silent and disabled with reduced motion; selecting an origin resets playback.
- Both origins show the owner-supplied approximately 15-minute drive indication, with a traffic caveat. No kilometres, realtime travel estimates or claimed verified roads.

## Geographic limits
- Existing villa embed referenced approximately 38.95496 N, 16.15359 E; the approved address remains SS18, Contrada Caposuvero 6, Gizzeria Lido.
- Airport sources place SUF approximately 38.905–38.908 N, 16.242 E: https://en.wikipedia.org/wiki/Lamezia_Terme_International_Airport and https://www.openaip.net/data/airports/62614c09cb27f4250944efb1 . Station search places Lamezia Centrale approximately 38.921 N, 16.256 E, near Sant’Eufemia.
- These references support only the broad relationship: villa northwest, station northeast of the airport, sea west of the coastal land. The diagram is explicitly illustrative and not to scale. SVG coordinates are layout units, not stored geocodes. Neither villa entrance coordinates nor driving routes have been independently surveyed or routed.
- Open-directions link reuses the existing address-based Google Maps URL. No Maps script, API, connector, Facebook embed, video, audio, downloaded media or tracking is added.

## Verification
- Follow-up: 28 tests passed across arrival controls (including reduced motion), public SEO and static renderer; automatic build OK. Ten Chromium checks cover `/`, `/?lang=en` and the three English articles at 1280px and 390px: one `#getting-here`, correct document language, visible time, play/pause and station selection, no overflow/errors and working existing enquiry anchors without submission. Four component-only IT/EN desktop/mobile screenshots were visually reviewed and supplied. No deploy or publication performed.
- Focused Vitest controls exercise both 15-minute values, six-second completion, selector reset, pause/resume/replay, initial and changed reduced-motion settings, single static diagram and unchanged canonicals.
- 67 tests passed in eight files (arrival, static renderer, public SEO, rental metadata, consent/enquiry measurement, partner calendar and iCal). Automatic preview build: `build OK` at 09:19:52 UTC on 28 November 2026.
- Chromium: ten desktop/mobile route checks (IT/EN home and three English articles), both selectors, visible origin/destination/time, no horizontal overflow or page errors. Additional 320px check with reduced motion and 390/1280px screenshots reviewed after existing entrance transitions settled.
- Real browser SVG geometry: both journeys reach the villa in six seconds, tangent rotation follows the curve, pause holds the car position, resume/replay work, selection resets the route. Reduced motion disables playback but preserves selectors and directions. Enabled playback control is unobstructed after scrolling into view; existing privacy banner and mobile enquiry bar are unchanged.
- No live lead, email, CRM operation, production publish or geographic API validation performed. Local preview screenshots verified; deployed preview-origin rendering was not independently inspected.