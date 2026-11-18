import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const FN = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;
const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString("it-IT", { timeZone: "Europe/Rome" }) : "—");
const STATUS: Record<string, string> = { enabled: "Abilitato", suspended: "Sospeso", revoked: "Revocato" };

async function call(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("partner-admin", { body });
  if (error) {
    const b = await (error as any).context?.json?.().catch(() => null);
    throw new Error(typeof b?.error === "string" ? b.error : "Operazione non riuscita");
  }
  return data;
}

const input = "w-full px-3 py-2 rounded-villa border border-border bg-card text-sm";
const btn = "px-3 py-1.5 rounded-villa border border-border text-sm hover:bg-muted disabled:opacity-40";

const AdminOperators = () => {
  const { session, loading } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ company: "", contact_name: "", email: "", phone: "", notes: "" });
  const [secret, setSecret] = useState<{ title: string; value: string } | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [origins, setOrigins] = useState("");

  const ops = useQuery({
    queryKey: ["partner-operators"],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_operators").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const tokens = useQuery({
    queryKey: ["partner-tokens"],
    enabled: !!session,
    queryFn: async () => (await supabase.from("partner_feed_tokens").select("id, operator_id, kind, allowed_origins, created_at, revoked_at").is("revoked_at", null)).data ?? [],
  });
  const log = useQuery({
    queryKey: ["partner-log", open],
    enabled: !!open,
    queryFn: async () => (await supabase.from("partner_access_log").select("*").eq("operator_id", open!).order("created_at", { ascending: false }).limit(25)).data ?? [],
  });

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  const run = async (body: Record<string, unknown>, ok: string) => {
    try {
      const r = await call(body);
      toast({ title: ok });
      qc.invalidateQueries({ queryKey: ["partner-operators"] });
      qc.invalidateQueries({ queryKey: ["partner-tokens"] });
      return r;
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await run({ action: "create", ...form }, "Operatore creato");
    if (r?.temporary_password) {
      setSecret({ title: `Password temporanea per ${form.email}`, value: r.temporary_password });
      setForm({ company: "", contact_name: "", email: "", phone: "", notes: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Operatori · Admin</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl">Operatori autorizzati</h1>
          <a href="/admin" className={btn}>← Dashboard</a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {ops.error && <p className="text-destructive">Accesso riservato all'amministratore.</p>}

        {secret && (
          <div role="alert" className="border border-accent rounded-villa p-4 bg-card">
            <p className="font-medium mb-1">{secret.title}</p>
            <p className="text-sm text-muted-foreground mb-2">Copialo ora: non verrà mostrato di nuovo.</p>
            <code className="block break-all text-sm bg-muted p-2 rounded-villa">{secret.value}</code>
            <div className="flex gap-2 mt-3">
              <button className={btn} onClick={() => navigator.clipboard.writeText(secret.value)}>Copia</button>
              <button className={btn} onClick={() => setSecret(null)}>Chiudi</button>
            </div>
          </div>
        )}

        <section>
          <h2 className="font-display text-xl mb-4">Nuovo operatore</h2>
          <form onSubmit={create} className="grid md:grid-cols-2 gap-3">
            <input className={input} placeholder="Ragione sociale *" required maxLength={150} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input className={input} placeholder="Referente" maxLength={120} value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            <input className={input} type="email" placeholder="Email di accesso *" required maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className={input} placeholder="Telefono" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea className={`${input} md:col-span-2`} placeholder="Note interne" maxLength={1000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button type="submit" className="md:col-span-2 justify-self-start px-5 py-2.5 rounded-villa bg-primary text-primary-foreground text-sm font-medium">Crea operatore</button>
          </form>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Elenco</h2>
          {ops.data?.length === 0 && <p className="text-muted-foreground text-sm">Nessun operatore.</p>}
          <ul className="divide-y divide-border border-y border-border">
            {ops.data?.map((o) => {
              const toks = tokens.data?.filter((t) => t.operator_id === o.id) ?? [];
              const ical = toks.find((t) => t.kind === "ical");
              const widget = toks.find((t) => t.kind === "widget");
              return (
                <li key={o.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{o.company} <span className="text-xs text-muted-foreground ml-2">{STATUS[o.status]}</span></p>
                      <p className="text-sm text-muted-foreground">{o.contact_name ?? "—"} · {o.email} · ultimo accesso {fmt(o.last_access_at)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {o.status !== "enabled" && o.status !== "revoked" && <button className={btn} onClick={() => run({ action: "set_status", operator_id: o.id, status: "enabled" }, "Abilitato")}>Abilita</button>}
                      {o.status === "enabled" && <button className={btn} onClick={() => run({ action: "set_status", operator_id: o.id, status: "suspended" }, "Sospeso")}>Sospendi</button>}
                      {o.status !== "revoked" && <button className={btn} onClick={() => confirm(`Revocare definitivamente ${o.company}? Link iCal e widget verranno disattivati.`) && run({ action: "set_status", operator_id: o.id, status: "revoked" }, "Revocato")}>Revoca</button>}
                      <button className={btn} onClick={() => setOpen(open === o.id ? null : o.id)}>{open === o.id ? "Chiudi" : "Dettagli"}</button>
                    </div>
                  </div>
                  {open === o.id && (
                    <div className="mt-4 grid md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3">
                        <p className="font-medium">Accesso</p>
                        <button className={btn} disabled={o.status !== "enabled"} onClick={async () => { const r = await run({ action: "reset_password", operator_id: o.id }, "Password reimpostata"); if (r?.temporary_password) setSecret({ title: `Nuova password per ${o.email}`, value: r.temporary_password }); }}>Reimposta password</button>
                        <p className="font-medium pt-2">Export iCal (solo indisponibilità anonime)</p>
                        <p className="text-muted-foreground">{ical ? `Attivo dal ${fmt(ical.created_at)}` : "Nessun link attivo"}</p>
                        <div className="flex gap-2">
                          <button className={btn} disabled={o.status !== "enabled"} onClick={async () => { const r = await run({ action: "issue_token", operator_id: o.id, kind: "ical" }, "Link iCal creato"); if (r?.token) setSecret({ title: `Link iCal per ${o.company}`, value: `${FN}/partner-ical?token=${r.token}` }); }}>{ical ? "Rigenera" : "Crea link"}</button>
                          {ical && <button className={btn} onClick={() => run({ action: "revoke_token", token_id: ical.id }, "Link revocato")}>Revoca</button>}
                        </div>
                        <p className="font-medium pt-2">Widget (facoltativo)</p>
                        <p className="text-muted-foreground">{widget ? `Domini: ${widget.allowed_origins.join(", ")}` : "Disattivato"}</p>
                        <input className={input} placeholder="https://sito-operatore.it, https://www.sito-operatore.it" value={origins} onChange={(e) => setOrigins(e.target.value)} />
                        <div className="flex gap-2">
                          <button className={btn} disabled={o.status !== "enabled" || !origins.trim()} onClick={async () => { const r = await run({ action: "issue_token", operator_id: o.id, kind: "widget", allowed_origins: origins.split(",").map((s) => s.trim()).filter(Boolean) }, "Widget abilitato"); if (r?.token) { setSecret({ title: `Indirizzo dati widget per ${o.company}`, value: `${FN}/partner-widget?token=${r.token}` }); setOrigins(""); } }}>Abilita per questi domini</button>
                          {widget && <button className={btn} onClick={() => run({ action: "revoke_token", token_id: widget.id }, "Widget disattivato")}>Disattiva</button>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Ultimi accessi</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {log.data?.length === 0 && <li>Nessun accesso registrato.</li>}
                          {log.data?.map((l) => <li key={l.id}>{fmt(l.created_at)} · {l.kind} · {l.outcome === "ok" ? "ok" : "negato"} · {l.ip_prefix ?? ""}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
};
export default AdminOperators;
