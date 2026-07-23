// Traduce gli errori di Supabase Auth in messaggi brevi, umani e senza
// gergo tecnico. I messaggi che already sono nostri (allowlist, limiti)
// passano invariati; tutto il resto ignoto viene sostituito da un
// messaggio generico che non espone mai dettagli tecnici Supabase.

const KNOWN_HUMAN_SNIPPETS = ["beta privata", "Pierpaolo", "limite di", "beta:"];

function isAlreadyHuman(message: string): boolean {
  return KNOWN_HUMAN_SNIPPETS.some((s) => message.includes(s));
}

export function humanizeSignupError(message: string): string {
  if (message.includes("already registered") || message.includes("User already registered")) {
    return "Esiste già un account con questa email. Accedi oppure recupera la password se non la ricordi.";
  }
  if (isAlreadyHuman(message)) return message;
  return "Non siamo riusciti a completare la registrazione. Riprova oppure scrivi direttamente a Pierpaolo.";
}

export function humanizeLoginError(message: string): string {
  if (message === "Invalid login credentials") return "Email o password non corretti.";
  if (isAlreadyHuman(message)) return message;
  return "Non siamo riusciti a completare l'accesso. Riprova oppure scrivi direttamente a Pierpaolo.";
}

export function humanizeGenericAuthError(message: string): string {
  if (isAlreadyHuman(message)) return message;
  return "Qualcosa non ha funzionato da parte nostra. Riprova tra poco.";
}
