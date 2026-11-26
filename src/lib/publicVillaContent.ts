export const SITE_ORIGIN = "https://villapaolacaposuvero.it";
export const villaFacts = { bedrooms: 3, maxGuests: 6, bathrooms: 2, airportDriveMinutes: 15, airportCode: "SUF" } as const;
export const AIRPORT_URL = "https://sacal.it/it/lamezia-terme/";
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Villa Paola Caposuvero, SS18, Contrada Caposuvero 6, Gizzeria Lido, Calabria, Italy");
export type PublicLocale = "it" | "en";
export interface PublicFaqItem { question: string; answer: string }
export interface PublicVillaPageContent {
  path: string; language: string; title: string; description: string; h1: string; eyebrow: string; intro: string;
  cta: string; whatsapp: string; home: string; privacy: string; cookies: string; terms: string; imageAlt: string;
  arrival: { title: string; text: string; flights: string; directions: string; airport: string };
  sections: { title: string; text: string }[];
  faqTitle?: string;
  faqs?: readonly PublicFaqItem[];
}

export const publicVillaContent = {
  it: {
    path: "/villa-sul-mare-calabria", language: "Italiano",
    title: "Villa sul mare in Calabria, accesso diretto alla spiaggia | Villa Paola",
    description: "Intera villa fronte mare a uso esclusivo in Calabria, con accesso diretto alla spiaggia. Circa 15 minuti in auto da Lamezia Terme (SUF), traffico permettendo.",
    h1: "Una villa sul mare in Calabria, tutta tua",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "L’intera villa fronte mare a uso esclusivo, con accesso diretto alla spiaggia: a Gizzeria, Villa Paola offre tre camere per un massimo di sei ospiti, un giardino sul mare e una veranda coperta. L’aeroporto di Lamezia Terme (SUF) è a circa 15 minuti in auto, traffico permettendo.",
    cta: "Richiedi disponibilità", whatsapp: "Scrivici su WhatsApp", home: "Scopri Villa Paola", privacy: "Privacy", cookies: "Cookie", terms: "Condizioni",
    imageAlt: "Giardino di Villa Paola Caposuvero affacciato sul mare a Gizzeria",
    arrival: { title: "Da Lamezia Terme alla tua villa sul mare", text: "Dall’aeroporto di Lamezia Terme (SUF), Villa Paola dista circa 15 minuti in auto, traffico permettendo. La destinazione è SS18, Contrada Caposuvero 6, Gizzeria Lido. Apri le indicazioni per pianificare il percorso e scrivici prima della partenza per chiarire l’arrivo.", flights: "I voli diretti e le frequenze cambiano con la stagione. Controlla i collegamenti sul sito ufficiale SACAL e conferma con la compagnia aerea le opzioni disponibili per le tue date, prima di organizzare il soggiorno.", directions: "Indicazioni per Villa Paola", airport: "Aeroporto di Lamezia Terme · SACAL" },
    sections: [
      { title: "Dal giardino alla spiaggia", text: "L’accesso diretto alla spiaggia permette di passare dalla casa al mare senza attraversare la strada. Il giardino e la veranda coperta sono parte della vita quotidiana della villa: una colazione all’aperto, un libro all’ombra, una cena con vista sull’orizzonte. Non si tratta di una camera in una struttura condivisa, ma di una villa intera per il tuo soggiorno." },
      { title: "L’intera villa a uso esclusivo, con tre camere", text: "La villa dispone di tre camere da letto, due bagni e una cucina attrezzata, su circa 120 m². Ospita fino a sei persone: una soluzione per famiglie, coppie che viaggiano insieme e piccoli gruppi che desiderano condividere la casa mantenendo i propri spazi. Le fotografie mostrano gli ambienti reali e gli esterni della proprietà." },
      { title: "Primavera e autunno, con i tuoi ritmi", text: "Un soggiorno al mare non deve ruotare soltanto attorno ai bagni. In primavera e in autunno puoi organizzare passeggiate sulla costa, pranzi in veranda e giornate dedicate alla scoperta della Calabria. Il tempo e le condizioni del mare variano: chiedici informazioni per le date che hai in mente, senza aspettative di sole garantito o servizi stagionali sempre aperti." },
      { title: "Gizzeria, tra costa e itinerari in Calabria", text: "Villa Paola si trova a Caposuvero, a Gizzeria Lido, a circa 15 minuti in auto dall’aeroporto di Lamezia Terme, secondo il traffico. La posizione permette di alternare giornate in villa a escursioni lungo la costa e nell’entroterra. Prima di partire, possiamo aiutarti a chiarire l’arrivo e le esigenze del tuo gruppo." },
      { title: "Un preventivo per le tue date", text: "Indica arrivo, partenza e numero di ospiti nel modulo. Il titolare risponderà con disponibilità e un preventivo personalizzato. L’invio non è una prenotazione: date, condizioni e prezzo devono essere confermati direttamente. Per una domanda iniziale puoi anche scriverci su WhatsApp." },
    ],
  },
  en: {
    path: "/en/beachfront-villa-calabria", language: "English",
    title: "Beachfront Villa Rental in Calabria | Villa Paola Caposuvero",
    description: "Rent the whole beachfront Villa Paola in Calabria: 3 bedrooms, 2 bathrooms, up to 6 guests, garden, veranda and direct beach access. Request availability and a quote.",
    h1: "A beachfront villa in Calabria, all to yourselves",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "Discover a beachfront villa rental in Gizzeria, Calabria, with the entire home for your exclusive use. Villa Paola has three bedrooms and two bathrooms for up to six guests, a private garden by the sea, a covered seafront veranda and direct beach access. Lamezia Terme Airport (SUF) is about 15 minutes away by car, traffic permitting.",
    cta: "Check availability & request a quote", whatsapp: "Message us on WhatsApp", home: "Explore Villa Paola", privacy: "Privacy", cookies: "Cookies", terms: "Terms",
    imageAlt: "The garden of Villa Paola Caposuvero overlooking the sea in Gizzeria",
    arrival: { title: "From Lamezia Terme Airport to the coast", text: "Villa Paola is about 15 minutes by car from Lamezia Terme Airport (SUF), traffic permitting. Your destination is SS18, Contrada Caposuvero 6, Gizzeria Lido. Open the directions to plan your drive, and contact the owner before travelling if you need to clarify arrival arrangements.", flights: "Direct flights and frequencies vary by season. Use the official SACAL airport website as a starting point, then check with the airline for your exact travel dates before planning your stay.", directions: "Directions to Villa Paola", airport: "Lamezia Terme Airport · SACAL" },
    sections: [
      { title: "From the garden straight to the beach", text: "Move from the garden to the shore without crossing a road. The covered seafront veranda brings outdoor living into every day: breakfast overlooking the water, a quiet afternoon with a book, or dinner together as the light changes. The whole villa and its private garden are yours to enjoy throughout your stay." },
      { title: "A private seafront villa, all to yourselves", text: "Three bedrooms, two bathrooms and an equipped kitchen offer approximately 120 m² of space for up to six guests. Exclusive use makes Villa Paola a welcoming base for families, couples travelling together and small groups: shared meals in the veranda, separate bedrooms and time to settle into your own rhythm." },
      { title: "Spring and autumn at your own pace", text: "Consider May or October for a stay that combines coastal walks, lunches on the veranda and outings into Calabria’s towns and countryside. Leave room to adjust your itinerary to the forecast, and check seasonal opening hours for places you want to visit." },
      { title: "Gizzeria, within reach of Lamezia Terme", text: "Villa Paola is in Caposuvero, Gizzeria Lido, on Calabria’s west coast. Lamezia Terme Airport is approximately a 15-minute drive away, depending on traffic. The location lets you combine days at the villa with trips along the coast and inland. You can discuss arrival arrangements and your group’s needs directly with the owner." },
      { title: "A personal quote for your stay", text: "Share your arrival and departure dates and the number of guests using the enquiry form. The owner will reply with availability and a personalised quote, then confirm dates, price and conditions with you directly. Your enquiry is the first step, not an instant booking. You can also message us on WhatsApp." },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      { question: "Is Villa Paola rented as a whole villa for exclusive use?", answer: "Yes. The entire beachfront villa and its private garden are for your group alone, with three bedrooms, two bathrooms and an equipped kitchen for up to six guests." },
      { question: "Does the villa have direct beach access or a private beach?", answer: "Villa Paola has direct beach access from the garden without crossing a road. The shoreline itself is not a private beach." },
      { question: "How far is Villa Paola from Lamezia Terme Airport (SUF)?", answer: "The villa is approximately a 15-minute drive from Lamezia Terme Airport (SUF), traffic permitting." },
      { question: "What is the minimum stay and how does booking work?", answer: "The minimum stay is 7 nights unless explicitly agreed with the owner. Submitting the form sends an availability enquiry for a personalised quote rather than an instant booking; dates, price and conditions are confirmed directly." },
    ],
  },
} satisfies Record<PublicLocale, PublicVillaPageContent>;

export const publicAlternates = Object.entries(publicVillaContent).map(([lang, content]) => ({ lang, href: SITE_ORIGIN + content.path }));
export function villaStructuredData(locale: PublicLocale) {
  const content = publicVillaContent[locale];
  return { "@context": "https://schema.org", "@type": "LodgingBusiness", "@id": SITE_ORIGIN + "/#villa", name: "Villa Paola Caposuvero", url: SITE_ORIGIN + content.path, description: content.description, image: SITE_ORIGIN + "/images/villa-paola-restyle/hero-giardino-mare-desktop.webp", telephone: "+393355384250", containsPlace: { "@type": "Accommodation", name: "Villa Paola Caposuvero", numberOfBedrooms: villaFacts.bedrooms, numberOfBathroomsTotal: villaFacts.bathrooms, occupancy: { "@type": "QuantitativeValue", maxValue: villaFacts.maxGuests } }, address: { "@type": "PostalAddress", streetAddress: "SS18, Contrada Caposuvero 6", addressLocality: "Gizzeria Lido", addressRegion: "Calabria", addressCountry: "IT" } };
}