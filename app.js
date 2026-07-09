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
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

  const hash = await sha256Hex(value);

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
