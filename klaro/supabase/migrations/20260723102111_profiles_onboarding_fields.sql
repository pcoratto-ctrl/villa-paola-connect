-- =============================================================
-- KLARO - Fase 2: nome utente facoltativo + onboarding una tantum
--
-- Aggiunge due colonne a profiles e aggiorna handle_new_user() per
-- salvare il nome (facoltativo) passato nei metadata di registrazione.
-- Nessun impatto sugli account esistenti: entrambe le colonne sono
-- nullable, e la funzione aggiornata cambia solo per le PROSSIME
-- registrazioni (create or replace, non tocca le righe già presenti).
-- =============================================================

alter table public.profiles
  add column if not exists nome text,
  add column if not exists onboarding_completed_at timestamptz;

-- Backfill: gli account GIA' esistenti non devono vedere /benvenuto al
-- prossimo accesso (non è il loro vero primo accesso). Uso created_at
-- come data di completamento fittizia, dato che l'hanno già "vissuto"
-- prima che questa pagina esistesse.
update public.profiles
set onboarding_completed_at = created_at
where onboarding_completed_at is null;

-- Ridefinizione di handle_new_user(): identica all'originale in
-- schema.sql, con un'unica modifica alla prima insert (salva il nome se
-- presente nei metadata di signup). search_path irrigidito da 'public' a
-- '' per coerenza con le funzioni più recenti: tutti i riferimenti alle
-- tabelle erano già scritti per esteso (public.clients, ecc.), quindi il
-- cambio è senza effetti collaterali.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  demo_client_id uuid;
  m1 int; y1 int; -- mese scorso
  m2 int; y2 int; -- due mesi fa
begin
  insert into public.profiles (id, email, nome)
  values (new.id, new.email, nullif(trim(new.raw_user_meta_data ->> 'nome'), ''));

  -- calcola gli ultimi due mesi completi
  m1 := extract(month from (date_trunc('month', now()) - interval '1 month'))::int;
  y1 := extract(year  from (date_trunc('month', now()) - interval '1 month'))::int;
  m2 := extract(month from (date_trunc('month', now()) - interval '2 month'))::int;
  y2 := extract(year  from (date_trunc('month', now()) - interval '2 month'))::int;

  insert into public.clients (user_id, nome, colore_primario, obiettivi_testo)
  values (
    new.id,
    'Bar Centrale (demo)',
    '#b45309',
    'Aumentare la notorieta'' del locale in citta'', portare piu'' clienti agli eventi serali del weekend e far crescere la community locale su Instagram.'
  )
  returning id into demo_client_id;

  -- report di due mesi fa
  insert into public.reports (client_id, mese, anno, canale, dati_json, commento_ai, stato)
  values (
    demo_client_id, m2, y2, 'instagram',
    '{
      "reach": 18400,
      "impression": 42100,
      "follower_inizio": 2310,
      "follower_fine": 2455,
      "engagement_rate": 3.1,
      "numero_post": 14,
      "top_post": [
        {"testo": "Reel: dietro le quinte della nuova drink list", "metrica": "6.200 reach"},
        {"testo": "Carosello: 5 cocktail da provare questo mese", "metrica": "4.100 reach"},
        {"testo": "Foto: serata live jazz del venerdi''", "metrica": "3.300 reach"}
      ],
      "risultati_note": "Primo mese con calendario editoriale strutturato: 3 post a settimana piu'' stories quotidiane."
    }'::jsonb,
    'Questo mese segna l''avvio di una presenza strutturata su Instagram per Bar Centrale, con risultati incoraggianti per una fase di partenza. La copertura ha raggiunto 18.400 persone e i contenuti sono stati visualizzati oltre 42.000 volte, numeri solidi per un locale con un pubblico prevalentemente cittadino.

La community e'' cresciuta di 145 follower, passando da 2.310 a 2.455 (+6,3%). Il tasso di interazione del 3,1% e'' in linea con la media del settore ristorazione, e indica che i contenuti pubblicati parlano al pubblico giusto.

I contenuti video si confermano il formato piu'' efficace: il reel sul dietro le quinte della nuova drink list ha superato le 6.000 persone raggiunte, quasi il doppio del secondo miglior contenuto. Anche il racconto degli eventi dal vivo funziona bene.

Per il prossimo mese suggeriamo di: 1) aumentare la frequenza dei reel ad almeno due a settimana, dato il loro rendimento superiore; 2) promuovere gli eventi del weekend con contenuti dedicati gia'' dal lunedi'' precedente; 3) invitare i clienti a taggare il locale nelle stories, per ampliare la copertura organica.',
    'completo'
  );

  -- report del mese scorso
  insert into public.reports (client_id, mese, anno, canale, dati_json, commento_ai, stato)
  values (
    demo_client_id, m1, y1, 'instagram',
    '{
      "reach": 24900,
      "impression": 55800,
      "follower_inizio": 2455,
      "follower_fine": 2687,
      "engagement_rate": 3.8,
      "numero_post": 16,
      "top_post": [
        {"testo": "Reel: aperitivo al tramonto in terrazza", "metrica": "9.800 reach"},
        {"testo": "Reel: il barman prepara lo spritz perfetto", "metrica": "7.200 reach"},
        {"testo": "Carosello: menu'' degustazione di stagione", "metrica": "4.600 reach"}
      ],
      "risultati_note": "Raddoppiata la frequenza dei reel come da piano. Collaborazione con 2 micro influencer locali."
    }'::jsonb,
    'Il mese si chiude con una crescita netta su tutti gli indicatori principali, a conferma che la strategia impostata sta funzionando. La copertura e'' salita a 24.900 persone (+35% rispetto al mese precedente) e le visualizzazioni totali hanno raggiunto quota 55.800 (+33%).

La community e'' passata da 2.455 a 2.687 follower: 232 nuovi follower in un mese (+9,4%), il miglior risultato da inizio collaborazione. Anche la qualita'' delle interazioni migliora, con un tasso di engagement salito dal 3,1% al 3,8%.

La scelta di raddoppiare i reel si e'' rivelata corretta: i due contenuti migliori del mese sono entrambi video e insieme hanno raggiunto 17.000 persone. La collaborazione con i micro influencer locali ha contribuito ad allargare il pubblico oltre la cerchia dei clienti abituali.

Per il prossimo mese consigliamo di: 1) consolidare il formato reel mantenendo 2 uscite a settimana, puntando su contenuti con le persone del locale; 2) trasformare il pubblico raggiunto in presenze reali, promuovendo una promo riservata a chi segue il profilo; 3) ripetere la collaborazione con gli influencer che hanno portato piu'' interazioni.',
    'completo'
  );

  return new;
end;
$$;
