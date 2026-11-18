# Homepage Villa Paola: nuova gerarchia visiva

Obiettivo: far innamorare il visitatore partendo da esterni, giardino, mare e terrazza. Gli interni vanno in una sezione secondaria, da consultare con calma. Cambia solo l'aspetto: modulo, contatti, WhatsApp, recensioni, SEO, area tour operator e pagina /calendario restano come sono. Niente pubblicazione.

## Nuovo ordine della homepage

1. **Hero**: foto giardino e mare a tutto schermo, titolo breve e pulsante per le date.
2. **Introduzione**: un testo breve su molto spazio bianco, con una sola foto verticale degli esterni. Niente card e niente icone.
3. **La proprietà e il giardino**: una foto panoramica a tutta larghezza (villa-esterno-panoramica), poi due foto in composizione asimmetrica (villa-esterno-giardino, giardino-mare-luce). I dati chiave (ospiti, camere, metri dal mare) stanno su una riga di solo testo.
4. **Il mare**: una grande immagine (vista mare o muretto bianco), il testo sull'accesso alla spiaggia e il video che parte solo se lo tocchi.
5. **Vivere Villa Paola**: la terrazza, con terrazza-pergolato-panoramica come foto principale e terrazza-pranzo-vista-mare e terrazza-divano-fronte-mare affiancate al testo. La chiude villa-facciata-sera o giardino-tramonto-mare, come passaggio verso la sera.
6. **Gli ambienti**: sezione secondaria con sfondo leggermente diverso e foto piccole (proporzione 4:3, circa un terzo della larghezza). Ha quattro parti apribili: Le camere, La zona giorno, La cucina, I bagni. Ognuna ha 1 o 2 foto, poche righe di testo e solo dati reali già presenti sul sito.
7. **Servizi e dotazioni**: un elenco tipografico su due colonne, senza card e con poche icone o nessuna.
8. **Galleria**: l'anteprima mostra prima esterni, terrazza e mare. Gli interni compaiono solo nella galleria completa.
9. **Calabria e posizione**: unisco la sezione Calabria e la mappa in un solo blocco.
10. **Recensioni**: le spostiamo qui, dopo la galleria. Oggi stanno subito sotto la hero.
11. **Disponibilità e contatti**: modulo, domande frequenti, contatti e richiamo finale, come oggi.

La sezione "Perché sceglierci" e quella delle esperienze ripetono concetti già presenti. Le unisco alle sezioni 2 e 5 per evitare doppioni. Il menu in alto segue il nuovo ordine, con poche voci: Villa, Mare, Terrazza, Ambienti, Galleria, Posizione, Contatti.

## Pulizia grafica
- Un solo colore di sfondo principale (bianco caldo). Il sabbia chiaro solo per "Gli ambienti" e per il modulo.
- Margini e spazi verticali uguali per tutte le sezioni. Titoli in Cormorant, testi brevi, una linea sottile solo dove serve.
- Niente ombre, bordi o card superflue. Le animazioni restano: una dissolvenza leggera e una sola volta.
- Ogni foto grande compare una sola volta in homepage. Le proporzioni sono fisse per evitare ritagli brutti, anche su mobile.

## Note tecniche
- Ricomporre `Index.tsx` e le sezioni Villa, Mare, Esperienze (diventa "Vivere Villa Paola"), Calabria e Posizione. Creare `AmbientiSection.tsx` con accordion shadcn e foto prese dalla gallery e dalla cartella restyle.
- Togliere `PerchéSection` dalla homepage senza cancellare il file. Riordinare l'array dell'anteprima in `GalleriaSection`.
- Nuovi testi IT/EN in `it.json` e `en.json`. Le ancore del menu vanno aggiornate, mantenendo quelle vecchie usate dai link esterni (#disponibilita, #contatti).
- Nessuna modifica a backend, `notify-lead`, tracciamento dei clic, route `/calendario` e area riservata.
- Verifica con Playwright su desktop e mobile: immagini caricate, nessuno sfondamento orizzontale, funzionamento dei pulsanti per le date.
