-- =============================================================
-- KLARO - Fix: l'hook before_user_created rifiutava TUTTE le registrazioni
--
-- Bug scoperto testando 20260723091926: il GRANT SELECT concesso a
-- supabase_auth_admin su public.beta_allowed_emails non basta da solo,
-- perché quella tabella ha Row Level Security abilitata SENZA alcuna
-- policy (voluto: blocca completamente anon/authenticated via REST).
-- RLS abilitata senza policy nega la lettura a QUALSIASI ruolo privo
-- dell'attributo BYPASSRLS — e supabase_auth_admin non ce l'ha (verificato:
-- rolbypassrls = false, a differenza di postgres/service_role).
--
-- prima: exists(select 1 from beta_allowed_emails where email = ...)
--        eseguito come supabase_auth_admin vedeva SEMPRE zero righe (RLS
--        filtrava tutto), quindi l'hook rifiutava anche le email autorizzate.
-- dopo: una policy SELECT dedicata, ristretta esplicitamente al solo ruolo
--        supabase_auth_admin, rende di nuovo visibili le righe SOLO a lui.
--        anon/authenticated restano bloccati come prima (nessuna policy
--        per loro, invariato).
-- =============================================================

create policy "beta_allowed_emails_select_auth_admin"
  on public.beta_allowed_emails
  for select
  to supabase_auth_admin
  using (true);
