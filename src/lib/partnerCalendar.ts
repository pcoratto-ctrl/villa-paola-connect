export type Range = { arrival: string; departure: string };
export type Period = Range & { kind: "rate" | "block" | "option"; cents: number | null };
export type PartnerData = {
  lastNight: string | null;
  cleaningCents: number | null;
  electricityIncluded: boolean;
  linenIncluded: boolean;
  bookings: Range[];
  periods: Period[];
};
export type NightState = { kind: "booked" | "block" | "option" | "rate" | "free" | "closed"; cents?: number | null };

export const CHECKIN = "15:00";
export const CHECKOUT = "10:00";

/** Today's date (YYYY-MM-DD) in Europe/Rome, regardless of the viewer's timezone. */
export const todayRome = (now: Date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

export const addDays = (d: string, n: number) => {
  const t = new Date(d + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};

/** Nights are end-exclusive: a range covers arrival ≤ night < departure. */
const covers = (r: Range, night: string) => r.arrival <= night && night < r.departure;

/** State of the night that starts on `night`. Priority: booked > block > option > rate. */
export function nightState(data: PartnerData, night: string): NightState {
  if (data.lastNight && night > data.lastNight) return { kind: "closed" };
  if (data.bookings.some((b) => covers(b, night))) return { kind: "booked" };
  for (const kind of ["block", "option"] as const) {
    if (data.periods.some((p) => p.kind === kind && covers(p, night))) return { kind };
  }
  const rate = data.periods.find((p) => p.kind === "rate" && covers(p, night));
  return rate ? { kind: "rate", cents: rate.cents } : { kind: "free" };
}

/**
 * A calendar day is split in two halves:
 *  - morning (until check-out 10:00) belongs to the previous night
 *  - afternoon (from check-in 15:00) belongs to the night starting that day
 */
export function dayHalves(data: PartnerData, day: string) {
  return { morning: nightState(data, addDays(day, -1)), afternoon: nightState(data, day) };
}

export const isPast = (day: string, today: string) => day < today;
