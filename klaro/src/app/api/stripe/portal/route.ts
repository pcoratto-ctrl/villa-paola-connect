import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

// Apre il Customer Portal di Stripe per gestire/disdire l'abbonamento
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Pagamenti non configurati in questo ambiente." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Nessun abbonamento attivo da gestire." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Errore portal Stripe:", err);
    return NextResponse.json(
      { error: "Impossibile aprire la gestione abbonamento. Riprova." },
      { status: 502 }
    );
  }
}
