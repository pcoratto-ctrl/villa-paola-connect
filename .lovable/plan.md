## Obiettivo
Restyle visivo verso la direzione Claude (cream/sand + teal profondo, serif italico, accenti terracotta + ottone, immagini a maschera arco, statistiche editoriali, divider sottili) sul sito attuale, **senza toccare** logica, dati, routing o backend.

## 1. Palette definitiva (valori esatti mockup)
Convertiti in HSL per i token di `src/index.css`:

- **Background cream** `#F6F1E7` → `hsl(39 47% 94%)`
- **Surface sand** `#EBD9C4` → `hsl(32 46% 84%)`
- **Primary teal profondo** `#123E42` → `hsl(185 57% 17%)`
- **Accent terracotta** `#C0674A` → `hsl(14 47% 52%)` (eyebrow, quote glifi, evidenze)
- **Sage muted** `#5E645D` → `hsl(108 4% 38%)` (testi soft, icone lineari)
- **Ottone** `#B0894F` → `hsl(38 40% 50%)` (linee, hover, numeri statistica, underline)

Foreground testo forte resta un near-black leggermente caldo su cream, primary-foreground = cream.
Aggiungo il token `--villa-brass` e `--villa-terracotta` in `index.css` e le voci corrispondenti in `tailwind.config.ts`.

## 2. Forma: NIENTE pillole
- Tutti i bottoni e CTA passano da `rounded-full` a `rounded-[4px]` (mai 999px).
- Label CTA in **UPPERCASE** con `tracking-[0.12em]` e peso medium.
- I chip informativi ("Accesso diretto alla spiaggia", "Vista mare", "Ideale per famiglie", "Animali ammessi") sono **a spigolo** (`rounded-none` o `rounded-[2px]`) con **bordo 1px** sottile ottone/sage su fondo cream, testo teal. Nessun fondo colorato pieno.

## 3. File che TOCCHERÒ (solo presentazione)
- `src/index.css` — nuovi valori HSL token + nuovi token `--villa-terracotta`, `--villa-brass`. Nessun rename.
- `tailwind.config.ts` — aggiungo `villa.terracotta` e `villa.brass`.
- `src/components/HeroSection.tsx` — micro-styling (eyebrow tracciato, italico sul secondo verso), bottoni a radius 4px + label uppercase tracciato. Stesso layout split, stessi asset, stessi link.
- `src/components/RecensioniHighlight.tsx` — card grande sage muted, quote-glifo terracotta, eyebrow terracotta, rating in colonna destra. Zero cambi ai link Facebook/Google.
- `src/components/VillaSection.tsx` — immagine con maschera arco, chip a spigolo con bordo, griglia 4 statistiche con numeri serif oversize in ottone.
- `src/components/PerchéSection.tsx` — lista con divider 1px + icone lineari sage.
- `src/components/ServiziSection.tsx` — stesso ritmo tipografico (eyebrow terracotta, italico sul frammento chiave, divider).
- `src/components/GalleriaSection.tsx`, `PosizioneSection.tsx`, `FaqSection.tsx`, `ContattiSection.tsx`, `CtaSection.tsx`, `Footer.tsx`, `Navbar.tsx`, `MobileCta.tsx` — solo coerenza (colori, tipografia, radius bottoni, tracking).
- `src/components/DisponibilitaSection.tsx` — **solo presentazione**: colori, spaziature, radius bottone 4px, stile campi (bordo 1px sage su cream, focus ring teal), tipografia. **Nessuna modifica** a validazione, honeypot, `useSubmitLead`, `onSubmit`, stato, messaggi, campi, ordine campi.
- `src/i18n/translations.ts` — **solo** uniformo la label CTA primaria ("Verifica disponibilità" / "Check availability") ovunque venga usata dai componenti tradotti. Nessun'altra modifica alle stringhe.

## 4. File che NON TOCCHERÒ
- `src/hooks/useLeads.ts`, `useReviews.ts`, `useAuth.ts`.
- `src/integrations/supabase/*` (auto-gen).
- `supabase/**` (config, edge functions, mcp).
- `src/contexts/LanguageContext.tsx` (logica i18n intatta).
- `src/App.tsx` e tutte le rotte, `src/pages/Admin*`, pagine legali, `SeoPages` routing.
- `.env`, `index.html`, `sitemap.xml`, `robots.txt`.
- Tutti gli asset immagine esistenti.
- Nessuna modifica alla logica del form disponibilità (solo skin visiva).

## 5. Approccio incrementale
1. **Step 1 — Token colore**: aggiorno `index.css` (nuovi HSL esatti + `terracotta` + `brass`) e `tailwind.config.ts`. Verifica che le sezioni non ancora toccate restino leggibili.
2. **Step 2 — Hero + Recensioni**: sopra la piega, massimo impatto. Hero resta split con micro-styling (full-bleed cinematografico rimandato a step futuro separato).
3. **Step 3 — Villa + Perché + Servizi**: ritmo editoriale, chip a spigolo, statistiche ottone, divider.
4. **Step 4 — Galleria + Posizione + FAQ + Contatti + CTA + Footer**: rifinitura coerente.
5. **Step 5 — Navbar + MobileCta + skin del Form Disponibilità** (senza toccare logica).
6. **QA finale**: screenshot Playwright desktop 1280 e mobile 390, controllo contrasto AA sulle label terracotta/ottone su cream, test manuale submit del form (deve funzionare identico a prima), check console e link.

Ogni step compila e resta pubblicabile da solo.

## 6. Rischi
- **Form disponibilità**: rischio contenuto — tocco solo classi Tailwind di presentazione, non `<form>`, non `onSubmit`, non validazione, non honeypot, non hook. QA post-step 5 con submit reale di prova.
- **Supabase / email**: nessuno, non tocco hook, client, edge functions né env.
- **i18n**: rischio minimo — solo uniformazione di una label CTA in `translations.ts`. `LanguageContext` intatto.
- **Contrasto/accessibilità**: teal `#123E42` su cream `#F6F1E7` = AAA. Terracotta `#C0674A` e ottone `#B0894F` su cream vanno usati solo per eyebrow/label maiuscoletto (large/decorative) o come accenti su testo grande — verifico AA large text; per body text uso sempre teal o near-black.
- **Routing/SEO**: zero cambi.

## 7. Conferma dei 5 punti richiesti
1. Palette esatta con HSL derivati dai valori mockup + token `terracotta` + `brass`: **ok**.
2. Niente pillole: radius 4px sui bottoni, chip a spigolo con bordo 1px, label CTA UPPERCASE + tracking: **ok**.
3. Form disponibilità: solo skin visiva, logica/validation/honeypot/Supabase/hook intatti: **ok**.
4. `translations.ts`: micro-modifica autorizzata SOLO per uniformare le label CTA primarie: **ok**.
5. Hero: split con micro-styling ora, full-bleed cinematografico come step futuro separato: **ok**.

Confermi e procedo con lo Step 1?
