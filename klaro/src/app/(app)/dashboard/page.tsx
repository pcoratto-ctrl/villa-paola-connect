import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LABELS, resolvePlan } from "@/lib/plans";
import type { Client, Profile } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: clients }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("clients")
      .select("*, reports(count)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
  ]);

  const p = profile as (Profile & { created_at?: string }) | null;
  const list = (clients ?? []) as (Client & { reports: { count: number }[] })[];
  const plan = resolvePlan(p?.piano, p?.created_at);
  const limit = plan.maxClients;
  const atLimit = list.length >= limit;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">I tuoi clienti</h1>
          <p className="mt-1 text-sm text-slate-500">
            Piano: {PLAN_LABELS[plan.plan]} · {list.length}/{limit} clienti
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={atLimit ? "/settings" : "/clients/new"} className="btn-secondary">
            + Nuovo cliente
          </Link>
          <Link href="/reports/new" className="btn-primary">
            Nuovo report
          </Link>
        </div>
      </div>

      {plan.isTrial && (
        <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
          Prova gratuita attiva: hai tutte le funzionalità (fino a {limit} clienti, PDF senza
          marchio Klaro).{" "}
          {plan.trialDaysLeft <= 3 ? (
            <>
              Restano <strong>{plan.trialDaysLeft} giorni</strong>.{" "}
              <Link href="/settings" className="font-semibold underline">
                Scegli un piano
              </Link>{" "}
              per non perdere l&apos;accesso completo.
            </>
          ) : (
            <>
              Restano {plan.trialDaysLeft} giorni. Poi si passa al piano Gratuito (1 cliente),
              a meno che tu non scelga un piano.
            </>
          )}
        </p>
      )}

      {atLimit && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          {plan.plan === "free"
            ? "Il piano Gratuito include 1 cliente. "
            : "Hai raggiunto il limite di clienti del tuo piano. "}
          <Link href="/settings" className="font-semibold underline">
            Passa a un piano superiore
          </Link>{" "}
          per aggiungerne altri (i report restano sempre illimitati).
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/clients/${c.id}`}
            className="card flex items-center gap-4 transition hover:border-brand-300 hover:shadow-md"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: c.colore_primario }}
            >
              {c.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.logo_url} alt={c.nome} className="h-full w-full object-cover" />
              ) : (
                c.nome.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{c.nome}</p>
              <p className="text-sm text-slate-500">
                {c.reports?.[0]?.count ?? 0} report
              </p>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="card mt-6 text-center">
          <p className="text-slate-600">Nessun cliente ancora. Creane uno per iniziare.</p>
          <Link href="/clients/new" className="btn-primary mt-4">
            + Crea il primo cliente
          </Link>
        </div>
      )}
    </div>
  );
}
