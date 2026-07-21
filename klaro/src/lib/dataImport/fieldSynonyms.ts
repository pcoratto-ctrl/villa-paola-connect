// Riconoscimento tollerante delle colonne/etichette di un file importato
// (CSV o testo incollato). Solo corrispondenze esatte dopo normalizzazione:
// niente indovinelli, i casi incerti finiscono nella mappatura manuale.

export type FieldKey =
  | "mese"
  | "anno"
  | "canale"
  | "follower_inizio"
  | "follower_fine"
  | "reach"
  | "impression"
  | "interazioni"
  | "engagement_rate"
  | "visite_profilo"
  | "click_link"
  | "numero_post"
  | "top_contenuto_1"
  | "top_contenuto_2"
  | "top_contenuto_3"
  | "note";

export const FIELD_KEYS: FieldKey[] = [
  "mese",
  "anno",
  "canale",
  "follower_inizio",
  "follower_fine",
  "reach",
  "impression",
  "interazioni",
  "engagement_rate",
  "visite_profilo",
  "click_link",
  "numero_post",
  "top_contenuto_1",
  "top_contenuto_2",
  "top_contenuto_3",
  "note",
];

export const FIELD_LABELS: Record<FieldKey, string> = {
  mese: "Mese",
  anno: "Anno",
  canale: "Canale",
  follower_inizio: "Follower a inizio mese",
  follower_fine: "Follower a fine mese",
  reach: "Reach (copertura)",
  impression: "Impression",
  interazioni: "Interazioni totali",
  engagement_rate: "Engagement rate (%)",
  visite_profilo: "Visite al profilo",
  click_link: "Click al link",
  numero_post: "Contenuti pubblicati",
  top_contenuto_1: "Top contenuto 1",
  top_contenuto_2: "Top contenuto 2",
  top_contenuto_3: "Top contenuto 3",
  note: "Note",
};

// Sinonimi in italiano e inglese per ogni campo. Il nome-colonna "macchina"
// del modello CSV (es. follower_inizio) e' sempre incluso: la normalizzazione
// trasforma "_" in spazio, quindi combacia comunque con le varianti leggibili.
const SYNONYMS: Record<FieldKey, string[]> = {
  mese: ["mese", "month"],
  anno: ["anno", "year"],
  canale: ["canale", "channel", "piattaforma", "platform"],
  follower_inizio: [
    "follower_inizio",
    "follower iniziali",
    "follower inizio",
    "starting followers",
  ],
  follower_fine: [
    "follower_fine",
    "follower finali",
    "follower fine",
    "ending followers",
    "followers",
  ],
  reach: ["reach", "copertura", "persone raggiunte", "accounts reached"],
  impression: ["impression", "impressions", "visualizzazioni"],
  // "engagement" da solo NON e' qui: e' ambiguo (vedi AMBIGUOUS_LABELS più
  // sotto) e non viene mai riconosciuto automaticamente.
  interazioni: ["interazioni", "interactions", "total interactions"],
  engagement_rate: [
    "engagement_rate",
    "engagement rate",
    "engagement %",
    "tasso di engagement",
    "tasso engagement",
  ],
  visite_profilo: ["visite_profilo", "visite profilo", "profile visits", "profile views"],
  click_link: ["click_link", "click link", "link clicks", "website clicks", "clic sul link"],
  numero_post: [
    "contenuti_pubblicati",
    "contenuti pubblicati",
    "post pubblicati",
    "posts",
    "published content",
    "numero di post pubblicati",
  ],
  top_contenuto_1: ["top_contenuto_1", "top contenuto 1", "contenuto migliore 1", "top post 1"],
  top_contenuto_2: ["top_contenuto_2", "top contenuto 2", "contenuto migliore 2", "top post 2"],
  top_contenuto_3: ["top_contenuto_3", "top contenuto 3", "contenuto migliore 3", "top post 3"],
  note: ["note", "risultati_note", "note aggiuntive", "risultati", "osservazioni", "commento"],
};

const COMBINING_MARKS = new RegExp(
  String.fromCharCode(91) + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + String.fromCharCode(93),
  "g"
);

export function normalizeLabel(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(COMBINING_MARKS, "") // rimuove accenti (marchi diacritici combinanti)
    .toLowerCase()
    .replace(/[():._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EXACT_LOOKUP = new Map<string, FieldKey>();
for (const key of FIELD_KEYS) {
  for (const syn of SYNONYMS[key]) {
    EXACT_LOOKUP.set(normalizeLabel(syn), key);
  }
}

// Etichette che assomigliano a un sinonimo ma possono indicare più campi
// diversi: non vengono mai riconosciute automaticamente, nemmeno se la
// forma normalizzata combacerebbe con una sola voce. L'utente sceglie dalla
// tendina; l'interfaccia mostra un messaggio che spiega l'ambiguità.
const AMBIGUOUS_LABELS: Record<string, FieldKey[]> = {
  engagement: ["interazioni", "engagement_rate"],
};

// Se l'etichetta e' un caso ambiguo noto, restituisce i campi candidati tra
// cui l'utente deve scegliere manualmente; altrimenti null.
export function getAmbiguousCandidates(rawLabel: string): FieldKey[] | null {
  return AMBIGUOUS_LABELS[normalizeLabel(rawLabel)] ?? null;
}

// Riconosce un'etichetta (intestazione colonna CSV o testo prima dei due
// punti/tab nell'incolla) solo con corrispondenza esatta dopo normalizzazione.
// Le etichette ambigue (vedi sopra) non vengono mai risolte qui.
export function matchField(rawLabel: string): FieldKey | null {
  if (AMBIGUOUS_LABELS[normalizeLabel(rawLabel)]) return null;
  return EXACT_LOOKUP.get(normalizeLabel(rawLabel)) ?? null;
}
