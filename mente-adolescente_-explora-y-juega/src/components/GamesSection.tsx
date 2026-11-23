import React, { useEffect, useRef, useState } from "react";
import {
  TOOLKIT_CARDS,
  ToolkitCard,
  WORD_SEARCH_ROWS,
  WORD_SEARCH_TARGETS,
  RULETA_SITUACIONES,
  DIMENSIONES_CAMBIO,
  GALLERY_ITEMS,
  GalleryItem,
  RuletaSituation
} from "../data/psychData";

export type GameKey = "cards" | "sopa" | "ruleta" | "mapa" | "chat";

interface GamesSectionProps {
  onCompleteActivity: (actividad: string, puntos: number, emocion: string, detalle: string) => void;
  onBlurChange: (active: boolean) => void;
  onOpenGallery: (item: GalleryItem) => void;
  activeGameModal: GameKey | null;
  onOpenGameModal: (game: GameKey) => void;
  onCloseGameModal: () => void;
  renderFila4ContentOnly?: boolean;
}

type BodyEmotion = "Miedo" | "Tristeza" | "Enojo" | "Ansiedad";

const EMOTION_COLORS: Record<BodyEmotion, string> = {
  Miedo: "#CDB4DB",
  Tristeza: "#A2D2FF",
  Enojo: "#FFAFCC",
  Ansiedad: "#FFD6A5"
};

const BODY_ZONES: Record<
  string,
  { label: string; fisiologia: string; ejercicio: string }
> = {
  cabeza: {
    label: "Cabeza y Mente",
    fisiologia: "Pensamientos acelerados, preocupación anticipada o sensación de presión en sienes.",
    ejercicio: "Masajea suavemente tus sienes en círculos durante 20 segundos y suelta la mandíbula."
  },
  hombros: {
    label: "Hombros y Cuello",
    fisiologia: "Tensión muscular acumulada por enojo contenido, alerta constante o estrés escolar.",
    ejercicio: "Eleva ambos hombros hacia las orejas por 4 segundos y déjalos caer exhalando largo."
  },
  pecho: {
    label: "Pecho y Garganta",
    fisiologia: "Opresión en el pecho o nudo en la garganta típicos de la tristeza y el duelo.",
    ejercicio: "Coloca una mano sobre tu pecho, inhala suave 4s y exhala en 6s sin juzgar tu sentir."
  },
  estomago: {
    label: "Estómago",
    fisiologia: "Sensación de vacío o 'mariposas intensas' cuando el miedo activa la alerta corporal.",
    ejercicio: "Realiza respiración abdominal: infla el abdomen como un globo 4s y desinfla en 6s."
  },
  manos: {
    label: "Manos y Brazos",
    fisiologia: "Inquietud, temblor leve o ganas de cerrar los puños ante nerviosismo o frustración.",
    ejercicio: "Aprieta los puños 3 segundos y ábrelos extendiendo los dedos mientras sueltas el aire."
  }
};

interface ChatStep {
  friendMsg: string;
  options: {
    label: string;
    trustDelta: number;
    friendReply: string;
    nextStep?: number;
    quality: "Empatía Activa" | "Minimización / Juicio" | "Apoyo Seguro con Adulto";
  }[];
}

const CHAT_SCRIPT: ChatStep[] = [
  {
    friendMsg:
      "Oye... necesitaba escribirle a alguien. Últimamente siento que nada me sale bien y ayer pensé en hacer algo arriesgado para dejar de sentir tanto peso.",
    options: [
      {
        label: "Ay, no exageres, todos tenemos días malos y mañana ya se te pasa.",
        trustDelta: -22,
        friendReply: "Perdón por molestar... mejor ya no te cuento nada.",
        nextStep: 1,
        quality: "Minimización / Juicio"
      },
      {
        label: "Gracias por confiar en mí. Me importas mucho, ¿quieres contarme qué pasó hoy?",
        trustDelta: +25,
        friendReply:
          "Gracias por no juzgarme... siento mucha presión en casa y en la escuela y no sé a quién decírselo.",
        nextStep: 1,
        quality: "Empatía Activa"
      },
      {
        label:
          "Eso que me dices es muy importante. No estás solo; ¿buscamos hoy a la orientadora o a un adulto de confianza juntos?",
        trustDelta: +30,
        friendReply:
          "Me da un poco de miedo, pero si me acompañas creo que sí me atrevo a hablar con ella.",
        nextStep: 1,
        quality: "Apoyo Seguro con Adulto"
      }
    ]
  },
  {
    friendMsg:
      "La verdad tengo miedo de que si lo hablo con alguien mayor me regañen o no me entiendan.",
    options: [
      {
        label:
          "Yo voy contigo con la orientadora o tu mamá/papá para que no hables solo. Mereces sentirte a salvo.",
        trustDelta: +25,
        friendReply:
          "Gracias de corazón. Saber que estás conmigo me quita un peso enorme de encima.",
        quality: "Apoyo Seguro con Adulto"
      },
      {
        label: "Entonces no le digas a nadie y guárdalo en secreto entre tú y yo.",
        trustDelta: -25,
        friendReply: "Bueno... aunque sigo sintiendo mucho miedo de quedarme solo con esto.",
        quality: "Minimización / Juicio"
      },
      {
        label:
          "Es normal sentir miedo al pedir ayuda, pero pedir apoyo profesional es justo lo que ayuda a salir adelante.",
        trustDelta: +20,
        friendReply: "Tienes razón. Voy a escribir hoy mismo a orientación escolar.",
        quality: "Empatía Activa"
      }
    ]
  }
];

const WORD_BADGE_COLORS = [
  "#B9FBC0",
  "#FFD6A5",
  "#FDFFB6",
  "#CDB4DB",
  "#A2D2FF",
  "#FFAFCC",
  "#B9FBC0",
  "#FFD6A5",
  "#FDFFB6",
  "#CDB4DB"
];

