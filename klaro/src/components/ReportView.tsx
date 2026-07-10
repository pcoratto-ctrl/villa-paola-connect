"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReportCharts from "@/components/ReportCharts";
import { CANALI, meseLabel } from "@/lib/types";
import type { Client, Report } from "@/lib/types";

export default function ReportView({
  report,
  client,
  prev,
}: {
  report: Report;
  client: Client;
  prev: Report | null;
}) {
  const router = useRouter();
  const [commento, setCommento] = useState(report.commento_ai ?? "");
  const [editing, setEditing] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveComment() {
    setSavingComment(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("reports")
      .update({ commento_ai: commento.trim() || null, stato: commento.trim() ? "completo" : "bozza" })
      .eq("id", report.id);
    setSavingComment(false);
    if (error) {
      setMessage(`Errore nel salvataggio: ${error.message}`);
      return;
    }
    setEditing(false);
    setMessage("Commento salvato.");
    router.refresh();
  }

  async function downloadPdf() {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await fetch(`/api/pdf?report=${report.id}`);
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || `Errore ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${client.nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${report.anno}-${String(report.mese).padStart(2, "0")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(
        `Generazione PDF non riuscita (${err instanceof Error ? err.message : "errore"}). ` +
          `In alternativa usa "Stampa questa pagina" qui sotto: questa anteprima è già impaginata.`
      );
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/clients/${client.id}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← {client.nome}
        </Link>
        <div className="flex gap-2">
          <button className="btn-secondary !py-2.5" onClick={() => window.print()}>
            Stampa questa pagina
          </button>
          <button className="btn-primary !py-2.5" onClick={downloadPdf} disabled={pdfLoading}>
            {pdfLoading ? "Generazione PDF…" : "⬇ Scarica PDF"}
          </button>
        </div>
      </div>

      {pdfError && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 print:hidden">
          {pdfError}
        </p>
      )}

      {/* Copertina */}
      <div
        className="mt-4 flex items-center justify-between rounded-2xl p-6 text-white"
        style={{ backgroundColor: client.colore_primario }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/70">
            Report {CANALI.find((c) => c.value === report.canale)?.label} — social organico
          </p>
          <h1 className="text-2xl font-bold">{client.nome}</h1>
          <p className="text-sm text-white/80">{meseLabel(report.mese, report.anno)}</p>
        </div>
        {client.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={client.logo_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
        )}
      </div>

      <div className="mt-6">
        <ReportCharts
          data={report.dati_json}
          prev={prev?.dati_json ?? null}
          color={client.colore_primario}
          meseCorrente={meseLabel(report.mese, report.anno)}
          mesePrecedente={prev ? meseLabel(prev.mese, prev.anno) : null}
        />
      </div>

      {/* Commento */}
      <div className="card mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Commento del consulente</h3>
          {!editing && (
            <button
              className="text-sm font-semibold text-brand-600 hover:underline print:hidden"
              onClick={() => setEditing(true)}
            >
              ✎ Modifica
            </button>
          )}
        </div>

        {editing ? (
          <>
            <textarea
              className="input min-h-72 leading-relaxed"
              value={commento}
              onChange={(e) => setCommento(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button className="btn-primary !py-2.5" onClick={saveComment} disabled={savingComment}>
                {savingComment ? "Salvataggio…" : "Salva commento"}
              </button>
              <button
                className="btn-secondary !py-2.5"
                onClick={() => {
                  setCommento(report.commento_ai ?? "");
                  setEditing(false);
                }}
              >
                Annulla
              </button>
            </div>
          </>
        ) : commento ? (
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            {commento.split(/\n\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            Nessun commento ancora. Clicca &quot;Modifica&quot; per scriverlo.
          </p>
        )}
        {message && <p className="mt-3 text-sm text-emerald-600 print:hidden">{message}</p>}
      </div>
    </div>
  );
}
