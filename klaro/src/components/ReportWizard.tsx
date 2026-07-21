"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReportCharts from "@/components/ReportCharts";
import DataImportPanel from "@/components/DataImportPanel";
import { CANALI, MESI, meseLabel } from "@/lib/types";
import type { Canale, Client, ContestoMese, Report, ReportData } from "@/lib/types";
import { prevMonth } from "@/lib/utils";
import type { ImportedValues } from "@/lib/dataImport/mapping";

const DRAFT_KEY = "klaro-report-draft";

type FormState = {
  clientId: string;
  canale: Canale;
  mese: number;
  anno: number;
  reach: string;
  impression: string;
  follower_inizio: string;
  follower_fine: string;
  engagement_rate: string;
  engagementMode: "manual" | "calcolato";
  interazioni_totali: string;
  numero_post: string;
  visite_profilo: string;
  click_link: string;
  top_post: { testo: string; metrica: string }[];
  risultati_note: string;
  // Contesto del mese (tutto opzionale)
  ctx_cosa_fatto: string;
  ctx_andato_bene: string;
  ctx_non_funzionato: string;
  ctx_priorita: string;
  commento: string;
  valutazione_obiettivi: string;
};

function defaultForm(clientId: string): FormState {
  const now = new Date();
  const prev = prevMonth(now.getMonth() + 1, now.getFullYear());
  return {
    clientId,
    canale: "instagram",
    mese: prev.mese,
    anno: prev.anno,
    reach: "",
    impression: "",
    follower_inizio: "",
    follower_fine: "",
    engagement_rate: "",
    engagementMode: "manual",
    interazioni_totali: "",
    numero_post: "",
    visite_profilo: "",
    click_link: "",
    top_post: [
      { testo: "", metrica: "" },
      { testo: "", metrica: "" },
      { testo: "", metrica: "" },
    ],
    risultati_note: "",
    ctx_cosa_fatto: "",
    ctx_andato_bene: "",
    ctx_non_funzionato: "",
    ctx_priorita: "",
    commento: "",
    valutazione_obiettivi: "",
  };
}

