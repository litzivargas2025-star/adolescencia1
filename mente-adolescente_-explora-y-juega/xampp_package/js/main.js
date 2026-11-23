// Menú móvil (#button-open-close-menu + .menu-mobile-items.menu-mobile-close)
const menuBtn = document.getElementById("button-open-close-menu");
const mobileItems = document.querySelector(".menu-mobile-items");
if (menuBtn && mobileItems) {
  menuBtn.addEventListener("click", () => {
    mobileItems.classList.toggle("menu-mobile-close");
  });
  mobileItems.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileItems.classList.add("menu-mobile-close");
      triggerScreenTransition();
    });
  });
}

// Cortinilla de transición #screen (0vh -> 150vh -> 0vh)
function triggerScreenTransition() {
  const scr = document.getElementById("screen");
  if (!scr) return;
  scr.classList.remove("screen-active");
  void scr.offsetWidth;
  scr.classList.add("screen-active");
  setTimeout(() => scr.classList.remove("screen-active"), 740);
}

// Control centralizado de scroll de body cuando algún modal está abierto
function syncBodyOverflow() {
  const anyOpen =
    document.querySelector(".fila-modal-overlay.open") ||
    document.querySelector(".details-container.open") ||
    document.querySelector(".inspection-backdrop.open") ||
    document.querySelector(".blur-active-backdrop.open");
  document.body.style.overflow = anyOpen ? "hidden" : "auto";
}

// Ventana externa amplia (.details-container) con anterior/siguiente/cerrar para los 9 cuadros
const detailsContainer = document.querySelector(".details-container");
const detailsSlides = Array.from(document.querySelectorAll(".details-slide"));
const detailsCounter = document.getElementById("details-counter");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const closeButton = document.getElementById("close-button");
let currentDetailsIndex = 0;

function showDetailsSlide(idx) {
  if (!detailsSlides.length) return;
  if (idx < 0 || idx >= detailsSlides.length) return;
  currentDetailsIndex = idx;
  detailsSlides.forEach((s, i) => {
    if (i === currentDetailsIndex) s.classList.remove("item-hide");
    else s.classList.add("item-hide");
  });
  if (detailsCounter) {
    detailsCounter.textContent =
      String(currentDetailsIndex + 1).padStart(2, "0") +
      " / " +
      String(detailsSlides.length).padStart(2, "0");
  }
}

document.querySelectorAll("[data-open-details]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const idx = parseInt(btn.getAttribute("data-open-details") || "0", 10);
    if (!detailsContainer) return;
    triggerScreenTransition();
    setTimeout(() => {
      showDetailsSlide(idx);
      detailsContainer.classList.add("open");
      syncBodyOverflow();
    }, 300);
  });
});

if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (currentDetailsIndex > 0) showDetailsSlide(currentDetailsIndex - 1);
  });
}
if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (currentDetailsIndex < detailsSlides.length - 1) showDetailsSlide(currentDetailsIndex + 1);
  });
}
const closeButtonBottom = document.getElementById("close-button-bottom");
function closeDetailsWindow() {
  triggerScreenTransition();
  setTimeout(() => {
    if (detailsContainer) detailsContainer.classList.remove("open");
    syncBodyOverflow();
  }, 300);
}
if (closeButton) closeButton.addEventListener("click", closeDetailsWindow);
if (closeButtonBottom) closeButtonBottom.addEventListener("click", closeDetailsWindow);

// Apertura y cierre de ventanas lanzadas desde la última fila (Registro/Acceso, Explora el Tema, 5 Juegos)
document.querySelectorAll("[data-open-fila]").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const targetId = "modal-" + trigger.getAttribute("data-open-fila");
    const modalEl = document.getElementById(targetId);
    if (!modalEl) return;
    triggerScreenTransition();
    setTimeout(() => {
      if (detailsContainer) detailsContainer.classList.remove("open");
      modalEl.classList.add("open");
      syncBodyOverflow();
    }, 300);
  });
});

document.querySelectorAll("[data-close-fila]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-close-fila");
    const modalEl = document.getElementById(targetId);
    triggerScreenTransition();
    setTimeout(() => {
      if (modalEl) modalEl.classList.remove("open");
      syncBodyOverflow();
    }, 300);
  });
});

