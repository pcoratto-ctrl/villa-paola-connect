"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SUPPORT_EMAIL, mailtoFounder } from "@/lib/founderConfig";

const COOLDOWN_SECONDS = 60;

export default function EmailConfirmCard({
  title,
  mainText,
  email,
  onResend,
  backHref,
  backLabel,
}: {
  title: string;
  mainText: string;
  email: string;
  onResend: () => Promise<{ error?: string } | void>;
  backHref: string;
  backLabel: string;
}) {
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (sending || cooldown > 0) return;
    setSending(true);
    setStatus("idle");
    setErrorMsg(null);
    try {
      const result = await onResend();
      if (result?.error) {
        setStatus("error");
        setErrorMsg(result.error);
      } else {
        setStatus("sent");
        setCooldown(COOLDOWN_SECONDS);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Non siamo riusciti a inviare l'email. Riprova tra poco.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card text-center">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm text-slate-600">{mainText}</p>
      <p className="mt-3 text-sm text-slate-500">
        Se qualcosa non funziona, puoi{" "}
        {SUPPORT_EMAIL ? (
          <a href={mailtoFounder("Problema con l'accesso a Klaro")} className="font-semibold text-brand-600 hover:underline">
            scrivere direttamente a Pierpaolo
          </a>
        ) : (
          "scrivere direttamente a Pierpaolo"
        )}
        .
      </p>

      <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-500">
        <p>Non la trovi? Controlla anche nella cartella spam.</p>
        <p>
          Indirizzo sbagliato?{" "}
          <Link href={backHref} className="font-semibold text-brand-600 hover:underline">
            {backLabel}
          </Link>
          .
        </p>
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={sending || cooldown > 0}
        className="btn-secondary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Invio…" : cooldown > 0 ? `Invia di nuovo (tra ${cooldown}s)` : "Invia di nuovo"}
      </button>
      {status === "sent" && (
        <p className="mt-2 text-sm text-emerald-700">Email inviata di nuovo a {email}.</p>
      )}
      {status === "error" && errorMsg && (
        <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}