export default function ReportWizard({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("client");
  const duplicateId = searchParams.get("duplicate");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() =>
    defaultForm(preselected && clients.some((c) => c.id === preselected) ? preselected : clients[0].id)
  );
  const [prevReport, setPrevReport] = useState<Report | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [duplicated, setDuplicated] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const client = useMemo(
    () => clients.find((c) => c.id === form.clientId) ?? clients[0],
    [clients, form.clientId]
  );

  // All'apertura: se arriviamo da "Duplica dal mese scorso" precompila dal
  // report indicato (canale, contesto, mese successivo — i numeri restano vuoti).
  // Altrimenti ripristina l'eventuale bozza salvata su questo dispositivo.
  useEffect(() => {
    async function init() {
      if (duplicateId) {
        const supabase = createClient();
        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("id", duplicateId)
          .maybeSingle();
        if (data) {
          const src = data as Report;
          const next =
            src.mese === 12
              ? { mese: 1, anno: src.anno + 1 }
              : { mese: src.mese + 1, anno: src.anno };
          setForm((f) => ({
            ...defaultForm(src.client_id),
            canale: src.canale,
            mese: next.mese,
            anno: next.anno,
            // Il follower di partenza del nuovo mese è quello di chiusura del precedente
            follower_inizio: String(src.dati_json.follower_fine ?? ""),
            ctx_cosa_fatto: src.dati_json.contesto?.cosa_fatto ?? "",
            ctx_andato_bene: src.dati_json.contesto?.andato_bene ?? "",
            ctx_non_funzionato: src.dati_json.contesto?.non_funzionato ?? "",
            ctx_priorita: src.dati_json.contesto?.priorita_prossimo ?? "",
            clientId: src.client_id,
            top_post: f.top_post,
          }));
          setDuplicated(true);
          setStep(2);
          return;
        }
      }
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<FormState>;
          if (parsed.clientId && clients.some((c) => c.id === parsed.clientId)) {
            setForm((f) => ({ ...f, ...parsed }));
          }
        }
      } catch {
        /* bozza corrotta: si riparte dal form vuoto */
      }
    }
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva la bozza a ogni modifica: così un errore non fa perdere nulla
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* storage pieno: ignora */
    }
  }, [form]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setTopPost(i: number, field: "testo" | "metrica", value: string) {
    setForm((f) => {
      const top = f.top_post.map((p, idx) => (idx === i ? { ...p, [field]: value } : p));
      return { ...f, top_post: top };
    });
  }

  // Classi CSS per evidenziare per qualche secondo i campi appena importati.
  function hClass(key: string): string {
    return highlightedFields.has(key) ? " ring-2 ring-emerald-400 bg-emerald-50" : "";
  }

  function hasExistingValue(key: keyof ImportedValues): boolean {
    switch (key) {
      case "follower_inizio": return form.follower_inizio.trim() !== "";
      case "follower_fine": return form.follower_fine.trim() !== "";
      case "reach": return form.reach.trim() !== "";
      case "impression": return form.impression.trim() !== "";
      case "visite_profilo": return form.visite_profilo.trim() !== "";
      case "click_link": return form.click_link.trim() !== "";
      case "numero_post": return form.numero_post.trim() !== "";
      case "engagement_rate": return form.engagement_rate.trim() !== "" || form.interazioni_totali.trim() !== "";
      case "top_contenuto_1": return form.top_post[0].testo.trim() !== "";
      case "top_contenuto_2": return form.top_post[1].testo.trim() !== "";
      case "top_contenuto_3": return form.top_post[2].testo.trim() !== "";
      case "note": return form.risultati_note.trim() !== "";
      default: return false;
    }
  }

  // Applica i dati importati (CSV o incolla) ai campi normali del wizard:
  // restano sempre modificabili prima di continuare, come per l'inserimento
  // manuale. Se sovrascrive dati gia' inseriti a mano, chiede conferma.
  function applyImportedValues(values: ImportedValues) {
    const incomingKeys = Object.keys(values) as (keyof ImportedValues)[];
    if (incomingKeys.length === 0) return;
    const hasCollision = incomingKeys.some(hasExistingValue);
    if (hasCollision) {
      const proceed = window.confirm(
        "Alcuni campi contengono già dati inseriti: verranno sovrascritti con i valori importati. Continuare?"
      );
      if (!proceed) return;
    }

    const highlighted = new Set<string>();
    setForm((f) => {
      const next = { ...f, top_post: f.top_post.map((p) => ({ ...p })) };
      if (values.follower_inizio !== undefined) { next.follower_inizio = String(values.follower_inizio); highlighted.add("follower_inizio"); }
      if (values.follower_fine !== undefined) { next.follower_fine = String(values.follower_fine); highlighted.add("follower_fine"); }
      if (values.reach !== undefined) { next.reach = String(values.reach); highlighted.add("reach"); }
      if (values.impression !== undefined) { next.impression = String(values.impression); highlighted.add("impression"); }
      if (values.visite_profilo !== undefined) { next.visite_profilo = String(values.visite_profilo); highlighted.add("visite_profilo"); }
      if (values.click_link !== undefined) { next.click_link = String(values.click_link); highlighted.add("click_link"); }
      if (values.numero_post !== undefined) { next.numero_post = String(values.numero_post); highlighted.add("numero_post"); }

      // Engagement: se il file ha gia' un tasso esplicito lo usiamo senza
      // sovrascriverlo con nient'altro; altrimenti, se ci sono interazioni,
      // passiamo alla modalita' "calcolato" gia' esistente nel wizard.
      if (values.engagement_rate !== undefined) {
        next.engagementMode = "manual";
        next.engagement_rate = values.engagement_rate.toString().replace(".", ",");
        highlighted.add("engagement_rate");
      } else if (values.interazioni !== undefined) {
        next.engagementMode = "calcolato";
        next.interazioni_totali = String(values.interazioni);
        highlighted.add("engagement_rate");
      }

      if (values.top_contenuto_1 !== undefined) { next.top_post[0].testo = values.top_contenuto_1; highlighted.add("top_contenuto_1"); }
      if (values.top_contenuto_2 !== undefined) { next.top_post[1].testo = values.top_contenuto_2; highlighted.add("top_contenuto_2"); }
      if (values.top_contenuto_3 !== undefined) { next.top_post[2].testo = values.top_contenuto_3; highlighted.add("top_contenuto_3"); }
      if (values.note !== undefined) { next.risultati_note = values.note; highlighted.add("note"); }

      return next;
    });
    setHighlightedFields(highlighted);
    setImportMessage("Dati importati. Controllali prima di continuare.");
    setTimeout(() => setHighlightedFields(new Set()), 4000);
  }

  function validateNumbers(): string[] {
    const errs: string[] = [];
    const numFields: [keyof FormState, string][] = [
      ["reach", "Reach"],
      ["impression", "Impression"],
      ["follower_inizio", "Follower a inizio mese"],
      ["follower_fine", "Follower a fine mese"],
      ["numero_post", "Numero di post"],
    ];
    for (const [key, label] of numFields) {
      const v = form[key] as string;
      if (v.trim() === "" || isNaN(Number(v)) || Number(v) < 0 || !Number.isInteger(Number(v))) {
        errs.push(`${label}: serve un numero intero, senza punti né lettere (es. 24900).`);
      }
    }

    // Campi facoltativi: validi solo se compilati
    const optionalIntFields: [keyof FormState, string][] = [
      ["visite_profilo", "Visite al profilo"],
      ["click_link", "Click al link"],
    ];
    for (const [key, label] of optionalIntFields) {
      const v = (form[key] as string).trim();
      if (v !== "" && (isNaN(Number(v)) || Number(v) < 0 || !Number.isInteger(Number(v)))) {
        errs.push(`${label}: se lo compili, serve un numero intero valido.`);
      }
    }

    if (form.engagementMode === "manual") {
      const er = Number(form.engagement_rate.replace(",", "."));
      if (form.engagement_rate.trim() === "" || isNaN(er) || er < 0 || er > 100) {
        errs.push("Engagement rate: un valore tra 0 e 100, la virgola va bene (es. 3,5).");
      }
    } else {
      const interazioni = Number(form.interazioni_totali);
      const reach = Number(form.reach);
      if (
        form.interazioni_totali.trim() === "" ||
        isNaN(interazioni) ||
        interazioni < 0 ||
        !Number.isInteger(interazioni)
      ) {
        errs.push("Interazioni totali: serve un numero intero valido per calcolare l'engagement.");
      } else if (!reach || reach <= 0) {
        errs.push(
          "Per calcolare l'engagement dalle interazioni serve prima un Reach valido, maggiore di zero."
        );
      }
    }

    if (!form.top_post.some((p) => p.testo.trim())) {
      errs.push("Racconta almeno uno dei 3 contenuti migliori del mese: serve all'AI per il commento.");
    }
    return errs;
  }

  // Calcola l'engagement rate dalle interazioni totali (arrotondato a 1
  // decimale). Non inventa nulla: se manca il denominatore, restituisce 0.
  function engagementRateCalcolato(): number {
    const interazioni = Number(form.interazioni_totali);
    const reach = Number(form.reach);
    if (!reach || reach <= 0 || isNaN(interazioni)) return 0;
    return Math.round((interazioni / reach) * 1000) / 10;
  }

  function engagementRateFinale(): number {
    return form.engagementMode === "calcolato"
      ? engagementRateCalcolato()
      : Number(form.engagement_rate.replace(",", "."));
  }

  function buildContesto(): ContestoMese | undefined {
    const c: ContestoMese = {};
    if (form.ctx_cosa_fatto.trim()) c.cosa_fatto = form.ctx_cosa_fatto.trim();
    if (form.ctx_andato_bene.trim()) c.andato_bene = form.ctx_andato_bene.trim();
    if (form.ctx_non_funzionato.trim()) c.non_funzionato = form.ctx_non_funzionato.trim();
    if (form.ctx_priorita.trim()) c.priorita_prossimo = form.ctx_priorita.trim();
    return Object.keys(c).length > 0 ? c : undefined;
  }

  function buildData(): ReportData {
    return {
      reach: Number(form.reach),
      impression: Number(form.impression),
      follower_inizio: Number(form.follower_inizio),
      follower_fine: Number(form.follower_fine),
      engagement_rate: engagementRateFinale(),
      numero_post: Number(form.numero_post),
      top_post: form.top_post.filter((p) => p.testo.trim()),
      risultati_note: form.risultati_note.trim(),
      contesto: buildContesto(),
      valutazione_obiettivi: form.valutazione_obiettivi.trim() || undefined,
      visite_profilo: form.visite_profilo.trim() !== "" ? Number(form.visite_profilo) : undefined,
      click_link: form.click_link.trim() !== "" ? Number(form.click_link) : undefined,
    };
  }

  function goToContext() {
    const errs = validateNumbers();
    setErrors(errs);
    if (errs.length > 0) return;
    setStep(3);
  }

  async function goToPreview() {
    // Cerca il report del mese precedente per il confronto
    const supabase = createClient();
    const p = prevMonth(form.mese, form.anno);
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("client_id", form.clientId)
      .eq("canale", form.canale)
      .eq("mese", p.mese)
      .eq("anno", p.anno)
      .maybeSingle();
    setPrevReport((data as Report) ?? null);
    setStep(4);

    // Genera il commento AI se non c'è già
    if (!form.commento.trim()) {
      void generateComment(data as Report | null);
    }
  }

  async function generateComment(prev: Report | null) {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientId,
          canale: form.canale,
          mese: form.mese,
          anno: form.anno,
          dati: { ...buildData(), contesto: undefined, valutazione_obiettivi: undefined },
          contesto: buildContesto() ?? null,
          prev: prev?.dati_json
            ? { ...prev.dati_json, contesto: undefined, valutazione_obiettivi: undefined }
            : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore nella generazione del commento.");
      set("commento", json.commento);
      if (json.valutazione_obiettivi) set("valutazione_obiettivi", json.valutazione_obiettivi);
    } catch (err) {
      setAiError(
        (err instanceof Error ? err.message : "Errore imprevisto.") +
          " Nessun dato è andato perso: la bozza è salvata su questo dispositivo. Riprova, oppure scrivi il commento a mano."
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function saveReport() {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reports")
      .insert({
        client_id: form.clientId,
        mese: form.mese,
        anno: form.anno,
        canale: form.canale,
        dati_json: buildData(),
        commento_ai: form.commento.trim() || null,
        stato: form.commento.trim() ? "completo" : "bozza",
      })
      .select("id")
      .single();

    if (error) {
      setSaveError(
        error.code === "23505"
          ? `Esiste già un report di ${meseLabel(form.mese, form.anno)} (${form.canale}) per questo cliente. Aprilo dallo storico del cliente oppure scegli un altro mese.`
          : `Salvataggio non riuscito: ${error.message}. La bozza resta salvata su questo dispositivo, puoi riprovare.`
      );
      setSaving(false);
      return;
    }
    localStorage.removeItem(DRAFT_KEY);
    router.push(`/reports/${data.id}`);
  }

  const steps = ["Cliente", "Numeri", "Contesto", "Anteprima"];

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
        ← Annulla
      </Link>
      <h1 className="mb-2 mt-2 text-2xl font-bold text-slate-900">Nuovo report</h1>
      {duplicated && (
        <p className="mb-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
          Bozza creata dal report precedente: canale, contesto e follower di partenza sono già
          compilati. Inserisci solo i numeri del nuovo mese e aggiorna il contesto.
        </p>
      )}

      {/* Indicatore step */}
      <ol className="mb-8 flex items-center gap-2 text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step > i + 1
                  ? "bg-emerald-500 text-white"
                  : step === i + 1
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </span>
            <span className={`hidden sm:inline ${step === i + 1 ? "font-semibold text-slate-900" : "text-slate-400"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-4 bg-slate-300 sm:w-6" />}
          </li>
        ))}
      </ol>

      {/* STEP 1: cliente */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Per quale cliente è questo report?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {clients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set("clientId", c.id)}
                className={`card flex items-center gap-3 text-left transition ${
                  form.clientId === c.id
                    ? "border-brand-500 ring-2 ring-brand-100"
                    : "hover:border-slate-300"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg font-bold text-white"
                  style={{ backgroundColor: c.colore_primario }}
                >
                  {c.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    c.nome.charAt(0).toUpperCase()
                  )}
                </span>
                <span className="font-semibold text-slate-900">{c.nome}</span>
              </button>
            ))}
          </div>
          <button className="btn-primary w-full sm:w-auto" onClick={() => setStep(2)}>
            Continua →
          </button>
        </div>
      )}

      {/* STEP 2: numeri */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900">Periodo e canale</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="label">Canale</label>
                <select
                  className="input"
                  value={form.canale}
                  onChange={(e) => set("canale", e.target.value as Canale)}
                >
                  {CANALI.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Mese</label>
                <select
                  className="input"
                  value={form.mese}
                  onChange={(e) => set("mese", Number(e.target.value))}
                >
                  {MESI.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Anno</label>
                <select
                  className="input"
                  value={form.anno}
                  onChange={(e) => set("anno", Number(e.target.value))}
                >
                  {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DataImportPanel
            currentCanale={form.canale}
            currentMese={form.mese}
            currentAnno={form.anno}
            onApply={applyImportedValues}
          />

          {importMessage && (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              ✓ {importMessage}
            </p>
          )}

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900">I numeri del mese</h2>
            <p className="text-sm text-slate-500">
              Li trovi negli insight del profilo. Copia i valori così come sono, senza punti:
              al resto (formattazione, confronti, percentuali) pensa Klaro.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(
                [
                  ["reach", "Reach (persone raggiunte)", "es. 24900"],
                  ["impression", "Impression (visualizzazioni)", "es. 55800"],
                  ["follower_inizio", "Follower a inizio mese", "es. 2455"],
                  ["follower_fine", "Follower a fine mese", "es. 2687"],
                  ["numero_post", "Numero di post pubblicati", "es. 16"],
                ] as [keyof FormState, string, string][]
              ).map(([key, label, ph]) => (
                <div key={key}>
                  <label className="label">{label} *</label>
                  <input
                    className={`input${hClass(key)}`}
                    inputMode="numeric"
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value as FormState[typeof key])}
                    placeholder={ph}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="label">Engagement rate (%) *</label>
                <div className="mb-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Passa a manuale partendo dal valore calcolato finora,
                      // cosi' l'utente puo' correggerlo invece di ripartire da zero.
                      if (form.engagementMode === "calcolato") {
                        const calcolato = engagementRateCalcolato();
                        if (calcolato > 0) {
                          setForm((f) => ({
                            ...f,
                            engagementMode: "manual",
                            engagement_rate: calcolato.toString().replace(".", ","),
                          }));
                          return;
                        }
                      }
                      set("engagementMode", "manual");
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      form.engagementMode === "manual"
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Inserisci il tasso
                  </button>
                  <button
                    type="button"
                    onClick={() => set("engagementMode", "calcolato")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      form.engagementMode === "calcolato"
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Calcola da interazioni
                  </button>
                </div>
                {form.engagementMode === "manual" ? (
                  <input
                    className={`input${hClass("engagement_rate")}`}
                    inputMode="decimal"
                    value={form.engagement_rate}
                    onChange={(e) => set("engagement_rate", e.target.value)}
                    placeholder="es. 3,8"
                  />
                ) : (
                  <>
                    <input
                      className={`input${hClass("engagement_rate")}`}
                      inputMode="numeric"
                      value={form.interazioni_totali}
                      onChange={(e) => set("interazioni_totali", e.target.value)}
                      placeholder="es. 1845 (mi piace + commenti + salvataggi + condivisioni)"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Formula: interazioni totali ÷ copertura (reach) × 100
                      {form.interazioni_totali.trim() && Number(form.reach) > 0
                        ? ` = ${engagementRateCalcolato().toString().replace(".", ",")}%`
                        : ""}
                      {form.interazioni_totali.trim() && !(Number(form.reach) > 0)
                        ? " (serve prima un Reach valido, sopra)"
                        : ""}
                    </p>
                  </>
                )}
              </div>
              <div>
                <label className="label">Visite al profilo (facoltativo)</label>
                <input
                  className={`input${hClass("visite_profilo")}`}
                  inputMode="numeric"
                  value={form.visite_profilo}
                  onChange={(e) => set("visite_profilo", e.target.value)}
                  placeholder="es. 2180"
                />
              </div>
              <div>
                <label className="label">Click al link (facoltativo)</label>
                <input
                  className={`input${hClass("click_link")}`}
                  inputMode="numeric"
                  value={form.click_link}
                  onChange={(e) => set("click_link", e.target.value)}
                  placeholder="es. 390"
                />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900">I 3 contenuti migliori</h2>
            {form.top_post.map((p, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className="label">Post #{i + 1}{i === 0 ? " *" : ""}</label>
                  <input
                    className={`input${hClass(`top_contenuto_${i + 1}`)}`}
                    value={p.testo}
                    onChange={(e) => setTopPost(i, "testo", e.target.value)}
                    placeholder="es. Reel: aperitivo al tramonto in terrazza"
                  />
                </div>
                <div>
                  <label className="label">Metrica</label>
                  <input
                    className="input"
                    value={p.metrica}
                    onChange={(e) => setTopPost(i, "metrica", e.target.value)}
                    placeholder="es. 9.800 reach"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <label className="label">Note sui risultati (facoltative)</label>
            <textarea
              className={`input min-h-24${hClass("note")}`}
              value={form.risultati_note}
              onChange={(e) => set("risultati_note", e.target.value)}
              placeholder="es. Raddoppiata la frequenza dei reel, avviata collaborazione con 2 micro influencer…"
            />
          </div>

          {errors.length > 0 && (
            <ul className="space-y-1 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {errors.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              ← Indietro
            </button>
            <button className="btn-primary flex-1" onClick={goToContext}>
              Continua: contesto del mese →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: contesto del mese */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="card space-y-1">
            <h2 className="font-semibold text-slate-900">Contesto del mese</h2>
            <p className="text-sm text-slate-500">
              Due righe per campo bastano. Sono tutte facoltative, ma più contesto dai,
              più il commento sembrerà scritto da te e non da un robot. Quello che scrivi
              qui finisce anche nella sezione &quot;In sintesi&quot; del PDF.
            </p>
          </div>

          {(
            [
              [
                "ctx_cosa_fatto",
                "Cosa è stato fatto questo mese",
                "es. 8 reel, 4 caroselli, 2 collaborazioni con micro influencer, avviata la rubrica del venerdì…",
              ],
              [
                "ctx_andato_bene",
                "Cosa è andato bene",
                "es. i reel col barman hanno superato ogni aspettativa, la rubrica ha portato commenti nuovi…",
              ],
              [
                "ctx_non_funzionato",
                "Cosa non ha funzionato",
                "es. i post statici di prodotto quasi ignorati, poca risposta alle stories con sondaggio…",
              ],
              [
                "ctx_priorita",
                "Priorità per il prossimo mese",
                "es. spingere il formato video, promuovere l'evento di apertura, testare 2 orari di pubblicazione…",
              ],
            ] as [keyof FormState, string, string][]
          ).map(([key, label, ph]) => (
            <div key={key} className="card">
              <label className="label">{label}</label>
              <textarea
                className="input min-h-24"
                value={form[key] as string}
                onChange={(e) => set(key, e.target.value as FormState[typeof key])}
                placeholder={ph}
              />
            </div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              ← Indietro
            </button>
            <button className="btn-primary flex-1" onClick={goToPreview}>
              Vedi anteprima con commento AI →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: anteprima */}
      {step === 4 && (
        <div className="space-y-6">
          <div
            className="flex items-center justify-between rounded-2xl p-5 text-white"
            style={{ backgroundColor: client.colore_primario }}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                Report {CANALI.find((c) => c.value === form.canale)?.label}
              </p>
              <p className="text-lg font-bold">{client.nome}</p>
              <p className="text-sm text-white/80">{meseLabel(form.mese, form.anno)}</p>
            </div>
            {client.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
            )}
          </div>

          {!prevReport && (
            <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
              Non c&apos;è un report del mese precedente per questo cliente e canale: il commento
              non farà confronti (e lo dirà con trasparenza). Dal prossimo mese il confronto
              sarà automatico.
            </p>
          )}

          <ReportCharts
            data={buildData()}
            prev={prevReport?.dati_json ?? null}
            color={client.colore_primario}
            meseCorrente={meseLabel(form.mese, form.anno)}
            mesePrecedente={
              prevReport ? meseLabel(prevReport.mese, prevReport.anno) : null
            }
          />

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Commento del consulente (AI)</h3>
              <button
                className="text-sm font-semibold text-brand-600 hover:underline disabled:opacity-50"
                onClick={() => generateComment(prevReport)}
                disabled={aiLoading}
              >
                {aiLoading ? "Generazione…" : "↻ Rigenera"}
              </button>
            </div>
            {aiLoading && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
                L&apos;AI sta leggendo numeri, contesto e obiettivi del cliente e sta scrivendo
                il commento… di solito ci vogliono 15-30 secondi.
              </div>
            )}
            {aiError && (
              <p className="mb-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">{aiError}</p>
            )}
            {!aiLoading && (
              <>
                <textarea
                  className="input min-h-72 leading-relaxed"
                  value={form.commento}
                  onChange={(e) => set("commento", e.target.value)}
                  placeholder="Il commento AI apparirà qui, organizzato in 5 sezioni (sintesi, cosa è andato bene, cosa migliorare, lettura dei numeri, priorità). Puoi modificarlo liberamente prima di generare il PDF."
                />
                <p className="mt-2 text-xs text-slate-400">
                  Rivedi e modifica come preferisci: nel PDF andrà esattamente ciò che vedi qui.
                  Mantieni i titoli delle sezioni per un PDF ben impaginato.
                </p>
              </>
            )}
          </div>

          {client.obiettivi_testo && !aiLoading && (
            <div className="card">
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Andamento rispetto agli obiettivi (per il PDF)
              </h3>
              <p className="mb-3 text-xs text-slate-500">
                Obiettivi del cliente: &quot;{client.obiettivi_testo}&quot;
              </p>
              <textarea
                className="input min-h-24 leading-relaxed"
                value={form.valutazione_obiettivi}
                onChange={(e) => set("valutazione_obiettivi", e.target.value)}
                placeholder="Valutazione prudente dell'andamento rispetto agli obiettivi. Se i dati non bastano, va bene scrivere che è presto per valutare."
              />
            </div>
          )}

          {saveError && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{saveError}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn-secondary" onClick={() => setStep(3)}>
              ← Modifica contesto
            </button>
            <button
              className="btn-primary flex-1"
              onClick={saveReport}
              disabled={saving || aiLoading}
            >
              {saving ? "Salvataggio…" : "Salva report e vai al PDF →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
