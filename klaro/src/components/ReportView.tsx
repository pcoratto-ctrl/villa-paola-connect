"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReportCharts from "@/components/ReportCharts";
import { CANALI, meseLabel } from "@/lib/types";
import type { Client, Report } from "@/lib/types";
import { buildEmailCliente, matchTitoloSezione } from "@/lib/commento";

// Rende il commento con i titoli delle 5 sezioni evidenziati
function CommentoFormattato({ testo, color }: { testo: string; color: string }) {
  const blocks: { titolo?: string; righe: string[] }[] = [{ righe: [] }];
  for (const line of testo.split("\n")) {
    if (matchTitoloSezione(line) >= 0) {
      blocks.push({ titolo: line.replace(/^\s*\d+[.)]\s*/, "").replace(/[*#]/g, "").trim(), righe: [] });
    } else {
      blocks[blocks.length - 1].righe.push(line);
    }
  }
  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {blocks
        .filter((b) => b.titolo || b.righe.join("").trim())
        .map((b, i) => (
          <div key={i}>
            {b.titolo && (
              <h4 className="mb-1.5 font-bold" style={{ color }}>
                {b.titolo}
              </h4>
            )}
            {b.righe
              .join("\n")
              .split(/\n\n+/)
              .filter((p) => p.trim())
              .map((p, j) => (
                <p key={j} className="mb-2">
                  {p.trim()}
                </p>
              ))}
          </div>
        ))}
    </div>
  );
}

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
  const [valutazione, setValutazione] = useState(report.dati_json.valutazione_obiettivi ?? "");
  const [editing, setEditing] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const periodo = meseLabel(report.mese, report.anno);

  // Email pronta da inviare al cliente (modificabile, mai inviata da Klaro)
  const [email, setEmail] = useState(() =>
    buildEmailCliente({
      nomeCliente: client.nome.replace(/\s*\(demo\)\s*$/i, ""),
      periodo,
      commento: report.commento_ai,
    })
  );
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setMessage("Copia non riuscita: seleziona il testo e copialo manualmente.");
    }
  }

  async function saveComment() {
    setSavingComment(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("reports")
      .update({
        commento_ai: commento.trim() || null,
        stato: commento.trim() ? "completo" : "bozza",
        dati_json: { ...report.dati_json, valutazione_obiettivi: valutazione.trim() || undefined },
      })
      .eq("id", report.id);
    setSavingComment(false);
    if (error) {
      setMessage(`Salvataggio non riuscito: ${error.message}. Riprova.`);
      return;
    }
    setEditing(false);
    setMessage("Modifiche salvate.");
    setEmail(
      buildEmailCliente({
        nomeCliente: client.nome.replace(/\s*\(demo\)\s*$/i, ""),
        periodo,
        commento: commento.trim() || null,
      })
    );
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
          <p className="text-sm text-white/80">{periodo}</p>
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
          meseCorrente={periodo}
          mesePrecedente={prev ? meseLabel(prev.mese, prev.anno) : null}
        />
      </div>

      {/* Obiettivi del cliente */}
      {(client.obiettivi_testo || report.dati_json.valutazione_obiettivi) && (
        <div className="card mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Obiettivi del cliente</h3>
          {client.obiettivi_testo && (
            <p className="mb-2 text-sm italic text-slate-500">“{client.obiettivi_testo}”</p>
          )}
          <p className="text-sm leading-relaxed text-slate-700">
            {report.dati_json.valutazione_obiettivi ||
              "I dati di questo mese non sono sufficienti per una valutazione affidabile dell'andamento rispetto agli obiettivi."}
          </p>
        </div>
      )}

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
            <label className="label mt-4">Valutazione rispetto agli obiettivi (per il PDF)</label>
            <textarea
              className="input min-h-24 leading-relaxed"
              value={valutazione}
              onChange={(e) => setValutazione(e.target.value)}
              placeholder="Se i dati non bastano, va bene scriverlo esplicitamente."
            />
            <div className="mt-3 flex gap-2">
              <button className="btn-primary !py-2.5" onClick={saveComment} disabled={savingComment}>
                {savingComment ? "Salvataggio…" : "Salva modifiche"}
              </button>
              <button
                className="btn-secondary !py-2.5"
                onClick={() => {
                  setCommento(report.commento_ai ?? "");
                  setValutazione(report.dati_json.valutazione_obiettivi ?? "");
                  setEditing(false);
                }}
              >
                Annulla
              </button>
            </div>
          </>
        ) : commento ? (
          <CommentoFormattato testo={commento} color={client.colore_primario} />
        ) : (
          <p className="text-sm text-slate-400">
            Nessun commento ancora. Clicca &quot;Modifica&quot; per scriverlo.
          </p>
        )}
        {message && <p className="mt-3 text-sm text-emerald-600 print:hidden">{message}</p>}
      </div>

      {/* Messaggio pronto da inviare al cliente */}
      <div className="card mt-6 print:hidden">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Messaggio pronto da inviare al cliente
          </h3>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            }`}
            onClick={copyEmail}
          >
            {copied ? "✓ Copiato!" : "Copia email"}
          </button>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          Modifica il testo come preferisci, poi copialo e incollalo nella tua email insieme al
          PDF. Klaro non invia nulla al posto tuo.
        </p>
        <textarea
          className="input min-h-56 leading-relaxed"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </div>
  );
}
