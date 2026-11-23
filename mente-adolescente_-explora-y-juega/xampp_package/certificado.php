<?php
require_once "conexion.php";

if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit;
}

$uid = intval($_SESSION["usuario_id"]);
$plan = null;
if ($db_disponible && $conn_seguimiento) {
    $stmt = $conn_seguimiento->prepare("SELECT * FROM plan_bienestar WHERE usuario_id = ? LIMIT 1");
    if ($stmt) {
        $stmt->bind_param("i", $uid);
        $stmt->execute();
        $plan = $stmt->get_result()->fetch_assoc();
        $stmt->close();
    }
}

$emocion = $plan["emocion_a_trabajar"] ?? ($_SESSION["emocion_frecuente"] ?? "Miedo");
$codigo = $plan["codigo_certificado"] ?? ("MA-" . date("Y") . "-" . str_pad((string)$uid, 4, "0", STR_PAD_LEFT));
$frase = $plan["frase_motivacional"] ?? "Sé tú, sin pedir permiso.";
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado Personalizado — Mente Adolescente</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <main class="cert-page">
    <div class="cert-toolbar">
      <button type="button" id="btn-guardar-cert-pdf" class="btn-pastel btn-mint">Guardar Certificado en PDF</button>
      <a href="panel_usuario.php" class="btn-pastel btn-pink">Volver a mi panel</a>
      <a href="index.php?motivacion=1" class="btn-pastel btn-lavender">Ir al inicio</a>
    </div>

    <section class="certificate-sheet">
      <div class="cert-border">
        <img src="img/logo.svg" alt="Emblema Mente Adolescente" class="cert-logo">
        <p class="cert-kicker">Mente Adolescente: Explora y Juega</p>
        <h1>Certificado Personalizado de Sabiduría Emocional</h1>
        <p class="cert-intro">Se otorga el presente reconocimiento a:</p>
        <h2 class="cert-name"><?php echo htmlspecialchars($_SESSION["nombre_completo"]); ?></h2>
        <p class="cert-body">
          Por su compromiso en explorar, comprender y transformar la emoción de
          <strong><?php echo htmlspecialchars($emocion); ?></strong>, aplicando estrategias saludables de regulación,
          empatía y toma de decisiones conscientes.
        </p>
        <blockquote class="cert-quote">“<?php echo htmlspecialchars($frase); ?>”</blockquote>
        <div class="cert-footer">
          <span>Código: <?php echo htmlspecialchars($codigo); ?></span>
          <span>Fecha: <?php echo date("d/m/Y"); ?></span>
        </div>
      </div>
    </section>
  </main>
  <script src="js/pdf_local.js"></script>
  <script>
    document.getElementById("btn-guardar-cert-pdf").addEventListener("click", function () {
      window.guardarCertificadoLocalPDF({
        nombre: <?php echo json_encode($_SESSION["nombre_completo"]); ?>,
        emocion: <?php echo json_encode($emocion); ?>,
        frase: <?php echo json_encode($frase); ?>,
        codigo: <?php echo json_encode($codigo); ?>,
        fecha: <?php echo json_encode(date("d/m/Y")); ?>
      });
    });
  </script>
</body>
</html>
