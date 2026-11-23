import React, { useState } from "react";
import { FRASES_MOTIVACIONALES } from "../data/psychData";
import { downloadCertificatePdf, downloadEmotionTablePdf } from "../utils/offlinePdf";

export interface UserSessionData {
  usuario: {
    id: number;
    nombre_completo: string;
    apodo: string;
    edad: number;
    correo: string;
    emocion_frecuente: string;
  };
  plan: {
    emocion_a_trabajar: string;
    situacion_resolver: string;
    estrategia_1: string;
    estrategia_2: string;
    estrategia_3: string;
    como_ser_feliz: string;
    frase_motivacional: string;
    codigo_certificado: string;
  };
  resultados: {
    id: number;
    actividad: string;
    puntos_empatia: number;
    emocion_trabajada: string;
    detalle_resultado: string;
    fecha_registro: string;
  }[];
}

interface AuthAndPanelSectionProps {
  sessionData: UserSessionData | null;
  onLoginSuccess: (data: UserSessionData) => void;
  onLogout: () => void;
  onCloseParentModal?: () => void;
}

export const AuthAndPanelSection: React.FC<AuthAndPanelSectionProps> = ({
  sessionData,
  onLoginSuccess,
  onLogout,
  onCloseParentModal
}) => {
  const [regForm, setRegForm] = useState({
    nombre_completo: "",
    apodo: "",
    edad: 15,
    correo: "",
    password: "",
    emocion_frecuente: "Miedo",
    situacion_actual: ""
  });
  const [regStatus, setRegStatus] = useState<{ ok?: boolean; msg?: string }>({});
  const [regLoading, setRegLoading] = useState(false);

  const [loginCorreo, setLoginCorreo] = useState("sofia@mente.edu");
  const [loginPassword, setLoginPassword] = useState("123456");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [showBigCard, setShowBigCard] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const [activeSubView, setActiveSubView] = useState<"main" | "panel" | "certificado">("main");
  const [pdfNotice, setPdfNotice] = useState("");

  const rotateRandomQuote = () => {
    setQuoteIdx((prev) => {
      let next = Math.floor(Math.random() * FRASES_MOTIVACIONALES.length);
      if (next === prev) next = (prev + 1) % FRASES_MOTIVACIONALES.length;
      return next;
    });
    setShowBigCard(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegStatus({});
    try {
      const res = await fetch("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm)
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("STATIC_MODE");
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setRegStatus({ ok: false, msg: json.error || "Error al guardar el registro." });
      } else {
        setRegStatus({ ok: true, msg: json.mensaje });
        setLoginCorreo(regForm.correo);
        setLoginPassword(regForm.password);
      }
    } catch {
      try {
        const key = "mente_adolescente_local_users";
        const users = JSON.parse(localStorage.getItem(key) || "[]");
        const nextId = users.length + 2;
        const nuevo = {
          usuario: {
            id: nextId,
            nombre_completo: regForm.nombre_completo,
            apodo: regForm.apodo,
            edad: regForm.edad,
            correo: regForm.correo.toLowerCase(),
            emocion_frecuente: regForm.emocion_frecuente,
            password: regForm.password
          },
          plan: {
            emocion_a_trabajar: regForm.emocion_frecuente,
            situacion_resolver: regForm.situacion_actual,
            estrategia_1: "Respiración 4-7-8 para calmar la activación física.",
            estrategia_2: "Anclaje 5-4-3-2-1 para volver al momento presente.",
            estrategia_3: "Conversar con tu red de apoyo confiable.",
            como_ser_feliz: "Avanzar a tu propio ritmo celebrando cada paso y cuidando tus límites.",
            frase_motivacional: "Sé tú, sin pedir permiso. Tu bienestar emocional es prioridad.",
            codigo_certificado: `MA-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`
          },
          resultados: []
        };
        users.push(nuevo);
        localStorage.setItem(key, JSON.stringify(users));
        setRegStatus({ ok: true, msg: `¡Registro guardado en modo local para ${regForm.apodo}!` });
        setLoginCorreo(regForm.correo);
        setLoginPassword(regForm.password);
      } catch {
        setRegStatus({ ok: false, msg: "No se pudo guardar el registro en este navegador." });
      }
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: loginCorreo, password: loginPassword })
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("STATIC_MODE");
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setLoginError(json.error || "Credenciales incorrectas.");
      } else {
        onLoginSuccess(json);
        setActiveSubView("panel");
      }
    } catch {
      const correoLower = loginCorreo.trim().toLowerCase();
      if (correoLower === "sofia@mente.edu" && loginPassword === "123456") {
        onLoginSuccess({
          usuario: {
            id: 1,
            nombre_completo: "Sofía Valentina Morales",
            apodo: "Sofi",
            edad: 16,
            correo: "sofia@mente.edu",
            emocion_frecuente: "Miedo"
          },
          plan: {
            emocion_a_trabajar: "Miedo",
            situacion_resolver: "Superar el temor al juicio social cuando expresas tus ideas en clase o con amigos.",
            estrategia_1: "Respiración 4-4-6 antes de hablar para calmar el sistema nervioso.",
            estrategia_2: "Divide el reto en pasos pequeños: primero habla con un amigo cercano.",
            estrategia_3: "Cambia el 'qué dirán' por 'qué quiero aportar hoy'.",
            como_ser_feliz: "La felicidad en la adolescencia nace cuando te permites equivocarte sin castigarte.",
            frase_motivacional: "Sé tú, sin pedir permiso. Tu voz importa incluso cuando tiembla.",
            codigo_certificado: "MA-2026-0001"
          },
          resultados: [
            {
              id: 1,
              actividad: "Sopa de Letras",
              puntos_empatia: 25,
              emocion_trabajada: "Miedo",
              detalle_resultado: "Completó las palabras clave de regulación emocional en 100%.",
              fecha_registro: new Date().toISOString()
            }
          ]
        });
        setActiveSubView("panel");
      } else {
        const users = JSON.parse(localStorage.getItem("mente_adolescente_local_users") || "[]");
        const found = users.find(
          (u: { usuario: { correo: string; password: string } }) =>
            u.usuario.correo === correoLower && u.usuario.password === loginPassword
        );
        if (found) {
          onLoginSuccess(found);
          setActiveSubView("panel");
        } else {
          setLoginError("Credenciales incorrectas o cuenta no registrada en modo local (usa sofia@mente.edu / 123456).");
        }
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const emotionIllustrationSrc =
    sessionData?.plan.emocion_a_trabajar.toLowerCase() === "tristeza"
      ? "img/tristeza.png"
      : sessionData?.plan.emocion_a_trabajar.toLowerCase() === "miedo"
      ? "img/miedo.png"
      : "img/8.svg";

  return (
    <div className="space-y-6">
      {/* Navegación rápida dentro de la Fila 3 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveSubView("main")}
          className={`pastel-btn text-xs sm:text-sm ${
            activeSubView === "main" ? "bg-[#B9FBC0]" : "bg-[#DFD2F2]"
          }`}
        >
          Formularios BD 1 y BD 2
        </button>
        {sessionData && (
          <>
            <button
              type="button"
              onClick={() => setActiveSubView("panel")}
              className={`pastel-btn text-xs sm:text-sm ${
                activeSubView === "panel" ? "bg-[#A2D2FF]" : "bg-[#C8E2FC]"
              }`}
            >
              Panel de Seguimiento ({sessionData.usuario.apodo})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("certificado")}
              className={`pastel-btn text-xs sm:text-sm ${
                activeSubView === "certificado" ? "bg-[#FDFFB6]" : "bg-[#FFAFCC]"
              }`}
            >
              Certificado Personalizado
            </button>
          </>
        )}
      </div>

      {activeSubView === "main" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Base de Datos 1: Registro */}
            <div className="rounded-2xl border-2 border-[#3A265E] bg-[#DFD2F2] p-5 shadow-sm">
              <h3 className="text-2xl font-bold uppercase text-[#3A265E] mb-1">
                Base de Datos 1 · db_registro_adolescente
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1D47] mb-4">
                Guarda tus datos y la emoción a trabajar en <code>registrar.php</code>.
              </p>

              {regStatus.msg && (
                <div
                  className={`rounded-xl border-2 border-[#3A265E] p-3 mb-4 font-semibold text-sm ${
                    regStatus.ok ? "bg-[#B9FBC0]" : "bg-[#FFAFCC]"
                  }`}
                >
                  <p>{regStatus.msg}</p>
                  {regStatus.ok && (
                    <button
                      type="button"
                      onClick={() => {
                        rotateRandomQuote();
                        onCloseParentModal?.();
                      }}
                      className="pastel-btn bg-[#FDFFB6] text-xs mt-2"
                    >
                      Regresar a la pantalla principal
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  type="text"
                  required
                  value={regForm.nombre_completo}
                  onChange={(e) => setRegForm({ ...regForm, nombre_completo: e.target.value })}
                  placeholder="Nombre completo (Ej. Camila Hernández)"
                  className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={regForm.apodo}
                    onChange={(e) => setRegForm({ ...regForm, apodo: e.target.value })}
                    placeholder="Apodo"
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                  />
                  <input
                    type="number"
                    min={13}
                    max={18}
                    required
                    value={regForm.edad}
                    onChange={(e) => setRegForm({ ...regForm, edad: Number(e.target.value) })}
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                  />
                </div>
                <input
                  type="email"
                  required
                  value={regForm.correo}
                  onChange={(e) => setRegForm({ ...regForm, correo: e.target.value })}
                  placeholder="Correo electrónico"
                  className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    minLength={4}
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Contraseña"
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                  />
                  <select
                    value={regForm.emocion_frecuente}
                    onChange={(e) => setRegForm({ ...regForm, emocion_frecuente: e.target.value })}
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-semibold"
                  >
                    <option value="Miedo">Miedo</option>
                    <option value="Tristeza">Tristeza</option>
                    <option value="Ansiedad">Ansiedad</option>
                    <option value="Enojo">Enojo</option>
                    <option value="Inseguridad">Inseguridad</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  value={regForm.situacion_actual}
                  onChange={(e) => setRegForm({ ...regForm, situacion_actual: e.target.value })}
                  placeholder="Describe brevemente la situación emocional que quieres trabajar..."
                  className="w-full rounded-xl border-2 border-[#3A265E] bg-[#C8E2FC] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                />
                <button type="submit" disabled={regLoading} className="pastel-btn bg-[#B9FBC0] w-full text-sm">
                  {regLoading ? "Guardando..." : "Registrar en db_registro_adolescente"}
                </button>
              </form>
            </div>

            {/* Base de Datos 2: Inicio de Sesión */}
            <div className="rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] p-5 shadow-sm">
              <h3 className="text-2xl font-bold uppercase text-[#3A265E] mb-1">
                Base de Datos 2 · db_seguimiento_emocional
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1D47] mb-4">
                Inicia sesión para consultar tu seguimiento, ilustración guía y certificado personalizado.
              </p>

              {loginError && (
                <div className="rounded-xl border-2 border-[#3A265E] bg-[#FFAFCC] p-3 mb-4 font-semibold text-sm">
                  {loginError}
                </div>
              )}

              {!sessionData ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={loginCorreo}
                    onChange={(e) => setLoginCorreo(e.target.value)}
                    placeholder="Correo registrado"
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#DFD2F2] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                  />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full rounded-xl border-2 border-[#3A265E] bg-[#DFD2F2] px-3 py-2 text-sm text-[#2B1D47] font-medium"
                  />
                  <p className="text-xs text-[#2B1D47]">
                    Demo incluido: <strong>sofia@mente.edu</strong> / clave <strong>123456</strong>
                  </p>
                  <button type="submit" disabled={loginLoading} className="pastel-btn bg-[#FFAFCC] w-full text-sm">
                    {loginLoading ? "Entrando..." : "Iniciar sesión y abrir mi panel"}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border-2 border-[#3A265E] bg-[#B9FBC0] p-4 space-y-3">
                  <p className="font-bold text-[#3A265E] text-base">
                    Sesión activa: {sessionData.usuario.nombre_completo} ({sessionData.usuario.edad} años)
                  </p>
                  <p className="text-sm text-[#2B1D47]">
                    Emoción a trabajar: <strong>{sessionData.plan.emocion_a_trabajar}</strong> · Resultados:{" "}
                    <strong className="tabular-nums">{sessionData.resultados.length}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSubView("panel")}
                      className="pastel-btn bg-[#A2D2FF] text-xs"
                    >
                      Ver Panel de Seguimiento
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubView("certificado")}
                      className="pastel-btn bg-[#FDFFB6] text-xs"
                    >
                      Ver Certificado
                    </button>
                    <button type="button" onClick={onLogout} className="pastel-btn bg-[#FFAFCC] text-xs">
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Motivacional Grande */}
          <div
            className={`rounded-3xl border-3 border-[#3A265E] p-6 text-center transition-all ${
              showBigCard ? "ring-4 ring-[#B9FBC0]" : ""
            }`}
            style={{ background: "linear-gradient(135deg, var(--pastel-pink), var(--pastel-mint))" }}
          >
            <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#3A265E] mb-2">
              Card Motivacional para Ti
            </h4>
            <p className="text-lg sm:text-xl font-bold text-[#2B1D47] max-w-3xl mx-auto">
              “{FRASES_MOTIVACIONALES[quoteIdx]}”
            </p>
            <div className="mt-4">
              <button type="button" onClick={rotateRandomQuote} className="pastel-btn bg-[#FDFFB6] text-xs sm:text-sm">
                Mostrar otra frase motivacional aleatoria
              </button>
            </div>
          </div>
        </>
      )}

      {activeSubView === "panel" && sessionData && (
        <div className="space-y-5 rounded-2xl border-2 border-[#3A265E] bg-[#C8E2FC] p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-2xl font-bold uppercase text-[#3A265E]">
                Situación a resolver · Emoción: {sessionData.plan.emocion_a_trabajar}
              </h4>
              <p className="rounded-xl border-2 border-[#3A265E] bg-[#DFD2F2] p-3 text-sm font-medium">
                {sessionData.plan.situacion_resolver}
              </p>
              <ul className="space-y-1.5 text-sm font-semibold">
                <li className="rounded-lg bg-[#FDFFB6] border border-[#3A265E] px-3 py-2">
                  1. {sessionData.plan.estrategia_1}
                </li>
                <li className="rounded-lg bg-[#FDFFB6] border border-[#3A265E] px-3 py-2">
                  2. {sessionData.plan.estrategia_2}
                </li>
                <li className="rounded-lg bg-[#FDFFB6] border border-[#3A265E] px-3 py-2">
                  3. {sessionData.plan.estrategia_3}
                </li>
              </ul>
              <div className="rounded-xl border-2 border-[#3A265E] bg-[#B9FBC0] p-3 text-sm">
                <strong>Cómo puedes ser feliz:</strong> {sessionData.plan.como_ser_feliz}
              </div>
              <blockquote className="rounded-xl border-2 border-[#3A265E] bg-[#FFAFCC] p-3 text-sm font-bold">
                “{sessionData.plan.frase_motivacional}”
              </blockquote>
            </div>
            <div className="rounded-2xl border-2 border-[#3A265E] bg-[#DFD2F2] p-3 text-center">
              <img
                src={emotionIllustrationSrc}
                alt={sessionData.plan.emocion_a_trabajar}
                className="w-full h-44 object-cover rounded-xl border-2 border-[#3A265E] mb-2"
              />
              <p className="text-xs font-bold">Ilustración de {sessionData.plan.emocion_a_trabajar}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-display text-2xl font-extrabold uppercase text-[#3A265E]">
              Tabla de Resultados y Seguimiento Emocional
            </h4>
            <button
              type="button"
              onClick={() => {
                downloadEmotionTablePdf(sessionData);
                setPdfNotice("Tabla emocional guardada directamente en formato PDF.");
              }}
              className="pastel-btn bg-[#B9FBC0] text-xs sm:text-sm"
            >
              Guardar Tabla Emocional en PDF
            </button>
          </div>
          {pdfNotice && (
            <p className="rounded-xl border-2 border-[#3A265E] bg-[#FDFFB6] px-3 py-2 text-xs font-bold text-[#3A265E]">
              {pdfNotice}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FFD6A5] text-[#3A265E]">
                  <th className="border-2 border-[#3A265E] p-2 text-left">Actividad</th>
                  <th className="border-2 border-[#3A265E] p-2 text-left">Emoción</th>
                  <th className="border-2 border-[#3A265E] p-2 text-left">Puntos</th>
                  <th className="border-2 border-[#3A265E] p-2 text-left">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.resultados.map((r) => (
                  <tr key={r.id} className="bg-[#DFD2F2]">
                    <td className="border-2 border-[#3A265E] p-2 font-bold">{r.actividad}</td>
                    <td className="border-2 border-[#3A265E] p-2">{r.emocion_trabajada}</td>
                    <td className="border-2 border-[#3A265E] p-2 tabular-nums">+{r.puntos_empatia}</td>
                    <td className="border-2 border-[#3A265E] p-2">{r.detalle_resultado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubView === "certificado" && sessionData && (
        <div className="rounded-3xl border-[6px] border-double border-[#3A265E] bg-[#FDFFB6] p-7 text-center">
          <img src="img/logo.svg" alt="Emblema" className="w-16 h-16 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#3A265E]">Mente Adolescente: Explora y Juega</p>
          <h4 className="text-4xl font-extrabold uppercase text-[#3A265E] mt-1">
            Certificado Personalizado de Sabiduría Emocional
          </h4>
          <p className="text-sm mt-3">Se otorga el presente reconocimiento a:</p>
          <p className="font-display text-5xl font-extrabold text-[#3A265E] my-2">
            {sessionData.usuario.nombre_completo}
          </p>
          <p className="max-w-xl mx-auto font-medium">
            Por explorar y fortalecer la regulación de la emoción{" "}
            <strong>{sessionData.plan.emocion_a_trabajar}</strong> con estrategias saludables de empatía y autocuidado.
          </p>
          <div className="max-w-lg mx-auto mt-4 rounded-2xl border-2 border-[#3A265E] bg-[#FFAFCC] p-3 font-bold">
            “{sessionData.plan.frase_motivacional}”
          </div>
          <div className="flex flex-wrap justify-between max-w-lg mx-auto mt-5 text-sm font-bold text-[#3A265E]">
            <span>Folio: {sessionData.plan.codigo_certificado}</span>
            <span>Fecha: {new Date().toLocaleDateString("es-MX")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => {
                downloadCertificatePdf(sessionData);
                setPdfNotice("Certificado y tabla emocional descargados en PDF.");
              }}
              className="pastel-btn bg-[#B9FBC0]"
            >
              Guardar Certificado en PDF
            </button>
            <button
              type="button"
              onClick={() => {
                downloadEmotionTablePdf(sessionData);
                setPdfNotice("Tabla de la emoción descargada en PDF.");
              }}
              className="pastel-btn bg-[#A2D2FF]"
            >
              Guardar Tabla Emocional en PDF
            </button>
          </div>
          {pdfNotice && (
            <p className="mt-3 text-xs font-bold text-[#3A265E]">{pdfNotice}</p>
          )}
        </div>
      )}
    </div>
  );
};
