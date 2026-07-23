import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDemoClientName } from "@/lib/demoContent";
import { FEEDBACK_URL, mailtoFounder } from "@/lib/founderConfig";
import type { Client, Profile } from "@/lib/types";

export default async function BenvenutoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: clients }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("clients").select("*").eq("user_id", user!.id),
  ]);

  const p = profile as Profile | null;
  const demoClient = (clients as Client[] | null)?.find((c) => isDemoClientName(c.nome));

  // La pagina va mostrata una sola volta: la segno come vista non appena
  // viene renderizzata, non solo al click di un pulsante (altrimenti
  // chiudere la scheda senza cliccare nulla la farebbe ricomparire).
  if (!p?.onboarding_completed_at) {
    await supabase
      .from("profiles")
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq("id", user!.id);
  }

  const feedbackHref = FEEDBACK_URL ?? mailtoFounder("Ciao Pierpaolo!", "Ciao Pierpaolo,\n\n");

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
        klaro
      </Link>
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">
          Benvenuta/o tra i primi 10 di Klaro{p?.nome ? `, ${p.nome}` : ""}
        </h1>
        <p className="mt-4 text-slate-600">
          Klaro è ancora in costruzione. Il tuo utilizzo e i tuoi suggerimenti contribuiranno
          direttamente a decidere come evolverà.
        </p>
        <p className="mt-3 text-slate-600">
          Il tuo feedback arriverà direttamente a Pierpaolo, non a un&apos;assistenza automatica.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Durante la beta:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Puoi avere fino a 2 clienti reali e 10 report.</li>
            <li>
              Controlla sempre dati, commento e PDF prima di inviarli a un cliente vero: è ancora
              una fase di prova.
            </li>
            <li>Problemi e dubbi puoi segnalarli direttamente, in ogni momento.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={demoClient ? `/clients/${demoClient.id}` : "/dashboard"}
            className="btn-primary flex-1 text-center"
          >
            Inizia dal cliente demo
          </Link>
          <a href={feedbackHref} target={FEEDBACK_URL ? "_blank" : undefined} rel="noopener noreferrer" className="btn-secondary flex-1 text-center">
            Scrivi a Pierpaolo
          </a>
        </div>
      </div>
    </main>
  );
}
