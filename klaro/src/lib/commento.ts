import type { ContestoMese } from "@/lib/types";

// Titoli esatti delle sezioni del commento consulenziale (devono combaciare
// con quelli richiesti nel prompt di /api/ai/comment).
export const SEZIONI_COMMENTO = [
  "Sintesi del mese",
  "Cosa è andato bene",
  "Cosa migliorare",
  "Lettura dei numeri principali",
  "Priorità consigliate per il prossimo mese",
] as const;

export type SezioniCommento = {
  sintesi: string;
  andato_bene: string;
  migliorare: string;
  numeri: string;
  priorita: string;
};

const KEYS: (keyof SezioniCommento)[] = [
  "sintesi",
  "andato_bene",
  "migliorare",
  "numeri",
  "priorita",
];

// Riconosce una riga-titolo tipo "1. Sintesi del mese" (con o senza numero,
// con eventuali ** markdown) e restituisce l'indice di sezione, altrimenti -1.
export function matchTitoloSezione(line: string): number {
  const clean = line.replace(/[*#]/g, "").trim().replace(/^\d+[.)]\s*/, "").toLowerCase();
  return SEZIONI_COMMENTO.findIndex((t) => clean === t.toLowerCase());
}

// Divide il commento nelle 5 sezioni. Tollerante: se il testo non segue la
// struttura (es. commento scritto a mano), tutto finisce in "sintesi".
export function parseCommento(text: string): SezioniCommento {
  const out: SezioniCommento = {
    sintesi: "",
    andato_bene: "",
    migliorare: "",
    numeri: "",
    priorita: "",
  };
  let current: keyof SezioniCommento = "sintesi";
  let matchedAny = false;

  for (const rawLine of text.split("\n")) {
    const idx = matchTitoloSezione(rawLine);
    if (idx >= 0) {
      current = KEYS[idx];
      matchedAny = true;
      continue;
    }
    out[current] += (out[current] ? "\n" : "") + rawLine;
  }

  if (!matchedAny) {
    return { ...out, sintesi: text.trim() };
  }
  for (const k of KEYS) out[k] = out[k].trim();
  return out;
}

// Blocchi della sezione "In sintesi" del PDF. Preferisce la prosa scritta
// dall'AI (sezioni del commento), che è discorsiva e pronta per il cliente;
// usa il contesto dell'utente solo come fallback se il commento manca.
export function sintesiBlocks(
  contesto: ContestoMese | undefined,
  commento: string | null
): { bene: string; migliorare: string; priorita: string } {
  const sezioni = commento ? parseCommento(commento) : null;
  const pick = (dal_commento: string | undefined, dal_contesto: string | undefined) => {
    const c = dal_commento?.trim();
    if (c) return c;
    return (dal_contesto ?? "").trim();
  };
  return {
    bene: pick(sezioni?.andato_bene, contesto?.andato_bene),
    migliorare: pick(sezioni?.migliorare, contesto?.non_funzionato),
    priorita: pick(sezioni?.priorita, contesto?.priorita_prossimo),
  };
}

// Prende le prime N frasi di un testo (per email e riassunti brevi).
export function primeFrasi(text: string, n: number): string {
  const frasi = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((f) => f.trim().length > 0);
  return frasi.slice(0, n).join(" ").trim();
}

// Email pronta da inviare al cliente insieme al PDF (nessun invio reale).
export function buildEmailCliente({
  nomeCliente,
  periodo,
  commento,
}: {
  nomeCliente: string;
  periodo: string;
  commento: string | null;
}): string {
  const sezioni = commento ? parseCommento(commento) : null;
  const sintesi = sezioni?.sintesi
    ? primeFrasi(sezioni.sintesi, 3)
    : "questo mese abbiamo continuato il lavoro sui canali social secondo il piano condiviso.";

  return `Gentile ${nomeCliente},

in allegato trovi il report social di ${periodo}.

In breve: ${sintesi}

Nel PDF trovi tutti i numeri del mese, il confronto con il periodo precedente e le priorità che suggeriamo per il prossimo mese. Resto a disposizione se vuoi vederlo insieme.

Un caro saluto`;
}
