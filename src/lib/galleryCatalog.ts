import living from "@/assets/villa/gallery/10-soggiorno.webp.asset.json";
import bedroom from "@/assets/villa/gallery/13-camera-matrimoniale.webp.asset.json";

export type GalleryCategory = "villa" | "terrace" | "sea" | "sunset" | "interiors";
export type RoomCategory = "bedrooms" | "living" | "kitchen" | "baths";
export type GalleryPhoto = { id: number; order: number; category: GalleryCategory; room?: RoomCategory; src: string; thumb?: string; it: string; en: string; width: number; height: number };
export const galleryCategories: GalleryCategory[] = ["villa", "terrace", "sea", "sunset", "interiors"];
export const galleryPhotos: GalleryPhoto[] = [
  {
    "id": 1,
    "order": 1,
    "category": "villa",
    "src": "/images/villa-paola-restyle/hero-giardino-mare-desktop.webp",
    "it": "Giardino con sedute e mare",
    "en": "Garden with seating and sea views",
    "width": 2560,
    "height": 1920,
    "thumb": "/images/villa-paola-restyle/hero-giardino-mare-1280.webp"
  },
  {
    "id": 2,
    "order": 2,
    "category": "villa",
    "src": "/images/villa-paola-restyle/villa-esterno-panoramica.webp",
    "it": "Panoramica della villa e del vialetto",
    "en": "Panoramic view of the villa and path",
    "width": 2400,
    "height": 1260
  },
  {
    "id": 3,
    "order": 3,
    "category": "villa",
    "src": "/images/villa-paola-restyle/villa-esterno-giardino.webp",
    "it": "Facciata e prato",
    "en": "Villa façade and lawn",
    "width": 1920,
    "height": 1389
  },
  {
    "id": 4,
    "order": 4,
    "category": "villa",
    "src": "/images/villa-paola-restyle/giardino-mare-luce.webp",
    "it": "Giardino e mare scintillante",
    "en": "Garden overlooking the sparkling sea",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 5,
    "order": 5,
    "category": "villa",
    "src": "/images/villa-paola-restyle/giardino-sedie-sdraio.webp",
    "it": "Prato con sdraio lungo il mare",
    "en": "Sun loungers on the seafront lawn",
    "width": 1920,
    "height": 1367
  },
  {
    "id": 6,
    "order": 6,
    "category": "villa",
    "src": "/images/villa-paola-restyle/villa-vialetto-giardino.webp",
    "it": "Vialetto in pietra",
    "en": "Stone garden path",
    "width": 1200,
    "height": 1600
  },
  {
    "id": 7,
    "order": 7,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-sentiero-e-aiuole-vista-mare.webp",
    "it": "Sentiero e aiuole vista mare",
    "en": "Path and flowerbeds overlooking the sea",
    "width": 1440,
    "height": 1920
  },
  {
    "id": 8,
    "order": 8,
    "category": "villa",
    "src": "/images/villa-paola-restyle/villa-facciata-sera.webp",
    "it": "Facciata illuminata all’imbrunire",
    "en": "Villa façade illuminated at dusk",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 10,
    "order": 9,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-villa-e-giardino-di-notte.webp",
    "it": "Villa e giardino di notte",
    "en": "Villa and garden at night",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 11,
    "order": 10,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-alberi-e-ombra-sul-mare.webp",
    "it": "Alberi e ombra sul mare",
    "en": "Trees and shade overlooking the sea",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 12,
    "order": 11,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-poltrona-bianca-sul-prato.webp",
    "it": "Poltrona bianca sul prato",
    "en": "White armchair on the lawn",
    "width": 1536,
    "height": 1152
  },
  {
    "id": 13,
    "order": 12,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-dettaglio-architettonico-del-pergolato.webp",
    "it": "Dettaglio architettonico del pergolato",
    "en": "Architectural detail of the pergola",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 14,
    "order": 13,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-ingresso-e-rampa-illuminati.webp",
    "it": "Ingresso e rampa illuminati",
    "en": "Illuminated entrance and ramp",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 52,
    "order": 14,
    "category": "villa",
    "src": "/images/villa-paola-restyle/gallery-cancello-ingresso-sera.webp",
    "it": "Cancello di ingresso illuminato",
    "en": "Illuminated entrance gate",
    "width": 1650,
    "height": 2200
  },
  {
    "id": 16,
    "order": 15,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/terrazza-pergolato-panoramica.webp",
    "it": "Terrazza panoramica e pergolato",
    "en": "Panoramic terrace and pergola",
    "width": 2200,
    "height": 1650
  },
  {
    "id": 17,
    "order": 16,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/terrazza-divano-fronte-mare.webp",
    "it": "Divano bianco fronte mare",
    "en": "White sofa facing the sea",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 18,
    "order": 17,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/terrazza-pranzo-vista-mare.webp",
    "it": "Pranzo in terrazza",
    "en": "Lunch on the terrace",
    "width": 2200,
    "height": 1238
  },
  {
    "id": 19,
    "order": 18,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/aperitivo-giardino-mare.webp",
    "it": "Aperitivo sul tavolo in giardino",
    "en": "Aperitif on the garden table",
    "width": 1152,
    "height": 1152
  },
  {
    "id": 20,
    "order": 19,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/gallery-tavola-con-motivi-di-limoni.webp",
    "it": "Tavola con motivi di limoni",
    "en": "Table setting with lemon motifs",
    "width": 1440,
    "height": 1920
  },
  {
    "id": 21,
    "order": 20,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/colazione-terrazza.webp",
    "it": "Colazione con cornetti",
    "en": "Breakfast with croissants",
    "width": 1124,
    "height": 1463
  },
  {
    "id": 22,
    "order": 21,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/gallery-passaggio-laterale-vista-mare.webp",
    "it": "Passaggio laterale vista mare",
    "en": "Side passage overlooking the sea",
    "width": 1134,
    "height": 1564
  },
  {
    "id": 23,
    "order": 22,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/vista-mare-dalla-terrazza.webp",
    "it": "Vista dalla terrazza verso il prato",
    "en": "View from the terrace towards the lawn",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 24,
    "order": 23,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/gallery-terrazza-e-percorso-esterno.webp",
    "it": "Terrazza e percorso esterno",
    "en": "Terrace and outdoor path",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 25,
    "order": 24,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/gallery-divano-al-sole-della-sera.webp",
    "it": "Divano al sole della sera",
    "en": "Sofa in the evening sunshine",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 54,
    "order": 25,
    "category": "terrace",
    "src": "/images/villa-paola-restyle/gallery-pergolato-teli-vista-mare.webp",
    "it": "Pergolato con teli e vista mare",
    "en": "Pergola with drapes and sea views",
    "width": 1650,
    "height": 2200
  },
  {
    "id": 26,
    "order": 26,
    "category": "sea",
    "src": "/images/villa-paola-restyle/mare-muretto-bianco.webp",
    "it": "Muretto bianco e mare blu",
    "en": "White wall and blue sea",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 27,
    "order": 27,
    "category": "sea",
    "src": "/images/villa-paola-restyle/gallery-fico-dindia-e-panorama-marino.webp",
    "it": "Fico d’India e panorama marino",
    "en": "Prickly pear cactus and sea panorama",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 29,
    "order": 28,
    "category": "sea",
    "src": "/images/villa-paola-restyle/spiaggia-sole-sul-mare.webp",
    "it": "Spiaggia e riflessi del sole",
    "en": "Beach and sunlight reflections",
    "width": 1920,
    "height": 969
  },
  {
    "id": 31,
    "order": 29,
    "category": "sea",
    "src": "/images/villa-paola-restyle/gallery-ombrellone-e-giardino-fronte-mare.webp",
    "it": "Ombrellone e giardino fronte mare",
    "en": "Parasol and seafront garden",
    "width": 1440,
    "height": 1920
  },
  {
    "id": 32,
    "order": 30,
    "category": "sea",
    "src": "/images/villa-paola-restyle/gallery-mare-mosso-e-luce-sul-giardino.webp",
    "it": "Mare mosso e luce sul giardino",
    "en": "Rough sea and light over the garden",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 33,
    "order": 31,
    "category": "sea",
    "src": "/images/villa-paola-restyle/gallery-spiaggia-e-isola-allorizzonte.webp",
    "it": "Spiaggia e isola all’orizzonte",
    "en": "Beach and island on the horizon",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 34,
    "order": 32,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/giardino-tramonto-mare.webp",
    "it": "Giardino e cielo al tramonto",
    "en": "Garden and sunset sky",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 35,
    "order": 33,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/tramonto-vista-dalla-villa.webp",
    "it": "Tramonto dalla proprietà",
    "en": "Sunset seen from the property",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 36,
    "order": 34,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-prato-e-cielo-rosa-allimbrunire.webp",
    "it": "Prato e cielo rosa all’imbrunire",
    "en": "Lawn and pink sky at dusk",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 37,
    "order": 35,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-tramonto-incorniciato-dai-pilastri.webp",
    "it": "Tramonto incorniciato dai pilastri",
    "en": "Sunset framed by pillars",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 38,
    "order": 36,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-orizzonte-dorato-e-profilo-dellisola.webp",
    "it": "Orizzonte dorato e profilo dell’isola",
    "en": "Golden horizon and island silhouette",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 40,
    "order": 37,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-profilo-dellisola-al-crepuscolo.webp",
    "it": "Profilo dell’isola al crepuscolo",
    "en": "Island silhouette at twilight",
    "width": 1920,
    "height": 1440
  },
  {
    "id": 41,
    "order": 38,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-tramonto-rosso-sulla-spiaggia.webp",
    "it": "Tramonto rosso sulla spiaggia",
    "en": "Red sunset over the beach",
    "width": 1440,
    "height": 1920
  },
  {
    "id": 53,
    "order": 39,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-terrazza-giardino-crepuscolo.webp",
    "it": "Terrazza e giardino al crepuscolo",
    "en": "Terrace and garden at twilight",
    "width": 1650,
    "height": 2200
  },
  {
    "id": 55,
    "order": 40,
    "category": "sunset",
    "src": "/images/villa-paola-restyle/gallery-tramonto-raggi-rossi.webp",
    "it": "Raggi rossi del tramonto sulla spiaggia",
    "en": "Red sunset rays over the beach",
    "width": 1536,
    "height": 2048
  },
  {
    "id": 42,
    "order": 41,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/interni-cucina-dettaglio.webp",
    "it": "Cucina con rivestimento decorato",
    "en": "Kitchen with decorated tiles",
    "width": 1600,
    "height": 1200,
    "room": "kitchen"
  },
  {
    "id": 43,
    "order": 42,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/interni-bagno-dettaglio-ceramiche.webp",
    "it": "Specchio e ceramiche del bagno",
    "en": "Bathroom mirror and ceramics",
    "width": 1050,
    "height": 1400,
    "room": "baths"
  },
  {
    "id": 44,
    "order": 43,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/gallery-doccia-con-rivestimento-blu.webp",
    "it": "Doccia con rivestimento blu",
    "en": "Shower with blue tiles",
    "width": 1440,
    "height": 1920,
    "room": "baths"
  },
  {
    "id": 45,
    "order": 44,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/gallery-bagno-con-sanitari-e-finestra.webp",
    "it": "Bagno con sanitari e finestra",
    "en": "Bathroom with fittings and window",
    "width": 1440,
    "height": 1920,
    "room": "baths"
  },
  {
    "id": 46,
    "order": 45,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/interni-bagno-lavabo.webp",
    "it": "Lavabo e ceramiche decorate",
    "en": "Washbasin and decorated ceramics",
    "width": 1200,
    "height": 1600,
    "room": "baths"
  },
  {
    "id": 47,
    "order": 46,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/gallery-camera-con-letto-e-tessuti-blu.webp",
    "it": "Camera con letto e tessuti blu",
    "en": "Bedroom with bed and blue fabrics",
    "width": 1170,
    "height": 1554,
    "room": "bedrooms"
  },
  {
    "id": 48,
    "order": 47,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/interni-camera-doppia.webp",
    "it": "Camera con due letti",
    "en": "Twin bedroom",
    "width": 1170,
    "height": 964,
    "room": "bedrooms"
  },
  {
    "id": 49,
    "order": 48,
    "category": "interiors",
    "src": "/images/villa-paola-restyle/gallery-dettaglio-della-camera-con-decori-marini.webp",
    "it": "Dettaglio della camera con decori marini",
    "en": "Bedroom detail with marine decorations",
    "width": 1170,
    "height": 883,
    "room": "bedrooms"
  },
  {
    "id": 50,
    "order": 49,
    "category": "interiors",
    "src": living.url,
    "it": "Soggiorno già presente",
    "en": "Living room at Villa Paola",
    "width": 3840,
    "height": 2160,
    "room": "living"
  },
  {
    "id": 51,
    "order": 50,
    "category": "interiors",
    "src": bedroom.url,
    "it": "Camera matrimoniale già presente",
    "en": "Double bedroom at Villa Paola",
    "width": 3840,
    "height": 2160,
    "room": "bedrooms"
  }
];
export const previewIds = [2, 4, 18, 16, 3, 1, 5, 26, 17];
export const previewPhotos = previewIds.flatMap(id => galleryPhotos.filter(p => p.id === id));
