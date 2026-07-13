import type { Metadata } from "next";
import Link from "next/link";
import ReportCharts from "@/components/ReportCharts";
import { parseCommento, SEZIONI_COMMENTO } from "@/lib/commento";
import type { ReportData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Report di esempio — Klaro",
  description:
    "Un report mensile Instagram completo generato con Klaro: numeri con confronto sul mese precedente, sintesi, commento del consulente e priorità. Così arriva al tuo cliente.",
};

// Dati fittizi ma plausibili di una pasticceria locale
const COLOR = "#9d174d";
const NOME = "Pasticceria Delizia";
const PERIODO = "Maggio 2026";
const PERIODO_PREC = "Aprile 2026";
const OBIETTIVI =
  "Far conoscere il laboratorio artigianale in città, aumentare gli ordini di torte personalizzate e riempire i corsi di pasticceria del sabato.";

const DATI: ReportData = {
  reach: 31200,
  impression: 68400,
  follower_inizio: 3180,
  follower_fine: 3475,
  engagement_rate: 4.2,
  numero_post: 18,
  top_post: [
    { testo: "Reel: la sac à poche vista dal bancone — decorazione in timelapse", metrica: "11.400 reach" },
    { testo: "Carosello: 5 torte di maggio, dalla più richiesta alla più audace", metrica: "6.900 reach" },
    { testo: "Reel: dietro le quinte del corso del sabato", metrica: "5.200 reach" },
  ],
  risultati_note:
    "Terzo mese del piano editoriale: 3 reel a settimana, rubrica fissa del lunedì e copertura dei corsi del sabato in stories.",
  contesto: {
    andato_bene:
      "I timelapse di decorazione hanno superato ogni aspettativa e portato richieste di preventivo nei DM. Il corso del sabato è andato esaurito in 4 giorni.",
    non_funzionato:
      "Le foto statiche di vetrina ottengono poca visibilità: il pubblico premia i contenuti in cui si vede il lavoro delle mani.",
    priorita_prossimo:
      "Portare i preventivi via DM su un modulo dedicato, aprire le iscrizioni dei corsi estivi con due settimane di anticipo, testare un reel in collaborazione con un fornitore locale.",
  },
  valutazione_obiettivi:
    "Il lavoro procede nella direzione degli obiettivi: la crescita della community locale è costante e il tutto esaurito del corso del sabato è un segnale concreto. Per valutare l'impatto sugli ordini di torte personalizzate servirà tracciare le richieste arrivate dai social nel prossimo mese: da questo report iniziamo a misurarle.",
};

const DATI_PREC: ReportData = {
  reach: 24600,
  impression: 52800,
  follower_inizio: 2965,
  follower_fine: 3180,
  engagement_rate: 3.6,
  numero_post: 15,
  top_post: [],
  risultati_note: "",
};

const COMMENTO = `1. Sintesi del mese
Maggio è stato il mese migliore da inizio collaborazione. Abbiamo raggiunto 31.200 persone, quasi tutte della zona, e la community è cresciuta di 295 follower. Soprattutto, i contenuti hanno iniziato a portare risultati concreti: richieste di preventivo nei messaggi e il corso del sabato esaurito in quattro giorni.

2. Cosa è andato bene
I timelapse di decorazione sono il formato che vi rappresenta meglio: il reel della sac à poche da solo ha raggiunto 11.400 persone, più di un terzo della copertura del mese. Funziona perché mostra il lavoro artigianale vero, quello che nessuna catena può copiare. Anche il racconto dei corsi in stories ha fatto la sua parte: il tutto esaurito è arrivato senza spendere un euro in sponsorizzate.

3. Cosa migliorare
Le foto statiche di vetrina ottengono poca visibilità: il pubblico vuole vedere le mani all'opera, non solo il risultato finito. Non serve eliminarle, ma vanno ripensate: anche una foto può raccontare un dettaglio del processo. Inoltre le richieste di preventivo arrivano sparse nei DM e rischiamo di perderne qualcuna per strada.

4. Lettura dei numeri principali
La copertura è passata da 24.600 a 31.200 persone (+26,8%) e le visualizzazioni da 52.800 a 68.400 (+29,5%). I follower sono cresciuti da 3.180 a 3.475 (+9,3% sul totale), il ritmo più alto degli ultimi tre mesi. L'engagement è salito dal 3,6% al 4,2%: non solo più persone, ma persone più interessate.

5. Priorità consigliate per il prossimo mese
Per giugno suggeriamo tre mosse: 1) creare un modulo semplice per le richieste di torte personalizzate e indirizzarci tutti i DM, così nessuna richiesta va persa e possiamo misurarle; 2) aprire le iscrizioni ai corsi estivi con due settimane di anticipo, cavalcando l'entusiasmo del tutto esaurito; 3) mantenere i tre reel a settimana dando priorità assoluta ai timelapse, il formato che il vostro pubblico ha eletto a preferito.`;

