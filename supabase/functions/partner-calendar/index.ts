import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { admin, fetchPartnerData, logAccess } from '../_shared/partner.ts'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401)
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const { data: op } = await admin().from('partner_operators').select('id, company, status').eq('user_id', user.id).maybeSingle()
  if (!op || op.status !== 'enabled') {
    await logAccess(req, op?.id ?? null, 'dashboard', 'denied')
    return json({ error: op ? 'suspended' : 'forbidden' }, 403)
  }
  // log at most once per 10 minutes per operator to keep history essential
  const { data: last } = await admin().from('partner_access_log').select('created_at').eq('operator_id', op.id).eq('kind', 'dashboard').order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (!last || Date.now() - new Date(last.created_at).getTime() > 600_000) await logAccess(req, op.id, 'dashboard', 'ok')

  try {
    return json({ company: op.company, data: await fetchPartnerData() })
  } catch (e) {
    const msg = (e as Error).message
    return json({ error: msg === 'upstream_not_configured' ? 'not_configured' : 'upstream_unavailable' }, 503)
  }
})
