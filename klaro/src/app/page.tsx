import Link from "next/link";

function MockupPdf({
  title,
  color,
  bars,
}: {
  title: string;
  color: string;
  bars: number[];
}) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      {/* copertina in miniatura */}
      <div
        className="mb-4 flex h-16 items-center justify-between rounded-xl px-4"
        style={{ backgroundColor: color }}
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/70">
            Report mensile
          </p>
          <p className="text-sm font-bold text-white">{title}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
          Logo
        </div>
      </div>
      {/* grafico in miniatura */}
      <div className="mb-4 flex h-20 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%`, backgroundColor: color, opacity: 0.35 + i * 0.15 }}
          />
        ))}
      </div>
      {/* righe di testo finto */}
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-slate-100" />
        <div className="h-2 w-5/6 rounded bg-slate-100" />
        <div className="h-2 w-4/6 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main>
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-2xl font-extrabold tracking-tight text-brand-700">klaro</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Accedi
          </Link>
          <Link href="/register" className="btn-primary !py-2.5">
            Prova gratis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center md:pt-20">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Il report mensile per i tuoi clienti,{" "}
          <span className="text-brand-600">pronto in 5 minuti</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Inserisci i numeri del mese di Instagram, TikTok o LinkedIn. Klaro genera un PDF
          brandizzato con i colori del tuo cliente, grafici professionali e un commento
          scritto dall&apos;AI che confronta i risultati col mese precedente.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary !px-8 !py-4 !text-base">
            Crea il tuo primo report gratis
          </Link>
          <p className="text-sm text-slate-500">Nessuna carta richiesta · Cliente demo incluso</p>
        </div>
      </section>

      {/* Mockup dei PDF */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <MockupPdf title="Bar Centrale" color="#b45309" bars={[40, 55, 70, 90]} />
          <MockupPdf title="Studio Legale Rossi" color="#1e40af" bars={[30, 45, 60, 80]} />
          <MockupPdf title="Palestra FitLab" color="#047857" bars={[50, 40, 75, 95]} />
        </div>
      </section>

      {/* Come funziona */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold text-slate-900">Come funziona</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Inserisci i numeri",
                d: "Reach, impression, follower, engagement e i 3 post migliori. Un form guidato, niente integrazioni da configurare.",
              },
              {
                n: "2",
                t: "L'AI scrive il commento",
                d: "Un'analisi professionale in italiano che confronta il mese con il precedente e propone 2-3 raccomandazioni. Tu la rivedi e la modifichi.",
              },
              {
                n: "3",
                t: "Scarichi il PDF brandizzato",
                d: "Copertina con logo e colori del cliente, grafici, highlights e commento. Senza marchio Klaro sui piani a pagamento.",
              },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-center text-3xl font-bold text-slate-900">Prezzi semplici</h2>
          <p className="mt-3 text-center text-slate-600">
            Inizia gratis con un cliente di prova. Passa a un piano quando sei pronto.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
              <p className="mt-2 text-4xl font-extrabold text-slate-900">
                €19<span className="text-base font-medium text-slate-500">/mese</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                <li>✓ Fino a 5 clienti</li>
                <li>✓ Report illimitati</li>
                <li>✓ Commento AI con confronto mensile</li>
                <li>✓ PDF white-label (senza marchio Klaro)</li>
              </ul>
              <Link href="/register" className="btn-secondary mt-6 w-full">
                Inizia con Starter
              </Link>
            </div>
            <div className="card flex flex-col border-brand-500 ring-2 ring-brand-100">
              <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
              <p className="mt-2 text-4xl font-extrabold text-slate-900">
                €39<span className="text-base font-medium text-slate-500">/mese</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                <li>✓ Fino a 20 clienti</li>
                <li>✓ Report illimitati</li>
                <li>✓ Commento AI con confronto mensile</li>
                <li>✓ PDF white-label (senza marchio Klaro)</li>
              </ul>
              <Link href="/register" className="btn-primary mt-6 w-full">
                Inizia con Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="bg-brand-700 py-16 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-bold text-white">
            Smetti di perdere mezze giornate sui report
          </h2>
          <p className="mt-3 text-brand-100">
            Registrati e prova subito con il cliente demo: due mesi di dati già caricati.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            Registrati gratis
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Klaro
      </footer>
    </main>
  );
}
