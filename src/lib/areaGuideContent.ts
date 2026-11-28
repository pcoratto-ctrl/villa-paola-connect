import { SITE_ORIGIN, type PublicLocale } from "./publicVillaContent";

const VILLA_ORIGIN = "Villa Paola Caposuvero, SS18, Contrada Caposuvero 6, Gizzeria Lido, Calabria, Italy";

const mapsDir = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(VILLA_ORIGIN)}&destination=${encodeURIComponent(destination)}`;

export type AreaPlaceId = "terme-caronte" | "fiumefreddo-bruzio" | "cantine-benvenuto" | "kitesurf-gizzeria";

export interface AreaGuidePlace {
  id: AreaPlaceId;
  name: string;
  locality: string;
  category: string;
  roadDistance: string;
  paragraphs: readonly string[];
  ownerNote?: { label: string; quote: string };
  officialUrl: string;
  officialLabel: string;
  mapsUrl: string;
  mapsLabel: string;
}

export interface AreaGuidePageContent {
  locale: PublicLocale;
  path: string;
  language: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  mapSection: {
    title: string;
    caption: string;
    note: string;
    villaLabel: string;
    seaLabel: string;
  };
  places: readonly AreaGuidePlace[];
  villaLinksTitle: string;
  villaLinksIntro: string;
  villaLinks: readonly { to: string; label: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  homeHref: string;
  homeLabel: string;
  privacy: string;
  cookies: string;
  terms: string;
}

export const areaGuideContent: Record<PublicLocale, AreaGuidePageContent> = {
  it: {
    locale: "it",
    path: "/esperienze-dintorni",
    language: "Italiano",
    title: "Cosa vedere vicino a Gizzeria | Villa Paola",
    description: "Quattro idee nei dintorni di Gizzeria e Villa Paola Caposuvero: Terme Caronte, Fiumefreddo Bruzio, Cantine Benvenuto e kitesurf a Gizzeria, con mappe e fonti ufficiali.",
    eyebrow: "Villa Paola Caposuvero · Dintorni di Gizzeria",
    h1: "Cosa vedere vicino a Gizzeria",
    intro: "Soggiornare a Villa Paola Caposuvero permette di alternare le giornate in giardino e davanti al mare con brevi uscite tra costa tirrenica ed entroterra calabrese. Qui trovi quattro tappe reali nei dintorni di Gizzeria — tra terme, borghi, vino e sport d’acqua — con collegamenti ai siti ufficiali per verificare aperture e dettagli prima di partire.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Esperienze nei dintorni",
    mapSection: {
      title: "Orientarsi tra costa ed entroterra",
      caption: "Mappa illustrativa dell’area · non in scala",
      note: "Distanze stradali indicative da SS18, Contrada Caposuvero 6, Gizzeria Lido; i percorsi dipendono dalla viabilità. Usa i link Mappa per la navigazione.",
      villaLabel: "Villa Paola · Gizzeria",
      seaLabel: "Mar Tirreno",
    },
    places: [
      {
        id: "terme-caronte",
        name: "Terme Caronte",
        locality: "Lamezia Terme",
        category: "Tradizione termale e relax",
        roadDistance: "circa 14 km",
        paragraphs: [
          "Nell’entroterra di Lamezia Terme, le Terme Caronte custodiscono una lunga tradizione termale. La piscina termale all’aperto, immersa nel verde, offre una pausa tranquilla lontana dal ritmo della costa.",
          "È una tappa semplice da abbinare al soggiorno in villa per qualche ora di relax. Periodi di apertura e modalità di accesso cambiano durante l’anno: verificali sempre sul sito ufficiale.",
        ],
        officialUrl: "https://www.termecaronte.it/piscina",
        officialLabel: "Scopri il luogo",
        mapsUrl: mapsDir("Terme Caronte, Lamezia Terme, Calabria, Italy"),
        mapsLabel: "Mappa",
      },
      {
        id: "fiumefreddo-bruzio",
        name: "Fiumefreddo Bruzio",
        locality: "Costa tirrenica cosentina",
        category: "Borgo storico sul mare",
        roadDistance: "circa 36 km",
        paragraphs: [
          "Risalendo la costa verso nord si incontra Fiumefreddo Bruzio, tra I Borghi più Belli d’Italia. Il centro storico sorge su un’altura, con vicoli raccolti e affacci aperti sul Mar Tirreno.",
          "Si presta a una passeggiata senza fretta nel tardo pomeriggio, per godersi l’atmosfera del borgo e fermarsi a cena prima di rientrare verso Gizzeria.",
        ],
        ownerNote: {
          label: "Nota del proprietario · Roberto",
          quote: "«Ci piace per il centro storico e gli affacci sulla costa. Tra i nostri suggerimenti a tavola, Il Convivio per la tipica frittata di patate senza uova e la braceria DiVino per i tagli di carne.»",
        },
        officialUrl: "https://calabriastraordinaria.it/idee-di-viaggio/nel-borgo-di-fiumefreddo-bruzio-tra-i-borghi-piu-belli-ditalia",
        officialLabel: "Scopri il luogo",
        mapsUrl: mapsDir("Fiumefreddo Bruzio, Calabria, Italy"),
        mapsLabel: "Mappa",
      },
      {
        id: "cantine-benvenuto",
        name: "Cantine Benvenuto",
        locality: "Francavilla Angitola",
        category: "Vino e territorio",
        roadDistance: "circa 38 km",
        paragraphs: [
          "Sulle colline di Francavilla Angitola, Cantine Benvenuto nasce dal ritorno di Giovanni Benvenuto alle terre del nonno, con un lavoro dedicato al vitigno Zibibbo e ai vini calabresi.",
          "È un riferimento concreto per scoprire la Calabria attraverso la sua tradizione vitivinicola. Eventuali visite vanno verificate direttamente con la cantina tramite i canali ufficiali.",
        ],
        officialUrl: "https://cantinebenvenuto.it/",
        officialLabel: "Scopri il luogo",
        mapsUrl: mapsDir("Cantine Benvenuto, Francavilla Angitola, Calabria, Italy"),
        mapsLabel: "Mappa",
      },
      {
        id: "kitesurf-gizzeria",
        name: "Kitesurf a Gizzeria · Hang Loose Beach",
        locality: "Gizzeria Lido",
        category: "Sport sul litorale",
        roadDistance: "circa 5 km",
        paragraphs: [
          "Il litorale di Gizzeria è uno spot noto per il kitesurf, con Hang Loose Beach come punto di riferimento dedicato. Le condizioni dipendono dal vento termico e restano variabili di giorno in giorno.",
          "Anche da spettatori, le vele sul mare raccontano la vocazione sportiva della costa. La pratica si svolge negli spazi dello spot — non dalla spiaggia di Villa Paola — e ogni dettaglio va verificato con la struttura.",
        ],
        officialUrl: "https://hangloosebeach.it/kitesurf/",
        officialLabel: "Scopri il luogo",
        mapsUrl: mapsDir("Hang Loose Beach, Gizzeria, Calabria, Italy"),
        mapsLabel: "Mappa",
      },
    ],
    villaLinksTitle: "Approfondisci il soggiorno a Villa Paola",
    villaLinksIntro: "La villa è la tua base fronte mare a uso esclusivo, con tre camere, giardino e accesso diretto alla spiaggia.",
    villaLinks: [
      { to: "/villa-sul-mare-calabria", label: "Villa sul mare in Calabria" },
      { to: "/casa-vacanze-gizzeria", label: "Casa vacanze a Gizzeria" },
      { to: "/vacanze-settembre-calabria", label: "Vacanze a settembre in Calabria" },
      { to: "/", label: "Torna alla home di Villa Paola" },
    ],
    ctaTitle: "Verifica la disponibilità della villa",
    ctaText: "Le visite nei dintorni si organizzano direttamente con i rispettivi gestori. Per soggiornare a Villa Paola Caposuvero, invia le tue date: il titolare risponderà con disponibilità e preventivo.",
    ctaButton: "Richiedi disponibilità per la villa",
    homeHref: "/",
    homeLabel: "Scopri Villa Paola",
    privacy: "Privacy",
    cookies: "Cookie",
    terms: "Condizioni",
  },
  en: {
    locale: "en",
    path: "/en/things-to-do-near-gizzeria",
    language: "English",
    title: "Things to Do near Gizzeria, Calabria | Villa Paola",
    description: "Four places to explore near Gizzeria and Villa Paola Caposuvero: Terme Caronte, Fiumefreddo Bruzio, Cantine Benvenuto and kitesurfing in Gizzeria, with maps and official links.",
    eyebrow: "Villa Paola Caposuvero · Around Gizzeria",
    h1: "Things to do near Gizzeria, Calabria",
    intro: "Staying at Villa Paola Caposuvero makes it easy to balance quiet days in the garden and by the sea with short outings along Calabria’s Tyrrhenian coast and inland hills. Below are four genuine places to explore near Gizzeria — covering thermal baths, a hilltop village, local wine and kitesurfing — with official links so you can check seasonal details before heading out.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Things to do near Gizzeria",
    mapSection: {
      title: "Between coast and hills",
      caption: "Illustrative area map · not to scale",
      note: "Indicative road distances from SS18, Contrada Caposuvero 6, Gizzeria Lido; actual routes depend on traffic and road choice. Use the Map links for navigation.",
      villaLabel: "Villa Paola · Gizzeria",
      seaLabel: "Tyrrhenian Sea",
    },
    places: [
      {
        id: "terme-caronte",
        name: "Terme Caronte",
        locality: "Lamezia Terme",
        category: "Thermal tradition & relaxation",
        roadDistance: "approx. 14 km",
        paragraphs: [
          "Set inland near Lamezia Terme, Terme Caronte is rooted in a long local thermal tradition. Its outdoor thermal pool sits amid mature trees, offering a calm setting for a few unhurried hours away from the shoreline.",
          "It pairs well with a stay at the villa whenever you feel like a slower afternoon surrounded by greenery. Because seasonal opening periods and access rules can vary across the year, check the official website before planning a visit.",
        ],
        officialUrl: "https://www.termecaronte.it/piscina",
        officialLabel: "Visit official site",
        mapsUrl: mapsDir("Terme Caronte, Lamezia Terme, Calabria, Italy"),
        mapsLabel: "Map",
      },
      {
        id: "fiumefreddo-bruzio",
        name: "Fiumefreddo Bruzio",
        locality: "Northern Tyrrhenian coast",
        category: "Hilltop historic village",
        roadDistance: "approx. 36 km",
        paragraphs: [
          "Heading north along the coast brings you to Fiumefreddo Bruzio, listed among I Borghi più Belli d’Italia. The old town sits on a hillside with narrow lanes, stone squares and open views across the Tyrrhenian Sea.",
          "It lends itself to an unhurried late-afternoon walk through the historic centre, taking in the coastal views and staying for dinner before driving back towards Gizzeria.",
        ],
        ownerNote: {
          label: "Owner’s note · Roberto",
          quote: "“We love it for the historic centre and the views over the coast. Among our suggestions for a meal are Il Convivio for the traditional eggless potato frittata, and the DiVino steakhouse for cuts of meat.”",
        },
        officialUrl: "https://calabriastraordinaria.it/idee-di-viaggio/nel-borgo-di-fiumefreddo-bruzio-tra-i-borghi-piu-belli-ditalia",
        officialLabel: "Visit official site",
        mapsUrl: mapsDir("Fiumefreddo Bruzio, Calabria, Italy"),
        mapsLabel: "Map",
      },
      {
        id: "cantine-benvenuto",
        name: "Cantine Benvenuto",
        locality: "Francavilla Angitola",
        category: "Local wine & vineyards",
        roadDistance: "approx. 38 km",
        paragraphs: [
          "In the hills of Francavilla Angitola, Cantine Benvenuto grew out of Giovanni Benvenuto’s return to the land his grandfather farmed, focusing on the Zibibbo grape alongside wines rooted in the surrounding area.",
          "For travellers interested in Calabrian viticulture, it offers a grounded look at local winemaking within driving reach of the coast. Check directly with the winery via its official channels regarding visits and availability.",
        ],
        officialUrl: "https://cantinebenvenuto.it/",
        officialLabel: "Visit official site",
        mapsUrl: mapsDir("Cantine Benvenuto, Francavilla Angitola, Calabria, Italy"),
        mapsLabel: "Map",
      },
      {
        id: "kitesurf-gizzeria",
        name: "Kitesurfing in Gizzeria · Hang Loose Beach",
        locality: "Gizzeria Lido",
        category: "Coastal wind sport",
        roadDistance: "approx. 5 km",
        paragraphs: [
          "The Gizzeria shoreline is a well-known kitesurfing spot, with Hang Loose Beach as its dedicated local hub. Sessions depend on the area’s thermal breeze and variable daily sea and wind conditions.",
          "Even if you prefer watching from the shore, seeing kites on the water introduces a lively side of the coast. Kitesurfing takes place at dedicated coastal spots rather than from Villa Paola’s beach, and any questions on access or lessons should go directly to the centre.",
        ],
        officialUrl: "https://hangloosebeach.it/kitesurf/",
        officialLabel: "Visit official site",
        mapsUrl: mapsDir("Hang Loose Beach, Gizzeria, Calabria, Italy"),
        mapsLabel: "Map",
      },
    ],
    villaLinksTitle: "Explore your stay at Villa Paola",
    villaLinksIntro: "Use the whole seafront villa as your private base in Gizzeria, with three bedrooms, a garden and direct beach access.",
    villaLinks: [
      { to: "/en/beachfront-villa-calabria", label: "Beachfront villa rental in Calabria" },
      { to: "/en/villa-direct-beach-access-calabria", label: "Villa with direct beach access" },
      { to: "/en/calabria-spring-autumn-holidays", label: "Spring & autumn holidays in Calabria" },
      { to: "/?lang=en", label: "Back to Villa Paola home" },
    ],
    ctaTitle: "Check availability for Villa Paola",
    ctaText: "Local outings are arranged independently with each venue. To plan your stay at Villa Paola Caposuvero, send your preferred dates using the enquiry form for a personalised villa quote.",
    ctaButton: "Check availability & request a quote",
    homeHref: "/?lang=en",
    homeLabel: "Explore Villa Paola",
    privacy: "Privacy",
    cookies: "Cookies",
    terms: "Terms",
  },
};

export const areaGuideAlternates = [
  { lang: "it", href: SITE_ORIGIN + areaGuideContent.it.path },
  { lang: "en", href: SITE_ORIGIN + areaGuideContent.en.path },
] as const;

export function areaGuideStructuredData(locale: PublicLocale) {
  const c = areaGuideContent[locale];
  const url = SITE_ORIGIN + c.path;
  const homeUrl = locale === "en" ? `${SITE_ORIGIN}/?lang=en` : `${SITE_ORIGIN}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: c.title,
        description: c.description,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website`, name: "Villa Paola Caposuvero", url: `${SITE_ORIGIN}/` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.breadcrumbHome, item: homeUrl },
          { "@type": "ListItem", position: 2, name: c.breadcrumbCurrent, item: url },
        ],
      },
    ],
  };
}