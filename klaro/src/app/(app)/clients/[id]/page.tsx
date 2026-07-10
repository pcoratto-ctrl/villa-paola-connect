import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/ClientForm";
import DeleteClientButton from "@/components/DeleteClientButton";
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
              Nessun report ancora per questo cliente.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((r) => (
                <Link
                  key={r.id}
                  href={`/reports/${r.id}`}
                  className="card flex items-center justify-between !p-4 transition hover:border-brand-300 hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {meseLabel(r.mese, r.anno)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {CANALI.find((ch) => ch.value === r.canale)?.label} ·{" "}
                      {r.stato === "bozza" ? "Bozza" : "Completo"}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: c.colore_primario }}
                  >
                    Apri →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
