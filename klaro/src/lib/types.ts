export type Canale = "instagram" | "tiktok" | "linkedin";

export type TopPost = {
  testo: string;
  metrica: string;
};

export type ReportData = {
  reach: number;
  impression: number;
  follower_inizio: number;
  follower_fine: number;
  engagement_rate: number;
  numero_post: number;
  top_post: TopPost[];
  risultati_note: string;
};

export type Profile = {
  id: string;
  email: string;
  piano: "free" | "starter" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export type Client = {
  id: string;
  user_id: string;
  nome: string;
  logo_url: string | null;
  colore_primario: string;
  obiettivi_testo: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  client_id: string;
  mese: number;
  anno: number;
  canale: Canale;
  dati_json: ReportData;
  commento_ai: string | null;
  pdf_url: string | null;
  stato: "bozza" | "completo";
  created_at: string;
};

export const MESI = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export const CANALI: { value: Canale; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
];

export function meseLabel(mese: number, anno: number) {
  return `${MESI[mese - 1]} ${anno}`;
}
