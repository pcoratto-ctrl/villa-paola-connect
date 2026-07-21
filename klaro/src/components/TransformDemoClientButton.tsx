"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isDemoCommento } from "@/lib/demoContent";

export default function TransformDemoClientButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConferma() {
    const nomeTrim = nome.trim();
    if (!nomeTrim) {
      setError("Inserisci il nome del cliente reale.");
      return;
    }
    if (
      !window.confirm(
        `Il cliente verrà rinominato in "${nomeTrim}" e i report demo di esempio collegati verranno eliminati. Il tuo account e i tuoi dati non verranno toccati. Confermi?`
      )
    )
      return;

    setSaving(true);
    setError(null);
    const supabase = createClient();

    // Elimina esclusivamente i report demo (riconosciuti per contenuto),
    // mai report reali eventualmente già creati su questo cliente.
    const { data: reports, error: fetchErr } = await supabase
      .from("reports")
      .select("id, commento_ai")
      .eq("client_id", clientId);
    if (fetchErr) {
      setError(`Errore nel leggere lo storico report: ${fetchErr.message}`);
      setSaving(false);
      return;
    }
    const demoReportIds = (reports ?? [])
      .filter((r) => isDemoCommento(r.commento_ai as string | null))
      .map((r) => r.id as string);

    if (demoReportIds.length > 0) {
      const { error: delErr } = await supabase.from("reports").delete().in("id", demoReportIds);
      if (delErr) {
        setError(`Errore nell'eliminare i report demo: ${delErr.message}`);
        setSaving(false);
        return;
      }
    }

    const { error: updErr } = await supabase
      .from("clients")
      .update({ nome: nomeTrim })
      .eq("id", clientId);
    if (updErr) {
      setError(`Errore nel rinominare il cliente: ${updErr.message}`);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  if (!open) {
    return (
      <div className="card mb-6 border-brand-200 bg-brand-50">
        <p className="font-semibold text-brand-900">
          Questo è il cliente demo pre-caricato per esplorare Klaro.
        </p>
        <p className="mt-1 text-sm text-brand-800">
          Puoi usare questo stesso spazio per un cliente reale: rinomineremo il cliente ed
          elimineremo solo i 2 report demo di esempio, senza toccare il resto del tuo account.
        </p>
        <button className="btn-primary mt-4" onClick={() => setOpen(true)}>
          Usa questo spazio per un cliente reale
        </button>
      </div>
    );
  }

  return (
    <div className="card mb-6 border-brand-200 bg-brand-50">
      <label className="label" htmlFor="nome-cliente-reale">
        Nome del cliente reale
      </label>
      <input
        id="nome-cliente-reale"
        className="input"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Es. Ristorante da Mario"
        autoFocus
      />
      <p className="mt-2 text-xs text-brand-800">
        Verranno eliminati solo i report demo di esempio collegati a questo cliente. Potrai poi
        modificare colore e obiettivi qui sotto.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button className="btn-primary !py-2.5" onClick={handleConferma} disabled={saving}>
          {saving ? "Trasformazione…" : "Conferma e trasforma"}
        </button>
        <button className="btn-secondary !py-2.5" onClick={() => setOpen(false)} disabled={saving}>
          Annulla
        </button>
      </div>
    </div>
  );
}
