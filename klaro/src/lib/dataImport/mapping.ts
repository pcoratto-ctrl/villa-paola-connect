import { matchField, normalizeLabel, type FieldKey } from "./fieldSynonyms";
import { parseFlexibleNumber } from "./numberParsing";
import { MESI, type Canale } from "@/lib/types";
import type { RecognizedField } from "./paste";

export type { RecognizedField };

export function mapCsvRow(headers: string[], row: string[]): RecognizedField[] {
  return headers.map((h, i) => ({
    rawLabel: h,
    rawValue: (row[i] ?? "").trim(),
    fieldKey: matchField(h),
  }));
}

const NUMERIC_KEYS: FieldKey[] = [
  "follower_inizio",
  "follower_fine",
  "reach",
  "impression",
  "interazioni",
  "engagement_rate",
  "visite_profilo",
  "click_link",
  "numero_post",
];

const TEXT_KEYS: FieldKey[] = ["top_contenuto_1", "top_contenuto_2", "top_contenuto_3", "note"];

export type ImportedValues = {
  follower_inizio?: number;
  follower_fine?: number;
  reach?: number;
  impression?: number;
  interazioni?: number;
  engagement_rate?: number;
  visite_profilo?: number;
  click_link?: number;
  numero_post?: number;
  top_contenuto_1?: string;
  top_contenuto_2?: string;
  top_contenuto_3?: string;
  note?: string;
};

export type FieldIssue = { fieldKey: FieldKey; rawLabel: string; rawValue: string; message: string };

export type PeriodoInfo = { mese?: number; anno?: number; canale?: Canale };

const MESI_INGLESE = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Abbreviazioni inglesi comuni (non serve per l'italiano: i nomi completi
// bastano gia' per il caso d'uso di Klaro).
const MESI_INGLESE_ABBR: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function parseMese(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 12) return n;
  const norm = normalizeLabel(raw);
  const idxIt = MESI.findIndex((m) => normalizeLabel(m) === norm);
  if (idxIt >= 0) return idxIt + 1;
  const idxEn = MESI_INGLESE.indexOf(norm);
  if (idxEn >= 0) return idxEn + 1;
  if (norm in MESI_INGLESE_ABBR) return MESI_INGLESE_ABBR[norm];
  return null;
}

function parseCanale(raw: string): Canale | null {
  const norm = normalizeLabel(raw);
  if (["instagram", "ig", "insta"].includes(norm)) return "instagram";
  if (["tiktok", "tik tok", "tt"].includes(norm)) return "tiktok";
  if (["linkedin", "li"].includes(norm)) return "linkedin";
  return null;
}

// Rimuove un eventuale carattere di innesco formula (=, +, -, @) all'inizio
// di un campo testuale: il valore non viene mai eseguito, ma per prudenza
// evitiamo che possa essere reinterpretato come formula se in futuro il
// testo finisse di nuovo in un foglio di calcolo.
function sanitizeTextCell(v: string): string {
  return v.replace(/^[=+\-@]+/, "").trim();
}

export function buildImportedValues(fields: RecognizedField[]): {
  values: ImportedValues;
  issues: FieldIssue[];
  periodo: PeriodoInfo;
} {
  const values: ImportedValues = {};
  const issues: FieldIssue[] = [];
  const periodo: PeriodoInfo = {};

  for (const f of fields) {
    if (!f.fieldKey) continue;
    const raw = f.rawValue?.trim();
    if (!raw) continue;

    if (f.fieldKey === "mese") {
      const n = parseMese(raw);
      if (n) periodo.mese = n;
      else issues.push({ fieldKey: f.fieldKey, rawLabel: f.rawLabel, rawValue: raw, message: `Mese non riconosciuto: "${raw}"` });
      continue;
    }
    if (f.fieldKey === "anno") {
      const n = Number(raw);
      if (!Number.isNaN(n) && n >= 2000 && n <= 2100) periodo.anno = n;
      else issues.push({ fieldKey: f.fieldKey, rawLabel: f.rawLabel, rawValue: raw, message: `Anno non valido: "${raw}"` });
      continue;
    }
    if (f.fieldKey === "canale") {
      const c = parseCanale(raw);
      if (c) periodo.canale = c;
      else issues.push({ fieldKey: f.fieldKey, rawLabel: f.rawLabel, rawValue: raw, message: `Canale non riconosciuto: "${raw}"` });
      continue;
    }
    if (TEXT_KEYS.includes(f.fieldKey)) {
      (values as Record<string, string>)[f.fieldKey] = sanitizeTextCell(raw);
      continue;
    }
    if (NUMERIC_KEYS.includes(f.fieldKey)) {
      const n = parseFlexibleNumber(raw);
      if (n === null) {
        issues.push({ fieldKey: f.fieldKey, rawLabel: f.rawLabel, rawValue: raw, message: `Numero non valido: "${raw}"` });
      } else {
        (values as Record<string, number>)[f.fieldKey] = n;
      }
      continue;
    }
  }

  // Engagement automatico: se ci sono interazioni e reach ma non gia' un
  // engagement_rate esplicito nel file, il calcolo viene demandato al wizard
  // (che ha gia' la propria modalita' "calcolato"): qui non sovrascriviamo
  // mai un engagement_rate presente nel file.

  return { values, issues, periodo };
}
