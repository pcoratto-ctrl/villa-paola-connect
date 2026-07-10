import { createClient } from "@/lib/supabase/server";
import { PLAN_LABELS, PLAN_LIMITS } from "@/lib/plans";
import BillingButtons from "@/components/BillingButtons";
import type { Profile } from "@/lib/types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; limit?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const p = profile as Profile | null;
  const piano = p?.piano ?? "free";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Impostazioni</h1>

      {sp.checkout === "success" && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          Pagamento completato! Il tuo piano si aggiorna entro pochi secondi (webhook Stripe).
          Se non vedi il cambiamento, ricarica la pagina.
        </p>
      )}
      {sp.checkout === "cancel" && (
        <p className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          Pagamento annullato. Nessun addebito effettuato.
        </p>
      )}
      {sp.limit && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Hai raggiunto il limite di clienti del tuo piano. Scegli un piano più capiente qui sotto.
        </p>
      )}

      <section className="card mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Account</h2>
        <p className="mt-2 text-slate-900">{p?.email ?? user!.email}</p>
      </section>

      <section className="card mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Abbonamento
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900">{PLAN_LABELS[piano]}</p>
        <p className="mt-1 text-sm text-slate-500">
          Limite clienti: {PLAN_LIMITS[piano]}.{" "}
          {piano === "free"
            ? "Il PDF include il marchio Klaro; con i piani a pagamento è white-label."
            : "PDF white-label attivo: nessun marchio Klaro nei report."}
        </p>
        <BillingButtons piano={piano} hasCustomer={Boolean(p?.stripe_customer_id)} />
      </section>
    </div>
  );
}
