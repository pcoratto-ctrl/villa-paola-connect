"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/lib/types";
import { containsDemoObiettivi } from "@/lib/demoContent";

const PRESET_COLORS = [
  "#2563eb", "#b45309", "#047857", "#be123c", "#7c3aed", "#0f766e", "#1e293b",
  "#7f1d1d", // bordeaux scuro
  "#0f172a", // blu navy quasi nero, professionale
];

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export default function ClientForm({ existing }: { existing?: Client }) {
  const router = useRouter();
  const [nome, setNome] = useState(existing?.nome ?? "");
  const [colore, setColoreState] = useState(existing?.colore_primario ?? "#2563eb");
  const [hexInput, setHexInput] = useState(existing?.colore_primario ?? "#2563eb");
  const [obiettivi, setObiettivi] = useState(existing?.obiettivi_testo ?? "");

  function updateColore(c: string) {
    setColoreState(c);
    setHexInput(c);
  }

  function onHexInputChange(v: string) {
    setHexInput(v);
    if (HEX_PATTERN.test(v)) setColoreState(v);
  }
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(existing?.logo_url ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);
    if (file && file.size > 2 * 1024 * 1024) {
      setError("Il logo deve pesare meno di 2 MB.");
      return;
    }
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nome.trim()) {
      setError("Il nome del cliente è obbligatorio.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessione scaduta, accedi di nuovo.");
      setSaving(false);
      return;
    }

    try {
      let logo_url = existing?.logo_url ?? null;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop() || "png";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("logos")
          .upload(path, logoFile, { upsert: true });
        if (upErr) throw new Error(`Errore caricamento logo: ${upErr.message}`);
        logo_url = supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        nome: nome.trim(),
        colore_primario: colore,
        obiettivi_testo: obiettivi.trim() || null,
        logo_url,
      };

      if (existing) {
        const { error: err } = await supabase
          .from("clients")
          .update(payload)
          .eq("id", existing.id);
        if (err) throw new Error(err.message);
        router.refresh();
      } else {
        const { data, error: err } = await supabase
          .from("clients")
          .insert({ ...payload, user_id: user.id })
          .select("id")
          .single();
        if (err) throw new Error(err.message);
        router.push(`/clients/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto, riprova.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label className="label" htmlFor="nome">Nome cliente *</label>
        <input
          id="nome"
          className="input"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Es. Bar Centrale"
          required
        />
      </div>

      <div>
        <label className="label">Logo (PNG/JPG, max 2 MB)</label>
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xl font-bold text-white"
            style={{ backgroundColor: colore }}
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              (nome || "?").charAt(0).toUpperCase()
            )}
          </div>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onLogoChange}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="colore">Colore primario del brand</label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateColore(c)}
              className={`h-9 w-9 rounded-lg transition ${colore === c ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
              style={{ backgroundColor: c }}
              aria-label={`Colore ${c}`}
            />
          ))}
          <input
            id="colore"
            type="color"
            value={colore}
            onChange={(e) => updateColore(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            aria-label="Scegli colore personalizzato"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => onHexInputChange(e.target.value)}
            placeholder="#rrggbb"
            className="input w-28 !py-1.5 text-sm"
            aria-label="Colore in formato esadecimale"
          />
        </div>
        {!HEX_PATTERN.test(hexInput) && (
          <p className="mt-1 text-xs text-amber-600">
            Formato non valido: usa 6 cifre esadecimali precedute da # (es. #7f1d1d).
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="obiettivi">Obiettivi del cliente</label>
        {containsDemoObiettivi(obiettivi) && (
          <p className="mb-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
            Questo campo contiene ancora il testo di esempio del cliente demo: valuta se
            sostituirlo con gli obiettivi reali di questo cliente.
          </p>
        )}
        <textarea
          id="obiettivi"
          className="input min-h-28"
          value={obiettivi}
          onChange={(e) => setObiettivi(e.target.value)}
          placeholder="Es. Aumentare la notorietà del locale, portare più clienti agli eventi del weekend…"
        />
        <p className="mt-1 text-xs text-slate-400">
          L&apos;AI usa gli obiettivi per scrivere un commento più pertinente.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
        {saving ? "Salvataggio…" : existing ? "Salva modifiche" : "Crea cliente"}
      </button>
    </form>
  );
}
