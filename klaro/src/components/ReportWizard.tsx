"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReportCharts from "@/components/ReportCharts";
import { CANALI, MESI, meseLabel } from "@/lib/types";
import type { Canale, Client, ContestoMese, Report, ReportData } from "@/lib/types";
import { prevMonth } from "@/lib/utils";

const DRAFT_KEY = "klaro-report-draft";

// Suggerimenti da toccare per il "Contesto del mese": zero scrittura, l'AI
// trasforma questi segnali in prosa. Ogni gruppo alimenta una parte del commento.
const CHIP_FATTO = [
  "Più Reel del solito",
  "Più caroselli",
  "Più storie",
  "Nuova rubrica fissa",
  "Collaborazione con altri profili/influencer",
  "Promo o offerta",
  "Evento o lancio",
  "Concorso / giveaway",
  "Maggiore costanza",
  "Pubblicato meno del solito",
];
const CHIP_BENE = [
  "I Reel / video",
  "I caroselli",
  "I contenuti dietro le quinte",
  "Le storie interattive (sondaggi, domande)",
  "I contenuti con le persone del team",
  "Le collaborazioni",
  "I contenuti su prodotti/servizi",
];
const CHIP_MALE = [
  "Le foto statiche di prodotto",
  "I post troppo promozionali",
  "Le storie senza interazione",
  "La poca costanza",
  "Niente in particolare",
];
const CHIP_PRIORITA = [
  "Aumentare i Reel",
  "Più costanza di pubblicazione",
  "Promuovere un evento/offerta",
  "Far crescere le interazioni",
  "Avviare una collaborazione",
  "Testare nuovi formati",
];

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
  numero_post: string;
  top_post: { testo: string; metrica: string }[];
  risultati_note: string;
  // Contesto del mese: suggerimenti da toccare (tutto opzionale, zero scrittura)
  tags_fatto: string[];
  tags_bene: string[];
  tags_male: string[];
  tags_priorita: string[];
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
    numero_post: "",
    top_post: [
      { testo: "", metrica: "" },
      { testo: "", metrica: "" },
      { testo: "", metrica: "" },
    ],
    risultati_note: "",
    tags_fatto: [],
    tags_bene: [],
    tags_male: [],
    tags_priorita: [],
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
            // I tag sono selezioni rapide: si ri-toccano nel nuovo mese (pochi tap).
            // Le eventuali note libere del mese precedente restano in risultati_note.
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
    const er = Number(form.engagement_rate.replace(",", "."));
    if (form.engagement_rate.trim() === "" || isNaN(er) || er < 0 || er > 100) {
      errs.push("Engagement rate: un valore tra 0 e 100, la virgola va bene (es. 3,5).");
    }
    if (!form.top_post.some((p) => p.testo.trim())) {
      errs.push("Racconta almeno uno dei 3 contenuti migliori del mese: serve all'AI per il commento.");
    }
    return errs;
  }

  function buildContesto(): ContestoMese | undefined {
    const c: ContestoMese = {};
    if (form.tags_fatto.length) c.cosa_fatto = form.tags_fatto.join(", ");
    if (form.tags_bene.length) c.andato_bene = form.tags_bene.join(", ");
    if (form.tags_male.length) c.non_funzionato = form.tags_male.join(", ");
    if (form.tags_priorita.length) c.priorita_prossimo = form.tags_priorita.join(", ");
    return Object.keys(c).length > 0 ? c : undefined;
  }

  function toggleTag(key: "tags_fatto" | "tags_bene" | "tags_male" | "tags_priorita", value: string) {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function buildData(): ReportData {
    return {
      reach: Number(form.reach),
      impression: Number(form.impression),
      follower_inizio: Number(form.follower_inizio),
      follower_fine: Number(form.follower_fine),
      engagement_rate: Number(form.engagement_rate.replace(",", ".")),
      numero_post: Number(form.numero_post),
      top_post: form.top_post.filter((p) => p.testo.trim()),
      risultati_note: form.risultati_note.trim(),
      contesto: buildContesto(),
      valutazione_obiettivi: form.valutazione_obiettivi.trim() || undefined,
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
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            goToContext();
          }}
        >
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
              ).map(([key, label, ph], idx) => (
                <div key={key}>
                  <label className="label">{label} *</label>
                  <input
                    className="input"
                    inputMode="numeric"
                    autoFocus={idx === 0}
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value as FormState[typeof key])}
                    placeholder={ph}
                  />
                </div>
              ))}
              <div>
                <label className="label">Engagement rate (%) *</label>
                <input
                  className="input"
                  inputMode="decimal"
                  value={form.engagement_rate}
                  onChange={(e) => set("engagement_rate", e.target.value)}
                  placeholder="es. 3,8"
                />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900">Contenuti più performanti (fino a 3)</h2>
            {form.top_post.map((p, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className="label">Post #{i + 1}{i === 0 ? " *" : ""}</label>
                  <input
                    className="input"
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
              className="input min-h-24"
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

          <p className="text-xs text-slate-400">
            Suggerimento: usa Tab per passare da un campo all&apos;altro e Invio per proseguire.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
              ← Indietro
            </button>
            <button type="submit" className="btn-primary flex-1">
              Continua: contesto del mese →
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: contesto del mese */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="card space-y-1">
            <h2 className="font-semibold text-slate-900">Contesto del mese</h2>
            <p className="text-sm text-slate-500">
              Niente da scrivere: tocca le voci che descrivono il mese. Bastano pochi tap,
              al testo del commento pensa l&apos;AI. È tutto facoltativo — se salti, l&apos;AI
              analizza comunque i numeri — ma bastano 3-4 tocchi per un commento molto più
              su misura.
            </p>
          </div>

          {(
            [
              ["tags_fatto", "Cosa hai fatto questo mese", CHIP_FATTO],
              ["tags_bene", "Cosa ha funzionato meglio", CHIP_BENE],
              ["tags_male", "Cosa ha reso meno", CHIP_MALE],
              ["tags_priorita", "Su cosa puntare il prossimo mese", CHIP_PRIORITA],
            ] as ["tags_fatto" | "tags_bene" | "tags_male" | "tags_priorita", string, string[]][]
          ).map(([key, label, chips]) => (
            <div key={key} className="card">
              <label className="label">{label}</label>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => {
                  const active = form[key].includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleTag(key, chip)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        active
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-slate-300 bg-white text-slate-600 hover:border-brand-300 hover:text-slate-900"
                      }`}
                    >
                      {active ? "✓ " : ""}
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="text-xs text-slate-400">
            Vuoi aggiungere un dettaglio specifico a parole? Usa il campo &quot;Note sui
            risultati&quot; nello step precedente: è facoltativo e lo passiamo all&apos;AI.
          </p>

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
