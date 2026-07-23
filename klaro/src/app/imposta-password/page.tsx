"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { humanizeGenericAuthError } from "@/lib/authErrors";

export default function ImpostaPasswordPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setCheckingSession(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(humanizeGenericAuthError(error.message));
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (checkingSession) return null;

  if (!hasSession) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
          klaro
        </Link>
        <div className="card text-center">
          <h1 className="text-xl font-bold text-slate-900">Link non valido o scaduto</h1>
          <p className="mt-3 text-sm text-slate-600">
            Richiedi un nuovo link per reimpostare la password.
          </p>
          <Link href="/recupera-password" className="btn-primary mt-6 w-full">
            Richiedi un nuovo link
          </Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <Link href="/" className="mb-8 text-center text-3xl font-extrabold text-brand-700">
          klaro
        </Link>
        <div className="card text-center">
          <h1 className="text-xl font-bold text-slate-900">Password aggiornata</h1>
          <p className="mt-3 text-sm text-slate-600">
            Ora puoi accedere con le nuove credenziali. Ti portiamo al login…
          </p>
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
          <h1 className="text-xl font-bold text-slate-900">Scegli una nuova password</h1>
        </div>
        <div>
          <label className="label" htmlFor="password">Nuova password (min. 8 caratteri)</label>
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
          {loading ? "Salvataggio…" : "Salva la nuova password"}
        </button>
      </form>
    </main>
  );
}
