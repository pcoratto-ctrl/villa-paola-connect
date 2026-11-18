# Calendario operatori: analisi (nessuna modifica)

## Cosa esiste già
- **Pubblicazione:** il dominio villapaolacaposuvero.it (anche www) punta all'hosting Lovable, non a un hosting Aruba. Aruba gestisce solo le email del dominio, perché i server di posta (MX) sono suoi. Per questo il proxy in PHP su Aruba non serve e oggi non sarebbe raggiungibile.
- **Accesso:** c'è un solo accesso con email e password, usato dall'area admin (`/admin`). La registrazione pubblica è chiusa.
- **Ruoli:** sono salvati in una tabella `user_roles` separata, con tre valori possibili: admin, moderator, user. Solo `admin` è usato; dà accesso a leads e recensioni.
- **Area operatori:** non esiste ancora. Non c'è nessuna pagina `/calendario` e nessun ruolo dedicato agli operatori.
- **Funzioni del backend:** ci sono `notify-lead` e `mcp`, ma nessun proxy verso il Centro operativo.
- **Centro operativo:** l'indirizzo `/calendario/partner-data` risponde 401 se lo si chiama senza header, quindi la protezione è attiva.

## Soluzione proposta (proxy sul backend del sito)
1. **Nuovo ruolo:** aggiungere `partner` ai ruoli esistenti. Gli operatori approvati ricevono solo `partner` e non vedono leads né recensioni, che restano riservati ad `admin`.
2. **Funzione `partner-calendar`:**
   - controlla che chi chiama abbia effettuato l'accesso e abbia il ruolo partner;
   - chiama il Centro operativo dal server, aggiungendo `OAI-Sites-Authorization: Bearer …` e `X-VP-Pickup`;
   - restituisce solo i campi ammessi: lastNight, cleaningCents, electricityIncluded, linenIncluded, bookings (solo date di arrivo e partenza) e periods. Qualsiasi altro campo viene scartato;
   - tiene in memoria la risposta per circa 10 secondi, così molti operatori collegati insieme non sovraccaricano il Centro operativo.
3. **Pagine `/calendario/login` e `/calendario`:**
   - non indicizzate dai motori di ricerca ed escluse dalla sitemap;
   - aggiornamento ogni 15 secondi, sospeso quando la scheda non è in primo piano;
   - il giorno di "oggi" calcolato sul fuso Europe/Rome;
   - notti calcolate con la partenza esclusa, quindi la notte della partenza resta libera;
   - mezze caselle nel giorno di arrivo (dalle 15:00) e in quello di partenza (fino alle 10:00);
   - giorni passati oscurati e nessuna data oltre lastNight;
   - colori distinti per prezzo, blocco, opzione e prenotato.
4. **Credenziali:** solo come segreti del backend, mai nel codice del sito.

## Configurazioni mancanti, da fornire
- **Valori dei due segreti:** il token Bearer e X-VP-Pickup. Li inserisce il proprietario nei Segreti del progetto.
- **Elenco degli operatori approvati:** l'admin crea gli account. Va deciso anche come vengono approvati: inviti manuali oppure richiesta con approvazione.
- **Conferme sui dati:** che `bookings` non contenga mai nomi o altri dati personali (il proxy li filtra comunque) e che i prezzi siano in centesimi e per notte.
- **Pagina /calendario:** va confermato che deve stare su questo sito. Nella cronologia è indicata come "in sviluppo".

## Note tecniche
- Il proxy in PHP non è necessario e diventerebbe possibile solo spostando l'hosting su Aruba, cosa che sconsiglio.
- Per aggiungere `partner` serve una modifica al database. Le regole di accesso ai dati esistenti restano invariate.
- Questa analisi non ha modificato file, dati o permessi e non ha pubblicato nulla.
