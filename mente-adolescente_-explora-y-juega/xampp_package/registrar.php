<?php
require_once "conexion.php";

$mensaje = "";
$error = "";
$registrado = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["nombre_completo"] ?? "");
    $apodo = trim($_POST["apodo"] ?? "");
    $edad = intval($_POST["edad"] ?? 15);
    $correo = trim($_POST["correo"] ?? "");
    $password = $_POST["password"] ?? "";
    $emocion = $_POST["emocion_frecuente"] ?? "Miedo";
    $situacion = trim($_POST["situacion_actual"] ?? "");

    if ($nombre === "" || $apodo === "" || $correo === "" || $password === "" || $situacion === "") {
        $error = "Por favor completa todos los campos para crear tu registro emocional.";
    } elseif ($edad < 13 || $edad > 18) {
        $error = "La edad debe estar entre 13 y 18 años.";
    } elseif (!$db_disponible || !$conn_registro || !$conn_seguimiento) {
        $error = $db_error_msg !== "" ? $db_error_msg : "Inicia MySQL en tu Panel de Control de XAMPP para guardar el registro.";
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn_registro->prepare("INSERT INTO usuarios_adolescentes (nombre_completo, apodo, edad, correo, password_hash, emocion_frecuente, situacion_actual) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssissss", $nombre, $apodo, $edad, $correo, $hash, $emocion, $situacion);

        if ($stmt->execute()) {
            $nuevo_id = $stmt->insert_id;
            $plan = obtenerPlanesPorEmocion($emocion);
            $codigo = "MA-" . date("Y") . "-" . str_pad((string)$nuevo_id, 4, "0", STR_PAD_LEFT);

            $stmt2 = $conn_seguimiento->prepare("INSERT INTO plan_bienestar (usuario_id, emocion_a_trabajar, situacion_resolver, estrategia_1, estrategia_2, estrategia_3, como_ser_feliz, frase_motivacional, codigo_certificado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt2->bind_param("issssssss", $nuevo_id, $emocion, $situacion, $plan["e1"], $plan["e2"], $plan["e3"], $plan["felicidad"], $plan["frase"], $codigo);
            $stmt2->execute();
            $stmt2->close();

            $registrado = true;
            $mensaje = "¡Registro guardado con éxito en db_registro_adolescente para {$apodo}!";
        } else {
            $error = "Ese correo ya está registrado o ocurrió un error: " . $conn_registro->error;
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro Emocional — Mente Adolescente</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Registro en Base de Datos 1</h1>
      <p class="auth-sub">Base de datos: <strong>db_registro_adolescente</strong></p>

      <?php if ($error !== ""): ?>
        <div class="alert-pastel alert-error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>

      <?php if ($registrado): ?>
        <div class="alert-pastel alert-ok"><?php echo htmlspecialchars($mensaje); ?></div>
        <p class="auth-note">Ahora puedes regresar a la pantalla principal para recibir tu frase motivacional aleatoria o iniciar sesión en tu panel de seguimiento.</p>
        <div class="auth-actions">
          <a href="index.php?motivacion=1#fila-registro" class="btn-pastel btn-mint">Regresar a la pantalla principal</a>
          <a href="login.php" class="btn-pastel btn-pink">Iniciar sesión ahora</a>
        </div>
      <?php else: ?>
        <form method="POST" action="registrar.php" class="pastel-form">
          <label>Nombre completo
            <input type="text" name="nombre_completo" required placeholder="Ej. Camila Hernández">
          </label>
          <div class="form-row-2">
            <label>Apodo o nombre favorito
              <input type="text" name="apodo" required placeholder="Ej. Cami">
            </label>
            <label>Edad (13 a 18)
              <input type="number" name="edad" min="13" max="18" value="15" required>
            </label>
          </div>
          <label>Correo electrónico
            <input type="email" name="correo" required placeholder="tu.correo@ejemplo.com">
          </label>
          <label>Contraseña
            <input type="password" name="password" required minlength="4" placeholder="Mínimo 4 caracteres">
          </label>
          <label>Emoción que más deseas trabajar
            <select name="emocion_frecuente">
              <option value="Miedo">Miedo</option>
              <option value="Tristeza">Tristeza</option>
              <option value="Ansiedad">Ansiedad</option>
              <option value="Enojo">Enojo</option>
              <option value="Inseguridad">Inseguridad</option>
            </select>
          </label>
          <label>Describe brevemente una situación que te gustaría resolver
            <textarea name="situacion_actual" rows="3" required placeholder="Ej. Me da miedo equivocarme cuando hablo en público..."></textarea>
          </label>
          <div class="auth-actions">
            <button type="submit" class="btn-pastel btn-mint">Guardar registro</button>
            <a href="index.php?motivacion=1#fila-registro" class="btn-pastel btn-lavender">Regresar a la pantalla principal</a>
          </div>
        </form>
      <?php endif; ?>
    </section>
  </main>
</body>
</html>
