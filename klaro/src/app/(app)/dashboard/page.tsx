import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { maxClients, PLAN_LABELS } from "@/lib/plans";
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

  const p = profile as Profile | null;
  const list = (clients ?? []) as (Client & { reports: { count: number }[] })[];
  const limit = maxClients(p?.piano ?? "free");
  const atLimit = list.length >= limit;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">I tuoi clienti</h1>
          <p className="mt-1 text-sm text-slate-500">
            Piano: {PLAN_LABELS[p?.piano ?? "free"]} · {list.length}/{limit} clienti
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={atLimit ? "/settings" : "/clients/new"}
            className={atLimit ? "btn-secondary" : "btn-secondary"}
          >
            + Nuovo cliente
          </Link>
          <Link href="/reports/new" className="btn-primary">
            Nuovo report
          </Link>
        </div>
      </div>

      {atLimit && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Hai raggiunto il limite di clienti del tuo piano.{" "}
          <Link href="/settings" className="font-semibold underline">
            Passa a un piano superiore
          </Link>{" "}
          per aggiungerne altri.
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
