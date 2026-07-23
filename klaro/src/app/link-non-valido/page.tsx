import Link from "next/link";
import { SUPPORT_EMAIL, mailtoFounder } from "@/lib/founderConfig";

const MESSAGGI: Record<string, string> = {
  scaduto: "Questo link è scaduto.",
  usato: "Questo link è già stato usato — il tuo account potrebbe essere già confermato.",
  "non-valido": "Questo link non è valido.",
};

export default async function LinkNonValidoPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  const messaggio = MESSAGGI[motivo ?? ""] ?? MESSAGGI["non-valido"];

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
        klaro
      </Link>
      <div className="card text-center">
        <h1 className="text-xl font-bold text-slate-900">{messaggio}</h1>
        <p className="mt-3 text-sm text-slate-600">
          Se pensi di avere già un account confermato, prova ad accedere. Se hai bisogno di un
          nuovo link, torna alla registrazione.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className="btn-primary w-full">
            Vai al login
          </Link>
          <Link href="/register" className="btn-secondary w-full">
            Torna alla registrazione
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Se il problema continua,{" "}
          {SUPPORT_EMAIL ? (
            <a href={mailtoFounder("Problema con un link Klaro")} className="font-semibold text-brand-600 hover:underline">
              scrivi direttamente a Pierpaolo
            </a>
          ) : (
            "scrivi direttamente a Pierpaolo"
          )}
          .
        </p>
      </div>
    </main>
  );
}
