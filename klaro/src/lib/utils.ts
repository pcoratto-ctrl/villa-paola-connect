export function formatNumber(n: number): string {
  return new Intl.NumberFormat("it-IT").format(n);
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
