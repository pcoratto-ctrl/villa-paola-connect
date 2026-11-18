# Area riservata operatori e calendario Villa Paola (piano, nessuna modifica eseguita)

## Cosa esiste già
- **Pubblicazione:** villapaolacaposuvero.it (anche www) è pubblicato sull'hosting Lovable, non su un hosting Aruba. Aruba gestisce solo le email del dominio. Per questo il proxy in PHP su Aruba non serve.
- **Accesso:** c'è già l'accesso con email e password, usato oggi solo da `/admin`. La registrazione pubblica è chiusa e la protezione contro le password compromesse è attiva.
- **Ruoli:** sono salvati in una tabella `user_roles` separata, con i valori admin, moderator e user. Solo `admin` è usato e dà accesso a leads e recensioni.
- **Area operatori:** non esiste. Mancano la pagina `/calendario`, il ruolo partner, l'anagrafica degli operatori, lo storico degli accessi, il collegamento al Centro operativo e l'iCal.
- **Centro operativo:** `/calendario/partner-data` risponde 401 senza header, quindi la protezione è attiva. Resta l'unica fonte dei dati: il sito non copia né salva tariffe o disponibilità.

## Cosa verrà costruito

### 1. Accesso operatori (email e password)
- Pagina `/calendario/login`, non indicizzata. Nessuna registrazione libera: è il titolare a creare o invitare ogni operatore.
- Nuovo ruolo `partner`, distinto da `admin`. Un partner non vede leads, recensioni né l'area admin.
- Un operatore sospeso o revocato viene bloccato al momento della richiesta successiva, anche se ha ancora una sessione aperta.

### 2. Pannello del titolare (dentro /admin, sezione "Operatori")
- Anagrafica di ogni operatore: ragione sociale, referente, email, telefono facoltativo, note.
- Stato: abilitato, sospeso oppure revocato. La revoca annulla anche il link iCal.
- Ultimo accesso e uno storico essenziale degli accessi: data e ora, esito, tipo di accesso (dashboard o iCal). Nessun IP o browser; conservazione 12 mesi.
- Per ogni operatore: creare, rigenerare o revocare il link iCal.

### 3. Dashboard partner (sola lettura)
- Pagina `/calendario` con il calendario mensile:
  - aggiornamento ogni 15 secondi, sospeso quando la scheda non è in primo piano;
  - "oggi" calcolato sul fuso Europe/Rome e giorni passati oscurati;
  - notti con la partenza esclusa, mezze caselle per arrivo (dalle 15:00) e partenza (fino alle 10:00);
  - nessuna data dopo lastNight;
  - colori distinti per tariffa, blocco, opzione e prenotato.
- Riepilogo delle condizioni: pulizie finali, elettricità inclusa e biancheria inclusa.
- Tariffe visibili solo agli operatori abilitati e mai ai visitatori pubblici.

### 4. Export iCal per ogni operatore
- Un indirizzo personale per ogni operatore, del tipo `…/partner-ical?token=…`. Il token è lungo e casuale, salvato in forma cifrata, e si può revocare o rigenerare.
- Il calendario contiene solo indisponibilità anonime: un evento "Non disponibile" per ogni prenotazione, blocco o opzione. Nessun prezzo, nessun nome, nessuna nota.
- I dati vengono sempre letti in quel momento dal Centro operativo. Non c'è import da altri calendari, né sincronizzazione in entrambi i sensi, né copie delle tariffe.
- Ogni quanto il calendario viene riletto lo decide il sito dell'operatore, di solito tra 15 minuti e alcune ore. I 15 secondi non sono garantiti: va scritto chiaramente nella dashboard.


## Sicurezza e dati
- Le credenziali del Centro operativo (il token Bearer e X-VP-Pickup) restano solo tra i segreti del backend e non arrivano mai al browser.
- Una funzione del backend fa da filtro: accetta solo i campi previsti e scarta tutto il resto, così non passano mai dati personali del CRM.
- Breve memoria temporanea, circa 10 secondi, per non sovraccaricare il Centro operativo.
- Le regole di accesso ai dati attuali (leads, recensioni, admin) restano invariate.

## Configurazioni mancanti, da fornire
1. **Segreti:** il token Bearer e il valore X-VP-Pickup per il Centro operativo, da inserire nei Segreti del progetto.
2. **Conferme dal Centro operativo:**
   - che `bookings` contenga solo date;
   - che `cents` sia il prezzo per notte e in quale valuta;
   - se una "option" va mostrata come indisponibile anche nell'iCal.
3. **Primo account titolare:** confermare che è l'admin attuale a gestire gli operatori.
4. **Email di invito agli operatori:** per mandare inviti dal sito con un mittente @villapaolacaposuvero.it serve verificare il dominio per l'invio email. In alternativa il titolare può condividere manualmente una password temporanea.
5. **Testi legali:** aggiungere all'informativa privacy il trattamento dei dati degli operatori (accessi e log).

## Fuori da questo lavoro
- Nessuna pubblicazione.
- Nessun operatore reale creato o abilitato.
- Nessuna modifica ai dati del Centro operativo.
- Nessun nuovo progetto.

## Note tecniche
- **Tabelle:**
  - `partner_operators`: dati aziendali, stato, user_id e ultimo accesso;
  - `partner_access_log`: storico degli accessi;
  - `partner_feed_tokens`: hash del token iCal e data di revoca.
  - Le regole di accesso permettono la lettura e la scrittura solo all'admin. Il partner legge solo la propria riga.
- **Ruoli:** `partner` si aggiunge ai ruoli esistenti con una modifica al database.
- **Funzioni del backend:**
  - `partner-calendar`, per la dashboard: controlla l'accesso, il ruolo partner e lo stato abilitato;
  - `partner-ical`, a cui si accede con il token;
- **Calcolo del calendario:** una sola funzione condivisa per le notti con partenza esclusa e per le mezze giornate, con test per arrivo, partenza, "oggi" sul fuso di Roma e lastNight.
- Le pagine `/calendario` sono escluse dalla sitemap e marcate come non indicizzabili.

## Fuori ambito
- Widget, prenotazione diretta, pagamenti, notifiche di prenotazione, import bidirezionale.
