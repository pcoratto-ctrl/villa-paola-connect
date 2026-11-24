# Diagnosi pubblicazione dominio (sola lettura, nessuna modifica)

## Risultati verificati (24 nov 2026, 21:32 UTC)
- `villapaolacaposuvero.it`: connesso, primario, record A 185.158.133.1 corretto, DNS Aruba invariato.
- `https://villapaolacaposuvero.it/en/beachfront-villa-calabria` risponde HTTP 200 con header `x-deployment-id: ...53444219-510f-41e7-a682-25b0a0371900...`, cioè la deployment del commit 149f9f3.
- L'HTML grezzo contiene ora "Frequently asked questions" e "Check availability & request a quote".
- `villa-paola-connect.lovable.app` e `www` reindirizzano (301) al dominio primario: stesso hosting, stessa build, nessun artefatto separato.

## Conclusione
Il dominio non serve un hosting diverso. L'HTML vecchio visto prima era quasi certamente dovuto al tempo di propagazione della pubblicazione sul dominio personalizzato (di solito qualche minuto in più). Non lo posso provare a posteriori: ora è risolto.

## Rimedio
Nessun intervento necessario. Non serve cambiare DNS o ripubblicare. Se ricapita: attendere qualche minuto e ricontrollare l'header `x-deployment-id`; solo se resta vecchio, ripubblicare dalla finestra Pubblica.
