import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const LeadSchema = z.object({
  guest_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  arrival_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests_count: z.number().int().min(1).max(30).optional(),
  message: z.string().trim().max(1500).optional(),
})

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const CLIENT_EMAIL = Deno.env.get('CLIENT_EMAIL')
    if (!RESEND_API_KEY || !CLIENT_EMAIL) {
      throw new Error('Email service not configured')
    }

    const parsed = LeadSchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
    const lead = parsed.data

    // Insert lead into database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data, error } = await supabase
      .from('leads')
      .insert({
        guest_name: lead.guest_name,
        email: lead.email,
        phone: lead.phone || null,
        arrival_date: lead.arrival_date || null,
        departure_date: lead.departure_date || null,
        guests_count: lead.guests_count ?? null,
        message: lead.message || null,
      })
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Lead insert failed:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Send notification email to the owner
    const row = (label: string, value?: string | number | null) =>
      value
        ? `<tr><td style="padding:6px 12px;color:#666;font-size:14px;">${label}</td><td style="padding:6px 12px;font-size:14px;"><strong>${esc(String(value))}</strong></td></tr>`
        : ''

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#182026;color:#fff;padding:16px 24px;">
          <h2 style="margin:0;font-size:18px;">Nuova richiesta di disponibilità — Villa Paola</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;padding:12px;">
          ${row('Nome', lead.guest_name)}
          ${row('Email', lead.email)}
          ${row('Telefono', lead.phone)}
          ${row('Arrivo', lead.arrival_date)}
          ${row('Partenza', lead.departure_date)}
          ${row('Ospiti', lead.guests_count)}
        </table>
        ${lead.message ? `<div style="padding:12px 24px;font-size:14px;color:#333;border-top:1px solid #eee;"><strong>Messaggio:</strong><br/>${esc(lead.message).replace(/\n/g, '<br/>')}</div>` : ''}
        <div style="padding:12px 24px;font-size:12px;color:#999;">Rispondi direttamente a questa email per contattare l'ospite.</div>
      </div>`

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Villa Paola <onboarding@resend.dev>',
        to: [CLIENT_EMAIL],
        reply_to: lead.email,
        subject: `Richiesta disponibilità: ${lead.guest_name}${lead.arrival_date ? ` (${lead.arrival_date} → ${lead.departure_date ?? '?'})` : ''}`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const body = await resendRes.text()
      console.error(`Resend failed [${resendRes.status}]: ${body}`)
      // Lead is saved — don't fail the request, just log the email failure
    }

    return new Response(JSON.stringify({ id: data.id, created_at: data.created_at }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-lead error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
