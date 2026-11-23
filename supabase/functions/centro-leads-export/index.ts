import { createClient } from 'npm:@supabase/supabase-js@2'

const EXPECTED_DIGEST = 'bb69241d97b0e1de06834d752a8c23687dd6a49aa2f1d4f0f60f528b0adcf4a2'
const EXPORT_FROM = '2026-11-23T17:17:48.509Z'
const PAGE_SIZE = 100
const COLUMNS = 'id, created_at, guest_name, email, phone, arrival_date, departure_date, guests_count, message'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/
const TOKEN_RE = /^Bearer ([0-9a-f]{64})$/

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

async function authorized(header: string | null): Promise<boolean> {
  const m = header ? TOKEN_RE.exec(header) : null
  const input = m ? m[1] : 'invalid'
  const buf = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)))
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
  let diff = 0
  for (let i = 0; i < EXPECTED_DIGEST.length; i++) diff |= hex.charCodeAt(i) ^ EXPECTED_DIGEST.charCodeAt(i)
  return m !== null && diff === 0
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' })
    if (!(await authorized(req.headers.get('Authorization')))) return json(401, { error: 'unauthorized' })

    const url = new URL(req.url)
    const afterCreated = url.searchParams.get('after_created_at')
    const afterId = url.searchParams.get('after_id')
    if ((afterCreated === null) !== (afterId === null)) return json(400, { error: 'cursor_requires_both_params' })
    let cursorIso: string | null = null
    if (afterCreated !== null && afterId !== null) {
      const d = new Date(afterCreated)
      if (!ISO_RE.test(afterCreated) || isNaN(d.getTime()) || !UUID_RE.test(afterId)) {
        return json(400, { error: 'invalid_cursor' })
      }
      cursorIso = afterCreated
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
      auth: { persistSession: false },
    })
    let q = supabase.from('leads').select(COLUMNS).gte('created_at', EXPORT_FROM)
    if (cursorIso && afterId) {
      q = q.or(`created_at.gt.${cursorIso},and(created_at.eq.${cursorIso},id.gt.${afterId.toLowerCase()})`)
    }
    const { data, error } = await q
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(PAGE_SIZE)
    if (error) {
      console.error('centro-leads-export: query_failed')
      return json(500, { error: 'query_failed' })
    }
    return json(200, { leads: data ?? [] })
  } catch {
    console.error('centro-leads-export: internal_error')
    return json(500, { error: 'internal_error' })
  }
})
