import Stripe from "stripe";

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