function getStraightLineCells(
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  allowSnap = false
): string[] {
  const dr = r2 - r1;
  const dc = c2 - c1;
  if (dr === 0 && dc === 0) return [`${r1}-${c1}`];

  const absR = Math.abs(dr);
  const absC = Math.abs(dc);

  // Línea recta exacta: horizontal, vertical o diagonal 45°
  if (dr === 0 || dc === 0 || absR === absC) {
    const steps = Math.max(absR, absC);
    const stepR = dr === 0 ? 0 : dr / absR;
    const stepC = dc === 0 ? 0 : dc / absC;
    const cells: string[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push(`${r1 + i * stepR}-${c1 + i * stepC}`);
    }
    return cells;
  }

  if (!allowSnap) return [];

  // Ajuste suave al rayo de 8 direcciones más cercano durante arrastre continuo
  const angle = Math.atan2(dr, dc);
  const sector = Math.round(angle / (Math.PI / 4));
  const stepR = Math.round(Math.sin((sector * Math.PI) / 4));
  const stepC = Math.round(Math.cos((sector * Math.PI) / 4));
  if (stepR === 0 && stepC === 0) return [`${r1}-${c1}`];

  const steps = Math.max(absR, absC);
  const cells: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const rr = r1 + i * stepR;
    const cc = c1 + i * stepC;
    if (rr < 0 || rr >= 12 || cc < 0 || cc >= 12) break;
    cells.push(`${rr}-${cc}`);
  }
  return cells;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  onCompleteActivity,
  onBlurChange,
  onOpenGallery,
  activeGameModal,
  onOpenGameModal,
  onCloseGameModal,
  renderFila4ContentOnly = false
}) => {
  const topicItems = GALLERY_ITEMS.filter((g) => g.category === "tema");

  // ============================================================================
  // 1. FLUJO INTERACTIVO DE CARDS (Mazo izquierda + Modal de inspección + Panel derecho + Revelación + Reinicio)
  // ============================================================================
  const [placedCards, setPlacedCards] = useState<ToolkitCard[]>([]);
  const [inspectedCard, setInspectedCard] = useState<ToolkitCard | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const [cardsNotice, setCardsNotice] = useState<string>(
    "Arrastra la ficha superior hacia tu caja derecha o selecciónala para inspeccionar."
  );

  const remainingCards = TOOLKIT_CARDS.filter(
    (card) => !placedCards.some((p) => p.id === card.id)
  );
  const currentDeckCard = remainingCards[0] || null;
  const allCardsCompleted = placedCards.length === TOOLKIT_CARDS.length;

  const integrateCardToPlan = (card: ToolkitCard) => {
    if (placedCards.some((p) => p.id === card.id)) return;
    const nextPlaced = [...placedCards, card];
    setPlacedCards(nextPlaced);
    setInspectedCard(null);
    setDraggingCardId(null);
    setDropActive(false);
    onBlurChange(false);

    if (nextPlaced.length === TOOLKIT_CARDS.length) {
      setCardsNotice("¡Has integrado todas las herramientas en tu plan emocional!");
      onCompleteActivity(
        "Cards Drag & Drop",
        25,
        "Regulación Emocional",
        "Inspeccionó e integró las 6 herramientas en su Mapa de Recursos Emocionales."
      );
    } else {
      setCardsNotice(`Elemento integrado a tu plan: "${card.titulo}".`);
    }
  };

  const resetToolkitBoard = () => {
    setPlacedCards([]);
    setInspectedCard(null);
    setDraggingCardId(null);
    setDropActive(false);
    onBlurChange(false);
    setCardsNotice("Panel reiniciado con éxito.");
  };

  // ============================================================================
  // 2. SOPA DE LETRAS 12x12 (Arrastre fluido, 2 clics o letra por letra H / V / Diagonal)
  // ============================================================================
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCellColors, setFoundCellColors] = useState<Record<string, string>>({});
  const [anchorCell, setAnchorCell] = useState<[number, number] | null>(null);
  const [previewCells, setPreviewCells] = useState<string[]>([]);
  const [hintCell, setHintCell] = useState<string | null>(null);
  const [wsMessage, setWsMessage] = useState<string>(
    "Mantén presionado y arrastra desde la primera hasta la última letra (o presiona inicio y fin)."
  );

  const boardRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef<[number, number] | null>(null);
  const previewCellsRef = useRef<string[]>([]);
  const anchorCellRef = useRef<[number, number] | null>(null);
  const foundWordsRef = useRef<string[]>([]);
  const foundCellColorsRef = useRef<Record<string, string>>({});
  const onCompleteRef = useRef(onCompleteActivity);

  useEffect(() => {
    onCompleteRef.current = onCompleteActivity;
  }, [onCompleteActivity]);

  useEffect(() => {
    foundWordsRef.current = foundWords;
  }, [foundWords]);

  useEffect(() => {
    foundCellColorsRef.current = foundCellColors;
  }, [foundCellColors]);

  const validateWordSelection = (cells: string[]) => {
    if (cells.length < 2) return false;
    const forward = cells
      .map((k) => {
        const [r, c] = k.split("-").map(Number);
        return WORD_SEARCH_ROWS[r]?.[c] ?? "";
      })
      .join("");
    const backward = forward.split("").reverse().join("");

    const currentFound = foundWordsRef.current;
    const matched = WORD_SEARCH_TARGETS.find(
      (target) => (target === forward || target === backward) && !currentFound.includes(target)
    );
    if (!matched) return false;

    const badgeColor = WORD_BADGE_COLORS[currentFound.length % WORD_BADGE_COLORS.length];
    const nextColors = { ...foundCellColorsRef.current };
    cells.forEach((k) => {
      nextColors[k] = badgeColor;
    });
    const nextWords = [...currentFound, matched];
    foundCellColorsRef.current = nextColors;
    foundWordsRef.current = nextWords;
    setFoundCellColors(nextColors);
    setFoundWords(nextWords);
    setHintCell(null);
    setWsMessage(`¡Encontraste "${matched}"! (${nextWords.length}/${WORD_SEARCH_TARGETS.length})`);

    if (nextWords.length >= 5) {
      onCompleteRef.current(
        "Sopa de Letras",
        25,
        "Vocabulario Emocional",
        `Encontró ${nextWords.length} de ${WORD_SEARCH_TARGETS.length} conceptos psicológicos.`
      );
    }
    return true;
  };

  const resolveCellFromPoint = (clientX: number, clientY: number): [number, number] | null => {
    const el = document.elementFromPoint(clientX, clientY)?.closest("[data-ws-row]") as HTMLElement | null;
    if (el) {
      const rr = Number(el.getAttribute("data-ws-row"));
      const cc = Number(el.getAttribute("data-ws-col"));
      if (!Number.isNaN(rr) && !Number.isNaN(cc)) return [rr, cc];
    }
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const pad = 12;
    const innerW = rect.width - pad * 2;
    const innerH = rect.height - pad * 2;
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom &&
      innerW > 0 &&
      innerH > 0
    ) {
      const cc = Math.max(0, Math.min(11, Math.floor(((clientX - rect.left - pad) / innerW) * 12)));
      const rr = Math.max(0, Math.min(11, Math.floor(((clientY - rect.top - pad) / innerH) * 12)));
      return [rr, cc];
    }
    return null;
  };

  const updateDragPreview = (r: number, c: number) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const [sr, sc] = dragStartRef.current;
    if (sr !== r || sc !== c) {
      dragMovedRef.current = true;
    }
    const line = getStraightLineCells(sr, sc, r, c, true);
    if (line.length > 0) {
      previewCellsRef.current = line;
      setPreviewCells(line);
    }
  };

  useEffect(() => {
    const finishInteraction = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const start = dragStartRef.current;
      const dragged = dragMovedRef.current;
      const currentLine = previewCellsRef.current;
      dragStartRef.current = null;
      dragMovedRef.current = false;

      if (dragged && currentLine.length > 1) {
        // Completó un arrastre: validar y limpiar cualquier ancla previa
        validateWordSelection(currentLine);
        anchorCellRef.current = null;
        previewCellsRef.current = [];
        setAnchorCell(null);
        setPreviewCells([]);
        return;
      }

      // Fue un toque/clic simple sobre `start`
      if (!start) return;
      const [r, c] = start;
      const prevAnchor = anchorCellRef.current;

      if (prevAnchor) {
        const [ar, ac] = prevAnchor;
        if (ar === r && ac === c) {
          anchorCellRef.current = null;
          previewCellsRef.current = [];
          setAnchorCell(null);
          setPreviewCells([]);
          return;
        }
        const tapLine = getStraightLineCells(ar, ac, r, c, false);
        if (tapLine.length > 1) {
          const matched = validateWordSelection(tapLine);
          if (matched) {
            anchorCellRef.current = null;
            previewCellsRef.current = [];
            setAnchorCell(null);
            setPreviewCells([]);
            return;
          }
          // Mantener selección progresiva cuando presiona letra por letra en línea recta
          previewCellsRef.current = tapLine;
          setPreviewCells(tapLine);
          return;
        }
      }

      anchorCellRef.current = [r, c];
      previewCellsRef.current = [`${r}-${c}`];
      setAnchorCell([r, c]);
      setPreviewCells([`${r}-${c}`]);
    };

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const hit = resolveCellFromPoint(e.clientX, e.clientY);
      if (hit) {
        updateDragPreview(hit[0], hit[1]);
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", finishInteraction);
    window.addEventListener("pointercancel", finishInteraction);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", finishInteraction);
      window.removeEventListener("pointercancel", finishInteraction);
    };
  }, []);

  const handleWsPointerDown = (e: React.PointerEvent<HTMLDivElement>, r: number, c: number) => {
    e.preventDefault();
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignorar si el navegador no soporta liberación
    }
    dragStartRef.current = [r, c];
    dragMovedRef.current = false;
    isDraggingRef.current = true;
    const prevAnchor = anchorCellRef.current;
    if (prevAnchor) {
      const tapLine = getStraightLineCells(prevAnchor[0], prevAnchor[1], r, c, false);
      if (tapLine.length > 1) {
        previewCellsRef.current = tapLine;
        setPreviewCells(tapLine);
        return;
      }
    }
    previewCellsRef.current = [`${r}-${c}`];
    setPreviewCells([`${r}-${c}`]);
  };

  const showWordSearchHint = () => {
    const remaining = WORD_SEARCH_TARGETS.find((w) => !foundWords.includes(w));
    if (!remaining) return;
    const firstChar = remaining[0];
    // Localiza el inicio real en la matriz 12x12
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];
    for (let r = 0; r < WORD_SEARCH_ROWS.length; r++) {
      for (let c = 0; c < WORD_SEARCH_ROWS[r].length; c++) {
        if (WORD_SEARCH_ROWS[r][c] !== firstChar) continue;
        for (const [dr, dc] of dirs) {
          let match = true;
          for (let k = 0; k < remaining.length; k++) {
            const rr = r + dr * k;
            const cc = c + dc * k;
            if (
              rr < 0 ||
              rr >= WORD_SEARCH_ROWS.length ||
              cc < 0 ||
              cc >= WORD_SEARCH_ROWS[rr].length ||
              WORD_SEARCH_ROWS[rr][cc] !== remaining[k]
            ) {
              match = false;
              break;
            }
          }
          if (match) {
            setHintCell(`${r}-${c}`);
            setWsMessage(`Pista: "${remaining}" comienza en la fila ${r + 1}, columna ${c + 1}.`);
            return;
          }
        }
      }
    }
  };

  const resetWordSearch = () => {
    foundWordsRef.current = [];
    foundCellColorsRef.current = {};
    anchorCellRef.current = null;
    previewCellsRef.current = [];
    dragStartRef.current = null;
    isDraggingRef.current = false;
    dragMovedRef.current = false;
    setFoundWords([]);
    setFoundCellColors({});
    setAnchorCell(null);
    setPreviewCells([]);
    setHintCell(null);
    setWsMessage("Sopa de Letras reiniciada. ¡Encuentra las 10 palabras!");
  };

  // ============================================================================
  // 3. RULETA DE SITUACIONES Y DECISIONES (Preguntas SIEMPRE visibles al girar/elegir)
  // ============================================================================
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ruletaIndex, setRuletaIndex] = useState(0);
  const [questionVisible, setQuestionVisible] = useState(true);
  const [selectedRuletaOption, setSelectedRuletaOption] = useState<
    RuletaSituation["opciones"][number] | null
  >(null);

  const spinWheel = (specificNext?: number) => {
    if (isSpinning) return;
    setSelectedRuletaOption(null);
    setQuestionVisible(false);
    setIsSpinning(true);
    const nextIdx =
      typeof specificNext === "number"
        ? specificNext % RULETA_SITUACIONES.length
        : (ruletaIndex + 1 + Math.floor(Math.random() * (RULETA_SITUACIONES.length - 1))) %
          RULETA_SITUACIONES.length;
    setRuletaIndex(nextIdx);
    // Alinea el ángulo de giro con el cuadrante elegido
    const sectorBase = nextIdx * 90 + 45;
    setWheelAngle((prev) => prev + 720 + sectorBase);
    setTimeout(() => {
      setIsSpinning(false);
      setQuestionVisible(true);
    }, 1500);
  };

  const currentSit = RULETA_SITUACIONES[ruletaIndex];

  // ============================================================================
  // 4. MAPA CORPORAL DE LAS EMOCIONES
  // ============================================================================
  const [brushEmotion, setBrushEmotion] = useState<BodyEmotion>("Miedo");
  const [paintedZones, setPaintedZones] = useState<Record<string, BodyEmotion>>({});
  const [activeBodyZone, setActiveBodyZone] = useState<string>("estomago");
  const [breathTimer, setBreathTimer] = useState<number | null>(null);

  const handlePaintBodyZone = (zoneKey: string) => {
    setActiveBodyZone(zoneKey);
    const nextPainted = { ...paintedZones, [zoneKey]: brushEmotion };
    setPaintedZones(nextPainted);
    if (Object.keys(nextPainted).length >= 2) {
      onCompleteActivity(
        "Mapa Corporal de las Emociones",
        20,
        brushEmotion,
        `Mapeó ${brushEmotion} en ${BODY_ZONES[zoneKey].label} y practicó ejercicio breve.`
      );
    }
  };

  const startReleaseExercise = () => {
    if (breathTimer !== null) return;
    setBreathTimer(6);
    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ============================================================================
  // 5. CHAT SIMULADO DE TOMA DE DECISIONES
  // ============================================================================
  const [chatStepIdx, setChatStepIdx] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ sender: "friend" | "player"; text: string }[]>([
    { sender: "friend", text: CHAT_SCRIPT[0].friendMsg }
  ]);
  const [trustScore, setTrustScore] = useState(50);
  const [chatFinished, setChatFinished] = useState(false);

  const handleChatOption = (opt: ChatStep["options"][number]) => {
    const newTrust = Math.max(0, Math.min(100, trustScore + opt.trustDelta));
    setTrustScore(newTrust);
    const updated = [
      ...chatHistory,
      { sender: "player" as const, text: opt.label },
      { sender: "friend" as const, text: opt.friendReply }
    ];
    if (typeof opt.nextStep === "number" && CHAT_SCRIPT[opt.nextStep]) {
      updated.push({ sender: "friend" as const, text: CHAT_SCRIPT[opt.nextStep].friendMsg });
      setChatStepIdx(opt.nextStep);
    } else {
      setChatFinished(true);
      onCompleteActivity(
        "Chat Simulado de Toma de Decisiones",
        25,
        "Empatía y Apoyo",
        `Finalizó diálogo con ${newTrust}% de confianza (${opt.quality}).`
      );
    }
    setChatHistory(updated);
  };

  const resetChat = () => {
    setChatStepIdx(0);
    setChatHistory([{ sender: "friend", text: CHAT_SCRIPT[0].friendMsg }]);
    setTrustScore(50);
    setChatFinished(false);
  };

  // ============================================================================
  // RENDERS MODULARES PARA LOS 5 JUEGOS
  // ============================================================================
  const renderCardsToolkit = () => (
    <div className="space-y-5">
      {/* Estado / instrucción superior */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] px-4 py-2.5">
        <p className="font-semibold text-sm text-[#2B1D47]">{cardsNotice}</p>
        <span className="text-xs font-extrabold uppercase text-[#3A265E] tabular-nums">
          Integrado: {placedCards.length} / {TOOLKIT_CARDS.length}
        </span>
      </div>

      {/* Tablero de 2 columnas: Mazo izquierda + Caja acumulativa derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* IZQUIERDA: Mazo / Pila interactiva */}
        <div className="rounded-2xl border-2 border-[#3A265E] bg-[#CDB4DB] p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-1">
              Mazo de Herramientas Emocionales
            </h4>
            <p className="text-xs text-[#2B1D47] mb-4">
              Arrastra la ficha superior hacia tu Caja de Herramientas o selecciónala para abrir su vista detallada.
            </p>
          </div>

          {currentDeckCard ? (
            <div className="relative py-3 px-1">
              {/* Capas visuales de pila apilada */}
              {remainingCards.length >= 3 && (
                <div className="absolute inset-x-4 top-1 bottom-5 rounded-2xl border-2 border-[#3A265E] bg-[#A2D2FF] translate-y-3 translate-x-2 opacity-80 pointer-events-none" />
              )}
              {remainingCards.length >= 2 && (
                <div className="absolute inset-x-2 top-2 bottom-4 rounded-2xl border-2 border-[#3A265E] bg-[#FFAFCC] translate-y-1.5 translate-x-1 opacity-90 pointer-events-none" />
              )}

              {/* Ficha superior interactiva */}
              <div
                draggable
                onDragStart={() => {
                  setDraggingCardId(currentDeckCard.id);
                  onBlurChange(true);
                }}
                onDragEnd={() => {
                  setDraggingCardId(null);
                  setDropActive(false);
                  onBlurChange(false);
                }}
                onClick={() => setInspectedCard(currentDeckCard)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setInspectedCard(currentDeckCard)}
                className="relative z-10 rounded-2xl border-3 border-[#3A265E] p-4 shadow-[0_6px_0_#3A265E] cursor-grab hover:-translate-y-1 transition-transform"
                style={{ backgroundColor: currentDeckCard.color }}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={currentDeckCard.imagen}
                    alt={currentDeckCard.titulo}
                    className="w-24 h-24 rounded-xl border-2 border-[#3A265E] object-cover shrink-0 bg-[#DFD2F2]"
                  />
                  <div className="flex-1 text-left">
                    <span className="inline-block rounded-lg border border-[#3A265E] bg-[#FDFFB6] px-2.5 py-0.5 text-[11px] font-bold uppercase text-[#3A265E]">
                      {currentDeckCard.categoria}
                    </span>
                    <h5 className="font-display text-2xl font-extrabold text-[#3A265E] mt-1">
                      {currentDeckCard.titulo}
                    </h5>
                    <p className="text-xs text-[#2B1D47] font-medium mt-1">
                      {currentDeckCard.resumen}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#3A265E]/25 pt-3">
                  <span className="text-xs font-bold text-[#3A265E]">
                    Arrastra o selecciona para inspeccionar ({remainingCards.length} restantes)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedCard(currentDeckCard);
                      }}
                      className="px-3 py-1 rounded-lg border-2 border-[#3A265E] bg-[#FDFFB6] text-xs font-bold cursor-pointer"
                    >
                      Inspeccionar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        integrateCardToPlan(currentDeckCard);
                      }}
                      className="px-3 py-1 rounded-lg border-2 border-[#3A265E] bg-[#B9FBC0] text-xs font-bold cursor-pointer"
                    >
                      Integrar →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-3 border-[#3A265E] bg-[#B9FBC0] p-6 text-center my-auto">
              <span className="material-icons text-5xl text-[#3A265E]">verified</span>
              <h5 className="font-display text-3xl font-extrabold uppercase text-[#3A265E] mt-1">
                ¡Has integrado todas las herramientas en tu plan!
              </h5>
              <p className="text-sm font-medium text-[#2B1D47] mt-1">
                Ya completaste el mazo completo. Revisa tu Mapa de Recursos abajo o reinicia para practicar de nuevo.
              </p>
            </div>
          )}
        </div>

        {/* DERECHA: Contenedor acumulativo con botón Reiniciar */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDropActive(true);
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropActive(false);
            onBlurChange(false);
            const targetCard =
              TOOLKIT_CARDS.find((c) => c.id === draggingCardId) || currentDeckCard;
            if (targetCard) integrateCardToPlan(targetCard);
          }}
          className={`rounded-2xl border-3 border-dashed border-[#3A265E] p-5 flex flex-col transition-colors ${
            dropActive ? "bg-[#B9FBC0]" : "bg-[#C8E2FC]"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E]">
                Tu Caja de Herramientas Emocionales
              </h4>
              <p className="text-xs text-[#2B1D47]">
                Contenedor acumulativo de tu Plan de Bienestar
              </p>
            </div>
            <button
              type="button"
              onClick={resetToolkitBoard}
              className="pastel-btn bg-[#FFD6A5] text-xs py-1.5 px-3"
            >
              Reiniciar
            </button>
          </div>

          {placedCards.length === 0 ? (
            <div className="flex-1 min-h-[190px] rounded-xl border-2 border-dashed border-[#3A265E]/60 bg-[#DFD2F2] flex flex-col items-center justify-center p-5 text-center">
              <span className="material-icons text-4xl text-[#3A265E] mb-2">move_to_inbox</span>
              <p className="text-sm font-bold text-[#3A265E]">
                Tu Caja de Herramientas está vacía
              </p>
              <p className="text-xs text-[#2B1D47] mt-1 max-w-xs">
                Arrastra una ficha desde la pila izquierda hacia este contenedor o selecciónala para inspeccionarla e integrarla.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1 max-h-[310px] overflow-y-auto pr-1">
              {placedCards.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setInspectedCard(item)}
                  className="w-full text-left flex items-center gap-3 rounded-xl border-2 border-[#3A265E] bg-[#B9FBC0] hover:bg-[#FDFFB6] p-2.5 transition-colors cursor-pointer"
                >
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="w-12 h-12 rounded-lg border border-[#3A265E] object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-[#3A265E] truncate">
                        {idx + 1}. {item.titulo}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-[#DFD2F2] border border-[#3A265E] rounded px-1.5 py-0.5 shrink-0">
                        {item.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-[#2B1D47] truncate">{item.resumen}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REVELACIÓN AUTOMÁTICA AL COMPLETAR TODAS LAS FICHAS */}
      {allCardsCompleted && (
        <div className="rounded-3xl border-3 border-[#3A265E] bg-[#FDFFB6] p-6 shadow-[0_6px_0_#3A265E]">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <img
              src="img/img5.svg"
              alt="Mapa de Recursos Emocionales"
              className="w-32 h-32 rounded-2xl border-2 border-[#3A265E] object-cover shrink-0 bg-[#DFD2F2]"
            />
            <div className="flex-1 text-left">
              <span className="inline-block rounded-lg border border-[#3A265E] bg-[#FFAFCC] px-3 py-0.5 text-xs font-extrabold uppercase text-[#3A265E]">
                Recompensa Desbloqueada (+25 pts)
              </span>
              <h4 className="font-display text-3xl font-extrabold uppercase text-[#3A265E] mt-1">
                ¡Felicitaciones! Has completado tu Mapa de Recursos Emocionales
              </h4>
              <p className="text-sm text-[#2B1D47] mt-1 leading-relaxed">
                Ahora cuentas con 6 estrategias prácticas para tu vida cotidiana adolescente: respira 4-7-8 antes de exponer, reencuadra pensamientos duros, aplica tu pausa asertiva ante presión grupal, usa el anclaje 5-4-3-2-1, escribe para validar tu sentir y acude a tu red de apoyo confiable.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSopaDeLetras = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] px-4 py-2.5">
        <p className="text-xs sm:text-sm font-semibold text-[#2B1D47]">{wsMessage}</p>
        <div className="flex gap-2">
          <button type="button" onClick={showWordSearchHint} className="pastel-btn bg-[#FFD6A5] text-xs py-1 px-3">
            Pista
          </button>
          <button type="button" onClick={resetWordSearch} className="pastel-btn bg-[#FFAFCC] text-xs py-1 px-3">
            Reiniciar
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div
          ref={boardRef}
          onDragStart={(e) => e.preventDefault()}
          className="ws-board-12 w-full max-w-[460px] bg-[#DFD2F2] p-3 rounded-2xl border-3 border-[#3A265E] shadow-[0_5px_0_#3A265E] select-none touch-none"
        >
          {WORD_SEARCH_ROWS.map((row, r) =>
            row.split("").map((letter, c) => {
              const key = `${r}-${c}`;
              const foundBg = foundCellColors[key];
              const isPreview = previewCells.includes(key);
              const isAnchor = anchorCell && anchorCell[0] === r && anchorCell[1] === c;
              const isHint = hintCell === key;

              let cellBg = "#FDFFB6";
              if (foundBg) cellBg = foundBg;
              if (isPreview || isAnchor) cellBg = "#FFAFCC";
              if (isHint && !foundBg) cellBg = "#FFD6A5";

              return (
                <div
                  key={key}
                  role="gridcell"
                  aria-label={`Letra ${letter} fila ${r + 1} columna ${c + 1}`}
                  draggable={false}
                  data-ws-row={r}
                  data-ws-col={c}
                  onPointerDown={(e) => handleWsPointerDown(e, r, c)}
                  onPointerEnter={() => updateDragPreview(r, c)}
                  onDragStart={(e) => e.preventDefault()}
                  className={`aspect-square rounded-md border-2 border-[#3A265E] font-extrabold text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-transform select-none touch-none ${
                    isPreview || isAnchor ? "scale-105 ring-2 ring-[#3A265E]" : ""
                  } ${isHint ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: cellBg, color: "#2B1D47", WebkitUserSelect: "none" }}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        <div className="flex-1 w-full">
          <p className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-2">
            Palabras Ocultas ({foundWords.length}/{WORD_SEARCH_TARGETS.length}):
          </p>
          <p className="text-xs text-[#2B1D47] mb-3">
            Incluye palabras horizontales, verticales y diagonales (Ej. <strong>MIEDO</strong> en diagonal).
          </p>
          <div className="grid grid-cols-2 gap-2">
            {WORD_SEARCH_TARGETS.map((w, idx) => {
              const found = foundWords.includes(w);
              return (
                <div
                  key={w}
                  className={`px-3 py-2 rounded-xl border-2 border-[#3A265E] font-bold text-xs sm:text-sm flex items-center justify-between ${
                    found ? "line-through" : ""
                  }`}
                  style={{
                    backgroundColor: found ? WORD_BADGE_COLORS[idx % WORD_BADGE_COLORS.length] : "#FFD6A5"
                  }}
                >
                  <span>{w}</span>
                  <span>{found ? "✓" : ""}</span>
                </div>
              );
            })}
          </div>
          {foundWords.length === WORD_SEARCH_TARGETS.length && (
            <div className="mt-4 rounded-2xl border-2 border-[#3A265E] bg-[#B9FBC0] p-3 font-bold text-sm text-[#3A265E]">
              ¡Excelente! Completaste las 10 palabras de psicología adolescente (+25 pts).
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRuleta = (showModalClose?: boolean) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Columna de la Rueda */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="relative flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#3A265E] -mb-2 z-10" />
          <svg
            viewBox="0 0 240 240"
            className="w-60 h-60 transition-transform duration-[1500ms] ease-[cubic-bezier(0.17,0.67,0.12,0.99)]"
            style={{ transform: `rotate(${wheelAngle}deg)` }}
          >
            <circle cx="120" cy="120" r="114" fill="#CDB4DB" stroke="#3A265E" strokeWidth="5" />
            <path d="M120,120 L120,6 A114,114 0 0,1 234,120 Z" fill="#FFAFCC" stroke="#3A265E" strokeWidth="3" />
            <path d="M120,120 L234,120 A114,114 0 0,1 120,234 Z" fill="#B9FBC0" stroke="#3A265E" strokeWidth="3" />
            <path d="M120,120 L120,234 A114,114 0 0,1 6,120 Z" fill="#A2D2FF" stroke="#3A265E" strokeWidth="3" />
            <path d="M120,120 L6,120 A114,114 0 0,1 120,6 Z" fill="#FDFFB6" stroke="#3A265E" strokeWidth="3" />
            <text x="166" y="74" textAnchor="middle" fill="#3A265E" fontSize="13" fontWeight="800">REDES</text>
            <text x="166" y="174" textAnchor="middle" fill="#3A265E" fontSize="13" fontWeight="800">ESCUELA</text>
            <text x="72" y="174" textAnchor="middle" fill="#3A265E" fontSize="13" fontWeight="800">EMOCIÓN</text>
            <text x="72" y="74" textAnchor="middle" fill="#3A265E" fontSize="13" fontWeight="800">LÍMITES</text>
            <circle cx="120" cy="120" r="24" fill="#3A265E" />
            <circle cx="120" cy="120" r="11" fill="#FDFFB6" />
          </svg>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => spinWheel()}
            className="pastel-btn bg-[#FFAFCC]"
          >
            {isSpinning ? "Girando ruleta..." : "Girar la Ruleta"}
          </button>
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => {
              setSelectedRuletaOption(null);
              setRuletaIndex((prev) => (prev + 1) % RULETA_SITUACIONES.length);
              setQuestionVisible(true);
            }}
            className="pastel-btn bg-[#FDFFB6] text-xs"
          >
            Siguiente situación
          </button>
        </div>
      </div>

      {/* Columna de la Pregunta y Opciones (SIEMPRE VISIBLE Y CLARA) */}
      <div className="lg:col-span-7">
        {isSpinning ? (
          <div className="rounded-3xl border-3 border-[#3A265E] bg-[#FDFFB6] p-6 text-center">
            <p className="font-display text-3xl font-extrabold uppercase text-[#3A265E]">
              Seleccionando situación adolescente...
            </p>
            <p className="text-sm text-[#2B1D47] mt-1">
              Prepárate para elegir la respuesta más asertiva.
            </p>
          </div>
        ) : questionVisible ? (
          <div className="rounded-3xl border-3 border-[#3A265E] bg-[#FDFFB6] p-5 shadow-[0_6px_0_#3A265E]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="rounded-lg border border-[#3A265E] bg-[#FFAFCC] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#3A265E]">
                Situación {ruletaIndex + 1}/{RULETA_SITUACIONES.length} · {currentSit.tema}
              </span>
              {showModalClose && (
                <button
                  type="button"
                  onClick={onCloseGameModal}
                  className="px-2.5 py-1 rounded-lg border-2 border-[#3A265E] bg-[#CDB4DB] text-xs font-bold cursor-pointer"
                >
                  ✕ Cerrar
                </button>
              )}
            </div>

            {!selectedRuletaOption ? (
              <>
                <h4 className="font-display text-2xl sm:text-3xl font-extrabold text-[#3A265E] mb-2">
                  ¿Qué harías en esta situación?
                </h4>
                <p className="text-sm sm:text-base font-semibold text-[#2B1D47] bg-[#DFD2F2] p-3.5 rounded-2xl border-2 border-[#3A265E] mb-4">
                  {currentSit.situacion}
                </p>
                <div className="space-y-2.5">
                  {currentSit.opciones.map((op, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedRuletaOption(op);
                        onCompleteActivity(
                          "Ruleta de Situaciones",
                          25,
                          currentSit.tema,
                          `${op.esBuena ? "Buena" : "Mala"} decisión (${op.asertividad}).`
                        );
                      }}
                      className="w-full text-left rounded-xl border-2 border-[#3A265E] bg-[#A2D2FF] hover:bg-[#B9FBC0] p-3 text-xs sm:text-sm font-semibold text-[#2B1D47] cursor-pointer transition-colors"
                    >
                      {String.fromCharCode(65 + idx)}. {op.texto}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className="font-display text-2xl sm:text-3xl font-extrabold text-[#3A265E] mb-2">
                  {selectedRuletaOption.esBuena ? "1. Buena decisión" : "1. Decisiones por mejorar"} ·{" "}
                  {selectedRuletaOption.asertividad}
                </h4>
                <div className="space-y-2.5 my-3">
                  <div className="rounded-xl border-2 border-[#3A265E] bg-[#DFD2F2] p-3">
                    <p className="font-bold text-xs uppercase text-[#3A265E]">2. ¿Por qué?</p>
                    <p className="text-sm text-[#2B1D47] mt-1">{selectedRuletaOption.porque}</p>
                  </div>
                  <div className="rounded-xl border-2 border-[#3A265E] bg-[#B9FBC0] p-3">
                    <p className="font-bold text-xs uppercase text-[#3A265E]">3. Consejo práctico</p>
                    <p className="text-sm text-[#2B1D47] mt-1">{selectedRuletaOption.consejo}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => spinWheel(ruletaIndex + 1)}
                    className="pastel-btn bg-[#FFAFCC] text-xs"
                  >
                    Girar de nuevo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRuletaOption(null)}
                    className="pastel-btn bg-[#A2D2FF] text-xs"
                  >
                    Ver otras opciones
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderMapaCorporal = () => (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(EMOTION_COLORS) as BodyEmotion[]).map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => setBrushEmotion(em)}
            className={`px-3 py-1 rounded-lg border-2 border-[#3A265E] text-xs font-bold cursor-pointer ${
              brushEmotion === em ? "ring-2 ring-[#3A265E]" : ""
            }`}
            style={{ backgroundColor: EMOTION_COLORS[em] }}
          >
            Pincel: {em}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <svg viewBox="0 0 240 310" className="w-44 shrink-0 bg-[#C8E2FC] rounded-2xl border-2 border-[#3A265E] p-2">
          <circle
            cx="120"
            cy="46"
            r="28"
            fill={paintedZones.cabeza ? EMOTION_COLORS[paintedZones.cabeza] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("cabeza")}
          />
          <rect
            x="58"
            y="82"
            width="124"
            height="40"
            rx="16"
            fill={paintedZones.hombros ? EMOTION_COLORS[paintedZones.hombros] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("hombros")}
          />
          <rect
            x="74"
            y="130"
            width="92"
            height="52"
            rx="14"
            fill={paintedZones.pecho ? EMOTION_COLORS[paintedZones.pecho] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("pecho")}
          />
          <rect
            x="78"
            y="190"
            width="84"
            height="52"
            rx="14"
            fill={paintedZones.estomago ? EMOTION_COLORS[paintedZones.estomago] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("estomago")}
          />
          <circle
            cx="38"
            cy="166"
            r="18"
            fill={paintedZones.manos ? EMOTION_COLORS[paintedZones.manos] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("manos")}
          />
          <circle
            cx="202"
            cy="166"
            r="18"
            fill={paintedZones.manos ? EMOTION_COLORS[paintedZones.manos] : "#FFE5C4"}
            stroke="#3A265E"
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => handlePaintBodyZone("manos")}
          />
        </svg>
        <div className="rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] p-4 flex-1 text-sm">
          <h4 className="text-xl font-bold text-[#3A265E]">{BODY_ZONES[activeBodyZone].label}</h4>
          <p className="mt-1 text-[#2B1D47]">{BODY_ZONES[activeBodyZone].fisiologia}</p>
          <p className="mt-2 font-bold text-[#3A265E]">{BODY_ZONES[activeBodyZone].ejercicio}</p>
          <button type="button" onClick={startReleaseExercise} className="pastel-btn bg-[#B9FBC0] text-xs mt-3">
            {breathTimer !== null ? `Exhalando: ${breathTimer}s` : "Ejercicio físico (6s)"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderChatSimulado = () => (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-bold text-sm text-[#3A265E] tabular-nums">
          Nivel de confianza de Mateo: {trustScore}%
        </span>
        <button type="button" onClick={resetChat} className="pastel-btn bg-[#FDFFB6] text-xs py-1 px-2.5">
          Reiniciar Chat
        </button>
      </div>
      <div className="rounded-2xl border-2 border-[#3A265E] bg-[#DFD2F2] p-3.5 max-h-60 overflow-y-auto space-y-2.5 mb-3">
        {chatHistory.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[88%] rounded-xl border-2 border-[#3A265E] px-3 py-2 text-xs sm:text-sm ${
              m.sender === "friend" ? "bg-[#FFD6A5] mr-auto" : "bg-[#B9FBC0] ml-auto"
            }`}
          >
            <strong>{m.sender === "friend" ? "Mateo: " : "Tú: "}</strong>
            {m.text}
          </div>
        ))}
      </div>
      {!chatFinished ? (
        <div className="space-y-2">
          {CHAT_SCRIPT[chatStepIdx].options.map((op, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleChatOption(op)}
              className="w-full text-left rounded-xl border-2 border-[#3A265E] bg-[#FFAFCC] hover:bg-[#FDFFB6] px-3 py-2 text-xs font-semibold cursor-pointer"
            >
              {op.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-[#3A265E] bg-[#B9FBC0] p-3 text-xs font-bold">
          <span>Diálogo completado ({trustScore}% de confianza construida).</span>
          <button type="button" onClick={resetChat} className="pastel-btn bg-[#FDFFB6] text-xs py-1 px-2.5">
            Volver a intentar
          </button>
        </div>
      )}
    </div>
  );

  // Contenido completo de la Fila 4 (Tema + 5 Minijuegos) para mostrar dentro del modal de Trapecio 4
  const fila4Interior = (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={() => onOpenGameModal("cards")} className="pastel-btn bg-[#FFD6A5] text-xs sm:text-sm">
          1. Abrir Cards (Mazo e Inspección)
        </button>
        <button type="button" onClick={() => onOpenGameModal("sopa")} className="pastel-btn bg-[#A2D2FF] text-xs sm:text-sm">
          2. Abrir Sopa de Letras
        </button>
        <button type="button" onClick={() => onOpenGameModal("ruleta")} className="pastel-btn bg-[#FFAFCC] text-xs sm:text-sm">
          3. Abrir Ruleta de Decisiones
        </button>
        <button type="button" onClick={() => onOpenGameModal("mapa")} className="pastel-btn bg-[#CDB4DB] text-xs sm:text-sm">
          4. Abrir Mapa Corporal
        </button>
        <button type="button" onClick={() => onOpenGameModal("chat")} className="pastel-btn bg-[#B9FBC0] text-xs sm:text-sm">
          5. Abrir Chat Simulado
        </button>
      </div>

      {/* 6 Tarjetas del tema (sin repetir imágenes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topicItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenGallery(item)}
            className="text-left rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] p-3.5 shadow-[0_4px_0_#3A265E] hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-36 object-cover rounded-xl border-2 border-[#3A265E] mb-2"
            />
            <span className="text-[11px] font-bold uppercase text-[#3A265E]">{item.tag}</span>
            <h4 className="text-xl font-bold text-[#3A265E]">{item.title}</h4>
            <p className="text-xs text-[#2B1D47] mt-1">{item.shortDesc}</p>
          </button>
        ))}
      </div>

      {/* 5 Minijuegos interactivos completos dentro de Fila 4 */}
      <div className="rounded-3xl border-3 border-[#3A265E] bg-[#DFD2F2] p-5">
        <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-3">
          1. Cards Interactivas: Arrastrar, Inspeccionar y Plan Emocional
        </h4>
        {renderCardsToolkit()}
      </div>

      <div className="rounded-3xl border-3 border-[#3A265E] bg-[#C8E2FC] p-5">
        <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-3">
          2. Sopa de Letras de Psicología Adolescente (12×12)
        </h4>
        {renderSopaDeLetras()}
      </div>

      <div className="rounded-3xl border-3 border-[#3A265E] bg-[#FFD6A5] p-5">
        <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-3">
          3. Ruleta de Situaciones y Decisiones
        </h4>
        {renderRuleta(false)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl border-3 border-[#3A265E] bg-[#DFD2F2] p-5">
          <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-3">
            4. Mapa Corporal de las Emociones
          </h4>
          {renderMapaCorporal()}
        </div>

        <div className="rounded-3xl border-3 border-[#3A265E] bg-[#C8E2FC] p-5">
          <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E] mb-3">
            5. Chat Simulado de Toma de Decisiones
          </h4>
          {renderChatSimulado()}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderFila4ContentOnly ? (
        fila4Interior
      ) : (
        /* SECCIÓN DIMENSIONES DEL CAMBIO (.about-band / .columns) */
        <section id="etapas" className="about-band">
          <div className="about-inner">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-center text-[#3A265E] mb-8">
              Dimensiones del Cambio
            </h2>
            <div className="columns">
              {DIMENSIONES_CAMBIO.map((dim) => (
                <article
                  key={dim.titulo}
                  className="rounded-2xl border border-[#A2D2FF] bg-[#C3CEF7] p-7 text-center shadow-sm"
                >
                  <h3 className="text-2xl font-bold uppercase text-[#3A265E] mb-3">
                    {dim.titulo}
                  </h3>
                  <p className="text-sm text-[#2B1D47] leading-relaxed">{dim.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VENTANA MODAL INDIVIDUAL DE CADA JUEGO (100% FUNCIONAL CON BOTÓN CERRAR VISIBLE) */}
      {!renderFila4ContentOnly && activeGameModal && (
        <div className="pastel-modal-overlay">
          <div className="w-full max-w-5xl flex items-center justify-between mb-3">
            <span className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#3A265E]">
              {activeGameModal === "cards" && "1. Cards: Herramientas Emocionales"}
              {activeGameModal === "sopa" && "2. Sopa de Letras Emocional (12×12)"}
              {activeGameModal === "ruleta" && "3. Ruleta de Situaciones y Decisiones"}
              {activeGameModal === "mapa" && "4. Mapa Corporal de las Emociones"}
              {activeGameModal === "chat" && "5. Chat Simulado de Toma de Decisiones"}
            </span>
            <button
              type="button"
              onClick={onCloseGameModal}
              aria-label="Cerrar ventana"
              className="pastel-btn bg-[#FFAFCC] text-xs sm:text-sm py-1.5 px-3"
            >
              <span className="material-icons text-base">close</span>
              Cerrar
            </button>
          </div>

          <div className="w-full max-w-5xl rounded-3xl border-3 border-[#3A265E] bg-[#A2D2FF] p-5 sm:p-6 shadow-xl">
            {activeGameModal === "cards" && renderCardsToolkit()}
            {activeGameModal === "sopa" && renderSopaDeLetras()}
            {activeGameModal === "ruleta" && renderRuleta(true)}
            {activeGameModal === "mapa" && renderMapaCorporal()}
            {activeGameModal === "chat" && renderChatSimulado()}

            <div className="mt-5 pt-4 border-t-2 border-[#3A265E]/25 flex justify-end">
              <button
                type="button"
                onClick={onCloseGameModal}
                className="pastel-btn bg-[#CDB4DB] text-sm"
              >
                ✕ Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE INSPECCIÓN DETALLADA DE FICHA (video_1.mp4 - FONDO DESENFOCADO/OSCURECIDO + BOTÓN × CERRAR) */}
      {inspectedCard && (
        <div
          className="inspection-modal-overlay"
          onClick={() => setInspectedCard(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl border-3 border-[#3A265E] bg-[#DFD2F2] p-6 shadow-2xl relative"
          >
            {/* Cabecera con Etiqueta/Categoría y Botón × Cerrar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <span
                className="rounded-xl border-2 border-[#3A265E] px-3 py-1 text-xs font-extrabold uppercase text-[#3A265E]"
                style={{ backgroundColor: inspectedCard.color }}
              >
                {inspectedCard.categoria}
              </span>
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                aria-label="Cerrar inspección"
                className="rounded-xl border-2 border-[#3A265E] bg-[#FFAFCC] hover:bg-[#FDFFB6] px-3 py-1 text-xs font-extrabold text-[#3A265E] cursor-pointer flex items-center gap-1"
              >
                <span>× Cerrar [X]</span>
              </button>
            </div>

            {/* Imagen ilustrativa a la izquierda + Título y Explicación */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 items-center">
              <div className="sm:col-span-2">
                <img
                  src={inspectedCard.imagen}
                  alt={inspectedCard.titulo}
                  className="w-full h-48 object-cover rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC]"
                />
              </div>
              <div className="sm:col-span-3 space-y-2.5 text-left">
                <h4 className="font-display text-3xl font-extrabold uppercase text-[#3A265E]">
                  {inspectedCard.titulo}
                </h4>
                <p className="text-sm text-[#2B1D47] leading-relaxed font-medium">
                  {inspectedCard.explicacion}
                </p>
              </div>
            </div>

            {/* Nota / recuadro clave inferior */}
            <div className="mt-4 rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] p-3.5 text-left">
              <p className="text-xs font-extrabold uppercase text-[#3A265E]">
                Tip Psicológico Clave (13–18 años)
              </p>
              <p className="text-xs sm:text-sm text-[#2B1D47] mt-1 font-medium">
                {inspectedCard.tipClave}
              </p>
            </div>

            {/* Acciones inferiores */}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              {!placedCards.some((p) => p.id === inspectedCard.id) ? (
                <button
                  type="button"
                  onClick={() => integrateCardToPlan(inspectedCard)}
                  className="pastel-btn bg-[#B9FBC0] text-sm"
                >
                  Integrar a mi Caja de Herramientas →
                </button>
              ) : (
                <span className="rounded-xl border-2 border-[#3A265E] bg-[#B9FBC0] px-3 py-2 text-xs font-bold text-[#3A265E]">
                  ✓ Herramienta ya integrada en tu plan
                </span>
              )}
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="pastel-btn bg-[#FFAFCC] text-sm"
              >
                Regresar al tablero
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
