<?php
require_once "conexion.php";

if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit;
}

$uid = intval($_SESSION["usuario_id"]);

// Permitir guardar una nueva actividad desde formulario rápido
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["nueva_actividad"]) && $db_disponible && $conn_seguimiento) {
    $act = trim($_POST["nueva_actividad"]);
    $emo = trim($_POST["emocion_trabajada"] ?? $_SESSION["emocion_frecuente"]);
    $det = trim($_POST["detalle_resultado"] ?? "Actividad completada con éxito.");
    $pts = intval($_POST["puntos_empatia"] ?? 25);

    $stmtIns = $conn_seguimiento->prepare("INSERT INTO resultados_emocionales (usuario_id, actividad, puntos_empatia, emocion_trabajada, detalle_resultado) VALUES (?, ?, ?, ?, ?)");
    $stmtIns->bind_param("isiss", $uid, $act, $pts, $emo, $det);
    $stmtIns->execute();
    $stmtIns->close();
}

// Leer plan de bienestar
$plan = null;
if ($db_disponible && $conn_seguimiento) {
    $stmtPlan = $conn_seguimiento->prepare("SELECT * FROM plan_bienestar WHERE usuario_id = ? LIMIT 1");
    if ($stmtPlan) {
        $stmtPlan->bind_param("i", $uid);
        $stmtPlan->execute();
        $plan = $stmtPlan->get_result()->fetch_assoc();
        $stmtPlan->close();
    }
}

if (!$plan) {
    $def = obtenerPlanesPorEmocion($_SESSION["emocion_frecuente"] ?? "Miedo");
    $plan = [
        "emocion_a_trabajar" => $_SESSION["emocion_frecuente"] ?? "Miedo",
        "situacion_resolver" => $def["situacion"],
        "estrategia_1" => $def["e1"],
        "estrategia_2" => $def["e2"],
        "estrategia_3" => $def["e3"],
        "como_ser_feliz" => $def["felicidad"],
        "frase_motivacional" => $def["frase"],
        "codigo_certificado" => "MA-" . date("Y") . "-" . str_pad((string)$uid, 4, "0", STR_PAD_LEFT)
    ];
}

// Leer resultados guardados
$resultados = [];
if ($db_disponible && $conn_seguimiento) {
    $stmtRes = $conn_seguimiento->prepare("SELECT actividad, puntos_empatia, emocion_trabajada, detalle_resultado, fecha_registro FROM resultados_emocionales WHERE usuario_id = ? ORDER BY fecha_registro DESC");
    if ($stmtRes) {
        $stmtRes->bind_param("i", $uid);
        $stmtRes->execute();
        $resultados = $stmtRes->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmtRes->close();
    }
}

$total_puntos = 0;
foreach ($resultados as $r) {
    $total_puntos += intval($r["puntos_empatia"]);
}

