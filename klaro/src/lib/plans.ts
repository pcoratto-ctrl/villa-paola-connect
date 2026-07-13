// Durata della prova gratuita completa (dalla registrazione).
export const TRIAL_DAYS = 14;

// I limiti sono SUL NUMERO DI CLIENTI, mai sul numero di report al mese.
export const PLAN_LIMITS: Record<string, number> = {
  free: 1, // dopo la prova: 1 solo cliente
  trial: 20, // durante la prova: funzionalità complete (come Pro)
  starter: 5,
  pro: 20,
};

// Prezzi mostrati in UI. La cifra reale addebitata è quella del Price su Stripe:
// questi testi vanno tenuti allineati a ciò che configuri nel dashboard Stripe.
export const PLAN_PRICE: Record<"starter" | "pro", string> = {
  starter: "€15/mese",
  pro: "€39/mese",
};

export const PLAN_LABELS: Record<string, string> = {
  free: "Gratuito (1 cliente)",
  trial: "Prova gratuita — funzionalità complete",
  starter: `Starter — ${PLAN_PRICE.starter}, fino a 5 clienti`,
  pro: `Pro — ${PLAN_PRICE.pro}, fino a 20 clienti`,
};

export type PlanKey = "free" | "trial" | "starter" | "pro";

export type EffectivePlan = {
  // Piano effettivo tenendo conto della prova gratuita
  plan: PlanKey;
  // Piano "grezzo" salvato su profiles.piano (free/starter/pro)
  rawPlan: string;
  maxClients: number;
  // true = PDF senza footer "Creato con Klaro"
  whiteLabel: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
};

// Calcola il piano effettivo a partire da profiles.piano e profiles.created_at.
// La prova gratuita è dedotta dalla data di registrazione: nessun campo DB nuovo.
// - starter/pro (pagante): limiti del piano, white-label attivo
// - free entro TRIAL_DAYS dalla registrazione: prova completa (limiti Pro, white-label)
// - free oltre TRIAL_DAYS: free tier (1 cliente, footer Klaro nel PDF)
export function resolvePlan(
  piano: string | null | undefined,
  createdAt: string | null | undefined
): EffectivePlan {
  const raw = piano ?? "free";

  if (raw === "starter" || raw === "pro") {
    return {
      plan: raw,
      rawPlan: raw,
      maxClients: PLAN_LIMITS[raw],
      whiteLabel: true,
      isTrial: false,
      trialDaysLeft: 0,
    };
  }

  // Piano gratuito: verifica se siamo ancora nella finestra di prova
  const created = createdAt ? new Date(createdAt).getTime() : NaN;
  if (!Number.isNaN(created)) {
    const msLeft = created + TRIAL_DAYS * 24 * 60 * 60 * 1000 - Date.now();
    if (msLeft > 0) {
      return {
        plan: "trial",
        rawPlan: "free",
        maxClients: PLAN_LIMITS.trial,
        whiteLabel: true,
        isTrial: true,
        trialDaysLeft: Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000))),
      };
    }
  }

  return {
    plan: "free",
    rawPlan: "free",
    maxClients: PLAN_LIMITS.free,
    whiteLabel: false,
    isTrial: false,
    trialDaysLeft: 0,
  };
}

// --- Helper retrocompatibili (usati dove non serve la logica di prova) ---

export function maxClients(piano: string): number {
  return PLAN_LIMITS[piano] ?? 1;
}

// Il footer Klaro compare nel PDF solo sul piano gratuito (white-label a pagamento)
export function isWhiteLabel(piano: string): boolean {
  return piano === "starter" || piano === "pro";
}
