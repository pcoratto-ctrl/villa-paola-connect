import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CHECKIN, CHECKOUT, dayHalves, isPast, todayRome, type NightState, type PartnerData } from "@/lib/partnerCalendar";

const eur = (c: number | null | undefined) =>
  c == null ? "—" : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(c / 100);

const COLOR: Record<NightState["kind"], string> = {
  booked: "hsl(var(--primary))",
  block: "hsl(var(--foreground) / 0.55)",
  option: "hsl(var(--accent))",
  rate: "hsl(var(--card))",
  free: "hsl(var(--card))",
  closed: "hsl(var(--muted))",
};
const LABEL: Record<NightState["kind"], string> = {
  booked: "Prenotato", block: "Bloccato", option: "Opzione", rate: "Disponibile", free: "Disponibile", closed: "Non in vendita",
};

const WEEKDAYS = ["L", "M", "M", "G", "V", "S", "D"];

function Month({ year, month, data, today }: { year: number; month: number; data: PartnerData; today: string }) {
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const title = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  return (
    <div>
      <h2 className="font-display text-2xl capitalize mb-3">{title}</h2>
      <div className="grid grid-cols-7 gap-1 text-[11px] text-muted-foreground mb-1">{WEEKDAYS.map((w, i) => <div key={i} className="text-center">{w}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const { morning, afternoon } = dayHalves(data, day);
          const past = isPast(day, today);
          const dark = (k: NightState["kind"]) => k === "booked" || k === "block";
          const desc = `${day}: mattina ${LABEL[morning.kind]}, pomeriggio ${LABEL[afternoon.kind]}${afternoon.kind === "rate" ? ` ${eur(afternoon.cents)} a notte` : ""}`;
          return (
            <div
              key={day}
              title={desc}
              aria-label={desc}
              className={`relative aspect-square border border-border rounded-villa overflow-hidden text-xs ${past ? "opacity-30 grayscale" : ""} ${day === today ? "ring-2 ring-accent" : ""}`}
              style={{ background: `linear-gradient(135deg, ${COLOR[morning.kind]} 0 50%, ${COLOR[afternoon.kind]} 50% 100%)` }}
            >
              <span className={`absolute top-1 left-1.5 font-medium ${dark(morning.kind) ? "text-primary-foreground" : "text-foreground"}`}>{i + 1}</span>
              {afternoon.kind === "rate" && !past && (
                <span className="absolute bottom-1 right-1.5 text-[10px] text-muted-foreground hidden sm:block">{eur(afternoon.cents)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PartnerCalendar = () => {
  const { session, loading, signOut } = useAuth();
  const today = todayRome();
  const [cursor, setCursor] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 }));

  const q = useQuery({
    queryKey: ["partner-calendar"],
    enabled: !!session,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("partner-calendar", { method: "GET" });
      if (error) {
        const body = await (error as any).context?.json?.().catch(() => null);
        throw new Error(body?.error ?? "error");
      }
      return data as { company: string; data: PartnerData };
    },
  });

  const months = useMemo(() => {
    const a = { y: cursor.y, m: cursor.m };
    const b = cursor.m === 11 ? { y: cursor.y + 1, m: 0 } : { y: cursor.y, m: cursor.m + 1 };
    return [a, b];
  }, [cursor]);

  if (loading) return null;
  if (!session) return <Navigate to="/calendario/login" replace />;

  const move = (d: number) => setCursor(({ y, m }) => { const t = y * 12 + m + d; return { y: Math.floor(t / 12), m: t % 12 }; });
  const minMonth = Number(today.slice(0, 4)) * 12 + Number(today.slice(5, 7)) - 1;
  const err = (q.error as Error | null)?.message;

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Calendario operatori · Villa Paola Caposuvero</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Area operatori</p>
            <h1 className="font-display text-2xl">{q.data?.company ?? "Villa Paola Caposuvero"}</h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 rounded-villa border border-border text-sm hover:bg-muted">
            <LogOut className="w-4 h-4" strokeWidth={1.5} /> Esci
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-8">
        {err === "forbidden" || err === "suspended" ? (
          <p role="alert" className="text-destructive">Il tuo accesso non è attivo. Contatta Villa Paola.</p>
        ) : err ? (
          <p role="alert" className="text-muted-foreground">Calendario momentaneamente non disponibile. Riprova tra poco.</p>
        ) : !q.data ? (
          <p className="text-muted-foreground">Caricamento…</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => move(-1)} disabled={cursor.y * 12 + cursor.m <= minMonth} aria-label="Mese precedente" className="p-2 rounded-villa border border-border disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
              <p className="text-xs text-muted-foreground">Aggiornamento automatico ogni 15 s · ora di riferimento Europe/Rome</p>
              <button onClick={() => move(1)} aria-label="Mese successivo" className="p-2 rounded-villa border border-border"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {months.map(({ y, m }) => <Month key={`${y}-${m}`} year={y} month={m} data={q.data.data} today={today} />)}
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm">
              {(["rate", "option", "block", "booked", "closed"] as const).map((k) => (
                <li key={k} className="flex items-center gap-2"><span className="w-4 h-4 rounded-villa border border-border" style={{ background: COLOR[k] }} />{LABEL[k]}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Ogni giorno è diviso in due: la metà sinistra indica la mattina (check-out entro le {CHECKOUT}), la destra il pomeriggio (check-in dalle {CHECKIN}). Prezzi per notte.
            </p>
            <dl className="grid sm:grid-cols-4 gap-4 mt-8 border-t border-border pt-6 text-sm">
              <div><dt className="text-muted-foreground">Pulizia finale</dt><dd className="font-medium">{eur(q.data.data.cleaningCents)}</dd></div>
              <div><dt className="text-muted-foreground">Elettricità</dt><dd className="font-medium">{q.data.data.electricityIncluded ? "Inclusa" : "Esclusa"}</dd></div>
              <div><dt className="text-muted-foreground">Biancheria</dt><dd className="font-medium">{q.data.data.linenIncluded ? "Inclusa" : "Esclusa"}</dd></div>
              <div><dt className="text-muted-foreground">Ultima notte in vendita</dt><dd className="font-medium">{q.data.data.lastNight ?? "—"}</dd></div>
            </dl>
            <p className="text-xs text-muted-foreground mt-6">Il link iCal fornito da Villa Paola viene riletto dal vostro sistema con la frequenza che decide lui (spesso da 15 minuti ad alcune ore): non sostituisce questa pagina in tempo reale.</p>
          </>
        )}
      </main>
    </div>
  );
};
export default PartnerCalendar;
