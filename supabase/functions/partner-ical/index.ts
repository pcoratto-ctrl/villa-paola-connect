import { buildIcs, fetchPartnerData, logAccess, resolveIcalToken, unavailable } from '../_shared/partner.ts'

Deno.serve(async (req) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405 })
  const t = await resolveIcalToken(new URL(req.url).searchParams.get('token'))
  if (!t) {
    await logAccess(null, 'ical', 'denied')
    return new Response('Not found', { status: 404 })
  }
  let ics: string
  try {
    ics = buildIcs(unavailable(await fetchPartnerData()))
  } catch (e) {
    console.error('partner-ical upstream error:', (e as Error).message)
    // never serve an empty 200 calendar: receivers would wipe all unavailability
    return new Response('Upstream unavailable', { status: 503, headers: { 'Retry-After': '300' } })
  }
  await logAccess(t.operator_id, 'ical', 'ok')
  return new Response(ics, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Disposition': 'inline; filename="villa-paola.ics"' },
  })
})
