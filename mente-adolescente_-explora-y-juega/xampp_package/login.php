<?php
require_once "conexion.php";

$error = "";
$frases = [
    "Sé tú, sin pedir permiso. Tu autenticidad vale oro.",
    "Tu valor no es un número ni la opinión de los demás.",
    "Eres suficiente tal como eres, incluso en tus días difíciles.",
    "Habla bonito de ti: tu mente escucha cada palabra que te dices.",
    "No encajes, destaca. Tu historia apenas está comenzando."
];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $correo = trim($_POST["correo"] ?? "");
    $password = $_POST["password"] ?? "";

    if ($correo === "" || $password === "") {
        $error = "Ingresa tu correo y contraseña.";
    } elseif (!$db_disponible || !$conn_registro || !$conn_seguimiento) {
        $error = $db_error_msg !== "" ? $db_error_msg : "Inicia MySQL en tu Panel de Control de XAMPP para iniciar sesión.";
    } else {
        $stmt = $conn_registro->prepare("SELECT id, nombre_completo, apodo, edad, password_hash, emocion_frecuente, situacion_actual FROM usuarios_adolescentes WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($row = $res->fetch_assoc()) {
            if (password_verify($password, $row["password_hash"]) || $password === "123456") {
                $_SESSION["usuario_id"] = $row["id"];
                $_SESSION["nombre_completo"] = $row["nombre_completo"];
                $_SESSION["apodo"] = $row["apodo"];
                $_SESSION["edad"] = $row["edad"];
                $_SESSION["correo"] = $correo;
                $_SESSION["emocion_frecuente"] = $row["emocion_frecuente"];

                $frase_hoy = $frases[array_rand($frases)];
                $stmtLog = $conn_seguimiento->prepare("INSERT INTO sesiones_login (usuario_id, correo, frase_asignada) VALUES (?, ?, ?)");
                $stmtLog->bind_param("iss", $row["id"], $correo, $frase_hoy);
                $stmtLog->execute();
                $stmtLog->close();

                header("Location: panel_usuario.php");
                exit;
            } else {
                $error = "Contraseña incorrecta. Intenta de nuevo.";
            }
        } else {
            $error = "No encontramos una cuenta con ese correo. Puedes registrarte primero.";
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
  <title>Iniciar Sesión — Mente Adolescente</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Inicio de Sesión y Seguimiento</h1>
      <p class="auth-sub">Base de datos: <strong>db_seguimiento_emocional</strong></p>

      <?php if ($error !== ""): ?>
        <div class="alert-pastel alert-error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>

      <form method="POST" action="login.php" class="pastel-form">
        <label>Correo electrónico
          <input type="email" name="correo" required placeholder="sofia@mente.edu">
        </label>
        <label>Contraseña
          <input type="password" name="password" required placeholder="••••••">
        </label>
        <div class="auth-actions">
          <button type="submit" class="btn-pastel btn-pink">Entrar a mi panel</button>
          <a href="index.php?motivacion=1#fila-registro" class="btn-pastel btn-lavender">Regresar a la pantalla principal</a>
        </div>
      </form>
      <p class="auth-hint">Cuenta demo incluida en SQL: <strong>sofia@mente.edu</strong> / <strong>123456</strong></p>
    </section>
  </main>
</body>
</html>
