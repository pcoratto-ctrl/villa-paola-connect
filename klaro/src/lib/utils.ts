// Formattazione italiana (punto come separatore delle migliaia) implementata
// a mano: Intl.NumberFormat dipende dai dati ICU disponibili nel runtime e in
// alcuni ambienti Node (ICU ridotto) formatta in modo incoerente in base alla
// grandezza del numero. Questa versione e' deterministica in ogni ambiente.
export function formatNumber(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.round(Math.abs(n));
  return sign + String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Caratteri Unicode non supportati dai font standard di @react-pdf/renderer
// (Helvetica/WinAnsi): li normalizziamo in equivalenti testuali sicuri prima
// di inserirli in un PDF, per evitare glifi corrotti nel documento finale.
const PDF_UNSAFE_CHARS: [RegExp, string][] = [
  [/→/g, "->"],
  [/←/g, "<-"],
  [/↔/g, "<->"],
];

export function sanitizeForPdf(text: string | null | undefined): string {
  if (!text) return "";
  return PDF_UNSAFE_CHARS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

export function pctChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export function formatPct(v: number | null): string {
  if (v === null) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1).replace(".", ",")}%`;
}

export function prevMonth(mese: number, anno: number): { mese: number; anno: number } {
  return mese === 1 ? { mese: 12, anno: anno - 1 } : { mese: mese - 1, anno };
}

// Schiarisce/scurisce un colore hex per generare varianti dal colore brand del cliente
export function shadeColor(hex: string, percent: number): string {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  const to = (c: number) => Math.round((t - c) * p) + c;
  return `#${(0x1000000 + (to(R) << 16) + (to(G) << 8) + to(B)).toString(16).slice(1)}`;
}
