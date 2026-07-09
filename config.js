/* ==========================================================================
   CONFIGURAZIONE — ICS Monti Iblei - V.E. Orlando
   ==========================================================================
   Questo è l'UNICO file che il personale della scuola deve modificare
   durante l'anno (es. cambio password a settembre, apertura/chiusura
   di un'aula, nuovo calendario).

   Non tocca la logica dell'app (app.js) né la grafica (style.css).

   ATTENZIONE ALLA SICUREZZA:
   Questa è un'app statica (senza server), quindi la password NON offre
   una vera protezione: chiunque sappia leggere il codice sorgente della
   pagina può risalire alla password con un attacco a dizionario sull'hash.
   Va vista come un filtro contro l'accesso casuale (studenti/esterni che
   trovano il link), non come una protezione da un utente malintenzionato
   e competente. Non inserire qui informazioni realmente riservate.
   ========================================================================== */

const APP_CONFIG = {

  // --------------------------------------------------------------------
  // PASSWORD D'ACCESSO (condivisa, da cambiare ogni anno)
  // --------------------------------------------------------------------
  // Non scrivere la password in chiaro: inserisci il suo hash SHA-256.
  // Per generarne uno nuovo apri "genera-hash.html" (incluso nel
  // repository), digita la nuova password, copia l'hash che compare
  // e incollalo qui sotto sostituendo il valore esistente.
  //
  // Hash corrente per la password di esempio "MontiIblei2025":
  passwordHash: "036e7ecfdf6a63b67d3bd7fd05f648ab16ca7c9e86c3888096adf02b4f0866c4",

  // --------------------------------------------------------------------
  // AMMINISTRATORE DIGITALE
  // --------------------------------------------------------------------
  // Email che verrà aggiunta automaticamente come invitato/gestore
  // quando qualcuno compila una richiesta di prenotazione: la richiesta
  // arriverà così sul suo Google Calendar per essere accettata o rifiutata.
  adminEmail: "amministratore.digitale@icsmontiiblei.edu.it",

  // Testo mostrato nel banner informativo sopra il modulo di richiesta.
  noticeText: "La prenotazione non è immediata: compilando il modulo si apre " +
    "una bozza di evento su Google Calendar da inviare all'amministratore " +
    "digitale, che dovrà accettarla per confermare l'aula.",

  // --------------------------------------------------------------------
  // PLESSI E AULE
  // --------------------------------------------------------------------
  // Ogni plesso ha un elenco di aule. Ogni aula, se ha un calendario
  // Google dedicato, mostra la disponibilità incorporata nella pagina.
  //
  // Come trovare "calendarId" di un'aula:
  // 1. Su Google Calendar, crea (o apri) il calendario dedicato all'aula.
  // 2. Impostazioni calendario → "Rendi disponibile pubblicamente" (se si
  //    vuole mostrare la disponibilità a tutti) oppure condividilo con
  //    chi userà l'app.
  // 3. In "Integra calendario" copia l'ID calendario (es.
  //    "xxxxxxxxxxxx@group.calendar.google.com" oppure, per il calendario
  //    principale dell'amministratore, la sua email).
  //
  // Se un'aula non ha ancora un calendario dedicato, lascia calendarId
  // vuoto (""): l'app userà comunque il calendario dell'amministratore
  // per l'invio della richiesta, semplicemente senza mostrare l'anteprima
  // di disponibilità incorporata.

  plessi: [
    {
      id: "sede-centrale",
      nome: "Sede Centrale — V.E. Orlando",
      indirizzo: "Via Esempio 1, Palermo",
      aule: [
        {
          id: "aula-magna",
          nome: "Aula Magna",
          capienza: 120,
          note: "Dotata di proiettore e impianto audio.",
          calendarId: ""
        },
        {
          id: "laboratorio-informatica",
          nome: "Laboratorio di Informatica",
          capienza: 26,
          note: "24 postazioni PC.",
          calendarId: ""
        },
        {
          id: "palestra",
          nome: "Palestra",
          capienza: 60,
          note: "",
          calendarId: ""
        }
      ]
    },
    {
      id: "plesso-monti-iblei",
      nome: "Plesso Monti Iblei",
      indirizzo: "Via Esempio 2, Palermo",
      aule: [
        {
          id: "aula-lim-1",
          nome: "Aula LIM 1",
          capienza: 25,
          note: "",
          calendarId: ""
        },
        {
          id: "biblioteca",
          nome: "Biblioteca",
          capienza: 30,
          note: "",
          calendarId: ""
        }
      ]
    }
  ]
};
