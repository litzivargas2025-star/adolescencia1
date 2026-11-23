<?php
require_once "conexion.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mente Adolescente: Explora y Juega</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div id="screen"></div>

  <div class="gamified-bar">
    <div class="gamified-stats">
      <span>Puntos de Empatía / Sabiduría: <strong id="empathy-points">0 pts</strong></span>
      <span>Progreso: <strong id="progress-pct">0%</strong></span>
      <div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div>
    </div>
    <div>
      <?php if (isset($_SESSION["apodo"])): ?>
        <a href="panel_usuario.php" class="btn-pastel btn-mint" style="padding:4px 12px;font-size:0.85rem;">Panel de <?php echo htmlspecialchars($_SESSION["apodo"]); ?></a>
      <?php else: ?>
        <button type="button" class="btn-pastel btn-lemon" data-open-fila="fila3" style="padding:4px 12px;font-size:0.85rem;">Mi Seguimiento MySQL</button>
      <?php endif; ?>
    </div>
  </div>

  <header class="diagonal-header page-blur-target">
    <div class="diagonal-header-inner">
      <nav class="menu">
        <div class="menu-side menu-left">
          <a href="#inicio">Inicio</a>
          <a href="#galeria">Galería</a>
          <a href="#galeria" data-open-details="0">Miedo</a>
        </div>
        <a href="#inicio" class="logo-opening" aria-label="Logo Mente Adolescente">
          <img src="img/logo.svg" alt="Mente Adolescente" style="width:58px;height:58px;">
        </a>
        <div class="menu-side menu-right">
          <a href="#galeria" data-open-details="3">Tristeza</a>
          <a href="#etapas">Etapas</a>
          <a href="#apoyo">Apoyo</a>
        </div>
      </nav>

      <div class="menu-mobile">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <a href="#inicio" class="logo-opening" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:#3A265E;">
            <img src="img/logo.svg" alt="Logo" style="width:40px;height:40px;">
            <span style="font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:800;">MENTE ADOLESCENTE</span>
          </a>
          <button type="button" id="button-open-close-menu" class="btn-pastel btn-pink" style="padding:6px 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3A265E" stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="menu-mobile-items menu-mobile-close">
          <a href="#inicio">Inicio</a>
          <a href="#galeria">Problemáticas y Emociones</a>
          <a href="#galeria" data-open-details="0">Miedo (Fila 1)</a>
          <a href="#galeria" data-open-details="3">Tristeza (Fila 2)</a>
          <a href="#galeria" data-open-details="6">Acceso, Tema y Juegos (Fila 3)</a>
          <a href="#apoyo">Apoyo</a>
        </div>
      </div>
    </div>
  </header>

  <section id="inicio" class="main-video page-blur-target">
    <div class="video">
      <video controls autoplay muted loop playsinline>
        <source src="video/Frases_inspiradoras_sobre_un_paisaje_pintado_720p_dc33cc01.mp4" type="video/mp4">
      </video>
    </div>
  </section>

  <section class="intro page-blur-target">
    <div class="intro-inner">
      <h1 style="font-size:clamp(2.2rem,4vw,3.4rem);text-transform:uppercase;margin-bottom:12px;">La Adolescencia: Cambios y Emociones</h1>
      <p>Una etapa de transformación profunda entre los 13 y 18 años donde el crecimiento personal se encuentra con nuevas emociones, retos académicos y la construcción de vínculos saludables.</p>
    </div>
  </section>

  <!-- CUADRÍCULA 3x3:
       Al presionar cualquier cuadro abre la ventana externa amplia (.details-container) -->
  <section id="galeria" class="skew-grid-band page-blur-target">
    <div class="skew-grid-header">
      <h2 style="font-size:clamp(2rem,4vw,3rem);text-transform:uppercase;">Problemáticas y Emociones</h2>
      <p style="max-width:740px;margin:8px auto 0;font-weight:500;">Haz clic sobre cualquier cuadro para abrir su ventana externa amplia con imágenes nítidas, información completa y botón de cierre (Fila 1: Miedo · Fila 2: Tristeza · Última Fila: Registro, Tema y 5 Juegos).</p>
    </div>

    <div class="grid">
      <div class="item" data-open-details="0">
        <img src="img/miedo.png" alt="Miedo">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Miedo · ¿Qué es y cómo actuar?</h3><p style="color:#B9FBC0;">Fila 1 · Emoción: Miedo</p></div></div>
      </div>
      <div class="item" data-open-details="1">
        <img src="img/1.png" alt="Miedo 1">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Miedo · Estrategias de Regulación</h3><p style="color:#B9FBC0;">Fila 1 · Emoción: Miedo</p></div></div>
      </div>
      <div class="item" data-open-details="2">
        <img src="img/2.png" alt="Miedo 2">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Miedo · Situaciones Cotidianas</h3><p style="color:#B9FBC0;">Fila 1 · Emoción: Miedo</p></div></div>
      </div>
      <div class="item" data-open-details="3">
        <img src="img/tristeza.png" alt="Tristeza">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Tristeza · Validación y Sentido</h3><p style="color:#B9FBC0;">Fila 2 · Emoción: Tristeza</p></div></div>
      </div>
      <div class="item" data-open-details="4">
        <img src="img/5.png" alt="Tristeza 5">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Tristeza · Estrategias de Alivio</h3><p style="color:#B9FBC0;">Fila 2 · Emoción: Tristeza</p></div></div>
      </div>
      <div class="item" data-open-details="5">
        <img src="img/6.png" alt="Tristeza 6">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Tristeza · Situaciones y Apoyo</h3><p style="color:#B9FBC0;">Fila 2 · Emoción: Tristeza</p></div></div>
      </div>
      <div class="item" data-open-details="6">
        <img src="assets/aistudio/image_e825220e.png" alt="Registro y Acceso">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Registro, Acceso y Certificado</h3><p style="color:#B9FBC0;">Última Fila · Ventanas MySQL</p></div></div>
      </div>
      <div class="item" data-open-details="7">
        <img src="assets/aistudio/image_24a96a09.png" alt="Explora el Tema">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Explora el Tema Adolescente</h3><p style="color:#B9FBC0;">Última Fila · 6 Temas Clave</p></div></div>
      </div>
      <div class="item" data-open-details="8">
        <img src="assets/aistudio/image_a917772b.png" alt="Los 5 Minijuegos">
        <div class="bg-hover"><div class="info"><h3 style="color:#FDFFB6;font-size:1.8rem;">Los 5 Minijuegos Interactivos</h3><p style="color:#B9FBC0;">Última Fila · Juega y Aprende</p></div></div>
      </div>
    </div>
  </section>

  <!-- DIMENSIONES DEL CAMBIO (.about-band / .columns) -->
  <section id="etapas" class="about-band page-blur-target">
    <div class="about-inner">
      <h2 style="font-size:clamp(2rem,4vw,3rem);text-align:center;text-transform:uppercase;margin-bottom:32px;">Dimensiones del Cambio</h2>
      <div class="columns">
        <article class="dim-card"><h3>CAMBIOS FÍSICOS</h3><p>Desarrollo acelerado, maduración biológica y adaptación a una nueva imagen corporal que requiere aceptación y acompañamiento saludable.</p></article>
        <article class="dim-card"><h3>CAMBIOS COGNITIVOS</h3><p>Surgimiento del pensamiento abstracto, juicio crítico, búsqueda de autonomía y cuestionamiento de normas establecidas.</p></article>
        <article class="dim-card"><h3>CAMBIOS PSICOSOCIALES</h3><p>Construcción de la identidad, necesidad de pertenencia al grupo de pares e intensidad en la vivencia afectiva.</p></article>
      </div>
    </div>
  </section>

  <!-- CONTACTO / ORIENTACIÓN (.contact-band) -->
  <section id="apoyo" class="contact-band page-blur-target">
    <div class="contact-inner">
      <h2 style="color:var(--pastel-pink);font-size:clamp(2rem,4vw,3rem);text-transform:uppercase;margin-bottom:32px;">Orientación y Acompañamiento</h2>
      <div class="columns">
        <div><h3 style="color:var(--pastel-lemon);">ESPACIOS SEGUROS</h3><p>Departamento de Orientación Educativa</p><p>Tutoría y Bienestar Estudiantil</p></div>
        <div><h3 style="color:var(--pastel-lemon);">COMUNIDAD</h3><p>Escucha activa · Empatía · Apoyo escolar</p></div>
        <div><h3 style="color:var(--pastel-lemon);">CONTACTO ESCOLAR</h3><p>orientacion@mente-adolescente.edu</p><p>apoyo.emocional@mente-adolescente.edu</p></div>
      </div>
    </div>
  </section>

  <footer class="footer-corner">
    <p style="font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:800;">MENTE ADOLESCENTE: EXPLORA Y JUEGA</p>
  </footer>

  <!-- VENTANA REGISTRO E INICIO DE SESIÓN (ABIERTA DESDE LA ÚLTIMA FILA) -->
  <div id="modal-fila3" class="fila-modal-overlay">
    <div class="fila-modal-shell">
      <div class="fila-modal-topbar">
        <h2 style="font-size:2rem;text-transform:uppercase;">Registro, Acceso y Certificado (PHP + MySQL)</h2>
        <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-fila3">✕ Cerrar</button>
      </div>
      <div class="fila-modal-body" style="background:linear-gradient(135deg,#FFD6A5,#FDFFB6);">
        <?php if (!$db_disponible): ?>
          <div class="alert-pastel alert-error" style="margin-bottom:16px;">
            <?php echo htmlspecialchars($db_error_msg !== "" ? $db_error_msg : "Inicia MySQL en XAMPP para guardar registros en MySQL. La página y todos los juegos siguen funcionando con normalidad."); ?>
          </div>
        <?php endif; ?>
        <div class="two-cols">
          <div class="pastel-card">
            <h3>Base de Datos 1 · db_registro_adolescente</h3>
            <form method="POST" action="registrar.php" class="pastel-form">
              <label>Nombre completo<input type="text" name="nombre_completo" required></label>
              <div class="form-row-2">
                <label>Apodo<input type="text" name="apodo" required></label>
                <label>Edad (13-18)<input type="number" name="edad" min="13" max="18" value="15" required></label>
              </div>
              <label>Correo<input type="email" name="correo" required></label>
              <label>Contraseña<input type="password" name="password" required minlength="4"></label>
              <label>Emoción a trabajar
                <select name="emocion_frecuente">
                  <option value="Miedo">Miedo</option>
                  <option value="Tristeza">Tristeza</option>
                  <option value="Ansiedad">Ansiedad</option>
                  <option value="Enojo">Enojo</option>
                  <option value="Inseguridad">Inseguridad</option>
                </select>
              </label>
              <label>Situación actual<textarea name="situacion_actual" rows="2" required></textarea></label>
              <button type="submit" class="btn-pastel btn-mint">Registrarme en MySQL</button>
            </form>
          </div>
          <div class="pastel-card" style="background:var(--soft-sky);">
            <h3>Base de Datos 2 · db_seguimiento_emocional</h3>
            <form method="POST" action="login.php" class="pastel-form">
              <label>Correo registrado<input type="email" name="correo" required placeholder="sofia@mente.edu"></label>
              <label>Contraseña<input type="password" name="password" required placeholder="123456"></label>
              <button type="submit" class="btn-pastel btn-pink">Entrar a Seguimiento y Certificado</button>
            </form>
          </div>
        </div>
        <div class="motivational-big-card">
          <h3>Card Motivacional del Día</h3>
          <p id="frase-grande-texto">“Sé tú, sin pedir permiso. Tu valor nace de quién eres, no de agradar a todos.”</p>
          <div style="margin-top:16px;"><button type="button" id="btn-otra-frase" class="btn-pastel btn-lemon">Mostrar otra frase inspiradora</button></div>
        </div>
        <div style="margin-top:16px;text-align:right;">
          <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-fila3">✕ Cerrar ventana</button>
        </div>
      </div>
    </div>
  </div>

  <!-- VENTANA EXPLORA EL TEMA (ABIERTA DESDE LA ÚLTIMA FILA) -->
  <div id="modal-tema" class="fila-modal-overlay">
    <div class="fila-modal-shell">
      <div class="fila-modal-topbar">
        <h2 style="font-size:2rem;text-transform:uppercase;">Explora el Tema · Psicología en la Adolescencia</h2>
        <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-tema">✕ Cerrar</button>
      </div>
      <div class="fila-modal-body" style="background:linear-gradient(135deg,#A2D2FF,#CDB4DB);">
        <div class="columns" style="flex-wrap:wrap;">
          <article class="pastel-card" style="min-width:260px;"><img src="img/img1.svg" alt="Identidad" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>11. Identidad Propia</h3><p>Construir tu voz auténtica entre los 13 y 18 años sin copias.</p></article>
          <article class="pastel-card" style="min-width:260px;"><img src="img/img2.svg" alt="Autoestima" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>12. Autoestima Sana</h3><p>Tratarte con el mismo respeto con el que tratas a tu mejor amistad.</p></article>
          <article class="pastel-card" style="min-width:260px;"><img src="img/img3.svg" alt="Límites" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>13. Límites y Presión</h3><p>Decir no con respeto protege tu salud mental frente a presiones.</p></article>
          <article class="pastel-card" style="min-width:260px;"><img src="img/img4.svg" alt="Estrés" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>14. Regulación del Estrés</h3><p>Notar qué sientes en tu cuerpo y elegir una respuesta que te cuide.</p></article>
          <article class="pastel-card" style="min-width:260px;"><img src="img/img5.svg" alt="Resiliencia" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>15. Resiliencia</h3><p>Aprender de los tropiezos y crecer apoyándote en personas seguras.</p></article>
          <article class="pastel-card" style="min-width:260px;"><img src="img/img6.svg" alt="Redes" style="width:100%;height:140px;object-fit:cover;border-radius:10px;"><h3>16. Redes Sociales</h3><p>Cuidar tu paz mental frente a comparaciones irreales en pantalla.</p></article>
        </div>
        <div style="margin-top:16px;text-align:right;">
          <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-tema">✕ Cerrar ventana</button>
        </div>
      </div>
    </div>
  </div>

  <!-- VENTANA LOS 5 MINIJUEGOS (ABIERTA DESDE LA ÚLTIMA FILA) -->
  <div id="modal-fila4" class="fila-modal-overlay">
    <div class="fila-modal-shell">
      <div class="fila-modal-topbar">
        <h2 style="font-size:2rem;text-transform:uppercase;">Los 5 Minijuegos Interactivos</h2>
        <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-fila4">✕ Cerrar</button>
      </div>
      <div class="fila-modal-body" style="background:linear-gradient(135deg,#B9FBC0,#DFD2F2);">
        <div class="game-section">
          <h3>1. Cards: Herramientas Emocionales (Arrastra o Selecciona para Inspeccionar)</h3>
          <p id="toolkit-status" style="font-weight:600;margin-top:4px;">Arrastra la ficha superior hacia tu Caja de Herramientas o haz clic para inspeccionarla.</p>
          <div class="toolkit-board">
            <div class="deck-box">
              <h4 style="font-size:1.35rem;margin-bottom:8px;">Mazo de Herramientas</h4>
              <div id="toolkit-deck-area"></div>
            </div>
            <div id="toolkit-drop-panel" class="drop-panel">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
                <h4 style="font-size:1.35rem;">Tu Caja de Herramientas</h4>
                <button type="button" id="toolkit-reset-btn" class="btn-pastel btn-peach" style="padding:5px 12px;font-size:0.8rem;">Reiniciar</button>
              </div>
              <div id="toolkit-placed-list"></div>
            </div>
          </div>
          <div id="toolkit-complete-banner" style="display:none;margin-top:16px;background:var(--pastel-lemon);border:3px solid var(--primary-color);border-radius:18px;padding:18px;">
            <h4 style="font-size:1.6rem;">¡Felicitaciones! Has completado tu Mapa de Recursos Emocionales</h4>
            <p style="margin-top:6px;">Integraste todas las herramientas para afrontar retos cotidianos en la adolescencia (13–18 años).</p>
          </div>
        </div>

        <div class="game-section">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center;">
            <h3>2. Sopa de Letras Emocional (12×12)</h3>
            <div style="display:flex;gap:8px;">
              <button type="button" id="ws-hint-btn" class="btn-pastel btn-peach" style="padding:5px 12px;font-size:0.8rem;">Pista</button>
              <button type="button" id="ws-reset-btn" class="btn-pastel btn-pink" style="padding:5px 12px;font-size:0.8rem;">Reiniciar</button>
            </div>
          </div>
          <p id="ws-status" style="margin-top:6px;font-weight:600;">Arrastra desde la primera hasta la última letra (o clic en inicio y fin) en horizontal, vertical o diagonal.</p>
          <div class="wordsearch-wrap">
            <div id="ws-grid" class="ws-grid-12"></div>
            <div><strong>Palabras (10):</strong><ul id="ws-words" style="margin-top:8px;padding-left:20px;font-weight:700;"></ul></div>
          </div>
        </div>

        <div class="game-section">
          <h3>3. La Ruleta de Situaciones y Decisiones</h3>
          <div class="wheel-wrap">
            <div style="text-align:center;">
              <svg id="wheel-svg" class="wheel-svg" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="114" fill="#CDB4DB" stroke="#3A265E" stroke-width="5"/>
                <path d="M120,120 L120,6 A114,114 0 0,1 234,120 Z" fill="#FFAFCC" stroke="#3A265E" stroke-width="3"/>
                <path d="M120,120 L234,120 A114,114 0 0,1 120,234 Z" fill="#B9FBC0" stroke="#3A265E" stroke-width="3"/>
                <path d="M120,120 L120,234 A114,114 0 0,1 6,120 Z" fill="#A2D2FF" stroke="#3A265E" stroke-width="3"/>
                <path d="M120,120 L6,120 A114,114 0 0,1 120,6 Z" fill="#FDFFB6" stroke="#3A265E" stroke-width="3"/>
                <text x="166" y="74" text-anchor="middle" fill="#3A265E" font-size="13" font-weight="800">REDES</text>
                <text x="166" y="174" text-anchor="middle" fill="#3A265E" font-size="13" font-weight="800">ESCUELA</text>
                <text x="72" y="174" text-anchor="middle" fill="#3A265E" font-size="13" font-weight="800">EMOCIÓN</text>
                <text x="72" y="74" text-anchor="middle" fill="#3A265E" font-size="13" font-weight="800">LÍMITES</text>
                <circle cx="120" cy="120" r="24" fill="#3A265E"/>
                <circle cx="120" cy="120" r="11" fill="#FDFFB6"/>
              </svg>
              <div style="margin-top:12px;"><button type="button" id="spin-wheel-btn" class="btn-pastel btn-pink">Girar la Ruleta</button></div>
            </div>
            <div id="ruleta-inline-panel" class="ruleta-question-box"></div>
          </div>
        </div>

        <div class="game-section">
          <h3>4. Mapa Corporal de las Emociones</h3>
          <div class="body-map-grid">
            <svg viewBox="0 0 200 320" style="width:100%;max-width:220px;">
              <circle cx="100" cy="46" r="28" fill="#FFD6A5" stroke="#3A265E" stroke-width="4" data-body-zone="cabeza" style="cursor:pointer;"/>
              <rect x="52" y="84" width="96" height="42" rx="16" fill="#FFAFCC" stroke="#3A265E" stroke-width="4" data-body-zone="hombros" style="cursor:pointer;"/>
              <rect x="62" y="130" width="76" height="52" rx="14" fill="#A2D2FF" stroke="#3A265E" stroke-width="4" data-body-zone="pecho" style="cursor:pointer;"/>
              <rect x="66" y="186" width="68" height="56" rx="14" fill="#CDB4DB" stroke="#3A265E" stroke-width="4" data-body-zone="estomago" style="cursor:pointer;"/>
            </svg>
            <div class="pastel-card"><h4 id="body-zone-title">Haz clic en una zona del cuerpo</h4><p id="body-zone-desc">Descubre dónde se sienten las emociones.</p><p id="body-zone-ex" style="margin-top:10px;font-weight:700;"></p></div>
          </div>
        </div>

        <div class="game-section">
          <h3>5. Chat Simulado de Toma de Decisiones</h3>
          <p style="margin-bottom:10px;">Confianza del amigo: <strong id="chat-trust">50%</strong></p>
          <div id="chat-box" class="chat-box"></div>
          <div id="chat-choices" class="auth-actions"></div>
        </div>

        <div style="margin-top:16px;text-align:right;">
          <button type="button" class="btn-pastel btn-pink" data-close-fila="modal-fila4">✕ Cerrar ventana</button>
        </div>
      </div>
    </div>
  </div>

  <!-- VENTANA EXTERNA AMPLIA DE CADA CUADRO (.details-container estilo imagen) -->
  <div class="details-container">
    <div class="nav-bar">
      <div style="display:flex;justify-content:flex-start;">
        <span id="details-counter" style="font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;color:#3A265E;background:#FDFFB6;border:2px solid #3A265E;border-radius:10px;padding:4px 12px;">01 / 09</span>
      </div>
      <div style="display:flex;gap:18px;justify-content:center;align-items:center;">
        <button type="button" id="prev-button" aria-label="Anterior" style="padding:6px;"><span class="material-icons" style="font-size:34px;">chevron_left</span></button>
        <button type="button" id="next-button" aria-label="Siguiente" style="padding:6px;"><span class="material-icons" style="font-size:34px;">chevron_right</span></button>
      </div>
      <div style="display:flex;justify-content:flex-end;">
        <button type="button" id="close-button" class="btn-pastel btn-pink" style="padding:6px 14px;font-size:0.85rem;"><span class="material-icons">close</span> Cerrar</button>
      </div>
    </div>

    <div class="details-card">
      <div class="details-slide">
        <img src="img/miedo.png" alt="Miedo">
        <h3 style="font-size:2.2rem;">01. Emoción: Miedo (Definición y Alerta)</h3>
        <div class="columns" style="margin-top:16px;text-align:left;">
          <div class="pastel-card"><strong>Definición</strong><p>Alarma natural ante amenazas físicas o sociales (rechazo, burla o error).</p></div>
          <div class="pastel-card"><strong>Cómo actuar</strong><p>Detente, nombra en voz baja lo que sientes y evita huir impulsivamente.</p></div>
          <div class="pastel-card"><strong>Importancia</strong><p>Protege tu seguridad, cuida tus límites personales y te prepara ante retos.</p></div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="img/1.png" alt="Miedo Estrategias">
        <h3 style="font-size:2.2rem;">02. Miedo al Juicio Social · Estrategias</h3>
        <div class="columns" style="margin-top:16px;text-align:left;">
          <div class="pastel-card"><strong>Respiración 4-7-8</strong><p>Inhala 4 segundos, sostén 7 segundos y exhala suave en 8 segundos.</p></div>
          <div class="pastel-card"><strong>Anclaje 5-4-3-2-1</strong><p>Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 aromas y 1 sensación.</p></div>
          <div class="pastel-card"><strong>Exposición gradual</strong><p>Divide el reto que asusta en pasos pequeños y alcanzables.</p></div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="img/2.png" alt="Miedo Situaciones">
        <h3 style="font-size:2.2rem;">03. Miedo en la Adolescencia (Situaciones y Señales)</h3>
        <p style="margin-top:10px;font-weight:600;">Exponer frente al grupo, miedo a no encajar en redes, exámenes decisivos o decepcionar.</p>
        <div class="two-cols" style="margin-top:16px;text-align:left;">
          <div class="pastel-card" style="display:flex;align-items:center;gap:14px;">
            <img src="img/3.png" alt="Señales físicas" style="width:92px;height:92px;margin:0;object-fit:cover;">
            <div><strong>Señales Físicas (3.png)</strong><p>Tensión en manos o estómago avisan que necesitas respirar lento.</p></div>
          </div>
          <div class="pastel-card" style="display:flex;align-items:center;gap:14px;background:var(--pastel-lemon);">
            <img src="img/4.svg" alt="Miedo al error" style="width:92px;height:92px;margin:0;object-fit:cover;">
            <div><strong>Miedo al Error (4.svg)</strong><p>Equivocarse frente al grupo es parte natural del aprendizaje.</p></div>
          </div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="img/tristeza.png" alt="Tristeza">
        <h3 style="font-size:2.2rem;">04. Emoción: Tristeza (Validación y Sentido)</h3>
        <div class="columns" style="margin-top:16px;text-align:left;">
          <div class="pastel-card"><strong>Definición</strong><p>Respuesta natural ante pérdidas, cambios, decepciones o desgaste acumulado.</p></div>
          <div class="pastel-card"><strong>Cómo actuar</strong><p>Valida lo que duele sin forzarte a sonreír y desahógate en un lugar seguro.</p></div>
          <div class="pastel-card"><strong>Importancia</strong><p>Permite cerrar ciclos, fortalece la empatía y pide apoyo o consuelo.</p></div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="img/5.png" alt="Tristeza Alivio">
        <h3 style="font-size:2.2rem;">05. Lágrimas y Estrategias de Alivio</h3>
        <div class="columns" style="margin-top:16px;text-align:left;">
          <div class="pastel-card"><strong>Escritura expresiva</strong><p>Anota 15 minutos qué te dolió sin preocuparte por la ortografía.</p></div>
          <div class="pastel-card"><strong>Co-regulación</strong><p>Conversa con una amistad leal, familiar u orientador escolar.</p></div>
          <div class="pastel-card"><strong>Micro-autocuidado</strong><p>Hidrátate, camina con luz natural o escucha música suave.</p></div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="img/6.png" alt="Tristeza Apoyo">
        <h3 style="font-size:2.2rem;">06. Tristeza · Situaciones y Red de Apoyo</h3>
        <p style="margin-top:10px;font-weight:600;">Ruptura de amistad o primer amor, mudanza, notas bajas tras mucho esfuerzo o conflictos en casa.</p>
        <div class="two-cols" style="margin-top:16px;text-align:left;">
          <div class="pastel-card" style="display:flex;align-items:center;gap:14px;">
            <img src="img/7.png" alt="Cuándo pedir ayuda" style="width:92px;height:92px;margin:0;object-fit:cover;">
            <div><strong>Cuándo Pedir Ayuda (7.png)</strong><p>Si el desánimo dura semanas, hablar con orientación es valentía.</p></div>
          </div>
          <div class="pastel-card" style="display:flex;align-items:center;gap:14px;background:var(--pastel-mint);">
            <img src="img/8.svg" alt="Esperanza compartida" style="width:92px;height:92px;margin:0;object-fit:cover;">
            <div><strong>Esperanza (8.svg)</strong><p>Compartir lo que pesa con una red segura lo vuelve más ligero.</p></div>
          </div>
        </div>
      </div>
      <div class="details-slide item-hide">
        <img src="assets/aistudio/image_e825220e.png" alt="Registro y Acceso">
        <h3 style="font-size:2.2rem;">07. Registro, Acceso y Certificado (MySQL)</h3>
        <p style="margin:10px 0 16px;">Accede a las bases de datos <strong>db_registro_adolescente</strong> y <strong>db_seguimiento_emocional</strong>, guarda tu progreso y genera tu certificado.</p>
        <button type="button" class="btn-pastel btn-mint" data-open-fila="fila3">Abrir Registro, Acceso y Certificado →</button>
      </div>
      <div class="details-slide item-hide">
        <img src="assets/aistudio/image_24a96a09.png" alt="Explora el Tema">
        <h3 style="font-size:2.2rem;">08. Explora el Tema (Adolescencia 13–18 años)</h3>
        <p style="margin:10px 0 16px;">Identidad propia, autoestima sana, límites ante presión grupal, regulación del estrés, resiliencia y redes sociales.</p>
        <button type="button" class="btn-pastel btn-lemon" data-open-fila="tema">Abrir las 6 Tarjetas de Explora el Tema →</button>
      </div>
      <div class="details-slide item-hide">
        <img src="assets/aistudio/image_a917772b.png" alt="Los 5 Minijuegos">
        <h3 style="font-size:2.2rem;">09. Los 5 Minijuegos Interactivos</h3>
        <p style="margin:10px 0 16px;">Cards apiladas e inspección modal, Sopa de Letras 12×12, Ruleta de Decisiones, Mapa Corporal y Chat Simulado.</p>
        <button type="button" class="btn-pastel btn-mint" data-open-fila="fila4">Abrir Los 5 Minijuegos Interactivos →</button>
      </div>
      <div style="margin-top:20px;text-align:right;">
        <button type="button" id="close-button-bottom" class="btn-pastel btn-pink">✕ Cerrar ventana grande</button>
      </div>
    </div>
  </div>

  <!-- MODAL DE INSPECCIÓN DE FICHA -->
  <div id="toolkit-inspection-modal" class="inspection-backdrop">
    <div id="toolkit-inspection-card" class="inspection-card"></div>
  </div>

  <div id="perfil-desbloqueado-modal" class="blur-active-backdrop">
    <div class="focus-modal-card" style="text-align:center;">
      <h2>¡Perfil Psicológico Desbloqueado!</h2>
      <p style="margin:12px 0;">Completaste todas las dinámicas de Mente Adolescente.</p>
      <div class="auth-actions" style="justify-content:center;">
        <a href="certificado.php" class="btn-pastel btn-mint">Ir a mi Certificado</a>
        <button type="button" class="btn-pastel btn-pink" id="close-perfil-modal">✕ Cerrar</button>
      </div>
    </div>
  </div>

  <script src="js/main.js"></script>
</body>
</html>
