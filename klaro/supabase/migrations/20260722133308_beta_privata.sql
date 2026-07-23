-- =============================================================
-- KLARO - Migrazione beta privata
-- Prima migrazione CLI-standard di questo progetto (supabase/config.toml
-- creato con `supabase init`, file generato con `supabase migration new`):
-- applicala con `supabase db push` dopo aver collegato il progetto con
-- `supabase link`. In alternativa, puoi ancora incollarla nel SQL Editor di
-- Supabase (dopo schema.sql) se preferisci non usare la CLI.
-- Aggiunge, senza toccare nulla di esistente:
--   1) una tabella di email autorizzate alla beta (enforcement DB-level,
--      non aggirabile da chiamate REST dirette che bypassano l'app);
--   2) limiti "2 clienti reali / 10 report" per tester, anch'essi
--      applicati a livello di trigger (quindi validi anche bypassando
--      l'interfaccia), col cliente demo escluso dal conteggio;
--   3) limiti di lunghezza sui campi di testo semplici via CHECK.
--
-- IMPORTANTE: la lista qui sotto deve restare sincronizzata "a mano" con
-- la variabile d'ambiente BETA_ALLOWED_EMAILS usata dall'app Next.js
-- (middleware + route /api/ai/comment e /api/pdf). Sono due meccanismi
-- indipendenti per due livelli diversi (UX rapida lato app, enforcement
-- non aggirabile lato DB): per aggiungere/rimuovere un tester aggiorna
-- entrambi.
-- =============================================================

-- ---------- 1) Tabella email autorizzate ----------

create table if not exists public.beta_allowed_emails (
  email text primary key
);

alter table public.beta_allowed_emails enable row level security;
-- Nessuna policy: né anon né authenticated possono leggere/scrivere questa
-- tabella via PostgREST (RLS abilitata senza policy = accesso negato a
-- chiunque non sia il proprietario/superuser). In più, revoca esplicita dei
-- privilegi a livello di GRANT: doppia barriera anche se in futuro la RLS
-- venisse per errore disabilitata o una policy aggiunta per sbaglio.
revoke all on public.beta_allowed_emails from public, anon, authenticated;

-- Normalizza sempre in minuscolo le email salvate qui, indipendentemente da
-- come vengono inserite: evita mismatch col confronto lower(...) fatto dai
-- trigger sotto.
create or replace function public.normalize_beta_allowed_email()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.email := lower(new.email);
  return new;
end;
$$;

revoke execute on function public.normalize_beta_allowed_email() from public, anon, authenticated;

drop trigger if exists trg_normalize_beta_allowed_email on public.beta_allowed_emails;
create trigger trg_normalize_beta_allowed_email
  before insert or update on public.beta_allowed_emails
  for each row execute function public.normalize_beta_allowed_email();

-- Popola qui le email dei 10 tester (maiuscole/minuscole indifferente: il
-- trigger sopra normalizza comunque in minuscolo). Esempio:
-- insert into public.beta_allowed_emails (email) values
--   ('tester1@esempio.it'),
--   ('tester2@esempio.it')
-- on conflict (email) do nothing;
--
-- Se questa tabella resta VUOTA, il gate beta è disattivato (nessun blocco):
-- stesso comportamento "opt-in" della variabile BETA_ALLOWED_EMAILS lato app.

-- ---------- 2) Limiti di lunghezza (CHECK, campi scalari) ----------

alter table public.clients
  drop constraint if exists clients_nome_len,
  add constraint clients_nome_len check (char_length(nome) <= 150);

alter table public.clients
  drop constraint if exists clients_obiettivi_len,
  add constraint clients_obiettivi_len check (
    obiettivi_testo is null or char_length(obiettivi_testo) <= 2000
  );

alter table public.reports
  drop constraint if exists reports_commento_len,
  add constraint reports_commento_len check (
    commento_ai is null or char_length(commento_ai) <= 8000
  );
-- 8.000 e non 3.000: commento_ai contiene le 5 sezioni del commento AI
-- combinate (non un singolo campo di testo libero), quindi serve un tetto
-- più alto — è comunque un limite di sicurezza contro input patologici, non
-- il limite "normale" di 3.000 usato per i singoli campi in dati_json.

-- Nota sui campi di testo dentro dati_json (contesto, note, top_post): sono
-- già validati con Zod (max 3.000 / 300 caratteri) nella route
-- /api/ai/comment quando si genera il commento con l'AI. Applicare lo stesso
-- limite anche quando si salva un report senza mai generare un commento AI
-- (modalità 100% manuale) richiederebbe validare campi annidati in una
-- colonna jsonb: per non introdurre nuova complessità in questa beta, resta
-- una protezione lato UI (maxLength) più il tetto grezzo sulla dimensione
-- totale del JSON qui sotto, non un limite per singolo campo.

