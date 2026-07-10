"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Esiste già un account con questa email. Prova ad accedere."
          : error.message
      );
      setLoading(false);
      return;
    }
    // Se la conferma email è attiva su Supabase, non c'è sessione: mostra istruzioni
    if (!data.session) {
      setNeedsConfirm(true);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (needsConfirm) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <div className="card text-center">
          <h1 className="text-xl font-bold text-slate-900">Controlla la tua email</h1>
          <p className="mt-3 text-sm text-slate-600">
            Ti abbiamo inviato un link di conferma a <strong>{email}</strong>. Cliccalo per
            attivare l&apos;account, poi torna qui e accedi.
          </p>
          <Link href="/login" className="btn-primary mt-6 w-full">
            Vai al login
          </Link>
        </div>
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
            Gratis, con un cliente demo già pronto da esplorare.
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
          {loading ? "Creazione account…" : "Registrati gratis"}
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
