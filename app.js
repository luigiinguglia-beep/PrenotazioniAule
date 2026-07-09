/* ==========================================================================
   ICS Monti Iblei - V.E. Orlando — logica applicativa
   ========================================================================== */

const SESSION_KEY = "montiiblei_auth_ok";

const state = {
  plesso: null, // oggetto plesso selezionato
  aula: null    // oggetto aula selezionata
};

// ---------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------

async function sha256Hex(text) {
  return sha256(text);
}

// Implementazione SHA-256 in puro JavaScript (nessuna dipendenza da
// crypto.subtle), così funziona anche aprendo la pagina come file
// locale (file://), dove il browser disabilita la Web Crypto API.
function sha256(message) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = "length";
  var i, j;
  var result = "";

  var words = [];
  message = unescape(encodeURIComponent(message)); // stringa di byte UTF-8
  var asciiBitLength = message[lengthProperty] * 8;

  var hash = sha256.h = sha256.h || [];
  var k = sha256.k = sha256.k || [];
  var primeCounter = k[lengthProperty];

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  message += "\x80";
  while (message[lengthProperty] % 64 - 56) message += "\x00";
  for (i = 0; i < message[lengthProperty]; i++) {
    j = message.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

function el(id) {
  return document.getElementById(id);
}

function showView(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  el(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ---------------------------------------------------------------------
// Autenticazione
// ---------------------------------------------------------------------

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

async function handleLogin(e) {
  e.preventDefault();
  const input = el("login-password");
  const errorBox = el("login-error");
  const value = input.value.trim();

  if (!value) return;

  let hash;
  try {
    hash = await sha256Hex(value);
  } catch (err) {
    errorBox.textContent = "Errore imprevisto durante la verifica della password. Riprova o ricarica la pagina.";
    console.error(err);
    return;
  }

  if (hash === APP_CONFIG.passwordHash) {
    sessionStorage.setItem(SESSION_KEY, "1");
    errorBox.textContent = "";
    input.value = "";
    enterApp();
  } else {
    errorBox.textContent = "Password non corretta. Riprova.";
    input.value = "";
    input.focus();
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  state.plesso = null;
  state.aula = null;
  showView("view-login");
}

function enterApp() {
  el("app-header").classList.remove("hidden");
  renderPlessi();
  showView("view-plessi");
}

// ---------------------------------------------------------------------
// Vista: elenco plessi
// ---------------------------------------------------------------------

function renderPlessi() {
  const grid = el("plessi-grid");
  grid.innerHTML = "";

  if (!APP_CONFIG.plessi || APP_CONFIG.plessi.length === 0) {
    grid.innerHTML = `<div class="empty-state">Nessun plesso configurato. Aggiungilo in config.js.</div>`;
    return;
  }

  APP_CONFIG.plessi.forEach((plesso) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.innerHTML = `
      <h3>${escapeHtml(plesso.nome)}</h3>
      <p>${escapeHtml(plesso.indirizzo || "")}</p>
      <div class="meta">
        <span class="badge">${plesso.aule.length} aul${plesso.aule.length === 1 ? "a" : "e"}</span>
      </div>
      <div class="go">Vedi le aule &rarr;</div>
    `;
    card.addEventListener("click", () => openPlesso(plesso));
    grid.appendChild(card);
  });
}

function openPlesso(plesso) {
  state.plesso = plesso;
  state.aula = null;
  renderAule();
  showView("view-aule");
}

// ---------------------------------------------------------------------
// Vista: elenco aule di un plesso
// ---------------------------------------------------------------------

function renderAule() {
  el("aule-plesso-nome").textContent = state.plesso.nome;
  el("aule-plesso-crumb").textContent = state.plesso.nome;

  const grid = el("aule-grid");
  grid.innerHTML = "";

  if (!state.plesso.aule || state.plesso.aule.length === 0) {
    grid.innerHTML = `<div class="empty-state">Nessuna aula configurata per questo plesso.</div>`;
    return;
  }

  state.plesso.aule.forEach((aula) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.innerHTML = `
      <h3>${escapeHtml(aula.nome)}</h3>
      <p>${escapeHtml(aula.note || "")}</p>
      <div class="meta">
        ${aula.capienza ? `<span class="badge">${aula.capienza} posti</span>` : ""}
        ${aula.calendarId ? `<span class="badge">Calendario disponibile</span>` : `<span class="badge">Senza anteprima</span>`}
      </div>
      <div class="go">Prenota &rarr;</div>
    `;
    card.addEventListener("click", () => openAula(aula));
    grid.appendChild(card);
  });
}

// ---------------------------------------------------------------------
// Vista: prenotazione aula
// ---------------------------------------------------------------------

function openAula(aula) {
  state.aula = aula;

  el("prenota-aula-nome").textContent = aula.nome;
  el("prenota-aula-crumb").textContent = aula.nome;
  el("prenota-plesso-crumb").textContent = state.plesso.nome;
  el("prenota-notice-text").textContent = APP_CONFIG.noticeText;

  const capBadge = el("prenota-capienza-badge");
  if (aula.capienza) {
    capBadge.textContent = `${aula.capienza} posti`;
    capBadge.classList.remove("hidden");
  } else {
    capBadge.classList.add("hidden");
  }

  // Anteprima calendario incorporato
  const wrap = el("calendar-frame-wrap");
  const empty = el("calendar-empty");
  wrap.innerHTML = "";

  if (aula.calendarId) {
    wrap.classList.remove("hidden");
    empty.classList.add("hidden");
    const src = "https://calendar.google.com/calendar/embed?src=" +
      encodeURIComponent(aula.calendarId) +
      "&ctz=Europe%2FRome&mode=WEEK&showTitle=0&showPrint=0&showTabs=0&showCalendars=0";
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Disponibilità " + aula.nome;
    iframe.loading = "lazy";
    wrap.appendChild(iframe);
  } else {
    wrap.classList.add("hidden");
    empty.classList.remove("hidden");
  }

  // reset del modulo
  el("booking-form").reset();
  setDefaultDate();

  showView("view-prenota");
}

function setDefaultDate() {
  const dateInput = el("bk-data");
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  dateInput.min = iso;
  if (!dateInput.value) dateInput.value = iso;
}

function buildGoogleCalendarUrl() {
  const nome = el("bk-nome").value.trim();
  const classe = el("bk-classe").value.trim();
  const motivo = el("bk-motivo").value.trim();
  const data = el("bk-data").value;
  const oraInizio = el("bk-ora-inizio").value;
  const oraFine = el("bk-ora-fine").value;

  const aulaNome = state.aula.nome;
  const plessoNome = state.plesso.nome;

  const titolo = `Prenotazione ${aulaNome} — ${classe || nome}`;

  const dettagli = [
    `Richiedente: ${nome}`,
    classe ? `Classe/sezione: ${classe}` : null,
    `Plesso: ${plessoNome}`,
    `Aula: ${aulaNome}`,
    motivo ? `Motivo: ${motivo}` : null,
    "",
    "Richiesta inviata tramite l'app di prenotazione aule dell'istituto."
  ].filter(Boolean).join("\n");

  const luogo = `${aulaNome}, ${plessoNome}`;

  // Formato date richiesto da Google Calendar: YYYYMMDDTHHmmSS (ora locale, senza Z)
  const startStr = data.replace(/-/g, "") + "T" + oraInizio.replace(":", "") + "00";
  const endStr = data.replace(/-/g, "") + "T" + oraFine.replace(":", "") + "00";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: titolo,
    dates: `${startStr}/${endStr}`,
    details: dettagli,
    location: luogo,
    add: APP_CONFIG.adminEmail
  });

  return "https://calendar.google.com/calendar/render?" + params.toString();
}

