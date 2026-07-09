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
  // 
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
      nome: "V.E. Orlando",
      indirizzo: "Via Lussemburgo 103, Palermo",
      aule: [
        {
          id: "aula-informatica",
          nome: "Aula Informatica",
          capienza: 120,
          note: "Dotata di pc e Monitor touch.",
          calendarId: "https://calendar.app.google/1BkvbHZMGzrgUYrz9"
        },
        {
          id: "aula-stem",
          nome: "Aula Stem 4.0",
          capienza: 20,
          note: "Tablet e Monitor Touch",
          calendarId: "https://calendar.app.google/qGGwsVdQ7eGJUuoAA"
        },
        {
          id: "aula-immersiva",
          nome: "Aula Immersiva",
          capienza: 18,
          note: "Lezioni immersive con Mozaik",
          calendarId: "https://calendar.app.google/sCMkNv6tRH5BCH8V6"
        }
        {
          id: "sci-art",
          nome: "Laboratorio Sci-Art",
          capienza: 40,
          note: "Laboratorio di Arte e Scienza",
          calendarId: "https://calendar.app.google/z9QUkir8fKmiPEcH6"
        }
        
      {
       id: "aula-magna",
       nome: "Auditorium",
       capienza: 120,
       note: "Dotata di proiettore e impianto audio.",
       calendarId: "https://calendar.app.google/SLJECDTkUoy9HskEA"
     },
      ]
    },
    {
      id: "plesso-fava",
      nome: "Plesso G. Fava",
      indirizzo: "Via Monte San Calogero 20, Palermo",
      aule: [
        {
          id: "aula-musica",
          nome: "Aula Musica",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/UxpUETZ6C4tav3tV6"
        },
        {
          id: "lab-scientifico",
          nome: "Laboratorio Scientifico",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/7VVeny7NwUxuSJs8A"
        },
        {
          id: "aula-multimediale",
          nome: "Aula Multimediale",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/vdpftGucQPZ7swE19"
        },
        {
          id: "aula-rob-1",
          nome: "Laboratorio Robotica 1",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/v2JjiqK2stagtd7S8"
        },
        {
          id: "aula-rob-2",
          nome: "Laboratorio Robotica 2",
          capienza: 30,
          note: "",
          calendarId: "https://calendar.app.google/qRqjUsfu4d6vnj24A"
        }
      ]
    }
    {
      id: "plesso-gandhi",
      nome: "Plesso M. Gandhi",
      indirizzo: "Via Sardegna 55, Palermo",
      aule: [
       
         {
          id: "aula-robotica",
          nome: "Aula Robotica",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/ZUXSbgdHTqbU2him8"
        },
        {
          id: "aula-multimediale",
          nome: "Aula Multimediale",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/izjSPmF43xycvUkL8"
        },
        {
          id: "carrello-sci-1",
          nome: "Carrello scientifico 1",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/mYw9BGdFNDoyV1jU8"
        },
        {
          id: "carrello-sci-2",
          nome: "Carrello scientifico 2",
          capienza: 30,
          note: "",
          calendarId: "https://calendar.app.google/GNGaZsKV56ruwmTp6"
        }
      ]
    }
    {
      id: "plesso-malaguzzi",
      nome: "Plesso L. Malaguzzi",
      indirizzo: "Via Monti Iblei 49/53, Palermo",
      aule: [
       
         {
          id: "aula-sensoriale",
          nome: "Aula Sensoriale",
          capienza: 25,
          note: "",
          calendarId: "https://calendar.app.google/tDUBoiNESpFzqquCA"
        }
     
      ]
    }
  ]
};
