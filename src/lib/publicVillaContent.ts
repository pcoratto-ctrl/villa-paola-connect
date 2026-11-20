export const SITE_ORIGIN = "https://villapaolacaposuvero.it";
export const villaFacts = { bedrooms: 3, maxGuests: 6 } as const;
export type PublicLocale = "it" | "de" | "en";

export const publicVillaContent = {
  it: {
    path: "/villa-sul-mare-calabria", language: "Italiano",
    title: "Villa sul mare in Calabria | Villa Paola Caposuvero",
    description: "Villa Paola a Gizzeria: una villa intera fronte mare, accesso diretto alla spiaggia, giardino e veranda coperta. 3 camere, fino a 6 ospiti. Richiedi le date.",
    h1: "Una villa tutta tua, sul mare in Calabria",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "Il giardino davanti al mare, la veranda dove ritrovarsi e la spiaggia raggiungibile direttamente dalla proprietà. Villa Paola è una casa da vivere insieme: l’intera villa, con tre camere da letto e spazio per un massimo di sei ospiti, a Gizzeria, sulla costa tirrenica della Calabria.",
    cta: "Richiedi disponibilità", whatsapp: "Scrivici su WhatsApp", home: "Scopri Villa Paola", privacy: "Privacy", cookies: "Cookie", terms: "Condizioni",
    imageAlt: "Giardino di Villa Paola Caposuvero affacciato sul mare a Gizzeria",
    sections: [
      { title: "Dal giardino alla spiaggia", text: "L’accesso diretto alla spiaggia permette di passare dalla casa al mare senza attraversare la strada. Il giardino e la veranda coperta sono parte della vita quotidiana della villa: una colazione all’aperto, un libro all’ombra, una cena con vista sull’orizzonte. Non si tratta di una camera in una struttura condivisa, ma di una villa intera per il tuo soggiorno." },
      { title: "Tre camere, una casa per stare insieme", text: "La villa dispone di tre camere da letto, due bagni e una cucina attrezzata, su circa 120 m². Ospita fino a sei persone: una soluzione per famiglie, coppie che viaggiano insieme e piccoli gruppi che desiderano condividere la casa mantenendo i propri spazi. Le fotografie mostrano gli ambienti reali e gli esterni della proprietà." },
      { title: "Primavera e autunno, con i tuoi ritmi", text: "Un soggiorno al mare non deve ruotare soltanto attorno ai bagni. In primavera e in autunno puoi organizzare passeggiate sulla costa, pranzi in veranda e giornate dedicate alla scoperta della Calabria. Il tempo e le condizioni del mare variano: chiedici informazioni per le date che hai in mente, senza aspettative di sole garantito o servizi stagionali sempre aperti." },
      { title: "Gizzeria, tra costa e itinerari in Calabria", text: "Villa Paola si trova a Caposuvero, a Gizzeria Lido, a circa 15 minuti in auto dall’aeroporto di Lamezia Terme, secondo il traffico. La posizione permette di alternare giornate in villa a escursioni lungo la costa e nell’entroterra. Prima di partire, possiamo aiutarti a chiarire l’arrivo e le esigenze del tuo gruppo." },
      { title: "Un preventivo per le tue date", text: "Indica arrivo, partenza e numero di ospiti nel modulo. Il titolare risponderà con disponibilità e un preventivo personalizzato. L’invio non è una prenotazione: date, condizioni e prezzo devono essere confermati direttamente. Per una domanda iniziale puoi anche scriverci su WhatsApp." },
    ],
  },
  de: {
    path: "/de/ferienvilla-am-meer-kalabrien", language: "Deutsch",
    title: "Ferienvilla direkt am Meer in Kalabrien | Villa Paola",
    description: "Ein ganzes Ferienhaus am Meer in Kalabrien: Villa Paola in Gizzeria mit direktem Strandzugang, Garten und überdachter Veranda. 3 Schlafzimmer, bis zu 6 Gäste.",
    h1: "Ferienvilla direkt am Meer in Kalabrien",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "Morgens im Garten aufs Meer schauen, gemeinsam auf der überdachten Veranda frühstücken und von der Unterkunft direkt zum Strand gehen. In der Villa Paola gehört das ganze Ferienhaus zu Ihrem Aufenthalt: drei Schlafzimmer für bis zu sechs Gäste, an der tyrrhenischen Küste bei Gizzeria.",
    cta: "Verfügbarkeit anfragen", whatsapp: "Auf WhatsApp schreiben", home: "Villa Paola entdecken", privacy: "Datenschutz (Englisch)", cookies: "Cookies (Englisch)", terms: "Bedingungen (Englisch)",
    imageAlt: "Der Garten der Villa Paola Caposuvero mit Blick auf das Meer bei Gizzeria",
    sections: [
      { title: "Vom eigenen Garten direkt zum Strand", text: "Von der Villa aus gelangen Sie direkt zum Strand, ohne eine Straße überqueren zu müssen. Der Garten und die überdachte Veranda erweitern den Wohnraum nach draußen: für ein Frühstück mit Meerblick, eine Lesepause im Schatten oder einen gemeinsamen Abend. Sie buchen kein einzelnes Zimmer, sondern wohnen als Familie oder kleine Gruppe im ganzen Haus." },
      { title: "Platz für gemeinsame Tage – und Rückzug", text: "Auf rund 120 m² bietet die Villa drei Schlafzimmer, zwei Badezimmer und eine ausgestattete Küche. Bis zu sechs Gäste finden hier Platz. Das passt zu Familien ebenso wie zu Paaren, die gemeinsam reisen und trotzdem getrennte Schlafzimmer schätzen. Die Bilder auf dieser Seite zeigen die tatsächliche Villa und ihre Außenbereiche." },
      { title: "Kalabrien im Frühling und Herbst erleben", text: "Auch abseits des Hochsommers lässt sich ein Aufenthalt am Meer nach den eigenen Vorstellungen gestalten: mit Spaziergängen an der Küste, Mahlzeiten auf der Veranda und Ausflügen ins Hinterland. Wetter und Meer können wechselhaft sein; Badewetter ist nicht garantiert. Fragen Sie für Ihren Reisezeitraum auch nach der saisonalen Öffnung von Angeboten in der Umgebung." },
      { title: "Gizzeria als Ausgangspunkt", text: "Die Villa liegt in Caposuvero bei Gizzeria Lido an Kalabriens Westküste. Vom Flughafen Lamezia Terme sind es je nach Verkehr ungefähr 15 Minuten mit dem Auto. So können Sie ruhige Tage im Haus mit Erkundungen entlang der Küste und im Landesinneren verbinden. Fragen zur Anreise und zu den Bedürfnissen Ihrer Reisegruppe klären Sie direkt mit dem Eigentümer." },
      { title: "Ihr Aufenthalt beginnt mit einer Anfrage", text: "Teilen Sie uns Anreise, Abreise und die Zahl der Gäste mit. Sie erhalten eine persönliche Antwort zur Verfügbarkeit und ein Angebot für Ihre Reisedaten. Das Formular löst keine verbindliche Buchung aus; Preis, Termine und Bedingungen werden direkt bestätigt. Für erste Fragen erreichen Sie uns auch über WhatsApp." },
    ],
  },
  en: {
    path: "/en/beachfront-villa-calabria", language: "English",
    title: "Beachfront villa in Calabria | Villa Paola Caposuvero",
    description: "Stay in a whole beachfront villa in Gizzeria, Calabria, with direct beach access, a garden and covered veranda. Three bedrooms for up to six guests. Enquire directly.",
    h1: "Your own beachfront villa in Calabria",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "A garden overlooking the sea, breakfast on the covered veranda, and a direct path from the property to the beach. Villa Paola is a whole home for time together: three bedrooms for up to six guests on Calabria’s Tyrrhenian coast, in Gizzeria.",
    cta: "Enquire about availability", whatsapp: "Message us on WhatsApp", home: "Explore Villa Paola", privacy: "Privacy", cookies: "Cookies", terms: "Terms",
    imageAlt: "The garden of Villa Paola Caposuvero overlooking the sea in Gizzeria",
    sections: [
      { title: "From the garden straight to the beach", text: "Direct beach access means there is no road to cross between the property and the shore. The garden and covered veranda make outdoor living part of your stay: breakfast with a sea view, a quiet afternoon with a book, or dinner together as the light changes. This is an entire villa for your group, not a room in shared accommodation." },
      { title: "A whole home, with room for everyone", text: "The villa has three bedrooms, two bathrooms and an equipped kitchen across approximately 120 m². With space for up to six guests, it suits families, couples travelling together and small groups who want shared meals and separate bedrooms. The photographs show the actual property, its rooms and outdoor spaces." },
      { title: "Spring and autumn at a gentler pace", text: "A coastal stay does not have to be all about swimming. In spring and autumn, you can plan walks along the shore, lunches on the veranda and days exploring Calabria’s towns and countryside. Weather and sea conditions vary, and swimming weather is not guaranteed. Ask about your dates and the seasonal opening of nearby services before making plans." },
      { title: "Gizzeria, within reach of Lamezia Terme", text: "Villa Paola is in Caposuvero, Gizzeria Lido, on Calabria’s west coast. Lamezia Terme Airport is approximately a 15-minute drive away, depending on traffic. The location lets you combine days at the villa with trips along the coast and inland. You can discuss arrival arrangements and your group’s needs directly with the owner." },
      { title: "A personal quote for your stay", text: "Send your arrival and departure dates and the number of guests using the enquiry form. The owner will reply with availability and a personalised quote. Submitting the form does not book the villa: dates, price and conditions must be confirmed directly. You can also message us on WhatsApp with an initial question." },
    ],
  },
} satisfies Record<PublicLocale, { path: string; language: string; title: string; description: string; h1: string; eyebrow: string; intro: string; cta: string; whatsapp: string; home: string; privacy: string; cookies: string; terms: string; imageAlt: string; sections: { title: string; text: string }[] }>;

export const publicAlternates = Object.entries(publicVillaContent).map(([lang, content]) => ({ lang, href: SITE_ORIGIN + content.path }));
export function villaStructuredData(locale: PublicLocale) {
  const content = publicVillaContent[locale];
  return { "@context": "https://schema.org", "@type": "LodgingBusiness", "@id": SITE_ORIGIN + "/#villa", name: "Villa Paola Caposuvero", url: SITE_ORIGIN + content.path, description: content.description, image: SITE_ORIGIN + "/images/villa-paola-restyle/hero-giardino-mare-desktop.webp", telephone: "+393355384250", containsPlace: { "@type": "Accommodation", name: "Villa Paola Caposuvero", numberOfBedrooms: villaFacts.bedrooms, occupancy: { "@type": "QuantitativeValue", maxValue: villaFacts.maxGuests } }, address: { "@type": "PostalAddress", streetAddress: "SS18, Contrada Caposuvero 31", addressLocality: "Gizzeria Lido", addressRegion: "Calabria", addressCountry: "IT" } };
}