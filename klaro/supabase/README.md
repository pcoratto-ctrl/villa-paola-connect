# Beta privata — note operative

Promemoria per chi gestisce l'accesso alla beta privata di Klaro.

## Before User Created Hook

- La funzione **`public.before_user_created_hook`** (migrazione `20260723091926`) va **attivata manualmente** nel pannello Supabase: **Authentication → Hooks → "Before User Created" → Postgres function → `public.before_user_created_hook`**. Nessuna migrazione può farlo al posto tuo — è configurazione di progetto, non schema del database.
- Verifica che risulti **Enabled** dopo averla selezionata.
- La policy RLS che permette a `supabase_auth_admin` di leggere l'allowlist (migrazione `20260723094532`) è indispensabile perché l'hook funzioni: senza di essa l'hook rifiuta *tutte* le registrazioni, comprese quelle autorizzate.

## Allowlist: due posti da tenere sincronizzati

- **`BETA_ALLOWED_EMAILS`** su Vercel (env var server-only, mai `NEXT_PUBLIC_`) → usata da middleware e dalle route `/api/ai/comment` e `/api/pdf`.
- **`public.beta_allowed_emails`** su Supabase → usata dall'hook e dai trigger su `clients`/`reports`.

Sono due meccanismi indipendenti per due livelli diversi (UX rapida lato app, enforcement non aggirabile lato database). **Aggiungere o rimuovere un tester richiede aggiornare entrambi.**

## ⚠️ Tabella vuota = nessuna registrazione consentita

A differenza dei trigger su `clients`/`reports` (che se `beta_allowed_emails` è vuota disattivano il gate, utile in sviluppo), **l'hook `before_user_created_hook` è "fail closed"**: se la tabella è vuota, **tutte** le nuove registrazioni vengono rifiutate, nessuna esclusa. Non lasciarla vuota in produzione se vuoi che i tester possano registrarsi.
