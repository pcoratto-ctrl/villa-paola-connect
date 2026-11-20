export const SITE_ORIGIN = "https://villapaolacaposuvero.it";
export const villaFacts = { bedrooms: 3, maxGuests: 6, airportDriveMinutes: 15, airportCode: "SUF" } as const;
export const AIRPORT_URL = "https://sacal.it/it/lamezia-terme/";
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Villa Paola Caposuvero, SS18, Contrada Caposuvero 31, Gizzeria Lido, Calabria, Italy");
export type PublicLocale = "it" | "de" | "en" | "fr";

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
    arrival: { title: "Da Lamezia Terme alla tua villa sul mare", text: "Dall’aeroporto di Lamezia Terme (SUF), Villa Paola dista circa 15 minuti in auto, traffico permettendo. La destinazione è SS18, Contrada Caposuvero 31, Gizzeria Lido. Apri le indicazioni per pianificare il percorso e scrivici prima della partenza per chiarire l’arrivo.", flights: "I voli diretti e le frequenze cambiano con la stagione. Controlla i collegamenti sul sito ufficiale SACAL e conferma con la compagnia aerea le opzioni disponibili per le tue date, prima di organizzare il soggiorno.", directions: "Indicazioni per Villa Paola", airport: "Aeroporto di Lamezia Terme · SACAL" },
    sections: [
      { title: "Dal giardino alla spiaggia", text: "L’accesso diretto alla spiaggia permette di passare dalla casa al mare senza attraversare la strada. Il giardino e la veranda coperta sono parte della vita quotidiana della villa: una colazione all’aperto, un libro all’ombra, una cena con vista sull’orizzonte. Non si tratta di una camera in una struttura condivisa, ma di una villa intera per il tuo soggiorno." },
      { title: "L’intera villa a uso esclusivo, con tre camere", text: "La villa dispone di tre camere da letto, due bagni e una cucina attrezzata, su circa 120 m². Ospita fino a sei persone: una soluzione per famiglie, coppie che viaggiano insieme e piccoli gruppi che desiderano condividere la casa mantenendo i propri spazi. Le fotografie mostrano gli ambienti reali e gli esterni della proprietà." },
      { title: "Primavera e autunno, con i tuoi ritmi", text: "Un soggiorno al mare non deve ruotare soltanto attorno ai bagni. In primavera e in autunno puoi organizzare passeggiate sulla costa, pranzi in veranda e giornate dedicate alla scoperta della Calabria. Il tempo e le condizioni del mare variano: chiedici informazioni per le date che hai in mente, senza aspettative di sole garantito o servizi stagionali sempre aperti." },
      { title: "Gizzeria, tra costa e itinerari in Calabria", text: "Villa Paola si trova a Caposuvero, a Gizzeria Lido, a circa 15 minuti in auto dall’aeroporto di Lamezia Terme, secondo il traffico. La posizione permette di alternare giornate in villa a escursioni lungo la costa e nell’entroterra. Prima di partire, possiamo aiutarti a chiarire l’arrivo e le esigenze del tuo gruppo." },
      { title: "Un preventivo per le tue date", text: "Indica arrivo, partenza e numero di ospiti nel modulo. Il titolare risponderà con disponibilità e un preventivo personalizzato. L’invio non è una prenotazione: date, condizioni e prezzo devono essere confermati direttamente. Per una domanda iniziale puoi anche scriverci su WhatsApp." },
    ],
  },
  de: {
    path: "/de/ferienvilla-am-meer-kalabrien", language: "Deutsch",
    title: "Ferienvilla direkt am Meer in Kalabrien | Villa Paola",
    description: "Ferienhaus mit direktem Strandzugang in Kalabrien, zur alleinigen Nutzung. Vom Flughafen Lamezia Terme (SUF) je nach Verkehr ca. 15 Minuten mit dem Auto.",
    h1: "Ferienvilla direkt am Meer in Kalabrien",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "Ihre Villa zur alleinigen Nutzung, direkt am Meer und mit direktem Strandzugang: In Gizzeria bietet Villa Paola drei Schlafzimmer für bis zu sechs Gäste, einen Garten mit Meerblick und eine überdachte Veranda. Vom Flughafen Lamezia Terme (SUF) erreichen Sie das Haus je nach Verkehr in etwa 15 Minuten mit dem Auto.",
    cta: "Verfügbarkeit anfragen", whatsapp: "Auf WhatsApp schreiben", home: "Villa Paola entdecken", privacy: "Datenschutz (Englisch)", cookies: "Cookies (Englisch)", terms: "Bedingungen (Englisch)",
    imageAlt: "Der Garten der Villa Paola Caposuvero mit Blick auf das Meer bei Gizzeria",
    arrival: { title: "Vom Flughafen Lamezia Terme ans Meer", text: "Die Fahrt vom Flughafen Lamezia Terme (SUF) zur Villa Paola dauert je nach Verkehr etwa 15 Minuten. Die Adresse lautet SS18, Contrada Caposuvero 31, Gizzeria Lido. Nutzen Sie die Wegbeschreibung für Ihre Anreise und klären Sie Fragen zur Ankunft vorab direkt mit dem Eigentümer.", flights: "Direktflüge und Flugfrequenzen ändern sich je nach Saison. Informieren Sie sich auf der offiziellen SACAL-Flughafenseite und prüfen Sie bei der Fluggesellschaft, welche Verbindungen für Ihre konkreten Reisedaten angeboten werden.", directions: "Wegbeschreibung zur Villa Paola", airport: "Flughafen Lamezia Terme · SACAL" },
    sections: [
      { title: "Ein Ferienhaus mit direktem Strandzugang", text: "Von der Villa aus gelangen Sie direkt zum Strand, ohne eine Straße überqueren zu müssen. Der Garten und die überdachte Veranda erweitern den Wohnraum nach draußen: für ein Frühstück mit Meerblick, eine Lesepause im Schatten oder einen gemeinsamen Abend. Sie buchen kein einzelnes Zimmer, sondern wohnen als Familie oder kleine Gruppe im ganzen Haus." },
      { title: "Platz für gemeinsame Tage – und Rückzug", text: "Auf rund 120 m² bietet die Villa drei Schlafzimmer, zwei Badezimmer und eine ausgestattete Küche. Bis zu sechs Gäste finden hier Platz. Das passt zu Familien ebenso wie zu Paaren, die gemeinsam reisen und trotzdem getrennte Schlafzimmer schätzen. Die Bilder auf dieser Seite zeigen die tatsächliche Villa und ihre Außenbereiche." },
      { title: "Kalabrien im Frühling und Herbst erleben", text: "Auch abseits des Hochsommers lässt sich ein Aufenthalt am Meer nach den eigenen Vorstellungen gestalten: mit Spaziergängen an der Küste, Mahlzeiten auf der Veranda und Ausflügen ins Hinterland. Wetter und Meer können wechselhaft sein; Badewetter ist nicht garantiert. Fragen Sie für Ihren Reisezeitraum auch nach der saisonalen Öffnung von Angeboten in der Umgebung." },
      { title: "Gizzeria als Ausgangspunkt", text: "Die Villa liegt in Caposuvero bei Gizzeria Lido an Kalabriens Westküste. Vom Flughafen Lamezia Terme sind es je nach Verkehr ungefähr 15 Minuten mit dem Auto. So können Sie ruhige Tage im Haus mit Erkundungen entlang der Küste und im Landesinneren verbinden. Fragen zur Anreise und zu den Bedürfnissen Ihrer Reisegruppe klären Sie direkt mit dem Eigentümer." },
      { title: "Ihr Aufenthalt beginnt mit einer Anfrage", text: "Teilen Sie uns Anreise, Abreise und die Zahl der Gäste mit. Sie erhalten eine persönliche Antwort zur Verfügbarkeit und ein Angebot für Ihre Reisedaten. Das Formular löst keine verbindliche Buchung aus; Preis, Termine und Bedingungen werden direkt bestätigt. Für erste Fragen erreichen Sie uns auch über WhatsApp." },
    ],
  },
  en: {
    path: "/en/beachfront-villa-calabria", language: "English",
    title: "Beachfront villa in Calabria with direct beach access | Villa Paola",
    description: "A private villa by the sea in Calabria, entirely for your group, with direct beach access. About 15 minutes by car from Lamezia Terme Airport (SUF), traffic permitting.",
    h1: "Your own beachfront villa in Calabria",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "A whole beachfront villa in Calabria, exclusively for your group, with direct beach access. Villa Paola in Gizzeria has three bedrooms for up to six guests, a sea-facing garden and a covered veranda. Lamezia Terme Airport (SUF) is about 15 minutes away by car, traffic permitting.",
    cta: "Enquire about availability", whatsapp: "Message us on WhatsApp", home: "Explore Villa Paola", privacy: "Privacy", cookies: "Cookies", terms: "Terms",
    imageAlt: "The garden of Villa Paola Caposuvero overlooking the sea in Gizzeria",
    arrival: { title: "From Lamezia Terme Airport to the coast", text: "Villa Paola is about 15 minutes by car from Lamezia Terme Airport (SUF), traffic permitting. Your destination is SS18, Contrada Caposuvero 31, Gizzeria Lido. Open the directions to plan your drive, and contact the owner before travelling if you need to clarify arrival arrangements.", flights: "Direct flights and frequencies vary by season. Use the official SACAL airport website as a starting point, then check with the airline for your exact travel dates before planning your stay.", directions: "Directions to Villa Paola", airport: "Lamezia Terme Airport · SACAL" },
    sections: [
      { title: "From the garden straight to the beach", text: "Direct beach access means there is no road to cross between the property and the shore. The garden and covered veranda make outdoor living part of your stay: breakfast with a sea view, a quiet afternoon with a book, or dinner together as the light changes. This is an entire villa for your group, not a room in shared accommodation." },
      { title: "A private villa by the sea, all to yourselves", text: "The villa has three bedrooms, two bathrooms and an equipped kitchen across approximately 120 m². With space for up to six guests, it suits families, couples travelling together and small groups who want shared meals and separate bedrooms. The photographs show the actual property, its rooms and outdoor spaces." },
      { title: "Spring and autumn at a gentler pace", text: "A coastal stay does not have to be all about swimming. In spring and autumn, you can plan walks along the shore, lunches on the veranda and days exploring Calabria’s towns and countryside. Weather and sea conditions vary, and swimming weather is not guaranteed. Ask about your dates and the seasonal opening of nearby services before making plans." },
      { title: "Gizzeria, within reach of Lamezia Terme", text: "Villa Paola is in Caposuvero, Gizzeria Lido, on Calabria’s west coast. Lamezia Terme Airport is approximately a 15-minute drive away, depending on traffic. The location lets you combine days at the villa with trips along the coast and inland. You can discuss arrival arrangements and your group’s needs directly with the owner." },
      { title: "A personal quote for your stay", text: "Send your arrival and departure dates and the number of guests using the enquiry form. The owner will reply with availability and a personalised quote. Submitting the form does not book the villa: dates, price and conditions must be confirmed directly. You can also message us on WhatsApp with an initial question." },
    ],
  },
  fr: {
    path: "/fr/villa-bord-de-mer-calabre", language: "Français",
    title: "Villa en bord de mer en Calabre, accès direct à la plage | Villa Paola",
    description: "Villa entière à usage exclusif en Calabre, avec accès direct à la plage. À environ 15 minutes en voiture de Lamezia Terme (SUF), selon la circulation.",
    h1: "Votre villa en bord de mer en Calabre",
    eyebrow: "Villa Paola Caposuvero · Gizzeria",
    intro: "Une villa entière à usage exclusif, en bord de mer en Calabre, avec accès direct à la plage. À Gizzeria, Villa Paola accueille jusqu’à six personnes dans trois chambres, avec un jardin face à la mer et une véranda couverte. L’aéroport de Lamezia Terme (SUF) est à environ 15 minutes en voiture, selon la circulation.",
    cta: "Demander les disponibilités", whatsapp: "Nous écrire sur WhatsApp", home: "Découvrir Villa Paola", privacy: "Confidentialité (en anglais)", cookies: "Cookies (en anglais)", terms: "Conditions (en anglais)",
    imageAlt: "Le jardin de Villa Paola Caposuvero face à la mer à Gizzeria",
    arrival: { title: "De l’aéroport de Lamezia Terme à votre villa", text: "Comptez environ 15 minutes en voiture entre l’aéroport de Lamezia Terme (SUF) et Villa Paola, selon la circulation. L’adresse est SS18, Contrada Caposuvero 31, Gizzeria Lido. Consultez l’itinéraire pour préparer votre trajet et échangez avec le propriétaire avant le départ si vous avez des questions sur votre arrivée.", flights: "Les vols directs et leur fréquence varient selon la saison. Consultez le site officiel de l’aéroport, géré par SACAL, puis vérifiez auprès de la compagnie les liaisons proposées à vos dates de voyage avant d’organiser votre séjour.", directions: "Itinéraire vers Villa Paola", airport: "Aéroport de Lamezia Terme · SACAL" },
    sections: [
      { title: "Une villa avec accès direct à la plage", text: "Depuis la propriété, vous rejoignez directement la plage. Le jardin et la véranda couverte prolongent la maison à l’extérieur : un petit-déjeuner face à la mer, une pause lecture à l’ombre ou un dîner à partager. Vous séjournez dans la villa entière, et non dans une chambre au sein d’un hébergement partagé." },
      { title: "Trois chambres pour se retrouver", text: "La maison offre environ 120 m², trois chambres, deux salles de bains et une cuisine équipée. Elle accueille jusqu’à six personnes : familles, couples d’amis ou petits groupes qui souhaitent vivre ensemble tout en gardant des espaces pour chacun. Les photographies présentent la villa et ses extérieurs réels." },
      { title: "La Calabre au printemps et en automne", text: "Un séjour au bord de la mer ne se résume pas à la baignade. Au printemps ou en automne, prenez le temps de marcher le long de la côte, de déjeuner sous la véranda et de découvrir les villages et l’arrière-pays calabrais. La météo et l’état de la mer varient ; le beau temps et la baignade ne sont pas garantis. Renseignez-vous sur l’ouverture saisonnière des services à proximité." },
      { title: "Gizzeria, entre mer et découvertes", text: "Villa Paola se trouve à Caposuvero, à Gizzeria Lido, sur la côte tyrrhénienne de la Calabre. L’aéroport de Lamezia Terme (SUF) est à environ 15 minutes en voiture, selon la circulation. Alternez les journées dans la villa et les excursions sur la côte ou dans les terres, en préparant votre arrivée directement avec le propriétaire." },
      { title: "Un devis pour vos dates", text: "Indiquez vos dates d’arrivée et de départ ainsi que le nombre de personnes dans le formulaire. Le propriétaire vous répondra avec les disponibilités et un devis personnalisé. L’envoi ne constitue pas une réservation : les dates, le prix et les conditions doivent être confirmés directement. Pour une première question, vous pouvez aussi nous écrire sur WhatsApp." },
    ],
  },
} satisfies Record<PublicLocale, { path: string; language: string; title: string; description: string; h1: string; eyebrow: string; intro: string; cta: string; whatsapp: string; home: string; privacy: string; cookies: string; terms: string; imageAlt: string; arrival: { title: string; text: string; flights: string; directions: string; airport: string }; sections: { title: string; text: string }[] }>;

export const publicAlternates = Object.entries(publicVillaContent).map(([lang, content]) => ({ lang, href: SITE_ORIGIN + content.path }));
export function villaStructuredData(locale: PublicLocale) {
  const content = publicVillaContent[locale];
  return { "@context": "https://schema.org", "@type": "LodgingBusiness", "@id": SITE_ORIGIN + "/#villa", name: "Villa Paola Caposuvero", url: SITE_ORIGIN + content.path, description: content.description, image: SITE_ORIGIN + "/images/villa-paola-restyle/hero-giardino-mare-desktop.webp", telephone: "+393355384250", containsPlace: { "@type": "Accommodation", name: "Villa Paola Caposuvero", numberOfBedrooms: villaFacts.bedrooms, occupancy: { "@type": "QuantitativeValue", maxValue: villaFacts.maxGuests } }, address: { "@type": "PostalAddress", streetAddress: "SS18, Contrada Caposuvero 31", addressLocality: "Gizzeria Lido", addressRegion: "Calabria", addressCountry: "IT" } };
}