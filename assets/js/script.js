/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Cerca su MDN solo i concetti dichiarati come "cerca tu":
  localStorage, Blob/URL.createObjectURL, FileReader.
  Tutto il resto e' stato visto in settimana.
- Niente AI per generare codice. Niente template scaricati.
*/


/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/

/* SCRIVI QUI LA TUA RISPOSTA */
let vinili = [];
let filtroStato = "all";
let ordinamento = "anno-crescente";
let ricerca = "";

const viniliDefault = [
  {
    id: 1,
    titolo: "The Dark Side of the Moon",
    autore: "Pink Floyd",
    anno: 1973,
    status: "taken",
  },
  {
    id: 2,
    titolo: "Abraxas",
    autore: "Santana",
    anno: 1970,
    status: "taken",
  },
  {
    id: 3,
    titolo: "Californication",
    autore: "Red Hot Chili Peppers",
    anno: 1999,
    status: "to-buy",
  },
  {
    id: 4,
    titolo: "Thriller",
    autore: "Michael Jackson",
    anno: 1991,
    status: "to-buy",
  },
  {
    id: 5,
    titolo: "Communiqué",
    autore: "Dire Straits",
    anno: 1979,
    status: "taken",
  },
];

vinili = [...viniliDefault];

/* funzione notifica */

function notifica(msg) {
  const notify = document.getElementById("notifica");
  notify.textContent = msg;
  notify.style.display = "block";
  setTimeout(() => {
    notify.style.display = "none";
  }, 3000);
}

/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function render() {
  let filtrati = [...vinili];
  if (filtroStato === "to-buy") {
    filtrati = filtrati.filter((v) => v.status === "to-buy");
  } else if (filtroStato === "taken") {
    filtrati = filtrati.filter((v) => v.status === "taken");
  }
  if (ricerca.trim() !== "") {
    const ricercato = ricerca.toLowerCase().trim();
    filtrati = filtrati.filter(
      (v) =>
        v.titolo.toLowerCase().includes(ricercato) ||
        v.autore.toLowerCase().includes(ricercato),
    );
  }
  if (ordinamento === "anno-crescente") {
    filtrati.sort((a, b) => a.anno - b.anno);
  } else if (ordinamento === "anno-decrescente") {
    filtrati.sort((a, b) => b.anno - a.anno);
  } else if (ordinamento === "titolo-AZ") {
    filtrati.sort((a, b) => a.titolo.localeCompare(b.titolo));
  } else if (ordinamento === "titolo-ZA") {
    filtrati.sort((a, b) => b.titolo.localeCompare(a.titolo));
  }

  const containerLista = document.querySelector(".lista");
  containerLista.innerHTML = "";

  filtrati.forEach((v) => {
    const card = document.createElement("div");
    card.classList.add("vinyl-card");
    card.classList.add(v.status === "taken" ? "vinyl-taken" : "vinyl-to-buy");
    const titoloSpan = document.createElement("span");
    titoloSpan.classList.add("vinyl-title");
    titoloSpan.textContent = v.titolo;
    const autoreSpan = document.createElement("span");
    autoreSpan.classList.add("vinyl-autore");
    autoreSpan.textContent = v.autore;
    const annoSpan = document.createElement("span");
    annoSpan.classList.add("vinyl-anno");
    annoSpan.textContent = `(${v.anno})`;
    const badge = document.createElement("span");
    badge.className = v.status === "taken" ? "badge badge-taken" : "badge badge-to-buy";
    badge.textContent = v.status === "taken" ? "Posseduto" : "Da acquistare";
    const btnModifica = document.createElement("button");
    btnModifica.classList.add("btn-modifica");
    btnModifica.textContent = "✏️ Modifica";
    btnModifica.dataset.id = v.id;
    const btnElimina = document.createElement("button");
    btnElimina.classList.add("btn-elimina");
    btnElimina.textContent = "🗑️ Elimina";
    btnElimina.dataset.id = v.id;
    const btpUp = document.createElement("button");
    btpUp.classList.add("btn-up");
    btpUp.textContent = "⬆️";
    btpUp.dataset.id = v.id;
    const btpDown = document.createElement("button");
    btpDown.classList.add("btn-down");
    btpDown.textContent = "⬇️";
    btpDown.dataset.id = v.id;

    card.appendChild(titoloSpan);
    card.appendChild(autoreSpan);
    card.appendChild(annoSpan);
    card.appendChild(badge);
    card.appendChild(btnModifica);
    card.appendChild(btnElimina);
    card.appendChild(btpUp);
    card.appendChild(btpDown);

    containerLista.appendChild(card);
  });

  if (filtrati.length === 0) {
    const vuoto = document.createElement("p");
    vuoto.classList.add("lista-vuota");
    vuoto.textContent = "Nessun vinile trovato.";
    containerLista.appendChild(vuoto);
  }

  const totali = vinili.length;
  const taken = vinili.filter((v) => v.status === "taken").length;
  const daAcquistare = vinili.filter((v) => v.status === "to-buy").length;
  const percentuale = totali > 0 ? Math.round((taken / totali) * 100) : 0;

  document.getElementById("totali-count").textContent = totali;
  document.getElementById("posseduti-count").textContent = taken;
  document.getElementById("to-buy-count").textContent = daAcquistare;
  document.getElementById("progress-fill").style.width = percentuale + "%";
  document.getElementById("progress-percent").textContent =
    percentuale + "% posseduti";

  localStorage.setItem("vinili", JSON.stringify(vinili));
}
/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function aggiungiVinile() {
  const titolo = document.getElementById("campoAddTitle").value.trim();
  const autore = document.getElementById("campoAddAuthor").value.trim();
  const annoRaw = document.getElementById("campoAddYear").value.trim();
  const status = document.getElementById("status").value;

  if (!titolo || !autore || !annoRaw) {
    notifica("Compila tutti i campi obbligatori!");
    return;
  }

  const anno = Number(annoRaw);
  if (isNaN(anno) || anno < 1800 || anno > 2026) {
    notifica("Inserisci un anno valido (1800-2026)");
    return;
  }

  vinili.push({
    id: Date.now(),
    titolo: titolo,
    autore: autore,
    anno: anno,
    status: status,
  });

  document.getElementById("campoAddTitle").value = "";
  document.getElementById("campoAddAuthor").value = "";
  document.getElementById("campoAddYear").value = "";
  document.getElementById("status").value = "to-buy";
  render();
  notifica("Vinile aggiunto con successo!");
}

