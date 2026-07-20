"use client";

import { useState } from "react";

export default function BillingButtons({
  piano,
  hasCustomer,
  stripeConfigured,
}: {
  piano: string;
  hasCustomer: boolean;
  stripeConfigured: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!stripeConfigured) {
    return (
      <p className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
        Pagamenti non configurati in questo ambiente.
      </p>
    );
  }

  async function go(endpoint: string, body?: object, key?: string) {
    setLoading(key ?? endpoint);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore imprevisto");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(null);
    }
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {piano !== "starter" && (
          <button
            className="btn-secondary flex-1"
            disabled={loading !== null}
            onClick={() => go("/api/stripe/checkout", { plan: "starter" }, "starter")}
          >
            {loading === "starter" ? "Apertura pagamento…" : "Passa a Starter — €19/mese"}
          </button>
        )}
        {piano !== "pro" && (
          <button
            className="btn-primary flex-1"
            disabled={loading !== null}
            onClick={() => go("/api/stripe/checkout", { plan: "pro" }, "pro")}
          >
            {loading === "pro" ? "Apertura pagamento…" : "Passa a Pro — €39/mese"}
          </button>
        )}
      </div>
      {hasCustomer && (
        <button
          className="mt-3 text-sm font-semibold text-brand-600 hover:underline disabled:opacity-50"
          disabled={loading !== null}
          onClick={() => go("/api/stripe/portal", undefined, "portal")}
        >
          {loading === "portal" ? "Apertura…" : "Gestisci abbonamento e fatture (Stripe)"}
        </button>
      )}
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