function validateBookingForm() {
  const nome = el("bk-nome").value.trim();
  const data = el("bk-data").value;
  const oraInizio = el("bk-ora-inizio").value;
  const oraFine = el("bk-ora-fine").value;
  const errorBox = el("booking-error");

  if (!nome || !data || !oraInizio || !oraFine) {
    errorBox.textContent = "Compila tutti i campi obbligatori.";
    return false;
  }
  if (oraFine <= oraInizio) {
    errorBox.textContent = "L'orario di fine deve essere successivo a quello di inizio.";
    return false;
  }
  errorBox.textContent = "";
  return true;
}

function handleBookingSubmit(e) {
  e.preventDefault();
  if (!validateBookingForm()) return;
  const url = buildGoogleCalendarUrl();
  window.open(url, "_blank", "noopener");
}

// ---------------------------------------------------------------------
// Navigazione (breadcrumb)
// ---------------------------------------------------------------------

function goToPlessi() {
  state.plesso = null;
  state.aula = null;
  renderPlessi();
  showView("view-plessi");
}

function goToAule() {
  state.aula = null;
  renderAule();
  showView("view-aule");
}

// ---------------------------------------------------------------------
// Inizializzazione
// ---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  el("login-form").addEventListener("submit", handleLogin);
  el("booking-form").addEventListener("submit", handleBookingSubmit);

  document.querySelectorAll("[data-nav='plessi']").forEach((b) => b.addEventListener("click", goToPlessi));
  document.querySelectorAll("[data-nav='aule']").forEach((b) => b.addEventListener("click", goToAule));
  el("btn-logout").addEventListener("click", logout);

  if (isLoggedIn()) {
    enterApp();
  } else {
    showView("view-login");
  }
});
