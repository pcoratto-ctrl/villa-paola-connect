# Restyling Villa Paola: foto e video reali

Tutti i 30 file (foto, video e copertine) sono già nella cartella del progetto. Manca solo la tabella CSV con i testi alternativi: li scriverò io a partire dal contenuto di ogni foto. Restano invariati il modulo, WhatsApp, i contatti, le recensioni, il backend, la SEO e il dominio. Non pubblico niente senza la tua approvazione.

## 1. Stile
- Colori: bianco caldo #F8F5EF, blu mediterraneo #254C5C, sabbia #C5B49A. Restano il logo e gli angoli poco arrotondati.
- Titoli in Cormorant Garamond, testi in Manrope.
- Più spazio tra le sezioni e meno riquadri e bordi. Animazioni discrete, contrasto leggibile e bordo visibile su pulsanti e link quando si naviga da tastiera.

## 2. Foto iniziale
- Computer: hero-giardino-mare-desktop, con la versione 1280 per i tablet. Inquadratura 50% / 55%.
- Telefono: hero-terrazza-mare-mobile, inquadratura 50% / 50%.
- Ombreggiatura solo sotto il testo. Titolo e pulsanti restano, spostati per non coprire il mare.
- Nessuno scorrimento automatico di foto. Solo l'immagine visibile viene caricata per prima.

## 3. La Villa
- Foto panoramica villa-esterno-panoramica subito dopo il testo introduttivo.
- I numeri restano: 120 m², 3 camere, 2 bagni, 6+ ospiti.
- Nuovo blocco ordinato "Gli ambienti" con le foto attuali di soggiorno e camera.

## 4. Nuove sezioni (dopo La Villa, prima dei Servizi)
- **Il mare, a pochi passi**: foto mare-muretto-bianco e video verticale dell'accesso al mare, intero e senza tagli. Il video parte solo toccandolo, ha i comandi e funziona su iPhone e Android. Il testo descrive i gradini e il cancello che si vedono, senza promettere spiaggia privata né accesso per tutti.
- **Vivere Villa Paola**: terrazza con pranzo vista mare, divano fronte mare, colazione e aperitivo come dettagli. Non presenta i pasti come inclusi.
- **Fascia al tramonto** (giardino-tramonto-mare) prima del pulsante finale.
- **Authentic Calabria**, vicino a Posizione: video che parte solo toccandolo, più la foto spiaggia-sole-sul-mare. Il video del giardino non lo inserisco, per non appesantire e non ripetere foto.
- Nel menu aggiungo "Il mare" ed "Esperienze". Gli altri link restano.

## 5. Galleria
- Sostituisco le foto secondo la tua tabella, aggiungo le 7 nuove e seguo il tuo ordine di 22 foto. Restano le foto attuali di soggiorno, cucina, camere e bagno.
- Le foto alternative degli interni le valuto confrontandole. Se non sono migliori, non le uso.
- In homepage mostro 9 foto con il pulsante "Scopri tutte le foto". Senza filtri.
- Ingrandimento delle foto con frecce e contatore, tasti freccia ed Esc, scorrimento col dito su telefono. Alla chiusura il cursore torna dove eri.

## 6. Velocità e controlli
- Le foto più in basso si caricano solo quando ci si arriva, con dimensioni fisse perché la pagina non si sposti. I video si caricano solo al tocco.
- Testi nuovi in italiano e inglese.
- Controllo su computer e telefono: nessun errore, link e pulsanti funzionanti, video avviabili. Poi ti mostro l'anteprima e un riepilogo.

## Da confermare prima di pubblicare
- I diritti su musica e immagini dei due video, in particolare "Authentic Calabria", che ha scritte e logo.

## Dettagli tecnici
- Hero: `<picture>` con source mobile/desktop e srcset 1280/2560, `fetchpriority="high"` solo sulla hero.
- Nuovi componenti `MareSection.tsx`, `EsperienzeSection.tsx`, `CalabriaVideo.tsx`, ordinati in `Index.tsx`. Ancore `#mare` ed `#esperienze`, voci aggiunte a `navLinks`.
- I video usano `<video controls playsInline preload="none" poster>`.
- Token in `src/index.css` e `tailwind.config.ts`. Font da Google Fonts in `index.html`.
- I vecchi asset `.asset.json` restano nel repository.
- Nuove chiavi in `src/locales/it.json` ed `en.json`.
