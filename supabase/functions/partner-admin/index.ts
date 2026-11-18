import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'
import { admin, sha256 } from '../_shared/partner.ts'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const randomToken = (bytes = 32) =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(bytes)))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' }[c]!))

const Body = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    company: z.string().trim().min(1).max(150),
    contact_name: z.string().trim().max(120).optional(),
    email: z.string().trim().toLowerCase().email().max(200),
    phone: z.string().trim().max(40).optional(),
    notes: z.string().trim().max(1000).optional(),
  }),
  z.object({ action: z.literal('set_status'), operator_id: z.string().uuid(), status: z.enum(['enabled', 'suspended', 'revoked']) }),
  z.object({ action: z.literal('reset_password'), operator_id: z.string().uuid() }),
  z.object({
    action: z.literal('issue_token'),
    operator_id: z.string().uuid(),
    kind: z.enum(['ical', 'widget']),
    allowed_origins: z.array(z.string().url().max(200).transform((u) => new URL(u).origin)).max(10).default([]),
  }),
  z.object({ action: z.literal('revoke_token'), token_id: z.string().uuid() }),
])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const auth = req.headers.get('Authorization') ?? ''
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const db = admin()
  const { data: isAdmin } = await db.rpc('has_role', { _user_id: user.id, _role: 'admin' })
  if (!isAdmin) return json({ error: 'forbidden' }, 403)

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400)
  const b = parsed.data

  if (b.action === 'create') {
    const password = randomToken(12)
    const { data: created, error } = await db.auth.admin.createUser({ email: b.email, password, email_confirm: true })
    if (error || !created.user) return json({ error: error?.message ?? 'create_failed' }, 400)
    await db.from('user_roles').insert({ user_id: created.user.id, role: 'partner' })
    const { data: op, error: e2 } = await db.from('partner_operators').insert({
      user_id: created.user.id, company: b.company, contact_name: b.contact_name || null, email: b.email, phone: b.phone || null, notes: b.notes || null,
    }).select().single()
    if (e2) return json({ error: e2.message }, 400)
    return json({ operator: op, temporary_password: password })
  }

  if (b.action === 'set_status') {
    const { data: op } = await db.from('partner_operators').update({ status: b.status }).eq('id', b.operator_id).select('user_id').single()
    if (b.status === 'revoked') {
      await db.from('partner_feed_tokens').update({ revoked_at: new Date().toISOString() }).eq('operator_id', b.operator_id).is('revoked_at', null)
    }
    if (op?.user_id) {
      // sign out existing sessions when not enabled; dashboard also re-checks status on every request
      await db.auth.admin.updateUserById(op.user_id, { ban_duration: b.status === 'enabled' ? 'none' : '876000h' })
    }
    return json({ ok: true })
  }

  if (b.action === 'reset_password') {
    const { data: op } = await db.from('partner_operators').select('user_id').eq('id', b.operator_id).single()
    if (!op?.user_id) return json({ error: 'not_found' }, 404)
    const password = randomToken(12)
    await db.auth.admin.updateUserById(op.user_id, { password })
    return json({ temporary_password: password })
  }

  if (b.action === 'issue_token') {
    if (b.kind === 'widget' && b.allowed_origins.length === 0) return json({ error: 'origins_required' }, 400)
    // one active token per kind: rotating revokes the previous one
    await db.from('partner_feed_tokens').update({ revoked_at: new Date().toISOString() }).eq('operator_id', b.operator_id).eq('kind', b.kind).is('revoked_at', null)
    const token = randomToken(32)
    await db.from('partner_feed_tokens').insert({ operator_id: b.operator_id, kind: b.kind, token_hash: await sha256(token), allowed_origins: b.allowed_origins })
    return json({ token })
  }

  if (b.action === 'revoke_token') {
    await db.from('partner_feed_tokens').update({ revoked_at: new Date().toISOString() }).eq('id', b.token_id)
    return json({ ok: true })
  }
  return json({ error: 'unknown' }, 400)
})
