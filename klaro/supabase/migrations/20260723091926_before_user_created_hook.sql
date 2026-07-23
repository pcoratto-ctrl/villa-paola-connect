-- =============================================================
-- KLARO - Hook "Before User Created" per la beta privata
--
-- Chiude il gap della migrazione precedente (20260722133308): finora
-- un'email non autorizzata poteva comunque completare signUp(), creando
-- auth.users + profilo + cliente demo + 2 report demo, per poi essere
-- bloccata solo al primo accesso alla dashboard. Questo hook viene chiamato
-- da Supabase Auth PRIMA che la riga in auth.users venga scritta: se
-- rifiuta, l'intera catena (trigger handle_new_user compreso) non parte
-- nemmeno, quindi nessuna riga viene creata da nessuna parte.
--
-- ATTENZIONE - RICHIEDE UN PASSAGGIO MANUALE NEL PANNELLO SUPABASE:
-- questa migrazione crea solo la funzione SQL e i permessi. L'hook non è
-- realmente "collegato" al flusso di autenticazione finché non lo attivi in
-- Authentication -> Hooks -> "Before User Created" -> Postgres function ->
-- seleziona public.before_user_created_hook. Nessuna migrazione può fare
-- questo passaggio al posto tuo: è una configurazione di progetto, non uno
-- schema di database.
--
-- Nota sui permessi: la documentazione Supabase sconsiglia esplicitamente
-- SECURITY DEFINER per gli auth hook Postgres (le funzioni create da
-- pannello con quel tag ereditano permessi troppo ampi). Si usa invece un
-- GRANT EXECUTE esplicito al ruolo supabase_auth_admin, che è quello con
-- cui Supabase Auth invoca realmente l'hook.
--
-- Nota sul comportamento "fail closed": a differenza dei trigger su
-- clients/reports (20260722133308), che se beta_allowed_emails è vuota
-- disattivano il gate (utile in sviluppo), questo hook è deliberatamente
-- "fail closed": tabella vuota = NESSUNA nuova registrazione consentita.
-- È il punto di ingresso più autorevole (gira prima che l'utente esista),
-- quindi un errore o una tabella non ancora popolata non deve mai tradursi
-- in un accesso libero.
-- =============================================================

-- La funzione gira con i permessi di chi la chiama (supabase_auth_admin,
-- non SECURITY DEFINER): deve poter leggere la tabella esplicitamente.
grant usage on schema public to supabase_auth_admin;
grant select on public.beta_allowed_emails to supabase_auth_admin;

create or replace function public.before_user_created_hook(event jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  utente_email text;
begin
  utente_email := lower(event -> 'user' ->> 'email');

  if utente_email is not null and exists (
    select 1 from public.beta_allowed_emails where email = utente_email
  ) then
    return jsonb_build_object();
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Questa beta privata è disponibile solo su invito. Pierpaolo sta seguendo personalmente un primo gruppo di 10 professionisti.'
    )
  );
end;
$$;

grant execute on function public.before_user_created_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.before_user_created_hook(jsonb) from public, anon, authenticated;
