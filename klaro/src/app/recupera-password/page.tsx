"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import EmailConfirmCard from "@/components/EmailConfirmCard";

async function sendRecovery(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/imposta-password`,
  });
  // Non riveliamo mai se l'email esiste o no: stesso esito (successo)
  // indipendentemente da cosa risponde Supabase, salvo un vero errore di
  // rete/servizio.
  if (error && error.status && error.status >= 500) {
    return { error: "Qualcosa non ha funzionato da parte nostra. Riprova tra poco." };
  }
}

export default function RecuperaPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sendRecovery(email);
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
          klaro
        </Link>
        <EmailConfirmCard
          title="Controlla la tua email"
          mainText="Se l'indirizzo è registrato, riceverai un link per reimpostare la password."
          email={email}
          backHref="/recupera-password"
          backLabel="Riprova con un altro indirizzo"
          onResend={() => sendRecovery(email)}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
        klaro
      </Link>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recupera la password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Inserisci l&apos;email del tuo account: ti mandiamo un link per sceglierne una nuova.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@esempio.it"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Invio…" : "Invia link di recupero"}
        </button>
        <p className="text-center text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Torna al login
          </Link>
        </p>
      </form>
    </main>
  );
}
