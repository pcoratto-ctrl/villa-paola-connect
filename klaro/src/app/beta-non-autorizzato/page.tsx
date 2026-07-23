import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BETA_NOT_AUTHORIZED_MESSAGE } from "@/lib/betaAccess";
import { SUPPORT_EMAIL, mailtoFounder } from "@/lib/founderConfig";

export default function BetaNonAutorizzatoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
        klaro
      </Link>
      <div className="card text-center">
        <h1 className="text-xl font-bold text-slate-900">Beta privata</h1>
        <p className="mt-3 text-sm text-slate-600">{BETA_NOT_AUTHORIZED_MESSAGE}</p>
        <p className="mt-3 text-sm text-slate-500">
          Vuoi essere considerato per i prossimi posti?{" "}
          {SUPPORT_EMAIL ? (
            <a href={mailtoFounder("Richiesta accesso alla beta di Klaro")} className="font-semibold text-brand-600 hover:underline">
              Scrivi a Pierpaolo
            </a>
          ) : (
            "Scrivi a Pierpaolo"
          )}
          .
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
