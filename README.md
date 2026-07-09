# Prenotazione Aule — ICS Monti Iblei - V.E. Orlando

Web app statica (HTML/CSS/JS puro, nessun server) per prenotare le aule
dell'istituto. Pensata per essere pubblicata gratuitamente con **GitHub
Pages**.

## Come funziona

1. **Accesso**: password unica d'istituto, uguale per tutti, verificata
   nel browser confrontando il suo hash SHA-256 (vedi sotto perché non è
   una password "in chiaro").
2. **Elenco plessi** → click → **elenco aule** del plesso → click →
   **scheda di prenotazione** dell'aula.
3. Nella scheda di prenotazione:
   - se l'aula ha un calendario Google collegato, viene mostrata
     l'anteprima incorporata con gli impegni già fissati;
   - un modulo permette di compilare data, orario, richiedente e motivo;
   - al click su **"Apri richiesta su Google Calendar"** si apre una
     nuova scheda del browser con una bozza di evento già compilata,
     con l'amministratore digitale come invitato. L'utente deve premere
     **"Salva"** su Google Calendar per inviare davvero la richiesta.
   - L'amministratore digitale riceve l'invito sul proprio calendario e
     lo accetta o rifiuta: la prenotazione **non è quindi automatica**,
     ma resta un passaggio umano di conferma. Questo evita il bisogno
     di un server/backend per scrivere davvero sul calendario.

## Struttura dei file

```
index.html         pagina dell'app (login, plessi, aule, prenotazione)
style.css           grafica
app.js               logica (login, navigazione, generazione link Google Calendar)
config.js            ⭐ UNICO file da modificare per la gestione ordinaria
genera-hash.html    strumento per generare l'hash della nuova password
README.md            questo file
```

## Pubblicazione su GitHub Pages

1. Crea un repository (es. `prenotazione-aule`) e carica tutti i file
   di questa cartella nella radice del repository.
2. Su GitHub vai in **Settings → Pages**.
3. In "Build and deployment" scegli **Deploy from a branch**, branch
   `main`, cartella `/ (root)`, poi salva.
4. Dopo qualche minuto l'app sarà raggiungibile all'indirizzo
   `https://<tuo-utente>.github.io/prenotazione-aule/`.
5. Condividi il link con il personale della scuola insieme alla
   password (la password va comunicata **fuori dall'app**, ad esempio
   con una circolare interna o via email/registro elettronico — mai
   scritta in una pagina pubblica).

Ogni volta che modifichi `config.js` e fai push su GitHub, la pagina si
aggiorna automaticamente in un paio di minuti.

## Gestione annuale (cambio password)

1. Apri `genera-hash.html` nel browser (anche solo facendo doppio clic
   sul file, oppure alla pagina pubblicata `.../genera-hash.html`).
2. Digita la nuova password: comparirà subito il suo hash.
3. Copia l'hash e incollalo in `config.js`, alla riga:
   ```js
   passwordHash: "incolla-qui-il-nuovo-hash",
   ```
4. Salva, fai commit e push su GitHub.
5. Comunica la nuova password (non l'hash) al personale tramite un
   canale esterno all'app.

La password d'esempio già presente in `config.js` è `MontiIblei2025`
— **cambiala prima di pubblicare l'app**.

## Aggiungere o modificare plessi/aule

Tutto avviene in `config.js`, nell'array `plessi`. Ogni plesso ha un
array `aule`; ogni aula può avere:

- `nome` (obbligatorio)
- `capienza` (numero, opzionale)
- `note` (testo libero, opzionale)
- `calendarId` (opzionale): l'ID del calendario Google Calendar
  dell'aula, per mostrare l'anteprima di disponibilità. Le istruzioni
  per trovarlo sono commentate direttamente dentro `config.js`.

Se un'aula non ha ancora un calendario dedicato, si può lasciare
`calendarId: ""`: la richiesta di prenotazione funzionerà comunque
(arriverà sul calendario dell'amministratore digitale), semplicemente
non si vedrà l'anteprima incorporata.

## Nota importante sulla sicurezza della password

Questa è un'app **statica**: non esiste un server che verifica la
password, tutto avviene nel browser di chi la usa. Questo significa
che:

- la password **non è visibile in chiaro** nel codice (è salvata come
  hash SHA-256, quindi leggendo il codice sorgente non si legge la
  password stessa);
- **ma** chiunque sappia leggere il codice sorgente della pagina può
  comunque, con un minimo di competenza tecnica, decidere di ignorare
  il controllo della password o provare a risalire alla password
  originale a partire dall'hash.

In pratica questo accesso funziona bene come **filtro contro l'uso
casuale** (evita che chiunque trovi il link e prenoti un'aula senza
sapere nulla della scuola), ma **non è una vera misura di sicurezza**
contro un utente esperto e motivato. Per una protezione più solida
servirebbe un vero sistema di autenticazione lato server (es. account
Google d'istituto con Google Apps Script, o un piccolo backend): è un
possibile sviluppo futuro, non necessario per l'uso quotidiano previsto
qui.

## Perché la prenotazione "apre" Google Calendar invece di prenotare da sola

Una pagina statica come questa non può scrivere direttamente sul
calendario di qualcun altro senza che quella persona (o un backend con
le sue credenziali) lo autorizzi. La soluzione adottata — costruire un
link di Google Calendar già compilato con data, orario, aula e
l'amministratore digitale come invitato — permette di richiedere una
prenotazione senza bisogno di alcun server, lasciando all'amministratore
l'ultima parola con un semplice "accetta" sull'invito ricevuto.
