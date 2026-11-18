import { createClient } from 'npm:@supabase/supabase-js@2'
import { normalizeSecret, sanitize, upstreamHeaders, type PartnerData } from './partnerCore.ts'
export * from './partnerCore.ts'

const UPSTREAM = 'https://villa-paola-centro-operativo.r-falvo.chatgpt.site/calendario/partner-data'

export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

let cache: { at: number; data: PartnerData } | null = null

/** Server-to-server fetch; credentials live only in backend secrets. Throws on any upstream problem. */
export async function fetchPartnerData(): Promise<PartnerData> {
  if (cache && Date.now() - cache.at < 10_000) return cache.data
  const bearer = normalizeSecret(Deno.env.get('VP_CENTRO_BEARER'))
  const pickup = normalizeSecret(Deno.env.get('VP_CENTRO_PICKUP'))
  if (!bearer || !pickup) throw new Error('upstream_not_configured')
  const res = await fetch(UPSTREAM, {
    headers: upstreamHeaders(bearer, pickup),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`upstream_${res.status}`)
  const data = sanitize(await res.json())
  cache = { at: Date.now(), data }
  return data
}

export async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Minimal log: timestamp, operator, kind, outcome. No IP, no browser. 12-month retention. */
export async function logAccess(operator_id: string | null, kind: 'dashboard' | 'ical', outcome: 'ok' | 'denied') {
  const db = admin()
  await db.from('partner_access_log').insert({ operator_id, kind, outcome })
  if (operator_id && outcome === 'ok') await db.from('partner_operators').update({ last_access_at: new Date().toISOString() }).eq('id', operator_id)
  if (Math.random() < 0.02) await db.from('partner_access_log').delete().lt('created_at', new Date(Date.now() - 365 * 864e5).toISOString())
}

/** Resolve an active iCal token; operator status is re-checked on every request. */
export async function resolveIcalToken(token: string | null) {
  if (!token || token.length < 32 || token.length > 128) return null
  const { data } = await admin()
    .from('partner_feed_tokens')
    .select('id, operator_id, revoked_at, partner_operators!inner(status)')
    .eq('token_hash', await sha256(token))
    .eq('kind', 'ical')
    .maybeSingle()
  if (!data || data.revoked_at || (data as any).partner_operators.status !== 'enabled') return null
  return data
}
