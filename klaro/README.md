# Klaro

Klaro aiuta i social media manager freelance a generare il **report mensile brandizzato**
per i loro clienti (social organico: Instagram, TikTok, LinkedIn) in meno di 5 minuti.
Si inseriscono a mano pochi numeri e si ottiene un **PDF con logo e colori del cliente**,
un **commento scritto dall'AI** (Claude) e il **confronto col mese precedente**.
Nessuna integrazione con le API dei social network.

## Stack

| Livello | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) + React + Tailwind CSS, mobile-first |
| Backend / DB / Auth / Storage | Supabase (auth email+password, Postgres con RLS, bucket per i loghi) |
| Pagamenti | Stripe Checkout + Customer Portal (abbonamenti Starter e Pro) |
| AI | Anthropic API — modello Claude Sonnet (`claude-sonnet-5`) |
| PDF | `@react-pdf/renderer` lato server (route `/api/pdf`) — funziona anche su Vercel serverless |
| Grafici | Recharts |
| Deploy | Vercel |

## Struttura

```
klaro/
├── supabase/schema.sql        # Schema DB completo: tabelle, RLS, storage, dati demo
├── src/
│   ├── middleware.ts          # Protezione route + refresh sessione Supabase
│   ├── app/
│   │   ├── page.tsx           # Landing pubblica
│   │   ├── login/ register/   # Auth Supabase
│   │   ├── (app)/
│   │   │   ├── dashboard/     # Lista clienti + "Nuovo report"
│   │   │   ├── clients/       # Nuovo cliente + scheda cliente (brand + storico)
│   │   │   ├── reports/new/   # Wizard a 3 step
│   │   │   ├── reports/[id]/  # Anteprima report + commento editabile + PDF
│   │   │   └── settings/      # Abbonamento Stripe
│   │   └── api/
│   │       ├── ai/comment/    # Genera il commento con Claude
│   │       ├── pdf/           # Genera il PDF brandizzato
│   │       └── stripe/        # checkout, portal, webhook
│   ├── components/            # Wizard, grafici, form cliente, ecc.
│   └── lib/                   # Supabase client, Stripe, piani, tipi, PDF
└── .env.example
```

---

## 1. Setup Supabase

