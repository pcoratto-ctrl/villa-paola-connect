import { fetchPartnerData, logAccess, resolveToken, unavailable } from '../_shared/partner.ts'

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin') ?? ''
  const token = new URL(req.url).searchParams.get('token')
  const t = await resolveToken(token, 'widget')
  const allowed = !!t && t.allowed_origins.includes(origin)
  const cors = allowed
    ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }
    : {}
  if (req.method === 'OPTIONS') return new Response(null, { status: allowed ? 204 : 403, headers: cors })
  if (!allowed) {
    await logAccess(req, t?.operator_id ?? null, 'widget', 'denied')
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }
  await logAccess(req, t!.operator_id, 'widget', 'ok')
  try {
    const d = await fetchPartnerData()
    return new Response(JSON.stringify({ lastNight: d.lastNight, unavailable: unavailable(d) }), {
      headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'unavailable' }), { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
