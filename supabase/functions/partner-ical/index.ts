import { fetchPartnerData, logAccess, resolveToken, unavailable } from '../_shared/partner.ts'

const ymd = (d: string) => d.replaceAll('-', '')

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get('token')
  const t = await resolveToken(token, 'ical')
  if (!t) {
    await logAccess(req, null, 'ical', 'denied')
    return new Response('Not found', { status: 404 })
  }
  await logAccess(req, t.operator_id, 'ical', 'ok')
  let ranges
  try { ranges = unavailable(await fetchPartnerData()) } catch { return new Response('Unavailable', { status: 503 }) }
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Villa Paola Caposuvero//Partner//IT', 'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH', 'X-WR-CALNAME:Villa Paola Caposuvero', 'X-WR-TIMEZONE:Europe/Rome',
    ...ranges.flatMap((r) => [
      'BEGIN:VEVENT',
      `UID:${ymd(r.arrival)}-${ymd(r.departure)}@villapaolacaposuvero.it`,
      `DTSTAMP:${stamp}`,
      // all-day, end-exclusive: departure day stays bookable
      `DTSTART;VALUE=DATE:${ymd(r.arrival)}`,
      `DTEND;VALUE=DATE:${ymd(r.departure)}`,
      'SUMMARY:Non disponibile',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Disposition': 'inline; filename="villa-paola.ics"' },
  })
})
