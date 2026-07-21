import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/ClientForm";
import DeleteClientButton from "@/components/DeleteClientButton";
import DeleteReportButton from "@/components/DeleteReportButton";
import TransformDemoClientButton from "@/components/TransformDemoClientButton";
import { isDemoClientName } from "@/lib/demoContent";
import { meseLabel, CANALI } from "@/lib/types";
import type { Client, Report } from "@/lib/types";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: reports }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("reports")
      .select("*")
      .eq("client_id", id)
      .order("anno", { ascending: false })
      .order("mese", { ascending: false }),
  ]);

  if (!client) notFound();
  const c = client as Client;
  const list = (reports ?? []) as Report[];

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
        ← Torna ai clienti
      </Link>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{c.nome}</h1>
        <Link href={`/reports/new?client=${c.id}`} className="btn-primary">
          Nuovo report per {c.nome.split(" ")[0]}
        </Link>
      </div>

      {isDemoClientName(c.nome) && (
        <div className="mt-6">
          <TransformDemoClientButton clientId={c.id} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Brand */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Brand</h2>
          <ClientForm existing={c} />
          <div className="mt-4 text-right">
            <DeleteClientButton clientId={c.id} clientName={c.nome} />
          </div>
        </section>

        {/* Storico report */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Storico report</h2>
          {list.length === 0 ? (
            <div className="card text-center text-sm text-slate-500">
              Nessun report ancora per questo cliente. Il primo si crea in 5 minuti.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Azione rapida: nuova bozza precompilata dal report più recente */}
              <Link
                href={`/reports/new?client=${c.id}&duplicate=${list[0].id}`}
                className="card flex items-center justify-between !border-dashed !p-4 text-sm transition hover:border-brand-400 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-brand-700">⧉ Duplica dal mese scorso</p>
                  <p className="text-slate-500">
                    Nuovo report con canale, contesto e follower di partenza già compilati da{" "}
                    {meseLabel(list[0].mese, list[0].anno)}: inserisci solo i numeri nuovi.
                  </p>
                </div>
              </Link>
              {list.map((r) => (
                <div
                  key={r.id}
                  className="card flex items-center justify-between !p-4 transition hover:border-brand-300 hover:shadow-md"
                >
                  <Link href={`/reports/${r.id}`} className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {meseLabel(r.mese, r.anno)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {CANALI.find((ch) => ch.value === r.canale)?.label} ·{" "}
                      {r.stato === "bozza" ? "Bozza" : "Completo"}
                    </p>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/reports/new?client=${c.id}&duplicate=${r.id}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-brand-300 hover:text-brand-700"
                      title="Crea il report del mese successivo partendo da questo"
                    >
                      ⧉ Duplica
                    </Link>
                    <Link
                      href={`/reports/${r.id}`}
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: c.colore_primario }}
                    >
                      Apri →
                    </Link>
                    <DeleteReportButton
                      reportId={r.id}
                      periodo={meseLabel(r.mese, r.anno)}
                      clientName={c.nome}
                      compact
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
