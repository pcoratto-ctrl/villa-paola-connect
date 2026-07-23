// Configurazione pubblica per i testi "personali" della beta (nome del
// fondatore, contatti). Tutte NEXT_PUBLIC_: nessun dato riservato — solo
// nome, email di supporto ed eventuale URL di feedback, pensati per essere
// visibili nell'interfaccia. Valori con fallback ragionevoli se assenti.

export const FOUNDER_NAME = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim() || "Pierpaolo";

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || null;

export const FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL?.trim() || null;

export function mailtoFounder(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject, ...(body ? { body } : {}) });
  return `mailto:${SUPPORT_EMAIL ?? ""}?${params.toString()}`;
}