const closePerfilBtn = document.getElementById("close-perfil-modal");
if (closePerfilBtn) {
  closePerfilBtn.addEventListener("click", () => {
    const m = document.getElementById("perfil-desbloqueado-modal");
    if (m) m.classList.remove("open");
    syncBodyOverflow();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (detailsContainer && detailsContainer.classList.contains("open")) {
    detailsContainer.classList.remove("open");
    syncBodyOverflow();
    return;
  }
  const insp = document.getElementById("toolkit-inspection-modal");
  if (insp && insp.classList.contains("open")) {
    insp.classList.remove("open");
    syncBodyOverflow();
    return;
  }
  const openFila = document.querySelector(".fila-modal-overlay.open");
  if (openFila) {
    openFila.classList.remove("open");
    syncBodyOverflow();
    return;
  }
  const perfil = document.getElementById("perfil-desbloqueado-modal");
  if (perfil && perfil.classList.contains("open")) {
    perfil.classList.remove("open");
    syncBodyOverflow();
  }
});

// Progreso y Puntos de Empatía / Sabiduría
const completedSet = new Set();
let empathyPoints = 0;

function registrarActividad(nombre, puntos, emocion, detalle) {
  if (!completedSet.has(nombre)) {
    completedSet.add(nombre);
    empathyPoints += puntos;
    actualizarBarraProgreso();
    fetch("guardar_progreso.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actividad: nombre, puntos, emocion, detalle })
    }).catch(() => {});
  }
  if (completedSet.size >= 5) {
    const modal = document.getElementById("perfil-desbloqueado-modal");
    if (modal) {
      modal.classList.add("open");
      syncBodyOverflow();
    }
  }
}

function actualizarBarraProgreso() {
  const ptsEl = document.getElementById("empathy-points");
  const pctEl = document.getElementById("progress-pct");
  const fillEl = document.getElementById("progress-fill");
  const pct = Math.min(100, Math.round((completedSet.size / 5) * 100));
  if (ptsEl) ptsEl.textContent = empathyPoints + " pts";
  if (pctEl) pctEl.textContent = pct + "%";
  if (fillEl) fillEl.style.width = pct + "%";
}

// Frase motivacional aleatoria
const frasesMot = [
  "Sé tú, sin pedir permiso. Tu autenticidad vale muchísimo.",
  "Tu valor no es un número: ni una calificación ni los likes te definen.",
  "Eres suficiente tal como eres, incluso en los días en que dudas de ti.",
  "Habla bonito de ti: aprende a ser tu mejor aliado interior.",
  "No encajes, destaca. Tus emociones son brújulas, no defectos."
];
const btnOtraFrase = document.getElementById("btn-otra-frase");
const fraseGrande = document.getElementById("frase-grande-texto");
if (btnOtraFrase && fraseGrande) {
  btnOtraFrase.addEventListener("click", () => {
    const nueva = frasesMot[Math.floor(Math.random() * frasesMot.length)];
    fraseGrande.textContent = "“" + nueva + "”";
  });
}

