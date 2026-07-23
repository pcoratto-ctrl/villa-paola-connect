// Controllo di accesso per la beta privata. Server-only: NON importare da
// componenti "use client" (leggerebbe undefined, dato che BETA_ALLOWED_EMAILS
// non è prefissata con NEXT_PUBLIC_ e quindi non viene inviata al browser).
// Se la variabile non è impostata (o è vuota), la beta non è "attiva": nessun
// utente viene bloccato, per non rompere sviluppo locale o altri ambienti.

function parseAllowedEmails(): Set<string> {
  const raw = process.env.BETA_ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isBetaGateActive(): boolean {
  return parseAllowedEmails().size > 0;
}

export function isBetaAllowed(email: string | null | undefined): boolean {
  if (!isBetaGateActive()) return true;
  if (!email) return false;
  return parseAllowedEmails().has(email.trim().toLowerCase());
}

export const BETA_NOT_AUTHORIZED_MESSAGE =
  "Il tuo account non è ancora abilitato per la beta privata di Klaro. Se pensi sia un errore, contatta chi ti ha invitato.";