1. Crea un progetto su [supabase.com](https://supabase.com) (regione EU consigliata).
2. Apri **SQL Editor** → incolla tutto il contenuto di `supabase/schema.sql` → **Run**.
   Questo crea tabelle (`profiles`, `clients`, `reports`), policy RLS, il bucket `logos`
   e il trigger che, per ogni nuovo utente, precarica il cliente demo **"Bar Centrale"**
   con 2 mesi di report già compilati.
3. In **Authentication → Providers → Email**: lascia attivo Email/Password.
   - Per sviluppo veloce puoi **disattivare "Confirm email"** (login immediato dopo la
     registrazione). In produzione tienila attiva.
4. In **Authentication → URL Configuration**: imposta *Site URL* all'URL dell'app
   (es. `https://tuodominio.it`) e aggiungi `https://tuodominio.it/auth/callback`
   tra i *Redirect URLs* (più `http://localhost:3000/auth/callback` per lo sviluppo).
5. Copia da **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (usata SOLO dal webhook Stripe)

## 2. Setup Anthropic

1. Crea una chiave su [console.anthropic.com](https://console.anthropic.com) → `ANTHROPIC_API_KEY`.
2. Il commento usa il modello `claude-sonnet-5`; costo tipico per report: pochi centesimi.

## 3. Setup Stripe (modalità test)

1. Crea un account su [stripe.com](https://stripe.com) e resta in **Test mode**.
2. **Product catalog → Add product**, due prodotti con prezzo ricorrente mensile:
   - *Klaro Starter* — €15,00/mese → copia il `price_...` → `STRIPE_PRICE_STARTER`
   - *Klaro Pro* — €39,00/mese → copia il `price_...` → `STRIPE_PRICE_PRO`

   > Le cifre mostrate nell'app (landing e Impostazioni) sono in `src/lib/plans.ts`
   > (`PLAN_PRICE`). Se scegli importi diversi in Stripe, allinea quei testi: Klaro
   > non inventa mai un Price ID, li legge dagli env `STRIPE_PRICE_*`.
3. **Developers → API keys**: copia la *Secret key* (`sk_test_...`) → `STRIPE_SECRET_KEY`.
4. Webhook:
   - **In locale**: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
     (Stripe CLI) e copia il `whsec_...` stampato → `STRIPE_WEBHOOK_SECRET`.
   - **In produzione**: **Developers → Webhooks → Add endpoint** con URL
     `https://tuodominio.it/api/stripe/webhook` e questi eventi:
     `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.deleted`. Copia il *Signing secret* → `STRIPE_WEBHOOK_SECRET`.
5. Attiva il **Customer Portal** in *Settings → Billing → Customer portal* (serve per
   il bottone "Gestisci abbonamento").

## 4. Avvio in locale

```bash
cd klaro
cp .env.example .env.local   # e compila tutti i valori
npm install
npm run dev                  # http://localhost:3000
```

---

## 5. Deploy su Vercel (passo-passo)

1. Push del repository su GitHub.
2. Su [vercel.com](https://vercel.com) → **Add New → Project** → importa il repo.
3. **IMPORTANTE**: in *Configure Project* imposta **Root Directory = `klaro`**
   (l'app Next.js vive nella sottocartella `klaro/` del repo). Framework: Next.js
   (rilevato in automatico).
4. In **Environment Variables** aggiungi tutte le variabili di `.env.example`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`,
   `NEXT_PUBLIC_APP_URL` (= l'URL Vercel, es. `https://klaro.vercel.app`).
5. **Deploy**. Al termine hai l'URL `https://<progetto>.vercel.app`.
6. Aggiorna: (a) il webhook Stripe con l'URL di produzione; (b) la *Site URL* e i
   *Redirect URLs* su Supabase; (c) `NEXT_PUBLIC_APP_URL` su Vercel → *Redeploy*.

### Collegare un dominio

1. Vercel → progetto → **Settings → Domains → Add** → inserisci `tuodominio.it`.
2. Dal tuo provider DNS aggiungi i record indicati da Vercel
   (di solito `A 76.76.21.21` per l'apex e `CNAME cname.vercel-dns.com` per `www`).
3. Attendi la verifica (il certificato HTTPS è automatico).
4. Aggiorna `NEXT_PUBLIC_APP_URL`, il webhook Stripe e gli URL Supabase col nuovo dominio.

### Passare Stripe da test a live

1. In Stripe esci dalla Test mode (toggle in alto) e **ricrea i due prodotti/prezzi**
   in modalità live (i `price_...` di test non esistono in live).
2. Sostituisci su Vercel: `STRIPE_SECRET_KEY` → `sk_live_...`,
   `STRIPE_PRICE_STARTER`/`STRIPE_PRICE_PRO` → i nuovi `price_...` live.
3. Crea un **nuovo webhook endpoint live** (stesso URL, stessi 3 eventi) e aggiorna
   `STRIPE_WEBHOOK_SECRET` col suo signing secret.
4. Completa l'attivazione dell'account Stripe (dati aziendali/IBAN) e **Redeploy** su Vercel.
5. Fai un pagamento reale di verifica (puoi rimborsarlo subito da Stripe).

---

## 6. Checklist di test

Esegui in ordine (in locale o sull'URL di produzione con Stripe in test mode):

- [ ] **Registrazione** — `/register` con email+password. Se la conferma email è attiva,
      clicca il link ricevuto. Al primo login la dashboard mostra già
      **"Bar Centrale (demo)"** con 2 report compilati (dati demo automatici).
- [ ] **Esplora la demo** — apri Bar Centrale → storico con 2 report → apri il più
      recente: KPI con variazioni %, grafici, commento AI già scritto.
- [ ] **Creazione cliente** — Dashboard → "+ Nuovo cliente": nome, upload logo (PNG < 2 MB),
      colore dal color picker, obiettivi. Verifica che appaia in dashboard con logo e colore.
- [ ] **Primo report senza storico** — "Nuovo report" → seleziona il cliente appena creato →
      inserisci i numeri (prova a lasciare un campo vuoto: la validazione blocca con
      messaggio chiaro) → anteprima: l'avviso dice che non c'è il mese precedente e il
      commento AI **non fa confronti** e lo dichiara.
- [ ] **Secondo report con confronto** — nuovo report per lo stesso cliente e canale, mese
      successivo: i KPI mostrano le variazioni %, il grafico affianca i due mesi e il
      commento AI cita le percentuali di crescita/calo.
- [ ] **Modifica del commento** — in anteprima (o nella pagina report con "✎ Modifica")
      cambia il testo → salva → ricarica: la modifica persiste e finisce nel PDF.
- [ ] **Download PDF** — "⬇ Scarica PDF": copertina con logo+colore del cliente, pagina
      numeri con barre e highlights, pagina commento. Sul piano gratuito il footer dice
      "Creato con Klaro"; con un piano a pagamento è white-label. Prova anche da smartphone.
- [ ] **Errore AI gestito** — (opzionale) metti una `ANTHROPIC_API_KEY` errata: la
      generazione mostra un errore chiaro, i dati inseriti NON si perdono (bozza salvata
      sul dispositivo) e puoi riprovare o scrivere il commento a mano.
- [ ] **Prova gratuita** — un account appena registrato è in "Prova gratuita" per 14
      giorni: la dashboard mostra i giorni rimanenti, il limite clienti è 20 e il PDF è
      già white-label. La prova è calcolata dalla data di registrazione (`profiles.created_at`),
      nessuna configurazione richiesta.
- [ ] **Free tier dopo la prova** — per simulare la fine prova senza aspettare 14 giorni,
      nel DB porta indietro `profiles.created_at` di oltre 14 giorni (es. SQL Editor:
      `update profiles set created_at = now() - interval '20 days' where id = '<tuo-id>'`).
      Ricarica: il piano diventa "Gratuito" (1 cliente) e il PDF torna col footer
      "Creato con Klaro". Provando a creare un 2° cliente vieni portato alle Impostazioni.
- [ ] **Pagamento Stripe (test)** — Impostazioni → "Passa a Starter" → nel Checkout usa la
      carta di test `4242 4242 4242 4242` (qualsiasi scadenza futura, CVC 123). Al ritorno
      il piano diventa "Starter" (webhook) e puoi creare fino a 5 clienti; il PDF resta
      white-label. "Gestisci abbonamento" apre il Customer Portal; disdicendo, il piano
      torna al comportamento Gratuito.
- [ ] **Mobile** — ripeti il flusso principale da smartphone: wizard a step verticali,
      bottoni grandi, grafici responsive, download PDF funzionante.

## Note di progetto

- **Dati demo**: creati da un trigger Postgres alla registrazione (`handle_new_user` in
  `schema.sql`), così ogni nuovo utente esplora l'app senza inserire nulla.
- **Piani e prova gratuita** (`src/lib/plans.ts`): i limiti sono sul numero di clienti,
  mai sui report (sempre illimitati). Gratuito = 1 cliente + footer "Creato con Klaro";
  Starter = 5 clienti white-label; Pro = 20 clienti white-label. La prova gratuita di 14
  giorni (`TRIAL_DAYS`) è dedotta da `profiles.created_at`: nessun campo DB nuovo, nessuna
  migrazione. `resolvePlan()` calcola il piano effettivo e viene usato in dashboard,
  creazione cliente, Impostazioni e generazione PDF.
- **Gestione errori**: validazione dei numeri nel wizard; bozza in `localStorage` che
  sopravvive a errori AI/salvataggio; retry automatici (3) verso l'API Anthropic con
  messaggi chiari; se il PDF fallisce la pagina report è già un'anteprima HTML stampabile
  ("Stampa questa pagina").
- **Sicurezza**: RLS su tutte le tabelle (ogni utente vede solo i propri dati); la
  service-role key è usata esclusivamente dal webhook Stripe lato server; il bucket
  loghi consente scrittura solo nella cartella del proprio utente.
- **White-label**: il marchio Klaro compare nel PDF solo sul piano gratuito
  (`isWhiteLabel` in `src/lib/plans.ts`).
