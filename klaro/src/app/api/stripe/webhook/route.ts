import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured, planForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

// Webhook Stripe: aggiorna il piano dell'utente su Supabase.
// Eventi gestiti: checkout.session.completed, customer.subscription.updated/deleted

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Pagamenti non configurati in questo ambiente." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Firma webhook non valida:", err);
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  const supabase = createAdminClient();

  async function applySubscription(subscription: Stripe.Subscription) {
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const active = subscription.status === "active" || subscription.status === "trialing";
    const priceId = subscription.items.data[0]?.price?.id ?? "";
    const piano = active ? (planForPriceId(priceId) ?? "free") : "free";

    const { error } = await supabase
      .from("profiles")
      .update({
        piano,
        stripe_subscription_id: active ? subscription.id : null,
      })
      .eq("stripe_customer_id", customerId);

    if (error) console.error("Errore aggiornamento profilo:", error);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id
          );
          await applySubscription(sub);
        }
        break;
      }
      case "customer.subscription.updated": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await supabase
          .from("profiles")
          .update({ piano: "free", stripe_subscription_id: null })
          .eq("stripe_customer_id", customerId);
        break;
      }
      default:
        // altri eventi: ack senza azione
        break;
    }
  } catch (err) {
    console.error("Errore gestione webhook:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