document.querySelector(".form button[type='submit']").addEventListener("click", function (e) {
  e.preventDefault();
  aggiungiVinile();
});
/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.querySelector(".lista").addEventListener("click", function (e) {
  const target = e.target;
  const id = Number(target.dataset.id);

  if (target.classList.contains("btn-elimina")) {
    if (confirm("Eliminare questo vinile?")) {
      vinili = vinili.filter((v) => v.id !== id);
      render();
      notifica("Vinile eliminato!");
    }
    return;
  }
  if (target.classList.contains("btn-modifica")) {
    const card = target.closest(".vinyl-card");
    const titoloSpan = card.querySelector(".vinyl-title");
    const vecchioTitolo = titoloSpan.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = vecchioTitolo;
    input.className = "input-modifica-titolo";
    titoloSpan.replaceWith(input);
    input.focus();

    function confermaModifica() {
      const nuovoValore = input.value.trim();
      if (nuovoValore && nuovoValore !== vecchioTitolo) {
        const vinile = vinili.find((v) => v.id === id);
        if (vinile) {
          vinile.titolo = nuovoValore;
          render();
          notifica("Titolo modificato!");
        }
      } else {
        render();
      }
    }
    input.addEventListener("blur", confermaModifica);
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        confermaModifica();
      } else if (ev.key === "Escape") {
        input.value = vecchioTitolo;
        confermaModifica();
      }
    });
    return;
  }
  if (target.classList.contains("btn-up")) {
    const indice = vinili.findIndex((v) => v.id === id);
    if (idx > 0) {
      [vinili[indice - 1], vinili[indice]] = [vinili[indice], vinili[indice - 1]];
      render();
    }
    return;
  }
  if (target.classList.contains("btn-down")) {
    const altroIndice = vinili.findIndex((v) => v.id === id);
    if (idx < vinili.length - 1) {
      [vinili[altroIndice + 1], vinili[altroIndice]] = [vinili[altroIndice], vinili[altroIndice + 1]];
      render();
    }
    return;
  }
});
/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("searchFilter").addEventListener("input", function (e) {
  ricerca = e.target.value;
  render();
});

document
  .getElementById("filterStatus")
  .addEventListener("change", function (e) {
    filtroStato = e.target.value;
    render();
  });

document
  .getElementById("sortFilter")
  .addEventListener("change", function (e) {
    ordinamento = e.target.value;
    render();
  });

/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.querySelector(".theme-btn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const btn = document.querySelector(".theme-btn");
  btn.textContent = document.body.classList.contains("dark")
    ? "☀️ Tema chiaro"
    : "🌙 Tema scuro";
});

render();
/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* ESPORTAZIONE / IMPORTAZIONE JSON (cerca tu su MDN)
   - Esporta: crea un Blob con JSON.stringify(stato), genera un URL con
     URL.createObjectURL e simula il click su un <a download>.
   - Importa: <input type="file"> + FileReader per leggere il contenuto come
     testo, JSON.parse, sostituisci lo stato, render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/

/* SCRIVI QUI LA TUA RISPOSTA */