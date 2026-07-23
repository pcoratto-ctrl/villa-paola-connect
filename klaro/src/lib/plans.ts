// Durante la beta privata il piano gratuito consente 2 clienti reali (oltre
// al cliente demo, che non conta mai nel limite): vedi supabase/migrations/
// 002_beta_privata.sql per l'enforcement non aggirabile lato database.
export const PLAN_LIMITS: Record<string, number> = {
  free: 2,
  starter: 5,
  pro: 20,
};

// Limite report totali per tester durante la beta (cliente demo escluso),
// applicato sia lato UI (src/app/(app)/reports/new/page.tsx) sia — in modo
// non aggirabile — dal trigger su public.reports nella migrazione beta.
export const BETA_REPORT_LIMIT = 10;

export const PLAN_LABELS: Record<string, string> = {
  free: "Gratuito (beta: 2 clienti reali)",
  starter: "Starter — €19/mese, fino a 5 clienti",
  pro: "Pro — €39/mese, fino a 20 clienti",
};

export function maxClients(piano: string): number {
  return PLAN_LIMITS[piano] ?? 1;
}

// Il footer Klaro compare nel PDF solo sul piano gratuito (white-label a pagamento)
export function isWhiteLabel(piano: string): boolean {
  return piano === "starter" || piano === "pro";
}
