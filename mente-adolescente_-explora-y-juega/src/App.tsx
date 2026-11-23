import React, { useEffect, useRef, useState } from "react";
import {
  GRID_9_TILES,
  GALLERY_ITEMS,
  GalleryItem
} from "./data/psychData";
import { AuthAndPanelSection, UserSessionData } from "./components/AuthAndPanelSection";
import { GameKey, GamesSection } from "./components/GamesSection";

type Row3WindowKey = "auth" | "tema" | "juegos" | null;

export default function App() {
  const [mobileMenuClosed, setMobileMenuClosed] = useState(true);
  const [screenActive, setScreenActive] = useState(false);
  const [blurActive, setBlurActive] = useState(false);

  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [empathyPoints, setEmpathyPoints] = useState(0);
  const [profileUnlockedOpen, setProfileUnlockedOpen] = useState(false);

  const [sessionData, setSessionData] = useState<UserSessionData | null>(null);

  // Ventanas lanzadas desde la última fila o barra superior
  const [activeRow3Window, setActiveRow3Window] = useState<Row3WindowKey>(null);
  const [activeGameModal, setActiveGameModal] = useState<GameKey | null>(null);
  const [selectedTopicItem, setSelectedTopicItem] = useState<GalleryItem | null>(null);
  // Ventana externa amplia (.details-container) con anterior/siguiente/cerrar para los 9 cuadros
  const [activeDetailsIdx, setActiveDetailsIdx] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const topicItems = GALLERY_ITEMS.filter((g) => g.category === "tema");

  const anyModalOpen =
    activeRow3Window !== null ||
    activeGameModal !== null ||
    activeDetailsIdx !== null ||
    profileUnlockedOpen;

  // Control único de scroll en body
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  // Tecla Escape cierra la ventana activa
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeGameModal !== null) {
        setActiveGameModal(null);
        setBlurActive(false);
      } else if (activeRow3Window !== null) {
        setActiveRow3Window(null);
        setSelectedTopicItem(null);
        setBlurActive(false);
      } else if (activeDetailsIdx !== null) {
        setActiveDetailsIdx(null);
      } else if (profileUnlockedOpen) {
        setProfileUnlockedOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDetailsIdx, activeGameModal, activeRow3Window, profileUnlockedOpen]);

  const triggerScreenTransition = (callback: () => void) => {
    setScreenActive(true);
    setTimeout(() => {
      callback();
    }, 300);
    setTimeout(() => setScreenActive(false), 720);
  };

  const scrollToSection = (targetId: string, openSlideIdx?: number) => {
    setMobileMenuClosed(true);
    triggerScreenTransition(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      if (typeof openSlideIdx === "number") {
        setActiveDetailsIdx(openSlideIdx);
      }
    });
  };

  const openRainbowDetailsModal = (slideIdx: number) => {
    triggerScreenTransition(() => {
      setActiveDetailsIdx(slideIdx);
    });
  };

  const openRow3WindowWithRainbow = (win: Row3WindowKey) => {
    triggerScreenTransition(() => {
      setActiveRow3Window(win);
    });
  };

  const openGameModalWithRainbow = (game: GameKey) => {
    triggerScreenTransition(() => {
      setActiveGameModal(game);
    });
  };

  const handleCompleteActivity = async (
    actividad: string,
    puntos: number,
    emocion: string,
    detalle: string
  ) => {
    let nextCount = completedActivities.length;
    if (!completedActivities.includes(actividad)) {
      const updated = [...completedActivities, actividad];
      setCompletedActivities(updated);
      setEmpathyPoints((p) => p + puntos);
      nextCount = updated.length;
    }

    if (sessionData) {
      try {
        const res = await fetch("/api/resultados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: sessionData.usuario.id,
            actividad,
            puntos_empatia: puntos,
            emocion_trabajada: emocion,
            detalle_resultado: detalle
          })
        });
        const json = await res.json();
        if (json.ok && json.resultado) {
          setSessionData((prev) =>
            prev ? { ...prev, resultados: [json.resultado, ...prev.resultados] } : prev
          );
        }
      } catch {
        // Modo local sin conexión
      }
    }

    if (nextCount >= 5) {
      setProfileUnlockedOpen(true);
    }
  };

  const togglePlayVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMuteVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const progressPct = Math.min(100, Math.round((completedActivities.length / 5) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#B8D8F8] text-[#2B1D47]">
      {/* Cortinilla #screen (0vh -> 150vh -> 0vh) */}
      <div id="screen" className={screenActive ? "screen-active" : ""} />

      {/* Barra Superior Gamificada */}
      <div className="sticky top-0 z-[60] bg-[#3A265E] text-[#FDFFB6] border-b-2 border-[#FFAFCC] px-4 py-1.5 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <span className="tabular-nums">
              Puntos de Empatía / Sabiduría:{" "}
              <strong className="text-[#B9FBC0]">{empathyPoints} pts</strong>
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-36 h-2.5 rounded-full bg-[#2B1D47] border border-[#CDB4DB] overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, #B9FBC0, #FFAFCC, #FDFFB6)"
                  }}
                />
              </div>
              <span className="tabular-nums">{progressPct}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openRainbowDetailsModal(6)}
              className="text-xs font-bold text-[#2B1D47] bg-[#B9FBC0] px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer"
            >
              {sessionData ? `Panel de ${sessionData.usuario.apodo}` : "Registro, Acceso y Certificado"}
            </button>
            <a
              href="/api/download-xampp-zip"
              download="Mente_Adolescente_XAMPP_Completo.zip"
              className="text-xs font-bold text-[#2B1D47] bg-[#FFAFCC] px-2.5 py-1 rounded-lg whitespace-nowrap"
            >
              Descargar .ZIP
            </a>
          </div>
        </div>
      </div>

      {/* ENCABEZADO DIAGONAL */}
      <header className={`diagonal-header no-print ${blurActive ? "blur-rest-page" : ""}`}>
        <div className="diagonal-header-inner">
          <nav className="menu">
            <div className="flex items-center justify-end gap-8 flex-1">
              <a
                href="#inicio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("inicio");
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Inicio
              </a>
              <a
                href="#galeria"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("galeria");
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Galería
              </a>
              <a
                href="#galeria"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("galeria", 0);
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Miedo
              </a>
            </div>

            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("inicio");
              }}
              className="logo-opening shrink-0 mx-4"
              aria-label="Inicio Mente Adolescente"
            >
              <svg width="58" height="58" viewBox="0 0 100 100" fill="none">
                <polygon
                  points="50,6 90,28 90,72 50,94 10,72 10,28"
                  fill="url(#hexGrad)"
                  stroke="#3A265E"
                  strokeWidth="5"
                />
                <circle cx="50" cy="50" r="22" stroke="#3A265E" strokeWidth="4" fill="none" />
                <path
                  d="M40 50L47 57L62 42"
                  stroke="#3A265E"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="hexGrad" x1="10" y1="6" x2="90" y2="94">
                    <stop offset="0%" stopColor="#A2D2FF" />
                    <stop offset="50%" stopColor="#CDB4DB" />
                    <stop offset="100%" stopColor="#FFAFCC" />
                  </linearGradient>
                </defs>
              </svg>
            </a>

            <div className="flex items-center justify-start gap-8 flex-1">
              <a
                href="#galeria"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("galeria", 3);
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Tristeza
              </a>
              <a
                href="#etapas"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("etapas");
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Etapas
              </a>
              <a
                href="#apoyo"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("apoyo");
                }}
                className="font-display text-2xl font-bold uppercase text-[#3A265E] hover:text-[#2B1D47] transition-colors"
              >
                Apoyo
              </a>
            </div>
          </nav>

          {/* Menú Móvil */}
          <div className="menu-mobile">
            <div className="flex items-center justify-between">
              <a href="#inicio" className="logo-opening flex items-center gap-2 text-[#3A265E]">
                <img src="img/logo.svg" alt="Mente Adolescente" className="w-10 h-10" />
                <span className="font-display text-2xl font-extrabold uppercase">Mente Adolescente</span>
              </a>
              <button
                id="button-open-close-menu"
                type="button"
                onClick={() => setMobileMenuClosed((v) => !v)}
                aria-label="Abrir o cerrar menú"
                className="p-2 rounded-lg border-2 border-[#3A265E] bg-[#FFAFCC] text-[#3A265E] hover:bg-[#B9FBC0] transition-colors cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
            <div className={`menu-mobile-items ${mobileMenuClosed ? "menu-mobile-close" : ""}`}>
              <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection("inicio"); }} className="font-display text-xl font-bold text-[#3A265E]">Inicio</a>
              <a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection("galeria"); }} className="font-display text-xl font-bold text-[#3A265E]">Problemáticas y Emociones</a>
              <a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection("galeria", 0); }} className="font-display text-xl font-bold text-[#3A265E]">Miedo (Fila 1)</a>
              <a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection("galeria", 3); }} className="font-display text-xl font-bold text-[#3A265E]">Tristeza (Fila 2)</a>
              <a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection("galeria", 6); }} className="font-display text-xl font-bold text-[#3A265E]">Acceso, Tema y Juegos (Fila 3)</a>
              <a href="#etapas" onClick={(e) => { e.preventDefault(); scrollToSection("etapas"); }} className="font-display text-xl font-bold text-[#3A265E]">Etapas</a>
              <a href="#apoyo" onClick={(e) => { e.preventDefault(); scrollToSection("apoyo"); }} className="font-display text-xl font-bold text-[#3A265E]">Apoyo</a>
            </div>
          </div>
        </div>
      </header>

      <main className={`flex-1 ${blurActive ? "blur-rest-page" : ""}`}>
        {/* 1. SECCIÓN DE VIDEO PRINCIPAL .main-video */}
        <section id="inicio" className="main-video">
          <div className="video">
            <video
              ref={videoRef}
              src="video/Frases_inspiradoras_sobre_un_paisaje_pintado_720p_dc33cc01.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button type="button" onClick={togglePlayVideo} className="pastel-btn bg-[#B9FBC0] text-xs sm:text-sm">
                {isPlaying ? "Pausar video" : "Reproducir video"}
              </button>
              <button type="button" onClick={toggleMuteVideo} className="pastel-btn bg-[#FDFFB6] text-xs sm:text-sm">
                {isMuted ? "Activar sonido" : "Silenciar sonido"}
              </button>
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN INTRODUCTORIA .intro */}
        <section className="intro">
          <div className="intro-inner">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-[#3A265E] mb-4">
              La Adolescencia: Cambios y Emociones
            </h1>
            <p className="text-base md:text-lg text-[#2B1D47] leading-relaxed">
              Una etapa de transformación profunda entre los 13 y 18 años donde el crecimiento personal se encuentra con nuevas emociones, retos académicos y la construcción de vínculos saludables.
            </p>
          </div>
        </section>

        {/* 3. CUADRÍCULA INTERACTIVA 3x3 .grid:
            Al presionar cualquier cuadro abre la ventana externa amplia (.details-container) */}
        <section id="galeria" className="skew-grid-band">
          <div className="skew-grid-header">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-[#3A265E]">
              Problemáticas y Emociones
            </h2>
            <p className="text-sm sm:text-base text-[#2B1D47] max-w-3xl mx-auto mt-2 font-medium">
              Haz clic sobre cualquier cuadro para abrir su ventana externa amplia con imágenes nítidas, información completa y botón de cierre (Fila 1: Miedo · Fila 2: Tristeza · Última Fila: Registro, Tema y 5 Minijuegos).
            </p>
          </div>

          <div className="grid">
            {GRID_9_TILES.map((tile, idx) => (
              <div
                key={tile.id}
                data-id={idx}
                role="button"
                tabIndex={0}
                onClick={() => openRainbowDetailsModal(idx)}
                onKeyDown={(e) => e.key === "Enter" && openRainbowDetailsModal(idx)}
                className="item"
              >
                <img src={tile.src} alt={tile.hoverTitle} />
                <div className="bg-hover">
                  <div className="info">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFB6]">
                      {tile.hoverTitle}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-[#B9FBC0] mt-1">
                      {tile.hoverTag}
                    </p>
                    <span className="inline-block mt-3 rounded-lg border border-[#FDFFB6] bg-[#3A265E] px-3.5 py-1 text-xs font-bold text-[#FDFFB6]">
                      Abrir ventana grande (← → ✕)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DIMENSIONES DEL CAMBIO (.about-band) + MODALES DE JUEGOS */}
        <GamesSection
          onCompleteActivity={handleCompleteActivity}
          onBlurChange={setBlurActive}
          onOpenGallery={(item) => {
            setSelectedTopicItem(item);
            setActiveRow3Window("tema");
          }}
          activeGameModal={activeGameModal}
          onOpenGameModal={(g) => setActiveGameModal(g)}
          onCloseGameModal={() => {
            setBlurActive(false);
            setActiveGameModal(null);
          }}
        />

        {/* 5. SECCIÓN CONTACTO / ORIENTACIÓN (.contact-band) */}
        <section id="apoyo" className="contact-band">
          <div className="contact-inner text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-[#FFAFCC] mb-10">
              Orientación y Acompañamiento
            </h2>
            <div className="columns text-center">
              <div>
                <h3 className="text-2xl font-bold uppercase text-[#FDFFB6] mb-2">
                  Espacios Seguros
                </h3>
                <p className="text-sm text-[#B8D8F8]">Departamento de Orientación Educativa</p>
                <p className="text-sm text-[#B8D8F8]">Tutoría y Bienestar Estudiantil</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase text-[#FDFFB6] mb-3">
                  Comunidad
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToSection("galeria", 0)}
                    aria-label="Ver Miedo en la ventana grande"
                    className="w-9 h-9 rounded-full bg-[#CDB4DB] hover:bg-[#B9FBC0] text-[#2B1D47] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-lg">psychology</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("galeria", 3)}
                    aria-label="Ver Tristeza en la ventana grande"
                    className="w-9 h-9 rounded-full bg-[#A2D2FF] hover:bg-[#FFAFCC] text-[#2B1D47] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-lg">favorite</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("inicio")}
                    aria-label="Volver al inicio"
                    className="w-9 h-9 rounded-full bg-[#FFAFCC] hover:bg-[#FDFFB6] text-[#2B1D47] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-lg">home</span>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase text-[#FDFFB6] mb-2">
                  Contacto Escolar
                </h3>
                <p className="text-sm text-[#B8D8F8]">orientacion@mente-adolescente.edu</p>
                <p className="text-sm text-[#B8D8F8]">apoyo.emocional@mente-adolescente.edu</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CIERRE FOOTER MENTA SIN HUECOS */}
      <footer className="footer-corner no-print">
        <p className="font-display text-2xl font-extrabold uppercase text-[#2B1D47]">
          Mente Adolescente: Explora y Juega
        </p>
        <p className="text-sm text-[#3A265E] mt-1">
          Psicología en la Adolescencia (13–18 años) · Paquete completo PHP + MySQL para XAMPP
        </p>
        <div className="mt-4">
          <a
            href="/api/download-xampp-zip"
            download="Mente_Adolescente_XAMPP_Completo.zip"
            className="pastel-btn bg-[#FFAFCC] text-sm"
          >
            Descargar paquete completo en .ZIP (PHP + MySQL + Media)
          </a>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* VENTANAS ABIERTAS DESDE LA ÚLTIMA FILA DE LA CUADRÍCULA                */}
      {/* ===================================================================== */}
      {activeRow3Window && (
        <div className="pastel-modal-overlay">
          <div className="w-full max-w-6xl flex items-center justify-between mb-3">
            <span className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#3A265E]">
              {activeRow3Window === "auth" && "Registro, Acceso y Certificado (BD 1 y BD 2)"}
              {activeRow3Window === "tema" && "Explora el Tema · Psicología en la Adolescencia"}
              {activeRow3Window === "juegos" && "Explora el Tema y los 5 Minijuegos Interactivos"}
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveRow3Window(null);
                setSelectedTopicItem(null);
                setBlurActive(false);
              }}
              aria-label="Cerrar ventana"
              className="pastel-btn bg-[#FFAFCC] text-xs sm:text-sm py-1.5 px-3"
            >
              <span className="material-icons text-base">close</span>
              Cerrar
            </button>
          </div>

          <div
            className="w-full max-w-6xl rounded-3xl border-3 border-[#3A265E] p-5 sm:p-7 shadow-xl"
            style={{
              background:
                activeRow3Window === "auth"
                  ? "linear-gradient(135deg, #FFD6A5, #FDFFB6)"
                  : activeRow3Window === "tema"
                  ? "linear-gradient(135deg, #A2D2FF, #CDB4DB)"
                  : "linear-gradient(135deg, #B9FBC0, #DFD2F2)"
            }}
          >
            {activeRow3Window === "auth" && (
              <AuthAndPanelSection
                sessionData={sessionData}
                onLoginSuccess={(data) => setSessionData(data)}
                onLogout={() => setSessionData(null)}
                onCloseParentModal={() => setActiveRow3Window(null)}
              />
            )}

            {activeRow3Window === "tema" && (
              <div className="space-y-5">
                {selectedTopicItem && (
                  <div className="rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] p-5 flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={selectedTopicItem.src}
                      alt={selectedTopicItem.title}
                      className="w-40 h-36 object-cover rounded-xl border-2 border-[#3A265E] shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <span className="text-xs font-extrabold uppercase text-[#3A265E]">
                        {selectedTopicItem.tag}
                      </span>
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">
                        {selectedTopicItem.title}
                      </h4>
                      <p className="text-sm text-[#2B1D47] mt-1">{selectedTopicItem.fullDesc}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topicItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTopicItem(item)}
                      className="text-left rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] hover:bg-[#DFD2F2] p-4 shadow-[0_4px_0_#3A265E] transition-colors cursor-pointer"
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
              </div>
            )}

            {activeRow3Window === "juegos" && (
              <GamesSection
                renderFila4ContentOnly
                onCompleteActivity={handleCompleteActivity}
                onBlurChange={setBlurActive}
                onOpenGallery={(item) => {
                  setSelectedTopicItem(item);
                  setActiveRow3Window("tema");
                }}
                activeGameModal={activeGameModal}
                onOpenGameModal={(g) => setActiveGameModal(g)}
                onCloseGameModal={() => {
                  setBlurActive(false);
                  setActiveGameModal(null);
                }}
              />
            )}

            <div className="mt-6 pt-4 border-t-2 border-[#3A265E]/25 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveRow3Window(null);
                  setSelectedTopicItem(null);
                  setBlurActive(false);
                }}
                className="pastel-btn bg-[#FFAFCC]"
              >
                ✕ Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VENTANA EXTERNA AMPLIA DE CADA CUADRO (.details-container estilo imagen) */}
      {activeDetailsIdx !== null && GRID_9_TILES[activeDetailsIdx] && (() => {
        const activeTile = GRID_9_TILES[activeDetailsIdx];
        return (
          <div className="details-container">
            <div className="nav-bar">
              <div className="flex items-center justify-start">
                <span className="rounded-lg border-2 border-[#3A265E] bg-[#FDFFB6] px-3 py-1 font-display text-base sm:text-lg font-extrabold uppercase text-[#3A265E]">
                  {String(activeDetailsIdx + 1).padStart(2, "0")} / {String(GRID_9_TILES.length).padStart(2, "0")} · {activeTile.hoverTag}
                </span>
              </div>

              <div className="flex items-center justify-center gap-8">
                <button
                  type="button"
                  id="prev-button"
                  disabled={activeDetailsIdx <= 0}
                  onClick={() => setActiveDetailsIdx((i) => (i !== null && i > 0 ? i - 1 : 0))}
                  aria-label="Anterior"
                  className="p-2 rounded-full text-[#3A265E] hover:bg-[#A2D2FF]/60 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  <span className="material-icons text-4xl">chevron_left</span>
                </button>
                <button
                  type="button"
                  id="next-button"
                  disabled={activeDetailsIdx >= GRID_9_TILES.length - 1}
                  onClick={() =>
                    setActiveDetailsIdx((i) =>
                      i !== null && i < GRID_9_TILES.length - 1 ? i + 1 : i
                    )
                  }
                  aria-label="Siguiente"
                  className="p-2 rounded-full text-[#3A265E] hover:bg-[#B9FBC0]/60 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  <span className="material-icons text-4xl">chevron_right</span>
                </button>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  id="close-button"
                  onClick={() =>
                    triggerScreenTransition(() => {
                      setActiveDetailsIdx(null);
                    })
                  }
                  aria-label="Cerrar ventana"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#3A265E] bg-[#FFAFCC] hover:bg-[#FDFFB6] px-4 py-2 text-sm font-extrabold text-[#3A265E] shadow-[0_3px_0_#3A265E] cursor-pointer"
                >
                  <span className="material-icons text-xl">close</span>
                  <span>Cerrar</span>
                </button>
              </div>
            </div>

            <div className="w-full max-w-5xl rounded-2xl border-2 border-[#FFAFCC] bg-[#A2D2FF]/92 p-6 sm:p-10 text-center shadow-2xl">
              <img
                src={activeTile.src}
                alt={activeTile.overlayHeading}
                className="w-full h-72 sm:h-[420px] object-cover rounded-xl border-2 border-[#FFAFCC] bg-[#B8D8F8] mb-6"
              />
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-[#3A265E]">
                {String(activeDetailsIdx + 1).padStart(2, "0")}. {activeTile.overlayHeading}
              </h3>

              {/* Fila 1 (Miedo) y Fila 2 (Tristeza) con tarjetas amplias e imágenes complementarias */}
              {(activeTile.type === "miedo" || activeTile.type === "tristeza") && activeTile.sections && (
                <div className="mt-6 space-y-5 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeTile.sections.map((sec) => (
                      <div
                        key={sec.label}
                        className="rounded-2xl border-2 border-[#3A265E] bg-[#DFD2F2] p-4 shadow-sm"
                      >
                        <p className="text-sm font-extrabold uppercase text-[#3A265E]">{sec.label}</p>
                        <p className="text-sm sm:text-base text-[#2B1D47] mt-1.5 leading-relaxed">{sec.text}</p>
                      </div>
                    ))}
                  </div>

                  {activeDetailsIdx === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] p-4 flex items-center gap-4">
                        <img src="img/3.png" alt="Señales físicas del miedo" className="w-24 h-24 object-cover rounded-xl border-2 border-[#3A265E] shrink-0" />
                        <div>
                          <h4 className="font-display text-xl font-extrabold text-[#3A265E]">Señales Físicas (3.png)</h4>
                          <p className="text-sm text-[#2B1D47] mt-1">Tensión en manos, mandíbula o estómago avisan que necesitas respirar lento.</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] p-4 flex items-center gap-4">
                        <img src="img/4.svg" alt="Miedo al error escolar" className="w-24 h-24 object-cover rounded-xl border-2 border-[#3A265E] shrink-0" />
                        <div>
                          <h4 className="font-display text-xl font-extrabold text-[#3A265E]">Miedo al Error (4.svg)</h4>
                          <p className="text-sm text-[#2B1D47] mt-1">Equivocarse frente al grupo es parte natural del aprendizaje, nunca una derrota.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailsIdx === 5 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] p-4 flex items-center gap-4">
                        <img src="img/7.png" alt="Desánimo prolongado" className="w-24 h-24 object-cover rounded-xl border-2 border-[#3A265E] shrink-0" />
                        <div>
                          <h4 className="font-display text-xl font-extrabold text-[#3A265E]">Cuándo Pedir Ayuda (7.png)</h4>
                          <p className="text-sm text-[#2B1D47] mt-1">Si el desánimo dura semanas o afecta tu sueño, acudir con orientación es valentía.</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border-2 border-[#3A265E] bg-[#B9FBC0] p-4 flex items-center gap-4">
                        <img src="img/8.svg" alt="Acompañamiento y esperanza" className="w-24 h-24 object-cover rounded-xl border-2 border-[#3A265E] shrink-0" />
                        <div>
                          <h4 className="font-display text-xl font-extrabold text-[#3A265E]">Acompañamiento y Esperanza (8.svg)</h4>
                          <p className="text-sm text-[#2B1D47] mt-1">Compartir lo que sientes con una red segura vuelve más ligero el peso emocional.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cuadro 7: Registro, Acceso y Certificado completo en ventana amplia */}
              {activeTile.type === "window-auth" && (
                <div className="mt-6 text-left">
                  <AuthAndPanelSection
                    sessionData={sessionData}
                    onLoginSuccess={(data) => setSessionData(data)}
                    onLogout={() => setSessionData(null)}
                    onCloseParentModal={() => setActiveDetailsIdx(null)}
                  />
                </div>
              )}

              {/* Cuadro 8: Explora el Tema completo en 6 tarjetas grandes */}
              {activeTile.type === "window-tema" && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                  {topicItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#DFD2F2] p-4 shadow-[0_4px_0_#3A265E]"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-44 object-cover rounded-xl border-2 border-[#3A265E] mb-3"
                      />
                      <span className="inline-block rounded bg-[#FDFFB6] border border-[#3A265E] px-2 py-0.5 text-[11px] font-extrabold uppercase text-[#3A265E]">
                        {item.tag}
                      </span>
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E] mt-1.5">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#2B1D47] mt-1 leading-relaxed">{item.fullDesc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cuadro 9: Los 5 Minijuegos Interactivos en ventana amplia */}
              {activeTile.type === "window-juegos" && (
                <div className="mt-6 space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => openGameModalWithRainbow("cards")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#FFD6A5] hover:bg-[#FDFFB6] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">1. Cards de Herramientas</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">Mazo interactivo apilado, inspección detallada, arrastrar y soltar al plan.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openGameModalWithRainbow("sopa")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] hover:bg-[#FDFFB6] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">2. Sopa de Letras (12×12)</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">10 palabras clave en horizontal, vertical y diagonal con selección táctil.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openGameModalWithRainbow("ruleta")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#FFAFCC] hover:bg-[#FDFFB6] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">3. Ruleta de Decisiones</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">Gira la ruleta y responde dilemas adolescentes con retroalimentación.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openGameModalWithRainbow("mapa")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#CDB4DB] hover:bg-[#FDFFB6] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">4. Mapa Corporal</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">Explora en qué zonas del cuerpo se manifiestan las emociones y ejercicios.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openGameModalWithRainbow("chat")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#B9FBC0] hover:bg-[#FDFFB6] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">5. Chat Simulado</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">Practica escucha empática y búsqueda de apoyo seguro con una amistad.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openRow3WindowWithRainbow("juegos")}
                      className="rounded-2xl border-2 border-[#3A265E] bg-[#FDFFB6] hover:bg-[#FFAFCC] p-5 text-left shadow-[0_4px_0_#3A265E] cursor-pointer transition-colors"
                    >
                      <h4 className="font-display text-2xl font-extrabold text-[#3A265E]">Abrir los 5 Juegos juntos →</h4>
                      <p className="text-sm text-[#2B1D47] mt-1">Explora y juega los cinco minijuegos en una sola ventana continua.</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-7 pt-4 border-t-2 border-[#3A265E]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    triggerScreenTransition(() => {
                      setActiveDetailsIdx(null);
                    })
                  }
                  className="pastel-btn bg-[#FFAFCC]"
                >
                  ✕ Cerrar ventana grande
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL PERFIL PSICOLÓGICO DESBLOQUEADO */}
      {profileUnlockedOpen && (
        <div className="pastel-modal-overlay justify-center">
          <div className="w-full max-w-lg rounded-3xl border-3 border-[#3A265E] bg-[#B9FBC0] p-7 text-center shadow-xl">
            <h3 className="text-4xl font-extrabold uppercase text-[#3A265E]">
              ¡Perfil Psicológico Desbloqueado!
            </h3>
            <p className="text-[#2B1D47] font-medium mt-3">
              Completaste las 5 dinámicas emocionales y acumulaste{" "}
              <strong className="tabular-nums">{empathyPoints} puntos de Empatía / Sabiduría</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setProfileUnlockedOpen(false);
                  openRow3WindowWithRainbow("auth");
                }}
                className="pastel-btn bg-[#FDFFB6]"
              >
                Ir a Seguimiento / Certificado
              </button>
              <button
                type="button"
                onClick={() => setProfileUnlockedOpen(false)}
                className="pastel-btn bg-[#FFAFCC]"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