-- ---------- 3) Trigger: gate beta + limite clienti ----------

create or replace function public.check_beta_client_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  utente_email text;
  n_allowlist int;
  n_clienti_reali int;
begin
  -- Il cliente demo viene creato automaticamente da handle_new_user() durante
  -- la registrazione (trigger su auth.users), in un contesto di sistema privo
  -- di un JWT di sessione utente: auth.jwt() lì risulterebbe null, e senza
  -- questa uscita anticipata QUALSIASI nuova registrazione fallirebbe non
  -- appena beta_allowed_emails contiene righe. L'uscita è ristretta al PRIMO
  -- cliente in assoluto dell'utente (condizione vera solo durante il seeding
  -- automatico): rinominare un cliente successivo esattamente "Bar Centrale
  -- (demo)" non basterebbe a eludere allowlist o limite.
  if new.nome = 'Bar Centrale (demo)'
     and not exists (select 1 from public.clients where user_id = new.user_id)
  then
    return new;
  end if;

  select count(*) into n_allowlist from public.beta_allowed_emails;
  if n_allowlist > 0 then
    -- Legge l'email direttamente dal claim del JWT della sessione che sta
    -- eseguendo l'inserimento (riflette chi sta davvero operando, non un
    -- user_id dichiarato nella riga, che comunque la RLS verifica a parte).
    -- lower() anche qui: la tabella è già normalizzata da un trigger, ma un
    -- confronto case-insensitive su entrambi i lati non costa nulla.
    utente_email := lower(auth.jwt() ->> 'email');
    if utente_email is null or not exists (
      select 1 from public.beta_allowed_emails where lower(email) = utente_email
    ) then
      raise exception 'Il tuo account non è ancora abilitato per la beta privata di Klaro.';
    end if;
  end if;

  select count(*) into n_clienti_reali
  from public.clients
  where user_id = new.user_id and nome <> 'Bar Centrale (demo)';
  if n_clienti_reali >= 2 then
    raise exception 'Hai raggiunto il limite di 2 clienti reali della beta privata.';
  end if;

  return new;
end;
$$;

-- Funzione richiamabile solo dal motore trigger di Postgres (RETURNS
-- trigger), non invocabile via REST/RPC; revoca comunque esplicita di
-- EXECUTE per chiarezza e come barriera aggiuntiva.
revoke execute on function public.check_beta_client_insert() from public, anon, authenticated;

drop trigger if exists trg_check_beta_client_insert on public.clients;
create trigger trg_check_beta_client_insert
  before insert on public.clients
  for each row execute function public.check_beta_client_insert();

-- ---------- 4) Trigger: gate beta + limite report + tetto dimensione JSON ----------

create or replace function public.check_beta_report_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  proprietario uuid;
  nome_cliente text;
  utente_email text;
  n_allowlist int;
  n_report int;
begin
  select user_id, nome into proprietario, nome_cliente
  from public.clients where id = new.client_id;

  -- I 2 report demo li inserisce automaticamente handle_new_user() durante
  -- la registrazione, nello stesso contesto di sistema senza JWT descritto
  -- sopra per check_beta_client_insert(): stessa uscita anticipata, stessa
  -- ragione. Ristretta ai primi 2 report del cliente demo (quanti ne crea il
  -- seeding): rinominare un client pieno di report esattamente come il demo
  -- non basterebbe a eludere il limite totale.
  if nome_cliente = 'Bar Centrale (demo)'
     and (select count(*) from public.reports where client_id = new.client_id) < 2
  then
    return new;
  end if;

  select count(*) into n_allowlist from public.beta_allowed_emails;
  if n_allowlist > 0 then
    utente_email := lower(auth.jwt() ->> 'email');
    if utente_email is null or not exists (
      select 1 from public.beta_allowed_emails where lower(email) = utente_email
    ) then
      raise exception 'Il tuo account non è ancora abilitato per la beta privata di Klaro.';
    end if;
  end if;

  select count(*) into n_report
  from public.reports r
  join public.clients c on c.id = r.client_id
  where c.user_id = proprietario and c.nome <> 'Bar Centrale (demo)';
  if n_report >= 10 then
    raise exception 'Hai raggiunto il limite di 10 report della beta privata.';
  end if;

  if pg_column_size(new.dati_json) > 51200 then
    raise exception 'I dati del report sono troppo estesi (oltre 50 KB): accorcia i testi inseriti.';
  end if;

  return new;
end;
$$;

revoke execute on function public.check_beta_report_insert() from public, anon, authenticated;

drop trigger if exists trg_check_beta_report_insert on public.reports;
create trigger trg_check_beta_report_insert
  before insert on public.reports
  for each row execute function public.check_beta_report_insert();
