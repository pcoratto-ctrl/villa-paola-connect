import { createClient } from 'npm:@supabase/supabase-js@2'

const UPSTREAM = 'https://villa-paola-centro-operativo.r-falvo.chatgpt.site/calendario/partner-data'
const DATE = /^\d{4}-\d{2}-\d{2}$/

export type Range = { arrival: string; departure: string }
export type Period = Range & { kind: 'rate' | 'block' | 'option'; cents: number | null }
export type PartnerData = {
  lastNight: string | null
  cleaningCents: number | null
  electricityIncluded: boolean
  linenIncluded: boolean
  bookings: Range[]
  periods: Period[]
}

export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

const isRange = (r: any) => r && DATE.test(r.arrival) && DATE.test(r.departure) && r.departure > r.arrival

/** Whitelist only the agreed fields: never forward anything else (e.g. CRM data). */
export function sanitize(raw: any): PartnerData {
  const num = (v: any) => (Number.isFinite(v) ? Math.round(v) : null)
  return {
    lastNight: DATE.test(raw?.lastNight) ? raw.lastNight : null,
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

let cache: { at: number; data: PartnerData } | null = null

export async function fetchPartnerData(): Promise<PartnerData> {
  if (cache && Date.now() - cache.at < 10_000) return cache.data
  const bearer = Deno.env.get('VP_CENTRO_BEARER')
  const pickup = Deno.env.get('VP_CENTRO_PICKUP')
  if (!bearer || !pickup) throw new Error('upstream_not_configured')
  const res = await fetch(UPSTREAM, {
    headers: { 'OAI-Sites-Authorization': `Bearer ${bearer}`, 'X-VP-Pickup': pickup, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`upstream_${res.status}`)
  const data = sanitize(await res.json())
  cache = { at: Date.now(), data }
  return data
}

/** Anonymous unavailability: bookings + blocks + options, no prices, no names. */
export const unavailable = (d: PartnerData): Range[] =>
  [...d.bookings, ...d.periods.filter((p) => p.kind !== 'rate')]
    .map(({ arrival, departure }) => ({ arrival, departure }))
    .sort((a, b) => a.arrival.localeCompare(b.arrival))

export async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function clientMeta(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
  const ip_prefix = ip.includes(':') ? ip.split(':').slice(0, 3).join(':') + '::' : ip.split('.').slice(0, 3).join('.') + '.0'
  return { ip_prefix: ip ? ip_prefix : null, user_agent: (req.headers.get('user-agent') ?? '').slice(0, 200) }
}

export async function logAccess(req: Request, operator_id: string | null, kind: string, outcome: 'ok' | 'denied') {
  const db = admin()
  await db.from('partner_access_log').insert({ operator_id, kind, outcome, ...clientMeta(req) })
  if (operator_id && outcome === 'ok') await db.from('partner_operators').update({ last_access_at: new Date().toISOString() }).eq('id', operator_id)
  // 12-month retention
  if (Math.random() < 0.02) await db.from('partner_access_log').delete().lt('created_at', new Date(Date.now() - 365 * 864e5).toISOString())
}

/** Resolve an active feed token (ical/widget) to its enabled operator. */
export async function resolveToken(token: string | null, kind: 'ical' | 'widget') {
  if (!token || token.length < 32 || token.length > 128) return null
  const { data } = await admin()
    .from('partner_feed_tokens')
    .select('id, operator_id, allowed_origins, revoked_at, partner_operators!inner(status)')
    .eq('token_hash', await sha256(token))
    .eq('kind', kind)
    .maybeSingle()
  if (!data || data.revoked_at || (data as any).partner_operators.status !== 'enabled') return null
  return data
}
