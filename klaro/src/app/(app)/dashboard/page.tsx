import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { maxClients, PLAN_LABELS } from "@/lib/plans";
import { isDemoClientName } from "@/lib/demoContent";
import FeedbackButton from "@/components/FeedbackButton";
import { FEEDBACK_URL, mailtoFounder } from "@/lib/founderConfig";
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

  // Solo due voci hanno un segnale affidabile nei dati già presenti; le
  // altre restano semplici passaggi, senza fingere di sapere se sono stati
  // davvero completati (non possiamo saperlo, es. se un PDF è stato aperto
  // o inviato davvero).
  const clientiReali = list.filter((c) => !isDemoClientName(c.nome));
  const haPersonalizzatoDemo = clientiReali.length > 0;
  const haCreatoReport = clientiReali.some((c) => (c.reports?.[0]?.count ?? 0) > 0);

  const checklist: { label: string; done: boolean | null }[] = [
    { label: "Personalizza il cliente demo", done: haPersonalizzatoDemo },
    { label: "Crea il primo report", done: haCreatoReport },
    { label: "Controlla il commento AI", done: null },
    { label: "Scarica il PDF", done: null },
    { label: "Racconta a Pierpaolo com'è andata", done: null },
  ];

  const feedbackHref = FEEDBACK_URL ?? mailtoFounder("Klaro: limite clienti raggiunto");

  return (
    <div>
      <p className="text-sm text-slate-600">
        Ciao{p?.nome ? ` ${p.nome}` : ""}, grazie per essere tra le prime persone che stanno
        costruendo Klaro insieme a Pierpaolo.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="card mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Prima volta su Klaro? Prova questi passaggi
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                className={
                  item.done === true
                    ? "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white"
                    : "h-4 w-4 shrink-0 rounded-full border border-slate-300"
                }
              >
                {item.done === true ? "✓" : ""}
              </span>
              <span className={item.done === true ? "text-slate-400 line-through" : ""}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <FeedbackButton />
        </div>
      </div>

      {atLimit && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Hai raggiunto il limite di {limit} clienti reali previsto per questa beta.{" "}
          <a href={feedbackHref} target={FEEDBACK_URL ? "_blank" : undefined} rel="noopener noreferrer" className="font-semibold underline">
            Scrivi a Pierpaolo
          </a>{" "}
          se ti serve più spazio.
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