// 1. CARDS INTERACTIVAS (Mazo izquierda + Inspección Modal + Contenedor derecho + Revelación + Reinicio)
const toolkitCardsData = [
  {
    id: "tool-1",
    titulo: "Respiración 4-7-8",
    categoria: "Regulación Emocional",
    resumen: "Calma el sistema nervioso antes de exámenes o exposiciones.",
    explicacion: "Inhala 4 segundos, sostén 7 segundos y exhala suavemente en 8 segundos para frenar la alarma física.",
    tip: "Exhalar más largo activa el nervio vago y devuelve calma al cerebro adolescente.",
    imagen: "img/miedo.png"
  },
  {
    id: "tool-2",
    titulo: "Reencuadre de Pensamientos",
    categoria: "Autoconocimiento",
    resumen: "Transforma la autocrítica severa en diálogo realista y amable.",
    explicacion: "Cuestiona frases absolutas como 'todo me sale mal' y háblate con el respeto que darías a tu mejor amistad.",
    tip: "Separar un error puntual de tu valor personal fortalece tu autoestima.",
    imagen: "img/img1.svg"
  },
  {
    id: "tool-3",
    titulo: "Pausa Asertiva (90 s)",
    categoria: "Comunicación Asertiva",
    resumen: "Defiende tus límites sin explotar ni quedarte en silencio.",
    explicacion: "Toma 90 segundos antes de contestar y responde usando mensajes con 'yo siento' y límites claros.",
    tip: "Decir 'no' con calma ante presiones protege tu paz y relaciones.",
    imagen: "img/img3.svg"
  },
  {
    id: "tool-4",
    titulo: "Anclaje 5-4-3-2-1",
    categoria: "Manejo del Estrés",
    resumen: "Detiene pensamientos anticipatorios volviendo al presente.",
    explicacion: "Identifica 5 cosas que ves, 4 que tocas, 3 que oyes, 2 aromas y 1 sensación agradable.",
    tip: "Puedes practicarlo discretamente en clase o antes de dormir.",
    imagen: "img/3.png"
  },
  {
    id: "tool-5",
    titulo: "Diario de Validación",
    categoria: "Autocuidado y Tristeza",
    resumen: "Descarga el peso de la tristeza con escritura expresiva.",
    explicacion: "Escribe 10 a 15 minutos lo que sientes sin censura ni preocupación por ortografía.",
    tip: "Poner palabras a la tristeza ordena la mente y facilita pedir ayuda.",
    imagen: "img/tristeza.png"
  },
  {
    id: "tool-6",
    titulo: "Red de Apoyo Confiable",
    categoria: "Vínculos Saludables",
    resumen: "Conecta con adultos y amistades seguras cuando el peso crece.",
    explicacion: "Ten a la mano 3 contactos seguros: una amistad leal, familiar y tu orientador escolar.",
    tip: "Pedir ayuda a tiempo es valentía y autocuidado real.",
    imagen: "img/8.svg"
  }
];

let placedToolkitIds = [];
const deckArea = document.getElementById("toolkit-deck-area");
const placedListEl = document.getElementById("toolkit-placed-list");
const dropPanelEl = document.getElementById("toolkit-drop-panel");
const toolkitStatusEl = document.getElementById("toolkit-status");
const toolkitBannerEl = document.getElementById("toolkit-complete-banner");
const toolkitResetBtn = document.getElementById("toolkit-reset-btn");
const inspModal = document.getElementById("toolkit-inspection-modal");
const inspCardEl = document.getElementById("toolkit-inspection-card");