export default function ReportEsempioPage() {
  const sezioni = parseCommento(COMMENTO);
  const commentoSezioni = [
    [SEZIONI_COMMENTO[0], sezioni.sintesi],
    [SEZIONI_COMMENTO[1], sezioni.andato_bene],
    [SEZIONI_COMMENTO[2], sezioni.migliorare],
    [SEZIONI_COMMENTO[3], sezioni.numeri],
    [SEZIONI_COMMENTO[4], sezioni.priorita],
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-700">
            klaro
          </Link>
          <Link href="/register" className="btn-primary !py-2.5">
            Crea il tuo report
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <p className="mb-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
          <strong>Questo è un report di esempio</strong> con dati fittizi: è esattamente ciò che
          Klaro prepara per i tuoi clienti partendo dai numeri che inserisci tu. Il PDF ha in più
          la copertina brandizzata con il logo del cliente.
        </p>

        {/* Copertina */}
        <div
          className="flex items-center justify-between rounded-2xl p-6 text-white"
          style={{ backgroundColor: COLOR }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              Report Instagram — social organico
            </p>
            <h1 className="text-2xl font-bold">{NOME}</h1>
            <p className="text-sm text-white/80">{PERIODO}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold">
            D
          </div>
        </div>

        {/* In sintesi */}
        <section className="mt-8">
          <h2 className="mb-1 text-xl font-bold" style={{ color: COLOR }}>
            In sintesi
          </h2>
          <p className="mb-4 text-sm text-slate-500">Il mese in tre punti, prima dei numeri.</p>
          <div className="space-y-3">
            {(
              [
                ["Cosa è andato bene", DATI.contesto!.andato_bene!],
                ["Cosa migliorare", DATI.contesto!.non_funzionato!],
                ["Priorità del prossimo mese", DATI.contesto!.priorita_prossimo!],
              ] as const
            ).map(([titolo, testo]) => (
              <div
                key={titolo}
                className="rounded-xl border-l-4 bg-white p-5 shadow-sm"
                style={{ borderLeftColor: COLOR }}
              >
                <h3 className="mb-1 text-sm font-bold" style={{ color: COLOR }}>
                  {titolo}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">{testo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Numeri e grafici */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold" style={{ color: COLOR }}>
            I numeri di {PERIODO}
          </h2>
          <ReportCharts
            data={DATI}
            prev={DATI_PREC}
            color={COLOR}
            meseCorrente={PERIODO}
            mesePrecedente={PERIODO_PREC}
          />
        </section>

        {/* Obiettivi */}
        <section className="card mt-8">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Obiettivi del cliente</h2>
          <p className="mb-2 text-sm italic text-slate-500">“{OBIETTIVI}”</p>
          <p className="text-sm leading-relaxed text-slate-700">{DATI.valutazione_obiettivi}</p>
        </section>

        {/* Commento */}
        <section className="card mt-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Commento del consulente</h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            {commentoSezioni.map(([titolo, testo]) => (
              <div key={titolo}>
                <h3 className="mb-1.5 font-bold" style={{ color: COLOR }}>
                  {titolo}
                </h3>
                {testo.split(/\n\n+/).map((p, i) => (
                  <p key={i} className="mb-2">
                    {p.trim()}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-10 rounded-2xl p-8 text-center text-white"
          style={{ backgroundColor: "#1e40af" }}
        >
          <h2 className="text-2xl font-bold">
            Un report così, per ogni tuo cliente, in 5 minuti
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            Tu inserisci i numeri del mese, Klaro fa il resto: confronto automatico, commento del
            consulente scritto dall&apos;AI (che rivedi tu) e PDF con il logo e i colori del tuo
            cliente. Gratis per iniziare, con un cliente demo già caricato.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            Crea un account gratis
          </Link>
          <p className="mt-3 text-xs text-white/70">Nessuna carta richiesta</p>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Klaro ·{" "}
          <Link href="/" className="hover:text-slate-600">
            klaro.app
          </Link>
        </footer>
      </div>
    </main>
  );
}
