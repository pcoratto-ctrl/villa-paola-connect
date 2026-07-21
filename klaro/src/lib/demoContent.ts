// Riconosce il cliente demo "Bar Centrale" e i suoi 2 report pre-caricati
// (vedi supabase/schema.sql, trigger handle_new_user). Nessuna colonna
// dedicata nel DB: il riconoscimento è per contenuto esatto, deterministico
// e non ambiguo con dati reali di un utente.

export const DEMO_CLIENT_NAME = "Bar Centrale (demo)";

// Frammento esatto degli obiettivi precaricati dal trigger demo.
export const DEMO_OBIETTIVI_SNIPPET =
  "Aumentare la notorieta' del locale in citta', portare piu' clienti agli eventi serali del weekend";

// Inizio esatto dei due commento_ai precaricati dal trigger demo: identifica
// in modo univoco i 2 report demo, senza rischiare di toccare report reali.
export const DEMO_COMMENTO_PREFIXES = [
  "Questo mese segna l'avvio di una presenza strutturata su Instagram per Bar Centrale",
  "Il mese si chiude con una crescita netta su tutti gli indicatori principali, a conferma che la strategia impostata sta funzionando.",
];

export function isDemoClientName(nome: string): boolean {
  return nome === DEMO_CLIENT_NAME;
}

export function containsDemoObiettivi(testo: string | null | undefined): boolean {
  return Boolean(testo && testo.includes(DEMO_OBIETTIVI_SNIPPET));
}

export function isDemoCommento(commento: string | null | undefined): boolean {
  if (!commento) return false;
  return DEMO_COMMENTO_PREFIXES.some((prefix) => commento.startsWith(prefix));
}