function openCardInspection(card) {
  if (!inspModal || !inspCardEl) return;
  const alreadyPlaced = placedToolkitIds.includes(card.id);
  inspCardEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <span style="background:var(--pastel-lemon);border:2px solid #3A265E;border-radius:10px;padding:4px 10px;font-weight:800;font-size:0.8rem;">${card.categoria}</span>
      <button type="button" id="close-insp-btn" class="btn-pastel btn-pink" style="padding:5px 12px;font-size:0.8rem;">× Cerrar [X]</button>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;">
      <img src="${card.imagen}" alt="${card.titulo}" style="width:160px;height:150px;object-fit:cover;border-radius:14px;border:2px solid #3A265E;">
      <div style="flex:1;min-width:220px;">
        <h4 style="font-size:1.8rem;">${card.titulo}</h4>
        <p style="margin-top:6px;">${card.explicacion}</p>
      </div>
    </div>
    <div style="margin-top:14px;background:var(--pastel-lemon);border:2px solid #3A265E;border-radius:12px;padding:12px;">
      <strong>Tip Clave:</strong> ${card.tip}
    </div>
    <div style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
      ${alreadyPlaced ? `<span style="font-weight:800;color:#3A265E;">✓ Ya integrada a tu plan</span>` : `<button type="button" id="integrate-insp-btn" class="btn-pastel btn-mint">Integrar a mi Caja de Herramientas →</button>`}
    </div>
  `;
  inspModal.classList.add("open");
  syncBodyOverflow();
  document.getElementById("close-insp-btn").addEventListener("click", () => {
    inspModal.classList.remove("open");
    syncBodyOverflow();
  });
  const intBtn = document.getElementById("integrate-insp-btn");
  if (intBtn) {
    intBtn.addEventListener("click", () => {
      integrateToolkitCard(card.id);
      inspModal.classList.remove("open");
      syncBodyOverflow();
    });
  }
}

function integrateToolkitCard(cardId) {
  if (placedToolkitIds.includes(cardId)) return;
  placedToolkitIds.push(cardId);
  const card = toolkitCardsData.find((c) => c.id === cardId);
  if (toolkitStatusEl && card) {
    toolkitStatusEl.textContent = 'Elemento integrado a tu plan: "' + card.titulo + '".';
  }
  renderToolkitBoard();
  if (placedToolkitIds.length === toolkitCardsData.length) {
    registrarActividad("Cards Drag & Drop", 25, "Regulación Emocional", "Integró las 6 herramientas emocionales.");
  }
}

function renderToolkitBoard() {
  if (!deckArea || !placedListEl) return;
  const remaining = toolkitCardsData.filter((c) => !placedToolkitIds.includes(c.id));
  if (remaining.length > 0) {
    const top = remaining[0];
    deckArea.innerHTML = `
      <div class="toolkit-top-card" draggable="true" id="active-top-card">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;">${top.categoria}</span>
        <div style="display:flex;gap:12px;align-items:center;margin-top:8px;">
          <img src="${top.imagen}" alt="${top.titulo}" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:2px solid #3A265E;">
          <div>
            <h4 style="font-size:1.5rem;">${top.titulo}</h4>
            <p style="font-size:0.85rem;">${top.resumen}</p>
          </div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;">
          <small style="font-weight:700;">Arrastra o selecciona (${remaining.length} restantes)</small>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn-pastel btn-cyan" id="btn-inspect-top" style="padding:4px 10px;font-size:0.8rem;">Inspeccionar</button>
            <button type="button" class="btn-pastel btn-mint" id="btn-add-top" style="padding:4px 10px;font-size:0.8rem;">Integrar →</button>
          </div>
        </div>
      </div>
    `;
    const topEl = document.getElementById("active-top-card");
    topEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", top.id);
    });
    document.getElementById("btn-inspect-top").addEventListener("click", () => openCardInspection(top));
    document.getElementById("btn-add-top").addEventListener("click", () => integrateToolkitCard(top.id));
  } else {
    deckArea.innerHTML = `<div class="pastel-card" style="background:var(--pastel-mint);text-align:center;"><h4>¡Has integrado todas las herramientas en tu plan!</h4></div>`;
  }

  if (placedToolkitIds.length === 0) {
    placedListEl.innerHTML = `<p style="padding:18px;text-align:center;font-weight:600;">Tu Caja de Herramientas está vacía. Arrastra una ficha desde la izquierda o inspecciónala para agregarla.</p>`;
  } else {
    placedListEl.innerHTML = "";
    placedToolkitIds.forEach((id, idx) => {
      const item = toolkitCardsData.find((c) => c.id === id);
      if (!item) return;
      const div = document.createElement("div");
      div.className = "placed-tool-item";
      div.innerHTML = `<img src="${item.imagen}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;border:1px solid #3A265E;"><div><strong>${idx + 1}. ${item.titulo}</strong><div style="font-size:0.8rem;">${item.categoria}</div></div>`;
      div.addEventListener("click", () => openCardInspection(item));
      placedListEl.appendChild(div);
    });
  }

  if (toolkitBannerEl) {
    toolkitBannerEl.style.display = placedToolkitIds.length === toolkitCardsData.length ? "block" : "none";
  }
}

if (dropPanelEl) {
  dropPanelEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropPanelEl.classList.add("over");
  });
  dropPanelEl.addEventListener("dragleave", () => dropPanelEl.classList.remove("over"));
  dropPanelEl.addEventListener("drop", (e) => {
    e.preventDefault();
    dropPanelEl.classList.remove("over");
    const cid = e.dataTransfer.getData("text/plain");
    if (cid) integrateToolkitCard(cid);
  });
}

if (toolkitResetBtn) {
  toolkitResetBtn.addEventListener("click", () => {
    placedToolkitIds = [];
    if (toolkitStatusEl) toolkitStatusEl.textContent = "Panel reiniciado con éxito.";
    renderToolkitBoard();
  });
}
renderToolkitBoard();

// 2. SOPA DE LETRAS 12x12 (Horizontal, Vertical y Diagonal con arrastre y 2 clics)
const cleanRows = [
  "RESILIENCIAQ",
  "MAUTOESTIMAT",
  "ENMXPLKVJBNR",
  "MQZICALMAWFI",
  "PGHYETRUSALS",
  "ABVNCDQJKPQT",
  "TWSGLZOHMORE",
  "IPLIMITEXYNZ",
  "ADFCVBNUJOKA",
  "WVALENTIAGHM",
  "QZXCVBNMLKJH",
  "PLRESPIRARTS"
];
const palabrasReales = ["RESILIENCIA", "AUTOESTIMA", "EMPATIA", "TRISTEZA", "MIEDO", "CALMA", "LIMITE", "VALENTIA", "APOYO", "RESPIRAR"];
const wsContainer = document.getElementById("ws-grid");
const wsList = document.getElementById("ws-words");
const wsStatus = document.getElementById("ws-status");
let anchorCoord = null;
let dragStartCoord = null;
let isDraggingWs = false;
let dragMovedWs = false;
let previewCoords = [];
let foundWords = new Set();
const cellMap = {};

function straightLine(r1, c1, r2, c2, allowSnap) {
  const dr = r2 - r1;
  const dc = c2 - c1;
  if (dr === 0 && dc === 0) return [[r1, c1]];
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const sr = dr === 0 ? 0 : dr / Math.abs(dr);
    const sc = dc === 0 ? 0 : dc / Math.abs(dc);
    const out = [];
    for (let i = 0; i <= steps; i++) out.push([r1 + i * sr, c1 + i * sc]);
    return out;
  }
  if (!allowSnap) return [];
  const angle = Math.atan2(dr, dc);
  const sector = Math.round(angle / (Math.PI / 4));
  const sr = Math.round(Math.sin((sector * Math.PI) / 4));
  const sc = Math.round(Math.cos((sector * Math.PI) / 4));
  if (sr === 0 && sc === 0) return [[r1, c1]];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const rr = r1 + i * sr;
    const cc = c1 + i * sc;
    if (rr < 0 || rr >= 12 || cc < 0 || cc >= 12) break;
    out.push([rr, cc]);
  }
  return out;
}

function clearPreviewWs() {
  Object.values(cellMap).forEach((el) => el.classList.remove("selected"));
}

function paintPreviewWs(coords) {
  clearPreviewWs();
  coords.forEach(([rr, cc]) => {
    const el = cellMap[`${rr}-${cc}`];
    if (el) el.classList.add("selected");
  });
}

function resolveWsCellFromPoint(clientX, clientY) {
  const hit = document.elementFromPoint(clientX, clientY);
  const cellEl = hit && hit.closest ? hit.closest("[data-r]") : null;
  if (cellEl) {
    return [Number(cellEl.dataset.r), Number(cellEl.dataset.c)];
  }
  if (!wsContainer) return null;
  const rect = wsContainer.getBoundingClientRect();
  const pad = 12;
  const iw = rect.width - pad * 2;
  const ih = rect.height - pad * 2;
  if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom && iw > 0 && ih > 0) {
    const cc = Math.max(0, Math.min(11, Math.floor(((clientX - rect.left - pad) / iw) * 12)));
    const rr = Math.max(0, Math.min(11, Math.floor(((clientY - rect.top - pad) / ih) * 12)));
    return [rr, cc];
  }
  return null;
}

function validateLineWs(coords) {
  if (coords.length < 2) return false;
  const fw = coords.map(([r, c]) => cleanRows[r][c]).join("");
  const bw = fw.split("").reverse().join("");
  const match = palabrasReales.find((w) => (w === fw || w === bw) && !foundWords.has(w));
  if (!match) return false;
  foundWords.add(match);
  coords.forEach(([r, c]) => cellMap[`${r}-${c}`].classList.add("found"));
  const li = document.getElementById("ws-word-" + match);
  if (li) li.style.textDecoration = "line-through";
  if (wsStatus) wsStatus.textContent = '¡Encontraste "' + match + '"! (' + foundWords.size + "/10)";
  if (foundWords.size >= 5) {
    registrarActividad("Sopa de Letras", 25, "Vocabulario Emocional", "Encontró palabras clave en sopa 12x12.");
  }
  return true;
}

if (wsContainer && wsList) {
  palabrasReales.forEach((w) => {
    const li = document.createElement("li");
    li.id = "ws-word-" + w;
    li.textContent = w;
    wsList.appendChild(li);
  });

  wsContainer.addEventListener("dragstart", (e) => e.preventDefault());

  cleanRows.forEach((rowStr, rIdx) => {
    for (let cIdx = 0; cIdx < 12; cIdx++) {
      const cell = document.createElement("div");
      cell.setAttribute("role", "gridcell");
      cell.draggable = false;
      cell.className = "ws-cell";
      cell.textContent = rowStr[cIdx];
      cell.dataset.r = String(rIdx);
      cell.dataset.c = String(cIdx);
      cellMap[`${rIdx}-${cIdx}`] = cell;

      cell.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        try {
          if (cell.hasPointerCapture && cell.hasPointerCapture(e.pointerId)) {
            cell.releasePointerCapture(e.pointerId);
          }
        } catch {}
        dragStartCoord = [rIdx, cIdx];
        dragMovedWs = false;
        isDraggingWs = true;
        if (anchorCoord) {
          const tapLine = straightLine(anchorCoord[0], anchorCoord[1], rIdx, cIdx, false);
          if (tapLine.length > 1) {
            previewCoords = tapLine;
            paintPreviewWs(tapLine);
            return;
          }
        }
        previewCoords = [[rIdx, cIdx]];
        paintPreviewWs(previewCoords);
      });

      cell.addEventListener("pointerenter", () => {
        if (!isDraggingWs || !dragStartCoord) return;
        if (dragStartCoord[0] !== rIdx || dragStartCoord[1] !== cIdx) dragMovedWs = true;
        const line = straightLine(dragStartCoord[0], dragStartCoord[1], rIdx, cIdx, true);
        if (line.length > 0) {
          previewCoords = line;
          paintPreviewWs(line);
        }
      });

      wsContainer.appendChild(cell);
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDraggingWs || !dragStartCoord) return;
    const hit = resolveWsCellFromPoint(e.clientX, e.clientY);
    if (!hit) return;
    if (hit[0] !== dragStartCoord[0] || hit[1] !== dragStartCoord[1]) dragMovedWs = true;
    const line = straightLine(dragStartCoord[0], dragStartCoord[1], hit[0], hit[1], true);
    if (line.length > 0) {
      previewCoords = line;
      paintPreviewWs(line);
    }
  });

  const finishWsInteraction = () => {
    if (!isDraggingWs) return;
    isDraggingWs = false;
    const start = dragStartCoord;
    const moved = dragMovedWs;
    const currentLine = previewCoords;
    dragStartCoord = null;
    dragMovedWs = false;

    if (moved && currentLine.length > 1) {
      validateLineWs(currentLine);
      anchorCoord = null;
      previewCoords = [];
      clearPreviewWs();
      return;
    }

    if (!start) return;
    const [r, c] = start;
    if (anchorCoord) {
      const [ar, ac] = anchorCoord;
      if (ar === r && ac === c) {
        anchorCoord = null;
        previewCoords = [];
        clearPreviewWs();
        return;
      }
      const tapLine = straightLine(ar, ac, r, c, false);
      if (tapLine.length > 1) {
        if (validateLineWs(tapLine)) {
          anchorCoord = null;
          previewCoords = [];
          clearPreviewWs();
          return;
        }
        previewCoords = tapLine;
        paintPreviewWs(tapLine);
        return;
      }
    }
    anchorCoord = [r, c];
    previewCoords = [[r, c]];
    paintPreviewWs(previewCoords);
  };

  window.addEventListener("pointerup", finishWsInteraction);
  window.addEventListener("pointercancel", finishWsInteraction);

  const wsResetBtn = document.getElementById("ws-reset-btn");
  if (wsResetBtn) {
    wsResetBtn.addEventListener("click", () => {
      foundWords.clear();
      anchorCoord = null;
      dragStartCoord = null;
      isDraggingWs = false;
      dragMovedWs = false;
      previewCoords = [];
      Object.values(cellMap).forEach((el) => el.classList.remove("found", "selected"));
      palabrasReales.forEach((w) => {
        const li = document.getElementById("ws-word-" + w);
        if (li) li.style.textDecoration = "none";
      });
      if (wsStatus) wsStatus.textContent = "Sopa de Letras reiniciada.";
    });
  }

  const wsHintBtn = document.getElementById("ws-hint-btn");
  if (wsHintBtn) {
    wsHintBtn.addEventListener("click", () => {
      const rem = palabrasReales.find((w) => !foundWords.has(w));
      if (rem && wsStatus) wsStatus.textContent = 'Pista: busca "' + rem + '" en horizontal, vertical o diagonal.';
    });
  }
}

// 3. RULETA DE SITUACIONES Y DECISIONES (Preguntas siempre visibles junto a la rueda)
const situacionesRuleta = [
  {
    tema: "Presión en Redes",
    situacion: "Un amigo te presiona para publicar un meme burlándose de un compañero nuevo.",
    opciones: [
      { texto: "Lo compartes para no quedar mal con el grupo.", buena: false, nivel: "Baja asertividad", porque: "Participar en burlas lastima a otra persona y normaliza el ciberacoso.", consejo: "Di con firmeza: 'Paso, no me late burlarnos de nadie' y cambia de tema." },
      { texto: "Dices que no te parece justo y no reenvías nada.", buena: true, nivel: "Alta asertividad", porque: "Pones un límite claro sin agredir y proteges la dignidad de tu compañero.", consejo: "Si el acoso continúa, avisa a un orientador o docente." },
      { texto: "No dices nada pero le das 'me gusta' en privado.", buena: false, nivel: "Asertividad pasiva", porque: "Dar apoyo silencioso sigue alimentando el daño.", consejo: "Apoyar al compañero afectado marca la diferencia." }
    ]
  },
  {
    tema: "Miedo Académico",
    situacion: "Tienes exposición mañana, sientes taquicardia y miedo a quedarte en blanco.",
    opciones: [
      { texto: "Te desvelas hasta las 3 AM memorizando cada palabra.", buena: false, nivel: "Sobrecarga ansiosa", porque: "Dormir poco bloquea la memoria y multiplica el estrés.", consejo: "Estudia en bloques de 25 minutos y duerme 7-8 horas." },
      { texto: "Practicas respiración 4-7-8, ordenas 3 ideas clave y descansas.", buena: true, nivel: "Alta regulación", porque: "Calmas el sistema nervioso y ayudas a tu memoria a funcionar con claridad.", consejo: "Hablar despacio y tomar agua durante tu turno es válido." },
      { texto: "Finges estar enfermo para faltar a clases.", buena: false, nivel: "Evitación", porque: "Evitar por miedo aumenta la ansiedad para la siguiente exposición.", consejo: "Empieza practicando frente al espejo o con una amistad." }
    ]
  }
];
let wheelAngle = 0;
let ruletaCurrentIdx = 0;
const spinBtn = document.getElementById("spin-wheel-btn");
const wheelSvg = document.getElementById("wheel-svg");
const ruletaInlinePanel = document.getElementById("ruleta-inline-panel");

function renderRuletaQuestion() {
  if (!ruletaInlinePanel) return;
  const item = situacionesRuleta[ruletaCurrentIdx];
  ruletaInlinePanel.innerHTML = `
    <span style="display:inline-block;background:var(--pastel-pink);border:1.5px solid #3A265E;border-radius:8px;padding:2px 8px;font-weight:800;font-size:0.75rem;text-transform:uppercase;">${item.tema}</span>
    <h4 style="font-size:1.6rem;margin-top:6px;">¿Qué harías en esta situación?</h4>
    <p style="margin:8px 0 12px;font-weight:600;background:var(--soft-lilac);padding:10px;border-radius:12px;border:2px solid #3A265E;">${item.situacion}</p>
    <div id="ruleta-opciones" style="display:flex;flex-direction:column;gap:8px;"></div>
  `;
  const cont = document.getElementById("ruleta-opciones");
  item.opciones.forEach((op, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-pastel btn-cyan";
    b.style.justifyContent = "flex-start";
    b.style.textAlign = "left";
    b.textContent = String.fromCharCode(65 + i) + ". " + op.texto;
    b.addEventListener("click", () => {
      ruletaInlinePanel.innerHTML = `
        <h4>${op.buena ? "1. Buena decisión" : "1. Decisiones por mejorar"} · ${op.nivel}</h4>
        <p style="margin:8px 0;"><strong>2. ¿Por qué?</strong> ${op.porque}</p>
        <p style="margin:8px 0;"><strong>3. Consejo práctico:</strong> ${op.consejo}</p>
        <button type="button" class="btn-pastel btn-mint" id="ruleta-otra-inline" style="margin-top:8px;">Siguiente pregunta</button>
      `;
      registrarActividad("Ruleta de Situaciones", 25, item.tema, op.nivel);
      document.getElementById("ruleta-otra-inline").addEventListener("click", () => {
        ruletaCurrentIdx = (ruletaCurrentIdx + 1) % situacionesRuleta.length;
        renderRuletaQuestion();
      });
    });
    cont.appendChild(b);
  });
}

if (ruletaInlinePanel) renderRuletaQuestion();

if (spinBtn && wheelSvg) {
  spinBtn.addEventListener("click", () => {
    wheelAngle += 720 + 90;
    wheelSvg.style.transform = `rotate(${wheelAngle}deg)`;
    if (ruletaInlinePanel) {
      ruletaInlinePanel.innerHTML = `<h4>Girando la ruleta...</h4><p>Seleccionando situación adolescente...</p>`;
    }
    setTimeout(() => {
      ruletaCurrentIdx = (ruletaCurrentIdx + 1) % situacionesRuleta.length;
      renderRuletaQuestion();
    }, 1550);
  });
}

// 4. Mapa Corporal
const bodyInfo = {
  cabeza: { titulo: "Cabeza / Mente (Ansiedad y Preocupación)", texto: "Pensamientos acelerados o dolor de tensión al anticipar problemas.", ejercicio: "Ejercicio: Masajea tus sienes en círculos lentos durante 20 segundos y suelta la mandíbula." },
  hombros: { titulo: "Hombros y Cuello (Enojo y Estrés)", texto: "Rigidez muscular cuando guardas frustración o presión escolar.", ejercicio: "Ejercicio: Sube los hombros hacia las orejas 4 segundos y déjalos caer de golpe exhalando." },
  pecho: { titulo: "Pecho y Garganta (Tristeza)", texto: "Sensación de nudo en la garganta o pesadez en el pecho.", ejercicio: "Ejercicio: Coloca una mano sobre tu pecho, inhala suave y di en voz baja: 'Está bien sentir esto'." },
  estomago: { titulo: "Estómago (Miedo)", texto: "Mariposas intensas o nudo estomacal cuando el cuerpo entra en alerta.", ejercicio: "Ejercicio: Respiración abdominal lenta inflando el abdomen 4 segundos y soltando en 6." }
};
document.querySelectorAll("[data-body-zone]").forEach((zone) => {
  zone.addEventListener("click", () => {
    const key = zone.getAttribute("data-body-zone");
    const info = bodyInfo[key];
    if (!info) return;
    document.getElementById("body-zone-title").textContent = info.titulo;
    document.getElementById("body-zone-desc").textContent = info.texto;
    document.getElementById("body-zone-ex").textContent = info.ejercicio;
    registrarActividad("Mapa Corporal", 20, "Conciencia Somática", "Exploró zona corporal: " + key);
  });
});

// 5. Chat Simulado
const chatBox = document.getElementById("chat-box");
const chatTrust = document.getElementById("chat-trust");
const chatChoices = document.getElementById("chat-choices");
if (chatBox && chatChoices) {
  const sc = {
    friend: "Oye... la verdad ya no aguanto la presión en mi casa ni en el colegio. A veces siento que desaparecer sería más fácil.",
    options: [
      { label: "Ay no exageres, mañana se te pasa solo.", delta: -20, reply: "Bueno... mejor ya no te digo nada, perdona por molestar.", good: false },
      { label: "Gracias por confiar en mí. No estás solo, ¿quieres que hablemos y busquemos apoyo con un adulto de confianza?", delta: 30, reply: "De verdad necesitaba que alguien me escuchara sin juzgarme. Sí, hablemos con la orientadora.", good: true },
      { label: "Entiendo que duela mucho. Cuéntame qué pasó hoy, te escucho con calma.", delta: 25, reply: "Gracias... me cuesta hablarlo pero me hace bien saber que estás aquí.", good: true }
    ]
  };
  let trustScore = 50;
  chatBox.innerHTML = `<div class="chat-msg friend">${sc.friend}</div>`;
  sc.options.forEach((op) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-pastel btn-peach";
    b.textContent = op.label;
    b.addEventListener("click", () => {
      trustScore = Math.max(0, Math.min(100, trustScore + op.delta));
      if (chatTrust) chatTrust.textContent = trustScore + "%";
      chatBox.innerHTML += `<div class="chat-msg player">${op.label}</div>`;
      chatBox.innerHTML += `<div class="chat-msg friend">${op.reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      registrarActividad("Chat Simulado", 25, "Empatía y Apoyo", op.good ? "Respuesta empática y segura." : "Requiere mejorar escucha activa.");
    });
    chatChoices.appendChild(b);
  });
}