$img_emocion = strtolower($plan["emocion_a_trabajar"]) === "tristeza" ? "img/tristeza.png" : "img/miedo.png";
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel Emocional de <?php echo htmlspecialchars($_SESSION["apodo"]); ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <main class="panel-page">
    <header class="panel-header">
      <div>
        <h1>Hola, <?php echo htmlspecialchars($_SESSION["nombre_completo"]); ?> (<?php echo intval($_SESSION["edad"]); ?> años)</h1>
        <p>Seguimiento emocional guardado en <strong>db_seguimiento_emocional</strong> · Puntos de Empatía acumulados: <strong><?php echo $total_puntos; ?> pts</strong></p>
      </div>
      <div class="auth-actions">
        <a href="certificado.php" class="btn-pastel btn-lemon">Ver Certificado Personalizado</a>
        <a href="index.php?motivacion=1" class="btn-pastel btn-lavender">Regresar a la pantalla principal</a>
      </div>
    </header>

    <section class="panel-grid">
      <article class="panel-box panel-focus">
        <h2>Situación a resolver · Emoción a trabajar: <?php echo htmlspecialchars($plan["emocion_a_trabajar"]); ?></h2>
        <p class="panel-lead"><?php echo htmlspecialchars($plan["situacion_resolver"]); ?></p>

        <h3>Estrategias recomendadas para ti</h3>
        <ul class="strategy-list">
          <li><?php echo htmlspecialchars($plan["estrategia_1"]); ?></li>
          <li><?php echo htmlspecialchars($plan["estrategia_2"]); ?></li>
          <li><?php echo htmlspecialchars($plan["estrategia_3"]); ?></li>
        </ul>

        <div class="happy-box">
          <h3>Cómo puedes cultivar tu felicidad</h3>
          <p><?php echo htmlspecialchars($plan["como_ser_feliz"]); ?></p>
        </div>

        <blockquote class="quote-box">
          “<?php echo htmlspecialchars($plan["frase_motivacional"]); ?>”
        </blockquote>
      </article>

      <aside class="panel-box panel-illustration">
        <h3>Ilustración de tu emoción a trabajar</h3>
        <img src="<?php echo $img_emocion; ?>" alt="Ilustración de <?php echo htmlspecialchars($plan["emocion_a_trabajar"]); ?>" class="panel-img">
        <p class="img-caption">Reconocer esta emoción es el primer paso para regularla con calma y empatía.</p>

        <form method="POST" action="panel_usuario.php" class="pastel-form">
          <h3>Registrar nuevo avance emocional</h3>
          <select name="nueva_actividad">
            <option value="Cards Drag & Drop">Cards Drag & Drop</option>
            <option value="Sopa de Letras">Sopa de Letras</option>
            <option value="Ruleta de Situaciones">Ruleta de Situaciones</option>
            <option value="Mapa Corporal">Mapa Corporal</option>
            <option value="Chat Simulado">Chat Simulado</option>
          </select>
          <input type="hidden" name="emocion_trabajada" value="<?php echo htmlspecialchars($plan["emocion_a_trabajar"]); ?>">
          <input type="text" name="detalle_resultado" required placeholder="¿Qué aprendiste hoy sobre ti?">
          <button type="submit" class="btn-pastel btn-mint">Guardar resultado (+25 pts)</button>
        </form>
      </aside>
    </section>

    <section class="panel-box">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
        <h2>Resultados guardados en tu historial</h2>
        <button type="button" id="btn-guardar-tabla-pdf" class="btn-pastel btn-mint">Guardar Tabla Emocional en PDF</button>
      </div>
      <?php if (count($resultados) === 0): ?>
        <p>Aún no has guardado resultados. Completa las dinámicas en la página principal o registra tu primer avance arriba.</p>
      <?php else: ?>
        <table class="pastel-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Emoción</th>
              <th>Puntos</th>
              <th>Reflexión / Resultado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($resultados as $row): ?>
              <tr>
                <td><?php echo htmlspecialchars($row["actividad"]); ?></td>
                <td><?php echo htmlspecialchars($row["emocion_trabajada"]); ?></td>
                <td><?php echo intval($row["puntos_empatia"]); ?> pts</td>
                <td><?php echo htmlspecialchars($row["detalle_resultado"]); ?></td>
                <td><?php echo htmlspecialchars($row["fecha_registro"]); ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </section>
  </main>
  <script src="js/pdf_local.js"></script>
  <script>
    document.getElementById("btn-guardar-tabla-pdf").addEventListener("click", function () {
      window.guardarTablaEmocionalLocalPDF({
        nombre: <?php echo json_encode($_SESSION["nombre_completo"]); ?>,
        emocion: <?php echo json_encode($plan["emocion_a_trabajar"]); ?>,
        resultados: <?php echo json_encode(array_map(function($r) {
          return [
            "actividad" => $r["actividad"],
            "emocion" => $r["emocion_trabajada"],
            "puntos" => intval($r["puntos_empatia"]),
            "detalle" => $r["detalle_resultado"]
          ];
        }, $resultados)); ?>
      });
    });
  </script>
</body>
</html>
