"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { humanizeSignupError } from "@/lib/authErrors";
import EmailConfirmCard from "@/components/EmailConfirmCard";

const NOME_MIN = 2;
const NOME_MAX = 50;

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const nomeTrim = nome.trim();
    if (nomeTrim.length < NOME_MIN || nomeTrim.length > NOME_MAX) {
      setError(`Il nome deve avere tra ${NOME_MIN} e ${NOME_MAX} caratteri.`);
      return;
    }
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome: nomeTrim } },
    });
    if (error) {
      setError(humanizeSignupError(error.message));
      setLoading(false);
      return;
    }
    // Se la conferma email è attiva su Supabase, non c'è sessione: mostra istruzioni
    if (!data.session) {
      setNeedsConfirm(true);
      setLoading(false);
      return;
    }
    // Beta a inviti: anche senza conferma email obbligatoria, l'utente non
    // deve mai atterrare direttamente in dashboard. Il layout (app) e il
    // callback gestiscono comunque il redirect a /benvenuto al primo giro.
    window.location.href = "/dashboard";
  }

  if (needsConfirm) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
          klaro
        </Link>
        <EmailConfirmCard
          title="Controlla la tua email"
          mainText="Ti abbiamo inviato un link per confermare il tuo indirizzo. Dopo la conferma potrai entrare nella beta privata di Klaro."
          email={email}
          backHref="/register"
          backLabel="Torna alla registrazione"
          onResend={async () => {
            const supabase = createClient();
            const { error } = await supabase.auth.resend({ type: "signup", email });
            if (error) return { error: humanizeSignupError(error.message) };
          }}
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
          <h1 className="text-xl font-bold text-slate-900">Crea il tuo account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Beta privata su invito: un primo gruppo di 10 professionisti, seguiti direttamente da
            Pierpaolo.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="nome">Come vuoi essere chiamato?</label>
          <input
            id="nome"
            required
            minLength={NOME_MIN}
            maxLength={NOME_MAX}
            className="input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Es. Marco"
          />
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
        <div>
          <label className="label" htmlFor="password">Password (min. 8 caratteri)</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creazione account…" : "Registrati"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Hai già un account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Accedi
          </Link>
        </p>
      </form>
    </main>
  );
}
