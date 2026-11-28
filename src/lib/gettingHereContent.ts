import type { PublicLocale } from "./publicVillaContent";

export type ArrivalOrigin = "airport" | "station";
export const ARRIVAL_ANIMATION_MS = 6000;
// Illustration coordinates, NOT geographic coordinates or surveyed roads.
export const arrivalRoutes = {
  airport: { path: "M410 365 C380 335 345 335 330 280 S310 195 280 145 S235 90 210 70", x: 410, y: 365, minutes: 15 },
  station: { path: "M450 240 C415 245 370 260 330 230 S310 195 280 145 S235 90 210 70", x: 450, y: 240, minutes: 15 },
} as const;

export const gettingHereContent: Record<PublicLocale, {
  title: string; origins: Record<ArrivalOrigin, string>; from: string; to: string;
  time: string; note: string; illustrative: string; sea: string; north: string;
  play: string; pause: string; replay: string; reduced: string; directions: string;
  description: string;
}> = {
  it: {
    title: "Come raggiungerci", origins: { airport: "Aeroporto Lamezia Terme (SUF)", station: "Stazione Lamezia Terme Centrale" },
    from: "Partenza", to: "Arrivo", time: "Circa 15 minuti in auto",
    note: "Tempi indicativi, dipendono dal traffico.", illustrative: "Mappa illustrativa · non in scala",
    sea: "Mar Tirreno", north: "Nord", play: "Avvia percorso", pause: "Pausa", replay: "Ripeti percorso",
    reduced: "Percorso statico", directions: "Apri le indicazioni",
    description: "Schema della costa: Villa Paola a nord-ovest dell’aeroporto e della stazione. Il tratteggio è illustrativo, non rappresenta un itinerario stradale verificato.",
  },
  en: {
    title: "Getting here", origins: { airport: "Lamezia Terme Airport (SUF)", station: "Lamezia Terme Centrale Station" },
    from: "From", to: "To", time: "About 15 minutes by car",
    note: "Indicative travel times depend on traffic.", illustrative: "Illustrative map · not to scale",
    sea: "Tyrrhenian Sea", north: "North", play: "Play route", pause: "Pause", replay: "Replay route",
    reduced: "Static route", directions: "Open directions",
    description: "Coastal illustration: Villa Paola is northwest of the airport and station. The dashed line is illustrative, not a verified driving route.",
  },
};