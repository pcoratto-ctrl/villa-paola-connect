// Pure helpers (no Deno/npm imports) shared by partner-* functions and unit tests.
const DATE = /^\d{4}-\d{2}-\d{2}$/

export type Range = { arrival: string; departure: string }
export type Period = Range & { kind: 'rate' | 'block' | 'option'; cents: number | null }
export type PartnerData = {
  lastNight: string
  cleaningCents: number | null
  electricityIncluded: boolean
  linenIncluded: boolean
  bookings: Range[]
  periods: Period[]
}
export const DEFAULT_LAST_NIGHT = '2027-12-31'

const isRange = (r: any) => r && DATE.test(r.arrival) && DATE.test(r.departure) && r.departure > r.arrival

/** Whitelist only the agreed contract fields; anything else (e.g. CRM data) is dropped. */
export function sanitize(raw: any): PartnerData {
  const num = (v: any) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null)
  return {
    lastNight: DATE.test(raw?.lastNight) ? raw.lastNight : DEFAULT_LAST_NIGHT,
    cleaningCents: num(raw?.cleaningCents),
    electricityIncluded: raw?.electricityIncluded === true,
    linenIncluded: raw?.linenIncluded === true,
    bookings: (Array.isArray(raw?.bookings) ? raw.bookings : [])
      .filter(isRange)
      .map((b: any) => ({ arrival: b.arrival, departure: b.departure })),
    periods: (Array.isArray(raw?.periods) ? raw.periods : [])
      .filter((p: any) => isRange(p) && ['rate', 'block', 'option'].includes(p.kind))
      .map((p: any) => ({ kind: p.kind, arrival: p.arrival, departure: p.departure, cents: num(p.cents) })),
  }
}

/** Anonymous unavailability (bookings + block + option), overlapping ranges merged. Nights end-exclusive. */
export function unavailable(d: PartnerData): Range[] {
  const all = [...d.bookings, ...d.periods.filter((p) => p.kind !== 'rate')]
    .map(({ arrival, departure }) => ({ arrival, departure }))
    .sort((a, b) => a.arrival.localeCompare(b.arrival) || a.departure.localeCompare(b.departure))
  const out: Range[] = []
  for (const r of all) {
    const last = out[out.length - 1]
    if (last && r.arrival < last.departure) {
      if (r.departure > last.departure) last.departure = r.departure
    } else out.push({ ...r })
  }
  return out
}

const ymd = (d: string) => d.replace(/-/g, '')

/** RFC 5545 calendar: all-day events, DTEND exclusive (departure day), stable UIDs, CRLF line endings. */
export function buildIcs(ranges: Range[], now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Villa Paola Caposuvero//Partner calendar//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Villa Paola Caposuvero',
    'X-WR-TIMEZONE:Europe/Rome',
    ...ranges.flatMap((r) => [
      'BEGIN:VEVENT',
      `UID:vp-${ymd(r.arrival)}-${ymd(r.departure)}@villapaolacaposuvero.it`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(r.arrival)}`,
      `DTEND;VALUE=DATE:${ymd(r.departure)}`,
      'SUMMARY:Non disponibile',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}

/** Normalize a stored secret: trim, drop wrapping quotes, drop any leading "Bearer " prefixes. */
export function normalizeSecret(v: string | undefined | null): string {
  let s = (v ?? '').trim().replace(/^["'`]+|["'`]+$/g, '').trim()
  s = s.replace(/^(bearer\s+)+/i, '').trim()
  return s
}

/** Upstream headers with exactly one "Bearer " prefix. */
export function upstreamHeaders(bearer: string, pickup: string): Record<string, string> {
  return {
    'OAI-Sites-Authorization': `Bearer ${normalizeSecret(bearer)}`,
    'X-VP-Pickup': normalizeSecret(pickup),
    Accept: 'application/json',
  }
}
