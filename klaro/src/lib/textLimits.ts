// Limiti di lunghezza condivisi tra UI (maxLength) e validazione server
// (Zod in /api/ai/comment, CHECK in supabase/migrations/002_beta_privata.sql).
// Un unico posto per non farli divergere tra client e server.

export const NOME_CLIENTE_MAX = 150;
export const OBIETTIVI_MAX = 2000;
export const TESTO_LIBERO_MAX = 3000; // contesto del mese, note, valutazione obiettivi
export const TITOLO_CONTENUTO_MAX = 300; // titolo/metrica di un top content
export const COMMENTO_MAX = 8000; // commento AI: 5 sezioni combinate, non un singolo campo
