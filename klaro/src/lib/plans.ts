export const PLAN_LIMITS: Record<string, number> = {
  free: 1, // solo il cliente demo / di prova
  starter: 5,
  pro: 20,
};

export const PLAN_LABELS: Record<string, string> = {
  free: "Gratuito (1 cliente di prova)",
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
