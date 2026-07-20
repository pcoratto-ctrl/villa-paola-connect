import Stripe from "stripe";

// Un valore mancante o ancora uguale al placeholder di .env.example conta
// come "non configurato": evita di chiamare Stripe con credenziali finte.
function isPlaceholder(value: string | undefined): boolean {
  return !value || value.trim() === "" || value.trim().endsWith("...");
}

export function isStripeConfigured(): boolean {
  return (
    !isPlaceholder(process.env.STRIPE_SECRET_KEY) &&
    !isPlaceholder(process.env.STRIPE_WEBHOOK_SECRET) &&
    !isPlaceholder(process.env.STRIPE_PRICE_STARTER) &&
    !isPlaceholder(process.env.STRIPE_PRICE_PRO)
  );
}

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export function priceIdForPlan(plan: "starter" | "pro"): string {
  return plan === "starter"
    ? process.env.STRIPE_PRICE_STARTER!
    : process.env.STRIPE_PRICE_PRO!;
}

export function planForPriceId(priceId: string): "starter" | "pro" | null {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return null;
}
